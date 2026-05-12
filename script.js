// Navbar shadow on scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Scroll spy — highlight active nav link
  (function () {
    const sectionIds = ['servicos','catalogo','sobre','cobertura','blog','referencias','contato'];
    const navAnchors = {};
    sectionIds.forEach(id => {
      const el = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (el) navAnchors[id] = el;
    });

    function setActive() {
      const scrollY = window.scrollY + 120;
      let current = '';
      sectionIds.forEach(id => {
        const sec = document.getElementById(id);
        if (sec && sec.offsetTop <= scrollY) current = id;
      });
      Object.values(navAnchors).forEach(a => a.classList.remove('nav-active'));
      if (current && navAnchors[current]) navAnchors[current].classList.add('nav-active');
    }

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  })();

  // Mobile menu
  const toggle = document.getElementById('mobileToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
  }));

  // Scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Animated counters
  (function () {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        const prefix = el.dataset.prefix || '';
        const duration = 1800;
        const start = performance.now();
        (function step(now) {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.floor(ease * target);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = prefix + target;
        })(start);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(c => obs.observe(c));
  })();

  // LGPD banner
  (function () {
    const banner = document.getElementById('lgpdBanner');
    if (!banner || localStorage.getItem('lgpd')) return;
    setTimeout(() => banner.classList.add('show'), 1800);
    document.getElementById('lgpdAccept').addEventListener('click', () => {
      localStorage.setItem('lgpd', '1');
      banner.classList.remove('show');
    });
    document.getElementById('lgpdDecline').addEventListener('click', () => {
      banner.classList.remove('show');
    });
  })();

  // Form submit via Web3Forms (gratuito)
  // CONFIGURAÇÃO: acesse web3forms.com, informe seu e-mail e cole a chave abaixo
  const W3F_KEY = 'SUA_CHAVE_WEB3FORMS_AQUI';
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Enviando...';
      try {
        const data = new FormData(form);
        data.append('access_key', W3F_KEY);
        data.append('subject', 'Novo contato via site – Tellife');
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error();
        btn.innerHTML = '✓ Mensagem enviada!';
        btn.style.background = 'var(--success)';
        form.reset();
        setTimeout(() => { btn.innerHTML = original; btn.style.background = ''; btn.disabled = false; }, 3000);
      } catch {
        const nome = form.querySelector('#nome')?.value || '';
        const mensagem = form.querySelector('#mensagem')?.value || '';
        const email = form.querySelector('#email')?.value || '';
        window.location.href = `mailto:administrativo@tellife.com?subject=${encodeURIComponent('Contato via site – ' + nome)}&body=${encodeURIComponent(mensagem + '\n\nTelefone/WhatsApp: ' + form.querySelector('#telefone')?.value + '\nE-mail: ' + email)}`;
        btn.innerHTML = original;
        btn.disabled = false;
      }
    });
  }
  // Catalog filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.product-card').forEach(card => {
          const show = filter === 'todos' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // References gallery filters
  const refFilterBtns = document.querySelectorAll('[data-ref-filter]');
  if (refFilterBtns.length) {
    refFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        refFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.refFilter;
        document.querySelectorAll('[data-ref-cat]').forEach(item => {
          item.style.display = (filter === 'todos' || item.dataset.refCat === filter) ? '' : 'none';
        });
      });
    });
  }

  // Lightbox for gallery images
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    document.querySelectorAll('.ref-item').forEach(item => {
      item.addEventListener('click', () => {
        document.getElementById('lbTitle').textContent = item.dataset.title || '';
        document.getElementById('lbLocal').textContent = item.dataset.local || '';
        lightbox.classList.add('open');
      });
    });
    document.getElementById('lbClose').addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('open'); });
  }

  // WhatsApp tooltip - show briefly after load
  setTimeout(() => {
    const tip = document.getElementById('waTooltip');
    if (tip) {
      tip.classList.add('show');
      setTimeout(() => tip.classList.remove('show'), 4500);
    }
  }, 2500);
