/**
 * ReviewSense Review Explorer Table
 * Handles filtering, search, sorting, pagination, and review inspection modal.
 */

const Explorer = {
  allReviews: [],
  filteredReviews: [],
  currentPage: 1,
  pageSize: 10,
  sortColumn: 'date',
  sortDirection: 'desc',

  searchTerm: '',
  sentimentFilter: 'All',
  channelFilter: 'All',

  init(reviews = []) {
    this.allReviews = reviews;
    this.setupListeners();
    this.applyFilters();
  },

  updateData(reviews = []) {
    this.allReviews = reviews;
    this.populateChannelOptions();
    this.applyFilters();
  },

  setupListeners() {
    const searchInput = document.getElementById('explorer-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase().trim();
        this.currentPage = 1;
        this.applyFilters();
      });
    }

    const sentimentSelect = document.getElementById('explorer-sentiment-filter');
    if (sentimentSelect) {
      sentimentSelect.addEventListener('change', (e) => {
        this.sentimentFilter = e.target.value;
        this.currentPage = 1;
        this.applyFilters();
      });
    }

    const channelSelect = document.getElementById('explorer-channel-filter');
    if (channelSelect) {
      channelSelect.addEventListener('change', (e) => {
        this.channelFilter = e.target.value;
        this.currentPage = 1;
        this.applyFilters();
      });
    }

    const clearBtn = document.getElementById('explorer-clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.searchTerm = '';
        this.sentimentFilter = 'All';
        this.channelFilter = 'All';

        if (searchInput) searchInput.value = '';
        if (sentimentSelect) sentimentSelect.value = 'All';
        if (channelSelect) channelSelect.value = 'All';

        this.currentPage = 1;
        this.applyFilters();
      });
    }

    // Pagination buttons
    const prevBtn = document.getElementById('explorer-prev-page');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderTable();
        }
      });
    }

    const nextBtn = document.getElementById('explorer-next-page');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const maxPage = Math.ceil(this.filteredReviews.length / this.pageSize);
        if (this.currentPage < maxPage) {
          this.currentPage++;
          this.renderTable();
        }
      });
    }

    // Table Header Sorting
    document.querySelectorAll('.data-table th[data-sort]').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-sort');
        if (this.sortColumn === col) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = col;
          this.sortDirection = 'desc';
        }
        this.applySorting();
        this.renderTable();
      });
    });
  },

  populateChannelOptions() {
    const channelSelect = document.getElementById('explorer-channel-filter');
    if (!channelSelect) return;

    const channels = [...new Set(this.allReviews.map(r => r.channel).filter(Boolean))].sort();
    const currentVal = channelSelect.value;

    channelSelect.innerHTML = `<option value="All">All Channels</option>`;
    channels.forEach(ch => {
      channelSelect.innerHTML += `<option value="${ch}">${ch}</option>`;
    });

    if (channels.includes(currentVal)) {
      channelSelect.value = currentVal;
    }
  },

  applyFilters() {
    this.filteredReviews = this.allReviews.filter(item => {
      const textMatch = !this.searchTerm || item.review.toLowerCase().includes(this.searchTerm);
      const sentimentMatch = this.sentimentFilter === 'All' || item.sentiment === this.sentimentFilter;
      const channelMatch = this.channelFilter === 'All' || item.channel === this.channelFilter;
      return textMatch && sentimentMatch && channelMatch;
    });

    this.applySorting();
    this.renderTable();
  },

  applySorting() {
    this.filteredReviews.sort((a, b) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      if (this.sortColumn === 'confidence') {
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
      } else {
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  },

  renderTable() {
    const tbody = document.getElementById('explorer-table-body');
    const countLabel = document.getElementById('explorer-total-count');
    const pageIndicator = document.getElementById('explorer-page-indicator');
    const prevBtn = document.getElementById('explorer-prev-page');
    const nextBtn = document.getElementById('explorer-next-page');

    if (countLabel) {
      countLabel.textContent = `${this.filteredReviews.length} ${this.filteredReviews.length === 1 ? 'review' : 'reviews'}`;
    }

    if (!tbody) return;

    if (this.filteredReviews.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p style="font-weight: 600; margin-bottom: 4px;">No reviews found</p>
            <p style="font-size: 13px;">Try adjusting your search query, sentiment, or channel filters.</p>
          </td>
        </tr>
      `;
      if (pageIndicator) pageIndicator.textContent = 'Page 0 of 0';
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    const maxPage = Math.ceil(this.filteredReviews.length / this.pageSize) || 1;
    if (this.currentPage > maxPage) this.currentPage = maxPage;

    const startIdx = (this.currentPage - 1) * this.pageSize;
    const pageItems = this.filteredReviews.slice(startIdx, startIdx + this.pageSize);

    tbody.innerHTML = pageItems.map(item => {
      let badgeClass = 'badge-neu';
      if (item.sentiment === 'Positive') badgeClass = 'badge-pos';
      else if (item.sentiment === 'Negative') badgeClass = 'badge-neg';

      const safeReview = this.escapeHtml(item.review);

      return `
        <tr onclick="Explorer.openDetailModal('${item.id}')" title="Click to inspect review details">
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
            ${this.escapeHtml(item.channel || 'Website')}
          </td>
          <td style="color: #75716B; font-variant-numeric: tabular-nums; font-size: 12.5px;">
            ${item.date || '—'}
          </td>
        </tr>
      `;
    }).join('');

    if (pageIndicator) {
      pageIndicator.textContent = `Page ${this.currentPage} of ${maxPage}`;
    }

    if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
    if (nextBtn) nextBtn.disabled = this.currentPage >= maxPage;
  },

  openDetailModal(reviewId) {
    const item = this.allReviews.find(r => String(r.id) === String(reviewId));
    if (!item) return;

    const modal = document.getElementById('review-detail-modal');
    if (!modal) return;

    let badgeClass = 'badge-neu';
    if (item.sentiment === 'Positive') badgeClass = 'badge-pos';
    else if (item.sentiment === 'Negative') badgeClass = 'badge-neg';

    document.getElementById('modal-review-text').textContent = item.review;
    document.getElementById('modal-review-sentiment').className = `sentiment-badge ${badgeClass}`;
    document.getElementById('modal-review-sentiment').textContent = item.sentiment;
    document.getElementById('modal-review-confidence').textContent = `${item.confidence || 0}%`;
    document.getElementById('modal-review-channel').textContent = item.channel || 'Website';
    document.getElementById('modal-review-date').textContent = item.date || 'Unknown';

    modal.classList.add('is-open');
  },

  closeDetailModal() {
    const modal = document.getElementById('review-detail-modal');
    if (modal) modal.classList.remove('is-open');
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
