/* ==========================================================
   Rahul Biswas – Portfolio | script.js
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  /* ---------- 1. Theme toggle (Dark / Light) ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
  });

  /* ---------- 2. Mobile menu ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  const setMenu = (open) => {
    mobileMenu.classList.toggle('hidden', !open);
    iconOpen.classList.toggle('hidden', open);
    iconClose.classList.toggle('hidden', !open);
    menuToggle.setAttribute('aria-expanded', String(open));
  };
  menuToggle.addEventListener('click', () => setMenu(mobileMenu.classList.contains('hidden')));
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------- 3. Navbar style, active link (scroll spy), back-to-top ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  const onScroll = () => {
    const y = window.scrollY;

    navbar.classList.toggle('scrolled', y > 20);
    backToTop.classList.toggle('show', y > 500);

    // Active section: the last one whose top has passed the offset line
    let current = sections[0].id;
    const offset = 120;
    sections.forEach((sec) => {
      if (sec.offsetTop - offset <= y) current = sec.id;
    });
    // Bottom of page → highlight last section
    if (window.innerHeight + y >= document.body.offsetHeight - 4) {
      current = sections[sections.length - 1].id;
    }

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 4. Scroll reveal + skill bars ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('visible');

        if (el.classList.contains('skill')) {
          const fill = el.querySelector('.skill-fill');
          fill.style.width = el.dataset.level + '%';
        }
        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el, i) => {
    // small stagger for siblings
    el.style.transitionDelay = (i % 4) * 80 + 'ms';
    revealObserver.observe(el);
  });

  /* ---------- 5. Typing effect (Hero) ---------- */
  const typingEl = document.getElementById('typing');
  const roles = ['Creative Editor', 'Content Creator', 'Storyteller', 'Thumbnail Designer'];
  let roleIndex = 0, charIndex = 0, deleting = false;

  const type = () => {
    const word = roles[roleIndex];
    typingEl.textContent = word.substring(0, charIndex);

    if (!deleting && charIndex < word.length) {
      charIndex++;
      setTimeout(type, 90);
    } else if (!deleting) {
      deleting = true;
      setTimeout(type, 1400);
    } else if (charIndex > 0) {
      charIndex--;
      setTimeout(type, 45);
    } else {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, 300);
    }
  };
  type();

  /* ---------- 6. Profile picture fallback ---------- */
  const profileImg = document.getElementById('profile-img');
  const profileFallback = document.getElementById('profile-fallback');
  profileImg.addEventListener('error', () => {
    profileImg.classList.add('hidden');
    profileFallback.classList.remove('hidden');
  });

  /* ---------- 7. Project filter ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const categories = card.dataset.category.split(' ');
        const match = filter === 'all' || categories.includes(filter);

        if (match) {
          card.classList.remove('hidden');
          requestAnimationFrame(() => card.classList.remove('is-hiding'));
        } else {
          card.classList.add('is-hiding');
          setTimeout(() => {
            if (card.classList.contains('is-hiding')) card.classList.add('hidden');
          }, 300);
        }
      });
    });
  });

  /* ---------- 8. Contact form validation ---------- */
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const statusEl = document.getElementById('form-status');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: (v) => (v.length < 2 ? 'অনুগ্রহ করে আপনার নাম লিখুন (কমপক্ষে ২ অক্ষর)।' : ''),
    email: (v) => (!v ? 'ইমেইল দিতে হবে।' : !emailPattern.test(v) ? 'সঠিক ইমেইল ঠিকানা লিখুন।' : ''),
    subject: (v) => (v.length < 3 ? 'বিষয় লিখুন (কমপক্ষে ৩ অক্ষর)।' : ''),
    message: (v) => (v.length < 10 ? 'বার্তা কমপক্ষে ১০ অক্ষরের হতে হবে।' : '')
  };

  const validateField = (field) => {
    const value = field.value.trim();
    const error = rules[field.name](value);
    const errorEl = form.querySelector('[data-error-for="' + field.name + '"]');

    errorEl.textContent = error;
    field.classList.toggle('invalid', Boolean(error));
    field.classList.toggle('valid', !error);
    return !error;
  };

  const fields = Array.from(form.querySelectorAll('input, textarea'));
  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  const showStatus = (message, type) => {
    statusEl.textContent = message;
    statusEl.className = 'text-center text-sm font-medium ' + type;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      showStatus('দয়া করে লাল চিহ্নিত ঘরগুলো ঠিক করুন।', 'error');
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    submitBtn.disabled = true;
    submitText.textContent = 'Sending…';

    try {
      /* ------------------------------------------------------
         আসল ইমেইল পাঠাতে চাইলে নিচের অংশ চালু করুন (যেমন Formspree):
         const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
           method: 'POST',
           headers: { 'Accept': 'application/json' },
           body: new FormData(form)
         });
         if (!res.ok) throw new Error('Request failed');
         ------------------------------------------------------ */
      await new Promise((resolve) => setTimeout(resolve, 1200)); // demo delay

      showStatus('ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে। ✅', 'success');
      form.reset();
      fields.forEach((f) => f.classList.remove('valid', 'invalid'));
    } catch (err) {
      showStatus('দুঃখিত, বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।', 'error');
    } finally {
      submitBtn.disabled = false;
      submitText.textContent = 'Send Message';
    }
  });

  /* ---------- 9. Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});
