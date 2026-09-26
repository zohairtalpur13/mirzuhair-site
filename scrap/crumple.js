/* SCRAP — WebGL paper that crumples into a ball and unfolds flat, keeping its creases.
   Each sheet is a grid mesh. Creases come from a set of random straight fold lines,
   so the crumpled shape is piecewise flat like real paper. Flat shading shows the folds. */
(function () {
  const GRID_X = 40;
  const GRID_Y = 50;
  const FOLD_COUNT = 26;
  const RESIDUAL_CREASE = 0.07;   // how much crease relief stays once the sheet is flat
  const CAMERA_DISTANCE = 2400;   // px; gives a gentle perspective

  const VERT = [
    "attribute vec3 aPos; attribute vec3 aNor; attribute vec2 aUv;",
    "uniform mat3 uRot; uniform vec3 uT; uniform vec2 uHalf; uniform float uD;",
    "varying vec2 vUv; varying vec3 vN;",
    "void main(){",
    "  vec3 p = uRot * aPos + uT;",
    "  vN = uRot * aNor; vUv = aUv;",
    "  float w = uD - p.z;",
    "  gl_Position = vec4(p.x * uD / uHalf.x, p.y * uD / uHalf.y, (-p.z / 3000.0) * w, w);",
    "}"
  ].join("\n");

  const FRAG = [
    "precision mediump float;",
    "uniform sampler2D uTex; uniform vec3 uBack; uniform float uSeed;",
    "varying vec2 vUv; varying vec3 vN;",
    "float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }",
    "void main(){",
    "  vec3 n = normalize(vN);",
    "  vec3 base;",
    "  if (gl_FrontFacing) { base = texture2D(uTex, vUv).rgb; } else { base = uBack; n = -n; }",
    "  vec3 L = normalize(vec3(-0.45, 0.55, 0.85));",
    "  float d = max(dot(n, L), 0.0);",
    "  float shade = 0.22 + 0.78 * d / L.z;",
    "  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));",
    "  float spec = pow(max(dot(n, H), 0.0), 36.0) * 0.10;",
    "  float grain = (hash(gl_FragCoord.xy + uSeed) - 0.5) * 0.075;",
    "  gl_FragColor = vec4(base * shade + spec + grain, 1.0);",
    "}"
  ].join("\n");

  const SHADOW_VERT = [
    "attribute vec2 aP;",
    "uniform vec2 uC; uniform vec2 uS; uniform float uA; uniform vec2 uHalf;",
    "varying vec2 vP;",
    "void main(){",
    "  vP = aP;",
    "  vec2 q = aP * uS * 1.3;",
    "  vec2 r = vec2(q.x * cos(uA) - q.y * sin(uA), q.x * sin(uA) + q.y * cos(uA));",
    "  gl_Position = vec4((uC + r) / uHalf, 0.999, 1.0);",
    "}"
  ].join("\n");

  const SHADOW_FRAG = [
    "precision mediump float;",
    "uniform float uAlpha; uniform float uRound;",
    "varying vec2 vP;",
    "void main(){",
    "  vec2 q = abs(vP) * 1.3;",
    "  float box = length(max(q - vec2(1.0 - uRound), 0.0)) / uRound;",
    "  gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha * (1.0 - smoothstep(0.0, 1.0, box)));",
    "}"
  ].join("\n");

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error("SCRAP shader: " + gl.getShaderInfoLog(s));
    }
    return s;
  }

  function program(gl, vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw new Error("SCRAP program: " + gl.getProgramInfoLog(p));
    }
    return p;
  }

  function smoothstep(a, b, x) {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  /* Crease field on the unit sheet: sum of clipped tent functions along random lines. */
  function creaseField(seed) {
    const r = window.Scrap.rng(seed);
    const folds = Array.from({ length: FOLD_COUNT }, function () {
      const a = r() * Math.PI;
      return { nx: Math.cos(a), ny: Math.sin(a), off: (r() - 0.5) * 0.9, amp: r() - 0.5, lim: 0.06 + r() * 0.3 };
    });
    const cols = GRID_X + 1;
    const rows = GRID_Y + 1;
    const raw = new Float32Array(cols * rows);
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = i / GRID_X - 0.5;
        const y = j / GRID_Y - 0.5;
        raw[j * cols + i] = folds.reduce(function (z, f) {
          return z + f.amp * Math.min(Math.abs(f.nx * x + f.ny * y - f.off), f.lim);
        }, 0);
      }
    }
    const mean = raw.reduce(function (a, b) { return a + b; }, 0) / raw.length;
    const peak = raw.reduce(function (m, z) { return Math.max(m, Math.abs(z - mean)); }, 1e-6);
    return raw.map(function (z) { return (z - mean) / peak; });
  }

  function createSheet(gl, canvas, seed) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const triVerts = GRID_X * GRID_Y * 6;
    const uv = new Float32Array(triVerts * 2);
    let o = 0;
    for (let j = 0; j < GRID_Y; j++) {
      for (let i = 0; i < GRID_X; i++) {
        for (let k = 0; k < 6; k++) {
          uv[o++] = (i + CORNERS[k][0]) / GRID_X;
          uv[o++] = (j + CORNERS[k][1]) / GRID_Y;
        }
      }
    }
    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);

    return {
      tex: tex,
      crease: creaseField(seed),
      grid: new Float32Array((GRID_X + 1) * (GRID_Y + 1) * 3),
      pos: new Float32Array(triVerts * 3),
      nor: new Float32Array(triVerts * 3),
      posBuf: gl.createBuffer(),
      norBuf: gl.createBuffer(),
      uvBuf: uvBuf,
      count: triVerts,
      lastKey: null
    };
  }

  // two triangles per grid cell, counter-clockwise when viewed from the front
  const CORNERS = [[0, 0], [1, 0], [1, 1], [0, 0], [1, 1], [0, 1]];

  /* Grid vertex positions for crumple amount c (0 flat … 1 ball) at size w×h px. */
  function fillGrid(sheet, c, w, h) {
    const cols = GRID_X + 1;
    const grid = sheet.grid;
    const shrink = 1 - 0.8 * c;
    const relief = w * 0.06 * (RESIDUAL_CREASE + 1.25 * c);
    const ballMix = smoothstep(0.3, 1, c);
    const radius = w * 0.2;
    for (let j = 0; j <= GRID_Y; j++) {
      for (let i = 0; i <= GRID_X; i++) {
        const n = j * cols + i;
        const u = i / GRID_X - 0.5;
        const v = j / GRID_Y - 0.5;
        const cr = sheet.crease[n];
        const fx = u * w * shrink + cr * c * w * 0.04;
        const fy = v * h * shrink - cr * c * w * 0.03;
        const fz = cr * relief;
        const lon = u * Math.PI * 1.7;
        const lat = v * Math.PI * 0.92;
        const rr = radius * (1 + 0.28 * cr);
        const bx = rr * Math.sin(lon) * Math.cos(lat);
        const by = rr * Math.sin(lat);
        const bz = rr * Math.cos(lon) * Math.cos(lat) - radius * 0.35;
        grid[n * 3] = fx + (bx - fx) * ballMix;
        grid[n * 3 + 1] = fy + (by - fy) * ballMix;
        grid[n * 3 + 2] = fz + (bz - fz) * ballMix;
      }
    }
  }

  /* Expand the grid into flat-shaded triangles (one normal per face). */
  function fillTriangles(sheet) {
    const cols = GRID_X + 1;
    const grid = sheet.grid;
    const pos = sheet.pos;
    const nor = sheet.nor;
    const idx = [0, 0, 0];
    let o = 0;
    for (let j = 0; j < GRID_Y; j++) {
      for (let i = 0; i < GRID_X; i++) {
        for (let t = 0; t < 2; t++) {
          for (let k = 0; k < 3; k++) {
            const c = CORNERS[t * 3 + k];
            idx[k] = ((j + c[1]) * cols + (i + c[0])) * 3;
          }
          const ax = grid[idx[1]] - grid[idx[0]], ay = grid[idx[1] + 1] - grid[idx[0] + 1], az = grid[idx[1] + 2] - grid[idx[0] + 2];
          const bx = grid[idx[2]] - grid[idx[0]], by = grid[idx[2] + 1] - grid[idx[0] + 1], bz = grid[idx[2] + 2] - grid[idx[0] + 2];
          let nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
          const len = Math.hypot(nx, ny, nz) || 1;
          nx /= len; ny /= len; nz /= len;
          for (let k = 0; k < 3; k++) {
            pos[o] = grid[idx[k]]; pos[o + 1] = grid[idx[k] + 1]; pos[o + 2] = grid[idx[k] + 2];
            nor[o] = nx; nor[o + 1] = ny; nor[o + 2] = nz;
            o += 3;
          }
        }
      }
    }
  }

  function shapeSheet(gl, sheet, c, w, h) {
    const key = c.toFixed(4) + "|" + w.toFixed(1);
    if (sheet.lastKey === key) return;
    sheet.lastKey = key;
    fillGrid(sheet, c, w, h);
    fillTriangles(sheet);
    gl.bindBuffer(gl.ARRAY_BUFFER, sheet.posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, sheet.pos, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, sheet.norBuf);
    gl.bufferData(gl.ARRAY_BUFFER, sheet.nor, gl.DYNAMIC_DRAW);
  }

  function rotation(rx, ry, rz) {
    const cx = Math.cos(rx), sx = Math.sin(rx);
    const cy = Math.cos(ry), sy = Math.sin(ry);
    const cz = Math.cos(rz), sz = Math.sin(rz);
    // R = Rz * Ry * Rx, column-major for GLSL
    return new Float32Array([
      cz * cy, sz * cy, -sy,
      cz * sy * sx - sz * cx, sz * sy * sx + cz * cx, cy * sx,
      cz * sy * cx + sz * sx, sz * sy * cx - cz * sx, cy * cx
    ]);
  }

  function locations(gl, paperProg, shadowProg) {
    const u = function (p, n) { return gl.getUniformLocation(p, n); };
    return {
      aPos: gl.getAttribLocation(paperProg, "aPos"),
      aNor: gl.getAttribLocation(paperProg, "aNor"),
      aUv: gl.getAttribLocation(paperProg, "aUv"),
      uRot: u(paperProg, "uRot"), uT: u(paperProg, "uT"), uHalf: u(paperProg, "uHalf"),
      uD: u(paperProg, "uD"), uTex: u(paperProg, "uTex"), uBack: u(paperProg, "uBack"), uSeed: u(paperProg, "uSeed"),
      sP: gl.getAttribLocation(shadowProg, "aP"),
      sC: u(shadowProg, "uC"), sS: u(shadowProg, "uS"), sA: u(shadowProg, "uA"),
      sHalf: u(shadowProg, "uHalf"), sAlpha: u(shadowProg, "uAlpha"), sRound: u(shadowProg, "uRound")
    };
  }

  function createRenderer(canvas) {
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true });
    if (!gl) return null;

    const paperProg = program(gl, VERT, FRAG);
    const shadowProg = program(gl, SHADOW_VERT, SHADOW_FRAG);
    const loc = locations(gl, paperProg, shadowProg);
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);

    let halfW = 1;
    let halfH = 1;

    function resize(cssW, cssH) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      halfW = cssW / 2;
      halfH = cssH / 2;
    }

    function drawShadow(s) {
      gl.useProgram(shadowProg);
      gl.disable(gl.DEPTH_TEST);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(loc.sP);
      gl.vertexAttribPointer(loc.sP, 2, gl.FLOAT, false, 0, 0);
      const lift = 6 + s.c * 18 + s.height * 0.08;
      const size = 1 - 0.78 * s.c;
      gl.uniform2f(loc.sC, s.x + lift * 0.6, -s.y - lift);
      gl.uniform2f(loc.sS, (s.w / 2) * size, (s.h / 2) * size);
      gl.uniform1f(loc.sA, -s.rz * (1 - s.c));
      gl.uniform2f(loc.sHalf, halfW, halfH);
      gl.uniform1f(loc.sAlpha, 0.28 * Math.max(0, 1 - s.height / 900));
      gl.uniform1f(loc.sRound, 0.12 + s.c * 0.5);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.disableVertexAttribArray(loc.sP);
    }

    function bindAttr(buf, attr, size) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(attr);
      gl.vertexAttribPointer(attr, size, gl.FLOAT, false, 0, 0);
    }

    function drawSheet(sheet, s, seed) {
      shapeSheet(gl, sheet, s.c, s.w, s.h);
      gl.useProgram(paperProg);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      bindAttr(sheet.posBuf, loc.aPos, 3);
      bindAttr(sheet.norBuf, loc.aNor, 3);
      bindAttr(sheet.uvBuf, loc.aUv, 2);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sheet.tex);
      gl.uniform1i(loc.uTex, 0);
      gl.uniformMatrix3fv(loc.uRot, false, rotation(s.rx, s.ry, -s.rz));
      gl.uniform3f(loc.uT, s.x, -s.y, s.height);
      gl.uniform2f(loc.uHalf, halfW, halfH);
      gl.uniform1f(loc.uD, CAMERA_DISTANCE);
      gl.uniform3f(loc.uBack, 0.9, 0.885, 0.85);
      gl.uniform1f(loc.uSeed, seed);
      gl.drawArrays(gl.TRIANGLES, 0, sheet.count);
      gl.disableVertexAttribArray(loc.aPos);
      gl.disableVertexAttribArray(loc.aNor);
      gl.disableVertexAttribArray(loc.aUv);
    }

    /* items: [{sheet, state}] back to front. state x/y are px from the stage centre, y down;
       rz is clockwise radians as on screen. */
    function render(items, frame) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      items.forEach(function (item) {
        drawShadow(item.state);
        drawSheet(item.sheet, item.state, (frame % 97) * 1.37);
      });
    }

    return {
      resize: resize,
      render: render,
      createSheet: function (posterCanvas, seed) { return createSheet(gl, posterCanvas, seed); }
    };
  }

  window.Scrap = Object.assign(window.Scrap || {}, { createRenderer: createRenderer });
})();
