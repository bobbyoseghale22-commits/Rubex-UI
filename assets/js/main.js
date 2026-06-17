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

  /* ── Hero abstract animated background ── */
  const bgCanvas = document.getElementById('heroBgCanvas');
  if (bgCanvas) {
    const bgCtx = bgCanvas.getContext('2d');
    let bgRaf;

    // Orb: drifting soft light blob
    function makeOrb() {
      return {
        x: Math.random(),          // 0..1 normalised
        y: Math.random(),
        r: 0.12 + Math.random() * 0.22,
        vx: (Math.random() - 0.5) * 0.00018,
        vy: (Math.random() - 0.5) * 0.00012,
        hue: 200 + Math.random() * 40,   // 200-240 = blue range
        alpha: 0.04 + Math.random() * 0.07,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.004 + Math.random() * 0.006
      };
    }

    // Particle: small fast-moving point
    function makeParticle(W, H) {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.5,
        size: 0.8 + Math.random() * 1.4,
        alpha: 0.2 + Math.random() * 0.5,
        life: 1,
        decay: 0.003 + Math.random() * 0.005
      };
    }

    // Streak: horizontal light scan line
    function makeStreak(H) {
      return {
        y: Math.random() * H,
        vy: 0.15 + Math.random() * 0.35,
        alpha: 0.02 + Math.random() * 0.04,
        width: 0.3 + Math.random() * 0.5   // fraction of canvas width
      };
    }

    const NUM_ORBS = 6;
    const NUM_PARTICLES = 80;
    const NUM_STREAKS = 4;

    const orbs = Array.from({ length: NUM_ORBS }, makeOrb);
    let particles = [];
    let streaks = [];
    let W = 0, H = 0;

    function bgResize() {
      W = bgCanvas.offsetWidth;
      H = bgCanvas.offsetHeight;
      bgCanvas.width = W;
      bgCanvas.height = H;
      // Re-seed particles and streaks on resize
      particles = Array.from({ length: NUM_PARTICLES }, () => makeParticle(W, H));
      streaks   = Array.from({ length: NUM_STREAKS },   () => makeStreak(H));
    }

    function bgDraw() {
      bgCtx.clearRect(0, 0, W, H);

      // 1. Dark background fill
      bgCtx.fillStyle = '#0A0C0F';
      bgCtx.fillRect(0, 0, W, H);

      // 2. Drifting orbs
      orbs.forEach(o => {
        o.pulse += o.pulseSpeed;
        const pulse = Math.sin(o.pulse) * 0.015;
        const ox = o.x * W, oy = o.y * H, or = (o.r + pulse) * Math.min(W, H);

        const grad = bgCtx.createRadialGradient(ox, oy, 0, ox, oy, or);
        grad.addColorStop(0,   `hsla(${o.hue},90%,65%,${(o.alpha + pulse * 0.5).toFixed(3)})`);
        grad.addColorStop(0.5, `hsla(${o.hue},80%,50%,${(o.alpha * 0.4).toFixed(3)})`);
        grad.addColorStop(1,   `hsla(${o.hue},70%,40%,0)`);

        bgCtx.beginPath();
        bgCtx.arc(ox, oy, or, 0, Math.PI * 2);
        bgCtx.fillStyle = grad;
        bgCtx.fill();

        // drift
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = 1 + o.r;
        if (o.x > 1 + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = 1 + o.r;
        if (o.y > 1 + o.r) o.y = -o.r;
      });

      // 3. Horizontal scan streaks
      streaks.forEach(s => {
        const sw = s.width * W;
        const sx = (W - sw) * 0.5;
        const grad = bgCtx.createLinearGradient(sx, 0, sx + sw, 0);
        grad.addColorStop(0,   'rgba(74,158,255,0)');
        grad.addColorStop(0.3, `rgba(74,158,255,${s.alpha})`);
        grad.addColorStop(0.7, `rgba(74,158,255,${s.alpha})`);
        grad.addColorStop(1,   'rgba(74,158,255,0)');
        bgCtx.fillStyle = grad;
        bgCtx.fillRect(sx, s.y, sw, 1);
        s.y += s.vy;
        if (s.y > H + 2) s.y = -2;
      });

      // 4. Rising particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0 || p.y < -10) {
          particles[i] = makeParticle(W, H);
          particles[i].y = H + 5; // spawn from bottom
          continue;
        }
        const a = p.alpha * p.life;
        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(100,180,255,${a.toFixed(3)})`;
        bgCtx.fill();
      }

      // 5. Vignette overlay
      const vig = bgCtx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.85);
      vig.addColorStop(0, 'rgba(10,12,15,0)');
      vig.addColorStop(1, 'rgba(10,12,15,0.75)');
      bgCtx.fillStyle = vig;
      bgCtx.fillRect(0, 0, W, H);

      bgRaf = requestAnimationFrame(bgDraw);
    }

    window.addEventListener('resize', bgResize, { passive: true });
    bgResize();
    bgDraw();
  }

  /* ── Hero dot grid overlay canvas (mouse-reactive) ── */
  const canvas = document.querySelector('.hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let mouse = { x: -9999, y: -9999 };

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spacing = 40;
      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;
          const alpha = dist < maxDist ? 0.04 + 0.2 * (1 - dist / maxDist) : 0.04;
          const size  = dist < maxDist ? 1.2 + 1.4 * (1 - dist / maxDist) : 1.2;
          bgCtx && (bgCtx.globalCompositeOperation = 'source-over');
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(74,158,255,${alpha})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => resize(), { passive: true });
    const heroEl = canvas.closest('.hero');
    if (heroEl) {
      heroEl.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      heroEl.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
    }
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
    const card = form.closest('.contact-form-card');
    const submitBtn = form.querySelector('.form-submit');
    const formContent = card.querySelector('.form-content');
    const successMsg = card.querySelector('.form-message');

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

      // Fetch and DOM updates are separated so a missing element never
      // masks a successful submission with a false error alert.
      let submitted = false;
      try {
        const data = new FormData(form);
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: data
        });
        const json = await res.json();
        submitted = json.success === true;
      } catch (_) {
        submitted = false;
      }

      if (submitted) {
        if (formContent) formContent.style.display = 'none';
        if (successMsg)  successMsg.classList.add('success');
      } else {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('Something went wrong. Please try again or email us directly.');
      }
    });
  }

})();
