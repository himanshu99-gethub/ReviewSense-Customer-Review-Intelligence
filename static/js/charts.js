/**
 * ReviewSense Chart Visualizations (Chart.js wrapper)
 * Renders interactive sentiment trend line chart and distribution donut chart
 * using brand and accessible status color palette.
 */

const Charts = {
  trendChartInstance: null,
  donutChartInstance: null,

  colors: {
    positive: '#16A34A',
    positiveLight: 'rgba(22, 163, 74, 0.1)',
    neutral: '#D97706',
    neutralLight: 'rgba(217, 119, 6, 0.1)',
    negative: '#F95C4B',
    negativeLight: 'rgba(249, 92, 75, 0.1)',
    grid: '#EAE6DF',
    text: '#57534E'
  },

  renderTrendChart(canvasId, trendData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (this.trendChartInstance) {
      this.trendChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    const dates = trendData.dates || [];
    const positive = trendData.positive || [];
    const neutral = trendData.neutral || [];
    const negative = trendData.negative || [];

    if (dates.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = '#8C8476';
      ctx.textAlign = 'center';
      ctx.fillText('No review date data available for current selection.', canvas.width / 2, canvas.height / 2);
      return;
    }

    this.trendChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Positive',
            data: positive,
            borderColor: this.colors.positive,
            backgroundColor: this.colors.positiveLight,
            borderWidth: 2.2,
            tension: 0.3,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: this.colors.positive
          },
          {
            label: 'Neutral',
            data: neutral,
            borderColor: this.colors.neutral,
            backgroundColor: this.colors.neutralLight,
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: this.colors.neutral
          },
          {
            label: 'Negative',
            data: negative,
            borderColor: this.colors.negative,
            backgroundColor: this.colors.negativeLight,
            borderWidth: 2.2,
            tension: 0.3,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: this.colors.negative
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              usePointStyle: true,
              font: {
                family: 'Plus Jakarta Sans',
                size: 12,
                weight: '600'
              },
              color: this.colors.text
            }
          },
          tooltip: {
            backgroundColor: '#000000',
            titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: '700' },
            bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
            padding: 10,
            cornerRadius: 6
          }
        },
        scales: {
          x: {
            grid: { color: 'transparent' },
            ticks: {
              font: { family: 'Plus Jakarta Sans', size: 11 },
              color: this.colors.text,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: this.colors.grid,
              lineWidth: 1
            },
            ticks: {
              font: { family: 'Plus Jakarta Sans', size: 11 },
              color: this.colors.text,
              precision: 0
            }
          }
        }
      }
    });
  },

  renderDonutChart(canvasId, distData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (this.donutChartInstance) {
      this.donutChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    const pos = distData.positive || 0;
    const neu = distData.neutral || 0;
    const neg = distData.negative || 0;
    const total = distData.total || (pos + neu + neg);

    if (total === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = '#8C8476';
      ctx.textAlign = 'center';
      ctx.fillText('No review data', canvas.width / 2, canvas.height / 2);
      return;
    }

    this.donutChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
          data: [pos, neu, neg],
          backgroundColor: [this.colors.positive, this.colors.neutral, this.colors.negative],
          borderColor: '#FFFFFF',
          borderWidth: 3,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#000000',
            bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label(context) {
                const count = context.raw || 0;
                const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                return ` ${context.label}: ${count} (${pct}%)`;
              }
            }
          }
        }
      }
    });

    // Update center donut numbers if present
    const totalEl = document.getElementById('donut-total-count');
    if (totalEl) totalEl.textContent = total.toLocaleString();
  }
};
