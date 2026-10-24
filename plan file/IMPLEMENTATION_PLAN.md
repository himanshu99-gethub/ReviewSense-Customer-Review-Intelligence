# Implementation Plan
## ReviewSense — Customer Review Intelligence

## Phase 1 — Foundation

- [ ] Set up the Python virtual environment.
- [ ] Install dependencies.
- [ ] Verify Flask starts locally.
- [ ] Confirm the dashboard template loads.
- [ ] Apply the Paper, Stone, Coral, Black, and White design tokens.

## Phase 2 — NLP pipeline

- [ ] Implement text normalization and regular-expression cleaning.
- [ ] Build TF-IDF features.
- [ ] Train Logistic Regression on labeled data.
- [ ] Save and load the trained model.
- [ ] Validate single-review predictions.

## Phase 3 — Dashboard and analytics

- [ ] Render total and sentiment counts.
- [ ] Build sentiment trend visualization.
- [ ] Show sentiment distribution by channel.
- [ ] Show frequent feedback topics.
- [ ] Show word frequencies by sentiment.
- [ ] Add recent-review search.

## Phase 4 — Data import/export

- [ ] Validate CSV uploads.
- [ ] Support optional channel and date fields.
- [ ] Refresh dashboard data after import.
- [ ] Export predictions to CSV.
- [ ] Test malformed files and empty reviews.

## Phase 5 — Evaluation

- [ ] Use a larger labeled review dataset.
- [ ] Split data into training and test sets.
- [ ] Measure accuracy, precision, recall, and macro-F1.
- [ ] Produce a confusion matrix.
- [ ] Compare TF-IDF + Logistic Regression against an LSTM baseline if required by the syllabus.
- [ ] Document model limitations and common errors.

## Phase 6 — Final review and deployment

- [ ] Test on desktop and mobile sizes.
- [ ] Check keyboard navigation and contrast.
- [ ] Disable debug mode for deployment.
- [ ] Add authentication and upload limits if the app will be shared.
- [ ] Review privacy requirements before handling real customer data.
