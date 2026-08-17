/**
 * Custom Energia Solar — script.js
 * Módulos: Header sticky | Scroll animations | Stats count-up |
 *          Simulador | Carrossel | FAQ Accordion | Contact Form | Cookie Banner
 */

'use strict';

/* ─── CONSTANTES ──────────────────────────────────────────────────────── */
const WA_NUMBER = '5561981093966';
const WA_BASE   = `https://wa.me/${WA_NUMBER}`;

/* ─── UTILITÁRIOS ─────────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function buildWhatsAppLink(text) {
  return `${WA_BASE}?text=${encodeURIComponent(text)}`;
}

/* ─── LUCIDE ICONS ────────────────────────────────────────────────────── */
function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* ─── ANO ATUAL NO FOOTER ─────────────────────────────────────────────── */
function initYear() {
  const el = $('#anoAtual');
  if (el) el.textContent = new Date().getFullYear();
}

/* ─── HEADER STICKY + SCROLL PROGRESS ────────────────────────────────── */
function initHeader() {
  const header    = $('#header');
  const hamburger = $('#hamburger');
  const mainNav   = $('#mainNav');
  const navLinks  = $$('.nav__link');

  if (!header) return;

  // Scroll effect
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on nav link click (mobile)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active nav link on scroll
  const sections = $$('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ─── SCROLL ANIMATIONS (fade-in) ────────────────────────────────────── */
function initScrollAnimations() {
  const items = $$('.fade-in');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));
}

/* ─── COUNT-UP STATS ──────────────────────────────────────────────────── */
function initCountUp() {
  // Apenas elementos com data-target animam; os com stats__number--range ficam estáticos
  const numbers = $$('.stats__number[data-target]');
  if (!numbers.length) return;

  const countUp = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const step = 16;
    const steps = Math.floor(duration / step);
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      // Formata com separador de milhar para números grandes
      const formatted = Math.floor(current).toLocaleString('pt-BR');
      el.textContent = formatted + suffix;
    }, step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  numbers.forEach(n => observer.observe(n));
}

