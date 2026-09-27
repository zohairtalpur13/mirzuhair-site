/* TALPUR — drag (or let it drift) to turn each object. Frames are Blender turntable renders. */
(function () {
  const DRIFT_MS = 140;   // auto-turn speed while in view
  const PX_PER_FRAME = 14;
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function mount(fig) {
    const name = fig.getAttribute("data-spin");
    const count = Number(fig.getAttribute("data-frames")) || 24;
    const img = fig.querySelector("img");
    const srcs = Array.from({ length: count }, function (_, i) { return "img/turn/" + name + "-" + pad(i) + ".jpg"; });
    srcs.forEach(function (src) { const pre = new Image(); pre.src = src; });

    let frame = 0;
    let dragX = null;
    let dragFrame = 0;
    let visible = false;
    let timer = null;

    function show(f) {
      frame = ((f % count) + count) % count;
      img.src = srcs[frame];
    }

    function drift() {
      clearInterval(timer);
      if (!visible || REDUCED || dragX !== null) return;
      timer = setInterval(function () { show(frame + 1); }, DRIFT_MS);
    }

    fig.addEventListener("pointerdown", function (e) {
      dragX = e.clientX;
      dragFrame = frame;
      fig.setPointerCapture(e.pointerId);
      clearInterval(timer);
      const hint = fig.querySelector(".hint");
      if (hint) hint.remove();
    });
    fig.addEventListener("pointermove", function (e) {
      if (dragX === null) return;
      show(dragFrame + Math.round((e.clientX - dragX) / PX_PER_FRAME));
    });
    function release() {
      dragX = null;
      drift();
    }
    fig.addEventListener("pointerup", release);
    fig.addEventListener("pointercancel", release);
    fig.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(frame + 1);
      if (e.key === "ArrowLeft") show(frame - 1);
    });

    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      drift();
    }).observe(fig);
  }

  document.querySelectorAll(".spin[data-spin]").forEach(mount);
})();
