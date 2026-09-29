/* “RAW” — The Houses Issue: every page of the magazine, drawn on canvas in type alone.
   No products, no models, no renders: each invented house is sold by typography.
   Each house gets a spread: its campaign poster on the left, its editorial page on the right. */
(function () {
  const W = 1000;
  const H = 1250;
  const RED = "#c8261b";
  const INK = "#0d0c0b";
  const BONE = "#efe9df";
  const GREY = "#8f887e";

  const HOUSES = [
    { key: "nuit", name: "NUIT", after: "after Saint Laurent", line: "Le rouge, la nuit.",
      credit: "One letter, one hairline of red, a lot of black. The campaign is the night itself.",
      poster: posterNuit, page: pageNuit },
    { key: "brut", name: "BRUT", after: "after Balenciaga", line: "Brut. Brut. Brut.",
      credit: "The name, repeated until it becomes a wall. One line is struck out, as if someone changed their mind.",
      poster: posterBrut, page: pageBrut },
    { key: "velluto", name: "VELLUTO", after: "after Gucci", line: "Casa del velluto.",
      credit: "A monogram in a double ring, like a seal pressed into wax. Red on black, nothing else.",
      poster: posterVelluto, page: pageVelluto },
    { key: "zero", name: "ZERO", after: "after Maison Margiela", line: "No name. Four stitches.",
      credit: "The campaign is a blank label. The house signs nothing but a circled number.",
      poster: posterZero, page: pageZero },
    { key: "quote", name: "“QUOTE”", after: "after Virgil Abloh", line: "It says what it is.",
      credit: "A campaign that calls itself a campaign, in quotation marks, printed like a factory tag.",
      poster: posterQuote, page: pageQuote }
  ];

  const FONTS = ['900 200px "Archivo"', '800 30px "Archivo"', '200px Anton', '120px "Instrument Serif"',
    'italic 120px "Instrument Serif"', 'italic 900 160px "Playfair Display"', '24px "JetBrains Mono"'];

  function canvas() {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    return c;
  }

  /* Paper grain, seeded so every build prints the same sheet. */
  function grain(ctx, alpha, seed) {
    let s = seed;
    const rnd = function () { s = (s * 16807) % 2147483647; return s / 2147483647; };
    ctx.save();
    ctx.globalAlpha = alpha;
    for (let i = 0; i < 2600; i++) {
      ctx.fillStyle = rnd() > 0.5 ? "#fff" : "#000";
      ctx.fillRect(rnd() * W, rnd() * H, 1.4, 1.4);
    }
    ctx.restore();
  }

  /* Folio: pages on the left of a spread are even and aligned left; right pages are odd. */
  function folio(ctx, n, color) {
    const right = n % 2 === 1;
    ctx.fillStyle = color;
    ctx.font = '20px "JetBrains Mono"';
    ctx.textAlign = right ? "right" : "left";
    ctx.fillText("“RAW”  ·  THE HOUSES ISSUE  ·  " + String(n).padStart(2, "0"), right ? W - 60 : 60, H - 50);
    ctx.textAlign = "left";
  }

  function spaced(ctx, text, x, y, gap) {
    let cx = x;
    text.split("").forEach(function (ch) {
      ctx.fillText(ch, cx, y);
      cx += ctx.measureText(ch).width + gap;
    });
  }

  function wrap(ctx, text, x, y, maxW, lh) {
    let line = "";
    text.split(" ").forEach(function (w) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, y);
        line = w;
        y += lh;
      } else {
        line = test;
      }
    });
    ctx.fillText(line, x, y);
  }

  /* Largest font size (up to max) at which text fits maxW. */
  function fit(ctx, text, font, max, maxW) {
    ctx.font = font.replace("{s}", max + "px");
    const w = ctx.measureText(text).width;
    return w > maxW ? Math.floor(max * maxW / w) : max;
  }

  function houseTag(ctx, h, color) {
    ctx.fillStyle = color;
    ctx.font = '800 26px "Archivo"';
    ctx.fillText(h.name, 60, 90);
    ctx.font = '20px "JetBrains Mono"';
    ctx.fillText("CAMPAIGN  ·  AW26", 60, 122);
  }

  /* ── Campaign posters (left pages) ── */

  /* NUIT — one enormous thin letter on black, a hairline of red. */
  function posterNuit(ctx, h) {
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = BONE;
    ctx.textAlign = "center";
    ctx.font = '400 980px "Instrument Serif"';
    ctx.fillText("N", W / 2, 900);
    ctx.fillStyle = RED;
    ctx.fillRect(0, 700, W, 3);
    ctx.textAlign = "left";
    ctx.fillStyle = BONE;
    ctx.font = '22px "JetBrains Mono"';
    const gap = 10;
    const width = "LE ROUGE".split("").reduce(function (w, ch) { return w + ctx.measureText(ch).width + gap; }, -gap);
    spaced(ctx, "LE ROUGE", (W - width) / 2, 1080, gap);
    houseTag(ctx, h, GREY);
  }

  /* BRUT — the name repeated into a wall of crushed type, one line struck out. */
  function posterBrut(ctx, h) {
    ctx.fillStyle = RED;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = INK;
    ctx.save();
    ctx.scale(1, 1.6);
    ctx.font = "150px Anton";
    for (let row = 0; row < 7; row++) {
      ctx.fillText("BRUT BRUT BRUT", -20 - (row % 2) * 60, 110 + row * 108);
    }
    ctx.restore();
    ctx.fillRect(0, 3.5 * 108 * 1.6 + 30, W, 14);
    ctx.fillStyle = RED;
    ctx.fillRect(40, 60, 200, 80);
    houseTag(ctx, h, INK);
  }

  /* VELLUTO — a monogram in a double ring, like a seal pressed into wax. */
  function posterVelluto(ctx, h) {
    ctx.fillStyle = "#120807";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = RED;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(W / 2, 600, 330, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(W / 2, 600, 305, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = RED;
    ctx.textAlign = "center";
    ctx.font = 'italic 900 460px "Playfair Display"';
    ctx.fillText("V", W / 2, 750);
    ctx.font = '24px "JetBrains Mono"';
    ctx.fillText("CASA  ·  FIRENZE  ·  MCMXXI", W / 2, 1020);
    ctx.textAlign = "left";
    houseTag(ctx, h, RED);
  }

  /* ZERO — the whole campaign is a blank white label with a circled number. */
  function posterZero(ctx, h) {
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#f4f2ee";
    ctx.fillRect(250, 420, 500, 260);
    ctx.fillStyle = "#1a1917";
    ctx.font = '26px "JetBrains Mono"';
    ctx.textAlign = "center";
    for (let i = 0; i < 24; i++) {
      ctx.fillText(String(i), 292 + (i % 8) * 59, 492 + Math.floor(i / 8) * 64);
    }
    ctx.strokeStyle = RED;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(292, 483, 24, 28, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#f4f2ee";
    [[470, 340], [530, 340], [470, 760], [530, 760]].forEach(function (p) { ctx.fillRect(p[0] - 14, p[1], 28, 6); });
    ctx.textAlign = "left";
    houseTag(ctx, h, GREY);
  }

  /* “QUOTE” — a campaign that calls itself a campaign. */
  function posterQuote(ctx, h) {
    ctx.fillStyle = RED;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = INK;
    const word = "“CAMPAIGN”";
    const size = fit(ctx, word, '900 {s} "Archivo"', 260, W - 100);
    ctx.font = '900 ' + size + 'px "Archivo"';
    ctx.fillText(word, 50, 640);
    ctx.font = '800 28px "Archivo"';
    ["“POSTER”", "BLACK INK ON RED PAPER", "c/o MIR ZUHAIR™", "©2026"].forEach(function (t, i) {
      ctx.fillText(t, 54, 760 + i * 40);
    });
    houseTag(ctx, h, INK);
  }

  /* ── Editorial pages (right pages) ── */

  function pageNuit(ctx, h) {
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = GREY;
    ctx.font = '22px "JetBrains Mono"';
    ctx.fillText("PARIS  ·  MINUIT", 92, 250);
    ctx.fillStyle = BONE;
    ctx.font = '400 150px "Instrument Serif"';
    spaced(ctx, "NUIT", 90, 520, 40);
    ctx.fillStyle = RED;
    ctx.fillRect(92, 580, 300, 3);
    ctx.fillStyle = BONE;
    ctx.font = 'italic 56px "Instrument Serif"';
    ctx.fillText(h.line, 92, 680);
    ctx.font = '26px "Archivo"';
    wrap(ctx, h.credit, 92, 880, 700, 38);
  }

  function pageBrut(ctx, h) {
    ctx.fillStyle = RED;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = INK;
    ctx.save();
    ctx.scale(1, 1.9);
    ctx.font = "330px Anton";
    ctx.fillText("BRUT", 40, 300);
    ctx.restore();
    ctx.font = '800 64px "Archivo"';
    ["NO BAG.", "NO SHOE.", "JUST BRUT."].forEach(function (t, i) { ctx.fillText(t, 60, 760 + i * 74); });
    ctx.font = '26px "JetBrains Mono"';
    ctx.fillText("PRICE ON REQUEST", 60, 1060);
    ctx.font = '24px "Archivo"';
    wrap(ctx, h.credit, 560, 780, 380, 34);
  }

  function pageVelluto(ctx, h) {
    ctx.fillStyle = "#120807";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = RED;
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, W - 100, H - 100);
    ctx.lineWidth = 1;
    ctx.strokeRect(66, 66, W - 132, H - 132);
    ctx.fillStyle = RED;
    ctx.textAlign = "center";
    const size = fit(ctx, "Velluto", 'italic 900 {s} "Playfair Display"', 170, W - 220);
    ctx.font = 'italic 900 ' + size + 'px "Playfair Display"';
    ctx.fillText("Velluto", W / 2, 520);
    ctx.font = '26px "JetBrains Mono"';
    ctx.fillText("CASA  ·  FIRENZE  ·  MCMXXI", W / 2, 600);
    ctx.fillStyle = BONE;
    ctx.font = 'italic 54px "Instrument Serif"';
    ctx.fillText(h.line, W / 2, 740);
    ctx.textAlign = "left";
    ctx.font = '26px "Archivo"';
    wrap(ctx, h.credit, 160, 900, 680, 38);
  }

  function pageZero(ctx, h) {
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = BONE;
    ctx.textAlign = "center";
    ctx.font = '400 110px "Instrument Serif"';
    ctx.fillText("Z E R O", W / 2, 540);
    ctx.font = 'italic 44px "Instrument Serif"';
    ctx.fillText(h.line, W / 2, 620);
    ctx.textAlign = "left";
    ctx.font = '26px "Archivo"';
    wrap(ctx, h.credit, 160, 820, 680, 38);
    ctx.fillStyle = RED;
    ctx.fillRect(W / 2 - 60, 680, 120, 3);
  }

  function pageQuote(ctx, h) {
    ctx.fillStyle = RED;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = INK;
    const size = fit(ctx, "“PAGE”", '900 {s} "Archivo"', 190, W - 100);
    ctx.font = '900 ' + size + 'px "Archivo"';
    ctx.fillText("“PAGE”", 50, 360);
    ctx.font = 'italic 60px "Instrument Serif"';
    ctx.fillText(h.line, 60, 520);
    ctx.font = '26px "Archivo"';
    wrap(ctx, h.credit, 60, 640, 760, 38);
  }

  /* ── Assembly ── */

  function make(draw, h, n, folioColor, seed) {
    const c = canvas();
    const ctx = c.getContext("2d");
    draw(ctx, h);
    if (n !== null) folio(ctx, n, folioColor);
    grain(ctx, 0.05, seed);
    return c;
  }

  function cover(ctx) {
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);
    const word = "“RAW”";
    const track = -0.05;
    ctx.font = '900 330px "Archivo"';
    const natural = word.split("").reduce(function (w, ch) { return w + ctx.measureText(ch).width + 330 * track; }, 0);
    const size = Math.floor(330 * (W - 80) / natural);
    ctx.font = '900 ' + size + 'px "Archivo"';
    ctx.fillStyle = RED;
    let x = 40;
    const base = 60 + size * 0.73;
    word.split("").forEach(function (ch) { ctx.fillText(ch, x, base); x += ctx.measureText(ch).width + size * track; });
    ctx.fillStyle = BONE;
    ctx.font = 'italic 110px "Instrument Serif"';
    ctx.fillText("The Houses", 48, base + 170);
    ctx.fillText("Issue.", 48, base + 270);
    ctx.fillStyle = RED;
    ctx.fillRect(52, base + 330, 240, 3);
    ctx.fillStyle = BONE;
    ctx.font = '800 30px "Archivo"';
    ["NUIT", "BRUT", "VELLUTO", "ZERO", "“QUOTE”"].forEach(function (t, i) { ctx.fillText(t, 54, base + 410 + i * 44); });
    ctx.font = 'italic 34px "Instrument Serif"';
    ctx.fillStyle = GREY;
    ctx.fillText("Five houses. None of them exist.", 54, H - 120);
    ctx.font = '20px "JetBrains Mono"';
    ctx.fillText("ISSUE 06  ·  AW26  ·  FREE", 54, H - 60);
  }

  function back(ctx) {
    ctx.fillStyle = RED;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = INK;
    ctx.font = '900 150px "Archivo"';
    ctx.fillText("“BACK", 60, 560);
    ctx.fillText("COVER”", 60, 700);
    for (let i = 0, bx = 700; i < 42; i++) {
      const w = i % 3 === 0 ? 5 : 2;
      ctx.fillRect(bx, 1040, w, 110);
      bx += w + (i % 4 ? 3 : 5);
    }
    ctx.font = '20px "JetBrains Mono"';
    ctx.fillText("©2026 MIR ZUHAIR™", 60, H - 60);
  }

  /* Page canvases in reading order: cover, [poster, editorial] × houses, back. */
  function build() {
    const fonts = document.fonts
      ? Promise.all(FONTS.map(function (f) { return document.fonts.load(f); })).catch(function (err) { console.warn("RAW fonts", err); })
      : Promise.resolve();
    return fonts.then(function () {
      const pages = [make(cover, null, null, null, 7)];
      HOUSES.forEach(function (h, i) {
        const dark = h.key === "brut" || h.key === "quote" ? INK : GREY;
        pages.push(make(h.poster, h, 2 + i * 2, dark, 11 + i));
        pages.push(make(h.page, h, 3 + i * 2, dark, 31 + i));
      });
      pages.push(make(back, null, null, null, 97));
      return pages;
    });
  }

  window.RawPages = { build: build, HOUSES: HOUSES, RATIO: H / W };
})();
