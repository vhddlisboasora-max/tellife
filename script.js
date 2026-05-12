// Navbar shadow on scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

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

  // Form submit (demo)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const original = btn.innerHTML;
      btn.innerHTML = '✓ Mensagem enviada!';
      btn.style.background = 'var(--success)';
      setTimeout(() => {
        form.reset();
        btn.innerHTML = original;
        btn.style.background = '';
      }, 2800);
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
