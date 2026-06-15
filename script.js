/* =========================================================
   Forma Studio — interações do site
   ========================================================= */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* -------------------------------------------------------
     Navbar — muda de estilo ao rolar
     ------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScrollNav = () =>
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();
  }

  /* -------------------------------------------------------
     Barra de progresso de leitura
     ------------------------------------------------------- */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  /* -------------------------------------------------------
     Menu mobile (hambúrguer)
     ------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    };
    const toggleMenu = () => {
      const willOpen = !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', willOpen);
      navToggle.classList.toggle('active', willOpen);
      navToggle.setAttribute('aria-expanded', String(willOpen));
      document.body.classList.toggle('menu-open', willOpen);
    };

    navToggle.addEventListener('click', toggleMenu);
    mobileMenu
      .querySelectorAll('a')
      .forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* -------------------------------------------------------
     Reveal ao rolar — com stagger por seção
     ------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (prefersReducedMotion) {
      reveals.forEach((r) => r.classList.add('visible'));
    } else {
      const obs = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            // stagger relativo aos irmãos diretos
            const siblings = Array.from(el.parentElement.children).filter((c) =>
              c.classList.contains('reveal')
            );
            const idx = siblings.indexOf(el);
            el.style.transitionDelay = Math.max(0, idx % 4) * 0.08 + 's';
            el.classList.add('visible');
            observer.unobserve(el);
          });
        },
        { threshold: 0.12 }
      );
      reveals.forEach((r) => obs.observe(r));
    }
  }

  /* -------------------------------------------------------
     Contadores animados nas estatísticas
     ------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      if (prefersReducedMotion) {
        el.textContent = prefix + target + suffix;
        return;
      }
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const value = Math.round(target * eased);
        el.textContent = prefix + value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const countObs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => countObs.observe(c));
  }

  /* -------------------------------------------------------
     Scrollspy — destaca o link da seção visível
     ------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id], div[id][data-spy]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navAnchors.length) {
    const spyObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navAnchors.forEach((a) =>
            a.classList.toggle(
              'active',
              a.getAttribute('href') === '#' + id
            )
          );
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => spyObs.observe(s));
  }

  /* -------------------------------------------------------
     Botão voltar ao topo
     ------------------------------------------------------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    const toggleToTop = () =>
      toTop.classList.toggle('show', window.scrollY > 600);
    window.addEventListener('scroll', toggleToTop, { passive: true });
    toTop.addEventListener('click', () =>
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    );
    toggleToTop();
  }

  /* -------------------------------------------------------
     FAQ — acordeão acessível
     ------------------------------------------------------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // fecha os demais
      document.querySelectorAll('.faq-item.open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          const ob = other.querySelector('.faq-question');
          if (ob) ob.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* -------------------------------------------------------
     Formulário de contato — validação no cliente
     ------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const status = document.getElementById('formStatus');
    const showError = (field, message) => {
      const wrap = field.closest('.form-field');
      if (!wrap) return;
      wrap.classList.add('has-error');
      const msg = wrap.querySelector('.field-error');
      if (msg) msg.textContent = message;
    };
    const clearError = (field) => {
      const wrap = field.closest('.form-field');
      if (!wrap) return;
      wrap.classList.remove('has-error');
      const msg = wrap.querySelector('.field-error');
      if (msg) msg.textContent = '';
    };

    form.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => clearError(field));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const name = form.elements['name'];
      const email = form.elements['email'];
      const message = form.elements['message'];
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name.value.trim()) {
        showError(name, 'Por favor, informe seu nome.');
        valid = false;
      }
      if (!email.value.trim()) {
        showError(email, 'Por favor, informe seu e-mail.');
        valid = false;
      } else if (!emailRe.test(email.value.trim())) {
        showError(email, 'Informe um e-mail válido.');
        valid = false;
      }
      if (!message.value.trim()) {
        showError(message, 'Conte um pouco sobre seu projeto.');
        valid = false;
      }

      if (!valid) {
        if (status) {
          status.textContent = 'Verifique os campos destacados.';
          status.className = 'form-status error';
        }
        return;
      }

      // Sem backend: monta um e-mail pré-preenchido (graceful fallback).
      const subject = encodeURIComponent('Novo projeto — ' + name.value.trim());
      const body = encodeURIComponent(
        'Nome: ' +
          name.value.trim() +
          '\nE-mail: ' +
          email.value.trim() +
          '\n\n' +
          message.value.trim()
      );
      window.location.href =
        'mailto:ola@formastudio.com.br?subject=' + subject + '&body=' + body;

      if (status) {
        status.textContent =
          'Obrigado! Abrimos seu app de e-mail para concluir o envio.';
        status.className = 'form-status success';
      }
      form.reset();
    });
  }

  /* -------------------------------------------------------
     Ano dinâmico
     ------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* -------------------------------------------------------
     Cursor customizado — só em desktop e sem reduced-motion
     ------------------------------------------------------- */
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (cursor && ring && !isTouch && !prefersReducedMotion) {
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });
    const animCursor = () => {
      cursor.style.left = mx - 4 + 'px';
      cursor.style.top = my - 4 + 'px';
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx - 16 + 'px';
      ring.style.top = ry - 16 + 'px';
      requestAnimationFrame(animCursor);
    };
    animCursor();
    document.querySelectorAll('a, button, input, textarea').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '50px';
        ring.style.height = '50px';
        ring.style.opacity = '0.3';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.opacity = '0.5';
      });
    });
  } else {
    // remove os elementos do cursor para não interferir em touch
    if (cursor) cursor.remove();
    if (ring) ring.remove();
  }
})();
