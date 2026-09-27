/* Chhaap: drawing the cloth, the block and the dyes. Pure rendering, no page state. */
window.ChhaapCloth = (() => {
  "use strict";

  const MOTIFS = Object.freeze(["lantern", "doorway", "deer", "ceiling"]);
  const INK = "#1a1512";
  const RAW = "#efe6d4";
  // each block has its own print shape and its own two natural dyes:
  // the first fills the heart of every print, the second the cloth around it
  const STYLES = Object.freeze({
    lantern: { shape: "oval", first: { name: "madder", color: "#a3201d" }, second: { name: "indigo", color: "#1f2d5c" }, note: "Madder is a red from a root; indigo, a blue from a leaf." },
    doorway: { shape: "arch", first: { name: "turmeric", color: "#d69a1a" }, second: { name: "madder", color: "#7e1714" }, note: "Turmeric is a yellow from a root; madder, a red from a root." },
    deer: { shape: "circle", first: { name: "indigo", color: "#2c4a8e" }, second: { name: "iron black", color: "#1b1917" }, note: "Indigo is a blue from a leaf; iron black comes from rusted iron." },
    ceiling: { shape: "diamond", first: { name: "madder", color: "#b0271f" }, second: { name: "iron black", color: "#1b1917" }, note: "Madder is a red from a root; iron black comes from rusted iron." }
  });
  const styleOf = (motif) => STYLES[motif] || STYLES.lantern;
  const DOTS_PER_RING = 30;
  const TINT_CACHE_MAX = 40;
  const tintCache = new Map();

  function loadMasks(base) {
    return Promise.all(MOTIFS.map((name) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve([name, img]);
      img.onerror = () => reject(new Error(`Chhaap: could not load the ${name} block`));
      img.src = `${base}/${name}.png`;
    }))).then((pairs) => Object.freeze(Object.fromEntries(pairs)));
  }

  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const x = hex(a); const y = hex(b); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`; };

  // the three moments of colour: raw cotton, after the first dye, after the second
  function colorsAt(dye, motif) {
    const st = styleOf(motif);
    const stops = [
      { ground: RAW, medal: RAW, dot: INK },
      { ground: RAW, medal: st.first.color, dot: INK },
      { ground: st.second.color, medal: st.first.color, dot: RAW }
    ];
    const d = Math.max(0, Math.min(2, dye));
    const i = Math.min(1, Math.floor(d));
    const t = d - i;
    const a = stops[i];
    const b = stops[i + 1];
    return { ground: mix(a.ground, b.ground, t), medal: mix(a.medal, b.medal, t), dot: mix(a.dot, b.dot, t), line: INK };
  }

  function tinted(mask, color) {
    const key = `${mask.src}|${color}`;
    if (tintCache.has(key)) return tintCache.get(key);
    const c = document.createElement("canvas");
    c.width = mask.naturalWidth;
    c.height = mask.naturalHeight;
    const ctx = c.getContext("2d");
    ctx.drawImage(mask, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, c.width, c.height);
    if (tintCache.size > TINT_CACHE_MAX) tintCache.clear();
    tintCache.set(key, c);
    return c;
  }

  // half-drop grid of print positions covering the cloth, in the order a printer works
  function layout(W, H, tile) {
    const cols = Math.ceil(W / tile) + 1;
    const rows = Math.ceil(H / tile) + 1;
    const slots = [];
    for (let i = 0; i < cols; i++) {
      for (let j = -1; j < rows; j++) {
        slots.push({ x: i * tile + tile * .5, y: j * tile + tile * .5 + (i % 2 ? tile * .5 : 0) });
      }
    }
    return slots.sort((a, b) => a.y - b.y || a.x - b.x);
  }

  // every press is a little different, but the same press is always the same
  function jitterFor(index, tile) {
    const r = (n) => { const s = Math.sin(index * 127.1 + n * 311.7) * 43758.5453; return s - Math.floor(s); };
    return { jx: (r(1) - .5) * tile * .024, jy: (r(2) - .5) * tile * .024, rot: (r(3) - .5) * .026, ink: .84 + r(4) * .16 };
  }

  function shapePath(ctx, shape, rx, ry) {
    ctx.beginPath();
    if (shape === "circle") ctx.arc(0, 0, Math.min(rx, ry), 0, Math.PI * 2);
    else if (shape === "diamond") { ctx.moveTo(0, -ry * 1.05); ctx.lineTo(rx * 1.05, 0); ctx.lineTo(0, ry * 1.05); ctx.lineTo(-rx * 1.05, 0); ctx.closePath(); }
    else if (shape === "arch") { ctx.moveTo(-rx, ry); ctx.lineTo(-rx, -ry * .1); ctx.bezierCurveTo(-rx, -ry * .75, -rx * .35, -ry, 0, -ry * 1.08); ctx.bezierCurveTo(rx * .35, -ry, rx, -ry * .75, rx, -ry * .1); ctx.lineTo(rx, ry); ctx.closePath(); }
    else ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  }

  // points around the edge of the print shape, for the ring of resist dots
  function edgePoint(shape, a, rx, ry) {
    if (shape === "circle") { const r = Math.min(rx, ry); return [Math.cos(a) * r, Math.sin(a) * r]; }
    if (shape === "diamond") { const c = Math.cos(a); const s2 = Math.sin(a); const k = 1.05 / (Math.abs(c) / rx + Math.abs(s2) / ry); return [c * k, s2 * k]; }
    if (shape === "arch") {
      const c = Math.cos(a);
      const s2 = Math.sin(a);
      if (s2 < 0) return [c * rx, s2 * ry * 1.05]; // the rounded top
      const k = Math.min(rx / Math.max(Math.abs(c), 1e-6), ry / Math.max(s2, 1e-6)); // the straight sides and base
      return [c * k, s2 * k];
    }
    return [Math.cos(a) * rx, Math.sin(a) * ry];
  }

  function drawPrint(ctx, slot, tile, mask, col, jit, shape = "oval") {
    const rx = tile * .43;
    const ry = tile * .47;
    ctx.save();
    ctx.translate(slot.x + jit.jx, slot.y + jit.jy);
    ctx.rotate(jit.rot);
    ctx.globalAlpha = jit.ink;
    shapePath(ctx, shape, rx, ry);
    ctx.fillStyle = col.medal;
    ctx.fill();
    ctx.lineWidth = Math.max(1, tile * .012);
    ctx.strokeStyle = col.line;
    ctx.stroke();
    ctx.fillStyle = col.dot;
    for (let k = 0; k < DOTS_PER_RING; k++) {
      const a = (k / DOTS_PER_RING) * Math.PI * 2;
      ctx.beginPath();
      const [ex, ey] = edgePoint(shape, a, rx, ry);
      ctx.arc(ex * 1.08, ey * 1.08, Math.max(.8, tile * .011), 0, Math.PI * 2);
      ctx.fill();
    }
    const box = tile * .64;
    const s = Math.min(box / mask.naturalWidth, box / mask.naturalHeight);
    const w = mask.naturalWidth * s;
    const h = mask.naturalHeight * s;
    ctx.drawImage(tinted(mask, col.line), -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  let grainTile = null;
  function grainPattern(ctx) {
    if (!grainTile) {
      grainTile = document.createElement("canvas");
      grainTile.width = grainTile.height = 160;
      const g = grainTile.getContext("2d");
      const img = g.createImageData(160, 160);
      for (let p = 0; p < img.data.length; p += 4) {
        const v = 100 + Math.random() * 155;
        img.data[p] = img.data[p + 1] = img.data[p + 2] = v;
        img.data[p + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      g.fillStyle = "rgba(0,0,0,.18)";
      for (let y = 0; y < 160; y += 3) g.fillRect(0, y, 160, 1);
    }
    return ctx.createPattern(grainTile, "repeat");
  }

  function drawCloth(ctx, W, H, o) {
    const col = colorsAt(o.dye, o.motif);
    const shape = styleOf(o.motif).shape;
    ctx.fillStyle = col.ground;
    ctx.fillRect(0, 0, W, H);
    o.slots.forEach((slot, idx) => { if (o.pressed.has(idx)) drawPrint(ctx, slot, o.tile, o.mask, col, jitterFor(idx, o.tile), shape); });
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = .16;
    ctx.fillStyle = grainPattern(ctx);
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawBorders(ctx, W, H, band, accent) {
    [0, H - band].forEach((y) => {
      ctx.fillStyle = INK;
      ctx.fillRect(0, y, W, band);
      ctx.fillStyle = accent;
      ctx.fillRect(0, y + band * .18, W, band * .1);
      ctx.fillRect(0, y + band * .72, W, band * .1);
      ctx.fillStyle = "#efe6d4";
      for (let x = band * .3; x < W; x += band * .42) { ctx.beginPath(); ctx.arc(x, y + band * .5, band * .07, 0, Math.PI * 2); ctx.fill(); }
    });
  }

  function woodGrain(ctx, x, y, S) {
    ctx.strokeStyle = "rgba(35,18,6,.28)";
    ctx.lineWidth = 1;
    for (let k = 0; k < 46; k++) {
      ctx.beginPath();
      for (let t = 0; t <= 1.001; t += .05) {
        const px = x + t * S;
        const py = y + (k / 46) * S + Math.sin(t * 6 + k * .7) * 5 + Math.sin(t * 17 + k) * 1.5;
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }

  // the block itself, carved in reverse, revealed from the top as it is cut
  function drawBlock(ctx, W, H, mask, reveal, cx) {
    ctx.fillStyle = "#0d1120";
    ctx.fillRect(0, 0, W, H);
    const S = Math.min(W, H) * .58;
    const x = cx - S / 2;
    const y = H / 2 - S / 2;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.55)";
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 26;
    const wood = ctx.createLinearGradient(x, y, x + S, y + S);
    wood.addColorStop(0, "#8a5630");
    wood.addColorStop(1, "#5e361b");
    ctx.fillStyle = wood;
    ctx.fillRect(x, y, S, S);
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, S, S);
    ctx.clip();
    woodGrain(ctx, x, y, S);
    const box = S * .84;
    const s = Math.min(box / mask.naturalWidth, box / mask.naturalHeight);
    const w = mask.naturalWidth * s;
    const h = mask.naturalHeight * s;
    const r = Math.max(0, Math.min(1, reveal));
    ctx.beginPath();
    ctx.rect(x, y, S, S * r);
    ctx.clip();
    ctx.translate(cx, H / 2);
    ctx.scale(-1, 1);
    ctx.shadowColor = "rgba(30,14,4,.85)";
    ctx.shadowOffsetX = -3;
    ctx.shadowOffsetY = 4;
    ctx.shadowBlur = 3;
    ctx.drawImage(tinted(mask, "#e6bf8e"), -w / 2, -h / 2, w, h);
    ctx.restore();
    if (r < 1) {
      ctx.fillStyle = "rgba(230,191,142,.85)";
      ctx.fillRect(x, y + S * r - 1, S, 2);
    }
  }

  // one lone print on a square of cloth, for the prologue
  function drawSingle(ctx, W, H, mask, cx, motif) {
    ctx.fillStyle = "#0d1120";
    ctx.fillRect(0, 0, W, H);
    const S = Math.min(W, H) * .5;
    const glow = ctx.createRadialGradient(cx, H / 2, S * .2, cx, H / 2, S * 1.3);
    glow.addColorStop(0, "rgba(224,164,58,.16)");
    glow.addColorStop(1, "rgba(224,164,58,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.5)";
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 30;
    ctx.fillStyle = "#efe6d4";
    ctx.fillRect(cx - S / 2, H / 2 - S / 2, S, S);
    ctx.restore();
    drawPrint(ctx, { x: cx, y: H / 2 }, S * .86, mask, colorsAt(1, motif), { jx: 0, jy: 0, rot: -.01, ink: .96 }, styleOf(motif).shape);
  }

  function exportCloth(mask, motif) {
    const W = 2400;
    const H = 3000;
    const band = 150;
    const tile = 360;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    const slots = layout(W, H - band * 2, tile);
    ctx.save();
    ctx.translate(0, band);
    drawCloth(ctx, W, H - band * 2, { slots, tile, mask, motif, dye: 2, pressed: new Set(slots.map((_, i) => i)) });
    ctx.restore();
    drawBorders(ctx, W, H, band, styleOf(motif).first.color);
    return c;
  }

  return Object.freeze({ MOTIFS, styleOf, loadMasks, layout, colorsAt, drawCloth, drawBlock, drawSingle, exportCloth });
})();
