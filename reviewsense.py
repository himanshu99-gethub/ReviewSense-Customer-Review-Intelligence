"""
ReviewSense NLP Engine
Core natural language processing, feature extraction, sentiment classification,
theme detection, and analytics aggregation for customer feedback intelligence.
"""

import os
import re
import json
import logging
from typing import Dict, List, Any, Tuple, Optional
import numpy as np
import pandas as pd
import joblib
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

logger = logging.getLogger(__name__)

# Base directory paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_PATH = os.path.join(MODELS_DIR, "model.joblib")
METRICS_PATH = os.path.join(MODELS_DIR, "evaluation_metrics.json")
CURRENT_DATA_PATH = os.path.join(DATA_DIR, "current_reviews.csv")
SAMPLE_DATA_PATH = os.path.join(DATA_DIR, "sample_reviews.csv")
TRAINING_DATA_PATH = os.path.join(DATA_DIR, "training_data.csv")

# Standard English stopwords for clean keyword frequency analysis
STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
    "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt",
    "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt",
    "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres",
    "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if",
    "in", "into", "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most", "mustnt",
    "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
    "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes",
    "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the", "their", "theirs",
    "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre",
    "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
    "wasnt", "we", "wed", "well", "were", "weve", "werent", "what", "whats", "when", "whens",
    "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont",
    "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself",
    "yourselves", "item", "items", "product", "products", "one", "two", "three", "get", "got",
    "even", "also", "just", "like", "really", "much", "still", "make", "made", "take", "took",
    "day", "days", "week", "weeks", "time", "times", "use", "used", "using"
}

# Thematic keyword taxonomy for customer feedback themes
THEMES_TAXONOMY = {
    "Product Quality": [
        "quality", "build", "material", "materials", "sturdy", "durable", "finish",
        "craftsmanship", "plastic", "broke", "broken", "snap", "snapped", "defective",
        "pristine", "scratches", "construction", "flimsy", "damaged"
    ],
    "Delivery & Shipping": [
        "delivery", "shipping", "shipped", "arrived", "package", "packaging", "transit",
        "delayed", "delay", "delays", "box", "logistics", "courier", "received", "tracking"
    ],
    "Customer Service": [
        "support", "service", "representative", "agent", "chat", "email", "ticket",
        "query", "polite", "rude", "care", "unhelpful", "knowledgeable", "call",
        "callback", "response", "assistance", "assisted"
    ],
    "Pricing & Value": [
        "price", "value", "cost", "money", "expensive", "overpriced", "affordable",
        "cheap", "worth", "bargain", "investment", "waste", "roi"
    ],
    "Billing & Subscription": [
        "billing", "charge", "charged", "charges", "subscription", "refund", "fees",
        "fee", "credit card", "renew", "renewed", "checkout", "payment", "hidden"
    ],
    "Software & App": [
        "software", "app", "mobile", "update", "updates", "dashboard", "navigation",
        "interface", "ui", "crash", "crashes", "crashed", "bug", "bugs", "freeze",
        "freezes", "sync", "export", "tool", "analytics"
    ],
    "Product Reliability": [
        "battery", "charge", "charging", "power", "heat", "fan", "noise", "overheating",
        "connection", "sensor", "sensors", "display", "screen", "disconnect", "disconnects",
        "bluetooth", "hardware", "reliable", "reliability", "stability"
    ]
}


def clean_text(text: Optional[str]) -> str:
    """
    Clean and normalize review text:
    - Lowercase
    - Strip URLs and HTML tags
    - Replace non-alphanumeric punctuation with spaces
    - Collapse extra whitespace
    """
    if not text or not isinstance(text, str):
        return ""

    # Lowercase
    cleaned = text.lower().strip()

    # Remove URLs
    cleaned = re.sub(r'https?://\S+|www\.\S+', ' ', cleaned)

    # Remove HTML tags
    cleaned = re.sub(r'<.*?>', ' ', cleaned)

    # Keep only alphanumeric characters and basic spacing
    cleaned = re.sub(r'[^a-z0-9\s]', ' ', cleaned)

    # Collapse multiple spaces into one
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    return cleaned


