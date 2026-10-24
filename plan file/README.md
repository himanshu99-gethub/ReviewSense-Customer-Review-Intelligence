# ReviewSense — Customer Review Intelligence

ReviewSense is an NLP-based application that analyzes customer feedback and classifies reviews as **Positive**, **Neutral**, or **Negative**. It presents review insights in an interactive dashboard with sentiment trends, channel distribution, topic counts, word frequency, and CSV import/export.

## Brand and UI color palette

The interface should use the palette from the supplied reference images:

| Color | Hex | Intended use |
|---|---|---|
| Paper | `#F6F4F1` | Main page background |
| Stone | `#E4DED2` | Secondary surfaces, subtle panels |
| Coral | `#F95C4B` | Primary accent, buttons, active states, highlights |
| Black | `#000000` | Sidebar, main text, high-contrast elements |
| White | `#FFFFFF` | Cards and readable text on dark surfaces |

### Design direction

- Minimal, premium dashboard with generous spacing and rounded cards.
- Use **Paper** as the overall canvas, **White** for cards, and **Black** for the navigation/sidebar and key text.
- Use **Coral** for primary actions, selected navigation states, links, and emphasis.
- Use **Stone** for muted backgrounds, dividers, secondary sections, and subtle borders.
- Use clear sentiment colors only when communicating sentiment: green for Positive, amber for Neutral, and red/coral for Negative. Keep these functional colors separate from the core brand palette.

## Main features

- Review sentiment classification.
- Dashboard summary cards.
- Sentiment trend chart.
- Sentiment breakdown by channel.
- Common feedback topics.
- Word-frequency view by sentiment.
- Analyze-one-review form.
- CSV upload and export.
- Search and filter recent feedback.

## Technology stack

- Python
- Flask
- pandas
- scikit-learn
- TF-IDF features
- Logistic Regression classifier
- HTML, CSS, JavaScript
- Chart.js for visualizations

## Quick start

1. Install Python 3.10 or later.
2. Open the project folder in a terminal.
3. Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   ```

   Windows PowerShell:

   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

   macOS/Linux:

   ```bash
   source .venv/bin/activate
   ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Run the application:

   ```bash
   python app.py
   ```

6. Open `http://127.0.0.1:5000` in your browser.

## CSV format

A CSV import must include a `review` column. `channel` and `date` are optional.

```csv
review,channel,date
"Excellent quality and quick delivery",Email,2026-10-20
"The product is average for the price",Chat,2026-10-21
"Broken item and poor customer support",Social Media,2026-10-22
```

## Important model note

The bundled classifier is an educational baseline. Its predictions should not be treated as business-critical results without training and evaluating it on a sufficiently large, representative, labeled dataset. Report precision, recall, F1-score, and a confusion matrix in addition to accuracy.
