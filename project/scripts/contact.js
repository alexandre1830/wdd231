/**
 * contact.js — Contact page module
 * Form validation, submission, and confirmation data display
 */

import { savePreference, getPreference } from './storage.js';

export function initContact() {
  prefillSavedData();
  initFormValidation();
}

// --- Prefill with saved data ---

function prefillSavedData() {
  const savedName  = getPreference('contact_name');
  const savedEmail = getPreference('contact_email');
  const savedPhone = getPreference('contact_phone');

  if (savedName)  setField('name',  savedName);
  if (savedEmail) setField('email', savedEmail);
  if (savedPhone) setField('phone', savedPhone);
}

function setField(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

// --- Form Validation ---

function initFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    { required: true, minLen: 2, label: 'Nome' },
    phone:   { required: true, pattern: /^[\d\s()+\-]{8,}$/, label: 'Telefone' },
    email:   { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'E-mail' },
    address: { required: true, minLen: 5, label: 'Endereço' },
    order:   { required: true, minLen: 10, label: 'Descrição do pedido' },
  };

  // Live validation on blur
  Object.keys(fields).forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('blur', () => validateField(id, fields[id]));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(id, fields[id]);
    });
  });

  // Save name/email/phone to local storage on input
  ['name', 'email', 'phone'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', (e) => {
      savePreference(`contact_${id}`, e.target.value);
    });
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isValid = Object.keys(fields).every(id => validateField(id, fields[id]));
    if (!isValid) {
      const firstError = form.querySelector('.form-input.error, .form-textarea.error');
      firstError?.focus();
      return;
    }

    submitForm(form);
  });
}

function validateField(id, rules) {
  const input = document.getElementById(id);
  if (!input) return true;

  const group = input.closest('.form-group');
  const value = input.value.trim();
  let errorMsg = '';

  if (rules.required && !value) {
    errorMsg = `${rules.label} é obrigatório.`;
  } else if (value && rules.minLen && value.length < rules.minLen) {
    errorMsg = `${rules.label} deve ter pelo menos ${rules.minLen} caracteres.`;
  } else if (value && rules.pattern && !rules.pattern.test(value)) {
    errorMsg = `${rules.label} inválido.`;
  }

  if (errorMsg) {
    input.classList.add('error');
    group?.classList.add('has-error');
    const msg = group?.querySelector('.form-error-msg');
    if (msg) msg.textContent = errorMsg;
    return false;
  } else {
    input.classList.remove('error');
    group?.classList.remove('has-error');
    return true;
  }
}

function submitForm(form) {
  const data = {
    name:    document.getElementById('name')?.value.trim(),
    phone:   document.getElementById('phone')?.value.trim(),
    email:   document.getElementById('email')?.value.trim(),
    address: document.getElementById('address')?.value.trim(),
    order:   document.getElementById('order')?.value.trim(),
  };

  // Save submission to sessionStorage for confirmation page
  try {
    sessionStorage.setItem('brownie_submission', JSON.stringify(data));
  } catch (err) {
    console.warn('sessionStorage unavailable:', err);
  }

  // Navigate to confirmation page
  window.location.href = 'confirmacao.html';
}

// --- Confirmation Page ---

export function initConfirmation() {
  try {
    const raw = sessionStorage.getItem('brownie_submission');
    if (!raw) {
      redirectIfEmpty();
      return;
    }

    const data = JSON.parse(raw);
    renderSubmissionData(data);

    // Clear after display
    sessionStorage.removeItem('brownie_submission');
  } catch (err) {
    console.error('Error reading submission data:', err);
    redirectIfEmpty();
  }
}

function renderSubmissionData(data) {
  const container = document.getElementById('submission-data');
  if (!container) return;

  const rows = [
    { key: 'Nome',            val: data.name    },
    { key: 'Telefone',        val: data.phone   },
    { key: 'E-mail',          val: data.email   },
    { key: 'Endereço',        val: data.address },
    { key: 'Pedido',          val: data.order   },
  ];

  container.innerHTML = rows
    .filter(r => r.val)
    .map(r => `
      <div class="data-row">
        <span class="data-key">${r.key}:</span>
        <span class="data-val">${escapeHtml(r.val)}</span>
      </div>`)
    .join('');
}

function redirectIfEmpty() {
  const container = document.getElementById('submission-data');
  if (container) {
    container.innerHTML = '<p style="color:var(--gray-mid);text-align:center">Nenhum dado de pedido encontrado.</p>';
  }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