class SentimentEngine:
    """
    NLP sentiment classification and analytics engine.
    Uses TF-IDF unigram + bigram feature representation and Logistic Regression classifier.
    """

    def __init__(self, model_path: str = MODEL_PATH):
        self.model_path = model_path
        self.pipeline: Optional[Pipeline] = None
        self.classes: List[str] = ["Negative", "Neutral", "Positive"]
        self.evaluation_metrics: Dict[str, Any] = {}
        self.load_or_train()

    def build_pipeline(self) -> Pipeline:
        """Construct TF-IDF + Logistic Regression pipeline."""
        return Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                min_df=1,
                max_features=10000,
                sublinear_tf=True
            )),
            ("clf", LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
                C=1.5,
                random_state=42
            ))
        ])

    def load_or_train(self):
        """Load trained pipeline from disk, or train on training dataset."""
        os.makedirs(MODELS_DIR, exist_ok=True)
        if os.path.exists(self.model_path):
            try:
                self.pipeline = joblib.load(self.model_path)
                logger.info(f"Loaded existing model from {self.model_path}")
                # Load evaluation metrics if available
                if os.path.exists(METRICS_PATH):
                    with open(METRICS_PATH, "r", encoding="utf-8") as f:
                        self.evaluation_metrics = json.load(f)
                return
            except Exception as e:
                logger.warning(f"Failed to load model from {self.model_path}: {e}. Retraining...")

        self.train_and_save()

    def train_and_save(self, training_path: str = TRAINING_DATA_PATH):
        """Train model on training dataset with 80/20 train/test evaluation split."""
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        if not os.path.exists(training_path):
            raise FileNotFoundError(f"Training data not found at {training_path}")

        df = pd.read_csv(training_path)
        if "review" not in df.columns or "sentiment" not in df.columns:
            raise ValueError("Training data must contain 'review' and 'sentiment' columns")

        df = df.dropna(subset=["review", "sentiment"])
        df["cleaned"] = df["review"].apply(clean_text)
        df = df[df["cleaned"].str.len() > 0]

        X = df["cleaned"].tolist()
        y = df["sentiment"].tolist()

        # Split into train and held-out test set
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.25, random_state=42, stratify=y
        )

        pipeline = self.build_pipeline()
        pipeline.fit(X_train, y_train)

        # Evaluate on test set
        y_pred = pipeline.predict(X_test)
        target_names = ["Negative", "Neutral", "Positive"]

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, average="macro", zero_division=0))
        rec = float(recall_score(y_test, y_pred, average="macro", zero_division=0))
        f1 = float(f1_score(y_test, y_pred, average="macro", zero_division=0))

        cm = confusion_matrix(y_test, y_pred, labels=target_names)
        class_dist_train = {k: int(v) for k, v in pd.Series(y_train).value_counts().items()}
        class_dist_test = {k: int(v) for k, v in pd.Series(y_test).value_counts().items()}

        report = classification_report(y_test, y_pred, labels=target_names, output_dict=True, zero_division=0)

        metrics = {
            "model_version": "v1.2-tfidf-logreg",
            "model_type": "TF-IDF (1,2-grams) + Logistic Regression (balanced)",
            "accuracy": round(acc * 100, 2),
            "macro_precision": round(prec * 100, 2),
            "macro_recall": round(rec * 100, 2),
            "macro_f1": round(f1 * 100, 2),
            "total_samples": len(df),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "class_distribution_train": class_dist_train,
            "class_distribution_test": class_dist_test,
            "confusion_matrix": {
                "labels": target_names,
                "matrix": cm.tolist()
            },
            "per_class_metrics": {
                label: {
                    "precision": round(report[label]["precision"] * 100, 2),
                    "recall": round(report[label]["recall"] * 100, 2),
                    "f1_score": round(report[label]["f1-score"] * 100, 2),
                    "support": int(report[label]["support"])
                }
                for label in target_names if label in report
            },
            "training_notes": "Trained on stratified multi-channel customer reviews. Evaluated on 25% held-out test split.",
            "limitations": "Trained primarily on English e-commerce and SaaS feedback. Sarcasm, complex double negatives, and domain jargon may yield ambiguous neutral/negative scores."
        }

        # Train on full dataset for maximum deployment utility
        full_pipeline = self.build_pipeline()
        full_pipeline.fit(X, y)
        self.pipeline = full_pipeline
        self.evaluation_metrics = metrics

        joblib.dump(self.pipeline, self.model_path)
        with open(METRICS_PATH, "w", encoding="utf-8") as f:
            json.dump(metrics, f, indent=2)

        logger.info(f"Model saved to {self.model_path} with test accuracy {metrics['accuracy']}%")

    def predict_one(self, text: str) -> Dict[str, Any]:
        """
        Predict sentiment for a single review string.
        Returns label, confidence, probabilities, and cleaned text.
        """
        if not text or not text.strip():
            raise ValueError("Review text cannot be empty.")

        cleaned = clean_text(text)
        if not cleaned:
            return {
                "sentiment": "Neutral",
                "confidence": 50.0,
                "cleaned_text": "",
                "probabilities": {
                    "Negative": 33.3,
                    "Neutral": 33.4,
                    "Positive": 33.3
                },
                "note": "Input contained only punctuation or symbols."
            }

        probs = self.pipeline.predict_proba([cleaned])[0]
        classes = [str(c) for c in self.pipeline.classes_]

        prob_dict = {
            cls_name: round(float(prob) * 100, 1)
            for cls_name, prob in zip(classes, probs)
        }

        pred_idx = int(np.argmax(probs))
        predicted_sentiment = str(classes[pred_idx])
        confidence = round(float(probs[pred_idx]) * 100, 1)

        return {
            "sentiment": predicted_sentiment,
            "confidence": confidence,
            "cleaned_text": cleaned,
            "probabilities": prob_dict
        }

    def predict_batch(self, texts: List[str]) -> Tuple[List[str], List[float]]:
        """
        Predict sentiment and confidence for a list of review texts.
        """
        cleaned_list = [clean_text(t) for t in texts]
        # Replace empty strings with a neutral placeholder token to avoid vectorizer crashes
        safe_list = [c if c else "neutral" for c in cleaned_list]

        probs = self.pipeline.predict_proba(safe_list)
        classes = [str(c) for c in self.pipeline.classes_]

        sentiments = []
        confidences = []

        for p_row in probs:
            idx = int(np.argmax(p_row))
            sentiments.append(str(classes[idx]))
            confidences.append(round(float(p_row[idx]) * 100, 1))

        return sentiments, confidences


