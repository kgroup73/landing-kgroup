/* =========================================================
   KGroup — Landing
   ⚙️  CONFIGURACIÓN: cambia SOLO este bloque con tus datos reales.
   ========================================================= */
const CONTACT = {
  // Número de WhatsApp en formato internacional, solo dígitos (sin +, espacios ni guiones)
  whatsapp: '573148316310',
  // Texto que se precarga al abrir WhatsApp
  whatsappMsg: 'Hola KGroup 👋 Quiero cotizar un proyecto de software.',
  // Correo comercial
  email: 'kgroupmed@gmail.com',
  // Teléfono visible en el footer
  phoneDisplay: '+57 314 831 6310',

  // Endpoint para enviar correos vía Resend API
  endpoint: '/api/contacto'
};

/* ========================================================= */

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const waUrl = (msg = CONTACT.whatsappMsg) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;

/* ---------- Datos de contacto en el DOM ---------- */
function hydrateContact() {
  const wa = waUrl();
  ['#waLink', '#fabWa'].forEach(sel => { const el = $(sel); if (el) el.href = wa; });
  $$('.footer__social a[aria-label="WhatsApp"]').forEach(a => {
    a.href = wa; a.target = '_blank'; a.rel = 'noopener';
  });

  const mail = $('#mailLink');
  if (mail) { mail.href = `mailto:${CONTACT.email}`; $('#mailText').textContent = CONTACT.email; }

  const footMail = $('#footMail');
  if (footMail) { footMail.href = `mailto:${CONTACT.email}`; footMail.textContent = CONTACT.email; }

  const footPhone = $('#footPhone');
  if (footPhone) {
    footPhone.href = `tel:${CONTACT.phoneDisplay.replace(/\s/g, '')}`;
    footPhone.textContent = CONTACT.phoneDisplay;
  }

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------- Nav: fondo al hacer scroll + menú móvil ---------- */
function initNav() {
  const nav = $('#nav');
  const links = $('#navLinks');
  const burger = $('#navBurger');

  const onScroll = () => {
    const isStuck = window.scrollY > 24;
    nav.classList.toggle('is-stuck', isStuck);
    $('#fabWa')?.classList.toggle('is-visible', isStuck);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const closeMenu = () => {
    links.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    // el menú móvil va sobre fondo oscuro: forzamos el estado "stuck" fuera
    if (open) nav.classList.remove('is-stuck');
    else onScroll();
  });

  $$('a', links).forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

/* ---------- Animaciones al entrar en pantalla ---------- */
function initReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => io.observe(el));
}

/* ---------- Contadores de estadísticas ---------- */
function initCounters() {
  const nums = $$('[data-count]');
  if (!nums.length || !('IntersectionObserver' in window)) return;

  const run = el => {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1400;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('es-CO');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });

  nums.forEach(n => io.observe(n));
}

/* ---------- Filtros del portafolio ---------- */
function initPortfolio() {
  const filters = $$('.filter');
  const projects = $$('.project');
  if (!filters.length) return;

  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(f => { f.classList.remove('is-active'); f.setAttribute('aria-selected', 'false'); });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');

    const cat = btn.dataset.filter;
    projects.forEach(p => {
      const show = cat === 'all' || p.dataset.cat === cat;
      p.classList.toggle('is-hidden', !show);
    });
  }));
}

/* ---------- FAQ: solo un item abierto a la vez ---------- */
function initFaq() {
  const items = $$('.faq__item');
  items.forEach(item => item.addEventListener('toggle', () => {
    if (item.open) items.forEach(o => { if (o !== item) o.open = false; });
  }));
}

