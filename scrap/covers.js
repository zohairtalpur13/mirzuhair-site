/* SCRAP — the six issue covers. Each is a Blender still life (img/issue-0N.jpg) typeset
   as a magazine cover on canvas; the object mask lets the object sit over the masthead. */
(function () {
  const W = 1000;
  const H = 1250;
  // Another magazine can reuse this compositor by defining window.COVER_CONFIG first.
  const CFG = window.COVER_CONFIG || {};

  const SCRAP_ISSUES = [
    { n: "01", myth: "Nothing New", word: "PAPER", ink: "#141210", accent: "#8a6a2c",
      headline: ["Nothing", "New."],
      season: "The readymade issue",
      lines: ["A crumpled page, cast in porcelain", "Duchamp, flannel & the found object", "Margiela: paint it white"],
      story: "Abloh started from things that already existed: a urinal via Duchamp, a flannel shirt, a logo. Issue 01 starts from the most worthless object in the studio, a crumpled draft, and casts it in glazed porcelain with gold on every crease.",
      object: "“PAPER”, porcelain and gold lustre. Edition of 12." },
    { n: "02", myth: "3%", word: "SCULPTURE", ink: "#141210", accent: "#b3160e",
      headline: ["Change", "3%."],
      season: "The edit issue",
      lines: ["97% ordinary. 3% everything.", "The Ten, retold in porcelain", "Galliano’s newsprint couture"],
      story: "His rule: take something everyone knows and change it by three per cent. A paper shopping bag, the most ordinary luxury object there is, recast in porcelain. One red zip tie on the handle and a word in quotes are the only changes.",
      object: "“BAG”, porcelain, printed glaze, one zip tie. Edition of 24." },
    { n: "03", myth: "Work in Progress", word: "DRAFT", ink: "#f4efe4", accent: "#e2bd6a",
      headline: ["Perfection", "is a trap."],
      season: "The unfinished issue",
      lines: ["A plate, broken and mended in gold", "Kintsugi and the final plate", "McQueen’s paint machine"],
      story: "One of his last objects was a plate printed with a single word. Issue 03 answers it with a plate that has already been broken: every crack filled with gold, so the damage becomes the decoration. Beside it sits the draft it came from.",
      object: "“DRAFT”, porcelain with gold kintsugi seams. Unique." },
    { n: "04", myth: "Tourist / Purist", word: "SAME", ink: "#f4efe4", accent: "#f1c07a",
      headline: ["Tourist /", "Purist."],
      season: "The two readers issue",
      lines: ["One page, two readers", "Raw bisque vs black glaze", "Saint Laurent after dark"],
      story: "He designed for two people at once: the tourist who loves the look and the purist who knows the history. Two casts from the same crumpled page. One is left raw for the tourist; the other is glazed black and gilded for the purist.",
      object: "“SAME”, a pair: bisque, and black glaze with gold. Edition of 8 pairs." },
    { n: "05", myth: "See Through", word: "CLEAR", ink: "#f4efe4", accent: "#d7b56d",
      headline: ["See", "Through."],
      season: "The transparent issue",
      lines: ["Nothing to hide", "Glass, gold & the clear suitcase", "The invitation you can’t read"],
      story: "He made a suitcase you could see into and called it performance. Issue 05 makes the draft transparent: a crumpled page blown in clear glass, with a gilded page held inside it like a secret everyone can see.",
      object: "“CLEAR”, blown glass and gilded brass. Edition of 6." },
    { n: "06", myth: "Gilded", word: "EARRING", ink: "#160a10", accent: "#160a10",
      headline: ["Metal, worn", "like skin."],
      season: "The body issue",
      lines: ["Schiaparelli’s gilded anatomy", "From the bin to the vitrine", "Free Game: the guide, reprinted"],
      story: "Schiaparelli put gold on the body as if it were an organ; Abloh made jewellery out of hardware. SCRAP’s first jewellery is the draft itself, crumpled and cast in gilded brass, hung from a single hook.",
      object: "“EARRING”, gilded brass. Sold singly." }
  ];

  const ISSUES = CFG.issues || SCRAP_ISSUES;
  const MAST = CFG.masthead || "SCRAP";
  const MAST_FONT = CFG.mastFont || '900 {s} "Archivo"';
  const MAST_TRACKING = CFG.mastTracking !== undefined ? CFG.mastTracking : -0.045;
  const TAGLINE = CFG.tagline || ["A FASHION MAGAZINE MADE FROM", "WHAT GOT THROWN AWAY  \u00b7  FREE"];
  const FILE = CFG.file || function (n) { return "issue-" + n; };

  const FONT_SPECS = (CFG.fonts || []).concat(['900 300px "Archivo"', '800 60px "Archivo"', '500 30px "Archivo"',
    'italic 120px "Instrument Serif"', '120px "Instrument Serif"', '22px "JetBrains Mono"']);
  const FONT_TIMEOUT_MS = 4000;
  const MARGIN = 44;

  function loadFonts() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    const all = Promise.all(FONT_SPECS.map(function (s) { return document.fonts.load(s); }));
    const timeout = new Promise(function (resolve) { setTimeout(resolve, FONT_TIMEOUT_MS); });
    return Promise.race([all, timeout]).catch(function (err) {
      console.warn("SCRAP: fonts did not load, using fallbacks", err);
    });
  }

  function loadImage(src) {
    return new Promise(function (resolve) {
      const img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () {
        console.warn("SCRAP: missing image", src);
        resolve(null);
      };
      img.src = src;
    });
  }

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function fitSize(ctx, text, font, size, maxWidth) {
    ctx.font = font.replace("{s}", size + "px");
    const w = ctx.measureText(text).width;
    return w > maxWidth ? Math.floor(size * maxWidth / w) : size;
  }

  function barcode(ctx, x, y, color, seed) {
    const r = rng(seed);
    ctx.fillStyle = color;
    for (let cx = x; cx < x + 150;) {
      const w = r() > 0.6 ? 4 : 2;
      ctx.fillRect(cx, y, w, 70);
      cx += w + (r() > 0.5 ? 3 : 2);
    }
    ctx.font = '16px "JetBrains Mono"';
    ctx.fillText("9 771234 56700" + seed, x, y + 92);
  }

  /* A foil-stamped gold: dark edges, a bright band where the light catches it. */
  function goldFoil(ctx, y0, y1) {
    const g = ctx.createLinearGradient(0, y0, W * 0.35, y1);
    [[0, "#6f4f16"], [0.28, "#e9cf86"], [0.46, "#a67a28"], [0.56, "#fff3c8"], [0.66, "#c89a3e"], [1, "#6a4a14"]]
      .forEach(function (st) { g.addColorStop(st[0], st[1]); });
    return g;
  }

  /* Tightly tracked masthead across the full width; returns its baseline. */
  function masthead(ctx, color) {
    const tracking = MAST_TRACKING;
    let size = 360;
    ctx.font = MAST_FONT.replace("{s}", size + "px");
    const natural = MAST.split("").reduce(function (w, ch) {
      return w + ctx.measureText(ch).width + size * tracking;
    }, 0);
    size = Math.floor(size * (W - 2 * MARGIN + 10) / natural);
    ctx.font = MAST_FONT.replace("{s}", size + "px");
    const baseline = 62 + size * 0.73;
    ctx.fillStyle = CFG.mastGold ? goldFoil(ctx, baseline - size * 0.72, baseline) : color;
    let x = MARGIN - size * 0.02;
    MAST.split("").forEach(function (ch) {
      ctx.fillText(ch, x, baseline);
      x += ctx.measureText(ch).width + size * tracking;
    });
    return baseline;
  }

  function maskedObject(photo, mask) {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const x = c.getContext("2d");
    x.drawImage(mask, 0, 0, W, H);
    x.globalCompositeOperation = "source-in";
    x.drawImage(photo, 0, 0, W, H);
    return c;
  }

  function composeCover(issue, photo, mask) {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "alphabetic";
    if (photo) {
      ctx.drawImage(photo, 0, 0, W, H);
    } else {
      ctx.fillStyle = "#6f6a62";
      ctx.fillRect(0, 0, W, H);
    }

    ctx.fillStyle = issue.ink;
    ctx.font = '19px "JetBrains Mono"';
    ctx.fillText("ISSUE " + issue.n + "  ·  AW26", MARGIN, 46);
    ctx.textAlign = "right";
    ctx.fillText(issue.season.toUpperCase(), W - MARGIN, 46);
    ctx.textAlign = "left";

    const base = CFG.drawMasthead ? CFG.drawMasthead(ctx, issue, { W: W, H: H, MARGIN: MARGIN }) : masthead(ctx, issue.ink);
    if (CFG.subMast && !CFG.drawMasthead) {
      ctx.font = CFG.subMastFont || '48px "Instrument Serif"';
      if (CFG.mastGold) ctx.fillStyle = goldFoil(ctx, base + 20, base + 90);
      ctx.textAlign = "right";
      ctx.direction = CFG.subMastRtl ? "rtl" : "ltr";
      ctx.fillText(CFG.subMast, CFG.subMastRtl ? W - MARGIN : W - MARGIN, base + 70);
      ctx.direction = "ltr";
      ctx.textAlign = "left";
    }
    if (photo && mask) ctx.drawImage(maskedObject(photo, mask), 0, 0, W, H);
    if (issue.scrim) {
      // a soft shadow behind the cover lines, for legibility over busy prints
      const g = ctx.createRadialGradient(MARGIN + 160, base + 230, 20, MARGIN + 160, base + 230, 460);
      g.addColorStop(0, issue.scrim);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    ctx.fillStyle = issue.ink;
    ctx.font = 'italic 100px "Instrument Serif"';
    ctx.fillText(issue.headline[0], MARGIN, base + 122);
    ctx.fillText(issue.headline[1], MARGIN, base + 210);

    const quote = "“" + issue.word + "”";
    const qs = fitSize(ctx, quote, '800 {s} "Archivo"', 44, 420);
    ctx.font = '800 ' + qs + 'px "Archivo"';
    ctx.fillStyle = issue.accent;
    ctx.fillText(quote, MARGIN + 2, base + 276);

    ctx.fillStyle = issue.ink;
    ctx.font = '500 23px "Archivo"';
    issue.lines.forEach(function (line, i) {
      ctx.fillText(line, MARGIN + 2, base + 330 + i * 32);
    });
    ctx.font = '18px "JetBrains Mono"';
    ctx.fillText(TAGLINE[0], MARGIN, H - 116);
    ctx.fillText(TAGLINE[1], MARGIN, H - 90);
    barcode(ctx, W - MARGIN - 150, H - 150, issue.ink, Number(issue.n));
    return canvas;
  }

  function buildCovers(base) {
    return loadFonts().then(function () {
      return Promise.all(ISSUES.map(function (issue) {
        return Promise.all([
          loadImage(base + FILE(issue.n) + ".jpg"),
          issue.noMask ? Promise.resolve(null) : loadImage(base + FILE(issue.n) + "-mask.png")
        ]).then(function (imgs) { return composeCover(issue, imgs[0], imgs[1]); });
      }));
    });
  }

  window.Scrap = Object.assign(window.Scrap || {}, {
    ISSUES: ISSUES,
    POSTER_RATIO: H / W,
    rng: rng,
    buildCovers: buildCovers
  });
})();
