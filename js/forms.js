/* =============================================
   PROGRAMA ARCA - Forms, Multi-step, Uploads
   ============================================= */

const Forms = (function () {
  'use strict';

  /**
   * Setup ViaCEP CEP lookup integration
   * @param {string} cepInputId 
   * @param {object} fieldIds { street, neighborhood, city, state }
   */
  function setupViaCEP(cepInputId, fieldIds) {
    const cepInput = document.getElementById(cepInputId);
    if (!cepInput) return;

    const streetInput = document.getElementById(fieldIds.street);
    const neighborhoodInput = document.getElementById(fieldIds.neighborhood);
    const cityInput = document.getElementById(fieldIds.city);
    const stateInput = document.getElementById(fieldIds.state);

    const lookupCEP = Utils.debounce(async function () {
      const cep = cepInput.value.replace(/\D/g, '');
      if (cep.length !== 8) return;

      cepInput.classList.add('loading');
      
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        cepInput.classList.remove('loading');

        if (data.erro) {
          Validation.setFieldState(cepInput, false, 'CEP não encontrado');
          return;
        }

        Validation.setFieldState(cepInput, true);

        if (streetInput) {
          streetInput.value = data.logradouro || '';
          Validation.setFieldState(streetInput, true);
        }
        if (neighborhoodInput) {
          neighborhoodInput.value = data.bairro || '';
          Validation.setFieldState(neighborhoodInput, true);
        }
        if (cityInput) {
          cityInput.value = data.localidade || '';
          Validation.setFieldState(cityInput, true);
        }
        if (stateInput) {
          stateInput.value = data.uf || '';
          Validation.setFieldState(stateInput, true);
        }

        // Focus number input if it exists
        const numberInput = document.getElementById('numero');
        if (numberInput) numberInput.focus();

      } catch (error) {
        cepInput.classList.remove('loading');
        Validation.setFieldState(cepInput, false, 'Erro ao buscar CEP');
      }
    }, 500);

    cepInput.addEventListener('input', lookupCEP);
  }

  /**
   * Setup Drag & Drop File Upload with preview
   * @param {string} uploadContainerId 
   * @param {string} fileInputId 
   * @param {string} previewContainerId 
   */
  function setupFileUpload(uploadContainerId, fileInputId, previewContainerId) {
    const container = document.getElementById(uploadContainerId);
    const input = document.getElementById(fileInputId);
    const preview = document.getElementById(previewContainerId);

    if (!container || !input) return;

    // Highlight drop area
    ['dragenter', 'dragover'].forEach(eventName => {
      container.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      container.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
      e.preventDefault();
      container.classList.add('drag-over');
    }

    function unhighlight(e) {
      e.preventDefault();
      container.classList.remove('drag-over');
    }

    // Handle dropped files
    container.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      input.files = files;
      handleFiles(files);
    }

    // Handle selected files
    input.addEventListener('change', function () {
      handleFiles(this.files);
    });

    function handleFiles(files) {
      if (files.length === 0) return;
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        if (window.showToast) window.showToast('Por favor, envie apenas imagens.', 'error');
        input.value = '';
        return;
      }

      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        if (window.showToast) window.showToast('A imagem deve ter no máximo 5MB.', 'error');
        input.value = '';
        return;
      }

      // Generate preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        if (preview) {
          preview.innerHTML = `
            <div class="file-upload__preview animate-scale-in">
              <img src="${reader.result}" alt="Preview do Upload">
            </div>
          `;
        }
      };
    }
  }

  /**
   * Setup Multi-step form (stepper)
   * @param {string} formId 
   * @param {string} stepperId 
   */
  function setupMultiStepForm(formId, stepperId) {
    const form = document.getElementById(formId);
    const stepper = document.getElementById(stepperId);
    if (!form || !stepper) return;

    const steps = Array.from(form.querySelectorAll('.form-step'));
    const circles = Array.from(stepper.querySelectorAll('.stepper__circle'));
    const lines = Array.from(stepper.querySelectorAll('.stepper__line'));
    let currentStep = 0;

    // Show initial step
    showStep(currentStep);

    // Bind next buttons
    form.querySelectorAll('[data-action="next"]').forEach(button => {
      button.addEventListener('click', () => {
        // Validate current step before proceeding
        const fields = Array.from(steps[currentStep].querySelectorAll('input, select, textarea'));
        let isStepValid = true;

        fields.forEach(field => {
          if (field.required && !field.value.trim()) {
            Validation.setFieldState(field, false, 'Campo obrigatório');
            isStepValid = false;
          } else if (field.value && field.classList.contains('is-invalid')) {
            isStepValid = false;
          }
        });

        if (isStepValid) {
          currentStep++;
          showStep(currentStep);
        } else {
          if (window.showToast) window.showToast('Por favor, corrija os erros na etapa atual.', 'warning');
        }
      });
    });

    // Bind prev buttons
    form.querySelectorAll('[data-action="prev"]').forEach(button => {
      button.addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
      });
    });

    function showStep(stepIndex) {
      steps.forEach((step, idx) => {
        step.classList.toggle('active', idx === stepIndex);
      });

      // Update stepper circles & lines
      circles.forEach((circle, idx) => {
        if (idx < stepIndex) {
          circle.className = 'stepper__circle completed';
          circle.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="16" height="16">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
        } else if (idx === stepIndex) {
          circle.className = 'stepper__circle active';
          circle.innerHTML = idx + 1;
        } else {
          circle.className = 'stepper__circle';
          circle.innerHTML = idx + 1;
        }
      });

      lines.forEach((line, idx) => {
        line.classList.toggle('active', idx < stepIndex);
      });

      // Save draft data in local storage
      saveDraft();
    }

    // Save temporary data
    function saveDraft() {
      const formData = {};
      form.querySelectorAll('input:not([type="password"]), select, textarea').forEach(field => {
        if (field.id && field.value) {
          formData[field.id] = field.value;
        }
      });
      Utils.Storage.set(`${formId}_draft`, formData, 30 * 60 * 1000); // 30 mins
    }

    // Restore draft data if exists
    function restoreDraft() {
      const draft = Utils.Storage.get(`${formId}_draft`);
      if (!draft) return;

      Object.keys(draft).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
          field.value = draft[key];
          Validation.setFieldState(field, true);
        }
      });
    }

    // Restore draft on startup
    restoreDraft();
  }

  // Public API
  return {
    setupViaCEP,
    setupFileUpload,
    setupMultiStepForm
  };
})();
