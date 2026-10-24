"""
ReviewSense - Customer Review Intelligence
Flask Web Application & REST API
"""

import os
import io
import re
import json
import logging
from datetime import datetime
from typing import Optional, Dict, Any, Tuple

from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    send_file,
    Response
)
import pandas as pd
from reviewsense import (
    SentimentEngine,
    clean_text,
    get_dashboard_data,
    CURRENT_DATA_PATH,
    SAMPLE_DATA_PATH,
    TRAINING_DATA_PATH,
    METRICS_PATH,
    MODEL_PATH
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("ReviewSenseApp")

app = Flask(__name__, static_folder="static", template_folder="templates")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB max upload

# Initialize NLP Engine once at startup
engine = SentimentEngine()


def get_current_df() -> pd.DataFrame:
    """Load the current working reviews dataset."""
    if os.path.exists(CURRENT_DATA_PATH):
        try:
            df = pd.read_csv(CURRENT_DATA_PATH)
            if "review" in df.columns:
                return df
        except Exception as e:
            logger.warning(f"Error loading {CURRENT_DATA_PATH}: {e}")

    # Fallback to sample dataset if current dataset file does not exist
    if os.path.exists(SAMPLE_DATA_PATH):
        try:
            df = pd.read_csv(SAMPLE_DATA_PATH)
            df.to_csv(CURRENT_DATA_PATH, index=False)
            return df
        except Exception as e:
            logger.warning(f"Error loading {SAMPLE_DATA_PATH}: {e}")

    return pd.DataFrame(columns=["review", "channel", "date"])


def save_current_df(df: pd.DataFrame) -> None:
    """Save dataframe to current reviews path."""
    os.makedirs(os.path.dirname(CURRENT_DATA_PATH), exist_ok=True)
    df.to_csv(CURRENT_DATA_PATH, index=False)


def detect_csv_columns(df: pd.DataFrame) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    """
    Intelligently detect (review_col, channel_col, date_col) from any uploaded CSV dataframe.
    Handles variations like ReviewText, review_text, Comments, feedback, reviewDate, channel, etc.
    Falls back to content-based text column detection if needed.
    """
    columns = list(df.columns)

    # Map normalized_name -> original_column_name
    norm_map = {}
    for col in columns:
        cleaned = re.sub(r'[^a-z0-9]', '', str(col).lower())
        norm_map[cleaned] = col

    # 1. Review text candidates
    review_exact_keys = [
        "review", "reviewtext", "reviews", "reviewbody", "reviewcontent",
        "reviewcomment", "reviewcomments", "reviewdetail", "reviewdetails",
        "reviewdesc", "reviewdescription", "feedback", "feedbacktext",
        "customerfeedback", "userfeedback", "clientfeedback", "comment",
        "comments", "commenttext", "usercomment", "customercomment",
        "text", "body", "content", "message", "messages", "opinion",
        "description", "notes", "statement", "transcript"
    ]

    review_col = None
    for cand in review_exact_keys:
        if cand in norm_map:
            review_col = norm_map[cand]
            break

    # Substring heuristic if no exact candidate match
    if not review_col:
        for norm_name, original_col in norm_map.items():
            if any(term in norm_name for term in ["review", "feedback", "comment", "text"]) and not any(
                ex in norm_name for ex in ["id", "date", "time", "rating", "score", "star", "user", "author", "product", "sku", "url", "email", "phone"]
            ):
                review_col = original_col
                break

    # Content-based heuristic: pick string column with highest average string length (> 15 chars)
    if not review_col:
        best_col = None
        max_avg_len = 0.0
        for col in columns:
            cleaned = re.sub(r'[^a-z0-9]', '', str(col).lower())
            if any(ex in cleaned for ex in ["id", "date", "time", "rating", "score", "user", "product", "sku"]):
                continue
            try:
                series = df[col].dropna().astype(str)
                if len(series) > 0:
                    avg_len = float(series.str.len().mean())
                    if avg_len > 15 and avg_len > max_avg_len:
                        max_avg_len = avg_len
                        best_col = col
            except Exception:
                pass
        if best_col:
            review_col = best_col

    # 2. Channel / Source candidates
    channel_exact_keys = [
        "channel", "channels", "source", "sources", "platform", "platforms",
        "medium", "category", "origin", "feedbackchannel", "reviewchannel",
        "reviewsource", "feedbacksource", "department", "type"
    ]
    channel_col = None
    for cand in channel_exact_keys:
        if cand in norm_map:
            channel_col = norm_map[cand]
            break

    if not channel_col:
        for norm_name, original_col in norm_map.items():
            if any(term in norm_name for term in ["channel", "source", "platform"]):
                channel_col = original_col
                break

    # 3. Date candidates
    date_exact_keys = [
        "date", "reviewdate", "createdat", "createddate", "timestamp", "time",
        "datetime", "postedat", "posteddate", "publishedat", "submissiondate",
        "feedbackdate", "orderdate", "purchasedate"
    ]
    date_col = None
    for cand in date_exact_keys:
        if cand in norm_map:
            date_col = norm_map[cand]
            break

    if not date_col:
        for norm_name, original_col in norm_map.items():
            if any(term in norm_name for term in ["date", "timestamp", "time"]):
                date_col = original_col
                break

    return review_col, channel_col, date_col


# ==============================================================================
# HTML View Routes
# ==============================================================================

@app.route("/")
def index():
    """Render the main ReviewSense application dashboard."""
    return render_template("index.html")


# ==============================================================================
# REST API Endpoints
# ==============================================================================

@app.route("/api/dashboard", methods=["GET"])
def api_dashboard():
    """
    Return aggregate metrics, sentiment trend, channel distribution,
    thematic topics, word frequencies, and review list.
    Supports optional ?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&channel=X filters.
    """
    try:
        df = get_current_df()
        
        # Optional date filtering
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        channel_filter = request.args.get("channel")

        if "date" in df.columns:
            if start_date:
                df = df[df["date"] >= start_date]
            if end_date:
                df = df[df["date"] <= end_date]

        if channel_filter and channel_filter.lower() != "all" and "channel" in df.columns:
            df = df[df["channel"].str.lower() == channel_filter.lower()]

        data = get_dashboard_data(engine, df)
        return jsonify({
            "status": "success",
            "data": data
        }), 200

    except Exception as e:
        logger.error(f"Error in /api/dashboard: {e}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": f"Failed to load dashboard data: {str(e)}"
        }), 500


