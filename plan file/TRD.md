# Technical Requirements Document (TRD)
## ReviewSense — Customer Review Intelligence

## 1. Architecture

The application uses a lightweight Flask server with a browser-based frontend.

```text
Browser UI
  ├── HTML templates
  ├── CSS design system
  ├── JavaScript dashboard logic
  └── Chart.js visualizations
          |
          | HTTP / JSON
          v
Flask application (app.py)
  ├── Dashboard endpoint
  ├── Single-review analysis endpoint
  ├── CSV upload endpoint
  └── CSV export endpoint
          |
          v
NLP engine (reviewsense.py)
  ├── Text cleaning with regular expressions
  ├── TF-IDF vectorization
  ├── Logistic Regression classifier
  └── Word-frequency extraction
          |
          v
CSV data files and locally generated model artifact
```

## 2. Backend

- **Framework:** Flask
- **Data handling:** pandas
- **Machine learning:** scikit-learn
- **Model persistence:** joblib
- **Local data:** CSV files

## 3. NLP pipeline

1. Receive the review text.
2. Normalize text to lowercase.
3. Replace URLs with a placeholder.
4. Remove most punctuation and normalize whitespace.
5. Convert text to TF-IDF features using unigrams and bigrams.
6. Predict sentiment using Logistic Regression.
7. Return the predicted label and class probabilities.
8. Aggregate predictions for dashboard metrics.

## 4. API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Render the dashboard |
| GET | `/api/dashboard` | Return dashboard aggregates and recent reviews |
| POST | `/api/analyze` | Predict sentiment for one review |
| POST | `/api/upload` | Import review CSV |
| GET | `/api/export` | Download analyzed CSV |
| POST | `/api/reset` | Restore starter data where supported |

### Single-review request

```json
{
  "text": "The product is excellent and delivery was fast."
}
```

### Single-review response example

```json
{
  "sentiment": "Positive",
  "confidence": 76.4,
  "cleaned_text": "the product is excellent and delivery was fast",
  "probabilities": {
    "Negative": 8.1,
    "Neutral": 15.5,
    "Positive": 76.4
  }
}
```

The numeric values above are illustrative, not a promised model output.

## 5. Data contract

Minimum required CSV field:

- `review`: review text

Optional fields:

- `channel`: source such as Email, Chat, or Social Media
- `date`: preferably formatted as `YYYY-MM-DD`

## 6. Error handling

- Empty review text returns a client error.
- Invalid uploads return a readable message.
- CSV files without a `review` column are rejected.
- Backend failures should not crash the browser UI.
- Production deployments should add structured logging without recording unnecessary personal information.

## 7. Security and privacy

- The starter app is intended for local development.
- Do not expose Flask debug mode to the public internet.
- Add authentication, upload limits, validation, CSRF protection where applicable, and secure deployment configuration before production use.
- Do not upload sensitive customer information unless authorized and appropriately protected.
