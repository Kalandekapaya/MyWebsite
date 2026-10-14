// ============================================================
// Project data: the workspace list, counters and featured cards
// are built from this list. status is "live" (has a public link),
// "done" (completed) or "progress". Leave url empty if there is
// no public link.
// ============================================================
const PROJECTS = [
  {
    name: "AI Chatbot for ZUT",
    short: "AI",
    color: "#00ffff",
    category: "ai",
    tech: "Azure AI · OpenAI Service",
    status: "live",
    url: "https://t.me/ZUTChat_bot",
    desc: "A Telegram chatbot for ZUT that integrates Azure AI and the OpenAI Service to answer questions.",
    featured: true,
  },
  {
    name: "Provincial Data Analysis & Statistics Tool",
    short: "DA",
    color: "#a78bfa",
    category: "data",
    tech: "Internal tool · Lusaka Provincial Health Office",
    status: "done",
    url: "",
    desc: "A custom tool for processing provincial health data and troubleshooting systems, built for internal use at the Lusaka Provincial Health Office.",
    featured: true,
  },
  {
    name: "Attendance Management System",
    short: "AM",
    color: "#5ddcff",
    category: "web",
    tech: "PHP · JavaScript",
    status: "done",
    url: "",
    desc: "A full-stack attendance management system built with PHP and JavaScript.",
    featured: true,
  },
  {
    name: "Human Resource Consultant Web",
    short: "HR",
    color: "#ff5e68",
    category: "web",
    tech: "Bootstrap · Responsive",
    status: "done",
    url: "",
    desc: "A responsive website for a human resource consultancy, built on the Bootstrap framework.",
  },
  {
    name: "Gulani Stores",
    short: "GS",
    color: "#f5a524",
    category: "marketing",
    tech: "Marketing · Retail POS · Mobile apps",
    status: "live",
    url: "https://www.gulanistores.com/",
    desc: "Three years as Marketing Manager: led multi-channel campaigns, user adoption and rollouts for retail point-of-sale software and mobile business apps, and grew the stores' digital footprint.",
    featured: true,
  },
  {
    name: "Portfolio Website",
    short: "KK",
    color: "#3bf083",
    category: "web",
    tech: "HTML · CSS · JavaScript",
    status: "progress",
    url: "https://github.com/Kalandekapaya/MyWebsite",
    desc: "This site: a single-page portfolio with a lock screen, aurora home, glass workspace and a matrix-rain terminal.",
  },
];

const STATUS_LABELS = { live: "Live", done: "Completed", progress: "In progress" };

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

$("#year").textContent = new Date().getFullYear();

// ============================================================
// Matrix digital rain (design by Sara Mazal: cyan rain and its
// symbols, plus some code characters)
// ============================================================
const RAIN_CHARS = "פסחכשרושמח♡•~✶{}<>/=;01アカサタナ";

function createRain(canvas, { fontSize = 18, fade = 0.05 } = {}) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let drops = [];
  let running = false;
  let last = 0;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const columns = Math.ceil(width / fontSize);
    for (let i = drops.length; i < columns; i++) {
      drops[i] = Math.floor((Math.random() * height) / fontSize);
    }
    drops.length = columns;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
  }

  function draw() {
    ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    for (let i = 0; i < drops.length; i++) {
      const char = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
      const r = Math.random();
      ctx.fillStyle = r > 0.98 ? "#ffffff" : r > 0.96 ? "#a78bfa" : "#00ffff";
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      drops[i]++;
      if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
    }
  }

  function loop(time) {
    if (!running) return;
    if (time - last >= 34) {
      draw();
      last = time;
    }
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", resize);

  return {
    start() {
      if (reduceMotion) {
        for (let i = 0; i < 80; i++) draw();
        return;
      }
      if (running) return;
      running = true;
      requestAnimationFrame(loop);
    },
    stop() {
      running = false;
    },
  };
}

// ============================================================
// Lock screen (design based on Hyperplexed's App Menu With Lock Screen)
// ============================================================
const PIN = "1234";
const lock = $("#lock");
const pinInput = $("#pin-input");
const pinDigits = $$(".pin-digit");
const hideTimers = [];

