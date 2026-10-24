# Mini Project Report
## On
# **ReviewSense: Customer Review Intelligence**

---

### Submitted by:
**Himanshu**  
**UID:** 25MCI10063  

### Under the guidance of:
**Mrs. Swati Mittal**  
Assistant Professor  
University Institute of Computing (UIC)  

### In partial fulfilment for the award of the degree of:
**MASTER OF COMPUTER APPLICATIONS (AI & ML)**  
**Chandigarh University, Gharuan, Mohali**  

---

<br>

# Bonafide Certificate

This is to certify that **Himanshu** (UID: **25MCI10063**), a bonafide student of **Master of Computer Applications (MCA) – Artificial Intelligence & Machine Learning** at **Chandigarh University**, has successfully completed the Minor Project titled **“ReviewSense: Customer Review Intelligence”** under the esteemed guidance of **Mrs. Swati Mittal**, Assistant Professor, University Institute of Computing (UIC), Chandigarh University.

This project has been undertaken as an integral part of the academic curriculum in partial fulfillment of the requirements for the award of the degree of **Master of Computer Applications (AI & ML)**. The work presented in this project report reflects the student’s independent analytical research, engineering competence, and technical diligence, demonstrating the practical application of Machine Learning, Natural Language Processing (NLP), and Full-Stack Web Development to solve real-world industry problems.

The project, **“ReviewSense: Customer Review Intelligence”**, is an editorial-grade, responsive AI platform engineered to ingest, clean, categorize, and analyze unstructured customer feedback across omnichannel touchpoints (Email, Live Chat, Social Media, Web, App Store). The platform couples a calibrated Natural Language Processing pipeline (**TF-IDF Vectorization + Balanced Logistic Regression**) with an interactive Flask-based REST architecture and responsive data observatory powered by Chart.js.

I hereby certify that this project is an authentic and original work carried out by the student and has not been submitted elsewhere for the award of any other degree, diploma, fellowship, or certificate.

<br>
<br>

**Project Guide:**  
**Mrs. Swati Mittal**  
Assistant Professor  
University Institute of Computing (UIC)  
Chandigarh University  

---

<br>

# Acknowledgement

I would like to express my sincere and deepest gratitude to **Chandigarh University** and the **University Institute of Computing (UIC)** for providing a stimulating learning environment and academic resources to develop the project titled **“ReviewSense: Customer Review Intelligence”**.

I extend my heartfelt appreciation and profound gratitude to my esteemed mentor and project guide, **Mrs. Swati Mittal**, Assistant Professor, for her valuable guidance, constructive feedback, and continuous encouragement throughout the conception, architecture, and deployment phases of this project. Her technical insights and academic mentorship were instrumental in shaping the methodology and quality of this work.

I am deeply thankful to the faculty members of the Department of Computer Applications for imparting the foundational knowledge of Artificial Intelligence, Machine Learning algorithms, and software engineering principles that made this project achievable.

I am also thankful to my peers, friends, and colleagues for their constant encouragement, collaborative discussions, and valuable testing feedback during dataset collection and interface testing.

Lastly, I express my deepest gratitude to my parents and family members for their unconditional support, patience, and moral encouragement throughout my academic journey.

This minor project has been an invaluable learning experience that significantly enriched my practical skills in Applied Machine Learning, Natural Language Processing, RESTful API architecture, and modern human-computer interaction (UI/UX) engineering.

<br>

**Himanshu**  
UID: 25MCI10063  
MCA (AI & ML), Chandigarh University  

---

<br>

# Contents

| S.No | Section | Page / Section Ref |
|:---:|:---|:---:|
| - | **Abstract** | Section 0 |
| 1 | **Introduction** | Section 1 |
| | 1.1 Background & Context | 1.1 |
| | 1.2 Problem Statement | 1.2 |
| | 1.3 Objectives of the Project | 1.3 |
| | 1.4 Target Audience & Practical Utility | 1.4 |
| 2 | **Tools and Technologies Used** | Section 2 |
| | 2.1 Programming Languages & Core Runtime | 2.1 |
| | 2.2 Machine Learning & NLP Stack | 2.2 |
| | 2.3 Backend & REST API Framework | 2.3 |
| | 2.4 Frontend Design System & Data Visualizations | 2.4 |
| | 2.5 Development Tools & Version Control | 2.5 |
| 3 | **System Architecture & Flowchart** | Section 3 |
| | 3.1 End-to-End System Pipeline | 3.1 |
| | 3.2 Machine Learning Workflow Diagram | 3.2 |
| | 3.3 REST API Ingestion Flowchart | 3.3 |
| 4 | **Machine Learning Pipeline & Mathematical Formulation** | Section 4 |
| | 4.1 Text Preprocessing & Cleaning | 4.1 |
| | 4.2 TF-IDF Feature Extraction | 4.2 |
| | 4.3 Multinomial Logistic Regression Formulation | 4.3 |
| | 4.4 Stratified Model Training & Test Evaluation | 4.4 |
| 5 | **Source Code Implementation** | Section 5 |
| | 5.1 Model Training Pipeline (`train_model.py`) | 5.1 |
| | 5.2 NLP Inference & Analytics Engine (`reviewsense.py`) | 5.2 |
| | 5.3 Flask REST API Server (`app.py`) | 5.3 |
| | 5.4 Test Suite & Automated Verification (`tests/test_api.py`) | 5.4 |
| 6 | **Results, Evaluation & UI Observatory** | Section 6 |
| | 6.1 Quantitative ML Evaluation Metrics | 6.1 |
| | 6.2 Confusion Matrix Analysis | 6.2 |
| | 6.3 User Interface Walkthrough & Features | 6.3 |
| 7 | **Conclusion & Future Enhancements** | Section 7 |
| | 7.1 Project Summary | 7.1 |
| | 7.2 Limitations | 7.2 |
| | 7.3 Future Scope | 7.3 |
| 8 | **References** | Section 8 |

