/* Open House — the interactive parts of the case study.
   Four toys, each built on a rule from the identity:
   light   — an arch of jali sunlight that follows the cursor across the poster
   lattice — draw on the 5 × 7 grid and watch the doorway rule cut the corners
   tester  — type anything in Jharoka, in the Haveli at Dusk palette
   ticket  — make and download your own Open House ticket */
(() => {
  const OH_G = {"A":["01110","11011","11011","11111","11011","11011","11011"],"B":["11110","11011","11011","11110","11011","11011","11110"],"C":["01111","11000","11000","11000","11000","11000","01111"],"D":["11110","11011","11011","11011","11011","11011","11110"],"E":["11111","11000","11000","11110","11000","11000","11111"],"F":["11111","11000","11000","11110","11000","11000","11000"],"G":["01111","11000","11000","11011","11011","11011","01111"],"H":["11011","11011","11011","11111","11011","11011","11011"],"I":["11111","00100","00100","00100","00100","00100","11111"],"J":["00011","00011","00011","00011","00011","11011","01110"],"K":["11011","11011","11110","11100","11110","11011","11011"],"L":["11000","11000","11000","11000","11000","11000","11111"],"M":["10001","11011","11111","11111","10101","10001","10001"],"N":["10001","11001","11101","11111","10111","10011","10001"],"O":["01110","11011","11011","11011","11011","11011","01110"],"P":["11110","11011","11011","11110","11000","11000","11000"],"Q":["01110","11011","11011","11011","11011","11110","01111"],"R":["11110","11011","11011","11110","11110","11011","11011"],"S":["01111","11000","11000","01110","00011","00011","11110"],"T":["11111","00100","00100","00100","00100","00100","00100"],"U":["11011","11011","11011","11011","11011","11011","01110"],"V":["11011","11011","11011","11011","11011","01110","00100"],"W":["10001","10001","10001","10101","11111","11011","10001"],"X":["11011","11011","01110","00100","01110","11011","11011"],"Y":["11011","11011","11011","01110","00100","00100","00100"],"Z":["11111","00011","00110","01100","11000","11000","11111"],"0":["01110","11011","11011","11011","11011","11011","01110"],"1":["00110","01110","00110","00110","00110","00110","01111"],"2":["11110","00011","00011","01110","11000","11000","11111"],"3":["11110","00011","00011","01110","00011","00011","11110"],"4":["11011","11011","11011","11111","00011","00011","00011"],"5":["11111","11000","11000","11110","00011","00011","11110"],"6":["01110","11000","11000","11110","11011","11011","01110"],"7":["11111","00011","00011","00110","00110","01100","01100"],"8":["01110","11011","11011","01110","11011","11011","01110"],"9":["01110","11011","11011","01111","00011","00011","01110"]};
  const COLS = 5, ROWS = 7, CELL = 100, GAP = 16, CUT = 0.42;
  const PAL = { green: "#134238", lime: "#EFE6D6", brass: "#D6A13C", kirm: "#7A1C2A", teak: "#2A1A12" };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* the same two rules as the font: one tile per cell, convex corners cut like the doorway */
  function tiles(g) {
    const on = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS && g[r][c];
    const out = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (!on(r, c)) continue;
      const x0 = c * CELL + GAP / 2, x1 = (c + 1) * CELL - GAP / 2, y0 = r * CELL + GAP / 2, y1 = (r + 1) * CELL - GAP / 2, k = (x1 - x0) * CUT;
      const up = on(r - 1, c), dn = on(r + 1, c), lf = on(r, c - 1), rt = on(r, c + 1);
      const tl = !up && !lf, tr = !up && !rt, br = !dn && !rt, bl = !dn && !lf;
      const p = [];
      tl ? p.push([x0, y0 + k], [x0 + k, y0]) : p.push([x0, y0]);
      tr ? p.push([x1 - k, y0], [x1, y0 + k]) : p.push([x1, y0]);
      br ? p.push([x1, y1 - k], [x1 - k, y1]) : p.push([x1, y1]);
      bl ? p.push([x0 + k, y1], [x0, y1 - k]) : p.push([x0, y1]);
      out.push({ r, c, pts: p, cut: tl || tr || br || bl });
    }
    return out;
  }
  const toGrid = (rows) => rows.map((s) => [...s].map((v) => v === "1"));
  const empty = () => Array.from({ length: ROWS }, () => Array(COLS).fill(false));

  /* ---------------------------------------------------------------- light */
  function mountLight(el) {
    const beam = el.querySelector(".oh-beam");
    let tx = .62, ty = .34, x = tx, y = ty, active = false, t0 = performance.now(), raf = 0;
    const place = () => {
      const r = el.getBoundingClientRect(), w = r.width * .5, h = r.height * .52;
      beam.style.setProperty("--mx", (x * r.width - w / 2).toFixed(1) + "px");
      beam.style.setProperty("--my", (y * r.height - h / 2).toFixed(1) + "px");
      beam.style.setProperty("--mw", w.toFixed(1) + "px");
      beam.style.setProperty("--mh", h.toFixed(1) + "px");
    };
    const loop = (t) => {
      if (!el.isConnected) return;
      if (!active && !reduce) { const s = (t - t0) / 1000; tx = .5 + Math.sin(s * .35) * .22; ty = .42 + Math.cos(s * .27) * .16; }
      x += (tx - x) * .12; y += (ty - y) * .12;
      place();
      raf = requestAnimationFrame(loop);
    };
    const move = (e) => { const r = el.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; active = true; el.classList.add("on"); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", move);
    el.addEventListener("pointerleave", () => { active = false; t0 = performance.now() - 2000; el.classList.remove("on"); });
    if (reduce) place(); else raf = requestAnimationFrame(loop);
  }

  /* ---------------------------------------------------------------- lattice */
  function mountLattice(el) {
    const svg = el.querySelector("svg"), stat = el.querySelector(".oh-lat-stat"), keys = el.querySelector(".oh-keys");
    let grid = toGrid(OH_G.H), prev = empty(), paint = null, showCut = true;
    const NS = "http://www.w3.org/2000/svg";
    keys.innerHTML = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"].map((k) => `<button type="button" data-k="${k}">${k}</button>`).join("");
    function match() {
      for (const [k, rows] of Object.entries(OH_G)) if (rows.every((s, r) => [...s].every((v, c) => (v === "1") === grid[r][c]))) return k;
      return null;
    }
    function draw(stagger) {
      svg.querySelectorAll(".t").forEach((n) => n.remove());
      const ts = tiles(grid);
      ts.forEach((t, i) => {
        const p = document.createElementNS(NS, "polygon");
        p.setAttribute("points", t.pts.map((q) => q.join(",")).join(" "));
        p.setAttribute("class", "t" + (t.cut && showCut ? " cut" : "") + ((stagger || !prev[t.r][t.c]) && !reduce ? " pop" : ""));
        p.style.setProperty("--i", stagger ? i : 0);
        svg.appendChild(p);
      });
      prev = grid.map((r) => r.slice());
      const cuts = ts.filter((t) => t.cut).length, m = match();
      stat.innerHTML = `<b>${ts.length}</b> tiles · <b>${cuts}</b> cut like the doorway${m ? ` · <em>that's a ${m}!</em>` : ""}`;
      keys.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.k === m));
    }
    const cellAt = (e) => {
      const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      const q = pt.matrixTransform(svg.getScreenCTM().inverse());
      const c = Math.floor(q.x / CELL), r = Math.floor(q.y / CELL);
      return r >= 0 && r < ROWS && c >= 0 && c < COLS ? [r, c] : null;
    };
    svg.addEventListener("pointerdown", (e) => {
      const rc = cellAt(e); if (!rc) return;
      e.preventDefault(); svg.setPointerCapture(e.pointerId);
      paint = !grid[rc[0]][rc[1]]; grid[rc[0]][rc[1]] = paint; draw(false);
    });
    svg.addEventListener("pointermove", (e) => {
      if (paint === null) return;
      const rc = cellAt(e); if (!rc || grid[rc[0]][rc[1]] === paint) return;
      grid[rc[0]][rc[1]] = paint; draw(false);
    });
    const stop = () => { paint = null; };
    svg.addEventListener("pointerup", stop); svg.addEventListener("pointercancel", stop);
    keys.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; grid = toGrid(OH_G[b.dataset.k]); prev = empty(); draw(true); });
    el.querySelector("[data-act=clear]").addEventListener("click", () => { grid = empty(); draw(false); });
    el.querySelector("[data-act=invent]").addEventListener("click", () => {
      // a new mirrored glyph: the haveli is symmetrical, so its letters can be too
      grid = empty();
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < 3; c++) { const v = Math.random() < (c === 2 ? .45 : .6); grid[r][c] = v; grid[r][COLS - 1 - c] = v; }
      prev = empty(); draw(true);
    });
    el.querySelector("[data-act=rule]").addEventListener("click", (e) => { showCut = !showCut; e.currentTarget.setAttribute("aria-pressed", showCut); draw(false); });
    // background lattice: the empty cells of the jali
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const b = document.createElementNS(NS, "rect");
      b.setAttribute("x", c * CELL + GAP / 2); b.setAttribute("y", r * CELL + GAP / 2);
      b.setAttribute("width", CELL - GAP); b.setAttribute("height", CELL - GAP); b.setAttribute("class", "g");
      svg.appendChild(b);
    }
    draw(true);
  }

  /* ---------------------------------------------------------------- tester */
  function mountTester(el) {
    const input = el.querySelector("input[type=text]"), size = el.querySelector("input[type=range]"), out = el.querySelector(".oh-out");
    const sync = () => { out.textContent = input.value || " "; out.style.fontSize = size.value + "px"; };
    input.addEventListener("input", sync); size.addEventListener("input", sync);
    el.querySelectorAll("[data-way]").forEach((b) => b.addEventListener("click", () => {
      const [bg, fg] = b.dataset.way.split(",");
      out.style.background = PAL[bg]; out.style.color = PAL[fg];
      el.querySelectorAll("[data-way]").forEach((x) => x.setAttribute("aria-pressed", x === b));
    }));
    sync();
  }

  /* ---------------------------------------------------------------- ticket */
  function mountTicket(el) {
    const cv = el.querySelector("canvas"), ctx = cv.getContext("2d"), input = el.querySelector("input"), dl = el.querySelector("[data-act=download]");
    const W = 2100, H = 820; cv.width = W; cv.height = H;
    const WAYS = { green: ["green", "lime", "brass", "oh-urdu-brass.png"], lime: ["lime", "green", "kirm", "oh-urdu-green.png"], kirm: ["kirm", "lime", "brass", "oh-urdu-brass.png"] };
    let way = "green";
    const imgs = {};
    const load = (src) => imgs[src] || (imgs[src] = new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = "img/" + src; }));
    const num = (s) => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 9973; return String(1000 + (h % 9000)).padStart(4, "0"); };
    const fitSize = (t, font, maxW, max) => { let s = max; ctx.font = `${s}px ${font}`; while (ctx.measureText(t).width > maxW && s > 20) { s -= 4; ctx.font = `${s}px ${font}`; } return s; };
    function arch(x, y, w, fill) { const k = w * CUT, h = w * 1.25; ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(x, y + k); ctx.lineTo(x + k, y); ctx.lineTo(x + w - k, y); ctx.lineTo(x + w, y + k); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fill(); }
    async function draw() {
      await document.fonts.load("100px Jharoka");
      const [g, i, a, u] = WAYS[way].map((k, n) => n < 3 ? PAL[k] : k);
      const name = (input.value || "YOUR NAME").toUpperCase().slice(0, 16), no = num(name), M = 70, stub = 1560;
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = i; ctx.textBaseline = "alphabetic";
      ctx.font = "500 26px Jost, sans-serif";
      ctx.fillText("ADMIT ONE", M, M + 20); ctx.fillText("OPEN HOUSE · HYDERABAD HERITAGE & DESIGN WEEK 2026", M, M + 58);
      const s = fitSize(name, "Jharoka", stub - 2 * M, 230);
      ctx.font = `${s}px Jharoka`; ctx.fillText(name, M - s * .06, 250 + s * .7);
      const ly = 250 + 230 * .7 + 80;
      ctx.fillRect(M, ly, stub - 2 * M, 2);
      ctx.font = "500 30px Jost, sans-serif";
      [["DATE", "12.12.2026"], ["GATE", "Arched door, east"], ["TIME", "10:00 — 18:00"]].forEach(([k, v], n) => { ctx.fillText(k, M + n * 480, ly + 62); ctx.fillText(v, M + n * 480, ly + 104); });
      const ur = await load(u);
      if (ur) { const h = 150, w = ur.width * h / ur.height; ctx.drawImage(ur, stub - M - w, M - 30, w, h); }
      ctx.fillStyle = a; for (let yy = 20; yy < H; yy += 34) { ctx.beginPath(); ctx.arc(stub, yy, 6, 0, Math.PI * 2); ctx.fill(); }
      arch(stub + 70, M, 70, a);
      ctx.fillStyle = i; ctx.font = "500 30px Jost, sans-serif"; ctx.fillText("NO.", stub + 70, M + 180); ctx.fillText(no, stub + 70, M + 222);
      ctx.save(); ctx.translate(W - M, M); ctx.rotate(Math.PI / 2);
      const ss = fitSize(no, "Jharoka", H - 2 * M, 400); ctx.font = `${ss}px Jharoka`; ctx.fillStyle = a; ctx.fillText(no, -ss * .06, 0);
      ctx.restore();
      ctx.fillStyle = i; let bx = stub + 70;
      for (let n = 0; n < 9; n++) { const bw = n % 3 ? 5 : 12; ctx.fillRect(bx, H - M - 150, bw, 150); bx += bw + 8; }
      dl.dataset.no = no;
    }
    input.addEventListener("input", draw);
    el.querySelectorAll("[data-tw]").forEach((b) => b.addEventListener("click", () => { way = b.dataset.tw; el.querySelectorAll("[data-tw]").forEach((x) => x.setAttribute("aria-pressed", x === b)); draw(); }));
    dl.addEventListener("click", () => cv.toBlob((blob) => {
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `open-house-ticket-${dl.dataset.no || "0000"}.png`;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }, "image/png"));
    draw();
  }

  const MOUNT = { light: mountLight, lattice: mountLattice, tester: mountTester, ticket: mountTicket };
  window.OpenHouse = { mount(root) { root.querySelectorAll("[data-oh]").forEach((el) => { if (el.dataset.ohOn) return; el.dataset.ohOn = 1; MOUNT[el.dataset.oh](el); }); } };
})();
