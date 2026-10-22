(() => {
  const packageSelect = document.getElementById("package-select");

  // Pricing buttons pre-select the matching package in the enquiry form.
  document.querySelectorAll("[data-plan]").forEach((link) => {
    link.addEventListener("click", () => {
      if (packageSelect) packageSelect.value = link.dataset.plan;
    });
  });

  // Netlify redirects back with ?sent=1 after a successful submission.
  if (new URLSearchParams(location.search).get("sent") === "1") {
    const sent = document.getElementById("sent");
    if (sent) sent.hidden = false;
  }

  const targets = document.querySelectorAll(".sec-head, .tile, .deliverables li, .steps > div, .plan, .faq details");
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  targets.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
})();
