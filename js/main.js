/* ============================================================
   FARHAN PORTFOLIO v2 — main.js
   Modules: scroll progress, navbar, typing, reveal,
   skill bars, counters, project filter, modal,
   particle canvas, EmailJS contact form, back to top
============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────
   EMAILJS CONFIG
   ─────────────────────────────────────────────────────────
   1. Go to https://www.emailjs.com — create a free account
   2. Add a Service (Gmail recommended) → copy the Service ID
   3. Create a Template — use variables:
      {{from_name}}, {{reply_to}}, {{subject}}, {{message}}
      → copy the Template ID
   4. Go to Account → API Keys → copy your Public Key
   5. Paste all three values below
────────────────────────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY   = '4YeanKrXL0FS_9gFA';   
const EMAILJS_SERVICE_ID   = 'service_jtsl8ee';    
const EMAILJS_TEMPLATE_ID  = 'template_ye8gwjj';  


/* ============================================================
   1. SCROLL PROGRESS BAR
============================================================ */
const ScrollProgress = (() => {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = `${pct}%`;
  }, { passive: true });
})();


/* ============================================================
   2. NAVBAR — scroll effect, active link, mobile toggle
============================================================ */
const Navbar = (() => {
  const nav     = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const links   = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);

    // Active section highlight
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
    navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));

    // Back to top visibility
    const btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    navItems.forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    }));
  }

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
})();


