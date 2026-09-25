/* What Is a Line — nine plates, one ink and one red. Plain canvas, no libraries. */
(() => {
  const INK = "#1b1a17", RED = "#d2452b", PAPER = "#f6f3ec", PAGE = "#f1ede4";
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));

  /* ---------- plates ---------- */
  const PLATES = {

    // A line under the title that bends toward the cursor, like a thread lifted by a finger.
    thread: {
      bg: PAGE,
      init(s) { s.N = 140; s.y = new Float32Array(s.N); s.v = new Float32Array(s.N); },
      frame(s, c, t) {
        const { w, h, p, N } = s, base = h * 0.55;
        for (let i = 0; i < N; i++) {
          const x = (i / (N - 1)) * w;
          let target = 0;
          if (p.in) { const d = (x - p.x) / (w * 0.08); target = (p.y - base) * Math.exp(-d * d); }
          else target = Math.sin(t * 0.0012 + i * 0.07) * 6;
          s.v[i] = (s.v[i] + (target - s.y[i]) * 0.05) * 0.86;
          s.y[i] += s.v[i];
        }
        c.lineWidth = 1.5; c.strokeStyle = INK; c.beginPath();
        for (let i = 0; i < N; i++) { const x = (i / (N - 1)) * w; i ? c.lineTo(x, base + s.y[i]) : c.moveTo(x, base + s.y[i]); }
        c.stroke();
        if (p.in) { c.fillStyle = RED; c.beginPath(); c.arc(p.x, base + s.y[Math.round(clamp(p.x / w, 0, 1) * (N - 1))], 4, 0, 7); c.fill(); }
      }
    },

    // 01 Walk: a wandering point leaves an ink trail; the viewer's drag leaves a red one.
    walk: {
      keep: true,
      init(s) { s.x = s.w / 2; s.y = s.h / 2; s.a = rnd(7); s.da = 0; },
      frame(s, c) {
        const { w, h, p } = s;
        c.fillStyle = "rgba(246,243,236,.012)"; c.fillRect(0, 0, w, h);
        for (let k = 0; k < 2; k++) {
          s.da = s.da * 0.92 + rnd(-0.06, 0.06);
          const toC = Math.atan2(h / 2 - s.y, w / 2 - s.x), edge = Math.hypot(s.x - w / 2, s.y - h / 2) / (w * 0.42);
          let diff = ((toC - s.a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
          s.a += s.da + (edge > 1 ? diff * 0.08 : 0);
          const nx = s.x + Math.cos(s.a) * 1.4, ny = s.y + Math.sin(s.a) * 1.4;
          c.strokeStyle = INK; c.lineWidth = 1.2; c.beginPath(); c.moveTo(s.x, s.y); c.lineTo(nx, ny); c.stroke();
          s.x = nx; s.y = ny;
        }
        if (p.down && p.px != null) { c.strokeStyle = RED; c.lineWidth = 2; c.lineCap = "round"; c.beginPath(); c.moveTo(p.px, p.py); c.lineTo(p.x, p.y); c.stroke(); }
      },
      dbl(s, c) { c.fillStyle = PAPER; c.fillRect(0, 0, s.w, s.h); }
    },

    // 02 Divide: one line through the plate, one side toned, the two sides named.
    divide: {
      frame(s, c, t) {
        const { w, h, p } = s;
        const cx = p.in ? p.x : w / 2 + Math.sin(t * 0.0005) * w * 0.12, cy = p.in ? p.y : h / 2;
        const ang = p.in ? ((p.x / w) - 0.5) * Math.PI * 1.2 + Math.PI / 2 : t * 0.0003 + 1;
        const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx, L = w * 2;
        c.fillStyle = "rgba(27,26,23,.07)"; c.beginPath();
        c.moveTo(cx - dx * L, cy - dy * L); c.lineTo(cx + dx * L, cy + dy * L);
        c.lineTo(cx + dx * L + nx * L, cy + dy * L + ny * L); c.lineTo(cx - dx * L + nx * L, cy - dy * L + ny * L); c.fill();
        c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - dx * L, cy - dy * L); c.lineTo(cx + dx * L, cy + dy * L); c.stroke();
        c.font = `italic ${w * 0.1}px "Instrument Serif", serif`; c.textAlign = "center"; c.textBaseline = "middle";
        const lab = (word, k, col) => { const x = clamp(cx + nx * w * 0.26 * k, w * 0.15, w * 0.85), y = clamp(cy + ny * h * 0.26 * k, h * 0.12, h * 0.88); c.fillStyle = col; c.fillText(word, x, y); };
        lab("there", 1, INK); lab("here", -1, RED);
      }
    },

    // 03 Enclose: an open loop whose gap closes as the cursor nears the centre; closed, it fills.
    enclose: {
      init(s) { s.close = 0; s.seed = Array.from({ length: 5 }, () => rnd(7)); },
      frame(s, c, t) {
        const { w, h, p } = s, cx = w / 2, cy = h / 2, R = w * 0.3;
        const goal = p.in ? 1 - clamp(Math.hypot(p.x - cx, p.y - cy) / (w * 0.45), 0, 1) : (Math.sin(t * 0.0009) + 1) / 2;
        s.close += (goal - s.close) * 0.08;
        const span = Math.PI * 2 * (0.35 + 0.65 * Math.min(1, s.close * 1.15)), full = span >= Math.PI * 2 - 0.02;
        const pt = (a) => { const r = R * (1 + 0.06 * Math.sin(a * 3 + s.seed[0] + t * 0.0006) + 0.04 * Math.sin(a * 5 + s.seed[1])); return [cx + Math.cos(a - Math.PI / 2) * r, cy + Math.sin(a - Math.PI / 2) * r]; };
        c.beginPath();
        const steps = 160;
        for (let i = 0; i <= steps; i++) { const [x, y] = pt((i / steps) * span); i ? c.lineTo(x, y) : c.moveTo(x, y); }
        if (full) { c.closePath(); c.fillStyle = RED; c.fill(); }
        c.strokeStyle = INK; c.lineWidth = 2.5; c.lineCap = "round"; c.stroke();
        if (!full) { const [x0, y0] = pt(0), [x1, y1] = pt(span); c.fillStyle = INK; for (const [x, y] of [[x0, y0], [x1, y1]]) { c.beginPath(); c.arc(x, y, 4, 0, 7); c.fill(); } }
        c.fillStyle = full ? RED : "rgba(27,26,23,.5)"; c.font = `12px "IBM Plex Mono", monospace`; c.textAlign = "center";
        c.fillText(full ? "SHAPE" : "LINE", cx, h - 22);
      }
    },

    // 04 Shade: a sphere made only of straight hatching; the cursor is the light.
    shade: {
      frame(s, c, t) {
        const { w, h, p } = s, cx = w / 2, cy = h * 0.46, R = w * 0.3;
        let lx = p.in ? (p.x - cx) / R : Math.cos(t * 0.0006) * 1.2, ly = p.in ? (p.y - cy) / R : -0.8 + Math.sin(t * 0.0006) * 0.4;
        let lz = 0.8; const ln = Math.hypot(lx, ly, lz); lx /= ln; ly /= ln; lz /= ln;
        const sx = cx - lx * R * 0.7, sy = cy + R * 1.08;
        const dark = (x, y) => {
          const u = (x - cx) / R, v = (y - cy) / R, r2 = u * u + v * v;
          if (r2 < 1) return 1 - Math.max(0, u * lx + v * ly + Math.sqrt(1 - r2) * lz);
          const e = ((x - sx) / (R * 1.15)) ** 2 + ((y - sy) / (R * 0.2)) ** 2;
          return e < 1 ? 0.85 - e * 0.5 : 0;
        };
        // Four layers of parallel lines; each layer only draws where the form is darker than its threshold.
        const layers = [[Math.PI / 4, 0.12], [-Math.PI / 4, 0.4], [0, 0.62], [Math.PI / 2, 0.82]], gap = Math.max(4, w / 70), step = 2;
        c.strokeStyle = INK; c.lineWidth = 0.8; c.beginPath();
        for (const [a, th] of layers) {
          const dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx, D = Math.hypot(w, h) / 2;
          for (let o = -D; o <= D; o += gap) {
            let on = false;
            for (let k = -D; k <= D; k += step) {
              const x = w / 2 + nx * o + dx * k, y = h / 2 + ny * o + dy * k;
              const inside = x >= 0 && y >= 0 && x <= w && y <= h && dark(x, y) > th;
              if (inside && !on) c.moveTo(x, y); else if (inside) c.lineTo(x, y);
              on = inside;
            }
          }
        }
        c.stroke();
        c.fillStyle = RED; c.beginPath(); c.arc(cx + lx * R * 1.45, cy + ly * R * 1.45, 5, 0, 7); c.fill();
      }
    },

    // 05 Direct: a field of short strokes that all turn toward one point.
    direct: {
      init(s) { s.gap = s.w / 13; s.ang = []; for (let y = s.gap / 2; y < s.h; y += s.gap) for (let x = s.gap / 2; x < s.w; x += s.gap) s.ang.push([x, y, rnd(7)]); },
      frame(s, c, t) {
        const { w, h, p } = s;
        const tx = p.in ? p.x : w / 2 + Math.cos(t * 0.0007) * w * 0.3, ty = p.in ? p.y : h / 2 + Math.sin(t * 0.0011) * h * 0.3;
        c.strokeStyle = INK; c.lineWidth = 1.6; c.lineCap = "round"; c.beginPath();
        const L = s.gap * 0.34;
        for (const a of s.ang) {
          const goal = Math.atan2(ty - a[1], tx - a[0]);
          a[2] += (((goal - a[2] + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * 0.12;
          c.moveTo(a[0] - Math.cos(a[2]) * L, a[1] - Math.sin(a[2]) * L); c.lineTo(a[0] + Math.cos(a[2]) * L, a[1] + Math.sin(a[2]) * L);
        }
        c.stroke();
        c.fillStyle = RED; c.beginPath(); c.arc(tx, ty, 6, 0, 7); c.fill();
      }
    },

    // 06 Hold: a string between two pins; drag across it to pluck.
    tension: {
      init(s) { s.N = 90; s.y = new Float32Array(s.N); s.v = new Float32Array(s.N); s.next = 1500; },
      frame(s, c, t) {
        const { w, h, p, N } = s, x0 = w * 0.1, x1 = w * 0.9, base = h / 2;
        const xi = (i) => x0 + (i / (N - 1)) * (x1 - x0);
        if (p.down && p.x > x0 && p.x < x1) {
          const i = Math.round(((p.x - x0) / (x1 - x0)) * (N - 1)), lim = h * 0.35;
          const dy = clamp(p.y - base, -lim, lim);
          for (let j = 1; j < N - 1; j++) { const k = j <= i ? j / i : (N - 1 - j) / (N - 1 - i); s.y[j] = dy * k; s.v[j] = 0; }
        } else if (!p.in && t > s.next) {
          const i = Math.floor(rnd(15, N - 15)), dy = rnd(-1, 1) * h * 0.22;
          for (let j = 1; j < N - 1; j++) s.y[j] = dy * (j <= i ? j / i : (N - 1 - j) / (N - 1 - i));
          s.next = t + 3200;
        }
        for (let it = 0; it < 3; it++) {
          for (let j = 1; j < N - 1; j++) s.v[j] = (s.v[j] + (s.y[j - 1] + s.y[j + 1] - 2 * s.y[j]) * 0.45) * 0.9985;
          for (let j = 1; j < N - 1; j++) s.y[j] += s.v[j];
        }
        c.strokeStyle = INK; c.lineWidth = 1.8; c.beginPath();
        for (let j = 0; j < N; j++) j ? c.lineTo(xi(j), base + s.y[j]) : c.moveTo(xi(j), base + s.y[j]);
        c.stroke();
        c.strokeStyle = "rgba(27,26,23,.18)"; c.lineWidth = 1; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(x0, base); c.lineTo(x1, base); c.stroke(); c.setLineDash([]);
        c.fillStyle = RED; for (const x of [x0, x1]) { c.beginPath(); c.arc(x, base, 6, 0, 7); c.fill(); }
      }
    },

    // 07 Speak: a brush whose weight follows speed. Slow is heavy, fast is thin.
    weight: {
      init(s) { s.trail = []; s.wd = 3; },
      frame(s, c, t) {
        const { w, h, p, trail } = s;
        let x, y, draw;
        if (p.in) { x = p.x; y = p.y; draw = p.down || p.touch === false; }
        else {
          const sp = 0.5 + 0.5 * Math.sin(t * 0.0006);
          s.ph = (s.ph || 0) + 0.008 + sp * sp * 0.06;
          x = w / 2 + Math.sin(s.ph * 1.3) * w * 0.36; y = h / 2 + Math.sin(s.ph * 2.1) * h * 0.3; draw = true;
        }
        const last = trail[trail.length - 1];
        if (draw && last && !last.gap) {
          const target = clamp(20 - Math.hypot(x - last.x, y - last.y) * 0.9, 1, 20);
          s.wd += (target - s.wd) * 0.25;
        }
        trail.push({ x, y, wd: s.wd, gap: !draw });
        if (trail.length > 220) trail.shift();
        c.strokeStyle = INK; c.lineCap = "round";
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1], b = trail[i]; if (a.gap || b.gap) continue;
          c.globalAlpha = i / trail.length; c.lineWidth = b.wd;
          c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
        }
      },
      leave(s) { s.trail.push({ x: 0, y: 0, gap: true }); }
    },

    // 08 Write: words stroked in outline on guide lines. line → linen → lineage → outline.
    write: {
      init(s) { s.words = ["line", "linen", "lineage", "outline"]; },
      frame(s, c, t) {
        const { w, h, p } = s, dur = 3600, idx = Math.floor(t / dur) % s.words.length, word = s.words[idx];
        let prog = p.in ? clamp((p.x - w * 0.1) / (w * 0.8), 0, 1) : clamp(((t % dur) / dur) * 1.5, 0, 1);
        const size = w * (word.length > 5 ? 0.2 : 0.28);
        c.font = `${size}px "Instrument Serif", serif`;
        const m = c.measureText("x"), cap = c.measureText("H");
        const base = h * 0.6, xh = base - m.actualBoundingBoxAscent, ch = base - cap.actualBoundingBoxAscent;
        c.lineWidth = 1;
        const guide = (y, label, col) => { c.strokeStyle = col; c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); c.fillStyle = col; c.font = `10px "IBM Plex Mono", monospace`; c.textAlign = "left"; c.fillText(label, 8, y - 5); };
        guide(ch, "CAP HEIGHT", "rgba(27,26,23,.3)"); guide(xh, "X-HEIGHT", "rgba(27,26,23,.3)"); guide(base, "BASELINE", RED);
        c.font = `${size}px "Instrument Serif", serif`; c.textAlign = "center"; c.textBaseline = "alphabetic";
        const len = size * 3.2;
        c.setLineDash([len * prog, len]); c.strokeStyle = INK; c.lineWidth = 1.4; c.strokeText(word, w / 2, base); c.setLineDash([]);
        if (prog > 0.85) { c.globalAlpha = (prog - 0.85) / 0.15; c.fillStyle = INK; c.fillText(word, w / 2, base); c.globalAlpha = 1; }
        c.font = `11px "IBM Plex Mono", monospace`; c.fillStyle = "rgba(27,26,23,.55)";
        c.fillText(["from linea, a linen thread", "cloth woven from flax", "a line of descent", "the line around a thing"][idx], w / 2, h * 0.84);
      }
    },

    // 09 Repeat: Truchet tiles. One quarter-circle, turned, makes a pattern.
    repeat: {
      init(s) { s.n = 7; s.cell = s.w / s.n; s.rot = Array.from({ length: s.n * s.n }, () => (Math.random() < 0.5 ? 0 : 1)); s.cur = s.rot.map((r) => r); s.last = -1; s.next = 0; },
      frame(s, c, t) {
        const { n, cell, p } = s;
        if (p.in) { const i = Math.floor(p.x / cell) + Math.floor(p.y / cell) * n; if (i !== s.last && i >= 0 && i < n * n) { s.rot[i] ^= 1; s.last = i; } }
        else if (t > s.next) { s.rot[Math.floor(rnd(n * n))] ^= 1; s.next = t + 380; }
        c.strokeStyle = INK; c.lineWidth = Math.max(2, cell * 0.08); c.lineCap = "butt";
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
          const k = i + j * n; s.cur[k] += (s.rot[k] - s.cur[k]) * 0.15;
          c.save(); c.translate(i * cell + cell / 2, j * cell + cell / 2); c.rotate(s.cur[k] * Math.PI / 2); c.translate(-cell / 2, -cell / 2);
          c.beginPath(); c.arc(0, 0, cell / 2, 0, Math.PI / 2); c.stroke();
          c.beginPath(); c.arc(cell, cell, cell / 2, Math.PI, Math.PI * 1.5); c.stroke();
          c.restore();
        }
        if (p.in) { const i = Math.floor(p.x / cell), j = Math.floor(p.y / cell); c.strokeStyle = RED; c.lineWidth = 1.5; c.strokeRect(i * cell + 1, j * cell + 1, cell - 2, cell - 2); }
      }
    },

    // 10 Become: one line takes four jobs from the 2021 sheet: given line, python, bridge, Baldy Lock.
    become: {
      bg: PAGE,
      init(s) { s.N = 160; s.pos = 0; },
      frame(s, c, t) {
        const { w, h, p, N } = s, cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.3, X0 = w * 0.18, X1 = w * 0.82;
        const cycle = (t / 2600) % 4, k = Math.floor(cycle), f = cycle - k;
        const auto = k + (f < 0.55 ? 0 : ease((f - 0.55) / 0.45));
        const goal = p.in ? clamp((p.x / w) * 3.4 - 0.2, 0, 3) : auto;
        s.pos += ((p.in ? goal : auto) - s.pos) * (p.in ? 0.12 : 1);
        if (!p.in && s.pos > 3.999) s.pos = 0;
        const forms = [
          (u) => [X0 + u * (X1 - X0), cy + Math.sin(u * Math.PI * 1.6 + 0.4) * h * 0.08],
          (u) => [X0 + u * (X1 - X0), cy + Math.sin(u * Math.PI * 4.2) * h * 0.2 * (0.35 + 0.65 * u) + Math.sin(t * 0.003 + u * 9) * 3],
          (u) => [X0 + u * (X1 - X0), cy - h * 0.06],
          (u) => { const a = Math.PI + u * Math.PI * 2; return [cx + Math.cos(a) * R * 0.92, cy + h * 0.06 + Math.sin(a) * R]; }
        ];
        const i0 = Math.floor(s.pos) % 4, i1 = (i0 + 1) % 4, m = ease(s.pos - Math.floor(s.pos));
        c.strokeStyle = RED; c.lineWidth = 3; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath();
        for (let i = 0; i < N; i++) { const u = i / (N - 1), A = forms[i0](u), B = forms[i1](u), x = A[0] + (B[0] - A[0]) * m, y = A[1] + (B[1] - A[1]) * m; i ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke();
        // What the pencil adds around the line, faded by how close we are to each form.
        const near = (j) => { const d = ((s.pos - j) % 4 + 4) % 4; return clamp(1 - Math.min(d, 4 - d) * 2.2, 0, 1); };
        c.strokeStyle = INK; c.fillStyle = INK; c.lineWidth = 1.3;
        let a = near(1); if (a > 0) { c.globalAlpha = a; const [hx, hy] = forms[1](1), z = Math.max(14, w * 0.022); c.beginPath(); c.ellipse(hx + z * 0.9, hy, z * 1.3, z, 0, 0, 7); c.stroke(); for (const d of [-0.4, 0.4]) { c.beginPath(); c.ellipse(hx + z * 1.2, hy + d * z, z * 0.3, z * 0.36, 0, 0, 7); c.stroke(); c.beginPath(); c.arc(hx + z * 1.28, hy + d * z, z * 0.12, 0, 7); c.fill(); } }
        a = near(2); if (a > 0) { c.globalAlpha = a; const y2 = cy + h * 0.06; c.beginPath(); c.moveTo(X0, y2); c.lineTo(X1, y2); for (let x = X0; x <= X1; x += 14) { c.moveTo(x, cy - h * 0.06); c.lineTo(x, y2); } c.stroke();
          for (let x = X0 + 30; x < X1; x += 80) { c.beginPath(); c.moveTo(x, y2 + h * 0.2); c.bezierCurveTo(x + 20, y2 + h * 0.14, x + 40, y2 + h * 0.26, x + 60, y2 + h * 0.2); c.stroke(); } }
        a = near(3); if (a > 0) { c.globalAlpha = a; const hy = cy + h * 0.06, top = hy - R;
          for (const [dx, cv] of [[-R * 0.28, -1], [0, 1], [R * 0.28, 1]]) { c.beginPath(); c.moveTo(cx + dx, top + 2); c.bezierCurveTo(cx + dx - 6, top - R * 0.3, cx + dx + cv * 18, top - R * 0.45, cx + dx + cv * 10, top - R * 0.35); c.stroke(); }
          for (const dx of [-R * 0.3, R * 0.3]) { c.beginPath(); c.arc(cx + dx, hy - R * 0.08, 3, 0, 7); c.fill(); }
          c.beginPath(); c.arc(cx, hy + R * 0.38, R * 0.14, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
        c.globalAlpha = 1;
        const names = ["the given line", "a python", "a bridge", "Baldy Lock"], lab = names[Math.round(s.pos) % 4];
        c.fillStyle = INK; c.font = `italic ${Math.max(22, w * 0.03)}px "Instrument Serif", serif`; c.textAlign = "center"; c.fillText(lab, cx, h - 24);
      }
    },

    // 11 Your turn: a random given line in red; the viewer draws around it in pencil.
    test: {
      bg: "#fbf9f4",
      init(s) { s.strokes = s.strokes || []; if (!s.given) s.given = makeGiven(); s.dirty = true; },
      move(s) {
        const { w, h, p } = s;
        if (!s.cur) { s.cur = []; s.strokes.push(s.cur); }
        const last = s.cur[s.cur.length - 1], sp = last ? Math.hypot(p.x - last[0] * w, p.y - last[1] * h) : 0;
        if (!last || sp > 1.5) { s.cur.push([p.x / w, p.y / h, clamp(2.6 - sp * 0.06, 0.9, 2.6)]); s.dirty = true; }
      },
      up(s) { s.cur = null; },
      frame(s, c) {
        const { w, h } = s;
        if (!s.dirty) return;
        s.dirty = false;
        paintTest(s, c, w, h);
      },
      keep: true
    }
  };

  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);

  // Given lines in the spirit of the 2021 sheet: a U, a branch, two rails, a loop, a bent arm, a horizon.
  function makeGiven() {
    const r = (a, b) => a + Math.random() * (b - a), kinds = [
      () => { const x = r(0.35, 0.55), y = r(0.25, 0.35); return [[[x, y], [x + 0.01, y + 0.3], [x + 0.08, y + 0.45], [x + 0.16, y + 0.3], [x + 0.18, y - 0.08]]]; },
      () => { const x = r(0.4, 0.6); return [[[x, 0.95], [x, 0.6], [x + 0.03, 0.4], [x + 0.1, 0.3]], [[x, 0.6], [x + 0.06, 0.52], [x + 0.2, 0.5]]]; },
      () => { const x = r(0.2, 0.7); return [[[x, 0.1], [x + 0.01, 0.5], [x + 0.03, 0.92]], [[x + 0.06, 0.1], [x + 0.07, 0.5], [x + 0.1, 0.92]]]; },
      () => { const x = r(0.35, 0.6), y = r(0.35, 0.5), R = r(0.1, 0.16); return [Array.from({ length: 13 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return [x + Math.cos(a) * R * 0.75 * (1 + 0.08 * Math.sin(a * 3)), y + Math.sin(a) * R * 1.2]; })]; },
      () => { const x = r(0.25, 0.45); return [[[x, 0.8], [x + 0.06, 0.55], [x + 0.08, 0.3], [x + 0.14, 0.18], [x + 0.22, 0.16]]]; },
      () => { const y = r(0.25, 0.45); return [[[0.08, y], [0.25, y + 0.03], [0.4, y - 0.06], [0.6, y - 0.02], [0.78, y - 0.1], [0.92, y - 0.08]]]; }
    ];
    return kinds[Math.floor(Math.random() * kinds.length)]();
  }
  function smooth(c, pts, w, h) {
    const P = pts.map(([x, y]) => [x * w, y * h]); c.moveTo(P[0][0], P[0][1]);
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      c.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
  }
  function paintTest(s, c, w, h) {
    c.fillStyle = "#fbf9f4"; c.fillRect(0, 0, w, h);
    c.strokeStyle = "rgba(27,26,23,.35)"; c.lineWidth = 1.5; c.strokeRect(10, 10, w - 20, h - 20);
    c.lineCap = "round"; c.lineJoin = "round";
    c.strokeStyle = "rgba(40,38,34,.9)";
    for (const st of s.strokes) for (let i = 1; i < st.length; i++) { c.lineWidth = st[i][2]; c.beginPath(); c.moveTo(st[i - 1][0] * w, st[i - 1][1] * h); c.lineTo(st[i][0] * w, st[i][1] * h); c.stroke(); }
    c.strokeStyle = RED; c.lineWidth = 4; c.beginPath(); s.given.forEach((g) => smooth(c, g, w, h)); c.stroke();
    if (!s.strokes.length) { c.fillStyle = "rgba(27,26,23,.4)"; c.font = `12px "IBM Plex Mono", monospace`; c.textAlign = "center"; c.fillText("DRAW AROUND THE RED LINE", w / 2, h - 28); }
  }

  /* ---------- runtime ---------- */
  const stages = [];
  document.querySelectorAll("canvas[data-plate]").forEach((cv) => {
    const def = PLATES[cv.dataset.plate]; if (!def) return;
    const s = { cv, def, c: cv.getContext("2d"), p: { x: 0, y: 0, in: false, down: false, px: null, py: null }, vis: false };
    const size = () => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      if (!r.width || (s.w === r.width && s.h === r.height)) return;
      s.w = r.width; s.h = r.height; cv.width = r.width * dpr; cv.height = r.height * dpr;
      s.c.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.c.fillStyle = def.bg || PAPER; s.c.fillRect(0, 0, s.w, s.h);
      def.init && def.init(s);
    };
    s.size = size;
    const pos = (e) => { const r = cv.getBoundingClientRect(); s.p.px = s.p.in ? s.p.x : null; s.p.py = s.p.in ? s.p.y : null; s.p.x = e.clientX - r.left; s.p.y = e.clientY - r.top; s.p.in = true; s.p.touch = e.pointerType === "touch"; };
    cv.addEventListener("pointermove", (e) => { pos(e); if (s.p.down && def.move) def.move(s); });
    cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); s.p.in = false; pos(e); s.p.down = true; s.p.px = null; def.move && def.move(s); });
    const up = () => { s.p.down = false; s.p.px = null; def.up && def.up(s); };
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("pointerleave", () => { if (!s.p.down) { s.p.in = false; s.p.px = null; def.leave && def.leave(s); } });
    let lastTap = 0;
    cv.addEventListener("pointerdown", () => { const n = performance.now(); if (n - lastTap < 320 && def.dbl) def.dbl(s, s.c); lastTap = n; });
    stages.push(s);
  });

  const io = new IntersectionObserver((es) => es.forEach((e) => { const s = stages.find((x) => x.cv === e.target); if (s) s.vis = e.isIntersecting; }), { rootMargin: "100px" });
  stages.forEach((s) => io.observe(s.cv));
  const resize = () => stages.forEach((s) => s.size());
  addEventListener("resize", resize);

  const draw = (s, t) => {
    const { c, def } = s;
    if (!def.keep) { c.fillStyle = def.bg || PAPER; c.fillRect(0, 0, s.w, s.h); }
    c.save(); def.frame(s, c, t); c.restore();
  };
  const tick = (t) => {
    stages.forEach((s) => { if (s.vis && s.w) draw(s, t); if (s.p.in) { s.p.px = s.p.x; s.p.py = s.p.y; } });
    if (!still) requestAnimationFrame(tick);
  };
  const start = () => {
    resize();
    if (still) { stages.forEach((s) => { if (!s.w) return; for (let i = 0; i < (s.def.keep ? 900 : 1); i++) draw(s, 2000 + i * 16); }); }
    requestAnimationFrame(tick);
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(start);

  // Your turn: tools.
  const pad = stages.find((x) => x.cv.dataset.plate === "test");
  document.querySelectorAll(".tools button").forEach((b) => b.addEventListener("click", () => {
    if (!pad) return;
    const act = b.dataset.act;
    if (act === "new") { pad.given = makeGiven(); pad.strokes = []; }
    if (act === "undo") pad.strokes.pop();
    if (act === "clear") pad.strokes = [];
    if (act === "save") {
      const a = document.createElement("a"); a.download = "my-line.png"; a.href = pad.cv.toDataURL("image/png"); a.click();
    }
    pad.dirty = true;
  }));

  // Scenes: the given line draws itself in red; the slider brings the drawing up around it.
  document.querySelectorAll(".reveal").forEach((el) => {
    const svg = el.querySelector("svg"), img = el.querySelector("img"), range = el.querySelector("input");
    const ns = "http://www.w3.org/2000/svg";
    el.dataset.lines.split("|").forEach((seg) => {
      const pts = seg.trim().split(" ").map((q) => q.split(",").map(Number));
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
      }
      const path = document.createElementNS(ns, "path"); path.setAttribute("d", d); path.setAttribute("pathLength", "1"); svg.appendChild(path);
    });
    const set = (v) => { el.style.setProperty("--r", v / 100); range.value = v; };
    range.addEventListener("input", () => { el.dataset.touched = 1; set(+range.value); });
    set(0);
    new IntersectionObserver((es, o) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      o.disconnect(); el.classList.add("drawn");
      if (still) { set(100); return; }
      // After the line has drawn, bring the pencil in once, unless the viewer already took the slider.
      setTimeout(() => {
        if (el.dataset.touched) return;
        const t0 = performance.now(), run = (n) => { if (el.dataset.touched) return; const k = Math.min(1, (n - t0) / 1600); set(Math.round(ease(k) * 100)); if (k < 1) requestAnimationFrame(run); };
        requestAnimationFrame(run);
      }, 1900);
    }), { threshold: 0.5 }).observe(el);
  });

  // Hook for exporting stills: window.__line.render("shade", 3000) returns a PNG data URL of that plate.
  const byName = (name) => stages.find((s) => s.cv.dataset.plate === name);
  window.__line = {
    stages,
    png: (name) => byName(name)?.cv.toDataURL("image/png"),
    // Render a plate for n frames starting at time t (ms), without waiting for animation frames.
    render: (name, t, n = 1) => { const s = byName(name); s.size(); for (let i = 0; i < n; i++) draw(s, t + i * 16); return s.cv.toDataURL("image/png"); }
  };
})();
