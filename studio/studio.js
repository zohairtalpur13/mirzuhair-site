(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const grounds = [...document.querySelectorAll(".bg")];

  // Tariff links pre-select the matching package in the letter.
  const packageSelect = document.getElementById("package-select");
  document.querySelectorAll("[data-plan]").forEach((link) => {
    link.addEventListener("click", () => {
      if (packageSelect) packageSelect.value = link.dataset.plan;
    });
  });

  // FormSubmit redirects back with ?sent=1 after a successful submission.
  if (new URLSearchParams(location.search).get("sent") === "1") {
    const sent = document.getElementById("sent");
    if (sent) sent.hidden = false;
  }

  // Pattern grounds: reveal each one as its section scrolls into view.
  const revealGrounds = () => {
    const sections = grounds.map((bg) => bg.parentElement);
    if (!("IntersectionObserver" in window)) {
      sections.forEach((s) => s.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -15% 0px" });
    sections.forEach((s) => io.observe(s));
  };

  const inView = (r) => r.bottom > -200 && r.top < innerHeight + 200;

  // Gentle scroll parallax: each pattern travels a little slower than the page.
  const PARALLAX = 0.14;
  const parallax = () => {
    const mid = innerHeight / 2;
    grounds.forEach((bg) => {
      const r = bg.getBoundingClientRect();
      if (!inView(r)) return;
      bg.style.setProperty("--py", `${((r.top + r.height / 2 - mid) * PARALLAX).toFixed(1)}px`);
    });
  };

  // The lantern: follows the pointer, flickers, and wanders by itself when left alone.
  const lamp = document.querySelector(".lamp");
  const LAMP_HALF = () => lamp.offsetWidth / 2;
  const LIGHT_RADIUS = coarse ? 170 : 240;
  const IDLE_MS = 3500;
  const pos = { x: innerWidth * 0.62, y: innerHeight * 0.55 };
  const target = { ...pos };
  let lastMove = -Infinity;

  const wander = (t) => {
    target.x = innerWidth * (0.5 + 0.34 * Math.sin(t * 0.00017));
    target.y = innerHeight * (0.52 + 0.3 * Math.sin(t * 0.00023 + 1.3));
  };

  const lightGrounds = (radius) => {
    grounds.forEach((bg) => {
      const r = bg.getBoundingClientRect();
      if (!inView(r)) return;
      bg.style.setProperty("--mx", `${(pos.x - r.left).toFixed(0)}px`);
      bg.style.setProperty("--my", `${(pos.y - r.top).toFixed(0)}px`);
      bg.style.setProperty("--lr", `${radius.toFixed(0)}px`);
    });
  };

  const frame = (t) => {
    if (!reduceMotion && t - lastMove > IDLE_MS) wander(t);
    const ease = reduceMotion ? 1 : 0.1;
    pos.x += (target.x - pos.x) * ease;
    pos.y += (target.y - pos.y) * ease;
    const flicker = reduceMotion ? 1 : 1 + 0.035 * Math.sin(t * 0.011) + 0.025 * Math.sin(t * 0.027);
    lamp.style.transform = `translate(${pos.x - LAMP_HALF()}px, ${pos.y - LAMP_HALF()}px) scale(${flicker.toFixed(3)})`;
    lightGrounds(LIGHT_RADIUS * flicker);
    requestAnimationFrame(frame);
  };

  const startLamp = () => {
    addEventListener("pointermove", (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      lastMove = performance.now();
    }, { passive: true });
    lamp.classList.add("on");
    requestAnimationFrame(frame);
  };

  // Block printing: tap the paper to press one of the haveli motifs into it.
  const prints = document.querySelector(".prints");
  const MOTIFS = [
    { name: "doorway", w: [170, 240] },
    { name: "medallion", w: [150, 220] },
    { name: "lantern", w: [80, 120] },
  ];
  const INKS = ["green", "brass"];
  const MAX_PRINTS = 16;
  const PRINT_LIFE_MS = 9000;
  const SKIP = "a, button, input, select, textarea, label, .paper, .ticket, .plate, .mast, .hint";
  let printCount = 0;

  const between = ([lo, hi]) => lo + Math.random() * (hi - lo);

  const press = (x, y) => {
    const motif = MOTIFS[printCount % MOTIFS.length];
    const ink = INKS[Math.floor(printCount / MOTIFS.length) % INKS.length];
    printCount += 1;

    const img = new Image();
    img.className = "stamp";
    img.alt = "";
    img.src = `art/stamp-${motif.name}-${ink}.png`;
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.setProperty("--w", `${between(motif.w).toFixed(0)}px`);
    img.style.setProperty("--r", `${(Math.random() * 36 - 18).toFixed(1)}deg`);
    prints.append(img);

    const ring = document.createElement("span");
    ring.className = "ripple";
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    prints.append(ring);
    setTimeout(() => ring.remove(), 1000);

    while (prints.querySelectorAll(".stamp").length > MAX_PRINTS) prints.querySelector(".stamp").remove();
    setTimeout(() => {
      img.classList.add("lift");
      setTimeout(() => img.remove(), 2800);
    }, PRINT_LIFE_MS);
  };

  const startPrinting = (onFirstPrint) => {
    document.addEventListener("click", (e) => {
      if (e.target.closest(SKIP)) return;
      if (String(getSelection()).length) return;
      const bodyBox = document.body.getBoundingClientRect();
      press(e.clientX - bodyBox.left, e.clientY - bodyBox.top);
      onFirstPrint();
    });
  };

  // The hint appears once the cover has scrolled away and leaves after the first print.
  const hint = document.querySelector(".hint");
  let hintDone = false;
  const retireHint = () => {
    if (hintDone) return;
    hintDone = true;
    hint.classList.remove("show");
  };
  const startHint = () => {
    if (coarse) hint.querySelector(".hint-text").textContent = "Drag to carry the lantern · tap the paper to block-print";
    const cover = document.querySelector(".cover");
    if (!cover || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(([e]) => {
      if (hintDone) return;
      hint.classList.toggle("show", !e.isIntersecting);
    }, { threshold: 0.15 }).observe(cover);
  };

  revealGrounds();
  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking || reduceMotion) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; parallax(); });
  }, { passive: true });
  if (!reduceMotion) parallax();
  startLamp();
  startPrinting(retireHint);
  startHint();
})();
