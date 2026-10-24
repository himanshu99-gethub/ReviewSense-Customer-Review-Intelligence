/**
 * ReviewSense Application Core Controller
 * Manages SPA navigation, state management, dashboard rendering,
 * and page-level views.
 */

window.App = {
  currentView: 'overview',
  activeWordFreqSentiment: 'All',
  dashboardData: null,
  metricsData: null,

  init() {
    Notifications.init();
    ImportExport.init();
    Analyzer.init();

    this.setupNavigation();
    this.setupDateFilter();
    this.setupRefreshButton();
    this.setupWordFreqTabs();
    this.setupDropdowns();
    this.setupKeyboardShortcuts();
    this.setupMobileMenu();

    // Initial data load
    this.refreshDashboard();
    this.loadModelMetrics();
  },

  // ============================================================================
  // Navigation & View Routing
  // ============================================================================

  setupNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item[data-view]');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const viewName = item.getAttribute('data-view');
        this.navigateTo(viewName);

        // Close mobile sidebar if open
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('mobile-open');
      });
    });

    // Links inside views that navigate
    document.querySelectorAll('[data-nav-to]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = el.getAttribute('data-nav-to');
        this.navigateTo(targetView);
      });
    });
  },

  navigateTo(viewName) {
    if (!viewName) return;
    this.currentView = viewName;

    // Update sidebar active class
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => {
      if (el.getAttribute('data-view') === viewName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Toggle views
    document.querySelectorAll('.page-view').forEach(viewEl => {
      if (viewEl.id === `view-${viewName}`) {
        viewEl.classList.add('active');
      } else {
        viewEl.classList.remove('active');
      }
    });

    // Update breadcrumb and titles
    this.updatePageHeader(viewName);

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh view-specific layout if needed
    if (viewName === 'performance') {
      this.renderModelPerformance();
    } else if (viewName === 'channels') {
      this.renderChannelsView();
    } else if (viewName === 'topics') {
      this.renderTopicsView();
    } else if (viewName === 'overview') {
      if (Charts.trendChartInstance) Charts.trendChartInstance.resize();
      if (Charts.donutChartInstance) Charts.donutChartInstance.resize();
    }
  },

  updatePageHeader(viewName) {
    const breadcrumb = document.getElementById('page-breadcrumb');
    const title = document.getElementById('page-title');
    const subtitle = document.getElementById('page-subtitle');

    const headers = {
      overview: {
        breadcrumb: 'Intelligence Dashboard',
        title: 'ReviewSense',
        subtitle: 'Turn customer feedback into meaningful insights.'
      },
      sentiment: {
        breadcrumb: 'Deep Sentiment',
        title: 'Sentiment Analysis',
        subtitle: 'Class-level confidence probabilities, sentiment polarity, and single review testing.'
      },
      channels: {
        breadcrumb: 'Source Channels',
        title: 'Feedback Channels',
        subtitle: 'Sentiment breakdowns and volume comparisons across email, chat, social media, and support.'
      },
      explorer: {
        breadcrumb: 'Review Management',
        title: 'Review Explorer',
        subtitle: 'Search, filter, sort, and inspect customer reviews and confidence scores.'
      },
      topics: {
        breadcrumb: 'Taxonomy & Semantics',
        title: 'Topics & Keywords',
        subtitle: 'Dominant feedback themes, recurrent customer pain points, and n-gram word frequency.'
      },
      performance: {
        breadcrumb: 'Model Governance',
        title: 'Model Performance',
        subtitle: 'Honest evaluation metrics, 3x3 confusion matrix, and held-out test split results.'
      },
      settings: {
        breadcrumb: 'Configuration',
        title: 'System Settings',
        subtitle: 'Manage active dataset, view NLP architecture parameters, and restore starter data.'
      }
    };

    const h = headers[viewName] || headers.overview;
    if (breadcrumb) breadcrumb.textContent = h.breadcrumb;
    if (title) title.textContent = h.title;
    if (subtitle) subtitle.textContent = h.subtitle;
  },

  // ============================================================================
  // Dashboard Data Fetch & Render
  // ============================================================================

  setupRefreshButton() {
    const refreshBtn = document.getElementById('btn-refresh-dashboard');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.refreshDashboard();
      });
    }
  },

  setupDateFilter() {
    const dateSelect = document.getElementById('dashboard-date-filter');
    if (dateSelect) {
      dateSelect.addEventListener('change', () => {
        this.refreshDashboard();
      });
    }
  },

  async refreshDashboard() {
    const refreshBtn = document.getElementById('btn-refresh-dashboard');
    const refreshIcon = refreshBtn ? refreshBtn.querySelector('svg') : null;
    if (refreshIcon) refreshIcon.classList.add('spinning');

    try {
      const dateSelect = document.getElementById('dashboard-date-filter');
      const filterVal = dateSelect ? dateSelect.value : 'all';

      const params = {};
      const now = new Date();

      if (filterVal === '30') {
        const d = new Date();
        d.setDate(now.getDate() - 30);
        params.startDate = d.toISOString().split('T')[0];
      } else if (filterVal === '14') {
        const d = new Date();
        d.setDate(now.getDate() - 14);
        params.startDate = d.toISOString().split('T')[0];
      }

      const res = await API.getDashboard(params);
      this.applyDashboardData(res.data);
      Notifications.show('Dashboard refreshed with latest intelligence.', 'info', 2500);
    } catch (err) {
      Notifications.show(err.message || 'Error refreshing dashboard.', 'error');
    } finally {
      if (refreshIcon) refreshIcon.classList.remove('spinning');
    }
  },

  applyDashboardData(data) {
    if (!data) return;
    this.dashboardData = data;

    // 1. Summary Cards
    this.renderSummaryCards(data.summary);

    // 2. Charts
    Charts.renderTrendChart('sentiment-trend-canvas', data.trend || {});
    Charts.renderDonutChart('sentiment-donut-canvas', data.sentiment_distribution || {});

    // 3. Channels Breakdown
    this.renderChannelsBreakdown(data.channels || []);

    // 4. Themes
    this.renderThemesList(data.themes || []);

    // 5. Word Frequency
    this.renderWordFrequency(data.word_frequency || {});

    // 6. Review Explorer Table
    Explorer.updateData(data.reviews || []);

    // 7. Recent Reviews Preview on Overview
    this.renderRecentReviewsPreview(data.reviews || []);

    // Also update sub-views
    this.renderChannelsView();
    this.renderTopicsView();
  },

  renderRecentReviewsPreview(reviews = []) {
    const tbody = document.getElementById('overview-recent-table-body');
    if (!tbody) return;

    if (reviews.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No recent reviews available.</td></tr>`;
      return;
    }

    const previewList = reviews.slice(0, 5);
    tbody.innerHTML = previewList.map(item => {
      let badgeClass = 'badge-neu';
      if (item.sentiment === 'Positive') badgeClass = 'badge-pos';
      else if (item.sentiment === 'Negative') badgeClass = 'badge-neg';

      const safeReview = Explorer.escapeHtml(item.review);

      return `
        <tr onclick="Explorer.openDetailModal('${item.id}')" title="Click to inspect review details" style="cursor: pointer;">
          <td class="review-cell" style="font-weight: 500;">
            ${safeReview}
          </td>
          <td>
            <span class="sentiment-badge ${badgeClass}" style="font-size: 12px; padding: 2px 8px;">
              ${item.sentiment}
            </span>
          </td>
          <td style="font-variant-numeric: tabular-nums; font-weight: 600; color: #111;">
            ${item.confidence ? item.confidence + '%' : '—'}
          </td>
          <td style="color: #57534E;">
            ${Explorer.escapeHtml(item.channel || 'Website')}
          </td>
          <td style="color: #75716B; font-variant-numeric: tabular-nums; font-size: 12.5px;">
            ${item.date || '—'}
          </td>
        </tr>
      `;
    }).join('');
  },

  renderSummaryCards(summary = {}) {
    const totalEl = document.getElementById('metric-total-reviews');
    const posCountEl = document.getElementById('metric-pos-count');
    const posPctEl = document.getElementById('metric-pos-pct');
    const neuCountEl = document.getElementById('metric-neu-count');
    const neuPctEl = document.getElementById('metric-neu-pct');
    const negCountEl = document.getElementById('metric-neg-count');
    const negPctEl = document.getElementById('metric-neg-pct');

    if (totalEl) totalEl.textContent = (summary.total || 0).toLocaleString();
    if (posCountEl) posCountEl.textContent = (summary.positive || 0).toLocaleString();
    if (posPctEl) posPctEl.textContent = `${summary.positive_pct || 0}%`;

    if (neuCountEl) neuCountEl.textContent = (summary.neutral || 0).toLocaleString();
    if (neuPctEl) neuPctEl.textContent = `${summary.neutral_pct || 0}%`;

    if (negCountEl) negCountEl.textContent = (summary.negative || 0).toLocaleString();
    if (negPctEl) negPctEl.textContent = `${summary.negative_pct || 0}%`;
  },

  renderChannelsBreakdown(channels = []) {
    const container = document.getElementById('channels-summary-list');
    if (!container) return;

    if (channels.length === 0) {
      container.innerHTML = `<p style="color: #8C8476; font-size: 13px;">No channel breakdown data available.</p>`;
      return;
    }

    container.innerHTML = channels.map(ch => `
      <div class="channel-row">
        <div class="channel-row-header">
          <span class="channel-row-name">${ch.channel}</span>
          <span class="channel-row-count">${ch.total} reviews (${ch.positive_pct}% pos)</span>
        </div>
        <div class="stacked-bar-track" title="Positive: ${ch.positive_pct}%, Neutral: ${ch.neutral_pct}%, Negative: ${ch.negative_pct}%">
          <div class="stacked-segment seg-pos" style="width: ${ch.positive_pct}%;"></div>
          <div class="stacked-segment seg-neu" style="width: ${ch.neutral_pct}%;"></div>
          <div class="stacked-segment seg-neg" style="width: ${ch.negative_pct}%;"></div>
        </div>
      </div>
    `).join('');
  },

  renderThemesList(themes = []) {
    const container = document.getElementById('themes-summary-list');
    if (!container) return;

    if (themes.length === 0) {
      container.innerHTML = `<p style="color: #8C8476; font-size: 13px;">No feedback themes identified in current dataset.</p>`;
      return;
    }

    container.innerHTML = themes.slice(0, 5).map(th => {
      const b = th.sentiment_breakdown || {};
      return `
        <div class="theme-item">
          <div class="theme-header">
            <span class="theme-name">${th.theme}</span>
            <span class="theme-count">${th.count} mentions (${th.percentage}%)</span>
          </div>
          <div class="theme-sentiment-dots">
            <span style="color: var(--sentiment-pos); font-weight: 600;">+ ${b.Positive || 0}</span>
            <span style="color: var(--sentiment-neu); font-weight: 600;">~ ${b.Neutral || 0}</span>
            <span style="color: var(--sentiment-neg); font-weight: 600;">- ${b.Negative || 0}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  setupWordFreqTabs() {
    const tabs = document.querySelectorAll('.freq-tab[data-sentiment]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeWordFreqSentiment = tab.getAttribute('data-sentiment');
        if (this.dashboardData) {
          this.renderWordFrequency(this.dashboardData.word_frequency || {});
        }
      });
    });
  },

  renderWordFrequency(wordFreq = {}) {
    const container = document.getElementById('word-freq-container');
    if (!container) return;

    const list = wordFreq[this.activeWordFreqSentiment] || [];
    if (list.length === 0) {
      container.innerHTML = `<p style="color: #8C8476; font-size: 13px; padding: 16px 0;">No significant keywords found for this category.</p>`;
      return;
    }

    container.innerHTML = list.slice(0, 10).map(item => `
      <div class="freq-row">
        <span class="freq-word" title="${item.word}">${item.word}</span>
        <div class="freq-bar-wrap">
          <div class="freq-bar-fill" style="width: ${item.percentage}%;"></div>
        </div>
        <span class="freq-count">${item.count}</span>
      </div>
    `).join('');
  },

  // ============================================================================
  // Specialized Views (Channels, Topics, Performance)
  // ============================================================================

  renderChannelsView() {
    const tableBody = document.getElementById('channels-table-body');
    if (!tableBody || !this.dashboardData) return;

    const channels = this.dashboardData.channels || [];
    if (channels.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="empty-state">No channel records.</td></tr>`;
      return;
    }

    tableBody.innerHTML = channels.map(ch => `
      <tr>
        <td style="font-weight: 600;">${ch.channel}</td>
        <td style="font-weight: 700;">${ch.total}</td>
        <td><span class="sentiment-badge badge-pos">${ch.positive} (${ch.positive_pct}%)</span></td>
        <td><span class="sentiment-badge badge-neu">${ch.neutral} (${ch.neutral_pct}%)</span></td>
        <td><span class="sentiment-badge badge-neg">${ch.negative} (${ch.negative_pct}%)</span></td>
        <td>
          <div class="stacked-bar-track" style="width: 140px;">
            <div class="stacked-segment seg-pos" style="width: ${ch.positive_pct}%;"></div>
            <div class="stacked-segment seg-neu" style="width: ${ch.neutral_pct}%;"></div>
            <div class="stacked-segment seg-neg" style="width: ${ch.negative_pct}%;"></div>
          </div>
        </td>
      </tr>
    `).join('');
  },

  renderTopicsView() {
    const container = document.getElementById('topics-full-list');
    if (!container || !this.dashboardData) return;

    const themes = this.dashboardData.themes || [];
    if (themes.length === 0) {
      container.innerHTML = `<p style="color: #8C8476;">No themes identified.</p>`;
      return;
    }

    container.innerHTML = themes.map(th => {
      const b = th.sentiment_breakdown || {};
      const posPct = th.count > 0 ? Math.round(((b.Positive || 0) / th.count) * 100) : 0;
      const neuPct = th.count > 0 ? Math.round(((b.Neutral || 0) / th.count) * 100) : 0;
      const negPct = th.count > 0 ? Math.round(((b.Negative || 0) / th.count) * 100) : 0;

      return `
        <div class="dashboard-card" style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="font-size: 16px; font-weight: 700;">${th.theme}</h4>
            <span style="font-size: 13px; font-weight: 600; color: #57534E;">${th.count} mentions (${th.percentage}% of reviews)</span>
          </div>
          <div class="stacked-bar-track" style="height: 10px; margin-bottom: 12px;">
            <div class="stacked-segment seg-pos" style="width: ${posPct}%;"></div>
            <div class="stacked-segment seg-neu" style="width: ${neuPct}%;"></div>
            <div class="stacked-segment seg-neg" style="width: ${negPct}%;"></div>
          </div>
          <div style="display: flex; gap: 20px; font-size: 13px;">
            <span style="color: var(--sentiment-pos); font-weight: 600;">Positive: ${b.Positive || 0} (${posPct}%)</span>
            <span style="color: var(--sentiment-neu); font-weight: 600;">Neutral: ${b.Neutral || 0} (${neuPct}%)</span>
            <span style="color: var(--sentiment-neg); font-weight: 600;">Negative: ${b.Negative || 0} (${negPct}%)</span>
          </div>
        </div>
      `;
    }).join('');
  },

  async loadModelMetrics() {
    try {
      const res = await API.getMetrics();
      this.metricsData = res.data;
      this.renderModelPerformance();
    } catch (err) {
      console.warn('Failed to load model evaluation metrics:', err);
    }
  },

  renderModelPerformance() {
    if (!this.metricsData) return;
    const m = this.metricsData;

    // Accuracy & F1 metric cards
    const accEl = document.getElementById('metric-model-accuracy');
    const f1El = document.getElementById('metric-model-f1');
    const precEl = document.getElementById('metric-model-precision');
    const recEl = document.getElementById('metric-model-recall');

    if (accEl) accEl.textContent = `${m.accuracy}%`;
    if (f1El) f1El.textContent = `${m.macro_f1}%`;
    if (precEl) precEl.textContent = `${m.macro_precision}%`;
    if (recEl) recEl.textContent = `${m.macro_recall}%`;

    const versionEl = document.getElementById('model-perf-version');
    if (versionEl) versionEl.textContent = m.model_version || 'v1.2-tfidf-logreg';

    const samplesEl = document.getElementById('model-perf-samples');
    if (samplesEl) samplesEl.textContent = `${m.train_samples} train / ${m.test_samples} test (${m.total_samples} total)`;

    // Confusion Matrix
    const cmContainer = document.getElementById('confusion-matrix-container');
    if (cmContainer && m.confusion_matrix) {
      const cm = m.confusion_matrix;
      const labels = cm.labels || ['Negative', 'Neutral', 'Positive'];
      const matrix = cm.matrix || [[0,0,0],[0,0,0],[0,0,0]];

      let tableHtml = `
        <table class="confusion-matrix-table">
          <thead>
            <tr>
              <th style="background: var(--color-stone-light);">True \\ Predicted</th>
              ${labels.map(l => `<th>Predicted ${l}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
      `;

      labels.forEach((trueLabel, rIdx) => {
        tableHtml += `<tr><td style="font-weight: 600; text-align: left; background: var(--color-paper);">${trueLabel}</td>`;
        labels.forEach((predLabel, cIdx) => {
          const val = matrix[rIdx] ? matrix[rIdx][cIdx] : 0;
          const isHit = rIdx === cIdx;
          tableHtml += `<td class="${isHit ? 'cm-cell-hit' : 'cm-cell-miss'}">${val}</td>`;
        });
        tableHtml += `</tr>`;
      });

      tableHtml += `</tbody></table>`;
      cmContainer.innerHTML = tableHtml;
    }

    // Per-class metrics table
    const perClassBody = document.getElementById('per-class-metrics-body');
    if (perClassBody && m.per_class_metrics) {
      perClassBody.innerHTML = Object.entries(m.per_class_metrics).map(([clsName, metrics]) => `
        <tr>
          <td style="font-weight: 600;">${clsName}</td>
          <td style="font-variant-numeric: tabular-nums;">${metrics.precision}%</td>
          <td style="font-variant-numeric: tabular-nums;">${metrics.recall}%</td>
          <td style="font-variant-numeric: tabular-nums; font-weight: 600;">${metrics.f1_score}%</td>
          <td style="font-variant-numeric: tabular-nums; color: #57534E;">${metrics.support}</td>
        </tr>
      `).join('');
    }
  },

  // ============================================================================
  // UI Utilities, Dropdowns, Shortcuts, Mobile Menu
  // ============================================================================

  setupDropdowns() {
    const notifBtn = document.getElementById('btn-topbar-notifications');
    const notifMenu = document.getElementById('notifications-dropdown');
    const userBtn = document.getElementById('btn-topbar-user');
    const userMenu = document.getElementById('user-dropdown');

    if (notifBtn && notifMenu) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (userMenu) userMenu.classList.remove('is-open');
        notifMenu.classList.toggle('is-open');
      });
    }

    if (userBtn && userMenu) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (notifMenu) notifMenu.classList.remove('is-open');
        userMenu.classList.toggle('is-open');
      });
    }

    // Close on document click
    document.addEventListener('click', () => {
      if (notifMenu) notifMenu.classList.remove('is-open');
      if (userMenu) userMenu.classList.remove('is-open');
    });
  },

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K focuses search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const topSearch = document.getElementById('topbar-search-input');
        if (topSearch) {
          topSearch.focus();
          topSearch.select();
        }
      }
      // Escape closes modals
      if (e.key === 'Escape') {
        ImportExport.closeImportModal();
        Explorer.closeDetailModal();
      }
    });

    // Wire topbar search to jump to explorer
    const topSearch = document.getElementById('topbar-search-input');
    if (topSearch) {
      topSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = topSearch.value.trim();
          this.navigateTo('explorer');
          const explorerSearch = document.getElementById('explorer-search-input');
          if (explorerSearch) {
            explorerSearch.value = val;
            Explorer.searchTerm = val.toLowerCase();
            Explorer.applyFilters();
          }
        }
      });
    }
  },

  setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('mobile-open');
      });

      document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
          sidebar.classList.remove('mobile-open');
        }
      });
    }
  }
};

// Bootstrap application on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
