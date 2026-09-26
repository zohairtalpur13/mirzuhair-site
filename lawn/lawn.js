/* Hisaab: the account of one lawn suit.
   Every constant below is either sourced (see the Method section in index.html) or marked as an estimate. */
(() => {
  "use strict";

  const MODEL = Object.freeze({
    metres: 5.75,          // [1] dupatta 2.25 + shirt 1.75 + trouser 1.75
    widthM: 1.4,           // [E1] estimate
    gsm: 90,               // [2] lawn 60 to 100 g/m²
    processLoss: 0.18,     // [E2] spinning, weaving, finishing
    lintYield: 0.33,       // [3] lint share of phutti in Pakistan
    maundKg: 40,
    lintPerMaund: 18400,   // [3] KCA spot rate, 21 Sep 2026
    pickKgPerDay: 35,      // [4] midpoint of 30 to 40 kg
    pickMinutesPerDay: 480,// [4] about eight hours
    salesTax: 0.18,        // [7]
    minWageDay: 1538,      // [8]
    livingWageDay: 47627 / 26 // [9] monthly living wage over 26 working days
  });

  const WAFFLE = Object.freeze({ cols: 40, rows: 25, cell: 10, gap: 1.6 });
  const COLORS = Object.freeze({ pick: "#b3261e", gin: "#c8912e", tax: "#8a8178", unk: "url(#hatch)" });
  // a coordinated three-piece: shirt in madder buti on cream, dupatta reversed, trouser plain dyed (in CSS)
  const LAWN_WAYS = Object.freeze({
    lead: { ground: "#fbf6ee", ink: "#b3261e", scale: 1.15 },
    b: { ground: "#fbf6ee", ink: "#b3261e", scale: .62 },
    a: { ground: "#b3261e", ink: "#fbf1e6", scale: .62 }
  });

  /* ---------- model ---------- */
  function computeAccount(price, ratePerMaund) {
    const clothKg = MODEL.metres * MODEL.widthM * MODEL.gsm / 1000;
    const fibreKg = clothKg / (1 - MODEL.processLoss);
    const phuttiKg = fibreKg / MODEL.lintYield;
    const picker = Math.round(phuttiKg * ratePerMaund / MODEL.maundKg);
    const lint = Math.round(fibreKg * MODEL.lintPerMaund / MODEL.maundKg);
    const gin = Math.max(lint - picker, 0);
    const tax = Math.round(price * MODEL.salesTax / (1 + MODEL.salesTax));
    const unk = price - picker - gin - tax;
    const pickerDay = ratePerMaund / MODEL.maundKg * MODEL.pickKgPerDay;
    return {
      price, clothKg, fibreKg, phuttiKg, picker, lint, gin, tax, unk,
      sackPct: phuttiKg / MODEL.maundKg,
      minutes: phuttiKg / MODEL.pickKgPerDay * MODEL.pickMinutesPerDay,
      days: { picker: price / pickerDay, min: price / MODEL.minWageDay, living: price / MODEL.livingWageDay }
    };
  }

  /* ---------- format ---------- */
  const nf = new Intl.NumberFormat("en-PK");
  const rs = (n) => `Rs ${nf.format(Math.round(n))}`;
  const pct = (part, whole) => `${(part / whole * 100).toFixed(1)}%`;
  const kg = (n, d = 2) => `${n.toFixed(d)} kg`;

  function outputsFor(a) {
    return {
      price: rs(a.price), priceShort: nf.format(a.price),
      picker: rs(a.picker), pickerN: nf.format(a.picker), pickerPct: pct(a.picker, a.price),
      gin: nf.format(a.gin), ginPct: pct(a.gin, a.price),
      tax: nf.format(a.tax), taxPct: pct(a.tax, a.price),
      unk: nf.format(a.unk), unkPct: pct(a.unk, a.price),
      lintRs: rs(a.lint),
      clothKg: kg(a.clothKg), fibreKg: kg(a.fibreKg), phuttiKg: kg(a.phuttiKg), phuttiKgShort: kg(a.phuttiKg, 1),
      sackPct: `${(a.sackPct * 100).toFixed(1)}%`,
      minutes: `${Math.round(a.minutes)} minutes`,
      dPicker: a.days.picker.toFixed(1), dMin: a.days.min.toFixed(1), dLiving: a.days.living.toFixed(1),
      perCell: `Rs ${(a.price / (WAFFLE.cols * WAFFLE.rows)).toFixed(2)}`,
      pickCells: String(cellCounts(a).pick)
    };
  }

  function writeOutputs(values) {
    document.querySelectorAll("[data-out]").forEach((el) => {
      const v = values[el.dataset.out];
      if (v !== undefined && el.textContent !== v) el.textContent = v;
    });
  }

  /* ---------- lawn print: a buti in half-drop ---------- */
  const BUTI = Object.freeze({ w: 64, h: 84 });
  const KERI = "M0 14C-8 14-11 6-9 0C-7-6-1-8 1-13C2-16 0-18-3-18C2-20 7-15 8-8C9 0 7 14 0 14Z";

  // keri (paisley): solid block with a fine inner line, a seed at its heart and a trail of dots
  function keri(x, y, way) {
    const dots = [[12, -3], [12.6, 3.5], [11, 10]].map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r=".9"/>`).join("");
    return `<g transform="translate(${x} ${y})" fill="${way.ink}">` +
      `<path d="${KERI}"/>` +
      `<path d="${KERI}" transform="translate(.4 2.6) scale(.6)" fill="none" stroke="${way.ground}" stroke-width="1.1"/>` +
      `<circle cx=".4" cy="6" r="1.7" fill="${way.ground}"/>${dots}</g>`;
  }

  // phool: four petals and four dots
  function phool(x, y, way) {
    const petals = [0, 90, 180, 270].map((r) => `<ellipse cx="0" cy="-4.2" rx="2.1" ry="3.6" transform="rotate(${r})"/>`).join("");
    const dots = [45, 135, 225, 315].map((r) => `<circle cx="0" cy="-8" r=".85" transform="rotate(${r})"/>`).join("");
    return `<g transform="translate(${x} ${y})" fill="${way.ink}">${petals}${dots}<circle r="1.3" fill="${way.ground}"/></g>`;
  }

  // keri on the corners and a phool in the centre makes a true half-drop that tiles without seams
  function lawnPattern(id, way) {
    const { w, h } = BUTI;
    const corners = [[0, 0], [w, 0], [0, h], [w, h]].map(([x, y]) => keri(x, y, way)).join("");
    const art = `<rect width="${w}" height="${h}" fill="${way.ground}"/>${corners}${phool(w / 2, h / 2, way)}`;
    return `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse" patternTransform="scale(${way.scale})">${art}</pattern>`;
  }

  function paintSwatches() {
    document.querySelectorAll("svg[data-swatch]").forEach((svg, i) => {
      const key = svg.dataset.swatch;
      const id = `lawn-${key}-${i}`;
      svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
      svg.innerHTML = `<defs>${lawnPattern(id, LAWN_WAYS[key] || LAWN_WAYS.lead)}</defs><rect width="100%" height="100%" fill="url(#${id})"/>`;
    });
  }

  /* ---------- waffle ---------- */
  function buildWaffle(svg) {
    const { cols, rows, cell, gap } = WAFFLE;
    const w = cols * (cell + gap) - gap;
    const h = rows * (cell + gap) - gap;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const hatch = `<defs><pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" fill="#f7e8da"/><rect width="1.3" height="4" fill="#1c1814"/></pattern></defs>`;
    const cells = [];
    for (let i = 0; i < cols * rows; i++) {
      const x = (i % cols) * (cell + gap);
      const y = Math.floor(i / cols) * (cell + gap);
      cells.push(`<rect class="c" x="${x}" y="${y}" width="${cell}" height="${cell}"/>`);
    }
    svg.innerHTML = hatch + cells.join("");
    return Array.from(svg.querySelectorAll("rect.c"));
  }

  function cellCounts(a) {
    const total = WAFFLE.cols * WAFFLE.rows;
    const share = (n) => n / a.price * total;
    const pick = Math.max(1, Math.round(share(a.picker)));
    const gin = Math.round(share(a.gin));
    const tax = Math.round(share(a.tax));
    return { pick, gin, tax, unk: Math.max(total - pick - gin - tax, 0) };
  }

  function paintWaffle(rects, a) {
    const c = cellCounts(a);
    const bounds = [c.pick, c.pick + c.gin, c.pick + c.gin + c.tax];
    rects.forEach((r, i) => {
      const fill = i < bounds[0] ? COLORS.pick : i < bounds[1] ? COLORS.gin : i < bounds[2] ? COLORS.tax : COLORS.unk;
      if (r.getAttribute("fill") !== fill) r.setAttribute("fill", fill);
    });
  }

  /* ---------- days ---------- */
  function paintDays(a) {
    document.querySelectorAll("[data-days]").forEach((bar) => {
      const d = a.days[bar.dataset.days];
      const whole = Math.floor(d);
      const frac = d - whole;
      const n = whole + (frac > 0.02 ? 1 : 0);
      bar.innerHTML = Array.from({ length: n }, (_, i) =>
        `<i style="--f:${i < whole ? 100 : Math.round(frac * 100)}%"></i>`).join("");
      bar.setAttribute("role", "img");
      bar.setAttribute("aria-label", `${d.toFixed(1)} days`);
    });
  }

  /* ---------- field graphics ---------- */
  function clockWedge(minutes) {
    const t = Math.min(minutes / 60, 0.999) * Math.PI * 2;
    const r = 54;
    const x = 60 + r * Math.sin(t);
    const y = 60 - r * Math.cos(t);
    return `M60 60L60 ${60 - r}A${r} ${r} 0 ${t > Math.PI ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)}Z`;
  }

  function paintField(a, visible) {
    const sack = document.querySelector("[data-sack]");
    const clock = document.querySelector("[data-clock]");
    if (sack) sack.style.height = visible ? `${(a.sackPct * 100).toFixed(1)}%` : "0";
    if (clock) clock.setAttribute("d", clockWedge(visible ? a.minutes : 0.01));
  }

  /* ---------- state ---------- */
  let state = Object.freeze({ price: 3990, rate: 1200, fieldSeen: false });
  let waffleRects = [];

  function render() {
    const a = computeAccount(state.price, state.rate);
    writeOutputs(outputsFor(a));
    const box = document.querySelector("[data-share-box]");
    if (box) box.style.setProperty("--s", `${(Math.sqrt(a.picker / a.price) * 100).toFixed(2)}%`);
    paintWaffle(waffleRects, a);
    paintDays(a);
    paintField(a, state.fieldSeen);
    document.querySelectorAll("[data-price]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.price) === state.price)));
    document.querySelectorAll("[data-rate]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.rate) === state.rate)));
    const range = document.querySelector("[data-range]");
    if (range && Number(range.value) !== state.price) range.value = String(state.price);
  }

  function update(patch) {
    state = Object.freeze({ ...state, ...patch });
    render();
  }

  function bindControls() {
    document.querySelectorAll("[data-price]").forEach((b) => b.addEventListener("click", () => update({ price: Number(b.dataset.price) })));
    document.querySelectorAll("[data-rate]").forEach((b) => b.addEventListener("click", () => update({ rate: Number(b.dataset.rate) })));
    const range = document.querySelector("[data-range]");
    if (range) range.addEventListener("input", () => update({ price: Number(range.value) }));
    const print = document.querySelector("[data-print]");
    if (print) print.addEventListener("click", () => window.print());
  }

  function observe() {
    const reveal = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      reveal.unobserve(e.target);
    }), { threshold: 0.2 });
    document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

    const field = document.querySelector("#field .chain");
    if (field) {
      const once = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        once.disconnect();
        update({ fieldSeen: true });
      }, { threshold: 0.35 });
      once.observe(field);
    }

    const links = new Map(Array.from(document.querySelectorAll(".jump a")).map((a) => [a.getAttribute("href").slice(1), a]));
    const nav = new IntersectionObserver((entries) => entries.forEach((e) => {
      const link = links.get(e.target.id);
      if (link) link.classList.toggle("on", e.isIntersecting);
    }), { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) nav.observe(s); });
  }

  const PRICE_RANGE = Object.freeze({ min: 2000, max: 25000 });
  const RATES = Object.freeze([800, 1200]);

  // a shared link can carry ?price=19990&rate=800; anything out of range is ignored
  function stateFromUrl() {
    const q = new URLSearchParams(window.location.search);
    const price = Number.parseInt(q.get("price") || "", 10);
    const rate = Number.parseInt(q.get("rate") || "", 10);
    return {
      ...(Number.isFinite(price) && price >= PRICE_RANGE.min && price <= PRICE_RANGE.max ? { price } : {}),
      ...(RATES.includes(rate) ? { rate } : {})
    };
  }

  function init() {
    state = Object.freeze({ ...state, ...stateFromUrl() });
    paintSwatches();
    const waffle = document.querySelector("[data-waffle]");
    if (waffle) waffleRects = buildWaffle(waffle);
    bindControls();
    if ("IntersectionObserver" in window) {
      observe();
    } else {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
      state = Object.freeze({ ...state, fieldSeen: true });
    }
    window.addEventListener("beforeprint", () => update({ fieldSeen: true }));
    render();
  }

  init();
})();
