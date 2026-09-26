/* SCRAP — the cover loop. Paper balls land on the masthead card, unfold into the six
   legend posters, stack, then crumple into the bin; the clean card returns. */
(function () {
  const S = window.Scrap;
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const T = REDUCED
    ? { fly: 0.001, unfold: 0.001, hold: 1e9, crumple: 0.001, out: 0.001, stagger: 0, pause: 0 }
    : { fly: 0.62, unfold: 0.95, hold: 2.5, crumple: 0.55, out: 0.62, stagger: 1.05, pause: 1.9 };
  const PAPER_OF_CARD = 0.47;
  const THUMB_WIDTH = 420;

  // where each poster settles, as fractions of the card, plus its tilt (radians, clockwise)
  const TARGETS = [
    { x: -0.34, y: 0.26, rz: -0.1 },
    { x: 0.36, y: -0.16, rz: 0.08 },
    { x: -0.3, y: -0.18, rz: 0.05 },
    { x: 0.33, y: 0.3, rz: -0.06 },
    { x: 0.04, y: 0.08, rz: -0.03 },
    { x: -0.06, y: 0.22, rz: 0.07 }
  ];

  const easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  const easeIn = function (t) { return t * t * t; };
  const easeInOut = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const clamp01 = function (t) { return Math.min(1, Math.max(0, t)); };
  const lerp = function (a, b, t) { return a + (b - a) * t; };

  const stage = document.getElementById("stage");
  const card = document.getElementById("card");
  const canvas = document.getElementById("gl");
  const chips = document.getElementById("chips");
  const playBtn = document.getElementById("play");
  const nowPlaying = document.getElementById("now");

  let renderer = null;
  let papers = [];
  let layout = null;
  let clock = 0;
  let lastTick = null;
  let paused = false;
  let visible = true;
  let mode = REDUCED ? "manual" : "loop";
  let cycleEnd = 0;
  let frame = 0;
  let lastLanded = -1;

  function measure() {
    const s = stage.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const paperW = c.width * PAPER_OF_CARD;
    return {
      w: s.width,
      h: s.height,
      cx: c.left + c.width / 2 - (s.left + s.width / 2),
      cy: c.top + c.height / 2 - (s.top + s.height / 2),
      cardW: c.width,
      cardH: c.height,
      paperW: paperW,
      paperH: paperW * S.POSTER_RATIO
    };
  }

  /* Stable per-paper flight paths so the loop feels thrown by hand, not random each time. */
  function flightFor(i) {
    const r = S.rng(900 + i);
    const side = i % 2 === 0 ? -1 : 1;
    return {
      fromSide: side,
      fromY: lerp(-0.45, 0.35, r()),
      spinX: (r() - 0.5) * 9,
      spinY: side * (4 + r() * 5),
      fromRz: side * (0.6 + r()),
      arc: 0.18 + r() * 0.16,
      exitX: (r() - 0.5) * 0.6
    };
  }

  function flightIn(s, p, t, from) {
    const e = easeOut(t / T.fly);
    return Object.assign({}, s, {
      x: lerp(from.x, s.x, e),
      y: lerp(from.y, s.y, e) - Math.sin(Math.PI * e) * layout.h * p.flight.arc,
      rx: (1 - e) * p.flight.spinX,
      ry: (1 - e) * p.flight.spinY,
      rz: lerp(p.flight.fromRz, s.rz, e),
      c: 1,
      height: Math.sin(Math.PI * e) * 260
    });
  }

  function crumpleOut(s, p, k) {
    const e = easeIn(clamp01((k - T.crumple * 0.45) / T.out));
    if (e >= 1) return null;
    return Object.assign({}, s, {
      c: Math.max(s.c, easeIn(clamp01(k / T.crumple))),
      x: lerp(s.x, s.x + p.flight.exitX * layout.w, e),
      y: lerp(s.y, layout.h / 2 + layout.paperW, e),
      rx: s.rx + e * 5,
      ry: s.ry + e * p.flight.spinY * 0.4,
      height: s.height + e * 160
    });
  }

  function paperState(p, now) {
    const L = layout;
    const tgt = TARGETS[p.index];
    const t = now - p.t0;
    if (t < 0) return null;

    let s = {
      x: L.cx + tgt.x * L.cardW, y: L.cy + tgt.y * L.cardH,
      rx: 0, ry: 0, rz: tgt.rz, c: 0, height: 0, w: L.paperW, h: L.paperH
    };
    if (t < T.fly) {
      s = flightIn(s, p, t, { x: p.flight.fromSide * (L.w / 2 + L.paperW * 0.6), y: p.flight.fromY * L.h / 2 });
    } else if (t < T.fly + T.unfold) {
      const u = (t - T.fly) / T.unfold;
      s = Object.assign({}, s, { c: 1 - easeInOut(u), height: (1 - u) * 30 });
    }
    return now >= p.tOut ? crumpleOut(s, p, now - p.tOut) : s;
  }

  function scheduleCycle(now) {
    papers.forEach(function (p, i) {
      p.t0 = now + i * T.stagger;
      p.tOut = p.t0 + T.fly + T.unfold + T.hold;
    });
    const last = papers[papers.length - 1];
    cycleEnd = last.tOut + T.crumple + T.out + T.pause;
  }

  function throwChapter(index) {
    if (!papers.length) return;
    const now = clock;
    if (mode === "loop") {
      papers.forEach(function (p) { p.tOut = Math.min(p.tOut, now); });
      mode = "manual";
      paused = false;
    }
    const target = papers[index];
    const held = target.tOut === Infinity && now >= target.t0;
    papers.forEach(function (p) { if (p !== target && p.tOut === Infinity) p.tOut = now; });
    if (!held) {
      target.t0 = now;
      target.tOut = Infinity;
    }
    playBtn.textContent = "Play loop";
    playBtn.setAttribute("aria-pressed", "false");
    announce(index);
  }

  function announce(index) {
    if (index === lastLanded) return;
    lastLanded = index;
    const is = S.ISSUES[index];
    nowPlaying.textContent = "Issue " + is.n + " — " + is.myth + " · " + is.season;
    Array.prototype.forEach.call(chips.children, function (b, i) {
      b.classList.toggle("on", i === index);
    });
  }

  function onPlay() {
    if (mode === "manual") {
      mode = "loop";
      papers.forEach(function (p) { p.tOut = Math.min(p.tOut, clock); });
      scheduleCycle(clock + T.crumple + T.out);
      paused = false;
    } else {
      paused = !paused;
    }
    playBtn.textContent = paused ? "Play" : "Pause";
    playBtn.setAttribute("aria-pressed", String(paused));
  }

  function tick(ts) {
    requestAnimationFrame(tick);
    const dt = lastTick === null ? 0 : Math.min(0.05, (ts - lastTick) / 1000);
    lastTick = ts;
    if (!visible) return;
    if (!paused) clock += dt;
    if (mode === "loop" && clock >= cycleEnd) scheduleCycle(clock);

    const items = [];
    let landed = -1;
    let landedAt = -Infinity;
    papers
      .slice()
      .sort(function (a, b) { return a.t0 - b.t0; })
      .forEach(function (p) {
        const st = paperState(p, clock);
        if (!st) return;
        items.push({ sheet: p.sheet, state: st });
        if (st.c < 0.05 && clock < p.tOut && p.t0 > landedAt) {
          landed = p.index;
          landedAt = p.t0;
        }
      });
    if (landed >= 0) announce(landed);
    renderer.render(items, paused ? 0 : frame);
    frame++;
  }

  function onResize() {
    layout = measure();
    renderer.resize(layout.w, layout.h);
  }

  function buildChips() {
    S.ISSUES.forEach(function (is, i) {
      const b = document.createElement("button");
      b.type = "button";
      b.innerHTML = "<b>" + is.n + "</b> " + is.myth;
      b.setAttribute("aria-label", "Unfold issue " + is.n + ", " + is.myth);
      b.addEventListener("click", function () { throwChapter(i); });
      chips.appendChild(b);
    });
  }

  function startRenderer(posters) {
    try {
      renderer = S.createRenderer(canvas);
    } catch (err) {
      console.error("SCRAP: WebGL renderer failed", err);
      renderer = null;
    }
    if (!renderer) {
      document.documentElement.classList.add("no-gl");
      nowPlaying.textContent = "This browser can’t run the paper animation; the six covers are below.";
      return;
    }
    papers = posters.map(function (poster, i) {
      return { index: i, sheet: renderer.createSheet(poster, 31 + i * 17), flight: flightFor(i), t0: Infinity, tOut: Infinity };
    });
    onResize();
    window.addEventListener("resize", onResize);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(stage);
    }
    playBtn.addEventListener("click", onPlay);
    if (mode === "loop") scheduleCycle(0.4);
    else nowPlaying.textContent = "Pick a chapter to unfold it.";
    requestAnimationFrame(tick);
  }

  buildChips();
  S.coversReady = S.buildCovers("img/");
  S.coversReady.then(startRenderer);
})();
