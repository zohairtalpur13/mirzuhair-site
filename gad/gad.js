/* Gaḍ: a bilingual Sindhi and English type system.
   Alphabet order and sounds: Sindhi Wikipedia, "سنڌي آئيويٽا". Every Sindhi word carries an English gloss. */
(() => {
  "use strict";

  const FONTS = Object.freeze({ lat: "Literata", snd: "Lateef", mono: "JetBrains Mono" });
  const COLORS = Object.freeze({ lat: "#243b8f", snd: "#d9432b", ink: "#16171b" });
  const ZWJ = "\u200d";
  const NARROW_PX = 640;
  const SINDHI_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

  const PAIRS = Object.freeze([
    ["Together", "گڏ"], ["Sindh", "سنڌ"], ["Thread", "ڌاڳو"], ["Cotton", "ڪپهه"], ["Boat", "ٻيڙي"], ["Letter", "اکر"]
  ]);

  // [letter, sound (IPA)] in standard order; 52 letters including the digraphs جه and گه
  const LETTERS = Object.freeze([
    ["ا", "∅ ʔ aː"], ["ب", "b"], ["ٻ", "ɓ"], ["ڀ", "bʱ"], ["ت", "t"], ["ٿ", "tʰ"], ["ٽ", "ʈ"], ["ٺ", "ʈʰ"],
    ["ث", "s"], ["پ", "p"], ["ج", "d͡ʑ"], ["ڄ", "ʄ"], ["جه", "d͡ʑʰ"], ["ڃ", "ɲ"], ["چ", "t͡ɕ"], ["ڇ", "t͡ɕʰ"],
    ["ح", "h"], ["خ", "x"], ["د", "d"], ["ڌ", "dʱ"], ["ڏ", "ɗ"], ["ڊ", "ɖ"], ["ڍ", "ɖʱ"], ["ذ", "z"],
    ["ر", "r"], ["ڙ", "ɽ"], ["ز", "z"], ["س", "s"], ["ش", "ʂ"], ["ص", "s"], ["ض", "z"], ["ط", "t"],
    ["ظ", "z"], ["ع", "ɑː oː eː ʔ"], ["غ", "ɣ"], ["ف", "f"], ["ڦ", "pʰ"], ["ق", "q"], ["ڪ", "k"], ["ک", "kʰ"],
    ["گ", "ɡ"], ["ڳ", "ɠ"], ["گه", "ɡʱ"], ["ڱ", "ŋ"], ["ل", "l"], ["م", "m"], ["ن", "n"], ["ڻ", "ɳ"],
    ["و", "ʋ ʊ oː uː"], ["ه", "h"], ["ء", "ʔ"], ["ي", "j iː"]
  ]);
  const SINDHI_ONLY = new Set(Array.from("ٻڀٿٽٺڄڃڇڌڏڊڍڙڦڪڳڱڻ"));
  const IMPLOSIVE = new Set(Array.from("ٻڄڏڳ"));

  const WORDS = Object.freeze({
    cloth: [["ڪپهه", "cotton"], ["ڌاڳو", "thread"], ["سئي", "needle"], ["ڪپڙو", "cloth"], ["رنگ", "colour"], ["نير", "indigo"], ["اجرڪ", "ajrak"], ["رلي", "ralli, a quilt"]],
    cities: [["حيدرآباد", "Hyderabad"], ["ڪراچي", "Karachi"], ["ٺٽو", "Thatta"], ["سکر", "Sukkur"], ["لاڙڪاڻو", "Larkana"], ["ڀٽ شاهه", "Bhit Shah"]]
  });

  // [level, English size, English line, Sindhi line, English sample, Sindhi sample, gloss]; line heights are 6 px multiples
  const LEVELS = Object.freeze([
    ["Headline", 54, 60, 120, "Two scripts", "ٻه لپيون", "two scripts"],
    ["Deck", 24, 36, 66, "One line", "هڪ سٽ", "one line"],
    ["Subhead", 23, 36, 60, "Words of cloth", "ڪپڙي جا لفظ", "words of cloth"],
    ["Body", 18, 30, 54, "Cotton and thread", "ڪپهه ۽ ڌاڳو", "cotton and thread"],
    ["Folio", 12, 18, 30, "Page 1", "صفحو ۱", "page 1"]
  ]);

  const toSindhiDigits = (s) => String(s).replace(/\d/g, (d) => SINDHI_DIGITS[d]);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- measuring the two scripts ---------- */
  async function loadFonts() {
    try {
      await Promise.all([
        document.fonts.load(`300 100px ${FONTS.lat}`, "Hxgpy"),
        document.fonts.load(`400 100px ${FONTS.snd}`, "سٿڀاگڏ"),
        document.fonts.load(`400 12px ${FONTS.mono}`, "x")
      ]);
    } catch (err) {
      console.warn("Gaḍ: a web font failed to load, falling back to system fonts.", err);
    }
  }

  // heights per 100 px of font size, read from the fonts the browser actually drew
  function measureScripts() {
    const ctx = document.createElement("canvas").getContext("2d");
    const up = (t) => ctx.measureText(t).actualBoundingBoxAscent;
    const down = (t) => ctx.measureText(t).actualBoundingBoxDescent;
    ctx.font = `300 100px ${FONTS.lat}`;
    const lat = { cap: up("H"), x: up("x"), desc: down("gpy") };
    ctx.font = `400 100px ${FONTS.snd}`;
    // Naskh has no x-height; its nearest equivalent is the height of the closed bowls ص ع ه (median of the three)
    const bowls = ["ص", "ع", "ه"].map(up).sort((p, q) => p - q);
    const snd = { alif: up("ا"), bowl: bowls[1] };
    const match = lat.x && snd.bowl ? lat.x / snd.bowl : 1.66;
    return { lat, snd, match: Math.round(match * 100) / 100 };
  }

  /* ---------- the metrics stage ---------- */
  function drawLine(ctx, y, w, colour, dash, width = 1) {
    ctx.save();
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(0, Math.round(y) + .5);
    ctx.lineTo(w, Math.round(y) + .5);
    ctx.stroke();
    ctx.restore();
  }

  function drawLabel(ctx, text, x, y, colour, align) {
    ctx.save();
    ctx.font = `400 11px ${FONTS.mono}`;
    ctx.fillStyle = colour;
    ctx.textAlign = align;
    ctx.textBaseline = "bottom";
    ctx.fillText(text, x, y - 3);
    ctx.restore();
  }

  function drawMetrics(canvas, m, pair, scale) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const pad = Math.max(16, w * .03);
    const narrow = w < NARROW_PX;
    const latSize = narrow ? w * .12 : Math.min(h * .36, w * .13);
    const sndSize = latSize * scale;
    const base = h * .66;
    const inset = Math.max(120, w * .1); // keeps the words clear of the line labels
    const [latWord, sndWord] = pair;

    ctx.font = `400 ${sndSize}px ${FONTS.snd}`;
    const sw = ctx.measureText(sndWord);
    const above = base - sw.actualBoundingBoxAscent;
    const below = base + sw.actualBoundingBoxDescent;
    const s = (v) => v * latSize / 100;
    const t = (v) => v * sndSize / 100;
    const xLine = base - s(m.lat.x);
    const bowlLine = base - t(m.snd.bowl);
    const matched = Math.abs(xLine - bowlLine) < 1.5;

    drawLine(ctx, base - s(m.lat.cap), w, COLORS.lat, [4, 4]);
    drawLine(ctx, base + s(m.lat.desc), w, COLORS.lat, [4, 4]);
    drawLine(ctx, base - t(m.snd.alif), w, COLORS.snd, [4, 4]);
    drawLine(ctx, above, w, COLORS.snd, [1, 3]);
    drawLine(ctx, below, w, COLORS.snd, [1, 3]);
    drawLine(ctx, xLine, w, matched ? COLORS.ink : COLORS.lat, [], matched ? 2 : 1);
    if (!matched) drawLine(ctx, bowlLine, w, COLORS.snd, []);
    drawLine(ctx, base, w, COLORS.ink, [], 2);

    ctx.fillStyle = COLORS.lat;
    ctx.font = `300 ${latSize}px ${FONTS.lat}`;
    ctx.textAlign = narrow ? "center" : "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(latWord, narrow ? w * .27 : pad + inset, base);

    ctx.fillStyle = COLORS.snd;
    ctx.font = `400 ${sndSize}px ${FONTS.snd}`;
    ctx.direction = "rtl";
    ctx.textAlign = narrow ? "center" : "right";
    ctx.fillText(sndWord, narrow ? w * .75 : w - pad - inset, base);
    ctx.direction = "ltr";
    if (narrow) return; // on phones the legend under the stage names the lines

    drawLabel(ctx, "cap", pad, base - s(m.lat.cap), COLORS.lat, "left");
    drawLabel(ctx, matched ? "x-height = bowl" : "x-height", pad, xLine, matched ? COLORS.ink : COLORS.lat, "left");
    drawLabel(ctx, "shared baseline", pad, base, COLORS.ink, "left");
    drawLabel(ctx, "descender", pad, base + s(m.lat.desc) + 14, COLORS.lat, "left");
    drawLabel(ctx, "alif", w - pad, base - t(m.snd.alif), COLORS.snd, "right");
    if (!matched) drawLabel(ctx, "bowl", w - pad, bowlLine, COLORS.snd, "right");
    drawLabel(ctx, "dots above", w - pad, above, COLORS.snd, "right");
    drawLabel(ctx, "dots below", w - pad, below + 14, COLORS.snd, "right");
  }

  /* ---------- alphabet ---------- */
  function lettersWithFlags() {
    return LETTERS.map(([ch, ipa], i) => Object.freeze({
      i, ch, ipa,
      sindhi: SINDHI_ONLY.has(ch),
      implosive: IMPLOSIVE.has(ch),
      digraph: ch.length > 1
    }));
  }

  function buildAlphabet(list, onPick) {
    const grid = $("[data-abc]");
    grid.innerHTML = list.map((l) =>
      `<li><button type="button" class="${l.sindhi ? "sd" : ""}" data-i="${l.i}" aria-pressed="false" aria-label="Letter ${l.i + 1}, sound ${esc(l.ipa)}"><small>${String(l.i + 1).padStart(2, "0")}</small><span lang="sd">${l.ch}</span></button></li>`).join("");
    grid.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-i]");
      if (b) onPick(Number(b.dataset.i));
    });
  }

  function showLetter(l, total) {
    const forms = [l.ch + ZWJ, ZWJ + l.ch + ZWJ, ZWJ + l.ch, l.ch];
    $("[data-card='n']").textContent = `${String(l.i + 1).padStart(2, "0")} / ${total}`;
    $("[data-card='glyph']").textContent = l.ch;
    $("[data-card='forms']").innerHTML = forms.map((f) => `<span>${f}</span>`).join("");
    $("[data-card='ipa']").textContent = `/${l.ipa}/`;
    const tags = [
      l.sindhi ? `<span class="sd">Sindhi letter</span>` : "<span>Shared with Urdu and Arabic</span>",
      l.implosive ? "<span>Implosive</span>" : "",
      l.digraph ? "<span>Two-part letter</span>" : ""
    ];
    $("[data-card='tags']").innerHTML = tags.join("");
    $$("[data-abc] button").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.i) === l.i)));
  }

  function applyFilter(list, key) {
    const keep = (l) => key === "all" || (key === "sindhi" && l.sindhi) || (key === "implosive" && l.implosive);
    $$("[data-abc] button").forEach((b) => b.classList.toggle("off", !keep(list[Number(b.dataset.i)])));
    $$("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === key)));
  }

  /* ---------- system table and broadsheet lists ---------- */
  function buildLevels(k) {
    const body = $("[data-levels]");
    if (!body) return;
    body.innerHTML = LEVELS.map(([name, size, line, sLine, latS, sndS, gloss]) => {
      const sSize = Math.round(size * k);
      return `<tr><th scope="row">${name}</th><td class="s-lat">${size} / ${line} px</td><td class="s-snd">${sSize} / ${sLine} px</td>` +
        `<td class="sample"><div><span style="font-size:${Math.min(size, 30)}px">${esc(latS)}</span><span lang="sd" dir="rtl" style="font-size:${Math.min(sSize, 40)}px" title="${esc(gloss)}">${sndS}</span></div></td></tr>`;
    }).join("");
  }

  function buildWords() {
    $$("[data-words]").forEach((dl) => {
      const list = WORDS[dl.dataset.words] || [];
      dl.innerHTML = list.map(([sd, en]) => `<div><dt>${sd}</dt><dd>${esc(en)}</dd></div>`).join("");
    });
  }

  /* ---------- wiring ---------- */
  function bindProblems() {
    $$("[data-prob]").forEach((card) => {
      const btn = $("[data-tune]", card);
      btn.addEventListener("click", () => {
        const on = !card.classList.contains("tuned");
        card.classList.toggle("tuned", on);
        btn.setAttribute("aria-pressed", String(on));
        const digits = $("[data-digits]", card);
        if (digits) digits.textContent = on ? toSindhiDigits("52") : "52";
      });
    });
  }

  function bindSheet() {
    const sheet = $("[data-sheet]");
    const grid = $("[data-grid]");
    if (grid && sheet) grid.addEventListener("click", () => {
      const on = !sheet.classList.contains("grid");
      sheet.classList.toggle("grid", on);
      grid.setAttribute("aria-pressed", String(on));
      grid.textContent = on ? "Hide grid" : "Show grid";
    });
    const print = $("[data-print]");
    if (print) print.addEventListener("click", () => window.print());
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

  function bindStage(m) {
    const canvas = $("[data-metrics]");
    const range = $("[data-scale]");
    const pairs = $("[data-pairs]");
    if (!canvas || !range || !pairs) return;
    pairs.innerHTML = PAIRS.map(([en, sd], i) =>
      `<button type="button" data-pair="${i}" aria-pressed="${i === 0}">${esc(en)} <span lang="sd">${sd}</span></button>`).join("");

    let state = Object.freeze({ pair: 0, scale: m.match });
    const render = () => {
      drawMetrics(canvas, m, PAIRS[state.pair], state.scale);
      $$("[data-out='scale']").forEach((o) => { o.textContent = `${state.scale.toFixed(2)}×`; });
      range.value = String(state.scale);
      $$("[data-pair]", pairs).forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.pair) === state.pair)));
    };
    const update = (patch) => { state = Object.freeze({ ...state, ...patch }); render(); };

    pairs.addEventListener("click", (e) => {
      const b = e.target.closest("[data-pair]");
      if (b) update({ pair: Number(b.dataset.pair) });
    });
    range.addEventListener("input", () => update({ scale: Number(range.value) }));
    const match = $("[data-match]");
    if (match) match.addEventListener("click", () => update({ scale: m.match }));
    let raf = 0;
    window.addEventListener("resize", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); });
    render();
  }

  async function init() {
    buildWords();
    bindProblems();
    bindSheet();
    observeNav();

    const letters = lettersWithFlags();
    const pick = (i) => showLetter(letters[i], letters.length);
    buildAlphabet(letters, pick);
    $$("[data-filter]").forEach((b) => b.addEventListener("click", () => applyFilter(letters, b.dataset.filter)));
    pick(0);

    await loadFonts();
    const m = measureScripts();
    document.documentElement.style.setProperty("--k", String(m.match));
    $$("[data-out='scaleWord']").forEach((o) => { o.textContent = `${m.match.toFixed(2)}×`; });
    buildLevels(m.match);
    bindStage(m);
  }

  init();
})();
