/* =============================================
   PROGRAMA ARCA - Utilities / Helpers
   ============================================= */

const Utils = (function () {
  'use strict';

  /**
   * Format CPF (000.000.000-00)
   * @param {string} value 
   * @returns {string}
   */
  function formatCPF(value) {
    if (!value) return '';
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .substring(0, 14);
  }

  /**
   * Format Phone ((00) 00000-0000)
   * @param {string} value 
   * @returns {string}
   */
  function formatPhone(value) {
    if (!value) return '';
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 10) {
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d{1,4})$/, '$1-$2')
        .substring(0, 14);
    }
    return cleanValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
      .substring(0, 15);
  }

  /**
   * Format CEP (00000-000)
   * @param {string} value 
   * @returns {string}
   */
  function formatCEP(value) {
    if (!value) return '';
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  }

  /**
   * Format Date (DD/MM/YYYY)
   * @param {string|Date} value 
   * @returns {string}
   */
  function formatDate(value) {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) return '';
    
    // Adjust to local timezone
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Format Currency (R$ 0,00)
   * @param {number} value 
   * @returns {string}
   */
  function formatCurrency(value) {
    if (value === undefined || value === null) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * LocalStorage wrapper with expiry option
   */
  const Storage = {
    set: function (key, value, ttl) {
      const now = new Date();
      const item = {
        value: value,
        expiry: ttl ? now.getTime() + ttl : null
      };
      localStorage.setItem(key, JSON.stringify(item));
    },
    
    get: function (key) {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      try {
        const item = JSON.parse(itemStr);
        if (item.expiry) {
          const now = new Date();
          if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
          }
        }
        return item.value;
      } catch (e) {
        return null;
      }
    },
    
    remove: function (key) {
      localStorage.removeItem(key);
    },
    
    clear: function () {
      localStorage.clear();
    }
  };

  /**
   * Debounce function execution
   * @param {Function} func 
   * @param {number} wait 
   * @returns {Function}
   */
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  /**
   * Throttle function execution
   * @param {Function} func 
   * @param {number} limit 
   * @returns {Function}
   */
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Public API
  return {
    formatCPF,
    formatPhone,
    formatCEP,
    formatDate,
    formatCurrency,
    Storage,
    debounce,
    throttle
  };
})();