---

<br>

# Abstract

In the contemporary digital economy, consumer feedback serves as the primary pulse of product quality, service reliability, and user satisfaction. E-commerce platforms, SaaS providers, and service enterprises receive voluminous feedback daily across diversified inbound touchpoints, including email support, live chat logs, mobile app reviews, social media mentions, and web surveys. However, the sheer volume and unstructured nature of textual data create critical analytical bottlenecks. Manual auditing of customer feedback is labor-intensive, cost-prohibitive, subjective, and prone to severe latency, often blinding decision-makers to emerging product defects, shipping crises, or customer attrition risks.

To address these enterprise challenges, **ReviewSense: Customer Review Intelligence** has been conceived, designed, and developed as an intelligent, automated, and full-stack sentiment intelligence observatory. The platform bridges natural language processing (NLP), statistical machine learning, and editorial web design to automatically transform raw, unstructured customer comments into structured, real-time, actionable business insights.

The machine learning core is built upon Python and Scikit-Learn, executing a high-throughput, calibrated classification pipeline. Text records undergo punctuation normalization, lowercase conversion, and stopword pruning before being vectorized using a **sublinear Term Frequency-Inverse Document Frequency (TF-IDF)** model supporting unigrams and bigrams (`ngram_range=(1, 2)`). The classification is executed via a **Multinomial Logistic Regression** model with balanced class weighting. The model outputs polarity classifications (**Positive**, **Neutral**, and **Negative**) alongside confidence metrics and multi-class probability vectors. On an independent 25% held-out test split, the model demonstrates balanced predictive capability with an **Accuracy of 75.56%**, **Macro Precision of 81.21%**, **Macro Recall of 75.15%**, and a **Macro F1-Score of 75.62%**.

The backend architecture is implemented in **Flask**, exposing a REST API suite covering single-text real-time inference (`/api/analyze`), aggregate dashboard intelligence (`/api/dashboard`), smart CSV batch ingestion with dynamic column detection (`/api/upload`), structured CSV analytics export (`/api/export`), and model transparency telemetry (`/api/metrics`). 

The frontend interface implements an editorial design system utilizing CSS variables, responsive typography (*Newsreader* and *Plus Jakarta Sans*), accessible contrast tokens, and interactive visualizations engineered with **Chart.js**. Key UI modules include a four-metric summary grid, a temporal sentiment velocity trend line, an interactive sentiment distribution donut chart, multi-channel stacked performance bars, thematic topic extraction (e.g., *Customer Service*, *Delivery*, *Pricing*, *Product Quality*), n-gram keyword frequency bars, and a fully searchable, filterable, and paginated **Review Explorer** with full-text inspection modals.

In conclusion, the **ReviewSense** project demonstrates the practical integration of Applied Machine Learning, Natural Language Processing, and production-grade Web Architecture. It provides a scalable, auditable, and user-centric platform that empowers product managers, customer support leads, and executive stakeholders to make data-driven decisions that elevate customer experience and minimize churn.

---

<br>

# 1. Introduction

### 1.1 Background & Context
With the proliferation of omnichannel communication, modern businesses operate in an environment of continuous customer feedback. Customers express their experiences, complaints, recommendations, and praise across diverse touchpoints:
- E-commerce product reviews (Amazon, Flipkart)
- Mobile Application Store reviews (Google Play Store, Apple App Store)
- Helpdesk and support tickets (Zendesk, Freshdesk, Email)
- Live chat conversations and messaging platforms
- Social media commentary (X/Twitter, LinkedIn, Reddit)

This influx of data represents an invaluable asset for business intelligence. By accurately decoding customer sentiment, organizations can identify defective product batches, improve delivery logistics, train support personnel, and refine pricing models.

