# Backend Schema and Data Model
## ReviewSense — Customer Review Intelligence

The starter version stores review records in CSV files. A relational schema is recommended if the project grows beyond a local prototype.

## 1. Recommended relational entities

### `reviews`

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT / INTEGER | Primary key |
| `review_text` | TEXT | Original review content |
| `channel` | VARCHAR(80) | Email, Chat, Social Media, or another source |
| `review_date` | DATE | Date supplied with the review |
| `created_at` | TIMESTAMP | Import/creation timestamp |

### `sentiment_predictions`

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT / INTEGER | Primary key |
| `review_id` | BIGINT / INTEGER | Foreign key to `reviews.id` |
| `sentiment` | VARCHAR(20) | Positive, Neutral, or Negative |
| `confidence` | DECIMAL(5,2) | Model confidence percentage |
| `model_version` | VARCHAR(100) | Model identifier |
| `predicted_at` | TIMESTAMP | Prediction timestamp |

### Optional `topics`

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT / INTEGER | Primary key |
| `topic_name` | VARCHAR(120) | Topic label |

### Optional `review_topics`

| Column | Type | Notes |
|---|---|---|
| `review_id` | BIGINT / INTEGER | Review reference |
| `topic_id` | BIGINT / INTEGER | Topic reference |

## 2. Relationships

- One review may have multiple prediction records over time.
- Each prediction belongs to one review.
- Reviews may map to multiple topics.
- Store model versions so results can be compared after retraining.

## 3. Data quality

- Validate review text length and encoding.
- Normalize channel names.
- Parse dates explicitly.
- Handle missing or blank reviews.
- Avoid storing unnecessary personal data.
- Preserve source data before replacing active datasets.