def extract_word_frequency(df: pd.DataFrame, top_n: int = 15) -> Dict[str, List[Dict[str, Any]]]:
    """
    Extract frequently occurring words segmented by sentiment category:
    'All', 'Positive', 'Neutral', 'Negative'.
    """
    results: Dict[str, List[Dict[str, Any]]] = {
        "All": [],
        "Positive": [],
        "Neutral": [],
        "Negative": []
    }

    if df.empty or "review" not in df.columns:
        return results

    categories = [("All", df)]
    if "sentiment" in df.columns:
        for s in ["Positive", "Neutral", "Negative"]:
            sub = df[df["sentiment"] == s]
            categories.append((s, sub))

    for cat_name, sub_df in categories:
        if sub_df.empty:
            results[cat_name] = []
            continue

        words_list = []
        for text in sub_df["review"]:
            cleaned = clean_text(str(text))
            for token in cleaned.split():
                if len(token) > 2 and token not in STOPWORDS:
                    words_list.append(token)

        if not words_list:
            results[cat_name] = []
            continue

        series = pd.Series(words_list).value_counts().head(top_n)
        max_count = int(series.iloc[0]) if not series.empty else 1

        top_words = []
        for word, count in series.items():
            top_words.append({
                "word": str(word),
                "count": int(count),
                "percentage": round((int(count) / max_count) * 100, 1)
            })

        results[cat_name] = top_words

    return results