### 1.2 Problem Statement
Despite the abundance of feedback data, businesses face severe structural hurdles in extracting timely intelligence:
1. **Information Overload:** Human teams cannot manually read and categorize thousands of incoming comments every week.
2. **Subjectivity & Inconsistency:** Manual sentiment labeling differs significantly between individual human annotators due to cognitive bias and fatigue.
3. **Delayed Reaction Time:** Critical operational failures (e.g., app crashes after an update, broken payment gateways) often remain unnoticed for days because negative feedback is buried beneath standard comments.
4. **Channel Isolation:** Feedback arrives in disconnected silos, making it difficult to observe whether negative sentiment is concentrated in customer support, mobile apps, or logistics.
5. **Lack of Transparent Tooling:** Generic sentiment tools operate as opaque "black boxes" without reporting class probabilities, confusion matrices, or specific keywords driving classifications.

### 1.3 Objectives of the Project
The primary objectives of the **ReviewSense: Customer Review Intelligence** project are:
- To develop an end-to-end, automated text processing and classification pipeline capable of triaging feedback into **Positive**, **Neutral**, and **Negative** classes.
- To produce calibrated probability vectors and prediction confidence scores for every analyzed record.
- To build a high-performance RESTful web application using Flask to handle both individual real-time inferences and batch CSV uploads.
- To implement **Smart Column Detection** capable of ingesting arbitrary CSV schemas (e.g., `ReviewText`, `ReviewDate`, `feedback`, `comment`) without manual schema mapping.
- To formulate an automated thematic extraction algorithm that surfaces recurring operational themes (*Product Quality*, *Delivery*, *Customer Service*, *Pricing*, *Reliability*).
- To engineer a responsive, accessible, editorial-style data dashboard that presents trends, channel distributions, and review explorer tools with zero visual clutter.
- To provide complete academic and empirical transparency by exposing real held-out test split evaluation metrics and confusion matrices directly within the application.

### 1.4 Target Audience & Practical Utility
- **Product Managers:** To track user reaction following feature releases and software updates.
- **Customer Experience (CX) & Support Leads:** To isolate service bottlenecks and identify unresolved customer complaints.
- **Operations & Logistics Directors:** To monitor shipping timelines, packaging integrity, and delivery delays.
- **Data Science Students & Researchers:** As a reference implementation of an end-to-end, reproducible NLP-to-Web deployment.

---

<br>

# 2. Tools and Technologies Used

### 2.1 Programming Languages & Core Runtime
- **Python 3.10+:** Core programming language selected for its extensive ecosystem in machine learning, numerical computation, and lightweight web serving.
- **HTML5:** Semantic document structuring for accessible web dashboards, modal dialogs, dropzones, and tabular data.
- **CSS3 (Vanilla CSS with Custom Properties):** Strict editorial design system utilizing CSS Custom Variables, Flexbox, CSS Grid layouts, and responsive media queries without third-party utility bloat.
- **JavaScript (ECMAScript 2022+):** Client-side asynchronous fetch operations, event delegation, chart lifecycle management, modal controllers, and dynamic table pagination.

### 2.2 Machine Learning & NLP Stack
- **Scikit-Learn (`scikit-learn >= 1.0.0`):** Machine learning pipeline construction, model training, evaluation metrics calculation (`accuracy_score`, `precision_score`, `recall_score`, `f1_score`, `confusion_matrix`), and cross-validation splits.
- **`TfidfVectorizer`:** Text normalization, sublinear frequency scaling, and unigram/bigram token extraction.
- **`LogisticRegression`:** Multi-class classification with balanced class penalization and probability estimation.
- **Joblib (`joblib >= 1.2.0`):** High-efficiency serialization and deserialization of the trained Scikit-Learn pipeline (`model.joblib`).
- **Pandas (`pandas >= 1.5.0`):** Structured tabular data manipulation, CSV ingestion, time-series parsing, group-by aggregations, and data exports.
- **NumPy (`numpy >= 1.23.0`):** Numerical array operations and probabilistic argmax operations.

### 2.3 Backend & REST API Framework
- **Flask (`Flask >= 2.2.0`):** Lightweight, WSGI-compliant micro-framework chosen for high execution speed, modular route handling, and native JSON response serialization.
- **Python Standard Libraries:**
  - `re` (Regular expressions for text normalization and regex taxonomy matching)
  - `io` (In-memory string buffering for streaming CSV uploads and exports)
  - `json` (Serialization of held-out model metrics and confusion matrix data)
  - `logging` (Production-grade application event logging)
  - `datetime` (ISO date parsing and timestamp generation)

### 2.4 Frontend Design System & Data Visualizations
- **Editorial Brand Palette:**
  - Canvas / Background: Paper (`#F6F4F1`)
  - Structural Borders & Secondary Cards: Stone (`#E4DED2`)
  - Accent / Primary CTA: Coral (`#F95C4B`)
  - High-Contrast Typography: Ink Black (`#000000`)
  - Status Indicators: Positive (`#16A34A`), Neutral (`#D97706`), Negative (`#F95C4B`)