/* ─── SIMULADOR DE ECONOMIA ───────────────────────────────────────────── */
function initSimulador() {
  const form       = $('#simuladorForm');
  const resultado  = $('#simuladorResultado');
  const btnWA      = $('#btnWhatsappSimulador');

  if (!form) return;

  let lastResults = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const valorInput = $('#valorConta');
    const emailInput = $('#emailSimulador');
    const valor = parseFloat(valorInput.value);

    if (!valor || valor < 50) {
      valorInput.focus();
      valorInput.classList.add('input-error');
      valorInput.setAttribute('aria-invalid', 'true');
      const shake = valorInput.closest('.input-prefix') || valorInput;
      shake.style.animation = 'shake 0.4s ease';
      setTimeout(() => { shake.style.animation = ''; }, 400);
      return;
    }

    valorInput.classList.remove('input-error');
    valorInput.removeAttribute('aria-invalid');

    // Validação de e-mail obrigatório
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      if (emailInput) {
        emailInput.focus();
        emailInput.classList.add('input-error');
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.style.animation = 'shake 0.4s ease';
        setTimeout(() => { emailInput.style.animation = ''; }, 400);
      }
      return;
    }
    if (emailInput) {
      emailInput.classList.remove('input-error');
      emailInput.removeAttribute('aria-invalid');
    }

    // ── Custo de Disponibilidade — ANEEL REN 1000/2021 ──
    // Valores padronizados nacionalmente; não variam por estado.
    // Fonte: ANEEL Resolução Normativa 1000/2021, art. 98.
    const CD_KWH = { mono: 30, bi2: 30, bi3: 50, tri: 100 };
    const FASE_LABELS = {
      mono: 'Monofásico',
      bi2:  'Bifásico (2 condutores)',
      bi3:  'Bifásico (3 condutores)',
      tri:  'Trifásico'
    };
    const FASE_TIPOS = {
      mono: 'monofásica',
      bi2:  'bifásica (2 condutores)',
      bi3:  'bifásica (3 condutores)',
      tri:  'trifásica'
    };
    const faseEl    = $('#faseSimulador');
    const fase      = faseEl ? faseEl.value : 'mono';
    const cdKwh     = CD_KWH[fase] || 30;
    const faseLabel = FASE_LABELS[fase] || 'Monofásico';
    const faseTipo  = FASE_TIPOS[fase] || 'monofásica';

    // ── Fórmulas ──
    const economiaM   = valor * 0.85;
    const economiaA   = economiaM * 12;
    const sistemaKWp  = valor * 0.12;
    const custoEst    = sistemaKWp * 3500;
    const paybackAnos = custoEst / economiaA;
    const roi         = Math.round((economiaA / custoEst) * 100);

    lastResults = { valor, economiaM, economiaA, sistemaKWp, custoEst, paybackAnos };

    // ── Fórmulas extras ──
    const custoDia    = (valor - economiaM) / 30;
    const valorImovel = custoEst * 0.10; // valorização estimada mínima ~10%
    const pctReducao  = Math.round((economiaM / valor) * 100);

    // ── Subtitle dinâmico ──
    const tipoImovelEl = $('#tipoImovel');
    const estadoEl     = $('#estadoSimulador');
    const tipoTexto    = tipoImovelEl ? tipoImovelEl.options[tipoImovelEl.selectedIndex].text.replace(/^.*? /, '') : 'Residencial';
    const estadoTexto  = estadoEl    ? estadoEl.options[estadoEl.selectedIndex].text : 'DF';
    const subtitleEl   = $('#resultSubtitle');
    if (subtitleEl) subtitleEl.textContent = `${tipoTexto} · ${faseLabel} · ${estadoTexto}`;

    // ── Preenche resultado ──
    $('#resultEconomia').textContent = formatBRL(economiaM) + '/mês';
    $('#resultAnual').textContent    = formatBRL(economiaA) + '/ano';
    $('#resultSistema').textContent  = `~${sistemaKWp.toFixed(1)} kWp`;
    $('#resultPayback').textContent  = `~${paybackAnos.toFixed(1)} anos`;

    const elROI = $('#resultROI');
    if (elROI) elROI.textContent = `~${roi}% a.a.`;

    const elCustoDia = $('#resultCustoDia');
    if (elCustoDia) elCustoDia.textContent = `~${formatBRL(custoDia)}/dia`;

    const elPatrimonio = $('#resultPatrimonio');
    if (elPatrimonio) elPatrimonio.textContent = `+${formatBRL(valorImovel)} est.`;

    // ── Barra de economia ──
    const elBar = $('#resultBar');
    const elPct = $('#resultPct');
    if (elBar) elBar.style.width = `${Math.min(pctReducao, 100)}%`;
    if (elPct) elPct.textContent = pctReducao;

    // ── Bloco custo de disponibilidade ──
    const elFaseLabel = $('#resultFaseLabel');
    const elFaseTipo  = $('#resultFaseTipo');
    const elCdKwh     = $('#resultCdKwh');
    if (elFaseLabel) elFaseLabel.textContent = faseLabel;
    if (elFaseTipo)  elFaseTipo.textContent  = faseTipo;
    if (elCdKwh)     elCdKwh.textContent     = cdKwh;

    // Reinicializar ícones do bloco CD (se recém inserido no DOM)
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ── Mostra resultado ──
    resultado.removeAttribute('hidden');
    resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // ── Link WhatsApp ──
    const email = emailInput ? emailInput.value : '';
    const msgWA = buildSimuladorWAMessage(valor, economiaM, economiaA, sistemaKWp, paybackAnos, email, faseLabel, cdKwh);
    if (btnWA) btnWA.href = buildWhatsAppLink(msgWA);

    // ── Captura de lead via Formspree ──
    enviarLeadFormspree({
      email: emailVal,
      tipo_imovel: tipoTexto,
      estado:      estadoTexto,
      fase:        faseLabel,
      custo_disponibilidade_kwh: `${cdKwh} kWh/mês (ANEEL)`,
      valor_conta:     `R$ ${valor.toFixed(2).replace('.', ',')}`,
      economia_mensal: formatBRL(economiaM),
      economia_anual:  formatBRL(economiaA),
      sistema_kwp:     `${sistemaKWp.toFixed(1)} kWp`,
      payback:         `${paybackAnos.toFixed(1)} anos`,
      roi_estimado:    `${roi}% a.a.`
    });
  });

  // Reset ao limpar campo
  const valorInput = $('#valorConta');
  if (valorInput) {
    valorInput.addEventListener('input', () => {
      valorInput.classList.remove('input-error');
      valorInput.removeAttribute('aria-invalid');
    });
  }
}