/* ============================================================
   3. BACK TO TOP
============================================================ */
const BackToTop = (() => {
  const btn = document.getElementById('backToTop');
  if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* ============================================================
   4. TYPING EFFECT
============================================================ */
const TypingEffect = (() => {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Building Data-Driven Digital Experiences',
    'Scaling Online Brands with Strategy',
    'Combining AI & Marketing for Growth',
    'Founder · Analyst · Builder'
  ];

  let pi = 0, ci = 0, deleting = false;

  const tick = () => {
    const phrase = phrases[pi];
    el.textContent = deleting
      ? phrase.substring(0, ci - 1)
      : phrase.substring(0, ci + 1);
    deleting ? ci-- : ci++;

    let delay = deleting ? 38 : 72;
    if (!deleting && ci === phrase.length) { delay = 2200; deleting = true; }
    else if (deleting && ci === 0)        { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 900);
})();


/* ============================================================
   5. HERO ENTRANCE (immediate, no observer needed)
============================================================ */
const HeroEntrance = (() => {
  document.querySelectorAll('.hero-content .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 130);
  });
})();


/* ============================================================
   6. SCROLL REVEAL — Intersection Observer
============================================================ */
const RevealObserver = (() => {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();


/* ============================================================
   7. SKILL BAR FILL ANIMATION
============================================================ */
const SkillBars = (() => {
  const fills = document.querySelectorAll('.bar-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = `${e.target.dataset.width}%`;
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
})();


/* ============================================================
   8. ANIMATED COUNTERS — ease-out cubic on scroll
============================================================ */
const Counters = (() => {
  const counters = document.querySelectorAll('.counter');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const start  = performance.now();
    const dur    = Math.max(800, target * 8); // scale duration by value

    const step = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
      el.textContent = Math.floor(ease * target);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();


/* ============================================================
   9. PROJECT FILTER
============================================================ */
const ProjectFilter = (() => {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;

      cards.forEach(card => {
        const show = f === 'all' || card.dataset.category === f;
        card.classList.toggle('hidden', !show);
        if (show) setTimeout(() => card.classList.add('visible'), 10);
      });
    });
  });
})();


/* ============================================================
   10. PROJECT MODAL — open/close with case study data
============================================================ */
const ProjectModal = (() => {
  const overlay = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  if (!overlay) return;

  const setContent = (card) => {
    document.getElementById('modalTag').textContent   = card.dataset.tag   || '';
    document.getElementById('modalTitle').textContent = card.dataset.title || '';
    document.getElementById('modalDesc').textContent  = card.dataset.desc  || '';
    document.getElementById('modalTech').textContent  = card.dataset.tech  || '';
  
    const ul = document.getElementById('modalOutcomes');
    ul.innerHTML = '';
    try {
      JSON.parse(card.dataset.outcomes || '[]').forEach(o => {
        const li = document.createElement('li');
        li.textContent = o;
        ul.appendChild(li);
      });
    } catch(e) {}
  
    // Certificate image
    const certWrap = document.getElementById('modalCert');
    if (card.dataset.cert) {
      certWrap.innerHTML = `<h4>Certificate</h4><img src="${card.dataset.cert}" alt="Certificate" class="modal-cert-img" />`;
      certWrap.style.display = 'block';
    } else {
      certWrap.innerHTML = '';
      certWrap.style.display = 'none';
    }
  
    // GitHub / live link
    const linkWrap = document.getElementById('modalLink');
    if (card.dataset.github) {
      linkWrap.innerHTML = `<a href="${card.dataset.github}" target="_blank" rel="noopener" class="modal-github-btn">
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.505.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z"/></svg>
        View Full Project on GitHub
      </a>`;
      linkWrap.style.display = 'block';
    } else {
      linkWrap.innerHTML = '';
      linkWrap.style.display = 'none';
    }
  };

  const open = (card) => {
    setContent(card);
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Open via "View Case Study" buttons
  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      if (card) open(card);
    });
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();


/* ============================================================
   11. HERO CANVAS — particle constellation
============================================================ */
const HeroCanvas = (() => {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const N = 55, MAX_D = 140;
  let w, h, pts;

  const rand = (a, b) => Math.random() * (b - a) + a;

  const resize = () => {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  };

  const init = () => {
    pts = Array.from({ length: N }, () => ({
      x: rand(0, w), y: rand(0, h),
      vx: rand(-0.18, 0.18), vy: rand(-0.14, 0.14),
      r: rand(1, 2.2), a: rand(0.18, 0.55)
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);

    // Lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_D) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(233,69,96,${0.1 * (1 - d / MAX_D)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    // Dots
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(233,69,96,${p.a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
  resize(); init(); draw();
})();


/* ============================================================
   12. CONTACT FORM — EmailJS integration + validation
============================================================ */
const ContactForm = (() => {
  const form       = document.getElementById('contactForm');
  if (!form) return;

  const nameEl     = document.getElementById('fname');
  const emailEl    = document.getElementById('femail');
  const subjectEl  = document.getElementById('fsubject');
  const messageEl  = document.getElementById('fmessage');
  const nameErr    = document.getElementById('nameError');
  const emailErr   = document.getElementById('emailError');
  const subjectErr = document.getElementById('subjectError');
  const messageErr = document.getElementById('messageError');
  const successEl  = document.getElementById('formSuccess');
  const failEl     = document.getElementById('formFail');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = document.getElementById('btnText');
  const btnLoader  = document.getElementById('btnLoader');

  // Init EmailJS
  try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) { /* library not loaded */ }

  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const clearErrors = () => {
    [nameErr, emailErr, subjectErr, messageErr].forEach(e => { if(e) e.textContent = ''; });
    [nameEl, emailEl, subjectEl, messageEl].forEach(el => { if(el) el.style.borderColor = ''; });
    successEl.classList.remove('visible');
    failEl.classList.remove('visible');
  };

  const setErr = (inp, err, msg) => {
    if (err) err.textContent = msg;
    if (inp) inp.style.borderColor = 'var(--red)';
  };

  const validate = () => {
    let ok = true;
    if (!nameEl.value.trim() || nameEl.value.trim().length < 2)
      { setErr(nameEl, nameErr, 'Please enter your name (min 2 characters).'); ok = false; }
    if (!emailEl.value.trim() || !isEmail(emailEl.value.trim()))
      { setErr(emailEl, emailErr, 'Please enter a valid email address.'); ok = false; }
    if (!subjectEl.value.trim())
      { setErr(subjectEl, subjectErr, 'Please enter a subject.'); ok = false; }
    if (!messageEl.value.trim() || messageEl.value.trim().length < 10)
      { setErr(messageEl, messageErr, 'Message must be at least 10 characters.'); ok = false; }
    return ok;
  };

  const setLoading = (loading) => {
    submitBtn.disabled = loading;
    btnText.style.display  = loading ? 'none'  : 'inline';
    btnLoader.style.display = loading ? 'inline' : 'none';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    if (!validate()) return;

    setLoading(true);

    // Check if EmailJS credentials have been configured
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      // Fallback: show success but remind to configure EmailJS
      setTimeout(() => {
        setLoading(false);
        form.reset();
        successEl.textContent = '✓ Message received! (Configure EmailJS to receive it in your inbox — see comment in js/main.js)';
        successEl.classList.add('visible');
        setTimeout(() => successEl.classList.remove('visible'), 8000);
      }, 800);
      return;
    }

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
      form.reset();
      successEl.classList.add('visible');
      setTimeout(() => successEl.classList.remove('visible'), 6000);
    } catch (err) {
      console.error('EmailJS error:', err);
      failEl.classList.add('visible');
      setTimeout(() => failEl.classList.remove('visible'), 8000);
    } finally {
      setLoading(false);
    }
  });

  // Clear error on input
  [nameEl, emailEl, subjectEl, messageEl].forEach(el => {
    if (el) el.addEventListener('input', () => { el.style.borderColor = ''; });
  });
})();