- **Typography:**
  - Display & Headings: *Newsreader* / *Playfair Display* (Editorial Serif)
  - Data & UI Controls: *Plus Jakarta Sans* / *Inter* (Geometric Sans-Serif)
- **Chart.js (v4.4.1):** Dynamic canvas rendering for:
  - 14-day sentiment trend timeline (multi-line smoothed bezier curves).
  - Categorical sentiment distribution (donut chart with hover offsets).
- **Lucide Icons Suite:** Standardized SVG vector icons for lightweight, accessible iconography.

### 2.5 Development Tools & Version Control
- **Visual Studio Code (VS Code):** Primary development environment.
- **Git & GitHub:** Version control, branch tracking, and code reviews.
- **Pytest (`pytest >= 7.0.0`):** Automated test suite for unit NLP checks and API endpoint integration testing.

---

<br>

# 3. System Architecture & Flowchart

### 3.1 End-to-End System Pipeline

```
+-----------------------------------------------------------------------------------+
|                                CLIENT LAYER (Browser UI)                          |
|  - Real-time Single Review Tester       - Dynamic CSV Dropzone & Import Modal     |
|  - 4-Metric Aggregate Summary Cards     - Multi-Channel & Thematic Topic Explorer |
|  - Sentiment Trend (Chart.js Line)      - Sentiment Distribution (Chart.js Donut) |
|  - Review Explorer (Search/Filter/Page) - Real Model Evaluation Telemetry         |
+-----------------------------------------+-----------------------------------------+
                                          | HTTP REST (JSON / Multipart CSV)
                                          v
+-----------------------------------------------------------------------------------+
|                             FLASK APPLICATION CONTROLLER                          |
|  - Route: /               -> Renders Single Page Application                      |
|  - Route: /api/dashboard  -> Computes aggregates, trends, channels, and themes    |
|  - Route: /api/analyze    -> Single text inference & probability decomposition    |
|  - Route: /api/upload     -> Smart column detection & multi-channel CSV ingestion |
|  - Route: /api/export     -> Generates enriched intelligence CSV download         |
|  - Route: /api/metrics    -> Serves held-out model performance & confusion matrix  |
|  - Route: /api/reset      -> Restores pristine baseline reference dataset         |
+-----------------------------------------+-----------------------------------------+
                                          | Internal Pipeline Calls
                                          v
+-----------------------------------------------------------------------------------+
|                        NATURAL LANGUAGE PROCESSING ENGINE                         |
|  1. Text Normalization: Regex cleaning, URL removal, lowercase, symbol stripping  |
|  2. Feature Extraction: TF-IDF Vectorizer (Unigram + Bigram, Sublinear TF)        |
|  3. Classification: Balanced Logistic Regression Pipeline                         |
|  4. Probabilistic Scoring: Calibrated Softmax confidence computation              |
|  5. Taxonomy Engine: Thematic keyword matching (Quality, Delivery, Service, etc.)  |
|  6. Keyword Extractor: N-gram frequency distribution (Positive/Neutral/Negative)  |
+--------------------+---------------------------------------+----------------------+
                     |                                       |
                     v                                       v
          +----------------------+               +-----------------------+
          | DATA STORAGE LAYER   |               | PERSISTED MODEL LAYER |
          | - current_reviews.csv|               | - model.joblib        |
          | - sample_reviews.csv |               | - evaluation_metrics  |
          | - training_data.csv  |               |   .json               |
          +----------------------+               +-----------------------+
```

### 3.2 Machine Learning Workflow Diagram

```
[Raw Customer Review Text]
           |
           v
[Text Cleaning & Normalization]
  - Strip URLs & Non-ASCII
  - Lowercase Conversion
  - Whitespace & Punctuation Boundary Normalization
           |
           v
[TF-IDF Feature Representation]
  - Word n-grams: (1, 2)
  - Sublinear TF Scaling (1 + log(tf))
  - English Stopword Elimination
           |
           v
[Logistic Regression Classifier]
  - Multi-class: One-vs-Rest / Multinomial
  - Balanced Class Penalty Weights
           |
           v
[Output Layer Generation]
  - Predicted Label: {Positive, Neutral, Negative}
  - Calibrated Probability Distribution Vector
  - Confidence Score: max(P(class|text))
```

### 3.3 REST API Ingestion Flowchart (CSV Upload)

```
[User Uploads CSV via Dropzone]
           |
           v
[Flask /api/upload Controller]
           |
           +---> Is file .csv format? ---[No]---> Return HTTP 400 (Invalid Extension)
           |
          [Yes]
           v
[Multi-Encoding Ingestion Loop (UTF-8, Latin-1, CP1252)]
           |
           v
[Delimiter Sniffer (Auto-detects Comma, Semicolon, Tab)]
           |
           v
[Smart Column Detection (`detect_csv_columns`)]
  - Review text: Search 'review', 'ReviewText', 'feedback', 'comment' or longest text
  - Date: Search 'date', 'ReviewDate', 'created_at', 'timestamp'
  - Channel: Search 'channel', 'source', 'platform' (fallback to 'Imported')
           |
           +---> Review text column found? ---[No]---> Return HTTP 400 (Missing Column)
           |
          [Yes]
           v
[Standardize & Clean Non-Empty Rows]
           |
           v
[Batch Sentiment Inference via `engine.predict_batch`]
           |
           v
[Save to `current_reviews.csv`]
           |
           v
[Compute Updated Aggregates & Visualizations via `get_dashboard_data`]
           |
           v
[Return HTTP 200 JSON Response with Updated Intelligence Data]
```

