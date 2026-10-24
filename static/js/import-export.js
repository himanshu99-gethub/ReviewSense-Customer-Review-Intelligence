/**
 * ReviewSense CSV Import & Export Controller
 */

const ImportExport = {
  selectedFile: null,

  init() {
    this.setupModalControls();
    this.setupDropzone();
    this.setupExportAction();
    this.setupResetAction();
  },

  setupModalControls() {
    const importBtns = document.querySelectorAll('.action-import-reviews');
    const modal = document.getElementById('import-csv-modal');
    const closeBtns = document.querySelectorAll('.close-import-modal');

    importBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openImportModal();
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeImportModal();
      });
    });

    // Close on backdrop click
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeImportModal();
      });
    }
  },

  openImportModal() {
    const modal = document.getElementById('import-csv-modal');
    if (!modal) return;
    this.resetImportState();
    modal.classList.add('is-open');
  },

  closeImportModal() {
    const modal = document.getElementById('import-csv-modal');
    if (modal) modal.classList.remove('is-open');
  },

  resetImportState() {
    this.selectedFile = null;
    const fileInput = document.getElementById('csv-file-input');
    const fileLabel = document.getElementById('selected-file-label');
    const uploadBtn = document.getElementById('btn-execute-upload');
    const errorBox = document.getElementById('import-error-msg');

    if (fileInput) fileInput.value = '';
    if (fileLabel) fileLabel.textContent = 'Drag and drop your CSV here, or click to browse';
    if (uploadBtn) {
      uploadBtn.disabled = true;
      uploadBtn.innerHTML = 'Import Reviews';
    }
    if (errorBox) {
      errorBox.textContent = '';
      errorBox.style.display = 'none';
    }
  },

  setupDropzone() {
    const dropzone = document.getElementById('csv-dropzone');
    const fileInput = document.getElementById('csv-file-input');
    const fileLabel = document.getElementById('selected-file-label');
    const uploadBtn = document.getElementById('btn-execute-upload');

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.handleFileSelected(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.handleFileSelected(e.target.files[0]);
      }
    });

    if (uploadBtn) {
      uploadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.executeUpload();
      });
    }
  },

  handleFileSelected(file) {
    const fileLabel = document.getElementById('selected-file-label');
    const uploadBtn = document.getElementById('btn-execute-upload');
    const errorBox = document.getElementById('import-error-msg');

    if (errorBox) errorBox.style.display = 'none';

    if (!file.name.toLowerCase().endsWith('.csv')) {
      if (errorBox) {
        errorBox.textContent = 'Invalid file format. Please choose a .csv file.';
        errorBox.style.display = 'block';
      }
      return;
    }

    this.selectedFile = file;
    if (fileLabel) {
      fileLabel.innerHTML = `Selected: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
    }
    if (uploadBtn) uploadBtn.disabled = false;
  },

  async executeUpload() {
    if (!this.selectedFile) return;

    const uploadBtn = document.getElementById('btn-execute-upload');
    const errorBox = document.getElementById('import-error-msg');

    if (uploadBtn) {
      uploadBtn.disabled = true;
      uploadBtn.innerHTML = `
        <svg class="spinning" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10"/>
        </svg>
        Uploading & Analyzing...
      `;
    }

    try {
      const response = await API.uploadCsv(this.selectedFile);
      Notifications.show(response.message || 'CSV imported successfully!', 'success');
      this.closeImportModal();
      
      // Update application state with returned updated dashboard data
      if (window.App && response.data) {
        window.App.applyDashboardData(response.data);
      } else if (window.App) {
        window.App.refreshDashboard();
      }
    } catch (err) {
      if (errorBox) {
        errorBox.textContent = err.message || 'Import failed. Please check your CSV columns.';
        errorBox.style.display = 'block';
      }
      Notifications.show(err.message || 'Upload failed.', 'error');
    } finally {
      if (uploadBtn) {
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = 'Import Reviews';
      }
    }
  },

  setupExportAction() {
    const exportBtns = document.querySelectorAll('.action-export-report');
    exportBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        Notifications.show('Preparing and downloading analyzed review CSV...', 'info');
        window.location.href = API.getExportUrl();
      });
    });
  },

  setupResetAction() {
    const resetBtns = document.querySelectorAll('.action-reset-dataset');
    resetBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!confirm('Restore starter dataset? Any custom imported reviews will be replaced by the original sample dataset.')) {
          return;
        }

        try {
          const response = await API.resetData();
          Notifications.show(response.message || 'Starter dataset restored.', 'success');
          if (window.App && response.data) {
            window.App.applyDashboardData(response.data);
          } else if (window.App) {
            window.App.refreshDashboard();
          }
        } catch (err) {
          Notifications.show(err.message || 'Failed to reset dataset.', 'error');
        }
      });
    });
  }
};