/* ---------- Formulario de contacto ---------- */
function initForm() {
  const form = $('#leadForm');
  if (!form) return;
  const status = $('#formStatus');

  const toggleBtn = $('#toggleFormBtn');
  const formContainer = $('#formContainer');
  if (toggleBtn && formContainer) {
    toggleBtn.addEventListener('click', () => {
      const expanded = formContainer.classList.toggle('is-expanded');
      toggleBtn.setAttribute('aria-expanded', String(expanded));
      if (expanded) {
        setTimeout(() => {
          formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
          formContainer.querySelector('input[name="nombre"]')?.focus();
        }, 300);
      }
    });
  }

  const setError = (field, msg) => {
    field.classList.add('has-error');
    if (!field.querySelector('.field__error')) {
      const s = document.createElement('small');
      s.className = 'field__error';
      s.textContent = msg;
      field.appendChild(s);
    }
  };
  const clearError = field => {
    field.classList.remove('has-error');
    field.querySelector('.field__error')?.remove();
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const statusEl = $('#formStatus', form) || $('#formStatus');
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'form__status';
    }

    // Honeypot: si un bot lo llena, fingimos éxito y no enviamos nada.
    if (form.website.value) {
      if (statusEl) statusEl.textContent = '¡Gracias! Te contactamos pronto.';
      return;
    }

    // Validación
    let ok = true;
    $$('.field', form).forEach(clearError);

    const required = [...form.querySelectorAll('[required]')];
    required.forEach(input => {
      const field = input.closest('.field');
      if (!input.value.trim()) { setError(field, 'Este campo es obligatorio'); ok = false; }
      else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value)) {
        setError(field, 'Escribe un correo válido'); ok = false;
      } else if (input.type === 'tel' && input.value.replace(/\D/g, '').length < 7) {
        setError(field, 'Escribe un número válido'); ok = false;
      }
    });

    if (!ok) {
      if (statusEl) {
        statusEl.textContent = 'Por favor revisa los campos marcados.';
        statusEl.classList.add('is-error');
      }
      form.querySelector('.has-error input, .has-error textarea')?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    delete data.website;

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Enviando mensaje…';

    // 1) Si hay endpoint configurado (Resend API), se envía ahí.
    if (CONTACT.endpoint) {
      try {
        const res = await fetch(CONTACT.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data)
        });
        const resJson = await res.json().catch(() => ({}));
        if (!res.ok || !resJson.ok) throw new Error(resJson.error || 'Respuesta ' + res.status);
        
        form.reset();
        if (statusEl) {
          statusEl.textContent = '';
        }

        // Muestra la notificación flotante Toast de éxito
        showToast('¡Listo! Recibimos tu solicitud, nos pondremos en contacto contigo en menos de 24 horas.');
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = 'No pudimos enviar el correo. Por favor escríbenos directamente por WhatsApp.';
          statusEl.classList.add('is-error');
        }
      } finally {
        btn.disabled = false;
        btn.innerHTML = original;
      }
      return;
    }

    // 2) Sin endpoint: abrimos WhatsApp con el resumen del lead.
    const msg =
      `Hola KGroup 👋 Quiero información sobre un proyecto.\n\n` +
      `• Nombre: ${data.nombre}\n` +
      `• Empresa: ${data.empresa || '—'}\n` +
      `• Correo: ${data.email}\n` +
      `• WhatsApp: ${data.telefono}\n` +
      `• Proyecto: ${data.mensaje || '—'}`;

    window.open(waUrl(msg), '_blank', 'noopener');
    status.textContent = '¡Gracias! Abrimos WhatsApp con tus datos para terminar de enviarlo.';
    status.classList.add('is-ok');
    btn.disabled = false;
    btn.innerHTML = original;
  });

  // Limpiar el error al corregir
  $$('input, select, textarea', form).forEach(el =>
    el.addEventListener('input', () => clearError(el.closest('.field') || document.createElement('div')))
  );
}

/* ---------- Notificación Toast Flotante ---------- */
let toastTimer = null;
function showToast(msg) {
  const toast = $('#toastNotice');
  const toastMsg = $('#toastMessage');
  const toastClose = $('#toastClose');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('is-show');

  if (toastClose) {
    toastClose.onclick = () => toast.classList.remove('is-show');
  }

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-show');
  }, 6500);
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  hydrateContact();
  initNav();
  initReveal();
  initCounters();
  initPortfolio();
  initFaq();
  initForm();
});
