/**
 * ReviewSense API Client
 * Wraps REST endpoints with error handling and typed responses.
 */

const API = {
  async getDashboard(params = {}) {
    const query = new URLSearchParams();
    if (params.startDate) query.append('start_date', params.startDate);
    if (params.endDate) query.append('end_date', params.endDate);
    if (params.channel) query.append('channel', params.channel);

    const url = `/api/dashboard${query.toString() ? '?' + query.toString() : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch dashboard (${res.status})`);
    }
    return await res.json();
  },

  async analyzeReview(text) {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Analysis failed (${res.status})`);
    }
    return data;
  },

  async uploadCsv(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Upload failed (${res.status})`);
    }
    return data;
  },

  async resetData() {
    const res = await fetch('/api/reset', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Reset failed (${res.status})`);
    }
    return data;
  },

  async getMetrics() {
    const res = await fetch('/api/metrics');
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Failed to fetch metrics (${res.status})`);
    }
    return data;
  },

  getExportUrl() {
    return '/api/export';
  }
};
