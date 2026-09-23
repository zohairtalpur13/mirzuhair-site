(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll-triggered reveals
  var revealEls = document.querySelectorAll(".oa-reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = Math.min(i * 60, 240);
            setTimeout(function () { el.classList.add("is-visible"); }, delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Photograph / drawing compare sliders
  var sliders = document.querySelectorAll("[data-oa-slider]");
  sliders.forEach(function (slider) {
    var media = slider.closest(".oa-specimen").querySelector(".oa-specimen-media");
    var drawing = media.querySelector(".oa-drawing");

    function apply() {
      var v = Number(slider.value);
      drawing.style.clipPath = "inset(0 " + (100 - v) + "% 0 0)";
    }
    slider.addEventListener("input", apply);
    apply();
  });
})();
