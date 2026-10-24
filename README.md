# ReviewSense — Customer Review Intelligence

> **Turn customer feedback into meaningful, actionable insights.**  
> An editorial-inspired, production-minded Customer Review Intelligence SaaS platform engineered with Python, Flask, scikit-learn, and an accessible, responsive dashboard.

---

## 1. Project Overview

**ReviewSense** automates the ingestion, preprocessing, classification, and exploratory analysis of multi-channel customer feedback. By pairing natural language processing (NLP) with an editorial dashboard design system, ReviewSense enables product, growth, and customer experience teams to:

- Classify feedback polarity into **Positive**, **Neutral**, and **Negative** with calibrated confidence estimates and multi-class probability vectors.
- Monitor sentiment velocity over time via interactive time-series visualizations.
- Break down feedback volumes and sentiment ratios across inbound channels (Email, Chat, Social Media, Web, App Store).
- Uncover recurring operational themes (e.g., *Product Quality*, *Delivery*, *Customer Service*, *Pricing*, *Reliability*).
- Inspect high-frequency unigram/bigram keywords grouped by sentiment class.
- Manage feedback records in a paginated, filterable, and sortable **Review Explorer** with full-text inspection modals.
- Import custom datasets via CSV upload with client/server validation, and export enriched analytical datasets.
- Inspect real, transparent machine learning evaluation metrics on a held-out test split.

---

## 2. Strict Brand Color Palette & Design System

The application strictly implements the specified brand identity:

```css
:root {
  --color-paper: #F6F4F1;  /* Overall canvas & background */
  --color-stone: #E4DED2;  /* Secondary surfaces, subtle borders, dividers */
  --color-coral: #F95C4B;  /* Primary CTA, active navigation, interactive accents */
  --color-black: #000000;  /* Sidebar, high-contrast typography */
  --color-white: #FFFFFF;  /* Cards, panels, modals, content surfaces */
}
```

### Functional Status Colors
Functional sentiment indicators are strictly separated from core brand colors:
- **Positive:** Green (`#16A34A` / badge bg `#DCFCE7`)
- **Neutral:** Amber (`#D97706` / badge bg `#FEF3C7`)
- **Negative / At Risk:** Coral / Red (`#F95C4B` / badge bg `#FEE2E2`)

### Typography Pairing
- **Headings & Brand Display:** *Newsreader* / *Playfair Display* (Refined editorial serif)
- **Body & Data UI:** *Plus Jakarta Sans* / *Inter* (High-legibility geometric sans-serif)
- **Icons:** Standardized *Lucide Icons* SVG suite

---

## 3. Architecture & Directory Structure

```
CourseMate AI/
├── app.py                     # Flask REST API application & web routes
├── reviewsense.py             # NLP engine: text cleaning, TF-IDF, model inference, analytics
├── train_model.py             # Model training & held-out test split evaluation pipeline
├── requirements.txt           # Pinned production dependencies
├── data/
│   ├── training_data.csv      # Stratified dataset (177 labeled reviews)
│   ├── sample_reviews.csv     # Golden baseline sample reviews (50 multi-channel records)
│   └── current_reviews.csv    # Active working dataset for dashboard & explorer
├── models/
│   ├── model.joblib           # Serialized scikit-learn pipeline (TF-IDF + LogisticRegression)
│   └── evaluation_metrics.json# Genuine evaluation metrics & confusion matrix on test split
├── static/
│   ├── css/
│   │   ├── variables.css      # Brand tokens, color variables, typography & elevation
│   │   ├── main.css           # Core layout, sidebar, topbar, cards, tables, badges
│   │   └── transitions.css    # Micro-animations, toasts, modal backdrops, a11y motion
│   ├── js/
│   │   ├── api.js             # Centralized asynchronous fetch client
│   │   ├── notifications.js   # Accessible toast notification manager
│   │   ├── charts.js          # Chart.js renderers for sentiment trend & donut distribution
│   │   ├── analyzer.js        # Single review interactive inference & probability bars
│   │   ├── explorer.js        # Search, filter, sorting, pagination, and review detail modal
│   │   ├── import-export.js   # Drag-and-drop CSV uploader, CSV export, dataset reset
│   │   └── main.js            # Single-page navigation controller & date-range filters
│   └── favicon.svg            # Custom SVG monogram favicon
├── templates/
│   └── index.html             # Main responsive application template
├── tests/
│   ├── test_nlp.py            # Unit tests for preprocessing, classification, keywords & themes
│   └── test_api.py            # Integration tests for Flask endpoints, uploads & downloads
└── plan file/                 # Preserved original project specifications & design briefs
```

---

## 4. NLP & Machine Learning Engine