@app.route("/api/analyze", methods=["POST"])
def api_analyze():
    """
    Predict sentiment for a single review.
    Request body: {"text": "..."}
    """
    try:
        body = request.get_json(silent=True)
        if not body or "text" not in body:
            return jsonify({
                "status": "error",
                "message": "Missing 'text' field in request body."
            }), 400

        text = body.get("text", "")
        if not text or not str(text).strip():
            return jsonify({
                "status": "error",
                "message": "Review text cannot be empty."
            }), 400

        result = engine.predict_one(str(text))
        return jsonify({
            "status": "success",
            "data": result
        }), 200

    except ValueError as ve:
        return jsonify({
            "status": "error",
            "message": str(ve)
        }), 400
    except Exception as e:
        logger.error(f"Error in /api/analyze: {e}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": f"Sentiment analysis failed: {str(e)}"
        }), 500


@app.route("/api/upload", methods=["POST"])
def api_upload():
    """
    Import reviews from a CSV file.
    CSV must contain a 'review' column.
    Optional columns: 'channel', 'date'.
    """
    try:
        if "file" not in request.files:
            return jsonify({
                "status": "error",
                "message": "No file part in the upload request."
            }), 400

        file = request.files["file"]
        if not file or file.filename == "":
            return jsonify({
                "status": "error",
                "message": "No file selected for upload."
            }), 400

        if not file.filename.lower().endswith(".csv"):
            return jsonify({
                "status": "error",
                "message": "Invalid file format. Please upload a standard .csv file."
            }), 400

        # Read CSV with flexible encoding and delimiter detection
        uploaded_df = None
        read_error = None

        for encoding in ["utf-8-sig", "utf-8", "latin-1", "cp1252"]:
            try:
                file.seek(0)
                content = file.read().decode(encoding)
                # First try auto-sniffing delimiter (comma, semicolon, tab)
                try:
                    uploaded_df = pd.read_csv(io.StringIO(content), sep=None, engine="python")
                except Exception:
                    uploaded_df = pd.read_csv(io.StringIO(content))
                if uploaded_df is not None and not uploaded_df.empty:
                    break
            except UnicodeDecodeError as ue:
                read_error = ue
                continue
            except Exception as pe:
                read_error = pe
                continue

        if uploaded_df is None or uploaded_df.empty:
            return jsonify({
                "status": "error",
                "message": f"Could not parse CSV file: {str(read_error) if read_error else 'File appears empty or unreadable.'}"
            }), 400

        # Smart detection of review text, channel, and date columns
        review_col, channel_col, date_col = detect_csv_columns(uploaded_df)

        if not review_col:
            found_cols = ", ".join(f"'{c}'" for c in uploaded_df.columns)
            return jsonify({
                "status": "error",
                "message": (
                    f"CSV must contain a review text column. Found columns: [{found_cols}]. "
                    "Accepted column headers include 'review', 'ReviewText', 'feedback', 'comment', or similar."
                )
            }), 400

        standardized_df = pd.DataFrame()
        standardized_df["review"] = uploaded_df[review_col].fillna("").astype(str).str.strip()
        standardized_df = standardized_df[standardized_df["review"].str.len() > 0]

        if len(standardized_df) == 0:
            return jsonify({
                "status": "error",
                "message": f"Column '{review_col}' contained no valid non-empty review text."
            }), 400

        # Optional channel
        if channel_col and channel_col in uploaded_df.columns:
            standardized_df["channel"] = uploaded_df[channel_col].fillna("Imported").astype(str).str.strip()
            standardized_df["channel"] = standardized_df["channel"].replace("", "Imported")
        else:
            standardized_df["channel"] = "Imported"

        # Optional date with automatic ISO formatting
        today_str = datetime.now().strftime("%Y-%m-%d")
        if date_col and date_col in uploaded_df.columns:
            try:
                parsed_dates = pd.to_datetime(uploaded_df.loc[standardized_df.index, date_col], errors="coerce")
                formatted_dates = parsed_dates.dt.strftime("%Y-%m-%d")
                standardized_df["date"] = formatted_dates.fillna(
                    uploaded_df.loc[standardized_df.index, date_col].astype(str)
                ).replace(["", "nan", "NaT", "None"], today_str)
            except Exception:
                standardized_df["date"] = uploaded_df.loc[standardized_df.index, date_col].fillna(today_str).astype(str)
        else:
            standardized_df["date"] = today_str

        # Save as current active dataset
        save_current_df(standardized_df)

        # Return updated dashboard aggregates
        updated_data = get_dashboard_data(engine, standardized_df)
        return jsonify({
            "status": "success",
            "message": f"Successfully imported {len(standardized_df)} reviews.",
            "imported_count": len(standardized_df),
            "data": updated_data
        }), 200

    except Exception as e:
        logger.error(f"Error in /api/upload: {e}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": f"Upload processing failed: {str(e)}"
        }), 500


