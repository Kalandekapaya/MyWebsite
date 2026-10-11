// ============================================================
// Project data — edit this list to update the workspace and
// featured cards.
// ============================================================
const PROJECTS = [
  {
    name: "Matrix Digital Rain",
    short: "MX",
    color: "#00ffff",
    category: "experiments",
    tech: "Canvas · JavaScript",
    status: "live",
    url: "https://codepen.io/kalande-kapaya/pen/yLRbZaR",
    desc: "Falling-character digital rain drawn on an HTML canvas, with fading trails. It powers the lock screen and code section of this site.",
    featured: true,
  },
  {
    name: "Particles Cursor",
    short: "PC",
    color: "#a78bfa",
    category: "3d",
    tech: "Three.js · WebGL",
    status: "live",
    url: "https://codepen.io/kalande-kapaya/pen/ZEqKwrZ",
    desc: "A GPU particle swarm that chases your cursor, built with threejs-toys. Click to remix its colours, scale and noise.",
    featured: true,
  },
  {
    name: "Magic Card",
    short: "MC",
    color: "#5ddcff",
    category: "ui",
    tech: "CSS · Houdini @property",
    status: "live",
    url: "https://codepen.io/kalande-kapaya/pen/MWzXRwz",
    desc: "A glowing card whose gradient border spins thanks to an animated CSS custom property angle.",
    featured: true,
  },
  {
    name: "Glassmorphism App Redesign",
    short: "GA",
    color: "#3a6df0",
    category: "ui",
    tech: "SCSS · jQuery",
    status: "live",
    url: "https://codepen.io/kalande-kapaya/pen/abQKMMx",
    desc: "A frosted-glass desktop app interface with tabs, dropdowns, pop-ups and a light/dark toggle.",
  },
  {
    name: "App Menu with Lock Screen",
    short: "LS",
    color: "#ff5e68",
    category: "ui",
    tech: "React · TypeScript",
    status: "live",
    url: "https://codepen.io/kalande-kapaya/pen/eYjwMXV",
    desc: "A TV-style app menu hidden behind a PIN lock screen, written in React and TypeScript.",
  },
  {
    name: "Portfolio Website",
    short: "KK",
    color: "#3bf083",
    category: "web",
    tech: "HTML · CSS · JavaScript",
    status: "progress",
    url: "https://github.com/Kalandekapaya/MyWebsite",
    desc: "This site: all five CodePen experiments blended into one portfolio.",
  },
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

$("#year").textContent = new Date().getFullYear();

// ============================================================
// Matrix digital rain (from the Matrix pen: cyan rain, its
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
// Lock screen (from App Menu With Lock Screen)
// ============================================================
const PIN = "1234";
const lock = $("#lock");
const pinInput = $("#pin-input");
const pinDigits = $$(".pin-digit");
const lockRain = createRain($(".lock-rain"));
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
    setTimeout(() => {
      if (lock.dataset.state === "logged-in") lockRain.stop();
    }, 900);
  } else {
    document.body.classList.add("is-locked");
    lock.removeAttribute("aria-hidden");
    lockRain.start();
  }
}

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
// Hero particles cursor (from ThreeJS Toys - Particles Cursor)
// ============================================================
async function initParticles() {
  const hero = $("#home");
  if (reduceMotion) return;
  try {
    const { particlesCursor } = await import(
      "https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js"
    );
    const small = window.innerWidth < 700;
    const pc = particlesCursor({
      el: hero,
      gpgpuSize: small ? 256 : 512,
      colors: [0x00ffff, 0x4e00c2],
      color: 0x5ddcff,
      coordScale: 0.5,
      noiseIntensity: 0.001,
      noiseTimeCoef: 0.0001,
      pointSize: small ? 4 : 5,
      pointDecay: 0.0025,
      sleepRadiusX: small ? 120 : 250,
      sleepRadiusY: small ? 120 : 250,
      sleepTimeCoefX: 0.001,
      sleepTimeCoefY: 0.002,
    });
    hero.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      pc.uniforms.uColor.value.set(Math.random() * 0xffffff);
      pc.uniforms.uCoordScale.value = 0.001 + Math.random() * 2;
      pc.uniforms.uNoiseIntensity.value = 0.0001 + Math.random() * 0.001;
      pc.uniforms.uPointSize.value = 1 + Math.random() * 10;
    });
  } catch (err) {
    // WebGL or the CDN unavailable: the gradient background still looks fine
    console.warn("Particles cursor unavailable:", err);
    $(".hero-hint").hidden = true;
  }
}
initParticles();

