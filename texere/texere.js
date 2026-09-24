/* TEXERE — text and textile share one root.
   Five scenes, one idea: type is made of thread.
   01 warp     letters drawn as weft threads; the cursor combs them, a click plucks them
   02 unravel  scroll lets each thread go and it hangs as fringe; scroll back to knit
   03 weave    a word woven on a loom, weft over warp where the letter is, twill elsewhere
   04 tension  letters hanging on verlet threads: drag, swing, double-click to cut
   05 repeat   the word mirrored into a textile repeat; cursor sets scale and weight */
(() => {
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const C = { loom: "#15110e", cotton: "#efe6d6", madder: "#b23a2e", indigo: "#1e3a6b", turmeric: "#e0a43a", lac: "#7d1f3c" };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (x) => 1 - Math.pow(1 - x, 3);

  /* ---------- helpers ---------- */
  function fit(cv) {
    const w = Math.max(1, Math.round(cv.clientWidth * DPR)), h = Math.max(1, Math.round(cv.clientHeight * DPR));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; return true; }
    return false;
  }
  // rasterise text and return an alpha lookup, fitted inside a box
  function textMask(text, weight, W, H, box, italic = false) {
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d", { willReadFrequently: true });
    const probe = 100;
    x.font = `${italic ? "italic " : ""}${weight} ${probe}px Fraunces`;
    const m = x.measureText(text);
    const capH = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) || probe * .72;
    const size = Math.min(box.w / m.width, box.h / capH) * probe;
    x.font = `${italic ? "italic " : ""}${weight} ${size}px Fraunces`;
    const m2 = x.measureText(text);
    x.fillStyle = "#fff";
    x.textBaseline = "alphabetic";
    const asc = m2.actualBoundingBoxAscent, desc = m2.actualBoundingBoxDescent;
    x.fillText(text, box.x + (box.w - m2.width) / 2, box.y + (box.h - (asc + desc)) / 2 + asc);
    const d = x.getImageData(0, 0, W, H).data;
    return (px, py) => (px < 0 || py < 0 || px >= W || py >= H) ? 0 : d[(py * W + px) * 4 + 3];
  }
  // run-length segments of the mask along one row
  function rowSegments(mask, y, W, step) {
    const segs = [];
    let start = -1;
    for (let x = 0; x <= W; x += step) {
      const on = x < W && mask(x, y) > 110;
      if (on && start < 0) start = x;
      if (!on && start >= 0) { segs.push([start, x]); start = -1; }
    }
    return segs;
  }

  /* ---------- scene registry: only visible scenes animate ---------- */
  const scenes = [];
  function scene(name, api) {
    const cv = document.querySelector(`canvas[data-scene="${name}"]`);
    if (!cv) return;
    const s = { cv, ctx: cv.getContext("2d"), visible: false, ...api };
    scenes.push(s);
    new IntersectionObserver((es) => es.forEach((e) => { s.visible = e.isIntersecting; }), { rootMargin: "100px" }).observe(cv.closest(".ch") || cv);
  }
  function loop(t) {
    for (const s of scenes) {
      if (!s.visible) continue;
      if (fit(s.cv) || !s.ready) { s.build && s.build(); s.ready = true; }
      s.frame(t);
    }
    requestAnimationFrame(loop);
  }

  /* ---------- pointer helper ---------- */
  function pointer(cv) {
    const p = { x: -1e4, y: -1e4, down: false, inside: false };
    const set = (e) => { const r = cv.getBoundingClientRect(); p.x = (e.clientX - r.left) * DPR; p.y = (e.clientY - r.top) * DPR; };
    cv.addEventListener("pointermove", (e) => { set(e); p.inside = true; });
    cv.addEventListener("pointerdown", (e) => { set(e); p.down = true; p.inside = true; });
    addEventListener("pointerup", () => { p.down = false; });
    cv.addEventListener("pointerleave", () => { p.inside = false; p.x = p.y = -1e4; });
    return p;
  }

  /* ================================================================ 01 WARP */
  scene("warp", {
    build() {
      const { cv } = this, W = cv.width, H = cv.height;
      this.G = Math.round(Math.max(3 * DPR, Math.min(6.5 * DPR, W / 190)));   // thread pitch, finer on small screens
      this.S = Math.round(10 * DPR);                        // point spacing
      const box = { x: W * .06, y: H * .1, w: W * .88, h: H * .56 };
      const mask = textMask("TEXERE", 800, W, H, box);
      this.n = Math.ceil(W / this.S) + 2;
      this.rows = [];
      for (let y = this.G; y < H; y += this.G) {
        const segs = rowSegments(mask, Math.round(y), W, Math.max(1, Math.round(DPR)));
        const tint = Math.random();
        this.rows.push({ y, segs, off: new Float32Array(this.n), vel: new Float32Array(this.n),
          col: tint < .08 ? C.turmeric : tint < .14 ? C.madder : C.cotton });
      }
      if (!this.p) {
        this.p = pointer(cv);
        cv.addEventListener("pointerdown", (e) => this.pluck());
      }
    },
    pluck() {
      const { p, S } = this;
      for (const r of this.rows) for (let i = 0; i < this.n; i++) {
        const dx = i * S - p.x, dy = r.y - p.y, d = Math.hypot(dx, dy);
        r.vel[i] += (dy >= 0 ? 1 : -1) * 16 * DPR * Math.exp(-d / (220 * DPR)) * Math.cos(d / (26 * DPR));
      }
    },
    offAt(r, x) { const f = x / this.S, i = Math.floor(f), k = f - i; return r.off[i] * (1 - k) + r.off[Math.min(this.n - 1, i + 1)] * k; },
    frame(t) {
      const { ctx, cv, rows, S, G, p } = this, W = cv.width, H = cv.height, R = 120 * DPR;
      for (const r of rows) {
        const o = r.off, v = r.vel;
        for (let i = 0; i < this.n; i++) {
          const x = i * S;
          const target = reduce ? 0 : Math.sin(t * .0011 + r.y * .012 + x * .0035) * 1.1 * DPR;
          if (p.inside) {
            const dx = x - p.x, dy = r.y + o[i] - p.y, d = Math.hypot(dx, dy);
            if (d < R) v[i] += (dy >= 0 ? 1 : -1) * (1 - d / R) * 2.4 * DPR;
          }
          const lap = (i > 0 ? o[i - 1] : o[i]) + (i < this.n - 1 ? o[i + 1] : o[i]) - 2 * o[i];
          v[i] += (target - o[i]) * .05 + lap * .12;
          v[i] *= .88;
        }
        for (let i = 0; i < this.n; i++) o[i] += v[i];
      }
      ctx.fillStyle = C.loom;
      ctx.fillRect(0, 0, W, H);
      // warp: fine vertical threads
      ctx.globalAlpha = .06; ctx.fillStyle = C.cotton;
      for (let x = 0; x < W; x += G * 2) ctx.fillRect(x, 0, Math.max(1, DPR * .6), H);
      // weft ground, full width, faint
      ctx.lineCap = "round";
      ctx.lineWidth = Math.max(1, DPR * .7);
      ctx.strokeStyle = C.cotton; ctx.globalAlpha = .09;
      ctx.beginPath();
      for (const r of rows) {
        ctx.moveTo(0, r.y + r.off[0]);
        for (let i = 1; i < this.n; i++) ctx.lineTo(i * S, r.y + r.off[i]);
      }
      ctx.stroke();
      // the letters: thick threads where the word is
      ctx.globalAlpha = 1;
      ctx.lineWidth = G * .62;
      for (const r of rows) {
        if (!r.segs.length) continue;
        ctx.strokeStyle = r.col;
        ctx.beginPath();
        for (const [x0, x1] of r.segs) {
          ctx.moveTo(x0, r.y + this.offAt(r, x0));
          for (let x = Math.ceil(x0 / S) * S; x < x1; x += S) ctx.lineTo(x, r.y + this.offAt(r, x));
          ctx.lineTo(x1, r.y + this.offAt(r, x1));
        }
        ctx.stroke();
      }
    },
  });

  /* ================================================================ 02 UNRAVEL */
  const unravelSec = document.getElementById("unravel");
  scene("unravel", {
    build() {
      const { cv } = this, W = cv.width, H = cv.height;
      this.G = Math.round(Math.max(2.6 * DPR, Math.min(5.5 * DPR, W / 220)));
      const box = { x: W * .08, y: H * .44, w: W * .84, h: H * .3 };
      const mask = textMask("UNRAVEL", 700, W, H, box);
      this.threads = [];
      let row = 0;
      for (let y = this.G; y < H; y += this.G, row++) {
        for (const [x0, x1] of rowSegments(mask, Math.round(y), W, Math.max(1, Math.round(DPR)))) {
          this.threads.push({ y, x0, x1, t0: .04 + (x0 / W) * .5 + Math.random() * .2, sway: Math.random() * 6.28,
            col: row % 7 === 3 ? C.madder : row % 11 === 5 ? C.turmeric : C.cotton });
        }
      }
    },
    frame(t) {
      const { ctx, cv, threads, G } = this, W = cv.width, H = cv.height;
      const r = unravelSec.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - innerHeight));
      unravelSec.style.setProperty("--p", p.toFixed(3));
      unravelSec.querySelector(".meter").style.setProperty("--p", p.toFixed(3));
      ctx.fillStyle = C.loom; ctx.fillRect(0, 0, W, H);
      ctx.lineCap = "round";
      ctx.lineWidth = G * .6;
      for (const th of threads) {
        const q = ease(clamp((p - th.t0) / .28));
        const L = th.x1 - th.x0;
        ctx.strokeStyle = th.col;
        ctx.beginPath();
        ctx.moveTo(th.x0, th.y);
        if (q <= 0) { ctx.lineTo(th.x1, th.y); ctx.stroke(); continue; }
        const sw = reduce ? 0 : Math.sin(t * .0016 + th.sway) * .08 * q;
        const a = q * Math.PI / 2 + sw;                       // the free end swings down
        const ex = th.x0 + L * Math.cos(a), ey = th.y + L * Math.sin(a);
        const ca = a * .45;
        const cx = th.x0 + L * .55 * Math.cos(ca), cy = th.y + L * .55 * Math.sin(ca) + q * L * .12;
        ctx.quadraticCurveTo(cx, cy, ex, ey);
        ctx.stroke();
      }
    },
  });

  /* ================================================================ 03 WEAVE */
  const DYES = {
    madder: { fig: "#b23a2e", figHi: "#d0584a", warp: "#1e3a6b", weft: "#152a4f" },
    indigo: { fig: "#e9dfcc", figHi: "#fff7e8", warp: "#1e3a6b", weft: "#172f58" },
    turmeric: { fig: "#e0a43a", figHi: "#f2c065", warp: "#3a2418", weft: "#2b1a11" },
    lac: { fig: "#e9dfcc", figHi: "#fff7e8", warp: "#7d1f3c", weft: "#62172f" },
  };
  const wordInput = document.getElementById("word");
  const word = () => (wordInput && wordInput.value.trim().toUpperCase()) || "TEXERE";
  scene("weave", {
    build() {
      this.cols = 84; this.rows = 63;
      this.dye = this.dye || "madder";
      this.makeMask();
      this.start = performance.now();
      if (!this.bound) {
        this.bound = true;
        let tm;
        wordInput.addEventListener("input", () => { clearTimeout(tm); tm = setTimeout(() => { this.makeMask(); this.start = performance.now(); }, 280); });
        document.querySelectorAll("[data-dye]").forEach((b) => b.addEventListener("click", () => {
          this.dye = b.dataset.dye;
          document.querySelectorAll("[data-dye]").forEach((x) => x.setAttribute("aria-pressed", x === b));
          this.start = performance.now();
        }));
        document.getElementById("reweave").addEventListener("click", () => { this.start = performance.now(); });
        document.getElementById("save").addEventListener("click", () => this.save());
      }
    },
    makeMask() {
      const { cols, rows } = this, S = 8;
      const m = textMask(word(), 800, cols * S, rows * S, { x: cols * S * .07, y: rows * S * .22, w: cols * S * .86, h: rows * S * .5 });
      this.mask = [];
      for (let r = 0; r < rows; r++) { const line = []; for (let c = 0; c < cols; c++) line.push(m(c * S + S / 2, r * S + S / 2) > 100); this.mask.push(line); }
      this.noise = Array.from({ length: rows * cols }, () => Math.random());
    },
    cell(ctx, r, c, x, y, s, d) {
      const n = this.noise[r * this.cols + c];
      const pad = s * .1;
      if (this.mask[r][c]) {                                 // figure: weft floats over
        ctx.fillStyle = d.fig;
        ctx.beginPath(); ctx.roundRect(x - .5, y + pad, s + 1, s - 2 * pad, (s - 2 * pad) / 2); ctx.fill();
        ctx.fillStyle = d.figHi; ctx.globalAlpha = .35 + n * .2;
        ctx.fillRect(x, y + pad + s * .12, s, s * .1); ctx.globalAlpha = 1;
      } else if ((c + r) % 4 < 2) {                          // 2/2 twill: warp up
        ctx.fillStyle = d.warp;
        ctx.globalAlpha = .88 + n * .12;
        ctx.beginPath(); ctx.roundRect(x + pad, y - .5, s - 2 * pad, s + 1, (s - 2 * pad) / 2); ctx.fill();
        ctx.globalAlpha = 1;
      } else {                                               // twill: weft up
        ctx.fillStyle = d.weft;
        ctx.globalAlpha = .85 + n * .15;
        ctx.beginPath(); ctx.roundRect(x, y + pad, s, s - 2 * pad, (s - 2 * pad) / 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
    },
    draw(progress) {
      const { ctx, cv, cols, rows } = this, W = cv.width, H = cv.height, d = DYES[this.dye];
      const s = Math.min(W / cols, H / rows), ox = (W - s * cols) / 2, oy = (H - s * rows) / 2;
      ctx.fillStyle = "#0f0c0a"; ctx.fillRect(0, 0, W, H);
      // bare warp on the loom
      ctx.strokeStyle = d.warp; ctx.globalAlpha = .55; ctx.lineWidth = s * .35;
      ctx.beginPath();
      for (let c = 0; c < cols; c++) { const x = ox + c * s + s / 2; ctx.moveTo(x, oy); ctx.lineTo(x, oy + rows * s); }
      ctx.stroke(); ctx.globalAlpha = 1;
      const done = progress * rows;                           // cloth grows from the bottom
      const full = Math.floor(done), part = done - full;
      for (let k = 0; k < Math.min(rows, full + 1); k++) {
        const r = rows - 1 - k;
        const upto = k < full ? cols : Math.floor(part * cols);
        for (let c = 0; c < upto; c++) this.cell(ctx, r, c, ox + c * s, oy + r * s, s, d);
        if (k === full && full < rows) {                      // the shuttle
          ctx.fillStyle = C.turmeric;
          ctx.beginPath(); ctx.roundRect(ox + upto * s, oy + r * s - s * .2, s * 3.2, s * 1.4, s * .7); ctx.fill();
        }
      }
    },
    frame(t) {
      const dur = reduce ? 1 : 2600;
      this.draw(clamp((performance.now() - this.start) / dur));
    },
    save() {
      const out = document.createElement("canvas");
      out.width = this.cols * 24; out.height = this.rows * 24;
      const keep = [this.cv, this.ctx];
      this.cv = out; this.ctx = out.getContext("2d");
      this.draw(1);
      [this.cv, this.ctx] = keep;
      out.toBlob((b) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b); a.download = `texere-${word().toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }, "image/png");
    },
  });

  /* ================================================================ 04 TENSION */
  scene("tension", {
    build() {
      const { cv } = this, W = cv.width, H = cv.height;
      this.letters = [];
      const text = "PULL ME";
      const glyphs = [...text].filter((c) => c !== " ");
      const size = Math.min(H * .19, W / (glyphs.length + 1.5));
      this.size = size;
      const N = 12;
      let k = 0;
      [...text].forEach((ch, i) => {
        if (ch === " ") return;
        const ax = W * (.14 + .72 * (i / (text.length - 1)));
        const len = H * (.3 + .22 * ((k * 37) % 7) / 6);
        const seg = len / N, pts = [];
        for (let j = 0; j <= N; j++) pts.push({ x: ax, y: j * seg, px: ax, py: j * seg });
        this.letters.push({ ch, ax, seg, pts, cut: false, col: [C.cotton, C.turmeric, C.madder, C.cotton][k % 4] });
        k++;
      });
      if (!this.p) {
        this.p = pointer(cv);
        cv.addEventListener("pointerdown", () => {
          const L = this.nearest(); if (L) { this.grab = L; cv.classList.add("grabbing"); }
        });
        addEventListener("pointerup", () => { this.grab = null; cv.classList.remove("grabbing"); });
        cv.addEventListener("dblclick", () => { const L = this.nearest(); if (L) L.cut = true; });
        document.getElementById("retie").addEventListener("click", () => this.build());
      }
    },
    nearest() {
      let best = null, bd = 90 * DPR;
      for (const L of this.letters) { const e = L.pts[L.pts.length - 1]; const d = Math.hypot(e.x - this.p.x, e.y + this.size * .45 - this.p.y); if (d < bd) { bd = d; best = L; } }
      return best;
    },
    frame() {
      const { ctx, cv, p } = this, W = cv.width, H = cv.height, g = .55 * DPR, floor = H - 12 * DPR;
      for (const L of this.letters) {
        const pts = L.pts;
        for (let j = 0; j < pts.length; j++) {
          const q = pts[j];
          if (j === 0 && !L.cut) { q.x = L.ax; q.y = 0; continue; }
          const vx = (q.x - q.px) * .985, vy = (q.y - q.py) * .985;
          q.px = q.x; q.py = q.y;
          q.x += vx; q.y += vy + g * (j === pts.length - 1 ? 2.2 : 1);
          if (p.inside && !this.grab) {                      // the cursor is a breeze
            const d = Math.hypot(q.x - p.x, q.y - p.y);
            if (d < 110 * DPR) q.x += (q.x - p.x) / d * (1 - d / (110 * DPR)) * 2.2 * DPR;
          }
          if (q.y > floor) { q.y = floor; q.px = q.x - vx * .6; }
        }
        if (this.grab === L) { const e = pts[pts.length - 1]; e.x = p.x; e.y = p.y - this.size * .45; }
        for (let it = 0; it < 10; it++) {
          for (let j = 0; j < pts.length - 1; j++) {
            const a = pts[j], b = pts[j + 1];
            const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, diff = (d - L.seg) / d;
            const aFix = j === 0 && !L.cut, bFix = this.grab === L && j + 1 === pts.length - 1;
            const wa = aFix ? 0 : bFix ? 1 : .5, wb = bFix ? 0 : aFix ? 1 : .5;
            a.x += dx * diff * wa; a.y += dy * diff * wa;
            b.x -= dx * diff * wb; b.y -= dy * diff * wb;
          }
        }
      }
      ctx.fillStyle = C.loom; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(239,230,214,.08)"; ctx.fillRect(0, floor, W, 1 * DPR);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      for (const L of this.letters) {
        const pts = L.pts;
        ctx.strokeStyle = "rgba(239,230,214,.7)"; ctx.lineWidth = 1.6 * DPR;
        ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
        for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
        const e = pts[pts.length - 1], b = pts[pts.length - 2];
        const ang = Math.atan2(e.x - b.x, -(e.y - b.y));
        ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(-ang + Math.PI);
        ctx.fillStyle = L.col;
        ctx.font = `700 ${this.size}px Fraunces`;
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(L.ch, 0, -this.size * .02);
        ctx.restore();
        ctx.fillStyle = C.turmeric; ctx.beginPath(); ctx.arc(e.x, e.y, 2.5 * DPR, 0, 6.3); ctx.fill();
      }
    },
  });

  /* ================================================================ 05 REPEAT */
  const DYEWAYS = [["#15110e", "#e0a43a"], ["#1e3a6b", "#efe6d6"], ["#b23a2e", "#15110e"], ["#efe6d6", "#7d1f3c"], ["#3a2418", "#e0a43a"]];
  scene("repeat", {
    build() {
      if (!this.p) {
        this.p = pointer(this.cv);
        this.way = 0; this.ts = 260; this.wt = 500; this.key = "";
        this.cv.addEventListener("click", () => { this.way = (this.way + 1) % DYEWAYS.length; this.key = ""; });
      }
      this.key = "";
    },
    tile(T, wt) {
      const [bg, ink] = DYEWAYS[this.way];
      const key = [word(), T, wt, this.way].join("|");
      if (key === this.key) return this.pat;
      this.key = key;
      const h = Math.round(T / 2);
      const q = document.createElement("canvas"); q.width = q.height = h;
      const x = q.getContext("2d");
      x.fillStyle = bg; x.fillRect(0, 0, h, h);
      x.fillStyle = ink;
      x.font = `italic ${wt} 100px Fraunces`;
      const w = word(), m = x.measureText(w);
      const size = Math.min((h * 1.05) / m.width * 100, h * .9);
      x.save(); x.translate(h * .5, h * .5); x.rotate(-Math.PI / 4);
      x.font = `italic ${wt} ${size}px Fraunces`; x.textAlign = "center"; x.textBaseline = "middle";
      x.fillText(w, 0, 0); x.restore();
      x.strokeStyle = ink; x.globalAlpha = .35; x.lineWidth = Math.max(1, h * .006);
      x.beginPath(); x.moveTo(0, 0); x.lineTo(h, h); x.stroke(); x.globalAlpha = 1;
      // mirror four ways, then half-drop the second column
      const t = document.createElement("canvas"); t.width = 2 * T; t.height = T;
      const y = t.getContext("2d");
      const quad = (ox, oy) => {
        y.save(); y.translate(ox, oy); y.drawImage(q, 0, 0);
        y.save(); y.translate(2 * h, 0); y.scale(-1, 1); y.drawImage(q, 0, 0); y.restore();
        y.save(); y.translate(0, 2 * h); y.scale(1, -1); y.drawImage(q, 0, 0); y.restore();
        y.save(); y.translate(2 * h, 2 * h); y.scale(-1, -1); y.drawImage(q, 0, 0); y.restore();
        y.restore();
      };
      quad(0, 0); quad(T, -T / 2); quad(T, T / 2);
      this.pat = this.ctx.createPattern(t, "repeat");
      return this.pat;
    },
    frame(t) {
      const { ctx, cv, p } = this, W = cv.width, H = cv.height;
      const tx = p.inside ? clamp(p.x / W) : .5 + Math.sin(t * .0003) * .2, ty = p.inside ? clamp(p.y / H) : .5 + Math.cos(t * .00025) * .25;
      this.ts += ((120 + tx * 360) * DPR - this.ts) * .08;
      this.wt += ((200 + ty * 700) - this.wt) * .08;
      const T = Math.round(this.ts / (8 * DPR)) * 8 * DPR, wt = Math.round(this.wt / 50) * 50;
      const pat = this.tile(T, wt);
      const drift = reduce ? 0 : t * .012 * DPR;
      ctx.save();
      ctx.fillStyle = pat;
      ctx.translate(-(drift % (2 * T)), -((drift * .5) % T));
      ctx.fillRect(0, 0, W + 2 * T, H + T);
      ctx.restore();
    },
  });

  /* ---------- variable-font letters that lean toward the cursor ---------- */
  function splitLetters(el) {
    const txt = el.innerHTML.split(/(<br>)/);
    el.innerHTML = txt.map((part) => part === "<br>" ? part : [...part].map((c) => c === " " ? " " : `<span class="l">${c}</span>`).join("")).join("");
  }
  const vfEls = [...document.querySelectorAll(".vf-title, .vf-hover")];
  vfEls.forEach(splitLetters);
  let mx = -1e4, my = -1e4, vfRaf = 0;
  const vfFrame = () => {
    vfRaf = 0;
    for (const el of vfEls) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      el.querySelectorAll(".l").forEach((s) => {
        const b = s.getBoundingClientRect();
        const d = Math.hypot(b.left + b.width / 2 - mx, b.top + b.height / 2 - my);
        const k = clamp(1 - d / 360);
        s.style.fontVariationSettings = `"wght" ${Math.round(200 + 700 * k)}, "SOFT" ${Math.round(100 * k)}, "opsz" 144`;
      });
    }
  };
  if (!reduce) addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; if (!vfRaf) vfRaf = requestAnimationFrame(vfFrame); }, { passive: true });

  /* ---------- chapter nav ---------- */
  const links = [...document.querySelectorAll(".chapters a")];
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.dataset.ch === e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  ["warp", "unravel", "weave", "tension", "repeat"].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });

  /* ---------- start once the variable font is ready ---------- */
  Promise.all(["800 100px Fraunces", "700 100px Fraunces", "italic 500 100px Fraunces"].map((f) => document.fonts.load(f)))
    .catch(() => {}).then(() => requestAnimationFrame(loop));
  addEventListener("resize", () => scenes.forEach((s) => { s.ready = false; }));
})();