function setLockState(state) {
  lock.dataset.state = state;
  const typing = state === "logging-in" || state === "error";
  pinInput.disabled = !typing;
  if (typing) pinInput.focus({ preventScroll: true });

  if (state === "logged-out") {
    pinInput.value = "";
    renderPin();
  }

  if (state === "logged-in") {
    document.body.classList.remove("is-locked");
    lock.setAttribute("aria-hidden", "true");
    try {
      sessionStorage.setItem("unlocked", "1");
    } catch (e) {}
    // Let the particles slide away with the lock screen, then shut them down
    setTimeout(() => {
      if (lock.dataset.state === "logged-in") stopLockParticles();
    }, 900);
  } else {
    document.body.classList.add("is-locked");
    lock.removeAttribute("aria-hidden");
    startLockParticles();
  }
}

// Particles cursor behind the lock screen (threejs-toys by Kevin Levron)
const TOYS_URL = "https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js";
let toysModule = null;
let particlesCanvas = null;
let particlesLoading = false;

// The particle library (~250 KB gzipped with three.js) waits until the page has
// loaded and the browser is idle, so it never delays the first paint or the photo.
const pageReady = new Promise((resolve) => {
  const whenIdle = () =>
    window.requestIdleCallback ? requestIdleCallback(resolve, { timeout: 1200 }) : setTimeout(resolve, 200);
  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });
});

async function startLockParticles() {
  if (reduceMotion || particlesCanvas || particlesLoading) return;
  particlesLoading = true;
  try {
    await pageReady;
    if (lock.dataset.state === "logged-in") return;
    toysModule = toysModule || (await import(TOYS_URL));
    if (lock.dataset.state === "logged-in") return;
    const small = window.innerWidth < 700;
    toysModule.particlesCursor({
      el: lock,
      // Fewer particles that fade faster: a shorter, tighter trail and a lighter GPU load
      gpgpuSize: small ? 128 : 256,
      colors: [0x00ffff, 0x4e00c2],
      color: 0x5ddcff,
      coordScale: 0.5,
      noiseIntensity: 0.0005,
      noiseTimeCoef: 0.0001,
      pointSize: small ? 3 : 4,
      pointDecay: 0.009,
      sleepRadiusX: small ? 120 : 250,
      sleepRadiusY: small ? 120 : 250,
      sleepTimeCoefX: 0.001,
      sleepTimeCoefY: 0.002,
    });
    particlesCanvas = lock.querySelector(":scope > canvas:last-of-type");
    particlesCanvas.classList.add("lock-particles");
    startKPath();
  } catch (err) {
    // No WebGL or the library couldn't load: the photo background shows on its own
    console.warn("Particles cursor unavailable:", err);
  } finally {
    particlesLoading = false;
  }
}

function stopLockParticles() {
  stopKPath();
  if (!particlesCanvas) return;
  // The library has no stop method, so release its WebGL context to stop GPU work.
  // The canvas stays in the DOM (hidden) because the library still resizes it.
  const gl = particlesCanvas.getContext("webgl2") || particlesCanvas.getContext("webgl");
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
  particlesCanvas.hidden = true;
  particlesCanvas = null;
}

// Idle path in the shape of a K. The library's own idle motion is a fixed
// figure-eight, so while the real pointer isn't over the lock screen we feed
// it a virtual pointer that traces the letter instead. Points are relative to
// the screen centre, in units of the letter's height.
const K_POINTS = [
  [-0.2, -0.5], // top of the stem
  [-0.2, 0.5], // bottom of the stem
  [-0.2, 0.05], // junction
  [0.24, -0.5], // upper arm
  [-0.2, 0.05], // junction
  [0.26, 0.5], // lower arm
  [-0.2, 0.05], // junction
  [-0.2, -0.5], // back to the top
];
const K_LOOP_MS = 10000;
const K_SEGMENTS = K_POINTS.slice(1).map((end, i) => {
  const start = K_POINTS[i];
  return { start, end, length: Math.hypot(end[0] - start[0], end[1] - start[1]) };
});
const K_LENGTH = K_SEGMENTS.reduce((sum, seg) => sum + seg.length, 0);
let kFrame = 0;
let kStartTime = 0;
let realPointerOnLock = false;

