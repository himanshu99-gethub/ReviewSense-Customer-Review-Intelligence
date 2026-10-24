/**
 * ReviewSense Single Review Analyzer
 * Handles review text analysis, confidence calculation, probability bars,
 * and cleaned token display.
 */

const Analyzer = {
  init() {
    const form = document.getElementById('review-analyzer-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAnalyze();
      });
    }

    const btn = document.getElementById('btn-analyze-review');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleAnalyze();
      });
    }

    // Secondary analyzer on sentiment page
    const secBtn = document.getElementById('btn-analyze-review-page');
    if (secBtn) {
      secBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleAnalyze('review-analyzer-textarea-page', 'analyzer-result-card-page');
      });
    }
  },

  async handleAnalyze(inputId = 'review-analyzer-textarea', resultCardId = 'analyzer-result-card') {
    const input = document.getElementById(inputId);
    const resultCard = document.getElementById(resultCardId);
    if (!input) return;

    const text = input.value.trim();
    if (!text) {
      Notifications.show('Please enter or paste review text to analyze.', 'error');
      input.focus();
      return;
    }

    // Set button loading state
    const btn = inputId === 'review-analyzer-textarea' 
      ? document.getElementById('btn-analyze-review')
      : document.getElementById('btn-analyze-review-page');

    const originalBtnHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `
        <svg class="spinning" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10"/>
        </svg>
        Analyzing Sentiment...
      `;
    }

    try {
      const response = await API.analyzeReview(text);
      const data = response.data;

      this.renderResult(data, resultCard);
      Notifications.show(`Classified as ${data.sentiment} (${data.confidence}% confidence)`, 'success');
    } catch (err) {
      Notifications.show(err.message || 'Failed to analyze sentiment.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnHtml;
      }
    }
  },

  renderResult(data, cardEl) {
    if (!cardEl) return;

    const sentiment = data.sentiment;
    const confidence = data.confidence;
    const probs = data.probabilities || {};
    const cleanedText = data.cleaned_text || '';

    let badgeClass = 'badge-neu';
    let iconSvg = '';

    if (sentiment === 'Positive') {
      badgeClass = 'badge-pos';
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (sentiment === 'Negative') {
      badgeClass = 'badge-neg';
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    } else {
      badgeClass = 'badge-neu';
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
    }

    const posProb = probs['Positive'] || 0;
    const neuProb = probs['Neutral'] || 0;
    const negProb = probs['Negative'] || 0;

    cardEl.innerHTML = `
      <div class="result-header">
        <div class="result-badge-wrap">
          <span class="sentiment-badge ${badgeClass}">
            ${iconSvg}
            ${sentiment} Sentiment
          </span>
          <span class="confidence-score">
            Estimated Confidence: <strong>${confidence}%</strong>
          </span>
        </div>
        <span style="font-size: 11.5px; color: #8A847C;">TF-IDF + Logistic Regression</span>
      </div>

      <div class="prob-bars-grid">
        <div class="prob-col">
          <div class="prob-col-label">
            <span>Positive</span>
            <span style="color: var(--sentiment-pos);">${posProb}%</span>
          </div>
          <div class="prob-track">
            <div class="prob-bar-fill" style="width: ${posProb}%; background: var(--sentiment-pos);"></div>
          </div>
        </div>

        <div class="prob-col">
          <div class="prob-col-label">
            <span>Neutral</span>
            <span style="color: var(--sentiment-neu);">${neuProb}%</span>
          </div>
          <div class="prob-track">
            <div class="prob-bar-fill" style="width: ${neuProb}%; background: var(--sentiment-neu);"></div>
          </div>
        </div>

        <div class="prob-col">
          <div class="prob-col-label">
            <span>Negative</span>
            <span style="color: var(--sentiment-neg);">${negProb}%</span>
          </div>
          <div class="prob-track">
            <div class="prob-bar-fill" style="width: ${negProb}%; background: var(--sentiment-neg);"></div>
          </div>
        </div>
      </div>

      <div class="cleaned-text-box">
        <span style="font-weight: 600; display: block; margin-bottom: 4px; font-size: 12px; color: #57534E;">Normalized Preprocessed Tokens:</span>
        <code>${cleanedText ? cleanedText : '(Empty after symbol filtering)'}</code>
      </div>

      <p style="font-size: 11.5px; color: #8C8476; margin-top: 10px; font-style: italic;">
        Notice: Confidence scores reflect model class probability estimation on training feature distribution and are not a 100% guarantee of ground truth.
      </p>
    `;

    cardEl.classList.add('active');
  }
};
