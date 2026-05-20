/* =============================================
   PROGRAMA ARCA - Dashboard JS / Chart Integration
   ============================================= */

const Dashboard = (function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initSidebar();
    initTabs();
    initFilters();
    initCharts();
    initMockActions();
  }

  /**
   * Sidebar controls
   */
  function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const closeBtn = document.getElementById('sidebarCloseBtn');
    const overlay = document.getElementById('sidebarOverlay');

    if (!sidebar) return;

    if (toggleBtn) {
      toggleBtn.addEventListener('click', openSidebar);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeSidebar);
    }

    if (overlay) {
      overlay.addEventListener('click', closeSidebar);
    }

    function openSidebar() {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('active');
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    }

    // Set active link based on current file
    const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
    const sidebarLinks = sidebar.querySelectorAll('.sidebar__link');
    
    sidebarLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Tabs system
   */
  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(target);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  /**
   * Filtering logic for grids or tables
   */
  function initFilters() {
    const searchInput = document.getElementById('tableSearch');
    const statusSelect = document.getElementById('statusFilter');
    const speciesSelect = document.getElementById('speciesFilter');
    const tableRows = document.querySelectorAll('.data-table tbody tr');

    if (!searchInput && !statusSelect && !speciesSelect) return;

    const filterHandler = Utils.debounce(function () {
      const query = searchInput ? searchInput.value.toLowerCase() : '';
      const status = statusSelect ? statusSelect.value.toLowerCase() : '';
      const species = speciesSelect ? speciesSelect.value.toLowerCase() : '';

      tableRows.forEach(row => {
        let matches = true;

        // Search match
        if (query) {
          const rowText = row.textContent.toLowerCase();
          if (!rowText.includes(query)) matches = false;
        }

        // Status match
        if (status) {
          const rowStatus = row.querySelector('.badge') ? row.querySelector('.badge').textContent.trim().toLowerCase() : '';
          if (rowStatus !== status && !rowStatus.includes(status)) matches = false;
        }

        // Species match
        if (species) {
          const rowSpecies = row.querySelector('[data-species]') ? row.querySelector('[data-species]').getAttribute('data-species').toLowerCase() : '';
          if (rowSpecies !== species) matches = false;
        }

        row.style.display = matches ? '' : 'none';
      });
    }, 150);

    if (searchInput) searchInput.addEventListener('input', filterHandler);
    if (statusSelect) statusSelect.addEventListener('change', filterHandler);
    if (speciesSelect) speciesSelect.addEventListener('change', filterHandler);
  }

  /**
   * Chart.js integration for reports
   */
  function initCharts() {
    const monthlyChartCanvas = document.getElementById('monthlyChart');
    const serviceChartCanvas = document.getElementById('serviceChart');

    if (!monthlyChartCanvas && !serviceChartCanvas) return;

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js is not loaded. Skipping chart initialization.');
      return;
    }

    // Colors aligned with our CSS Variables
    const colorPrimary = '#00D084';
    const colorSecondary = '#5B9FED';
    const colorWarning = '#FFB020';
    const colorDanger = '#E53E3E';

    // Monthly Chart (Line Chart)
    if (monthlyChartCanvas) {
      new Chart(monthlyChartCanvas, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          datasets: [
            {
              label: 'Castrações',
              data: [150, 180, 220, 260, 290, 310, 340, 390, 420, 450, 480, 520],
              borderColor: colorPrimary,
              backgroundColor: 'rgba(0, 208, 132, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              fill: true
            },
            {
              label: 'Resgates',
              data: [40, 45, 55, 60, 50, 65, 70, 85, 90, 80, 95, 110],
              borderColor: colorSecondary,
              backgroundColor: 'rgba(91, 159, 237, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: { family: 'Inter', size: 12 }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#F0F0F0' },
              ticks: { font: { family: 'Inter' } }
            },
            x: {
              grid: { display: false },
              ticks: { font: { family: 'Inter' } }
            }
          }
        }
      });
    }

    // Service Share Chart (Doughnut Chart)
    if (serviceChartCanvas) {
      new Chart(serviceChartCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Castração', 'Adoção', 'Resgate de Urgência', 'Denúncia Atendida'],
          datasets: [{
            data: [55, 20, 15, 10],
            backgroundColor: [colorPrimary, colorSecondary, colorWarning, colorDanger],
            borderWidth: 4,
            borderColor: '#FFFFFF'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { family: 'Inter', size: 12 },
                padding: 20
              }
            }
          },
          cutout: '70%'
        }
      });
    }
  }

  /**
   * Setup Mock Actions (e.g., Export Reports, Action buttons clicks)
   */
  function initMockActions() {
    // Export Report
    const exportBtn = document.getElementById('exportReportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        exportBtn.classList.add('loading');
        setTimeout(() => {
          exportBtn.classList.remove('loading');
          if (window.showToast) window.showToast('Relatório exportado com sucesso em PDF!', 'success');
        }, 1500);
      });
    }

    // Delete Buttons or Cancel Buttons
    document.querySelectorAll('[data-action="mock-cancel"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        if (confirm('Tem certeza que deseja cancelar esta solicitação?')) {
          if (row) {
            const badge = row.querySelector('.badge');
            if (badge) {
              badge.className = 'badge badge--error';
              badge.innerHTML = '<span class="badge-dot"></span> Cancelado';
            }
            if (window.showToast) window.showToast('Agendamento cancelado com sucesso.', 'success');
          }
        }
      });
    });
  }

  // Public API
  return {
    initSidebar
  };
})();
