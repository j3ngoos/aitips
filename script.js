/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  if (next === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', next);
  }
  localStorage.setItem('theme', next);
});

/* ===== NAVBAR scroll tint ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50
    ? 'rgba(8,9,14,0.97)'
    : 'rgba(8,9,14,0.8)';
}, { passive: true });

/* ===== Burger menu ===== */
const burger   = document.getElementById('burger');
const navMenu  = document.getElementById('navMenu');
burger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  if (navMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navMenu.classList.remove('open');
  burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));

/* ===== Scroll reveal ===== */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ===== Active nav highlight ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-menu a[href^="#"]');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navLinks.forEach(a => {
        const match = a.getAttribute('href') === `#${id}`;
        a.style.color = match ? '#5b9cf6' : '';
        a.style.background = match ? 'rgba(91,156,246,0.08)' : '';
      });
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => secObs.observe(s));

/* ===== Prompt tabs ===== */
document.querySelectorAll('.ptab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.ptab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + btn.dataset.tab);
    if (panel) panel.classList.add('active');
  });
});

/* ===== Toast ===== */
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg = '✓ Скопировано!') {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ===== Copy buttons (prompt cards) ===== */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.copy;
    const el = document.getElementById(id);
    if (!el) return;
    navigator.clipboard.writeText(el.textContent.trim()).then(() => {
      btn.classList.add('copied');
      btn.textContent = '✓ Скопировано';
      showToast();
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = 'Копировать';
      }, 2000);
    });
  });
});

/* ===== Copy buttons (template cards) ===== */
document.querySelectorAll('.tpl-copy').forEach(btn => {
  const origHTML = btn.innerHTML;
  btn.addEventListener('click', () => {
    const id = btn.dataset.copy;
    const el = document.getElementById(id);
    if (!el) return;
    navigator.clipboard.writeText(el.textContent.trim()).then(() => {
      btn.classList.add('copied');
      btn.innerHTML = '✓ Скопировано!';
      showToast('✓ Шаблон скопирован!');
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = origHTML;
      }, 2200);
    });
  });
});

/* ===== Particle canvas ===== */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resize, { passive: true });
resize();

const COLORS = [
  [91, 156, 246],
  [167, 139, 250],
  [34,  211, 238],
  [52,  211, 153],
];

