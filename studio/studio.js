(() => {
  const packageSelect = document.getElementById("package-select");

  // Tariff links pre-select the matching package in the letter.
  document.querySelectorAll("[data-plan]").forEach((link) => {
    link.addEventListener("click", () => {
      if (packageSelect) packageSelect.value = link.dataset.plan;
    });
  });

  // FormSubmit redirects back with ?sent=1 after a successful submission.
  if (new URLSearchParams(location.search).get("sent") === "1") {
    const sent = document.getElementById("sent");
    if (sent) sent.hidden = false;
  }

  // Pattern grounds: reveal each one as its section scrolls into view.
  const grounds = [...document.querySelectorAll(".bg")];
  const sections = grounds.map((bg) => bg.parentElement);
  if (!("IntersectionObserver" in window)) {
    sections.forEach((s) => s.classList.add("in"));
    return;
  }
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      reveal.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -15% 0px" });
  sections.forEach((s) => reveal.observe(s));

  // Gentle scroll parallax: each pattern travels a little slower than the page.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const PARALLAX = 0.14;
  let ticking = false;
  const update = () => {
    ticking = false;
    const mid = innerHeight / 2;
    grounds.forEach((bg) => {
      const r = bg.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      bg.style.setProperty("--py", `${((r.top + r.height / 2 - mid) * PARALLAX).toFixed(1)}px`);
    });
  };
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
})();