// ============================================================
// Workspace (from the Glassmorphism Creative Cloud redesign)
// ============================================================
const list = $(".project-list");
const searchInput = $(".search-bar input");
const popUp = $(".pop-up");
const overlay = $(".overlay-app");
let activeFilter = "all";

const FILTER_TITLES = {
  all: "All Projects",
  progress: "In progress",
  ui: "UI Design",
  "3d": "3D / WebGL",
  experiments: "Experiments",
  web: "Websites",
};

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function linkLabel(url) {
  return url.includes("codepen.io") ? "Open on CodePen" : url.includes("github.com") ? "View on GitHub" : "Open project";
}

list.innerHTML = PROJECTS.map((p, i) => {
  const live = p.status === "live";
  return `
    <li class="project" data-index="${i}" data-category="${p.category}" data-status="${p.status}">
      <div class="products">
        <i class="app-icon" style="--c:${p.color}">${escapeHtml(p.short)}</i>
        <span class="products-name">${escapeHtml(p.name)}</span>
      </div>
      <span class="tech">${escapeHtml(p.tech)}</span>
      <span class="status"><span class="status-circle${live ? " green" : ""}"></span>${live ? "Live" : "In progress"}</span>
      <div class="button-wrapper">
        ${
          live
            ? `<a class="content-button status-button open" href="${p.url}" target="_blank" rel="noopener">Open</a>`
            : `<button class="content-button status-button" type="button" data-details>Details</button>`
        }
        <button class="more" type="button" aria-label="More options for ${escapeHtml(p.name)}" aria-expanded="false"></button>
        <ul class="dropdown">
          <li><button type="button" data-details>Details</button></li>
          <li><a href="${p.url}" target="_blank" rel="noopener">${linkLabel(p.url)}</a></li>
          <li><button type="button" data-copy="${p.url}">Copy link</button></li>
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
  link.href = project.url;
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
    navigator.clipboard?.writeText(copy.dataset.copy).then(() => {
      copy.textContent = "Copied!";
      setTimeout(() => (copy.textContent = "Copy link"), 1500);
    });
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
// Featured magic cards (from Magic Card)
// ============================================================
$(".magic-cards").innerHTML = PROJECTS.filter((p) => p.featured)
  .map(
    (p, i) => `
    <a class="card" href="${p.url}" target="_blank" rel="noopener">
      <span class="card-index">0${i + 1}</span>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(p.name)}</h3>
        <p class="card-desc">${escapeHtml(p.desc)}</p>
        <p class="card-tech">${escapeHtml(p.tech)}</p>
      </div>
      <span class="card-link">${linkLabel(p.url)} <svg class="icon"><use href="#i-arrow"/></svg></span>
    </a>`
  )
  .join("");

// ============================================================
// Code section: matrix rain + typing terminal
// ============================================================
const codeSection = $("#code");
const codeRain = createRain($(".matrix-rain"), { fontSize: 16, fade: 0.06 });

new IntersectionObserver((entries) => {
  entries[0].isIntersecting ? codeRain.start() : codeRain.stop();
}).observe(codeSection);

const TERMINAL_TEXT = [
  "$ whoami",
  "kalande_kapaya",
  "",
  "$ cat role.txt",
  "Software Engineer / Creative Front-End Developer",
  "",
  "$ ls skills/",
  "html  css  scss  javascript  typescript  react  three.js  git",
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

// Highlight the nav link for the section in view
const navLinks = $$(".site-nav a");
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
    });
  },
  { rootMargin: "-50% 0px -50% 0px" }
);
navLinks.forEach((a) => navObserver.observe($(a.getAttribute("href"))));
