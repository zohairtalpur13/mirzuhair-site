/* SCRAP — the issue reader. As you scroll, each cover unfolds from a paper ball,
   holds flat while its story is read, then crumples away for the next issue. */
(function () {
  const S = window.Scrap;
  const UNFOLD_END = 0.32;   // fraction of a step spent unfolding
  const CRUMPLE_START = 0.8; // fraction of a step where it starts crumpling
  const PAPER_OF_STAGE = 0.62;

  const section = document.getElementById("reader");
  const canvas = document.getElementById("reader-gl");
  const stepsEl = document.getElementById("reader-steps");
  if (!section || !canvas || !stepsEl) return;

  const easeInOut = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const clamp01 = function (t) { return Math.min(1, Math.max(0, t)); };

  function stepMarkup(is) {
    return '<p class="r-n">Issue ' + is.n + ' · ' + is.season + '</p>' +
      '<h3>' + is.myth + '</h3>' +
      '<p class="r-story">' + is.story + '</p>' +
      '<p class="r-obj">' + is.object + '</p>' +
      '<ul class="r-lines">' + is.lines.map(function (l) { return '<li>' + l + '</li>'; }).join("") + '</ul>';
  }

  function buildSteps(covers) {
    S.ISSUES.forEach(function (is, i) {
      const el = document.createElement("article");
      el.className = "r-step";
      el.innerHTML = '<img class="r-thumb" alt="SCRAP Issue ' + is.n + ' cover, ' + is.myth + '">' + stepMarkup(is);
      el.querySelector("img").src = covers[i].toDataURL("image/jpeg", 0.86);
      stepsEl.appendChild(el);
    });
    return Array.prototype.slice.call(stepsEl.children);
  }

  /* Which step owns the viewport centre, and how far through it we are. */
  function scrollState(steps) {
    const mid = window.innerHeight / 2;
    for (let i = 0; i < steps.length; i++) {
      const r = steps[i].getBoundingClientRect();
      if (r.bottom >= mid || i === steps.length - 1) {
        return { index: i, p: clamp01((mid - r.top) / r.height) };
      }
    }
    return { index: 0, p: 0 };
  }

  function sheetState(p, w, h, index) {
    let c = 0;
    if (p < UNFOLD_END) c = 1 - easeInOut(p / UNFOLD_END);
    else if (p > CRUMPLE_START) c = easeInOut((p - CRUMPLE_START) / (1 - CRUMPLE_START));
    const tilt = (index % 2 ? 1 : -1) * 0.05;
    return {
      x: 0, y: -c * h * 0.08, rx: c * 1.4, ry: c * (index % 2 ? -2 : 2), rz: tilt * (1 - c) + c * 0.9,
      c: c, height: c * 120, w: w, h: h
    };
  }

  function start(covers) {
    const steps = buildSteps(covers);
    let renderer = null;
    try {
      renderer = S.createRenderer(canvas);
    } catch (err) {
      console.error("SCRAP reader: WebGL failed", err);
    }
    if (!renderer) {
      section.classList.add("no-gl");
      return;
    }
    const sheets = covers.map(function (c, i) { return renderer.createSheet(c, 101 + i * 13); });
    let size = { w: 0, h: 0 };
    let active = false;
    let queued = false;
    let frame = 0;

    function draw() {
      queued = false;
      if (!active || !size.w) return;
      const st = scrollState(steps);
      const pw = Math.min(size.w * 0.86, size.h * PAPER_OF_STAGE / S.POSTER_RATIO * 1.2);
      const ph = pw * S.POSTER_RATIO;
      renderer.render([{ sheet: sheets[st.index], state: sheetState(st.p, pw, ph, st.index) }], frame++);
      steps.forEach(function (s, i) { s.classList.toggle("on", i === st.index); });
    }

    function request() {
      if (!queued) {
        queued = true;
        requestAnimationFrame(draw);
      }
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      size = { w: r.width, h: r.height };
      renderer.resize(r.width, r.height);
      request();
    }

    new IntersectionObserver(function (entries) {
      active = entries[0].isIntersecting;
      if (active) request();
    }).observe(section);
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", resize);
    resize();
  }

  (S.coversReady || S.buildCovers("img/")).then(start);
})();