---

<br>

# 4. Machine Learning Pipeline & Mathematical Formulation

### 4.1 Text Preprocessing & Cleaning
Text entered by customers online contains noise, slang, HTML artifacts, irregular punctuation, and URLs. The preprocessing routine executes systematic sanitization:
1. Strips web addresses using regular expressions: `r'https?://\S+|www\.\S+'`
2. Converts all text to lowercase to ensure casing invariance.
3. Preserves linguistic negation cues (e.g., *not*, *never*, *no*, *hardly*) while stripping superfluous non-alphanumeric punctuation.
4. Collapses multi-space whitespace into single spaces.

### 4.2 TF-IDF Feature Extraction
Term Frequency-Inverse Document Frequency converts unstructured text into fixed-dimensional numerical feature vectors.

The Term Frequency $TF(t, d)$ represents the frequency of term $t$ in document $d$. To prevent term count inflation from dominating the classifier, **sublinear term frequency scaling** is applied:

$$TF_{sub}(t, d) = 1 + \log(TF(t, d)) \quad \text{for } TF(t, d) > 0$$

The Inverse Document Frequency $IDF(t, D)$ penalizes common terms across the entire corpus $D$:

$$IDF(t, D) = \log\left(\frac{1 + |D|}{1 + DF(t, D)}\right) + 1$$

Where $|D|$ is the total number of documents, and $DF(t, D)$ is the document frequency of term $t$. The final TF-IDF weight is computed as:

$$\text{TF-IDF}(t, d, D) = TF_{sub}(t, d) \times IDF(t, D)$$

To capture contextual phrases like *"not good"*, *"highly recommend"*, or *"poor quality"*, the vectorizer extracts both unigrams ($n=1$) and bigrams ($n=2$):

$$V = \{ w_i \} \cup \{ (w_i, w_{i+1}) \}$$

### 4.3 Multinomial Logistic Regression Formulation
For a 3-class classification problem where classes $k \in \{\text{Negative}, \text{Neutral}, \text{Positive}\}$, the model computes a linear combination of the input feature vector $\mathbf{x}$:

$$z_k = \mathbf{w}_k^T \mathbf{x} + b_k$$

Where $\mathbf{w}_k$ is the weight vector for class $k$ and $b_k$ is the bias intercept. The predicted probability distribution across all three classes is calculated using the **Softmax function**:

$$P(y = k \mid \mathbf{x}) = \frac{e^{z_k}}{\sum_{j=1}^{3} e^{z_j}}$$

The predicted sentiment class $\hat{y}$ is selected via argmax:

$$\hat{y} = \arg\max_{k} P(y = k \mid \mathbf{x})$$

The prediction confidence metric $C$ exposed on the dashboard is defined as:

$$C = \max_{k} \left( P(y = k \mid \mathbf{x}) \right) \times 100\%$$

To handle class imbalance naturally present in real-world customer reviews, balanced class weights are applied inversely proportional to class frequencies:

$$w_k = \frac{N}{K \cdot N_k}$$

Where $N$ is total training samples, $K=3$ is the number of classes, and $N_k$ is the number of samples belonging to class $k$.

---

<br>

# 5. Source Code Implementation

### 5.1 Model Training Pipeline (`train_model.py`)
```python
"""
ReviewSense - Model Training & Evaluation Pipeline
Trains TF-IDF + Logistic Regression pipeline on stratified customer reviews.
Evaluates model on held-out test split and exports serialized weights and metrics.
"""

import os
import json
import joblib
import pandas as pd
from reviewsense import (
    SentimentEngine,
    TRAINING_DATA_PATH,
    MODEL_PATH,
    METRICS_PATH
)

def run_training_pipeline():
    print("=" * 60)
    print("ReviewSense - Machine Learning Pipeline Training")
    print("=" * 60)

    if not os.path.exists(TRAINING_DATA_PATH):
        raise FileNotFoundError(f"Training dataset not found at {TRAINING_DATA_PATH}")

    df = pd.read_csv(TRAINING_DATA_PATH)
    print(f"Loaded training dataset with {len(df)} labeled customer reviews.")
    print("Class distribution:\n", df['sentiment'].value_counts())

    engine = SentimentEngine()
    print("\nTraining TF-IDF + Logistic Regression pipeline with 25% held-out test split...")
    engine.train(df, test_size=0.25, random_state=42)

    metrics = engine.evaluation_metrics
    print("\nTraining & Held-out Evaluation Complete:")
    print(f" - Model Version:     {metrics['model_version']}")
    print(f" - Accuracy:          {metrics['accuracy']}%")
    print(f" - Macro Precision:   {metrics['macro_precision']}%")
    print(f" - Macro Recall:      {metrics['macro_recall']}%")
    print(f" - Macro F1-Score:    {metrics['macro_f1']}%")
    print(f" - Train Samples:     {metrics['train_samples']}")
    print(f" - Test Samples:      {metrics['test_samples']}")

    print("\nConfusion Matrix on Held-out Test Set:")
    labels = metrics['confusion_matrix']['labels']
    matrix = metrics['confusion_matrix']['matrix']
    print(f"{'':15} " + " ".join(f"{l:>12}" for l in labels))
    for i, row in enumerate(matrix):
        print(f"True {labels[i]:<10} " + " ".join(f"{val:>12}" for val in row))

if __name__ == "__main__":
    run_training_pipeline()
```

