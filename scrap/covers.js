/* SCRAP — the six issue covers. Each is a Blender still life (img/issue-0N.jpg) typeset
   as a magazine cover on canvas; the object mask lets the object sit over the masthead. */
(function () {
  const W = 1000;
  const H = 1250;

  const ISSUES = [
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

  const FONT_SPECS = ['900 300px "Archivo"', '800 60px "Archivo"', '500 30px "Archivo"',
    'italic 120px "Instrument Serif"', '120px "Instrument Serif"', '22px "JetBrains Mono"'];
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

  /* Tightly tracked masthead across the full width; returns its baseline. */
  function masthead(ctx, color) {
    const tracking = -0.045;
    let size = 360;
    ctx.font = '900 ' + size + 'px "Archivo"';
    const natural = "SCRAP".split("").reduce(function (w, ch) {
      return w + ctx.measureText(ch).width + size * tracking;
    }, 0);
    size = Math.floor(size * (W - 2 * MARGIN + 10) / natural);
    ctx.font = '900 ' + size + 'px "Archivo"';
    ctx.fillStyle = color;
    const baseline = 62 + size * 0.73;
    let x = MARGIN - size * 0.02;
    "SCRAP".split("").forEach(function (ch) {
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

    const base = masthead(ctx, issue.ink);
    if (photo && mask) ctx.drawImage(maskedObject(photo, mask), 0, 0, W, H);

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
    ctx.fillText("A FASHION MAGAZINE MADE FROM", MARGIN, H - 116);
    ctx.fillText("WHAT GOT THROWN AWAY  ·  FREE", MARGIN, H - 90);
    barcode(ctx, W - MARGIN - 150, H - 150, issue.ink, Number(issue.n));
    return canvas;
  }

  function buildCovers(base) {
    return loadFonts().then(function () {
      return Promise.all(ISSUES.map(function (issue) {
        return Promise.all([
          loadImage(base + "issue-" + issue.n + ".jpg"),
          loadImage(base + "issue-" + issue.n + "-mask.png")
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
