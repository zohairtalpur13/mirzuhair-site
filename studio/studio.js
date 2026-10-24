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
})();