### 5.2 NLP Inference & Analytics Engine Excerpt (`reviewsense.py`)
```python
"""
ReviewSense - Natural Language Processing Engine & Thematic Aggregator
"""
import re
import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

THEMES_TAXONOMY = {
    "Product Quality": ["quality", "build", "material", "durable", "sturdy", "flimsy", "broken", "defective"],
    "Customer Service": ["support", "service", "representative", "agent", "chat", "email", "ticket", "helpful"],
    "Delivery & Shipping": ["delivery", "shipping", "shipped", "package", "packaging", "box", "arrived", "delay"],
    "Pricing & Value": ["price", "cost", "value", "expensive", "cheap", "worth", "refund", "overpriced"],
    "Software & Reliability": ["crash", "bug", "interface", "ui", "update", "fast", "slow", "dashboard"]
}

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s\.\!\?]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

class SentimentEngine:
    def __init__(self, model_path=None):
        self.model_path = model_path or "models/model.joblib"
        self.pipeline = None
        self.load_model()

    def build_pipeline(self):
        return Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                sublinear_tf=True,
                stop_words="english",
                min_df=2
            )),
            ("clf", LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
                random_state=42
            ))
        ])

    def predict_one(self, text: str):
        cleaned = clean_text(text)
        probs = self.pipeline.predict_proba([cleaned])[0]
        classes = list(self.pipeline.classes_)
        pred_idx = int(np.argmax(probs))
        return {
            "sentiment": classes[pred_idx],
            "confidence": round(float(probs[pred_idx]) * 100, 1),
            "cleaned_text": cleaned,
            "probabilities": {cls: round(float(p) * 100, 1) for cls, p in zip(classes, probs)}
        }
```

### 5.3 Flask REST API Server (`app.py`)
```python
"""
ReviewSense - Flask Web Application & REST API
Exposes endpoints for dashboard analytics, batch upload, single inference, and data export.
"""
from flask import Flask, render_template, request, jsonify, Response
import pandas as pd
import io, re
from datetime import datetime
from reviewsense import SentimentEngine, get_dashboard_data, CURRENT_DATA_PATH, SAMPLE_DATA_PATH

app = Flask(__name__, static_folder="static", template_folder="templates")
engine = SentimentEngine()

def detect_csv_columns(df: pd.DataFrame):
    norm_map = {re.sub(r'[^a-z0-9]', '', str(c).lower()): c for c in df.columns}
    
    # Priority keys for review text
    rev_keys = ["review", "reviewtext", "reviews", "feedback", "comment", "text", "body", "message"]
    review_col = next((norm_map[k] for k in rev_keys if k in norm_map), None)
    
    # Priority keys for date & channel
    date_keys = ["date", "reviewdate", "createdat", "timestamp", "time"]
    date_col = next((norm_map[k] for k in date_keys if k in norm_map), None)
    
    chan_keys = ["channel", "source", "platform", "medium"]
    channel_col = next((norm_map[k] for k in chan_keys if k in norm_map), None)
    
    return review_col, channel_col, date_col

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/dashboard", methods=["GET"])
def api_dashboard():
    df = pd.read_csv(CURRENT_DATA_PATH) if os.path.exists(CURRENT_DATA_PATH) else pd.DataFrame()
    return jsonify({"status": "success", "data": get_dashboard_data(engine, df)})

@app.route("/api/analyze", methods=["POST"])
def api_analyze():
    data = request.get_json() or {}
    text = data.get("text", "").strip()
    if not text:
        return jsonify({"status": "error", "message": "Review text cannot be empty."}), 400
    return jsonify({"status": "success", "data": engine.predict_one(text)})

@app.route("/api/upload", methods=["POST"])
def api_upload():
    file = request.files.get("file")
    content = file.read().decode("utf-8-sig")
    df = pd.read_csv(io.StringIO(content), sep=None, engine="python")
    rev_col, chan_col, date_col = detect_csv_columns(df)
    
    if not rev_col:
        return jsonify({"status": "error", "message": "CSV must contain a review column."}), 400
    
    standardized = pd.DataFrame()
    standardized["review"] = df[rev_col].dropna().astype(str).str.strip()
    standardized["channel"] = df[chan_col].fillna("Imported") if chan_col else "Imported"
    standardized["date"] = df[date_col].fillna(datetime.now().strftime("%Y-%m-%d")) if date_col else datetime.now().strftime("%Y-%m-%d")
    
    standardized.to_csv(CURRENT_DATA_PATH, index=False)
    return jsonify({"status": "success", "imported_count": len(standardized), "data": get_dashboard_data(engine, standardized)})

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
```

