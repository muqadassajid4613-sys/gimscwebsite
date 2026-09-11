document.addEventListener('DOMContentLoaded', () => {

  // LOADER
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hide');
    }, 1200);
  });

  // NAVBAR SCROLL
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // MOBILE MENU
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    menuToggle.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.textContent = '☰';
    });
  });

  // REVEAL ON SCROLL
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObserver.observe(el));

  // STATS COUNTER
  const counters = document.querySelectorAll('[data-count]');
  let counted = false;

  const countObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target + (target === 100 ? '%' : '+');
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, 30);
      });
    }
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) countObserver.observe(statsSection);

  // FAQ
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // COURSE PREFILL
  document.querySelectorAll('.course-apply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const course = btn.getAttribute('data-course');
      const select = document.getElementById('courseSelect');
      if (select && course) select.value = course;
    });
  });

  // ADMISSION FORM
  const admissionForm = document.getElementById('admissionForm');
  const formMessage = document.getElementById('formMessage');
  const applicationsList = document.getElementById('applicationsList');
  const applicationSearch = document.getElementById('applicationSearch');
  const clearApplicationsBtn = document.getElementById('clearApplications');

  function getApplications() {
    return JSON.parse(localStorage.getItem('gimhs_applications') || '[]');
  }

  function saveApplications(apps) {
    localStorage.setItem('gimhs_applications', JSON.stringify(apps));
  }

  function renderApplications(filter = '') {
    const apps = getApplications();
    const filtered = apps.filter(app => {
      const text = `${app.name} ${app.course} ${app.phone}`.toLowerCase();
      return text.includes(filter.toLowerCase());
    });

    if (filtered.length === 0) {
      applicationsList.innerHTML = '<p style="text-align:center;color:#888;padding:30px;">No applications found.</p>';
      return;
    }

    applicationsList.innerHTML = filtered.map(app => `
      <div class="application-card">
        <div>
          <h4>${app.name}</h4>
          <p>Father: ${app.father} • ${app.phone}${app.email ? ' • ' + app.email : ''}</p>
          <p style="margin-top:4px;font-size:0.82rem;">Qualification: ${app.qualification} | ${app.date}</p>
        </div>
        <span class="course-tag">${app.course}</span>
      </div>
    `).join('');
  }

  renderApplications();

  admissionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(admissionForm);
    const app = {
      name: formData.get('name').trim(),
      father: formData.get('father').trim(),
      phone: formData.get('phone').trim(),
      email: formData.get('email').trim(),
      course: formData.get('course'),
      qualification: formData.get('qualification').trim(),
      address: formData.get('address').trim(),
      date: new Date().toLocaleDateString('en-PK', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    };

    if (!app.name || !app.father || !app.phone || !app.course || !app.qualification || !app.address) {
      formMessage.textContent = 'Please fill all required fields.';
      formMessage.className = 'form-message error';
      return;
    }

    const apps = getApplications();
    apps.unshift(app);
    saveApplications(apps);
    renderApplications();

    formMessage.textContent = 'Application submitted successfully!';
    formMessage.className = 'form-message success';
    admissionForm.reset();

    setTimeout(() => {
      formMessage.textContent = '';
      formMessage.className = 'form-message';
    }, 4000);

    document.getElementById('applications').scrollIntoView({ behavior: 'smooth' });
  });

  applicationSearch.addEventListener('input', () => {
    renderApplications(applicationSearch.value);
  });

  clearApplicationsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all applications?')) {
      localStorage.removeItem('gimhs_applications');
      renderApplications();
    }
  });

  // CONTACT FORM
  const contactForm = document.getElementById('contactForm');
  const contactMessage = document.getElementById('contactMessage');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactMessage.textContent = 'Message sent successfully! We will contact you soon.';
    contactMessage.className = 'form-message success';
    contactForm.reset();
    setTimeout(() => {
      contactMessage.textContent = '';
      contactMessage.className = 'form-message';
    }, 4000);
  });

  // PARTICLES
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 50;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(92, 10, 31, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

});



// ADMISSION FORM
const admissionForm = document.getElementById('admissionForm');
const formMessage = document.getElementById('formMessage');
const applicationsList = document.getElementById('applicationsList');
const applicationSearch = document.getElementById('applicationSearch');
const clearApplicationsBtn = document.getElementById('clearApplications');

function getApplications() {
  return JSON.parse(localStorage.getItem('gimhs_applications') || '[]');
}

function saveApplications(apps) {
  localStorage.setItem('gimhs_applications', JSON.stringify(apps));
}

function renderApplications(filter = '') {
  const apps = getApplications();
  const filtered = apps.filter(app => {
    const text = `${app.name} ${app.course} ${app.phone}`.toLowerCase();
    return text.includes(filter.toLowerCase());
  });

  if (filtered.length === 0) {
    applicationsList.innerHTML = '<p style="text-align:center;color:#888;padding:30px;">No applications found.</p>';
    return;
  }

  applicationsList.innerHTML = filtered.map(app => `
    <div class="application-card">
      <div>
        <h4>${app.name}</h4>
        <p>Father: ${app.father} • ${app.phone}${app.email ? ' • ' + app.email : ''}</p>
        <p style="margin-top:4px;font-size:0.82rem;">Qualification: ${app.qualification} | ${app.date}</p>
      </div>
      <span class="course-tag">${app.course}</span>
    </div>
  `).join('');
}

renderApplications();

admissionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(admissionForm);
  const app = {
    name: formData.get('name').trim(),
    father: formData.get('father').trim(),
    phone: formData.get('phone').trim(),
    email: formData.get('email').trim(),
    course: formData.get('course'),
    qualification: formData.get('qualification').trim(),
    address: formData.get('address').trim(),
    date: new Date().toLocaleDateString('en-PK', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  };

  if (!app.name || !app.father || !app.phone || !app.course || !app.qualification || !app.address) {
    formMessage.textContent = 'Please fill all required fields.';
    formMessage.className = 'form-message error';
    return;
  }

  const apps = getApplications();
  apps.unshift(app);
  saveApplications(apps);
  renderApplications();

  formMessage.textContent = 'Application submitted successfully!';
  formMessage.className = 'form-message success';
  admissionForm.reset();

  setTimeout(() => {
    formMessage.textContent = '';
    formMessage.className = 'form-message';
  }, 4000);

  document.getElementById('applications').scrollIntoView({ behavior: 'smooth' });
});

if (applicationSearch) {
  applicationSearch.addEventListener('input', () => {
    renderApplications(applicationSearch.value);
  });
}

if (clearApplicationsBtn) {
  clearApplicationsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all applications?')) {
      localStorage.removeItem('gimhs_applications');
      renderApplications();
    }
  });
}