class Dot {
  constructor() { this.init(); }
  init() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - .5) * .35;
    this.vy = (Math.random() - .5) * .35;
    this.r  = Math.random() * 1.5 + .4;
    this.a  = Math.random() * .45 + .08;
    this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  step() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.init();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.c[0]},${this.c[1]},${this.c[2]},${this.a})`;
    ctx.fill();
  }
}

const isMobile = window.innerWidth <= 768;
const DOT_COUNT = isMobile ? 30 : 100;
const dots = Array.from({ length: DOT_COUNT }, () => new Dot());

function connect() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        const a = (1 - d / 110) * .1;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = `rgba(91,156,246,${a})`;
        ctx.lineWidth = .8;
        ctx.stroke();
      }
    }
  }
}

// Mouse interaction
let mx = -999, my = -999;
window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

function raf() {
  ctx.clearRect(0, 0, W, H);
  connect();
  dots.forEach(d => {
    // gentle mouse repulsion
    const dx = d.x - mx, dy = d.y - my;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const force = (120 - dist) / 120 * .6;
      d.vx += (dx / dist) * force;
      d.vy += (dy / dist) * force;
      // dampen
      d.vx *= .95; d.vy *= .95;
    }
    d.step(); d.draw();
  });
  requestAnimationFrame(raf);
}
raf();

/* ===== Smooth stagger for grids ===== */
document.querySelectorAll('.principles-grid, .templates-grid, .scenarios-grid, .work-bento, .myths-grid').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });
});

/* ===== Back to top ===== */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== Prompt search ===== */
const promptSearch = document.getElementById('promptSearch');
if (promptSearch) {
  promptSearch.addEventListener('input', () => {
    const q = promptSearch.value.toLowerCase().trim();
    document.querySelectorAll('.prompt-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
    // Show all tabs when searching
    if (q) {
      document.querySelectorAll('.ptab-panel').forEach(p => p.style.display = 'flex');
      document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
    } else {
      document.querySelectorAll('.ptab-panel').forEach(p => p.style.display = '');
      const firstTab = document.querySelector('.ptab');
      if (firstTab) {
        firstTab.classList.add('active');
        document.querySelectorAll('.ptab-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById('tab-' + firstTab.dataset.tab);
        if (panel) panel.classList.add('active');
      }
    }
  });
}

/* ===== Copy counter ===== */
let copyCount = parseInt(localStorage.getItem('copyCount') || '0');
const copyCounterEl = document.getElementById('copyCounter');
function updateCopyCounter() {
  copyCount++;
  localStorage.setItem('copyCount', copyCount);
  if (copyCounterEl) copyCounterEl.textContent = `Скопировано: ${copyCount}`;
}
if (copyCounterEl) copyCounterEl.textContent = `Скопировано: ${copyCount}`;

// Patch existing copy handlers
document.querySelectorAll('.copy-btn, .tpl-copy').forEach(btn => {
  btn.addEventListener('click', updateCopyCounter);
});

/* ===== Quiz ===== */
const quizData = [
  {
    q: 'Ты получил ответ от ИИ с интересным фактом. Что делаешь?',
    opts: ['Сразу вставляю в реферат', 'Проверяю в надёжном источнике', 'Спрашиваю ИИ «ты уверен?»', 'Игнорирую — наверное правда'],
    correct: 1
  },
  {
    q: 'Какой промт даст лучший результат?',
    opts: ['«Расскажи про историю»', '«Объясни причины Первой мировой войны для ученика 9 класса, кратко»', '«Напиши что-нибудь умное»', '«История это что»'],
    correct: 1
  },
  {
    q: 'ИИ написал тебе сочинение. Как поступить?',
    opts: ['Сдать как есть', 'Прочитать, переписать своими словами, использовать как основу', 'Немного поменять слова и сдать', 'Удалить и забыть'],
    correct: 1
  },
  {
    q: 'Первый ответ ИИ тебя не устроил. Что делаешь?',
    opts: ['Закрываю чат — бесполезно', 'Уточняю запрос, добавляю контекст, переспрашиваю', 'Копирую как есть', 'Жалуюсь что ИИ тупой'],
    correct: 1
  },
  {
    q: '«ИИ думает как человек» — это:',
    opts: ['Правда — у него есть сознание', 'Миф — ИИ предсказывает текст, а не думает', 'Частично правда — он понимает, но не чувствует', 'Зависит от модели'],
    correct: 1
  },
  {
    q: 'Лучший способ учиться с ИИ:',
    opts: ['Попросить решить всё за тебя', 'Написать черновик самому, потом попросить ИИ улучшить', 'Копировать ответы в тетрадь', 'Не использовать ИИ вообще'],
    correct: 1
  },
  {
    q: 'Ты нашёл ошибку в коде. Как лучше попросить ИИ помочь?',
    opts: ['«Почини мой код»', '«Вот код и ошибка. Не давай готовое решение — объясни, что не так, чтобы я исправил сам»', '«Напиши код заново»', '«Код не работает!!!»'],
    correct: 1
  }
];

const quizWrap = document.getElementById('quizWrap');
if (quizWrap) {
  const qEl = document.getElementById('quizQuestion');
  const oEl = document.getElementById('quizOptions');
  const barEl = document.getElementById('quizBar');
  const resultEl = document.getElementById('quizResult');
  const scoreEl = document.getElementById('quizScore');
  const verdictEl = document.getElementById('quizVerdict');
  const restartBtn = document.getElementById('quizRestart');
  let current = 0, score = 0;

  function renderQuestion() {
    const d = quizData[current];
    barEl.style.width = `${((current) / quizData.length) * 100}%`;
    qEl.textContent = `${current + 1}/${quizData.length}. ${d.q}`;
    oEl.innerHTML = '';
    d.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleAnswer(i, btn));
      oEl.appendChild(btn);
    });
  }

  function handleAnswer(idx, btn) {
    const d = quizData[current];
    const allBtns = oEl.querySelectorAll('.quiz-opt');
    allBtns.forEach(b => b.classList.add('disabled'));
    if (idx === d.correct) {
      btn.classList.add('correct');
      score++;
    } else {
      btn.classList.add('wrong');
      allBtns[d.correct].classList.add('correct');
    }
    setTimeout(() => {
      current++;
      if (current < quizData.length) {
        renderQuestion();
      } else {
        showResult();
      }
    }, 900);
  }

  function showResult() {
    barEl.style.width = '100%';
    qEl.style.display = 'none';
    oEl.style.display = 'none';
    resultEl.style.display = '';
    scoreEl.textContent = `${score}/${quizData.length}`;
    const pct = score / quizData.length;
    if (pct === 1) verdictEl.textContent = 'Идеально! Ты используешь ИИ как профи. Продолжай в том же духе!';
    else if (pct >= 0.7) verdictEl.textContent = 'Отлично! Ты на правильном пути. Есть пара моментов, которые стоит подтянуть.';
    else if (pct >= 0.4) verdictEl.textContent = 'Неплохо, но есть над чем поработать. Перечитай принципы выше — они помогут!';
    else verdictEl.textContent = 'Стоит пересмотреть подход к ИИ. Прочитай руководство выше — там всё, что нужно знать.';
  }

  restartBtn.addEventListener('click', () => {
    current = 0; score = 0;
    qEl.style.display = '';
    oEl.style.display = '';
    resultEl.style.display = 'none';
    renderQuestion();
  });

  renderQuestion();
}
