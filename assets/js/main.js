/* ============================================================
   RUBEX UI — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll ── */
  const navbar = document.querySelector('.navbar');
  function updateNav() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── Active nav link ── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Hamburger menu ── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      }
    });

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* ── Back to top ── */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Scroll reveal ── */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
  }

  /* ── Hero dot grid canvas ── */
  const canvas = document.querySelector('.hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let raf;
    let mouse = { x: -9999, y: -9999 };

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spacing = 36;
      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;
          const alpha = dist < maxDist
            ? 0.06 + 0.25 * (1 - dist / maxDist)
            : 0.06;
          const size = dist < maxDist ? 1.5 + 1.5 * (1 - dist / maxDist) : 1.5;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(74,158,255,${alpha})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); }, { passive: true });
    canvas.closest('.hero').addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.closest('.hero').addEventListener('mouseleave', () => {
      mouse.x = -9999; mouse.y = -9999;
    });

    resize();
    draw();
  }

  /* ── Portfolio filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        portfolioCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('hidden', !match);
        });
      });
    });
  }

  /* ── Contact form ── */
  const form = document.querySelector('.contact-form');
  if (form) {
    const submitBtn = form.querySelector('.form-submit');
    const formContent = form.querySelector('.form-content');
    const successMsg = form.querySelector('.form-message');

    function validateField(input) {
      const group = input.closest('.form-group');
      const errorEl = group?.querySelector('.form-error');
      let valid = true;

      if (input.required && !input.value.trim()) {
        valid = false;
        if (errorEl) errorEl.textContent = 'This field is required.';
      } else if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
        valid = false;
        if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
      }

      group?.classList.toggle('error', !valid);
      return valid;
    }

    form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group')?.classList.contains('error')) {
          validateField(input);
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let allValid = true;
      form.querySelectorAll('.form-input[required], .form-textarea[required]').forEach(input => {
        if (!validateField(input)) allValid = false;
      });
      if (!allValid) return;

      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending…';
      submitBtn.disabled = true;

      try {
        const data = new FormData(form);
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: data
        });
        const json = await res.json();

        if (json.success) {
          formContent.style.display = 'none';
          successMsg.classList.add('success');
        } else {
          throw new Error(json.message);
        }
      } catch (err) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('Something went wrong. Please try again or email us directly.');
      }
    });
  }

})();
