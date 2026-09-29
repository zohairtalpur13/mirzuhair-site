/* “RAW” — The Houses Issue: builds the pages, puts the magazine on the table,
   and lays out the five campaigns, each lit by a flash that follows the cursor. */
(function () {
  const stage = document.getElementById("magazine");
  const canvas = document.getElementById("mag-gl");
  const fallback = document.getElementById("mag-fallback");
  const hint = document.getElementById("mag-hint");
  const list = document.getElementById("house-list");
  const ui = {
    prev: document.getElementById("mag-prev"),
    next: document.getElementById("mag-next"),
    status: document.getElementById("mag-status")
  };
  const THUMB_WIDTH = 520;

  function thumb(page, width) {
    const c = document.createElement("canvas");
    c.width = width || THUMB_WIDTH;
    c.height = Math.round(c.width * RawPages.RATIO);
    c.getContext("2d").drawImage(page, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.86);
  }

  /* Without WebGL, the issue is shown as its pages, side by side. */
  function showFallback(pages) {
    canvas.hidden = true;
    hint.hidden = true;
    fallback.hidden = false;
    pages.forEach(function (p, i) {
      const img = new Image();
      img.src = thumb(p);
      img.alt = "Page " + i + " of The Houses Issue";
      fallback.appendChild(img);
    });
    ui.status.textContent = "The Houses Issue, page by page";
    ui.prev.hidden = true;
    ui.next.hidden = true;
  }

  /* The flash: a bright spot that follows the pointer across a campaign. */
  function flashable(fig) {
    fig.addEventListener("pointermove", function (e) {
      const r = fig.getBoundingClientRect();
      fig.style.setProperty("--fx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      fig.style.setProperty("--fy", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      fig.classList.add("lit");
    });
    fig.addEventListener("pointerleave", function () { fig.classList.remove("lit"); });
  }

  function buildHouses(pages) {
    RawPages.HOUSES.forEach(function (h, i) {
      const el = document.createElement("article");
      el.className = "house" + (i % 2 ? " flip" : "");
      el.innerHTML =
        '<figure class="campaign"><img alt="" width="1000" height="1250"></figure>' +
        '<div class="house-text">' +
        '<p class="house-n"></p><h3></h3><p class="house-line"></p><p class="house-credit"></p>' +
        '<img class="house-page" alt="" loading="lazy">' +
        '</div>';
      const poster = el.querySelector(".campaign img");
      poster.src = thumb(pages[1 + i * 2], 1000);
      poster.alt = h.name + " campaign poster, set in type: " + h.credit;
      el.querySelector(".house-n").textContent = "House 0" + (i + 1) + " · " + h.after;
      el.querySelector("h3").textContent = h.name;
      el.querySelector(".house-line").textContent = h.line;
      el.querySelector(".house-credit").textContent = h.credit;
      const page = el.querySelector(".house-page");
      page.src = thumb(pages[2 + i * 2]);
      page.alt = h.name + " page from the magazine";
      flashable(el.querySelector(".campaign"));
      list.appendChild(el);
    });
  }

  function start(pages) {
    buildHouses(pages);
    let mounted = false;
    try {
      mounted = RawFlip.mount(stage, canvas, pages, ui);
    } catch (err) {
      console.error("RAW: the magazine could not start", err);
    }
    if (!mounted) {
      showFallback(pages);
      return;
    }
    canvas.addEventListener("pointerdown", function () { hint.classList.add("gone"); }, { once: true });
  }

  RawPages.build().then(start).catch(function (err) {
    console.error("RAW: pages failed to build", err);
    ui.status.textContent = "The issue could not load.";
  });
})();
