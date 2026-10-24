# Application Flow
## ReviewSense — Customer Review Intelligence

## 1. Dashboard entry

1. User opens the ReviewSense homepage.
2. Frontend requests `/api/dashboard`.
3. Backend loads the active review dataset.
4. NLP engine predicts sentiment labels.
5. Backend returns aggregate metrics and recent reviews.
6. Frontend renders cards, charts, topic bars, word frequencies, and the review table.

## 2. Analyze a single review

1. User enters a review in the analysis form.
2. Frontend sends the text to `POST /api/analyze`.
3. Backend validates the input.
4. NLP engine cleans the text and predicts sentiment.
5. UI displays sentiment and confidence.

## 3. Import CSV

1. User selects **Import CSV**.
2. Frontend uploads the file to `POST /api/upload`.
3. Backend checks the extension and required `review` column.
4. Optional `channel` and `date` columns receive defaults if absent.
5. Valid rows are saved as the active dataset.
6. Frontend refreshes the dashboard and displays a success message.

## 4. Export analysis

1. User selects **Export Data**.
2. Browser requests `/api/export`.
3. Backend predicts sentiment for active reviews.
4. Browser downloads a CSV containing the review data and sentiment label.

## 5. Navigation

- **Overview:** scrolls to the summary cards.
- **Sentiment Analysis:** scrolls to the analysis charts.
- **Feedback Channels:** scrolls to the recent feedback table.