// ─────────────────────────────────────────────
// FORMSPREE — Captura de Leads
// Substitua COLE_SEU_FORM_ID_AQUI pelo ID do seu formulário Formspree
// Ex: se a URL for https://formspree.io/f/xpwzygab  →  use  xpwzygab
// ─────────────────────────────────────────────
const FORMSPREE_ID = 'COLE_SEU_FORM_ID_AQUI';

function enviarLeadFormspree(dados) {
  if (!FORMSPREE_ID || FORMSPREE_ID === 'COLE_SEU_FORM_ID_AQUI') return; // ID não configurado
  fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: `Novo lead simulador — ${dados.email}`,
      ...dados
    })
  }).catch(() => {}); // silencioso — não interrompe o fluxo do usuário
}

function buildSimuladorWAMessage(valor, economiaM, economiaA, sistemaKWp, payback, email, faseLabel, cdKwh) {
  let msg = `Olá! Fiz a simulação no site da Custom Energia Solar:\n\n`;
  msg += `💡 Conta atual: ${formatBRL(valor)}/mês\n`;
  msg += `💰 Economia estimada: ${formatBRL(economiaM)}/mês\n`;
  msg += `📅 Economia anual: ${formatBRL(economiaA)}/ano\n`;
  msg += `⚡ Sistema estimado: ~${sistemaKWp.toFixed(1)} kWp\n`;
  msg += `📈 Payback: ~${payback.toFixed(1)} anos\n`;
  if (faseLabel) msg += `🔌 Tipo de ligação: ${faseLabel}\n`;
  if (cdKwh)     msg += `📋 Custo de disponibilidade (ANEEL): ${cdKwh} kWh/mês\n`;
  if (email)     msg += `📧 E-mail: ${email}\n`;
  msg += `\nGostaria de receber um orçamento personalizado!`;
  return msg;
}

/* ─── CARROSSEL DE DEPOIMENTOS ────────────────────────────────────────── */
function initCarousel() {
  const track    = $('#carouselTrack');
  const btnPrev  = $('#carouselPrev');
  const btnNext  = $('#carouselNext');
  const dotsWrap = $('#carouselDots');

  if (!track) return;

  const items  = $$('.testimonial', track);
  const total  = items.length;
  let current  = 0;
  let autoplay = null;

  // Build dots
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    $$('.carousel__dot', dotsWrap).forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function startAutoplay() {
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplay);
  }

  btnPrev && btnPrev.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
  btnNext && btnNext.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });

  // Touch/swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAutoplay();
      goTo(diff > 0 ? current + 1 : current - 1);
      startAutoplay();
    }
  });

  // Pause on hover
  const carousel = $('#carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  // Keyboard navigation
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { stopAutoplay(); goTo(current + 1); startAutoplay(); }
    if (e.key === 'ArrowLeft')  { stopAutoplay(); goTo(current - 1); startAutoplay(); }
  });

  startAutoplay();
}

/* ─── FAQ ACCORDION ───────────────────────────────────────────────────── */
function initFAQ() {
  const questions = $$('.faq__question');

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answer     = btn.nextElementSibling;

      // Close all others
      questions.forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.classList.remove('open');
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', String(!isExpanded));
      answer.classList.toggle('open', !isExpanded);
    });
  });
}

