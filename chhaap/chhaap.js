/* Chhaap: the story. A house becomes a block, the block becomes a cloth.
   The stage behind the story changes with each chapter; the cloth is drawn by cloth.js. */
(() => {
  "use strict";

  const C = window.ChhaapCloth;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CARVE_MS = 2200;
  const PRESS_MS = 180;
  const FINISH_STEP_MS = 28;
  const HINTS = Object.freeze({ press: "Tap the cloth to press your block" });

  const canvas = $("[data-cloth]");
  const stage = $("[data-stage]");
  const hint = $("[data-stage-hint]");
  const ctx = canvas.getContext("2d");
  const off = document.createElement("canvas");
  const offCtx = off.getContext("2d");

  let masks = null;
  let W = 0;
  let H = 0;
  let tile = 160;
  let slots = [];
  let state = Object.freeze({ motif: motifFromUrl(), chapter: "prologue", pressed: new Set(), dye: 0 });
  let chapterStart = performance.now();
  let flashes = [];
  let finishing = 0;
  let clothDirty = true;

  function motifFromUrl() {
    const m = new URLSearchParams(location.search).get("block");
    return C.MOTIFS.includes(m) ? m : "lantern";
  }

  function update(patch) {
    state = Object.freeze({ ...state, ...patch });
    clothDirty = true;
  }

  /* ---------- sizing ---------- */
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // full Retina sharpness
    W = window.innerWidth;
    H = window.innerHeight;
    [canvas, off].forEach((c) => { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tile = Math.max(120, Math.min(W, H) / 3.4);
    slots = C.layout(W, H, tile);
    clothDirty = true;
  }

  const focusX = () => (W > 760 ? W * .7 : W / 2);

  /* ---------- the press ---------- */
  function nearestFree(x, y) {
    let best = -1;
    let bestD = Infinity;
    slots.forEach((s, i) => {
      if (state.pressed.has(i)) return;
      const d = (s.x - x) ** 2 + (s.y - y) ** 2;
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }

  function press(index) {
    if (index < 0 || state.pressed.has(index)) return;
    update({ pressed: new Set([...state.pressed, index]) });
    flashes = [...flashes, { index, t0: performance.now() }];
    const n = state.pressed.size;
    $("[data-count]").textContent = n === 1 ? "One press. The first mark on the cloth." : `${n} presses.`;
  }

  function finish() {
    if (finishing) return;
    const queue = slots.map((_, i) => i).filter((i) => !state.pressed.has(i));
    if (REDUCED) { update({ pressed: new Set(slots.map((_, i) => i)) }); return; }
    finishing = window.setInterval(() => {
      const next = queue.shift();
      if (next === undefined) { window.clearInterval(finishing); finishing = 0; $("[data-count]").textContent = "The printer finished the cloth."; return; }
      press(next);
    }, FINISH_STEP_MS);
  }

  function fillAll() {
    if (finishing) { window.clearInterval(finishing); finishing = 0; }
    if (state.pressed.size < slots.length) update({ pressed: new Set(slots.map((_, i) => i)) });
  }

  /* ---------- drawing per chapter ---------- */
  function renderCloth(dye) {
    if (!clothDirty) return;
    C.drawCloth(offCtx, W, H, { slots, tile, mask: masks[state.motif], motif: state.motif, dye, pressed: state.pressed });
    clothDirty = false;
  }

  function drawFlashes(now) {
    flashes = flashes.filter((f) => now - f.t0 < PRESS_MS * 2);
    flashes.forEach((f) => {
      const s = slots[f.index];
      if (!s) return;
      const k = (now - f.t0) / (PRESS_MS * 2);
      const lift = k < .5 ? 1 - k * 2 : (k - .5) * 2;
      const size = tile * (.92 + lift * .1);
      ctx.save();
      ctx.globalAlpha = .9 * (1 - k * .6);
      ctx.shadowColor = "rgba(0,0,0,.45)";
      ctx.shadowBlur = 20 * lift;
      ctx.shadowOffsetY = 14 * lift;
      ctx.fillStyle = "#6e4122";
      ctx.fillRect(s.x - size / 2, s.y - size / 2 - lift * 12, size, size);
      ctx.restore();
    });
  }

  // water: the cloth sways in horizontal ripples, with light moving across it
  function drawWater(now) {
    const t = now / 1000;
    const strip = 6;
    const sx = off.width / W;
    const sy = off.height / H;
    ctx.fillStyle = "#0d1120";
    ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += strip) {
      const dx = REDUCED ? 0 : Math.sin(y * .018 + t * 2.1) * 7 + Math.sin(y * .05 - t * 1.3) * 2;
      ctx.drawImage(off, 0, y * sy, off.width, strip * sy, dx, y, W, strip);
    }
    const g = ctx.createLinearGradient(0, 0, W, H);
    const p = (Math.sin(t * .6) + 1) / 2;
    g.addColorStop(Math.max(0, p - .2), "rgba(160,200,255,0)");
    g.addColorStop(p, "rgba(160,200,255,.14)");
    g.addColorStop(Math.min(1, p + .2), "rgba(160,200,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // sun: the cloth lifts and folds in the wind, lit warm from one side
  function drawSun(now, calm) {
    const t = now / 1000;
    const strip = 8;
    const amp = calm ? 7 : 14;
    const sx = off.width / W;
    ctx.fillStyle = "#0d1120";
    ctx.fillRect(0, 0, W, H);
    for (let x = 0; x < W; x += strip) {
      const phase = x * .012 - t * 1.4;
      const dy = REDUCED ? 0 : Math.sin(phase) * amp;
      ctx.drawImage(off, x * sx, 0, strip * sx, off.height, x, dy - amp, strip, H + amp * 2); // overdraw so no edge shows
      const shade = REDUCED ? 0 : Math.cos(phase) * .12;
      ctx.fillStyle = shade > 0 ? `rgba(255,236,200,${shade.toFixed(3)})` : `rgba(0,0,20,${(-shade).toFixed(3)})`;
      ctx.fillRect(x, 0, strip, H);
    }
    const sun = ctx.createRadialGradient(W * .85, -H * .1, 0, W * .85, -H * .1, Math.max(W, H));
    sun.addColorStop(0, "rgba(255,210,140,.22)");
    sun.addColorStop(1, "rgba(255,210,140,0)");
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, W, H);
  }

  function frame(now) {
    const ch = state.chapter;
    const mask = masks && masks[state.motif];
    if (mask) {
      if (ch === "prologue") C.drawSingle(ctx, W, H, mask, focusX(), state.motif);
      else if (ch === "block") C.drawBlock(ctx, W, H, mask, REDUCED ? 1 : (now - chapterStart) / CARVE_MS, focusX());
      else if (ch === "press") { renderCloth(0); ctx.drawImage(off, 0, 0, W, H); drawFlashes(now); }
      else if (ch === "dye") { renderCloth(state.dye); ctx.drawImage(off, 0, 0, W, H); }
      else if (ch === "water") { renderCloth(2); drawWater(now); }
      else if (ch === "sun" || ch === "home") { renderCloth(2); drawSun(now, ch === "home"); }
    }
    requestAnimationFrame(frame);
  }

  /* ---------- chapters ---------- */
  function enterChapter(ch) {
    if (ch === state.chapter) return;
    if (["dye", "water", "sun", "home"].includes(ch)) fillAll();
    const dye = ch === "dye" ? state.dye : ["water", "sun", "home"].includes(ch) ? 2 : 0;
    update({ chapter: ch, dye });
    chapterStart = performance.now();
    stage.dataset.mode = ch;
    stage.classList.toggle("pressing", ch === "press");
    hint.textContent = HINTS[ch] || "";
    hint.classList.toggle("on", Boolean(HINTS[ch]));
    $$("[data-to]").forEach((a) => a.classList.toggle("on", a.dataset.to === ch));
  }

  function observeChapters() {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) enterChapter(e.target.dataset.ch);
    }), { rootMargin: "-45% 0px -45% 0px" });
    $$("[data-ch]").forEach((s) => io.observe(s));
  }

  function trackDye() {
    const sec = $("#dye");
    const meter = $("[data-dye-meter]");
    const onScroll = () => {
      if (state.chapter !== "dye") return;
      const r = sec.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - window.innerHeight)));
      meter.parentElement.style.setProperty("--p", p.toFixed(3));
      if (Math.abs(p * 2 - state.dye) > .01) update({ dye: p * 2 });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- choices and actions ---------- */
  // the dye chapter names the two dyes of the chosen block and wears its colours
  function showDyes(st) {
    const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1);
    $$("[data-dye='first']").forEach((el) => { el.textContent = el.dataset.cap ? cap(st.first.name) : st.first.name; });
    $$("[data-dye='second']").forEach((el) => { el.textContent = st.second.name; });
    $("[data-dye='note']").textContent = st.note;
    const card = $("#dye .card");
    card.style.setProperty("--dye-a", st.first.color);
    card.style.setProperty("--dye-b", st.second.color);
  }

  function chooseMotif(m) {
    if (!C.MOTIFS.includes(m)) return;
    update({ motif: m });
    $$("[data-motif]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.motif === m)));
    $$("[data-photo]").forEach((f) => f.classList.toggle("on", f.dataset.photo === m));
    showDyes(C.styleOf(m));
    const url = new URL(location.href);
    url.searchParams.set("block", m);
    history.replaceState(null, "", url);
  }

  function downloadCloth(status) {
    C.exportCloth(masks[state.motif], state.motif).toBlob((blob) => {
      if (!blob) { status.textContent = "Your browser could not make the image. Please try another browser."; return; }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `chhaap-${state.motif}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      status.textContent = "Downloaded. The cloth is yours.";
    }, "image/png");
  }

  async function shareLink(status) {
    const url = new URL(location.href);
    url.hash = "";
    try {
      await navigator.clipboard.writeText(url.toString());
      status.textContent = "Link copied. It opens with your block.";
    } catch (err) {
      status.textContent = `Copy this link: ${url.toString()}`;
    }
  }

  function bind() {
    const status = $("[data-status]");
    $$("[data-motif]").forEach((b) => b.addEventListener("click", () => chooseMotif(b.dataset.motif)));
    canvas.addEventListener("pointerdown", (e) => { if (state.chapter === "press") press(nearestFree(e.clientX, e.clientY)); });
    $("[data-act='press-one']").addEventListener("click", () => press(nearestFree(W * .6, H * .5)));
    $("[data-act='finish']").addEventListener("click", finish);
    $("[data-act='again']").addEventListener("click", () => {
      update({ pressed: new Set(), dye: 0 });
      $("[data-count]").textContent = "No presses yet.";
      $("#house").scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
    });
    $("[data-act='download']").addEventListener("click", () => downloadCloth(status));
    $("[data-act='share']").addEventListener("click", () => shareLink(status));
    let raf = 0;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const wasFull = state.pressed.size && state.pressed.size >= slots.length;
        resize();
        update({ pressed: wasFull ? new Set(slots.map((_, i) => i)) : new Set() });
      });
    });
  }

  async function init() {
    resize();
    bind();
    chooseMotif(state.motif);
    stage.dataset.mode = "prologue";
    $$("[data-to]")[0].classList.add("on");
    try {
      masks = await C.loadMasks("blocks");
    } catch (err) {
      console.error(err);
      hint.textContent = "The blocks could not load. Please refresh the page.";
      hint.classList.add("on");
      return;
    }
    observeChapters();
    trackDye();
    requestAnimationFrame(frame);
  }

  init();
})();