### Pipeline Architecture
1. **Text Normalization:**
   - Strips non-standard punctuation and URLs.
   - Preserves sentiment modifiers and punctuation boundaries.
   - Lowercases and strips redundant whitespace.
2. **Feature Extraction:**
   - `TfidfVectorizer` configured with unigrams and bigrams `ngram_range=(1, 2)`.
   - `sublinear_tf=True` for logarithmically scaled term frequencies.
   - Standard English stopwords removed.
3. **Classification Model:**
   - `LogisticRegression` with `class_weight='balanced'` and `max_iter=1000`.
   - Generates calibrated probability distributions across `[Negative, Neutral, Positive]`.
   - Assigns prediction confidence as `max(probabilities)`.

### Genuine Model Evaluation Metrics
*Trained on 132 stratified samples; evaluated on 45 held-out test samples (25% split).*

| Metric | Score | Notes |
|---|---|---|
| **Accuracy** | **75.56%** | Evaluated on held-out test dataset |
| **Macro Precision** | **81.21%** | Balanced across all three sentiment classes |
| **Macro Recall** | **75.15%** | Minimizes false negatives |
| **Macro F1-Score** | **75.62%** | Harmonic mean of precision and recall |

#### Test Split Confusion Matrix
```
               Predicted Negative  Predicted Neutral  Predicted Positive
True Negative         12                   0                  5
True Neutral           2                   8                  3
True Positive          1                   0                 14
```

#### Honest Model Limitations
- Designed primarily for English customer feedback.
- Complex figurative language, double negatives, and domain-specific sarcasm may result in borderline neutral classifications.
- Model retrains easily on larger enterprise datasets via `python train_model.py`.

---

## 5. REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/` | `GET` | Serves the single-page application dashboard |
| `/api/health` | `GET` | Service health status and active model version |
| `/api/dashboard` | `GET` | Aggregated metrics, trend line data, distribution, channels, themes, and word frequencies |
| `/api/analyze` | `POST` | Infers sentiment, confidence, probability breakdown, and cleaned text for a single review |
| `/api/upload` | `POST` | Uploads and analyzes a new CSV file (`multipart/form-data`) |
| `/api/export` | `GET` | Streams analyzed reviews as a downloadable CSV |
| `/api/reset` | `POST` | Restores `current_reviews.csv` to the 50-item sample baseline |
| `/api/metrics` | `GET` | Returns genuine held-out evaluation metrics and confusion matrix |

---

## 6. CSV File Format Specification

The CSV importer features **Smart Column Detection** and automatically recognizes various common schemas:

- **Review Text:** Auto-detects `review`, `ReviewText`, `review_text`, `feedback`, `comment`, `text`, `body`, `message`, or longest text column.
- **Date (Optional):** Auto-detects `date`, `ReviewDate`, `review_date`, `created_at`, `timestamp`. Formats automatically to `YYYY-MM-DD` (defaults to current date if omitted).
- **Channel (Optional):** Auto-detects `channel`, `source`, `platform`, `medium` (defaults to `"Imported"` if omitted).

Supports popular e-commerce datasets such as:
```csv
ReviewID,ProductID,UserID,Rating,ReviewText,ReviewDate
REV-001,PROD-101,USER-77,5,"Outstanding battery life and great build quality.",2026-10-22
```

---

## 7. Installation & Quick Start

### Prerequisites
- Python 3.10 or higher
- Modern web browser (Chrome, Edge, Firefox, Safari)

### 1. Setup Virtual Environment
```bash
# Clone or navigate to the repository
cd "d:\Project\ReviewSense Customer Review Intelligence"

# Create virtual environment
python -m venv .venv
```

**Activate environment:**
- **Windows PowerShell:**
  ```powershell
  .\.venv\Scripts\Activate.ps1
  ```
- **macOS / Linux:**
  ```bash
  source .venv/bin/activate
  ```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. (Optional) Retrain or Re-evaluate Model
```bash
python train_model.py
```

### 4. Launch Application
```bash
python app.py
```
Open **`http://127.0.0.1:5000`** in your browser.

---

## 8. Automated Testing

The project includes unit and integration tests with 100% pass rate:

```bash
# Run pytest with verbose reporting
pytest tests/ -v
```

Tests cover:
- Text preprocessing and normalization edge cases (empty strings, non-ASCII characters).
- Prediction confidence and probability sum validation.
- Operational theme classification and sentiment-grouped word frequency generation.
- Flask endpoint status codes, error validation, CSV upload/export, and dataset resets.

---

## 9. License & Credits

Built as part of the **ReviewSense** product intelligence initiative.
Original planning specifications and product briefs are preserved in `plan file/`.
