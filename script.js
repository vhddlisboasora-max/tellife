// Navbar shadow + scroll spy — single passive listener
  const nav = document.getElementById('nav');
  const _spyIds = ['servicos','catalogo','sobre','cobertura','blog','referencias','contato'];
  const _anchors = {};
  const _sections = {};
  _spyIds.forEach(id => {
    const a = document.querySelector(`.nav-links a[data-tab="${id}"]`);
    const s = document.getElementById(id);
    if (a) _anchors[id] = a;
    if (s) _sections[id] = s;
  });
  let _activeId = '';
  let _tabMode = false;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    if (_tabMode) return;
    const y = window.scrollY + 120;
    let current = '';
    _spyIds.forEach(id => {
      if (_sections[id] && _sections[id].offsetTop <= y) current = id;
    });
    if (current !== _activeId) {
      if (_anchors[_activeId]) _anchors[_activeId].classList.remove('nav-active');
      if (_anchors[current])   _anchors[current].classList.add('nav-active');
      _activeId = current;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Tab switching
  (function () {
    const allSections = document.querySelectorAll('[data-section]');
    const tabLinks    = document.querySelectorAll('[data-tab]');

    function showTab(tab) {
      _tabMode = tab !== 'inicio';
      if (tab === 'inicio') {
        allSections.forEach(s => { s.style.display = ''; });
      } else {
        allSections.forEach(s => {
          s.style.display = s.dataset.section === tab ? '' : 'none';
        });
      }
      tabLinks.forEach(a => a.classList.toggle('nav-active', a.dataset.tab === tab));
      if (_tabMode) _activeId = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    tabLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        showTab(a.dataset.tab);
        // fecha menu mobile se aberto
        document.getElementById('mobileToggle')?.classList.remove('open');
        document.getElementById('navLinks')?.classList.remove('open');
      });
    });
  })();

  // Mobile menu
  const toggle = document.getElementById('mobileToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a:not([data-tab])').forEach(a => a.addEventListener('click', () => {
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
    const DURATION = 1800;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        const prefix = el.dataset.prefix || '';
        const start = performance.now();
        (function step(now) {
          const p = Math.min((now - start) / DURATION, 1);
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
    banner.querySelector('#lgpdAccept').addEventListener('click', () => {
      localStorage.setItem('lgpd', '1');
      banner.classList.remove('show');
    });
    banner.querySelector('#lgpdDecline').addEventListener('click', () => {
      banner.classList.remove('show');
    });
  })();

  // Brands marquee — clone inner once for seamless loop
  (function () {
    const inner = document.querySelector('.brands-inner');
    if (!inner) return;
    inner.appendChild(inner.cloneNode(true));
  })();

  // Contact form — web3forms.com (free)
  const W3F_KEY = 'e418049e-959c-4f57-93fb-a6a02debc7dd';
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
        const nome     = form.querySelector('#nome')?.value     || '';
        const mensagem = form.querySelector('#mensagem')?.value || '';
        const email    = form.querySelector('#email')?.value    || '';
        const tel      = form.querySelector('#telefone')?.value || '';
        window.location.href = `mailto:administrativo@tellife.com?subject=${encodeURIComponent('Contato via site – ' + nome)}&body=${encodeURIComponent(mensagem + '\n\nTelefone/WhatsApp: ' + tel + '\nE-mail: ' + email)}`;
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

  // WhatsApp tooltip
  setTimeout(() => {
    const tip = document.getElementById('waTooltip');
    if (tip) {
      tip.classList.add('show');
      setTimeout(() => tip.classList.remove('show'), 4500);
    }
  }, 2500);