### 5.4 Test Suite & Automated Verification (`tests/test_api.py`)
```python
"""
API Integration Tests for ReviewSense Endpoints
"""
import io
import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.get_json()["status"] == "healthy"

def test_analyze_positive(client):
    res = client.post("/api/analyze", json={
        "text": "The product is absolutely fantastic and customer support was exceptionally helpful!"
    })
    assert res.status_code == 200
    assert res.get_json()["data"]["sentiment"] == "Positive"

def test_analyze_negative(client):
    res = client.post("/api/analyze", json={
        "text": "Terrible customer service. Device broke on day one and support refused a refund."
    })
    assert res.status_code == 200
    assert res.get_json()["data"]["sentiment"] == "Negative"

def test_upload_product_reviews_mock_format(client):
    csv_content = """ReviewID,ProductID,UserID,Rating,ReviewText,ReviewDate
REV-001,PROD-101,USER-77,5,"Outstanding battery life and great build quality.",2026-10-22
"""
    data = {"file": (io.BytesIO(csv_content.encode("utf-8")), "product_reviews_mock_data.csv")}
    res = client.post("/api/upload", data=data, content_type="multipart/form-data")
    assert res.status_code == 200
    assert res.get_json()["imported_count"] == 1
```

---

<br>

# 6. Results, Evaluation & UI Observatory

### 6.1 Quantitative ML Evaluation Metrics
The Machine Learning model was trained on **132 training samples** and evaluated against **45 held-out test samples** (25% stratified test split). The empirical evaluation metrics obtained are:

| Metric | Measured Score | Evaluation Notes |
|:---|:---:|:---|
| **Overall Accuracy** | **75.56%** | Evaluated on held-out unseen test samples |
| **Macro Precision** | **81.21%** | Unweighted average precision across all three classes |
| **Macro Recall** | **75.15%** | Effectively minimizes false negative misclassifications |
| **Macro F1-Score** | **75.62%** | Harmonic mean of macro precision and recall |

#### Detailed Per-Class Breakdown

| Class Label | Precision | Recall | F1-Score | Support (Test Split) |
|:---|:---:|:---:|:---:|:---:|
| **Negative** | 80.00% | 70.59% | 75.00% | 17 |
| **Neutral** | 100.00% | 61.54% | 76.19% | 13 |
| **Positive** | 63.64% | 93.33% | 75.68% | 15 |

### 6.2 Confusion Matrix Analysis
The confusion matrix on the held-out test split is formulated below:

```
                          PREDICTED
                 Negative    Neutral    Positive    Total
ACTUAL Negative     12          0          5          17
ACTUAL Neutral       2          8          3          13
ACTUAL Positive      1          0         14          15
```

- **True Negatives Correctly Identified:** 12 out of 17 (70.6% recall).
- **True Neutrals Correctly Identified:** 8 out of 13 (100% precision, no false positive neutral calls).
- **True Positives Correctly Identified:** 14 out of 15 (93.3% recall, high sensitivity to customer praise).

### 6.3 User Interface Walkthrough & Visual Observatory

#### I. Overview Dashboard & Summary Cards
The primary landing view presents a four-metric summary grid displaying:
1. **Total Reviews:** Cumulative volume of multi-channel customer comments.
2. **Positive Reviews:** Volume and percentage of satisfied customer feedback with green badge indicators.
3. **Neutral Reviews:** Baseline and mixed reviews highlighted with amber badges.
4. **Negative Reviews:** At-risk customer dissatisfaction records highlighted with coral badges.

#### II. Interactive Visualizations (Chart.js)
- **Sentiment Velocity Trend:** A temporal line chart tracking daily volume fluctuations of Positive, Neutral, and Negative feedback over time.
- **Sentiment Polarity Donut Chart:** Visualizes the proportional split of customer sentiment with interactive tooltips.

#### III. Omnichannel & Thematic Topics Breakdown
- **Channel Distribution:** Stacked horizontal bars depicting customer sentiment distribution across inbound channels (Email, Chat, Social Media, Website, Mobile App).
- **Thematic Topic Extraction:** Automatically computes keyword frequency clusters across core operational domains (*Product Quality*, *Customer Service*, *Delivery & Shipping*, *Pricing & Value*, *Software & Reliability*).