def extract_themes(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Identify feedback themes based on keyword occurrences and compute their sentiment breakdowns.
    """
    if df.empty or "review" not in df.columns:
        return []

    total_reviews = len(df)
    theme_data = []

    for theme_name, keywords in THEMES_TAXONOMY.items():
        pattern = r'\b(?:' + '|'.join(re.escape(k) for k in keywords) + r')\b'
        mask = df["review"].astype(str).str.contains(pattern, case=False, regex=True, na=False)
        matched_df = df[mask]
        count = len(matched_df)

        if count > 0:
            pos_cnt = int((matched_df["sentiment"] == "Positive").sum()) if "sentiment" in matched_df.columns else 0
            neu_cnt = int((matched_df["sentiment"] == "Neutral").sum()) if "sentiment" in matched_df.columns else 0
            neg_cnt = int((matched_df["sentiment"] == "Negative").sum()) if "sentiment" in matched_df.columns else 0

            theme_data.append({
                "theme": theme_name,
                "count": count,
                "percentage": round((count / total_reviews) * 100, 1) if total_reviews > 0 else 0,
                "sentiment_breakdown": {
                    "Positive": pos_cnt,
                    "Neutral": neu_cnt,
                    "Negative": neg_cnt
                }
            })

    # Sort descending by count
    theme_data.sort(key=lambda x: x["count"], reverse=True)
    return theme_data


def get_dashboard_data(engine: SentimentEngine, df: Optional[pd.DataFrame] = None) -> Dict[str, Any]:
    """
    Compute all dashboard aggregates, summary cards, trend series, channel distributions,
    themes, word frequencies, and review explorer records.
    """
    if df is None:
        if os.path.exists(CURRENT_DATA_PATH):
            df = pd.read_csv(CURRENT_DATA_PATH)
        elif os.path.exists(SAMPLE_DATA_PATH):
            df = pd.read_csv(SAMPLE_DATA_PATH)
        else:
            df = pd.DataFrame(columns=["review", "channel", "date"])

    # Ensure required columns exist
    if "review" not in df.columns:
        df["review"] = []
    if "channel" not in df.columns:
        df["channel"] = "Website"
    if "date" not in df.columns:
        df["date"] = pd.Timestamp.now().strftime("%Y-%m-%d")

    df["review"] = df["review"].fillna("").astype(str)
    df["channel"] = df["channel"].fillna("Website").astype(str)
    df["date"] = df["date"].fillna(pd.Timestamp.now().strftime("%Y-%m-%d")).astype(str)

    # Clean rows
    df = df[df["review"].str.strip().str.len() > 0].copy()

    total_reviews = len(df)
    if total_reviews == 0:
        return {
            "summary": {
                "total": 0,
                "positive": 0,
                "positive_pct": 0.0,
                "neutral": 0,
                "neutral_pct": 0.0,
                "negative": 0,
                "negative_pct": 0.0,
            },
            "sentiment_distribution": {
                "positive": 0,
                "positive_pct": 0.0,
                "neutral": 0,
                "neutral_pct": 0.0,
                "negative": 0,
                "negative_pct": 0.0,
                "total": 0
            },
            "trend": {"dates": [], "positive": [], "neutral": [], "negative": []},
            "channels": [],
            "themes": [],
            "word_frequency": {"All": [], "Positive": [], "Neutral": [], "Negative": []},
            "reviews": []
        }

    # Predict sentiments and confidence if not already present or if new
    sentiments, confidences = engine.predict_batch(df["review"].tolist())
    df["sentiment"] = sentiments
    df["confidence"] = confidences

    # Summary counts
    pos_count = int((df["sentiment"] == "Positive").sum())
    neu_count = int((df["sentiment"] == "Neutral").sum())
    neg_count = int((df["sentiment"] == "Negative").sum())

    pos_pct = round((pos_count / total_reviews) * 100, 1)
    neu_pct = round((neu_count / total_reviews) * 100, 1)
    neg_pct = round((neg_count / total_reviews) * 100, 1)

    # Sentiment trend by date
    # Parse dates safely and sort
    try:
        df["parsed_date"] = pd.to_datetime(df["date"], errors="coerce")
        trend_df = df.dropna(subset=["parsed_date"]).sort_values("parsed_date")
        date_groups = trend_df.groupby([trend_df["parsed_date"].dt.strftime("%Y-%m-%d"), "sentiment"]).size().unstack(fill_value=0)
        
        dates_list = list(date_groups.index)
        trend_pos = [int(date_groups.loc[d].get("Positive", 0)) for d in dates_list]
        trend_neu = [int(date_groups.loc[d].get("Neutral", 0)) for d in dates_list]
        trend_neg = [int(date_groups.loc[d].get("Negative", 0)) for d in dates_list]
    except Exception as e:
        logger.warning(f"Error computing date trend: {e}")
        dates_list, trend_pos, trend_neu, trend_neg = [], [], [], []

    # Channel breakdowns
    channels_data = []
    for ch_name, group in df.groupby("channel"):
        ch_total = len(group)
        ch_pos = int((group["sentiment"] == "Positive").sum())
        ch_neu = int((group["sentiment"] == "Neutral").sum())
        ch_neg = int((group["sentiment"] == "Negative").sum())
        channels_data.append({
            "channel": ch_name,
            "total": ch_total,
            "positive": ch_pos,
            "neutral": ch_neu,
            "negative": ch_neg,
            "positive_pct": round((ch_pos / ch_total) * 100, 1) if ch_total > 0 else 0,
            "neutral_pct": round((ch_neu / ch_total) * 100, 1) if ch_total > 0 else 0,
            "negative_pct": round((ch_neg / ch_total) * 100, 1) if ch_total > 0 else 0,
        })
    channels_data.sort(key=lambda x: x["total"], reverse=True)

    # Themes and Word Frequencies
    themes = extract_themes(df)
    word_freq = extract_word_frequency(df)

    # Review table list (sorted by date descending)
    reviews_list = []
    sorted_df = df.copy()
    if "parsed_date" in sorted_df.columns:
        sorted_df = sorted_df.sort_values("parsed_date", ascending=False)
    
    for idx, row in sorted_df.iterrows():
        reviews_list.append({
            "id": int(idx) if isinstance(idx, (int, np.integer)) else str(idx),
            "review": str(row["review"]),
            "sentiment": str(row["sentiment"]),
            "confidence": float(row["confidence"]),
            "channel": str(row["channel"]),
            "date": str(row["date"])
        })

    return {
        "summary": {
            "total": total_reviews,
            "positive": pos_count,
            "positive_pct": pos_pct,
            "neutral": neu_count,
            "neutral_pct": neu_pct,
            "negative": neg_count,
            "negative_pct": neg_pct
        },
        "sentiment_distribution": {
            "positive": pos_count,
            "positive_pct": pos_pct,
            "neutral": neu_count,
            "neutral_pct": neu_pct,
            "negative": neg_count,
            "negative_pct": neg_pct,
            "total": total_reviews
        },
        "trend": {
            "dates": dates_list,
            "positive": trend_pos,
            "neutral": trend_neu,
            "negative": trend_neg
        },
        "channels": channels_data,
        "themes": themes,
        "word_frequency": word_freq,
        "reviews": reviews_list
    }
