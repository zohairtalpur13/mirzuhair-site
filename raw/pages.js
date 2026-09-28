/* “RAW” — The Houses Issue: every page of the magazine, drawn on canvas.
   Each house gets a spread: its campaign render on the left, a page in its own art direction on the right. */
(function () {
  const W = 1000;
  const H = 1250;
  const RED = "#c8261b";
  const INK = "#0d0c0b";
  const BONE = "#efe9df";

  const HOUSES = [
    { key: "nuit", name: "NUIT", after: "after Saint Laurent", line: "Le rouge, la nuit.",
      credit: "Lipstick in black lacquer. Parfum in red. Photographed by flash, after midnight.", draw: pageNuit },
    { key: "brut", name: "BRUT", after: "after Balenciaga", line: "Bag. Red. Latex.",
      credit: "An ordinary rubbish bag, made enormous and expensive. Nothing else in the room.", draw: pageBrut },
    { key: "velluto", name: "VELLUTO", after: "after Gucci", line: "Casa del velluto.",
      credit: "A black box bag, a bamboo handle, red velvet in every direction.", draw: pageVelluto },
    { key: "zero", name: "ZERO", after: "after Maison Margiela", line: "No name. Four stitches.",
      credit: "A dress form with no face, on red. The label is blank on purpose.", draw: pageZero },
    { key: "quote", name: "“QUOTE”", after: "after Virgil Abloh", line: "It says what it is.",
      credit: "A red bag printed with its own name, closed with a zip tie.", draw: pageQuote }
  ];

  const FONTS = ['900 200px "Archivo"', '800 30px "Archivo"', '200px Anton', '120px "Instrument Serif"',
    'italic 120px "Instrument Serif"', 'italic 900 160px "Playfair Display"', '24px "JetBrains Mono"'];

  function canvas() {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    return c;
  }

  function grain(ctx, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    for (let i = 0; i < 2600; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "#fff" : "#000";
      ctx.fillRect(Math.random() * W, Math.random() * H, 1.4, 1.4);
    }
    ctx.restore();
  }

  function folio(ctx, n, color) {
    ctx.fillStyle = color;
    ctx.font = '20px "JetBrains Mono"';
    ctx.textAlign = n % 2 ? "right" : "left";
    ctx.fillText("“RAW”  ·  THE HOUSES ISSUE  ·  " + String(n).padStart(2, "0"), n % 2 ? W - 60 : 60, H - 50);
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

  /* NUIT — black, spaced capitals, one line of French, a single red rule. */
  function pageNuit(ctx, h) {
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#8f887e";
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

  /* BRUT — red page, crushed condensed black type, deadpan facts. */
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
    ["BAG.", "RED.", "LATEX."].forEach(function (t, i) { ctx.fillText(t, 60, 760 + i * 74); });
    ctx.font = '26px "JetBrains Mono"';
    ctx.fillText("PRICE ON REQUEST", 60, 1060);
    ctx.font = '24px "Archivo"';
    wrap(ctx, h.credit, 520, 780, 420, 34);
  }

  /* VELLUTO — near black, ornate italic serif in red, a double frame like an old label. */
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
    ctx.font = 'italic 900 170px "Playfair Display"';
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

  /* ZERO — a blank white label with numbers, one circled; nothing else. */
  function pageZero(ctx, h) {
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#f4f2ee";
    ctx.fillRect(200, 360, 600, 300);
    ctx.fillStyle = "#1a1917";
    ctx.font = '28px "JetBrains Mono"';
    ctx.textAlign = "center";
    for (let i = 0; i < 24; i++) {
      ctx.fillText(String(i), 250 + (i % 8) * 71, 440 + Math.floor(i / 8) * 70);
    }
    ctx.strokeStyle = RED;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(250, 430, 26, 30, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = BONE;
    ctx.font = '400 110px "Instrument Serif"';
    ctx.fillText("Z E R O", W / 2, 860);
    ctx.font = 'italic 44px "Instrument Serif"';
    ctx.fillText(h.line, W / 2, 940);
    ctx.textAlign = "left";
  }

  /* “QUOTE” — red, bold sans in quotation marks, a factory label. */
  function pageQuote(ctx, h) {
    ctx.fillStyle = RED;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = INK;
    ctx.font = '900 190px "Archivo"';
    ctx.fillText("“PAGE”", 50, 360);
    ctx.font = '800 30px "Archivo"';
    ["“HANDBAG”", "RED LACQUER", "ONE ZIP TIE", "c/o MIR ZUHAIR™", "©2026"].forEach(function (t, i) {
      ctx.fillText(t, 60, 620 + i * 42);
    });
    ctx.font = 'italic 60px "Instrument Serif"';
    ctx.fillText(h.line, 60, 1000);
  }

  function campaign(img, h, n) {
    const c = canvas();
    const ctx = c.getContext("2d");
    if (img) ctx.drawImage(img, 0, 0, W, H);
    ctx.fillStyle = BONE;
    ctx.font = '800 26px "Archivo"';
    ctx.fillText(h.name, 60, 90);
    ctx.font = '20px "JetBrains Mono"';
    ctx.fillText(h.after.toUpperCase(), 60, 122);
    folio(ctx, n, BONE);
    grain(ctx, 0.05);
    return c;
  }

  function editorial(h, n) {
    const c = canvas();
    const ctx = c.getContext("2d");
    h.draw(ctx, h);
    folio(ctx, n, h.key === "brut" || h.key === "quote" ? INK : "#8f887e");
    grain(ctx, 0.06);
    return c;
  }

  function cover(img) {
    const c = canvas();
    const ctx = c.getContext("2d");
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);
    if (img) {
      ctx.globalAlpha = 0.85;
      ctx.drawImage(img, 0, 0, W, H);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = RED;
    ctx.font = '900 330px "Archivo"';
    let x = 30;
    "“RAW”".split("").forEach(function (ch) { ctx.fillText(ch, x, 330); x += ctx.measureText(ch).width - 16; });
    ctx.fillStyle = BONE;
    ctx.font = 'italic 84px "Instrument Serif"';
    ctx.fillText("The Houses", 50, 470);
    ctx.fillText("Issue.", 50, 550);
    ctx.font = '800 26px "Archivo"';
    ["NUIT", "BRUT", "VELLUTO", "ZERO", "“QUOTE”"].forEach(function (t, i) { ctx.fillText(t, 54, 660 + i * 36); });
    ctx.font = '20px "JetBrains Mono"';
    ctx.fillText("ISSUE 06  ·  AW26  ·  FREE", 54, H - 60);
    grain(ctx, 0.05);
    return c;
  }

  function back() {
    const c = canvas();
    const ctx = c.getContext("2d");
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
    return c;
  }

  function loadImage(src) {
    return new Promise(function (resolve) {
      const img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { console.warn("RAW: missing", src); resolve(null); };
      img.src = src;
    });
  }

  /* Page canvases in reading order: cover, [campaign, editorial] × houses, back. */
  function build() {
    const fonts = document.fonts
      ? Promise.all(FONTS.map(function (f) { return document.fonts.load(f); })).catch(function (err) { console.warn("RAW fonts", err); })
      : Promise.resolve();
    return fonts.then(function () {
      return Promise.all(HOUSES.map(function (h) { return loadImage("img/house-" + h.key + ".jpg"); }));
    }).then(function (imgs) {
      const pages = [cover(imgs[0])];
      HOUSES.forEach(function (h, i) {
        pages.push(campaign(imgs[i], h, 2 + i * 2));
        pages.push(editorial(h, 3 + i * 2));
      });
      pages.push(back());
      return pages;
    });
  }

  window.RawPages = { build: build, HOUSES: HOUSES, RATIO: H / W };
})();
