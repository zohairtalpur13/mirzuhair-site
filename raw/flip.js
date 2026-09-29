/* “RAW” — a magazine on the table. Drag (or tap, or use the arrows) to turn its pages;
   each leaf bends like paper as it turns, and a camera flash follows the cursor. */
(function () {
  const NX = 48;             // segments across a page (the direction it bends)
  const NY = 16;             // segments down a page
  const CURL = 1.15;         // how far a page lags behind its spine while turning
  const LEAD = 0.35;         // the top corner leads the turn, like a thumb lifting it
  const STACK = 0.9;         // px between stacked leaves
  const TILT = 0.5;          // the magazine lies back on the table (radians)
  const CAMERA_DISTANCE = 2600;
  const TURN_MS = 620;
  const INTRO_DELAY_MS = 1100;

  const VERT = [
    "attribute vec3 aPos; attribute vec3 aNor; attribute vec2 aUv;",
    "uniform mat3 uRot; uniform vec3 uT; uniform vec2 uHalf; uniform float uD;",
    "varying vec2 vUv; varying vec3 vN;",
    "void main(){",
    "  vec3 p = uRot * (aPos + uT);",
    "  vN = uRot * aNor; vUv = aUv;",
    "  float w = uD - p.z;",
    "  gl_Position = vec4(p.x * uD / uHalf.x, p.y * uD / uHalf.y, (-p.z / 4000.0) * w, w);",
    "}"
  ].join("\n");

  const FRAG = [
    "precision mediump float;",
    "uniform sampler2D uFront; uniform sampler2D uBack;",
    "uniform vec2 uFlash; uniform float uFlashR; uniform float uFlashOn;",
    "varying vec2 vUv; varying vec3 vN;",
    "void main(){",
    "  vec3 n = normalize(vN);",
    "  vec3 base;",
    "  if (gl_FrontFacing) { base = texture2D(uFront, vUv).rgb; }",
    "  else { base = texture2D(uBack, vec2(1.0 - vUv.x, vUv.y)).rgb; n = -n; }",
    "  vec3 L = normalize(vec3(-0.3, 0.5, 0.8));",
    "  float shade = 0.35 + 0.65 * max(dot(n, L), 0.0) / L.z;",
    "  float gutter = 0.55 + 0.45 * smoothstep(0.0, 0.07, vUv.x);",
    "  float d = distance(gl_FragCoord.xy, uFlash) / uFlashR;",
    "  float flash = uFlashOn * exp(-d * d) * 0.55;",
    "  gl_FragColor = vec4(base * shade * gutter + flash * (0.35 + 0.65 * base), 1.0);",
    "}"
  ].join("\n");

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error("RAW shader: " + gl.getShaderInfoLog(s));
    return s;
  }

  function program(gl) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error("RAW program: " + gl.getProgramInfoLog(p));
    return p;
  }

  function texture(gl, canvas) {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  const clamp01 = function (t) { return Math.min(1, Math.max(0, t)); };
  const ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  /* One leaf: static index/uv buffers, dynamic positions and normals. */
  function makeLeaf(gl, front, back) {
    const cols = NX + 1;
    const rows = NY + 1;
    const uv = new Float32Array(cols * rows * 2);
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        uv[(j * cols + i) * 2] = i / NX;
        uv[(j * cols + i) * 2 + 1] = j / NY;
      }
    }
    const idx = new Uint16Array(NX * NY * 6);
    let o = 0;
    for (let j = 0; j < NY; j++) {
      for (let i = 0; i < NX; i++) {
        const a = j * cols + i;
        idx[o++] = a; idx[o++] = a + 1; idx[o++] = a + cols + 1;
        idx[o++] = a; idx[o++] = a + cols + 1; idx[o++] = a + cols;
      }
    }
    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    return {
      front: front, back: back, uvBuf: uvBuf, idxBuf: idxBuf, count: idx.length,
      pos: new Float32Array(cols * rows * 3), nor: new Float32Array(cols * rows * 3),
      posBuf: gl.createBuffer(), norBuf: gl.createBuffer()
    };
  }

  /* Bend a leaf for turn amount t (0 = lying right of the spine, 1 = lying left). */
  function shapeLeaf(gl, leaf, t, w, h, z) {
    const cols = NX + 1;
    const dx = w / NX;
    const lift = Math.sin(Math.PI * t);
    for (let j = 0; j <= NY; j++) {
      const vy = j / NY;
      const y = (vy - 0.5) * h;
      const lead = (vy - 0.5) * LEAD * lift;
      let x = 0;
      let zz = z;
      for (let i = 0; i <= NX; i++) {
        const u = i / NX;
        const a = Math.min(Math.PI, Math.max(0, Math.PI * t - CURL * lift * Math.pow(u, 1.4) + lead * u));
        const n = (j * cols + i) * 3;
        leaf.pos[n] = x;
        leaf.pos[n + 1] = y;
        leaf.pos[n + 2] = zz;
        leaf.nor[n] = -Math.sin(a);
        leaf.nor[n + 1] = 0;
        leaf.nor[n + 2] = Math.cos(a);
        x += dx * Math.cos(a);
        zz += dx * Math.sin(a);
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, leaf.posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, leaf.pos, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, leaf.norBuf);
    gl.bufferData(gl.ARRAY_BUFFER, leaf.nor, gl.DYNAMIC_DRAW);
  }

  function rotation(rx, ry) {
    const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
    // R = Ry * Rx, column-major for GLSL
    return new Float32Array([cy, 0, -sy, sy * sx, cx, cy * sx, sy * cx, -sx, cy * cx]);
  }

  function mount(stage, canvas, pages, ui) {
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
    if (!gl) return false;
    const prog = program(gl);
    const loc = {};
    ["aPos", "aNor", "aUv"].forEach(function (n) { loc[n] = gl.getAttribLocation(prog, n); });
    ["uRot", "uT", "uHalf", "uD", "uFront", "uBack", "uFlash", "uFlashR", "uFlashOn"].forEach(function (n) {
      loc[n] = gl.getUniformLocation(prog, n);
    });

    const tex = pages.map(function (c) { return texture(gl, c); });
    const leaves = [];
    for (let k = 0; k < tex.length; k += 2) leaves.push(makeLeaf(gl, tex[k], tex[k + 1] || tex[k]));
    const L = leaves.length;
    const turnT = leaves.map(function () { return 0; });

    let size = { w: 1, h: 1, cw: 1, ch: 1, dpr: 1 };
    let turned = 0;           // leaves lying on the left
    let active = null;        // { k, from, to, start } while animating, { k, drag, base } while dragging
    let pointer = { x: 0.5, y: 0.5, inside: false };
    const tilt = { x: 0, y: 0 };
    let visible = true;
    let downX = null;

    function resize() {
      const r = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const w = Math.min(r.width * 0.44, (r.height * 0.86) / RawPages.RATIO);
      size = { w: w, h: w * RawPages.RATIO, cw: r.width, ch: r.height, dpr: dpr };
    }

    function settle(k, to) {
      active = { k: k, from: turnT[k], to: to, start: performance.now() };
    }

    function next() {
      if (active || turned >= L) return;
      settle(turned, 1);
    }

    function prev() {
      if (active || turned <= 0) return;
      settle(turned - 1, 0);
    }

    function report() {
      if (!ui.status) return;
      const house = RawPages.HOUSES[turned - 1];
      let label = "Cover";
      if (turned >= L) label = "Back cover";
      else if (house) label = "Spread " + turned + " of " + (L - 1) + " — " + house.name + ", " + house.after;
      ui.status.textContent = label;
      if (ui.prev) ui.prev.disabled = turned <= 0;
      if (ui.next) ui.next.disabled = turned >= L;
    }

    function step(now) {
      if (!active || active.drag) return;
      const p = clamp01((now - active.start) / TURN_MS);
      turnT[active.k] = active.from + (active.to - active.from) * ease(p);
      if (p < 1) return;
      turned = active.to === 1 ? Math.max(turned, active.k + 1) : Math.min(turned, active.k);
      active = null;
      report();
    }

    /* How far through the magazine we are, counting the moving leaf by its turn amount. */
    function position(moving) {
      let e = moving >= 0 ? turnT[moving] : 0;
      for (let k = 0; k < L; k++) if (k !== moving && k < turned) e += 1;
      return e;
    }

    function drawLeaf(leaf, t, z) {
      shapeLeaf(gl, leaf, t, size.w, size.h, z);
      gl.bindBuffer(gl.ARRAY_BUFFER, leaf.posBuf);
      gl.enableVertexAttribArray(loc.aPos);
      gl.vertexAttribPointer(loc.aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, leaf.norBuf);
      gl.enableVertexAttribArray(loc.aNor);
      gl.vertexAttribPointer(loc.aNor, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, leaf.uvBuf);
      gl.enableVertexAttribArray(loc.aUv);
      gl.vertexAttribPointer(loc.aUv, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, leaf.front);
      gl.uniform1i(loc.uFront, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, leaf.back);
      gl.uniform1i(loc.uBack, 1);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, leaf.idxBuf);
      gl.drawElements(gl.TRIANGLES, leaf.count, gl.UNSIGNED_SHORT, 0);
    }

    function draw(now) {
      requestAnimationFrame(draw);
      if (!visible) return;
      step(now);
      tilt.x += ((pointer.inside ? (pointer.y - 0.5) * 0.12 : 0) - tilt.x) * 0.06;
      tilt.y += ((pointer.inside ? (pointer.x - 0.5) * 0.16 : 0) - tilt.y) * 0.06;

      const moving = active ? active.k : -1;
      const e = position(moving);
      // a closed magazine sits right of the spine, a finished one left of it; keep it centred
      const shift = -size.w * 0.5 * (1 - Math.min(e, 1)) + size.w * 0.5 * clamp01(e - (L - 1));

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.useProgram(prog);
      gl.uniformMatrix3fv(loc.uRot, false, rotation(-TILT + tilt.x, tilt.y));
      gl.uniform3f(loc.uT, shift, 0, 0);
      gl.uniform2f(loc.uHalf, size.cw / 2, size.ch / 2);
      gl.uniform1f(loc.uD, CAMERA_DISTANCE);
      gl.uniform2f(loc.uFlash, pointer.x * canvas.width, (1 - pointer.y) * canvas.height);
      gl.uniform1f(loc.uFlashR, 170 * size.dpr);
      gl.uniform1f(loc.uFlashOn, pointer.inside ? 1 : 0);

      for (let k = 0; k < L; k++) {
        if (k === moving) continue;
        const left = k < turned;
        drawLeaf(leaves[k], left ? 1 : 0, left ? k * STACK : (L - k) * STACK);
      }
      if (moving >= 0) drawLeaf(leaves[moving], turnT[moving], (L + 2) * STACK);
    }

    /* Drag a page from the right to turn forward, from the left to turn back; a tap turns it. */
    canvas.addEventListener("pointerdown", function (e) {
      if (active) return;
      const r = canvas.getBoundingClientRect();
      const right = e.clientX - r.left > r.width / 2;
      const k = right ? turned : turned - 1;
      if (k < 0 || k >= L) return;
      downX = e.clientX;
      active = { k: k, drag: true, base: right ? 0 : 1 };
      turnT[k] = active.base;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", function (e) {
      const r = canvas.getBoundingClientRect();
      pointer = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, inside: true };
      if (!active || !active.drag || downX === null) return;
      turnT[active.k] = clamp01(active.base + (downX - e.clientX) / (size.w * 1.6));
    });
    function release(e) {
      if (!active || !active.drag) return;
      const k = active.k;
      const tapped = Math.abs(e.clientX - downX) < 6;
      const to = tapped ? (active.base ? 0 : 1) : (turnT[k] > 0.5 ? 1 : 0);
      downX = null;
      active = null;
      settle(k, to);
    }
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);
    canvas.addEventListener("pointerleave", function () { pointer.inside = false; });
    stage.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { next(); e.preventDefault(); }
      if (e.key === "ArrowLeft") { prev(); e.preventDefault(); }
    });
    if (ui.next) ui.next.addEventListener("click", next);
    if (ui.prev) ui.prev.addEventListener("click", prev);

    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(stage);
    window.addEventListener("resize", resize);
    resize();
    report();
    requestAnimationFrame(draw);
    // open the cover once, so the gesture explains itself
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setTimeout(next, INTRO_DELAY_MS);
    return true;
  }

  window.RawFlip = { mount: mount };
})();