@app.route("/api/export", methods=["GET"])
def api_export():
    """
    Download currently active reviews with predicted sentiments and confidence as a CSV file.
    """
    try:
        df = get_current_df()
        if df.empty:
            return jsonify({
                "status": "error",
                "message": "No review records available to export."
            }), 400

        # Predict sentiment for all records
        sentiments, confidences = engine.predict_batch(df["review"].tolist())
        export_df = pd.DataFrame({
            "review": df["review"],
            "sentiment": sentiments,
            "confidence": confidences,
            "channel": df["channel"],
            "date": df["date"]
        })

        output = io.StringIO()
        export_df.to_csv(output, index=False)
        output.seek(0)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"reviewsense_intelligence_{timestamp}.csv"

        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except Exception as e:
        logger.error(f"Error in /api/export: {e}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": f"Export failed: {str(e)}"
        }), 500


@app.route("/api/reset", methods=["POST"])
def api_reset():
    """
    Restore sample starter dataset as the active dataset.
    """
    try:
        if os.path.exists(SAMPLE_DATA_PATH):
            df = pd.read_csv(SAMPLE_DATA_PATH)
            save_current_df(df)
            updated_data = get_dashboard_data(engine, df)
            return jsonify({
                "status": "success",
                "message": f"Restored starter dataset with {len(df)} sample reviews.",
                "data": updated_data
            }), 200
        else:
            return jsonify({
                "status": "error",
                "message": "Sample dataset not found."
            }), 404

    except Exception as e:
        logger.error(f"Error in /api/reset: {e}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": f"Reset failed: {str(e)}"
        }), 500


@app.route("/api/metrics", methods=["GET"])
def api_metrics():
    """
    Return genuine model evaluation metrics computed on held-out test split.
    """
    try:
        metrics = engine.evaluation_metrics
        if not metrics and os.path.exists(METRICS_PATH):
            with open(METRICS_PATH, "r", encoding="utf-8") as f:
                metrics = json.load(f)

        return jsonify({
            "status": "success",
            "data": metrics
        }), 200

    except Exception as e:
        logger.error(f"Error in /api/metrics: {e}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": f"Failed to retrieve model metrics: {str(e)}"
        }), 500


@app.route("/api/health", methods=["GET"])
def api_health():
    """Healthcheck endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "ReviewSense API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }), 200


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