#### IV. Single Review Real-Time Tester
An interactive text workbench where credit officers or support administrators can type any customer sentence. Upon submitting, the system displays:
- Predicted Sentiment Badge (`Positive`, `Neutral`, or `Negative`).
- Numerical Confidence Percentage.
- Calibrated Probability Distribution Bars for all three classes.
- Normalization text telemetry showing cleaned tokens.

#### V. Review Explorer & Detail Modal
A searchable, filterable data table offering:
- Sentiment filtering dropdown (All, Positive, Neutral, Negative).
- Channel selection dropdown.
- Full-text search with instant client-side filtering.
- Pagination controls with customizable page sizes.
- Full-text detail inspection modal displaying raw review text, channel metadata, timestamp, predicted sentiment, and probability breakdown.

#### VI. Smart CSV Drag-and-Drop Ingestion
A drag-and-drop modal supporting custom CSV imports up to 16MB. The engine executes **Smart Column Detection** to automatically ingest datasets containing arbitrary column headers like `ReviewText`, `ReviewDate`, `Rating`, `UserID`, and `ProductID`.

---

<br>

# 7. Conclusion & Future Enhancements

### 7.1 Project Summary
The **ReviewSense: Customer Review Intelligence** project successfully demonstrates how Natural Language Processing and Modern Web Development can be synthesized into an operational business tool. By eliminating manual auditing, the system achieves:
- Automated multi-class sentiment classification with calibrated probabilities.
- Instant identification of recurring customer grievances and praise topics.
- Visual clarity through an editorial-grade, responsive dashboard.
- Frictionless CSV data ingestion adaptable to varying enterprise schemas.

The project highlights the utility of balanced machine learning pipelines, responsive design systems, and modular REST API backends in building scalable AI software.

### 7.2 Limitations
1. **Linguistic Scope:** The model is primarily trained on English customer feedback; non-English multilingual comments require language translation preprocessing.
2. **Sarcasm & Figurative Nuances:** Complex sarcastic remarks (e.g., *"Great, another update that broke my login!"*) may occasionally be classified as Neutral or Positive due to surface keyword features.
3. **Static Model Weights:** The current model operates on fixed serialized weights (`model.joblib`) and requires manual execution of `python train_model.py` for periodic retraining.

### 7.3 Future Scope
- **Transformer Integration:** Upgrading the TF-IDF feature extractor to fine-tuned transformer models (e.g., RoBERTa or DistilBERT) for improved contextual comprehension and sarcasm detection.
- **Aspect-Based Sentiment Analysis (ABSA):** Decomposing individual reviews into granular aspect-level scores (e.g., separating sentiment towards *Delivery Speed* vs *Item Quality* within the same review).
- **Webhook & Live API Ingestion:** Implementing direct connectors for Zendesk, Freshdesk, Shopify, and Google Play Store APIs for automated streaming feedback ingestion.
- **Automated Response Generation:** Integrating generative AI assistance to draft empathetic, context-aware reply suggestions for customer service representatives.

---

<br>

# 8. References

1. **Scikit-Learn Machine Learning Documentation**  
   *Official Documentation on Classification Pipelines, TF-IDF Vectorization, and Logistic Regression.*  
   Available at: [https://scikit-learn.org](https://scikit-learn.org/)

2. **Flask Web Framework Documentation**  
   *Pallets Projects: Routing, WSGI Request Handling, and RESTful API Integration in Python.*  
   Available at: [https://flask.palletsprojects.com](https://flask.palletsprojects.com/)

3. **Chart.js Documentation**  
   *Open-source HTML5 Canvas visual rendering library for reactive and animated charts.*  
   Available at: [https://www.chartjs.org](https://www.chartjs.org/)

4. **Speech and Language Processing (3rd Edition Draft)**  
   *Daniel Jurafsky and James H. Martin.*  
   Comprehensive textbook on Sentiment Analysis, N-gram Language Modeling, and Logistic Regression Classification.

5. **MDN Web Docs (Responsive Web Design & Web APIs)**  
   *Mozilla Developer Network: CSS Custom Properties, Semantic HTML5, and Fetch API reference.*  
   Available at: [https://developer.mozilla.org](https://developer.mozilla.org/)

6. **Pandas Documentation**  
   *Python Data Analysis Library for high-performance data structures, CSV manipulation, and time-series aggregation.*  
   Available at: [https://pandas.pydata.org](https://pandas.pydata.org/)

---

<br>

**Maintained By:** Himanshu (UID: 25MCI10063)  
**Project Guide:** Mrs. Swati Mittal, Assistant Professor, UIC, Chandigarh University  
**Degree:** Master of Computer Applications (AI & ML)  
**GitHub Repository:** [https://github.com/himanshu99-gethub/ReviewSense-Customer-Review-Intelligence](https://github.com/himanshu99-gethub/ReviewSense-Customer-Review-Intelligence)  
