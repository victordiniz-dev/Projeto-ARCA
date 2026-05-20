/* =============================================
   PROGRAMA ARCA - Input Validation
   ============================================= */

const Validation = (function () {
  'use strict';

  /**
   * Validate Email
   * @param {string} email 
   * @returns {boolean}
   */
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Validate CPF
   * @param {string} cpf 
   * @returns {boolean}
   */
  function validateCPF(cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    
    if (cleanCpf.length !== 11) return false;
    
    // Check for known invalid CPFs
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
    
    // Validate digits
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;
    
    return true;
  }

  /**
   * Validate Telephone (at least 10 digits for landline or 11 for mobile)
   * @param {string} phone 
   * @returns {boolean}
   */
  function validatePhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }

  /**
   * Validate CEP (8 digits)
   * @param {string} cep 
   * @returns {boolean}
   */
  function validateCEP(cep) {
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.length === 8;
  }

  /**
   * Check Password Strength (returns 1 to 4)
   * @param {string} password 
   * @returns {number}
   */
  function checkPasswordStrength(password) {
    let score = 0;
    if (!password) return 0;
    
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
    
    return Math.max(1, Math.min(score, 4));
  }

  /**
   * Apply feedback states to input element
   * @param {HTMLInputElement} inputEl 
   * @param {boolean} isValid 
   * @param {string} errorMessage 
   */
  function setFieldState(inputEl, isValid, errorMessage = '') {
    if (!inputEl) return;
    
    const formGroup = inputEl.closest('.form-group');
    let errorEl = formGroup ? formGroup.querySelector('.form-error') : null;
    
    // Add dynamic ID to errorEl for aria-describedby if input has ID
    if (errorEl && inputEl.id) {
      errorEl.id = `${inputEl.id}-error`;
    }
    
    if (isValid) {
      inputEl.classList.remove('is-invalid');
      inputEl.classList.add('is-valid');
      inputEl.setAttribute('aria-invalid', 'false');
      if (errorEl) {
        errorEl.style.display = 'none';
        errorEl.textContent = '';
        inputEl.removeAttribute('aria-describedby');
      }
    } else {
      inputEl.classList.remove('is-valid');
      inputEl.classList.add('is-invalid');
      inputEl.setAttribute('aria-invalid', 'true');
      
      if (errorEl) {
        errorEl.style.display = 'flex';
        errorEl.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          ${errorMessage}
        `;
        inputEl.setAttribute('aria-describedby', errorEl.id);
      }
    }
  }

  /**
   * Reset field validation state
   * @param {HTMLInputElement} inputEl 
   */
  function resetFieldState(inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove('is-valid', 'is-invalid');
    inputEl.removeAttribute('aria-invalid');
    inputEl.removeAttribute('aria-describedby');
    const formGroup = inputEl.closest('.form-group');
    const errorEl = formGroup ? formGroup.querySelector('.form-error') : null;
    if (errorEl) {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
    }
  }

  /**
   * Setup real-time formatting & validations on inputs
   * @param {HTMLFormElement} formEl 
   */
  function setupFormValidation(formEl) {
    if (!formEl) return;

    // Handle inputs with masks and validations
    formEl.querySelectorAll('input').forEach(input => {
      const type = input.getAttribute('data-validate');
      
      if (type === 'cpf') {
        input.addEventListener('input', () => {
          input.value = Utils.formatCPF(input.value);
        });
        input.addEventListener('blur', () => {
          if (input.value) {
            const isValid = validateCPF(input.value);
            setFieldState(input, isValid, 'CPF inválido');
          } else if (input.required) {
            setFieldState(input, false, 'Campo obrigatório');
          } else {
            resetFieldState(input);
          }
        });
      }
      
      if (type === 'phone') {
        input.addEventListener('input', () => {
          input.value = Utils.formatPhone(input.value);
        });
        input.addEventListener('blur', () => {
          if (input.value) {
            const isValid = validatePhone(input.value);
            setFieldState(input, isValid, 'Telefone inválido');
          } else if (input.required) {
            setFieldState(input, false, 'Campo obrigatório');
          } else {
            resetFieldState(input);
          }
        });
      }
      
      if (type === 'cep') {
        input.addEventListener('input', () => {
          input.value = Utils.formatCEP(input.value);
        });
        input.addEventListener('blur', () => {
          if (input.value) {
            const isValid = validateCEP(input.value);
            setFieldState(input, isValid, 'CEP inválido');
          } else if (input.required) {
            setFieldState(input, false, 'Campo obrigatório');
          } else {
            resetFieldState(input);
          }
        });
      }
      
      if (type === 'email') {
        input.addEventListener('blur', () => {
          if (input.value) {
            const isValid = validateEmail(input.value);
            setFieldState(input, isValid, 'E-mail inválido');
          } else if (input.required) {
            setFieldState(input, false, 'Campo obrigatório');
          } else {
            resetFieldState(input);
          }
        });
      }

      if (input.required && type !== 'cpf' && type !== 'phone' && type !== 'cep' && type !== 'email') {
        input.addEventListener('blur', () => {
          if (!input.value.trim()) {
            setFieldState(input, false, 'Campo obrigatório');
          } else {
            setFieldState(input, true);
          }
        });
      }
    });

    // Handle textareas
    formEl.querySelectorAll('textarea[required]').forEach(textarea => {
      textarea.addEventListener('blur', () => {
        if (!textarea.value.trim()) {
          setFieldState(textarea, false, 'Campo obrigatório');
        } else {
          setFieldState(textarea, true);
        }
      });
    });

    // Handle password strength indicators
    const passwordInput = formEl.querySelector('input[data-strength-indicator]');
    const strengthBar = formEl.querySelector('.password-strength');
    const strengthText = formEl.querySelector('.password-strength__text');

    if (passwordInput && strengthBar) {
      const texts = {
        0: 'Senha vazia',
        1: 'Muito fraca',
        2: 'Fraca',
        3: 'Média',
        4: 'Forte!'
      };
      
      passwordInput.addEventListener('input', () => {
        const score = checkPasswordStrength(passwordInput.value);
        strengthBar.setAttribute('data-strength', score);
        if (strengthText) {
          strengthText.textContent = texts[score];
          // Change colors based on score
          const colors = ['#999999', '#E53E3E', '#FFB020', '#5B9FED', '#00D084'];
          strengthText.style.color = colors[score];
        }
      });
    }

    // Toggle password visibility
    formEl.querySelectorAll('.input-action[data-toggle-password]').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const input = toggle.closest('.form-input-wrapper').querySelector('input');
        if (!input) return;
        
        if (input.type === 'password') {
          input.type = 'text';
          toggle.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          `;
        } else {
          input.type = 'password';
          toggle.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          `;
        }
      });
    });
  }

  /**
   * Validate entire form on submit
   * @param {HTMLFormElement} formEl 
   * @returns {boolean}
   */
  function validateForm(formEl) {
    if (!formEl) return false;
    let isFormValid = true;
    
    // Trigger blur on all fields to show errors
    formEl.querySelectorAll('input, select, textarea').forEach(input => {
      const type = input.getAttribute('data-validate');
      
      if (input.required && !input.value.trim()) {
        setFieldState(input, false, 'Campo obrigatório');
        isFormValid = false;
      } else if (input.value) {
        if (type === 'cpf' && !validateCPF(input.value)) {
          setFieldState(input, false, 'CPF inválido');
          isFormValid = false;
        } else if (type === 'phone' && !validatePhone(input.value)) {
          setFieldState(input, false, 'Telefone inválido');
          isFormValid = false;
        } else if (type === 'cep' && !validateCEP(input.value)) {
          setFieldState(input, false, 'CEP inválido');
          isFormValid = false;
        } else if (type === 'email' && !validateEmail(input.value)) {
          setFieldState(input, false, 'E-mail inválido');
          isFormValid = false;
        }
      }
    });
    
    return isFormValid;
  }

  // Public API
  return {
    validateEmail,
    validateCPF,
    validatePhone,
    validateCEP,
    checkPasswordStrength,
    setFieldState,
    resetFieldState,
    setupFormValidation,
    validateForm
  };
})();
