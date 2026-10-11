(function () {
  document.getElementById("year").textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Matrix digital rain ----
  const section = document.getElementById("matrix");
  const canvas = document.getElementById("matrix-canvas");
  const ctx = canvas.getContext("2d");

  const chars =
    "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEF<>/{}[]=+*";
  const fontSize = 16;
  let columns = 0;
  let drops = [];
  let width = 0;
  let height = 0;
  let running = false;
  let lastFrame = 0;
  const frameInterval = 1000 / 24; // ~24fps gives the classic look

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = section.clientWidth;
    height = section.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const newColumns = Math.ceil(width / fontSize);
    // Keep existing drop positions, start new columns at random heights
    for (let i = columns; i < newColumns; i++) {
      drops[i] = Math.floor((Math.random() * height) / fontSize);
    }
    drops.length = newColumns;
    columns = newColumns;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
  }

  function draw() {
    // Translucent black layer leaves fading trails behind each drop
    ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = fontSize + "px 'JetBrains Mono', monospace";

    for (let i = 0; i < columns; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Bright leading character, green trail
      ctx.fillStyle = Math.random() > 0.975 ? "#d4ffd8" : "#00ff41";
      ctx.fillText(char, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  function loop(time) {
    if (!running) return;
    if (time - lastFrame >= frameInterval) {
      draw();
      lastFrame = time;
    }
    requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduceMotion) {
    // Render a static frame instead of animating
    for (let i = 0; i < 60; i++) draw();
  } else {
    // Only animate while the section is visible
    new IntersectionObserver(function (entries) {
      entries[0].isIntersecting ? start() : stop();
    }).observe(section);
  }

  // ---- Terminal typing effect ----
  const lines = [
    "$ whoami",
    "kalande_kapaya",
    "",
    "$ cat role.txt",
    "Software Engineer / Programmer",
    "",
    "$ ls skills/",
    "javascript  python  html  css  git  sql",
    "",
    "$ echo $MOTTO",
    "\"Wake up... the code has you.\"",
  ];
  const fullText = lines.join("\n");
  const typed = document.getElementById("typed");
  let typingStarted = false;

  function typeText() {
    if (reduceMotion) {
      typed.textContent = fullText;
      return;
    }
    let i = 0;
    (function next() {
      typed.textContent = fullText.slice(0, i);
      if (i++ < fullText.length) {
        const ch = fullText[i - 1];
        setTimeout(next, ch === "\n" ? 280 : 35 + Math.random() * 45);
      }
    })();
  }

  new IntersectionObserver(
    function (entries, observer) {
      if (entries[0].isIntersecting && !typingStarted) {
        typingStarted = true;
        observer.disconnect();
        typeText();
      }
    },
    { threshold: 0.4 }
  ).observe(section);
})();