function kPointAt(progress) {
  let distance = progress * K_LENGTH;
  for (const seg of K_SEGMENTS) {
    if (distance <= seg.length) {
      const t = distance / seg.length;
      return [seg.start[0] + (seg.end[0] - seg.start[0]) * t, seg.start[1] + (seg.end[1] - seg.start[1]) * t];
    }
    distance -= seg.length;
  }
  return K_POINTS[K_POINTS.length - 1];
}

function driveKPath(time) {
  if (!realPointerOnLock) {
    const rect = lock.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height) * 0.7;
    const [x, y] = kPointAt(((time - kStartTime) % K_LOOP_MS) / K_LOOP_MS);
    lock.dispatchEvent(
      new PointerEvent("pointermove", {
        clientX: rect.left + rect.width / 2 + x * size,
        clientY: rect.top + rect.height / 2 + y * size,
        bubbles: true,
      })
    );
  }
  kFrame = requestAnimationFrame(driveKPath);
}

function startKPath() {
  if (kFrame) return;
  kStartTime = performance.now();
  kFrame = requestAnimationFrame(driveKPath);
}

function stopKPath() {
  cancelAnimationFrame(kFrame);
  kFrame = 0;
}

// Real mouse or finger on the lock screen takes over; the K resumes when it leaves
lock.addEventListener("pointermove", (e) => {
  if (e.isTrusted) realPointerOnLock = true;
});
lock.addEventListener("pointerleave", (e) => {
  if (e.isTrusted) realPointerOnLock = false;
});

function renderPin() {
  const value = pinInput.value;
  pinDigits.forEach((digit, i) => {
    const char = value[i] || "";
    if (digit.textContent !== char) {
      digit.textContent = char;
      digit.classList.remove("hidden");
      clearTimeout(hideTimers[i]);
      // Show each digit briefly, then mask it with a dot
      if (char) hideTimers[i] = setTimeout(() => digit.classList.add("hidden"), 500);
    }
    digit.classList.toggle("focused", i === value.length);
  });
}

function verifyPin() {
  setLockState("verifying");
  setTimeout(() => {
    if (pinInput.value === PIN) {
      setLockState("logged-in");
    } else {
      pinInput.value = "";
      renderPin();
      setLockState("error");
    }
  }, 300 + Math.random() * 400);
}

pinInput.addEventListener("input", () => {
  pinInput.value = pinInput.value.replace(/\D/g, "").slice(0, 4);
  if (lock.dataset.state === "error" && pinInput.value) lock.dataset.state = "logging-in";
  renderPin();
  if (pinInput.value.length === 4) verifyPin();
});

lock.addEventListener("click", (e) => {
  if (e.target.closest(".lock-skip, .pin-cancel")) return;
  if (lock.dataset.state === "logged-out") setLockState("logging-in");
  else if (lock.dataset.state !== "verifying") pinInput.focus({ preventScroll: true });
});

$(".pin-cancel").addEventListener("click", () => setLockState("logged-out"));
$(".lock-skip").addEventListener("click", () => setLockState("logged-in"));
$(".relock").addEventListener("click", () => setLockState("logged-out"));

document.addEventListener("keydown", (e) => {
  if (lock.dataset.state === "logged-in") return;
  if (e.key === "Escape") {
    setLockState(lock.dataset.state === "logged-out" ? "logged-in" : "logged-out");
  } else if (lock.dataset.state === "logged-out" && (e.key === "Enter" || e.key === " " || /^\d$/.test(e.key))) {
    e.preventDefault();
    setLockState("logging-in");
    if (/^\d$/.test(e.key)) {
      pinInput.value = e.key;
      renderPin();
    }
  }
});

// Clock + date, 12-hour format like the original
function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, "0");
  $$("[data-clock]").forEach((el) => (el.textContent = `${hours}:${minutes}`));
  $$("[data-date]").forEach(
    (el) => (el.textContent = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }))
  );
}
updateClock();
setInterval(updateClock, 1000);

