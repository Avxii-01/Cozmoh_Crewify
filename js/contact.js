/**
 * contact.js - Modular Contact Form & WhatsApp Submission Logic
 * 
 * Separates:
 * 1. Form Data Collection
 * 2. Client-Side Validation
 * 3. Message Construction
 * 4. WhatsApp Submission Handler
 * 
 * Future Backend Compatibility:
 * When a backend API is added in the future, only the submission step
 * needs to be redirected to fetch('/api/contact', ...) without changing form markup.
 */

import { CONTACT_CONFIG, getWhatsAppUrl } from './contact-config.js';

/**
 * Validates the contact form fields
 * @param {Object} data - Collected form data
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateContactForm(data) {
  const errors = {};

  // 1. Full Name (Required, minimum 2 characters)
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  // 2. Agency / Company Name (Required)
  if (!data.agencyName || data.agencyName.trim().length < 2) {
    errors.agencyName = 'Please enter your agency or company name.';
  }

  // 3. Work Email (Required, valid email format)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid work email address.';
  }

  // 4. Project Type (Required, must select an option)
  if (!data.projectType || data.projectType.trim() === '') {
    errors.projectType = 'Please select a project type.';
  }

  // 5. Message (Required, minimum 10 characters)
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Please provide a brief description of your project (minimum 10 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Constructs the formatted WhatsApp message from validated form data
 * @param {Object} data - Collected form data
 * @returns {string} Formatted plain-text message
 */
export function formatWhatsAppMessage(data) {
  const phoneVal = (data.phone && data.phone.trim()) ? data.phone.trim() : 'Not provided';
  
  return [
    `Hi CREWiiFY, I'd like to discuss a project.`,
    ``,
    `Name: ${data.fullName.trim()}`,
    `Agency / Company: ${data.agencyName.trim()}`,
    `Email: ${data.email.trim()}`,
    `Phone / WhatsApp: ${phoneVal}`,
    `Project Type: ${data.projectType.trim()}`,
    ``,
    `Project Details:`,
    `${data.message.trim()}`
  ].join('\n');
}

/**
 * Initializes the contact page form and event listeners
 */
export function initContactForm() {
  const form = document.getElementById('contactPageForm');
  if (!form) return;

  // Render configured direct contact details into UI elements if present
  const emailElem = document.getElementById('contactDirectEmail');
  const phoneElem = document.getElementById('contactDirectPhone');
  const responseElem = document.getElementById('contactDirectResponse');

  if (emailElem) {
    emailElem.textContent = CONTACT_CONFIG.EMAIL;
    emailElem.href = `mailto:${CONTACT_CONFIG.EMAIL}`;
  }
  if (phoneElem) {
    phoneElem.textContent = CONTACT_CONFIG.PHONE_DISPLAY;
    phoneElem.href = getWhatsAppUrl(CONTACT_CONFIG.FLOATING_MESSAGE);
  }
  if (responseElem) {
    responseElem.textContent = CONTACT_CONFIG.RESPONSE_TIME;
  }

  // Clear validation error on field input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      clearFieldError(field);
    });
    field.addEventListener('change', () => {
      clearFieldError(field);
    });
  });

  // Handle Form Submission
  let isSubmitting = false;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Collect data
    const formData = {
      fullName: form.fullName?.value || '',
      agencyName: form.agencyName?.value || '',
      email: form.email?.value || '',
      phone: form.phone?.value || '',
      projectType: form.projectType?.value || '',
      message: form.message?.value || ''
    };

    // Clear all previous errors
    clearAllErrors(form);

    // Validate
    const { isValid, errors } = validateContactForm(formData);

    if (!isValid) {
      displayErrors(form, errors);
      // Focus first invalid field
      const firstErrorField = form.querySelector('.is-invalid');
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }

    // Lock submission to prevent rapid duplicates
    isSubmitting = true;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="contact-form__spinner" aria-hidden="true"></span>
        Opening WhatsApp...
      `;
    }

    // Build WhatsApp message
    const formattedMessage = formatWhatsAppMessage(formData);
    const whatsappUrl = getWhatsAppUrl(formattedMessage);

    // Show temporary banner / notice in the form explaining WhatsApp redirection
    showRedirectNotice(form);

    // Open WhatsApp in new window/tab
    setTimeout(() => {
      const opened = window.open(whatsappUrl, '_blank');
      if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        // Pop-up blocked or mobile browser - fallback to direct redirect
        window.location.href = whatsappUrl;
      }

      // Re-enable submit button after redirection attempt
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
        isSubmitting = false;
      }, 2500);
    }, 400);
  });
}

/**
 * Display field-level validation errors
 */
function displayErrors(form, errors) {
  Object.keys(errors).forEach(fieldName => {
    const field = form[fieldName];
    if (!field) return;

    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');

    const errorContainer = document.getElementById(`${fieldName}Error`);
    if (errorContainer) {
      errorContainer.textContent = errors[fieldName];
      errorContainer.style.display = 'block';
    }
  });
}

/**
 * Clear error state for a single field
 */
function clearFieldError(field) {
  field.classList.remove('is-invalid');
  field.removeAttribute('aria-invalid');
  const errorContainer = document.getElementById(`${field.name || field.id}Error`);
  if (errorContainer) {
    errorContainer.textContent = '';
    errorContainer.style.display = 'none';
  }
}

/**
 * Clear all errors across the form
 */
function clearAllErrors(form) {
  form.querySelectorAll('.is-invalid').forEach(field => {
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
  });
  form.querySelectorAll('.contact-form__error-msg').forEach(msg => {
    msg.textContent = '';
    msg.style.display = 'none';
  });
}

/**
 * Show clean redirection feedback notice
 */
function showRedirectNotice(form) {
  let notice = document.getElementById('contactRedirectNotice');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'contactRedirectNotice';
    notice.className = 'contact-form__notice';
    notice.setAttribute('role', 'status');
    const submitBtnWrap = form.querySelector('.contact-form__action-wrap') || form.querySelector('button[type="submit"]')?.parentElement;
    if (submitBtnWrap) {
      submitBtnWrap.parentNode.insertBefore(notice, submitBtnWrap);
    } else {
      form.appendChild(notice);
    }
  }

  notice.innerHTML = `
    <span class="contact-form__notice-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display:block;">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </span>
    <span>Connecting you to WhatsApp with your project details...</span>
  `;
  notice.style.display = 'flex';
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
}