/* ─── FORMULÁRIO DE CONTATO → WHATSAPP ───────────────────────────────── */
function initContactForm() {
  const form = $('#contatoForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate required fields
    const required = $$('[required]', form);
    let hasError = false;

    required.forEach(field => {
      field.classList.remove('input-error');
      field.removeAttribute('aria-invalid');

      if (!field.value.trim()) {
        field.classList.add('input-error');
        field.setAttribute('aria-invalid', 'true');
        if (!hasError) { field.focus(); hasError = true; }
      }
    });

    if (hasError) return;

    const nome      = $('#nome').value.trim();
    const telefone  = $('#telefone').value.trim();
    const email     = $('#email').value.trim();
    const tipo      = $('#tipo').value;
    const mensagem  = $('#mensagem').value.trim();

    const tipoLabel = {
      residencial: 'Residencial',
      comercial:   'Comercial',
      industrial:  'Industrial',
      rural:       'Rural / Agronegócio',
      manutencao:  'Manutenção',
    }[tipo] || tipo;

    let msg = `Olá! Vim pelo site da Custom Energia Solar e tenho interesse em um orçamento.\n\n`;
    msg += `👤 Nome: ${nome}\n`;
    msg += `📱 Telefone: ${telefone}\n`;
    if (email)    msg += `📧 E-mail: ${email}\n`;
    msg += `🏠 Tipo: ${tipoLabel}\n`;
    if (mensagem) msg += `\n💬 Mensagem:\n${mensagem}`;

    window.open(buildWhatsAppLink(msg), '_blank', 'noopener');
  });

  // Remove error class on input
  $$('input, select, textarea', form).forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('input-error');
      field.removeAttribute('aria-invalid');
    });
  });

  // Phone mask
  const phoneInput = $('#telefone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      let v = phoneInput.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 6)       v = `(${v.slice(0,2)}) ${v.slice(2,3)} ${v.slice(3,7)}-${v.slice(7)}`;
      else if (v.length > 2)  v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      phoneInput.value = v;
    });
  }
}

/* ─── COOKIE BANNER ───────────────────────────────────────────────────── */
function initCookieBanner() {
  const banner    = $('#cookieBanner');
  const btnAccept = $('#cookieAccept');
  const btnReject = $('#cookieReject');

  if (!banner) return;

  const hasCookie = localStorage.getItem('custom_cookie_consent');
  if (!hasCookie) {
    // Small delay so banner doesn't flash immediately
    setTimeout(() => { banner.removeAttribute('hidden'); }, 1200);
  }

  const dismiss = (value) => {
    localStorage.setItem('custom_cookie_consent', value);
    banner.style.animation = 'slideDown 0.3s ease forwards';
    setTimeout(() => { banner.setAttribute('hidden', ''); }, 300);
  };

  btnAccept && btnAccept.addEventListener('click', () => dismiss('all'));
  btnReject && btnReject.addEventListener('click', () => dismiss('essential'));
}

/* ─── SMOOTH ANCHOR SCROLL ────────────────────────────────────────────── */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    const header = $('#header');
    const offset = header ? header.offsetHeight : 0;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset - 8;

    window.scrollTo({ top, behavior: 'smooth' });
  });
}

/* ─── SHAKE ANIMATION CSS (injected) ─────────────────────────────────── */
function injectExtraStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
    .input-error {
      border-color: #e53e3e !important;
      background: rgba(229, 62, 62, 0.06) !important;
    }
    @keyframes slideDown {
      from { transform: translateY(0); }
      to   { transform: translateY(100%); }
    }
  `;
  document.head.appendChild(style);
}

/* ─── INIT ────────────────────────────────────────────────────────────── */
function init() {
  injectExtraStyles();
  initIcons();
  initYear();
  initHeader();
  initScrollAnimations();
  initCountUp();
  initSimulador();
  initCarousel();
  initFAQ();
  initContactForm();
  initCookieBanner();
  initSmoothScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
