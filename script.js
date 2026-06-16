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

    const submitBtn = document.getElementById('formSubmit');
    const endpoint = form.dataset.endpoint || '';
    const endpointReady = endpoint && !/SUA_FORM_ID/i.test(endpoint);

    const setStatus = (text, kind) => {
      if (!status) return;
      status.textContent = text;
      status.className = 'form-status' + (kind ? ' ' + kind : '');
    };

    const mailtoFallback = (name, email, message) => {
      const subject = encodeURIComponent('Novo projeto — ' + name);
      const body = encodeURIComponent(
        'Nome: ' + name + '\nE-mail: ' + email + '\n\n' + message
      );
      window.location.href =
        'mailto:ola@formastudio.com.br?subject=' + subject + '&body=' + body;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot: se preenchido, é bot — finge sucesso e ignora.
      if (form.elements['_gotcha'] && form.elements['_gotcha'].value) {
        setStatus('Mensagem enviada. Obrigado!', 'success');
        form.reset();
        return;
      }

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
        setStatus('Verifique os campos destacados.', 'error');
        return;
      }

      const nameV = name.value.trim();
      const emailV = email.value.trim();
      const msgV = message.value.trim();

      // Sem endpoint configurado: usa o fallback por e-mail.
      if (!endpointReady) {
        mailtoFallback(nameV, emailV, msgV);
        setStatus('Abrimos seu app de e-mail para concluir o envio.', 'success');
        form.reset();
        return;
      }

      // Envio real via fetch (Formspree-compatível).
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.label = submitBtn.textContent;
        submitBtn.textContent = 'Enviando…';
      }
      setStatus('Enviando sua mensagem…', '');

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });
        if (res.ok) {
          setStatus('Mensagem enviada com sucesso! Retornamos em até 48h.', 'success');
          form.reset();
        } else {
          throw new Error('bad response');
        }
      } catch (err) {
        setStatus(
          'Não foi possível enviar agora. Abrimos seu app de e-mail como alternativa.',
          'error'
        );
        mailtoFallback(nameV, emailV, msgV);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.label || 'Enviar mensagem';
        }
      }
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

  /* -------------------------------------------------------
     Alternância de tema (claro/escuro)
     ------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const root = document.documentElement;
    const syncLabel = () => {
      const dark = root.getAttribute('data-theme') === 'dark';
      themeToggle.setAttribute('aria-pressed', String(dark));
      themeToggle.setAttribute(
        'aria-label',
        dark ? 'Ativar tema claro' : 'Ativar tema escuro'
      );
    };
    syncLabel();
    themeToggle.addEventListener('click', () => {
      const next =
        root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
      syncLabel();
    });
  }

  /* -------------------------------------------------------
     Estudos de caso — modal acessível
     ------------------------------------------------------- */
  const CASES = {
    aureo: {
      cat: 'Identidade Visual',
      title: 'Aureo Estúdio de Arte',
      art: 'assets/project-aureo.svg',
      summary:
        'Um estúdio de arte contemporânea precisava de uma identidade tão expressiva quanto as obras que representa — sofisticada, mas acessível.',
      metrics: [
        ['+68%', 'Reconhecimento de marca'],
        ['3 sem.', 'Do briefing à entrega'],
        ['12', 'Aplicações do sistema'],
      ],
      sections: [
        ['O desafio', 'A marca anterior era genérica e não transmitia o caráter curatorial do estúdio nem dialogava com o público de galerias.'],
        ['O processo', 'Construímos um sistema visual em torno de um monograma serifado e uma paleta dourada, com grade modular para catálogos, sinalização e redes sociais.'],
        ['O resultado', 'Uma identidade coesa que elevou a percepção de valor do estúdio e padronizou todos os pontos de contato.'],
      ],
    },
    finapp: {
      cat: 'UI / UX Design',
      title: 'Finapp — Finanças Pessoais',
      art: 'assets/project-finapp.svg',
      summary:
        'Um app de finanças que queria simplificar o controle do dinheiro sem assustar quem não entende de planilhas.',
      metrics: [
        ['4.8★', 'Avaliação nas lojas'],
        ['-40%', 'Abandono no onboarding'],
        ['+2x', 'Retenção em 30 dias'],
      ],
      sections: [
        ['O desafio', 'O produto tinha boas funcionalidades, mas uma interface confusa que afastava usuários iniciantes logo no primeiro uso.'],
        ['O processo', 'Mapeamos a jornada, redesenhamos o fluxo de onboarding e criamos um design system claro, com hierarquia e dados visualizados de forma amigável.'],
        ['O resultado', 'Uma experiência fluida que reduziu o abandono e dobrou a retenção, com avaliações consistentemente altas.'],
      ],
    },
    raizes: {
      cat: 'Web Design',
      title: 'Raízes — Gastronomia Autoral',
      art: 'assets/project-raizes.svg',
      summary:
        'Um restaurante autoral queria um site que transmitisse a alma da sua cozinha e convertesse visitantes em reservas.',
      metrics: [
        ['+40%', 'Aumento em reservas'],
        ['1.9s', 'Tempo de carregamento'],
        ['100', 'Pontuação de acessibilidade'],
      ],
      sections: [
        ['O desafio', 'O site antigo era apenas um cardápio estático, sem narrativa nem caminho claro para a reserva.'],
        ['O processo', 'Criamos uma experiência editorial com fotografia em destaque, storytelling do chef e um fluxo de reserva direto e sem fricção.'],
        ['O resultado', 'Um site memorável que aumentou as reservas em 40% e fortaleceu o posicionamento premium do restaurante.'],
      ],
    },
    serraverde: {
      cat: 'Branding + Embalagem',
      title: 'Serra Verde — Cosméticos',
      art: 'assets/project-serraverde.svg',
      summary:
        'Uma marca de cosméticos naturais precisava se destacar na prateleira e comunicar pureza e origem.',
      metrics: [
        ['+55%', 'Vendas no varejo'],
        ['8', 'Linhas de produto'],
        ['#1', 'Categoria na região'],
      ],
      sections: [
        ['O desafio', 'A concorrência usava a mesma estética "verde genérico" e a marca desaparecia no ponto de venda.'],
        ['O processo', 'Desenvolvemos identidade, naming visual e um sistema de embalagens com hierarquia clara, materiais sustentáveis e um símbolo de origem.'],
        ['O resultado', 'Produtos que se destacam na prateleira e uma marca que virou referência da categoria na região.'],
      ],
    },
  };

  const modal = document.getElementById('caseModal');
  if (modal) {
    const elMedia = document.getElementById('caseMedia');
    const elCat = document.getElementById('caseCat');
    const elTitle = document.getElementById('caseTitle');
    const elSummary = document.getElementById('caseSummary');
    const elMetrics = document.getElementById('caseMetrics');
    const elSections = document.getElementById('caseSections');
    let lastFocused = null;

    const openModal = (key) => {
      const data = CASES[key];
      if (!data) return;
      elMedia.style.backgroundImage = "url('" + data.art + "')";
      elCat.textContent = data.cat;
      elTitle.textContent = data.title;
      elSummary.textContent = data.summary;
      elMetrics.innerHTML = data.metrics
        .map(
          (m) =>
            '<div class="case-metric"><span class="case-metric-num">' +
            m[0] +
            '</span><span class="case-metric-label">' +
            m[1] +
            '</span></div>'
        )
        .join('');
      elSections.innerHTML = data.sections
        .map(
          (s) =>
            '<div class="case-section"><h4>' +
            s[0] +
            '</h4><p>' +
            s[1] +
            '</p></div>'
        )
        .join('');

      lastFocused = document.activeElement;
      modal.hidden = false;
      document.body.classList.add('menu-open');
      requestAnimationFrame(() => {
        modal.classList.add('open');
        const closeBtn = modal.querySelector('.case-close');
        if (closeBtn) closeBtn.focus();
      });
    };

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.classList.remove('menu-open');
      const done = () => {
        modal.hidden = true;
        modal.removeEventListener('transitionend', done);
      };
      if (prefersReducedMotion) done();
      else modal.addEventListener('transitionend', done);
      if (lastFocused) lastFocused.focus();
    };

    document.querySelectorAll('.project-card[data-project]').forEach((card) => {
      card.addEventListener('click', () => openModal(card.dataset.project));
    });

    modal.querySelectorAll('[data-close]').forEach((el) =>
      el.addEventListener('click', closeModal)
    );

    document.addEventListener('keydown', (e) => {
      if (modal.hidden) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') {
        const focusables = modal.querySelectorAll(
          'a[href], button:not([disabled])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* -------------------------------------------------------
     Service Worker (PWA)
     ------------------------------------------------------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
