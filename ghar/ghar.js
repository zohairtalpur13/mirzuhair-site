/* Ghar: draw the home you grew up in, from memory, and make a page for a shared book.
   Everything runs in the browser. Nothing is uploaded or stored. */
(() => {
  "use strict";

  const GRID = Object.freeze({ cols: 24, rows: 18 });
  const INK = "#2b2a28";
  const CARD = "#fbf8f1";
  const BLUE = "#2d5fb8";
  const STAR = "#f2c14e";
  const DOT = "rgba(43,42,40,.22)";
  const FONT = Object.freeze({ serif: "Young Serif", sans: "Instrument Sans", hand: "Caveat" });
  const PAGE = Object.freeze({ w: 1240, h: 1754 }); // A5 at 150 dpi
  const MAX_HISTORY = 80;
  const LABEL_MAX = 24;
  const EMPTY = Object.freeze({ walls: [], stamps: [], labels: [] });

  // a plan I drew to test the tool; it is not anyone's home
  const EXAMPLE = Object.freeze({
    walls: [[3, 3, 21, 3], [21, 3, 21, 15], [21, 15, 3, 15], [3, 15, 3, 3], [10, 3, 10, 9], [3, 9, 14, 9], [14, 9, 14, 15], [17, 3, 17, 9], [17, 9, 21, 9]]
      .map(([x1, y1, x2, y2]) => ({ x1, y1, x2, y2 })),
    stamps: [
      { type: "door", x: 7, y: 15, rot: 180 }, { type: "door", x: 5, y: 9, rot: 0 }, { type: "door", x: 14, y: 11, rot: 90 },
      { type: "door", x: 18, y: 9, rot: 0 }, { type: "window", x: 12, y: 3, rot: 0 }, { type: "window", x: 21, y: 11, rot: 90 },
      { type: "window", x: 3, y: 5, rot: 90 }, { type: "bed", x: 4, y: 4, rot: 0 }, { type: "star", x: 5, y: 6, rot: 0 }
    ],
    labels: [{ x: 6.4, y: 5.4, text: "our room" }, { x: 5.2, y: 12.4, text: "courtyard" }, { x: 11.6, y: 6.2, text: "kitchen" }, { x: 16, y: 13.6, text: "the baithak" }]
  });

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- geometry ---------- */
  const rad = (deg) => deg * Math.PI / 180;

  function snapPoint(px, py, cell) {
    return { x: Math.max(0, Math.min(GRID.cols, Math.round(px / cell))), y: Math.max(0, Math.min(GRID.rows, Math.round(py / cell))) };
  }

  // walls run straight or at 45°, so a plan drawn quickly still reads as architecture
  function constrainWall(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    if (Math.abs(dx) > 2 * Math.abs(dy)) return { x: b.x, y: a.y };
    if (Math.abs(dy) > 2 * Math.abs(dx)) return { x: a.x, y: b.y };
    const d = Math.max(Math.abs(dx), Math.abs(dy));
    return { x: a.x + Math.sign(dx) * d, y: a.y + Math.sign(dy) * d };
  }

  function distToSegment(p, w) {
    const vx = w.x2 - w.x1;
    const vy = w.y2 - w.y1;
    const len2 = vx * vx + vy * vy || 1;
    const t = Math.max(0, Math.min(1, ((p.x - w.x1) * vx + (p.y - w.y1) * vy) / len2));
    return Math.hypot(p.x - (w.x1 + t * vx), p.y - (w.y1 + t * vy));
  }

  /* ---------- drawing the plan ---------- */
  function drawWall(ctx, w, g) {
    ctx.beginPath();
    ctx.moveTo(w.x1 * g, w.y1 * g);
    ctx.lineTo(w.x2 * g, w.y2 * g);
    ctx.stroke();
  }

  function drawStar(ctx, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * .45 : r;
      const a = rad(-90 + i * 36);
      ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fillStyle = STAR;
    ctx.fill();
    ctx.lineWidth = Math.max(1, r * .1);
    ctx.stroke();
  }

  function drawStamp(ctx, s, g, ground) {
    ctx.save();
    ctx.translate(s.x * g, s.y * g);
    ctx.rotate(rad(s.rot));
    ctx.strokeStyle = INK;
    ctx.lineCap = "butt";
    if (s.type === "door") {
      ctx.strokeStyle = ground;
      ctx.lineWidth = g * .34;
      ctx.beginPath(); ctx.moveTo(g * .12, 0); ctx.lineTo(g * 1.88, 0); ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = Math.max(1.2, g * .07);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -g * 2); ctx.stroke();
      ctx.lineWidth = Math.max(.8, g * .04);
      ctx.setLineDash([g * .12, g * .1]);
      ctx.beginPath(); ctx.arc(0, 0, g * 2, rad(-90), 0); ctx.stroke();
    } else if (s.type === "window") {
      ctx.strokeStyle = ground;
      ctx.lineWidth = g * .34;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(g * 3, 0); ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = Math.max(1, g * .05);
      [-g * .14, 0, g * .14].forEach((o) => { ctx.beginPath(); ctx.moveTo(0, o); ctx.lineTo(g * 3, o); ctx.stroke(); });
    } else if (s.type === "bed") {
      ctx.lineWidth = Math.max(1, g * .06);
      ctx.strokeRect(g * .1, g * .1, g * 1.8, g * 2.8);
      ctx.fillStyle = INK;
      ctx.fillRect(g * .35, g * .3, g * 1.3, g * .45);
    } else if (s.type === "star") {
      drawStar(ctx, g * .62);
    }
    ctx.restore();
  }

  function drawPlan(ctx, plan, g, ground = CARD) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = INK;
    ctx.lineWidth = Math.max(3, g * .22);
    plan.walls.forEach((w) => drawWall(ctx, w, g));
    plan.stamps.filter((s) => s.type !== "star").forEach((s) => drawStamp(ctx, s, g, ground));
    ctx.fillStyle = BLUE;
    ctx.font = `600 ${Math.max(14, g * .78)}px ${FONT.hand}`;
    ctx.textBaseline = "alphabetic";
    plan.labels.forEach((l) => ctx.fillText(l.text, l.x * g, l.y * g));
    plan.stamps.filter((s) => s.type === "star").forEach((s) => drawStamp(ctx, s, g, ground));
    ctx.restore();
  }

  function drawDots(ctx, g) {
    ctx.fillStyle = DOT;
    const r = Math.max(1, g * .05);
    for (let y = 0; y <= GRID.rows; y++) {
      for (let x = 0; x <= GRID.cols; x++) {
        ctx.beginPath(); ctx.arc(x * g, y * g, r, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  function planBounds(plan) {
    const xs = [];
    const ys = [];
    plan.walls.forEach((w) => { xs.push(w.x1, w.x2); ys.push(w.y1, w.y2); });
    plan.stamps.forEach((s) => { xs.push(s.x - 2, s.x + 2); ys.push(s.y - 2, s.y + 2); });
    plan.labels.forEach((l) => { xs.push(l.x, l.x + l.text.length * .45); ys.push(l.y - 1, l.y); });
    if (!xs.length) return null;
    return { x0: Math.max(0, Math.min(...xs) - .6), y0: Math.max(0, Math.min(...ys) - .6), x1: Math.min(GRID.cols, Math.max(...xs) + .6), y1: Math.min(GRID.rows, Math.max(...ys) + .6) };
  }

  // the plan alone, cropped to what was drawn, for the book spread and the page
  function renderPlanImage(plan, targetW) {
    const b = planBounds(plan);
    if (!b) return null;
    const g = targetW / (b.x1 - b.x0);
    const c = document.createElement("canvas");
    c.width = Math.round(targetW);
    c.height = Math.max(1, Math.round((b.y1 - b.y0) * g));
    const ctx = c.getContext("2d");
    ctx.fillStyle = CARD;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.translate(-b.x0 * g, -b.y0 * g);
    drawPlan(ctx, plan, g);
    return c;
  }

  /* ---------- the downloadable page ---------- */
  function wrapLines(ctx, text, maxW) {
    const words = text.split(/\s+/).filter(Boolean);
    return words.reduce((lines, word) => {
      const last = lines[lines.length - 1];
      if (last === undefined) return [word];
      const tryLine = `${last} ${word}`;
      return ctx.measureText(tryLine).width > maxW ? [...lines, word] : [...lines.slice(0, -1), tryLine];
    }, []);
  }

  function renderPage(plan, memory) {
    const c = document.createElement("canvas");
    c.width = PAGE.w;
    c.height = PAGE.h;
    const ctx = c.getContext("2d");
    const m = 110;
    ctx.fillStyle = CARD;
    ctx.fillRect(0, 0, PAGE.w, PAGE.h);

    ctx.fillStyle = "rgba(43,42,40,.6)";
    ctx.font = `500 24px ${FONT.sans}`;
    ctx.fillText("GHAR · DRAW ME YOUR HOME", m, m);
    ctx.textAlign = "right";
    ctx.fillText(memory.name.toUpperCase(), PAGE.w - m, m);
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(43,42,40,.2)";
    ctx.fillRect(m, m + 22, PAGE.w - m * 2, 2);

    const planImg = renderPlanImage(plan, PAGE.w - m * 2);
    const planTop = m + 70;
    const planMaxH = 820;
    if (planImg) {
      const s = Math.min(1, planMaxH / planImg.height);
      const w = planImg.width * s;
      ctx.drawImage(planImg, (PAGE.w - w) / 2, planTop, w, planImg.height * s);
    }

    let y = planTop + planMaxH + 110;
    ctx.fillStyle = "rgba(43,42,40,.6)";
    ctx.font = `500 22px ${FONT.sans}`;
    ctx.fillText("ONE OBJECT", m, y);
    y += 86;
    ctx.fillStyle = INK;
    ctx.font = `76px ${FONT.serif}`;
    wrapLines(ctx, memory.object, PAGE.w - m * 2).slice(0, 2).forEach((l) => { ctx.fillText(l, m, y); y += 88; });
    y += 14;
    ctx.fillStyle = BLUE;
    ctx.font = `600 50px ${FONT.hand}`;
    wrapLines(ctx, memory.line, PAGE.w - m * 2).slice(0, 4).forEach((l) => { ctx.fillText(l, m, y); y += 60; });

    ctx.fillStyle = "rgba(43,42,40,.2)";
    ctx.fillRect(m, PAGE.h - m - 40, PAGE.w - m * 2, 2);
    ctx.fillStyle = BLUE;
    ctx.font = `600 40px ${FONT.hand}`;
    ctx.fillText([memory.city, memory.years].filter(Boolean).join(" · "), m, PAGE.h - m);
    ctx.save();
    ctx.translate(PAGE.w - m - 16, PAGE.h - m - 14);
    ctx.strokeStyle = INK;
    drawStar(ctx, 16);
    ctx.restore();
    return c;
  }

  /* ---------- hero: a plan that draws itself ---------- */
  function buildHeroPlan(svg) {
    const s = 16;
    const ox = 8;
    const oy = 70;
    const dots = [];
    for (let y = 1; y < 30; y++) for (let x = 1; x < 25; x++) dots.push(`<circle cx="${x * s}" cy="${y * s}" r="1.2" fill="rgba(43,42,40,.16)"/>`);
    const walls = EXAMPLE.walls.map((w) =>
      `<path class="hw" d="M${w.x1 * s + ox} ${w.y1 * s + oy}L${w.x2 * s + ox} ${w.y2 * s + oy}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`).join("");
    const labels = EXAMPLE.labels.map((l) => `<text class="hl" x="${l.x * s + ox}" y="${l.y * s + oy}" font-family="Caveat" font-weight="600" font-size="18" fill="${BLUE}">${l.text}</text>`).join("");
    const st = EXAMPLE.stamps.find((x) => x.type === "star");
    const star = `<path class="hs" transform="translate(${st.x * s + ox} ${st.y * s + oy})" d="M0 -11 3.2 -3.9 11 -3.4 5 1.7 6.9 9.3 0 5.3 -6.9 9.3 -5 1.7 -11 -3.4 -3.2 -3.9Z" fill="${STAR}" stroke="${INK}" stroke-width="1.2"/>`;
    svg.innerHTML = `${dots.join("")}${walls}${labels}${star}`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !Element.prototype.animate) return;
    const paths = $$(".hw", svg);
    paths.forEach((p, i) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
      p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 520, delay: 300 + i * 260, easing: "cubic-bezier(.6,0,.3,1)", fill: "forwards" });
    });
    const tail = 300 + paths.length * 260;
    $$(".hl, .hs", svg).forEach((el, i) => {
      el.style.opacity = "0";
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: tail + i * 180, fill: "forwards" });
    });
  }

  /* ---------- state with undo ---------- */
  function createStore(initial) {
    let state = initial;
    let past = [];
    const listeners = new Set();
    const emit = () => listeners.forEach((fn) => fn(state));
    return {
      get: () => state,
      set(next) {
        if (next === state) return;
        past = [...past, state].slice(-MAX_HISTORY);
        state = next;
        emit();
      },
      undo() {
        if (!past.length) return;
        state = past[past.length - 1];
        past = past.slice(0, -1);
        emit();
      },
      on: (fn) => listeners.add(fn)
    };
  }

  const withWall = (p, w) => ({ ...p, walls: [...p.walls, w] });
  const withStamp = (p, s) => ({ ...p, stamps: s.type === "star" ? [...p.stamps.filter((x) => x.type !== "star"), s] : [...p.stamps, s] });
  const withLabel = (p, l) => ({ ...p, labels: [...p.labels, l] });

  // erase whatever is under the pointer: a label first, then a stamp, then a wall
  function without(p, pt) {
    const li = p.labels.findIndex((l) => pt.x >= l.x - .3 && pt.x <= l.x + l.text.length * .42 && pt.y >= l.y - 1 && pt.y <= l.y + .3);
    if (li >= 0) return { ...p, labels: p.labels.filter((_, i) => i !== li) };
    const si = p.stamps.findIndex((s) => Math.hypot(s.x - pt.x, s.y - pt.y) < 1.2);
    if (si >= 0) return { ...p, stamps: p.stamps.filter((_, i) => i !== si) };
    const wi = p.walls.findIndex((w) => distToSegment(pt, w) < .6);
    if (wi >= 0) return { ...p, walls: p.walls.filter((_, i) => i !== wi) };
    return p;
  }

  /* ---------- the board ---------- */
  function setupBoard(store, ui) {
    const canvas = $("[data-board]");
    const hint = $("[data-hint]");
    const board = canvas.parentElement;
    let tool = "wall";
    let rot = 0;
    let drag = null;
    let hover = null;
    let g = 20;

    function paint() {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDots(ctx, g);
      drawPlan(ctx, store.get(), g);
      if (drag && tool === "wall") {
        const end = constrainWall(drag.a, drag.b);
        ctx.save();
        ctx.strokeStyle = BLUE;
        ctx.lineCap = "round";
        ctx.lineWidth = Math.max(3, g * .22);
        drawWall(ctx, { x1: drag.a.x, y1: drag.a.y, x2: end.x, y2: end.y }, g);
        ctx.restore();
      }
      if (hover && ["door", "window", "bed", "star"].includes(tool)) {
        ctx.save();
        ctx.globalAlpha = .45;
        drawStamp(ctx, { type: tool, x: hover.x, y: hover.y, rot }, g, CARD);
        ctx.restore();
      }
      if (hover && tool !== "label" && tool !== "erase") {
        ctx.fillStyle = BLUE;
        ctx.beginPath(); ctx.arc(hover.x * g, hover.y * g, Math.max(3, g * .14), 0, Math.PI * 2); ctx.fill();
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      g = w / GRID.cols;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(g * GRID.rows * dpr);
      canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    };

    const local = (e) => {
      const r = canvas.getBoundingClientRect();
      return { px: e.clientX - r.left, py: e.clientY - r.top };
    };

    function openLabel(p) {
      const input = document.createElement("input");
      input.className = "label-input";
      input.maxLength = LABEL_MAX;
      input.placeholder = "kitchen";
      input.setAttribute("aria-label", "Room name");
      input.style.left = `${p.px}px`;
      input.style.top = `${Math.max(0, p.py - 22)}px`;
      board.appendChild(input);
      requestAnimationFrame(() => input.focus());
      const at = { x: p.px / g, y: p.py / g };
      let done = false;
      const finish = (keep) => {
        if (done) return;
        done = true;
        const text = input.value.trim().slice(0, LABEL_MAX);
        input.remove();
        if (keep && text) store.set(withLabel(store.get(), { x: at.x, y: at.y, text }));
      };
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") finish(true);
        if (e.key === "Escape") finish(false);
      });
      input.addEventListener("blur", () => finish(true));
    }

    canvas.addEventListener("pointerdown", (e) => {
      const p = local(e);
      const pt = snapPoint(p.px, p.py, g);
      hint.classList.add("gone");
      if (tool === "wall") { drag = { a: pt, b: pt }; canvas.setPointerCapture(e.pointerId); return; }
      if (tool === "label") { e.preventDefault(); openLabel(p); return; }
      if (tool === "erase") { store.set(without(store.get(), { x: p.px / g, y: p.py / g })); return; }
      store.set(withStamp(store.get(), { type: tool, x: pt.x, y: pt.y, rot }));
    });
    canvas.addEventListener("pointermove", (e) => {
      const p = local(e);
      hover = snapPoint(p.px, p.py, g);
      if (drag) drag = { ...drag, b: hover };
      paint();
    });
    canvas.addEventListener("pointerleave", () => { hover = null; paint(); });
    canvas.addEventListener("pointerup", () => {
      if (!drag) return;
      const end = constrainWall(drag.a, drag.b);
      const w = { x1: drag.a.x, y1: drag.a.y, x2: end.x, y2: end.y };
      drag = null;
      if (w.x1 !== w.x2 || w.y1 !== w.y2) store.set(withWall(store.get(), w));
      else paint();
    });
    canvas.addEventListener("pointercancel", () => { drag = null; paint(); });

    const setTool = (t) => {
      tool = t;
      $$("[data-tool]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tool === t)));
      canvas.classList.toggle("erasing", t === "erase");
      paint();
    };
    $$("[data-tool]").forEach((b) => b.addEventListener("click", () => setTool(b.dataset.tool)));
    const rotate = () => { rot = (rot + 90) % 360; paint(); };
    $("[data-act='rotate']").addEventListener("click", rotate);
    $("[data-act='undo']").addEventListener("click", () => store.undo());
    $("[data-act='clear']").addEventListener("click", () => store.set(EMPTY));
    $("[data-act='example']").addEventListener("click", () => { hint.classList.add("gone"); store.set(EXAMPLE); });
    document.addEventListener("keydown", (e) => {
      if (e.target.closest && e.target.closest("input, textarea")) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") { e.preventDefault(); store.undo(); }
      else if (!e.metaKey && !e.ctrlKey && e.key.toLowerCase() === "r") rotate();
    });

    store.on(() => { paint(); ui.refresh(); });
    let raf = 0;
    window.addEventListener("resize", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(resize); });
    resize();
  }

  /* ---------- memory form, spread and download ---------- */
  function readMemory(form) {
    const f = new FormData(form);
    const clean = (k, max) => String(f.get(k) || "").replace(/\s+/g, " ").trim().slice(0, max);
    return Object.freeze({ object: clean("object", 40), line: clean("line", 180), name: clean("name", 30), city: clean("city", 30), years: clean("years", 20) });
  }

  function setupPage(store) {
    const form = $("[data-memory]");
    const img = $("[data-plan-img]");
    const empty = $("[data-empty]");
    const status = $("[data-status]");
    const out = (k) => $(`[data-out='${k}']`);
    const DEFAULTS = Object.freeze({ object: "The object's name", line: "One sentence about it, in your words.", name: "Initials", city: "The city", years: "The years" });

    let timer = 0;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const m = readMemory(form);
        Object.keys(DEFAULTS).forEach((k) => { out(k).textContent = m[k] || DEFAULTS[k]; });
        const planImg = renderPlanImage(store.get(), 900);
        img.hidden = !planImg;
        empty.hidden = Boolean(planImg);
        if (planImg) img.src = planImg.toDataURL("image/png");
      }, 120);
    };
    form.addEventListener("input", refresh);
    form.addEventListener("submit", (e) => e.preventDefault());

    $("[data-act='download']").addEventListener("click", () => {
      const plan = store.get();
      const m = readMemory(form);
      if (!plan.walls.length) { status.textContent = "Draw at least one wall first."; return; }
      if (!m.object) { status.textContent = "Name one object you remember. It becomes the page's title."; form.elements.object.focus(); return; }
      renderPage(plan, m).toBlob((blob) => {
        if (!blob) { status.textContent = "Your browser could not make the image. Please try another browser."; return; }
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "ghar-my-home.png";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        status.textContent = "Downloaded. Send it to me if you would like it in the book.";
      }, "image/png");
    });

    $("[data-act='print-kit']").addEventListener("click", () => window.print());
    return { refresh };
  }

  function observeNav() {
    if (!("IntersectionObserver" in window)) return;
    const links = new Map($$(".jump a").map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      const link = links.get(e.target.id);
      if (link) link.classList.toggle("on", e.isIntersecting);
    }), { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  async function init() {
    try {
      await Promise.all([`600 20px ${FONT.hand}`, `20px ${FONT.serif}`, `500 20px ${FONT.sans}`].map((f) => document.fonts.load(f)));
    } catch (err) {
      console.warn("Ghar: a web font failed to load; using fallbacks.", err);
    }
    const hero = $("[data-hero-plan]");
    if (hero) buildHeroPlan(hero);
    const store = createStore(EMPTY);
    const ui = setupPage(store);
    setupBoard(store, ui);
    ui.refresh();
    observeNav();
  }

  init();
})();