let alreadyUnlocked = false;
try {
  alreadyUnlocked = sessionStorage.getItem("unlocked") === "1";
} catch (e) {}
setLockState(alreadyUnlocked ? "logged-in" : "logged-out");

// ============================================================
// Home aurora: flowing ribbons of light in the site palette.
// Drawn at a fraction of screen resolution; the browser's
// upscaling keeps it soft and the per-frame cost low.
// ============================================================
function createAurora(canvas) {
  const ctx = canvas.getContext("2d");
  const SCALE = 6;
  const ribbons = [
    { rgb: "0, 200, 230", base: 0.34, amp: 0.1, speed: 0.32, phase: 0, alpha: 0.55 },
    { rgb: "60, 103, 227", base: 0.5, amp: 0.13, speed: 0.22, phase: 2.1, alpha: 0.5 },
    { rgb: "150, 90, 245", base: 0.66, amp: 0.11, speed: 0.27, phase: 4.2, alpha: 0.55 },
  ];
  let width = 0;
  let height = 0;
  let running = false;
  let last = 0;

  function resize() {
    width = Math.max(1, Math.ceil(canvas.clientWidth / SCALE));
    height = Math.max(1, Math.ceil(canvas.clientHeight / SCALE));
    canvas.width = width;
    canvas.height = height;
  }

  function draw(time) {
    const s = time / 1000;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#f4f6fb";
    ctx.fillRect(0, 0, width, height);
    // Multiply on the light background: overlapping ribbons deepen instead of washing out
    ctx.globalCompositeOperation = "multiply";

    for (const r of ribbons) {
      for (let x = 0; x < width; x++) {
        // Wave position in real pixels (not screen fraction) so phones get the same smooth curves
        const nx = (x * SCALE) / 1400;
        // Two layered waves give each ribbon a slow, curtain-like drift
        const y =
          height *
          (r.base +
            r.amp * Math.sin(nx * 5 + s * r.speed + r.phase) +
            0.05 * Math.sin(nx * 13 - s * r.speed * 1.7 + r.phase * 2));
        const thickness = height * (0.12 + 0.07 * Math.sin(nx * 3 + s * 0.4 + r.phase));
        const glow = r.alpha * (0.55 + 0.45 * Math.sin(nx * 4 - s * 0.5 + r.phase));
        // Bright lower edge fading upward, like a real aurora curtain
        const g = ctx.createLinearGradient(0, y - thickness * 2, 0, y + thickness);
        g.addColorStop(0, `rgba(${r.rgb}, 0)`);
        g.addColorStop(0.75, `rgba(${r.rgb}, ${glow})`);
        g.addColorStop(1, `rgba(${r.rgb}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(x, y - thickness * 2, 1, thickness * 3);
      }
    }
  }

  function loop(time) {
    if (!running) return;
    // ~30fps is plenty for slow motion; skip drawing while the lock screen covers the page
    if (time - last >= 33 && !document.body.classList.contains("is-locked")) {
      draw(time);
      last = time;
    }
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (reduceMotion) draw(0);
  });

  return {
    start() {
      if (reduceMotion) {
        draw(0);
        return;
      }
      if (running) return;
      running = true;
      requestAnimationFrame(loop);
    },
    stop() {
      running = false;
    },
  };
}

const aurora = createAurora($(".hero-aurora"));
new IntersectionObserver((entries) => {
  entries[0].isIntersecting ? aurora.start() : aurora.stop();
}).observe($("#home"));

// ============================================================
// Workspace (glassmorphism app design by Mikołaj Gałęziowski)
// ============================================================
const list = $(".project-list");
const searchInput = $(".search-bar input");
const popUp = $(".pop-up");
const overlay = $(".overlay-app");
let activeFilter = "all";

const FILTER_TITLES = {
  all: "All Projects",
  progress: "In progress",
  web: "Web Apps",
  ai: "AI",
  data: "Data Tools",
  marketing: "Marketing",
};

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function linkLabel(url) {
  if (url.includes("github.com")) return "View on GitHub";
  if (url.includes("t.me/")) return "Open on Telegram";
  if (url.includes("gulanistores")) return "Visit website";
  return "Open project";
}

list.innerHTML = PROJECTS.map((p, i) => {
  const live = p.status === "live";
  const finished = p.status !== "progress";
  const link = p.url ? `<li><a href="${p.url}" target="_blank" rel="noopener">${linkLabel(p.url)}</a></li>` : "";
  return `
    <li class="project" data-index="${i}" data-category="${p.category}" data-status="${p.status}">
      <div class="products">
        <i class="app-icon" style="--c:${p.color}">${escapeHtml(p.short)}</i>
        <span class="products-name">${escapeHtml(p.name)}</span>
      </div>
      <span class="tech">${escapeHtml(p.tech)}</span>
      <span class="status"><span class="status-circle${finished ? " green" : ""}"></span>${STATUS_LABELS[p.status]}</span>
      <div class="button-wrapper">
        ${
          live && p.url
            ? `<a class="content-button status-button open" href="${p.url}" target="_blank" rel="noopener">Open</a>`
            : `<button class="content-button status-button" type="button" data-details>Details</button>`
        }
        <button class="more" type="button" aria-label="More options for ${escapeHtml(p.name)}" aria-expanded="false"></button>
        <ul class="dropdown">
          <li><button type="button" data-details>Details</button></li>
          ${link}
          ${p.url ? `<li><button type="button" data-copy="${p.url}">Copy link</button></li>` : ""}
        </ul>
      </div>
    </li>`;
}).join("");

$$("[data-count]").forEach((el) => {
  el.textContent = el.dataset.count === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.status === el.dataset.count).length;
});

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  $$(".project", list).forEach((row) => {
    const p = PROJECTS[row.dataset.index];
    const matchesFilter =
      activeFilter === "all" || (activeFilter === "progress" ? p.status === "progress" : p.category === activeFilter);
    const matchesQuery = !query || `${p.name} ${p.tech} ${p.desc}`.toLowerCase().includes(query);
    row.hidden = !(matchesFilter && matchesQuery);
    if (!row.hidden) visible++;
  });
  $(".empty-state").hidden = visible > 0;
}

function setFilter(filter) {
  activeFilter = filter;
  $$("[data-filter]").forEach((el) => el.classList.toggle("is-active", el.dataset.filter === filter));
  $("[data-title]").textContent = FILTER_TITLES[filter];
  showPanel("projects");
  applyFilters();
}

function showPanel(name) {
  $$(".app-header .menu-link").forEach((tab) => {
    const active = tab.dataset.panel === name;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", active);
  });
  $$(".panel").forEach((panel) => {
    const active = panel.dataset.panel === name;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
  $(".main-header").hidden = name !== "projects";
}

$$(".app-header .menu-link").forEach((tab) => tab.addEventListener("click", () => showPanel(tab.dataset.panel)));
$$("[data-filter]").forEach((el) => el.addEventListener("click", () => setFilter(el.dataset.filter)));

searchInput.addEventListener("input", () => {
  showPanel("projects");
  applyFilters();
});

function closeDropdowns() {
  $$(".button-wrapper.is-active").forEach((w) => {
    w.classList.remove("is-active");
    $(".more", w).setAttribute("aria-expanded", "false");
  });
}

function openPopUp(project) {
  $("#pop-up-title").textContent = project.name;
  $(".pop-up__subtitle").textContent = project.desc;
  $(".pop-up__tech").textContent = project.tech;
  const link = $(".pop-up__link");
  link.hidden = !project.url;
  link.href = project.url || "#";
  link.textContent = linkLabel(project.url);
  popUp.classList.add("visible");
  overlay.classList.add("is-active");
  $(".close", popUp).focus({ preventScroll: true });
}

function closePopUp() {
  popUp.classList.remove("visible");
  overlay.classList.remove("is-active");
}

list.addEventListener("click", (e) => {
  const row = e.target.closest(".project");
  if (!row) return;
  const project = PROJECTS[row.dataset.index];
  const more = e.target.closest(".more");

  if (more) {
    const wrapper = more.parentElement;
    const open = !wrapper.classList.contains("is-active");
    closeDropdowns();
    wrapper.classList.toggle("is-active", open);
    more.setAttribute("aria-expanded", open);
    return;
  }

  if (e.target.closest("[data-details]")) {
    closeDropdowns();
    openPopUp(project);
    return;
  }

  const copy = e.target.closest("[data-copy]");
  if (copy) {
    Promise.resolve(navigator.clipboard?.writeText(copy.dataset.copy))
      .then(() => {
        copy.textContent = "Copied!";
      })
      .catch(() => {
        copy.textContent = "Copy failed";
      })
      .finally(() => setTimeout(() => (copy.textContent = "Copy link"), 1500));
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".button-wrapper")) closeDropdowns();
});

$$(".pop-up .close").forEach((btn) => btn.addEventListener("click", closePopUp));
overlay.addEventListener("click", closePopUp);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && popUp.classList.contains("visible")) closePopUp();
});

$(".dark-light").addEventListener("click", () => $("#workspace").classList.toggle("light-mode"));

// ============================================================
// Featured cards (spinning gradient-border cards)
// ============================================================
$(".magic-cards").innerHTML = PROJECTS.filter((p) => p.featured)
  .map((p, i) => {
    const tag = p.url ? `a href="${p.url}" target="_blank" rel="noopener"` : `div tabindex="0"`;
    const footer = p.url
      ? `<span class="card-link">${linkLabel(p.url)} <svg class="icon"><use href="#i-arrow"/></svg></span>`
      : `<span class="card-link">${STATUS_LABELS[p.status]}</span>`;
    return `
    <${tag} class="card">
      <span class="card-index">0${i + 1}</span>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(p.name)}</h3>
        <p class="card-desc">${escapeHtml(p.desc)}</p>
        <p class="card-tech">${escapeHtml(p.tech)}</p>
      </div>
      ${footer}
    </${p.url ? "a" : "div"}>`;
  })
  .join("");

// ============================================================
// Code section: matrix rain + typing terminal
// ============================================================
const codeSection = $("#code");
// Created on first view so it costs nothing at page load
let codeRain = null;

new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    codeRain = codeRain || createRain($(".matrix-rain"), { fontSize: 16, fade: 0.06 });
    codeRain.start();
  } else {
    codeRain?.stop();
  }
}).observe(codeSection);

const TERMINAL_TEXT = [
  "$ whoami",
  "kalande_kapaya",
  "",
  "$ cat role.txt",
  "Full-Stack Software Engineer & Product Specialist",
  "",
  "$ ls skills/",
  "php  laravel  codeigniter  react  javascript  java  dhis2  power-bi",
  "",
  "$ cat location.txt",
  "Lusaka, Zambia",
  "",
  "$ echo $MOTTO",
  '"Wake up... the code has you."',
].join("\n");

const typed = $("#typed");
new IntersectionObserver(
  (entries, observer) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    if (reduceMotion) {
      typed.textContent = TERMINAL_TEXT;
      return;
    }
    let i = 0;
    (function next() {
      typed.textContent = TERMINAL_TEXT.slice(0, i);
      if (i++ < TERMINAL_TEXT.length) {
        setTimeout(next, TERMINAL_TEXT[i - 1] === "\n" ? 280 : 30 + Math.random() * 40);
      }
    })();
  },
  { threshold: 0.4 }
).observe(codeSection);

// Highlight the nav link for the section in view. Uses scroll position rather
// than an IntersectionObserver rootMargin, which browsers ignore inside
// cross-origin iframes (such as an embedded preview).
const navLinks = $$(".site-nav a");
const navSections = navLinks.map((a) => $(a.getAttribute("href")));
let navTicking = false;

function updateActiveNav() {
  navTicking = false;
  const middle = window.innerHeight / 2;
  const current = navSections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= middle && rect.bottom > middle;
  });
  navLinks.forEach((a, i) => a.classList.toggle("is-active", navSections[i] === current));
  // Light header while the light home section is still behind it
  const header = $(".site-header");
  header.classList.toggle("is-light", $("#home").getBoundingClientRect().bottom > header.offsetHeight);
}

window.addEventListener(
  "scroll",
  () => {
    if (!navTicking) {
      navTicking = true;
      requestAnimationFrame(updateActiveNav);
    }
  },
  { passive: true }
);
window.addEventListener("resize", updateActiveNav);
updateActiveNav();
