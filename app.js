(function () {
  const app = document.getElementById("app");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const bySlug = (slug) => PROJECTS.find((p) => p.slug === slug);

  /* ---------- Heritage Loop visuals ---------- */
  const phoneFeed = () => `
    <div class="phone"><div class="scr">
      <div class="bar"><b>Heritage Loop</b><i></i></div>
      <div class="feed">
        ${[
          ["img/tt-look.jpg", "Talpur Silk Slip", "£485"],
          ["img/cc-pattern.jpg", "Ceiling Print Jacket", "£395"],
          ["img/dd-pattern.jpg", "Metal Corset", "£685"],
        ].map(([s, t, p]) => `<div class="item"><img src="${s}" alt=""><b>${t}</b>
          <div class="row"><span>Hyderabad, Sindh · ${p}</span><em>Scan</em></div></div>`).join("")}
      </div>
    </div></div>`;
  const phoneTwin = () => `
    <div class="phone"><div class="scr">
      <div class="bar"><b>Digital Twin</b><i></i></div>
      <div class="twin"><img src="img/dd-pattern.jpg" alt=""><img class="src" src="img/dd-door.jpg" alt=""></div>
      <div class="lbl">Architectural lineage</div>
      <div class="txt">Deer crest, from the arched doorway of the Talpur Haveli</div>
      <div class="lbl">Cultural continuity</div>
      <div class="txt" style="font-size:11px;font-family:var(--sans)">Motif drawn by hand, digitised and printed on silk.</div>
      <div class="cta">View the source</div>
    </div></div>`;
  const phoneSustain = () => `
    <div class="phone"><div class="scr">
      <div class="bar"><b>Sustainability</b><i></i></div>
      <div class="score"><span style="font-size:8px;letter-spacing:.12em;text-transform:uppercase">Environmental Ancestry Score</span><b>82</b></div>
      ${[["Material origin", 88], ["Water use", 64], ["Transport", 72], ["Maker wages", 91]]
        .map(([l, v]) => `<div class="meter">${l}<div><i style="width:${v}%"></i></div></div>`).join("")}
      <div class="cta">Full report</div>
    </div></div>`;

  const hlCover = () => `
    <div class="hl-cover">
      <div class="hl-word">Heritage<br>Loop<small>Traceable heritage fashion</small>
        <div class="hl-dots"><i style="background:#008080"></i><i style="background:#800020"></i><i style="background:#D4AF37"></i><i style="background:#F5F5DC;border:1px solid #d9d4cc"></i></div>
      </div>
      ${phoneFeed()}
    </div>`;

  const TWINS = [
    { name: "Deer crest", icon: "img/hl-ic-deer.png", steps: [["img/dd-door.jpg", "Palace doorway"], ["img/sk-dd-6.jpg", "Pencil sketch"], ["img/cr-drawing.jpg", "Digital line work"], ["img/cr-jq-red.jpg", "Repeat"], ["img/hl-deer-look.jpg", "On the body"]] },
    { name: "Painted ceiling", icon: "img/hl-mandala.png", steps: [["img/tt-ceiling-hall.jpg", "Palace ceiling"], ["img/sk-ce-1.jpg", "Pencil sketch"], ["img/ce-drawing.jpg", "Digital line work"], ["img/ce-final-teal.jpg", "Repeat"], ["img/tt-side.jpg", "The silk cape"]] },
    { name: "The corridor", icon: "img/hl-ic-arch.png", steps: [["img/cc-hall.jpg", "Palace corridor"], ["img/sk-co-1.jpg", "Ink sketch"], ["img/co-drawing.jpg", "Digital line work"], ["img/co-bronze.jpg", "Repeat"], ["img/tt-back.jpg", "The corridor skirt"]] },
    { name: "Glass lantern", icon: "img/hl-ic-lantern.png", steps: [["img/ln-yellow.jpg", "Palace lantern"], ["img/sk-ln-1.jpg", "Pencil sketch"], ["img/ln-drawing.jpg", "Digital line work"], ["img/ln-black.jpg", "Repeat"], ["img/ln-gradient.jpg", "Colourway"]] },
  ];

  const HL_PANELS = {
    mandala: () => `<small>UI element 01</small><h3>Scan button as palace mandala</h3>
      <p>The scan button began as a pencil study of the painted ceiling's central medallion. I traced its petals as clean gold line work so the most important action in the app is also a piece of the palace.</p>
      <div class="hl-dlg-row">
        <figure><img src="img/tt-ceiling-detail.jpg" alt=""><figcaption>01 · The painted ceiling</figcaption></figure>
        <figure class="paper"><img src="img/sk-ce-1.jpg" alt=""><figcaption>02 · My pencil study</figcaption></figure>
        <div><figure class="ink"><img src="img/hl-mandala.png" alt=""></figure><figcaption>03 · Gold line, for the UI</figcaption></div>
      </div>
      <div class="hl-try"><button class="hl-scan" type="button"><img src="img/hl-mandala.png" alt=""><span>Scan</span></button><p class="hl-try-out">Try it: tap the mandala.</p></div>`,
    icons: () => `<small>UI element 02</small><h3>Data icons from Talpur motifs</h3>
      <p>Each category of data in the Sustainability screen has an icon taken from a palace object, drawn first in my sketchbook.</p>
      <div class="hl-dlg-icons">${[["deer", "Origin", "Where the fibre and fabric come from", "img/dd-door.jpg", "img/sk-dd-6.jpg"], ["lantern", "Energy", "Power used in printing and finishing", "img/ln-yellow.jpg", "img/sk-ln-1.jpg"], ["arch", "Craft", "Hands and hours behind each piece", "img/hx/w1.jpg", "img/sk-dd-5.jpg"], ["eagle", "Provenance", "The object each print was drawn from", "img/gr-marble.jpg", "img/sk-iv-1.jpg"]]
        .map(([n, k, d, ph, sk]) => `<div class="hl-ic-row"><figure><img src="${ph}" alt=""></figure><figure class="paper"><img src="${sk}" alt=""></figure><figure class="ink"><img src="img/hl-ic-${n}.png" alt=""></figure><div><b>${k}</b><span>${d}</span></div></div>`).join("")}</div>`,
    archive: () => `<small>UI element 03</small><h3>Backgrounds from the sketch archive</h3>
      <p>These are the sketchbook pages that sit behind the app's screens at low opacity, so the archive is present wherever you are.</p>
      <div class="hl-dlg-grid">${["sk-co-1", "sk-co-2", "sk-ce-4", "sk-dd-4", "sk-iv-3", "sk-co-4", "sk-dd-9", "sk-ln-4"].map((n) => `<figure class="paper"><img src="img/${n}.jpg" alt=""></figure>`).join("")}</div>
      <div class="hl-dlg-demo"><img src="img/sk-co-1.jpg" alt=""><div><small>In use</small><b>Talpur Silk Slip</b><span>Hyderabad, Sindh</span></div></div>`,
  };

  /* ---------- Block renderers ---------- */
  const fig = (it, extra = "") =>
    `<figure class="${it.contain ? "contain" : ""} ${extra}"><img src="${it.src}" alt="${esc(it.cap || "")}" loading="lazy" data-cap="${esc(it.cap || "")}">${it.cap ? `<figcaption>${esc(it.cap)}</figcaption>` : ""}</figure>`;

  const renderBlock = (b) => {
    switch (b.type) {
      case "full":
        return `<div class="blk full reveal ${b.contain ? "contain" : ""}">${fig({ ...b, contain: false })}</div>`;
      case "pair":
      case "trio":
        return `<div class="blk ${b.type} ${b.natural ? "natural" : ""} reveal">${b.items.map((i) => fig(i)).join("")}</div>`;
      case "step":
        return `<div class="blk step reveal"><span>${esc(b.n)}</span><h3>${esc(b.h)}</h3>${b.p ? `<p>${esc(b.p)}</p>` : ""}</div>`;
      case "grid":
        return `<div class="blk grid-${b.cols || 4} ${b.tall ? "tall" : ""} reveal">${b.items.map((i) => fig(i)).join("")}</div>`;
      case "text":
        return `<div class="blk text reveal"><h3>${esc(b.h)}</h3><p>${esc(b.p)}</p></div>`;
      case "related":
        return `<div class="blk related reveal"><p>${esc(b.text)}</p><ul>${b.links
          .map((s) => `<li><a href="#/work/${s}">${esc(bySlug(s).title)} →</a></li>`).join("")}</ul></div>`;
      case "oh-light":
        return `<section class="oh-play reveal"><div class="oh-head"><span>Play · 01</span><h3>Move the light</h3><p>${esc(b.p)}</p></div>
          <div class="oh-light" data-oh="light"><img src="img/oh-poster.jpg" alt="Open House poster"><div class="oh-beam" style="background-image:url(img/oh-poster.jpg)"></div><small>Drag across the poster</small></div></section>`;
      case "oh-lattice":
        return `<section class="oh-play oh-lat reveal" data-oh="lattice"><div class="oh-head"><span>Play · 02</span><h3>Build a letter</h3><p>${esc(b.p)}</p></div>
          <div class="oh-lat-in"><svg viewBox="0 0 500 700" role="img" aria-label="5 by 7 jali grid: tap cells to draw a letter"></svg>
          <div class="oh-lat-side"><p class="oh-lat-stat"></p><div class="oh-keys"></div>
          <div class="oh-acts"><button type="button" data-act="invent">Invent a letter</button><button type="button" data-act="rule" aria-pressed="true">Show the arch cuts</button><button type="button" data-act="clear">Clear</button></div></div></div></section>`;
      case "oh-tester":
        return `<section class="oh-play oh-test reveal" data-oh="tester"><div class="oh-head"><span>Play · 03</span><h3>Type in Jharoka</h3><p>${esc(b.p)}</p></div>
          <div class="oh-test-ctl"><input type="text" value="The haveli keeps its doors open" maxlength="60" aria-label="Text to set in Jharoka"><label>Size <input type="range" min="28" max="160" value="84"></label>
          <div class="oh-ways">${[["green,lime", "Lantern"], ["lime,green", "Plaster"], ["kirm,lime", "Kirmizi"], ["teak,brass", "Teak"], ["brass,teak", "Brass"]].map(([w, l], i) => `<button type="button" data-way="${w}" aria-pressed="${i === 0}" style="--a:var(--oh-${w.split(",")[0]});--b:var(--oh-${w.split(",")[1]})"><i></i>${l}</button>`).join("")}</div></div>
          <div class="oh-out"></div></section>`;
      case "oh-ticket":
        return `<section class="oh-play oh-tix reveal" data-oh="ticket"><div class="oh-head"><span>Play · 04</span><h3>Make your ticket</h3><p>${esc(b.p)}</p></div>
          <div class="oh-tix-ctl"><input type="text" placeholder="Your name" maxlength="16" aria-label="Your name for the ticket">
          <div class="oh-ways">${[["green", "Lantern"], ["lime", "Plaster"], ["kirm", "Kirmizi"]].map(([w, l], i) => `<button type="button" data-tw="${w}" aria-pressed="${i === 0}" style="--a:var(--oh-${w})"><i></i>${l}</button>`).join("")}</div>
          <button type="button" class="oh-dl" data-act="download">Download ticket (PNG)</button></div>
          <canvas aria-label="Your Open House ticket"></canvas></section>`;
      case "linkout":
        return `<div class="blk related reveal">${b.text ? `<p>${esc(b.text)}</p>` : ""}<ul>${b.items
          .map((i) => `<li><a href="${i.href}"${i.newTab ? ' target="_blank" rel="noopener"' : ""}>${esc(i.label)} →</a></li>`).join("")}</ul></div>`;
      case "hl-overview":
        return `<section class="hl-ov reveal">
          <div class="hl-ov-q"><span>The question</span><p>What if a garment could tell you <em>where it came from</em>, not only the factory, but the building, the object and the family history behind its print?</p></div>
          <div class="hl-ov-grid">
            ${[["Role", "Concept, UX and UI design"], ["Scope", "Personas, core screens, design system"], ["Built on", "Threads of Time textile thesis"], ["Status", "Concept, not yet user-tested"]]
              .map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join("")}
          </div></section>`;
      case "hl-problem":
        return `<section class="hl-sec reveal"><h3>Two gaps the platform closes</h3><div class="hl-gaps">
          <div class="hl-gap"><img src="img/hl-ic-lantern.png" alt=""><h4>Environmental ancestry</h4><p>Sustainability claims in fashion are vague and hard to verify. Buyers are asked to trust a label, not shown the data.</p></div>
          <div class="hl-gap"><img src="img/hl-ic-arch.png" alt=""><h4>Cultural lineage</h4><p>The story behind a heritage print, the building, the object, the craft, usually ends at the swing tag and is lost once the garment leaves the shop.</p></div>
        </div></section>`;
      case "hl-journey":
        return `<section class="hl-sec reveal"><h3>How the three screens connect</h3><ol class="hl-journey">
          ${[["Discover", "Home Feed", "Browse traceable pieces, each with a heritage score."], ["Scan", "Mandala button", "Scan the garment's tag or tap the mandala on any product."], ["Trace", "Digital Twin", "See the palace element the print was drawn from, and each step in between."], ["Verify", "Sustainability", "Read the Environmental Ancestry Score, broken into measures."]]
            .map(([s, w, d], i) => `<li><span>0${i + 1}</span><b>${s}</b><small>${w}</small><p>${d}</p></li>`).join("")}
        </ol></section>`;
      case "hl-twin":
        return `<section class="hl-sec reveal"><h3>The Digital Twin: from palace to garment</h3>
          <p class="hl-lede">The heart of the concept. Every print in the collection can be traced back through the real stages of its making. Choose a print:</p>
          <div class="hl-twin" data-twin>
            <div class="hl-tabs" role="tablist">${TWINS.map((t, i) => `<button role="tab" aria-selected="${i === 0}" data-t="${i}"><img src="${t.icon}" alt="">${t.name}</button>`).join("")}</div>
            ${TWINS.map((t, i) => `<div class="hl-chain" data-c="${i}" ${i ? "hidden" : ""}>${t.steps.map((s, j) => `<figure style="--j:${j}"><div><img src="${s[0]}" alt="${s[1]}" loading="lazy"></div><figcaption><em>0${j + 1}</em>${s[1]}</figcaption></figure>`).join('<i class="hl-arrow">→</i>')}</div>`).join("")}
          </div></section>`;
      case "hl-ui":
        return `<section class="hl-sec reveal"><h3>UI elements drawn from the palace</h3><div class="hl-ui">
          <button class="hl-ui-card dark" data-open="mandala"><div class="hl-mandala"><img src="img/hl-mandala.png" alt=""><span>Scan</span></div><h4>Scan button as palace mandala</h4><p>The primary action is the ceiling medallion from my sketchbook, redrawn in gold. It rotates slowly while scanning.</p><em class="hl-open">Open ↗</em></button>
          <button class="hl-ui-card dark" data-open="icons"><div class="hl-icons">${["deer", "lantern", "arch", "eagle"].map((n) => `<img src="img/hl-ic-${n}.png" alt="">`).join("")}</div><h4>Data icons from Talpur motifs</h4><p>Each data category takes an icon from a palace object: the deer for origin, the lantern for energy, the arch for craft, the eagle for provenance.</p><em class="hl-open">Open ↗</em></button>
          <button class="hl-ui-card" data-open="archive"><div class="hl-bgdemo"><img src="img/sk-co-1.jpg" alt=""><b>Traceable heritage fashion</b></div><h4>Backgrounds from the sketch archive</h4><p>Hand-drawn deconstruction sketches from the Threads of Time archive sit behind content at low opacity, so the archive is always present.</p><em class="hl-open">Open ↗</em></button>
        </div>
        <dialog class="hl-dlg" id="hl-dlg"><button class="hl-dlg-x" aria-label="Close">×</button><div class="hl-dlg-body"></div></dialog>
        </section>`;
      case "hl-next":
        return `<section class="hl-sec reveal"><h3>Next steps</h3><div class="hl-next">
          <p>Heritage Loop is a concept. The screens here visualise its structure; they have not yet been tested with users. The next phase is:</p>
          <ol><li>Interview five people who match each persona about how they judge provenance and sustainability claims.</li><li>Map the scan-to-story journey and test it as a clickable prototype.</li><li>Define what goes into the Environmental Ancestry Score with a textile-sustainability advisor.</li></ol>
        </div></section>`;
      case "personas":
        return `<section class="hl-sec reveal"><h3>Target users</h3><div class="personas">
          <div class="persona"><h4>The Ethical Curator</h4><div class="who">28 · Creative consultant · London / New York</div>
            <p>Sees fashion as investment and activism. Tired of greenwashing and wants hard data presented with a high-end aesthetic.</p>
            <div class="focus">Needs: Sustainability dashboard + Environmental Ancestry Score</div></div>
          <div class="persona"><h4>The Modern Historian</h4><div class="who">35 · Academic and designer</div>
            <p>Passionate about decolonial fashion and South Asian heritage. They aren't just buying a shirt but a piece of Sindhi history, and want to see where it came from.</p>
            <div class="focus">Needs: Digital Twin + Cultural Continuity</div></div>
        </div></section>`;
      case "screens":
        return `<section class="hl-sec reveal"><h3>Core screens</h3><div class="screens">
          <div class="screen">${phoneFeed()}<h4>Home Feed</h4><p>A modular grid of traceable garments, each with a heritage score and a scan action.</p></div>
          <div class="screen">${phoneTwin()}<h4>Digital Twin</h4><p>Each print is linked back to the exact architectural element it was drawn from.</p></div>
          <div class="screen">${phoneSustain()}<h4>Sustainability</h4><p>The Environmental Ancestry Score, broken down into verifiable measures.</p></div>
        </div><p class="blk" style="font-size:13px;color:var(--muted);margin-top:12px">Concept screens. Scores and prices are illustrative placeholder data.</p></section>`;
      case "system":
        return `<section class="hl-sec reveal"><h3>Design system: Earthy Regal</h3><div class="system">
          <div class="swatches">
            ${[["#008080", "Deep Teal", "Primary actions"], ["#800020", "Burgundy", "Heritage focus"], ["#D4AF37", "Gold", "Premium elements"], ["#F5F5DC", "Raw Linen", "Background"]]
              .map(([c, n, u]) => `<div class="sw"><div style="background:${c}"></div><b>${n}</b><span>${c}<br>${u}</span></div>`).join("")}
          </div>
          <div class="type-spec">
            <div class="big">Heritage Loop</div><p>High-contrast serif, for headings</p>
            <div class="small">Environmental Ancestry Score</div><p>Minimal sans-serif, for body and data</p>
            <div class="ui">Decorative backgrounds use hand-drawn deconstruction sketches from the Threads of Time archive. Scan buttons are styled as palace mandalas, and data icons are drawn from Talpur architectural motifs.</div>
          </div>
        </div></section>`;
    }
    return "";
  };

  /* ---------- Views ---------- */
  const STAGE = { "threads-of-time": "img/tt-hero.jpg", "deer-and-doorway": "img/cr-mock-2.jpg", "painted-ceiling": "img/ce-final-teal.jpg",
      "portrait-of-an-ancestor": "img/pt-jq-3.jpg", "corridors-and-chandeliers": "img/cc-hall.jpg", "ivory-table": "img/gr-dark.jpg",
      "lanterns": "img/ln-pattern.jpg", "greek-ornament": "img/ed-red.jpg", "quiet-structure": "img/qs-01.jpg", "mirs-cafe": "img/mc-st-crosswalk.jpg",
      "heritage-loop": "img/hl-deer-look.jpg", "editorial-mockups": "img/ed-vogue-margot.jpg", "line": "img/wl-panel-1.jpg" };

  const viewHome = () => {

    const cards = PROJECTS.map((p, i) => {
      const img = STAGE[p.slug] || p.cover || p.thumb;
      const n = String(i + 1).padStart(2, "0");
      return `<section class="ws-item" data-tone="${p.tone || ""}" style="--tone:${p.tone || "#e8d9bd"}">
        <div class="ws-pin">
          <a class="ws-frame" href="#/work/${p.slug}" aria-label="${esc(p.title)}">
            <img class="ws-bg" src="${img}" alt="" loading="${i < 2 ? "eager" : "lazy"}">
            <img class="ws-img" src="${img}" alt="${esc(p.title)}" loading="${i < 2 ? "eager" : "lazy"}">
            <span class="ws-shade"></span>
          </a>
          <div class="ws-meta">
            <span class="ws-n">${n}<i>/${String(PROJECTS.length).padStart(2, "0")}</i></span>
            <h2 class="ws-title">${esc(p.title).split(" ").map((w) => `<span class="w"><span>${w}</span></span>`).join(" ")}</h2>
            <p class="ws-sub">${esc(p.subtitle || "")}<span>${esc(p.date)}</span></p>
            <a class="ws-cta" href="#/work/${p.slug}">View project <b>→</b></a>
          </div>
        </div>
      </section>`;
    }).join("");
    return `
      <section class="hx" id="hx" aria-label="The Talpur palace, 1843 to 2025">
        <div class="hx-stage">
          <div class="hx-paper"></div>

          <div class="hx-intro">
            <span class="label">Mir Zuhair — Textile &amp; Communication Designer</span>
            <h1>${"Threads of yesterday,".split("").map((c, i) => `<i style="--d:${i * 38}ms">${c === " " ? "&nbsp;" : c}</i>`).join("")}</h1>
            <p class="hx-sub">A palace in Hyderabad, Sindh, built in 1843, and what I carry forward from it.</p>
          </div>

          ${HX_PRINTS.map((s, i) => `<figure class="hx-print" data-i="${i}"><img src="${s[0]}" alt="${s[1]}"><figcaption>${s[1]}</figcaption></figure>`).join("")}

          <div class="hx-wall"><div class="hx-sharp"><img src="img/hx/gallery-4k.jpg" alt="The long gallery of the palace, lit by glass lanterns"></div><div class="hx-grid">${[15, 0, 1, 2, 3, 4, 16, 17, 5, 6, 7, 8, 9, 18, 19, 10, 11, 12, 13, 14, 20].map((n) => `<div class="hx-tile${n === 7 ? " c" : ""}"><img src="img/hx/w${n}.jpg" alt=""></div>`).join("")}</div></div>

          <div class="hx-museum"><div class="hx-track">
            <div class="hx-plaque"><small>The treasury</small><b>Heirlooms of the palace</b><span>Court robes stitched with gold and silver wire, jewelled daggers, gilt swords and carved canes, kept by the family for six generations.</span></div>
            ${HX_OBJECTS.map((o, i) => `<figure class="hx-piece" style="--o:${i % 2 ? 1 : -1}"><div class="hx-mat"><img src="img/hx/${o[0]}.jpg" alt="${o[1]}, ${o[2]}"></div><figcaption><em>No. ${String(i + 1).padStart(2, "0")}</em>${o[1]}<span>${o[2]}</span></figcaption></figure>`).join("")}
          </div></div>

          <div class="hx-pairs">
            <div class="hx-pair-head"><small>From object to drawing</small><b>Every pattern began in pencil.</b></div>
            ${HX_PAIRS.map((p, i) => `<figure class="hx-pair" data-i="${i}"><div class="hx-pair-frame"><img class="a" src="img/hx/p${i}a.jpg" alt="${p}"><div class="b"><img src="img/hx/p${i}b.jpg" alt="My pencil drawing of the ${p.toLowerCase()}"></div><i class="hx-wipe"></i></div><figcaption><span>Photograph</span><b>${p}</b><span>Pencil</span></figcaption></figure>`).join("")}
          </div>

          <div class="hx-finale">
            <figure class="hx-final" aria-label="Threads of Time: the finished look">${Array.from({ length: 12 }, (_, i) => `<span style="--i:${i}"><img src="img/tt-hero.jpg" alt=""></span>`).join("")}<figcaption>Silk, brass and memory · Threads of Time, 2025</figcaption></figure>
            <div class="hx-copy">
              <span class="label">2025 · Threads of Time</span>
              <h2>Threads of yesterday,<br><span class="l2">woven for <em>tomorrow.</em></span></h2>
            </div>
          </div>

          <div class="hx-cap"><b></b><span></span></div>
          <div class="hx-year"><small>Anno</small><span>1843</span></div>
          <div class="hx-hint"><span>Scroll through time</span><i></i></div>
          <div class="hx-progress"><i></i></div>
          <div class="hx-vignette"></div>
          <div class="hx-grain"></div>
        </div>
      </section>
      <section class="intro intro-brief">
        <div class="hero-brief">
          <p>My family's home, the Mir Hassan Ali Palace in Hyderabad, Sindh, was built in 1843. For almost two centuries its painted ceilings, carved doors, lanterns and ancestral portraits have held our history quietly. They are my first archive.</p>
          <p>I carry that past forward. I draw what my ancestors left behind and translate it into printed silk, woven jacquard, editorial images and digital systems, so their memory isn't kept behind glass but is worn, shared and passed on.</p>
          <ol class="translate" aria-label="My process">
            <li><b>Ornament</b><span>the building</span></li>
            <li><b>Line</b><span>the drawing</span></li>
            <li><b>Pattern</b><span>the system</span></li>
            <li><b>Cloth</b><span>the body</span></li>
            <li><b>Story</b><span>the audience</span></li>
          </ol>
        </div>
      </section>
      <section class="ws" aria-label="Selected work">${cards}</section>`;
  };

  const viewProject = (p) => {
    const i = PROJECTS.indexOf(p);
    const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
    const next = PROJECTS[(i + 1) % PROJECTS.length];
    const nimg = STAGE[next.slug] || next.cover;
    const acc = Object.entries(p.sections).map(([k, v], n) => `
      <div class="acc-item ${n === 0 ? "open" : ""}">
        <button aria-expanded="${n === 0}"><span>${esc(k)}</span><span class="pm"></span></button>
        <div class="acc-panel"><div><p>${esc(v)}</p></div></div>
      </div>`).join("");
    const cover = p.coverHTML
      ? `<div class="cover hl">${hlCover()}</div>`
      : `<div class="cover"><img src="${p.cover}" alt="${esc(p.title)}" data-cap="${esc(p.title)}"></div>`;
    return `
      <article class="pj page-enter" style="--tone:${p.tone || "#e8d9bd"}">
        ${p.spiral ? viewSpiral(p) : ""}
        <section class="project-head">
          ${cover}
          <div class="project-info">
            <h1>${esc(p.title)}</h1>
            <div class="sub">${esc(p.subtitle)}</div>
            <div class="date">${esc(p.date)}</div>
            <div class="tags">${esc(p.tags)}</div>
            <div class="acc">${acc}</div>
            ${p.note ? `<p class="note">${esc(p.note)}</p>` : ""}
          </div>
        </section>
        ${!p.spiral && typeof TOURS !== "undefined" && TOURS[p.slug] ? `<section class="tour" style="--n:${TOURS[p.slug].pts.length}">
          <div class="tour-stage">
            <div class="tour-bg" style="background-image:url(${TOURS[p.slug].img})"></div>
            <div class="tour-box"><img class="tour-img" src="${TOURS[p.slug].img}" alt="${esc(p.title)}"></div>
            <div class="tour-lens"></div>
            <div class="tour-cap">${TOURS[p.slug].pts.map((q, k) => `<div class="tour-c" data-k="${k}"><em>${String(k + 1).padStart(2, "0")} / ${String(TOURS[p.slug].pts.length).padStart(2, "0")}</em><b>${esc(q[3])}</b><span>${esc(q[4])}</span></div>`).join("")}</div>
            <div class="tour-dots">${TOURS[p.slug].pts.map(() => "<i></i>").join("")}</div>
            <div class="tour-kicker">In detail</div>
          </div>
        </section>` : ""}
        <section class="blocks pj-blocks">${p.blocks.map(renderBlock).join("")}</section>
        <a class="pj-next" href="#/work/${next.slug}">
          <img src="${nimg}" alt="">
          <span class="pj-next-in"><small>Next project</small><b>${esc(next.title)}</b><em>${esc(next.subtitle || "")}</em></span>
        </a>
        <nav class="pager pj-pager">
          <a href="#/work/${prev.slug}"><small>Previous</small><span>${esc(prev.title)}</span></a>
          <a class="next" href="#/"><small>All work</small><span>Index</span></a>
        </nav>
      </article>`;
  };

  /* ---------- Research ---------- */
  const R_PAL = {"Corridor": ["#a18770", "#3a1d0d", "#53462f", "#e1dfd7", "#896850"], "Red hall": ["#190906", "#511c13", "#6f3323", "#a63a26", "#a35238"], "Yellow hall": ["#5e2d0c", "#351509", "#b4ac9e", "#d3d9d6", "#a7733f"], "Doorway": ["#9b532a", "#d2cec4", "#dcdad2", "#7c3b15", "#e1e0d8"], "Painted ceiling": ["#643a3d", "#ab7e47", "#a95e3c", "#bb9d52", "#c6bf67"], "Glass lantern": ["#3c1506", "#240d03", "#b0a891", "#492616", "#948272"], "Portrait": ["#b98c7b", "#ac6057", "#4b2a2d", "#775859", "#d0b29e"], "Gallery": ["#1f0e05", "#5e5340", "#463523", "#817865", "#2c2012"]};
  const R_ROOMS = [
    ["Gallery", "img/hx/gallery-4k.jpg", "The long gallery", "Green and amber glass lanterns hang in rhythm down its length. This became the corridor toile."],
    ["Corridor", "img/cc-hall.jpg", "The corridor", "Beamed ceiling, carved chairs and a crystal chandelier: the source of Composition 01."],
    ["Red hall", "img/hero-hall.jpg", "The red hall", "Deer trophies line both walls above a long table. The origin of the crest."],
    ["Yellow hall", "img/cc-yellow.jpg", "The yellow hall", "Chandeliers and stained glass throw coloured light across a lime-washed room."],
    ["Doorway", "img/dd-door.jpg", "The doorways", "Arched teak doors with fanlights, crowned by mounted stags."],
    ["Painted ceiling", "img/tt-ceiling-detail.jpg", "The painted ceiling", "Star medallions, gilt lines and dense floral infill. The silk cape print."],
    ["Glass lantern", "img/ln-red.jpg", "The lanterns", "Ruby and amber glass, hand-painted and set with stones."],
    ["Portrait", "img/pt-portrait.jpg", "The portraits", "Ancestors in crowns and embroidered robes, framed like icons."],
  ];
  const R_SPEC = [
    ["architecture", "Stag and doorway", "img/dd-door.jpg", "img/sk-dd-6.jpg"],
    ["light", "Glass lantern", "img/ln-yellow.jpg", "img/sk-ln-1.jpg"],
    ["objects", "Carved eagle", "img/gr-marble.jpg", "img/sk-iv-1.jpg"],
    ["light", "Chandelier", "img/cc-chandelier.jpg", "img/sk-co-4.jpg"],
    ["architecture", "The corridor", "img/cc-hall.jpg", "img/sk-co-1.jpg"],
    ["objects", "Carriage", "img/obj-carriage.jpg", "img/sk-co-5.jpg"],
    ["architecture", "Painted ceiling", "img/tt-ceiling-detail.jpg", "img/sk-ce-1.jpg"],
    ["portraits", "Ancestral portrait", "img/pt-portrait.jpg", "img/sk-pt-1.jpg"],
    ["objects", "Mantel clock", "img/obj-clock.jpg", "img/sk-ch-7.jpg"],
    ["architecture", "The façade", "img/hx-facade.jpg", "img/sk-co-6.jpg"],
    ["heirlooms", "Court coat", "img/hx/h-coat-red.jpg", ""],
    ["heirlooms", "Talwar and scabbard", "img/hx/h-sword.jpg", ""],
    ["heirlooms", "Ceremonial jacket", "img/hx/h-jacket-back.jpg", ""],
    ["heirlooms", "Jewelled daggers", "img/hx/h-daggers.jpg", ""],
    ["heirlooms", "Sindhi cap", "img/hx/h-cap-gold.jpg", ""],
    ["objects", "Rosewater sprinkler", "img/hx/h-sprinkler.jpg", ""],
  ];
  const R_STEPS = [
    ["Observe", "I walked the palace room by room, looking for the elements that repeat: arches, lanterns, stags, medallions.", "img/hx/gallery-4k.jpg"],
    ["Document", "Every room and object was photographed on site, from the façade down to the jewels on a lantern. This archive now holds more than 190 images.", "img/obj-deer.jpg"],
    ["Draw", "Each element was drawn by hand, first in pencil and then in ink, across 49 sketchbook pages.", "img/sk-dd-4.jpg"],
    ["Decode", "From the drawings I extracted the building's grammar: symmetry, rhythm, and a palette taken from the rooms themselves.", "img/dd-colour.jpg"],
    ["Translate", "Finally, the grammar became cloth: seven compositions, printed on silk and woven as jacquard.", "img/tt-hero.jpg"],
  ];
  const R_CASE_WHY = [
    ["Where it began", "A strong campaign carries one idea from the street to the counter, into the bag and home. I wanted a project that showed my drawings could do the same, outside fashion."],
    ["The idea", "In a Sindhi home the first cup of chai is for thirst and the second is for talk. That became the campaign line, \"Stay for the second cup\", and the offer: from Monday to Thursday, 4 to 7pm, the second chai is free."],
    ["The rule", "My first draft used flat, drawn mockups, and it looked artificial. So I set a rule for the second round: every piece is shown on real photography, and every ornament is one of my own palace drawings."]
  ];
  const R_CASE_PAIRS = [
    ["img/ln-drawing.jpg", "img/mc-tote3.jpg", "Canvas tote", "The lantern", "Tote, cups, billboards"],
    ["img/co-drawing.jpg", "img/mc-kraft2.jpg", "Kraft takeaway bag", "The corridor", "Takeaway bag"],
    ["img/de-oval.jpg", "img/mc-sticker1.jpg", "Emblem sticker", "The deer", "Emblem, stickers, loyalty stamps"],
    ["img/ce-drawing.jpg", "img/mc-tin1.jpg", "Nankhatai tin", "The painted ceiling", "Tin lid, Kashmiri chai pouch"],
    ["img/ch-drawing.jpg", "img/mc-pouch3.jpg", "Loose-leaf chai pouches", "The chandelier", "House chai pouch, book cover"]
  ];
  const R_CASE_STEPS = [
    ["Touchpoints", "I mapped every place the brand would meet people: street advertising, packaging, digital and gifting, each to be shown on real photography. That became my checklist.", "img/mc-billboard1.jpg"],
    ["Choosing the drawings", "From the palace archive I chose the drawings with the clearest silhouettes, the ones that still read on a cup or a sticker: the lantern, the corridor, the deer, the ceiling and the chandelier.", "img/ln-drawing.jpg"],
    ["Identity", "Each drawing was cleaned into a single-ink line so it could print in one colour on kraft, canvas and paper. I paired it with a Bodoni wordmark and a script signature, and made the deer oval the emblem.", "img/mc-sticker3.jpg"],
    ["The arch and the photograph", "For the campaign I framed real chai photography inside the shape of the palace doorway arch. It gave four key visuals: the second cup, Kashmiri pink chai, the copper kettle and bun maska.", "img/mc-kv2.jpg"],
    ["Mockups", "Every design was placed into Photoshop smart-object mockups, so the print follows the folds of canvas, the grain of kraft and the curve of a cup. The street scenes are real photographs, with passers-by cut out so they walk in front of the posters.", "img/mc-st-umbrella.jpg"],
    ["The app and social", "The loyalty idea became the Second Cup Club: an app with stamps, the 4–7pm offer and real drink photography, plus an Instagram grid that alternates photos and type.", "img/mc-app-home.jpg"]
  ];
  const R_CASE_PAL = [
    ["#5E1224", "Oxblood", "The burgundy of Earthy Regal, deepened to the colour of the red hall.", "#F3EBDD"],
    ["#E7B3B0", "Kashmiri pink", "Taken from the drink itself: the colour of Kashmiri chai.", "#5E1224"],
    ["#0D4F4E", "Palace teal", "The teal of Earthy Regal and the painted-ceiling prints.", "#F3EBDD"],
    ["#C99E52", "Lantern gold", "The brass of the lanterns and the gilt lines of the ceiling.", "#231E20"],
    ["#F3EBDD", "Raw linen", "Unbleached canvas and paper, the ground for one-ink prints.", "#5E1224"]
  ];
  const R_CASE_LEARN = [
    ["Research travels", "Drawings made for silk worked just as well on a paper cup, because they were built on clear silhouettes and symmetry."],
    ["One ink goes further", "Printing single-colour line work on kraft and canvas kept the heritage feel while looking contemporary rather than costume."],
    ["Real context convinces", "Showing the work on real photography, with real people, was the difference between a concept and a campaign."]
  ];
  // [slug, source photo, source label, finished work, hand drawing or "", one line]
  const R_WORKS = [
    ["The compositions", "Seven compositions and a lantern study, each drawn from one room or object in the palace.", [
      ["corridors-and-chandeliers", "img/cc-hall.jpg", "The main corridor", "img/co-c2.jpg", "img/sk-co-1.jpg", "Arches, lanterns and carved chairs drawn in ink, then mirrored into a toile repeat."],
      ["deer-and-doorway", "img/dd-door.jpg", "Stags above the doorways", "img/dd-pattern.jpg", "img/sk-dd-9.jpg", "Pencil studies of stags, arches and fanlights, built into the collection's crest."],
      ["painted-ceiling", "img/tt-ceiling-detail.jpg", "The painted ceiling", "img/ce-final-teal.jpg", "img/sk-ce-1.jpg", "The ceiling medallion redrawn as a cut-paper motif and tested in colourways."],
      ["portrait-of-an-ancestor", "img/pt-portrait.jpg", "An ancestral portrait", "img/pt-pattern.jpg", "img/sk-pt-1.jpg", "A painted ancestor, framed in ornament taken from a carved cabinet."],
      ["ivory-table", "img/gr-marble.jpg", "The carved ivory table", "img/gr-dark.jpg", "img/sk-iv-1.jpg", "The eagle and scrollwork of one pedestal, drawn and scattered into a repeat."],
      ["lanterns", "img/ln-yellow.jpg", "The glass lanterns", "img/ln-pattern.jpg", "img/ln-drawing.jpg", "One lantern drawn in line, then linked by chains into a diagonal repeat."]
    ]],
    ["Beyond cloth", "The same archive and the same method, carried into identity, media and digital products. These cards show the finished work first; hover or tap to see where it came from.", [
      ["line", "img/wl-given-1.jpg", "One line, 2021", "img/wl-panel-1.jpg", "", "Six pencil frames, one line each: a story about a man called Baldy Lock and the dream he chased."],
      ["texere", "img/tt-hoop-1.jpg", "My woven samples", "img/tx-weave.jpg", "", "Type that behaves like thread: combed, unravelled, woven, pulled and repeated."],
      ["open-house", "img/obj-jali.jpg", "The carved jali screen", "img/oh-poster-wall.jpg", "", "A typeface built from the jali's grid and the doorway's arch, carrying a whole exhibition."],
      ["mir-what-remains", "img/mir-crest-line.jpg", "The doorway crest drawing", "mir-campaign/assets/stationery.png", "", "The doorway drawing carried onto a card, a scent strip and a sealed envelope."],
      ["hisaab", "img/hs-src-2.jpg", "A weekly cotton report", "img/hs-p-5.jpg", "", "One lawn suit walked back to the cotton field: what the picking paid, and what nobody publishes."],
      ["gad", "img/gd-src-3.jpg", "A verse of Shah Abdul Latif", "img/gd-p-1.jpg", "", "Sindhi and English on one baseline grid, measured rather than guessed, ending in a bilingual broadsheet."],
      ["heritage-loop", "img/obj-deer.jpg", "The mounted stags", "img/hl-phones.jpg", "", "A Digital Twin screen traces each print back to the room it came from."],
      ["editorial-mockups", "img/dd-colour.jpg", "The deer-crest print", "img/ed-vogue-margot.jpg", "", "The crest, tone on tone in pink, mapped onto a sculpted dress on a speculative cover."],
      ["greek-ornament", "img/gk-key-board.jpg", "Classical motifs, composed", "img/gk-key-pattern.jpg", "", "The same drawing-to-repeat method, applied to Greek and baroque ornament."],
      ["quiet-structure", "img/qs-02.jpg", "Letterforms on a grid", "img/qs-01.jpg", "", "A personal identity built with the same attention to structure and symmetry."]
    ]]
  ];
  const CASE_CAFE = { id: "mirs-cafe", kicker: "Case study · 2026", title: "Mir's Café", em: "from palace to chai house",
    intro: "The palace research was made for cloth. Mir's Café asks whether the same drawings could carry a whole brand: a chai house with cups, bags, billboards and an app, all built from what I drew on site.",
    why: R_CASE_WHY, pairsH: "From drawing to product", pairsP: "Five drawings from the palace archive became the whole graphic language. Hover over or tap a product to see the drawing behind it.",
    pairs: R_CASE_PAIRS, skAlt: "My drawing", stepsP: "From the first map of touchpoints to a finished campaign, in six steps.", steps: R_CASE_STEPS,
    palP: "The palette carries on from Heritage Loop's \"Earthy Regal\", then warms up for a café.", pal: R_CASE_PAL, learn: R_CASE_LEARN,
    cta: ["#/work/mirs-cafe", "img/mc-st-crosswalk.jpg", "Mir's Café"] };
  const CASE_OH = { id: "open-house", cls: "rs-case-oh", kicker: "Case study · 2026", title: "Open House", em: "a typeface from a palace",
    intro: "The palace research gave me patterns. Open House asks whether the building could give me letters: a typeface, Jharoka, and a complete exhibition identity built from two rules I found in the haveli.",
    why: [["Where it began", "Every earlier project took ornament from the palace. I wanted to go one level deeper and find the rules underneath the ornament, so that the building would be in the letters themselves."],
      ["The idea", "The carved jali divides light into a grid of openings. The teak doors end in a faceted arch. One gives a grid, the other gives a corner, and together they are enough to build an alphabet."],
      ["The rule", "Every letter sits on a 5 × 7 lattice of separate tiles. Wherever a tile ends a stroke, its corners are cut at 45°. Joins stay square and ends become arches, across all 61 glyphs."]],
    pairsH: "From the palace to the page", pairsP: "Five things I photographed in the haveli became the whole identity. Hover over or tap a piece to see where it came from.",
    pairs: [["img/obj-jali.jpg", "img/oh-specimen.jpg", "Type specimen", "The jali", "The 5 × 7 grid inside every letter"],
      ["img/dd-door.jpg", "img/oh-construction-h.jpg", "Letter construction", "The doorway", "The 45° cut on every stroke end"],
      ["img/hx-stair.jpg", "img/oh-poster.jpg", "Poster", "The stair", "The stepped strip of seven rooms"],
      ["img/cc-hall.jpg", "img/oh-tickets.jpg", "Tickets", "The lantern glass", "Lantern green, the lead colour"],
      ["img/cc-exterior.jpg", "img/oh-tote.jpg", "Tote", "The lime-washed walls", "Lime plaster, and the light on it"]],
    skAlt: "Source",
    stepsP: "From a photograph of a screen to a working font and a full exhibition, in six steps.",
    steps: [["Looking for a rule", "I went back through my photographs of the palace looking for structure rather than ornament: what repeats, what divides, where things end.", "img/obj-jali.jpg"],
      ["Two rules", "The jali gave the grid and the doorway gave the corner. I tested both on a single letter, H, until the joins read as solid and the ends read as arches.", "img/oh-construction-h.jpg"],
      ["Jharoka", "I built all 61 glyphs by the two rules and made them into an installable font, so the same letters work on a ticket stub and a poster.", "img/oh-specimen.jpg"],
      ["The identity", "Poster, tickets, badges and tote, set in Jharoka with the Urdu name, Khula Ghar, beside the English.", "img/oh-poster.jpg"],
      ["Jali light", "I placed every piece in the same light: sun falling through an arched jali window onto lime plaster, so the mockups belong to the house.", "img/oh-poster-wall.jpg"],
      ["Something to play with", "The case study lets visitors build a letter, type in Jharoka, move the jali light and make their own ticket.", "img/oh-badges.jpg"]],
    palP: "Haveli at Dusk: every colour is taken from a room in the palace.",
    pal: [["#134238", "Lantern green", "The green glass lanterns of the corridor.", "#EFE6D6"],
      ["#EFE6D6", "Lime plaster", "The lime-washed walls, and the ground of the tote.", "#134238"],
      ["#D6A13C", "Saffron brass", "The brass fittings, used for the arch cuts.", "#2A1A12"],
      ["#7A1C2A", "Kirmizi red", "The deep red of the red hall.", "#EFE6D6"],
      ["#2A1A12", "Teak", "The carved teak doors.", "#D6A13C"]],
    learn: [["Rules travel further than motifs", "A motif decorates one surface. A rule, applied everywhere, makes a whole system feel like one place."],
      ["Constraint makes character", "Only square tiles and one cut, yet every letter reads differently and still belongs to the set."],
      ["Light is part of the brand", "Showing the work in jali light did as much as any colour to make it belong to the haveli."]],
    cta: ["#/work/open-house", "img/oh-poster-wall.jpg", "Open House"] };
  const CASE_TX = { id: "texere", cls: "rs-case-tx", kicker: "Case study · 2026", title: "TEXERE", em: "type made of thread",
    intro: "My research taught me how cloth is made: warp and weft, over and under, repeat and drape. TEXERE asks what happens when letters follow the same rules. Text and textile share one root; in Latin, texere means to weave.",
    why: [["Where it began", "Every textile I made began as a drawing and ended as thread. I wanted a project that ran the other way: start from thread, and end with type."],
      ["The idea", "If a letter is only rows of weft, then everything a thread can do, a letter can do too. It can be combed, frayed, woven, pulled and repeated."],
      ["The rule", "No motion without a textile reason. Every interaction had to be something I had already done with my hands on a loom, a hoop or a print table."]],
    pairsH: "From the studio to the screen", pairsP: "Five things from my textile work became the five chapters. Hover over or tap a chapter to see where it came from.",
    pairs: [["img/cr-jq-red.jpg", "img/tx-warp.jpg", "Warp", "The jacquard file", "01 Warp: letters built from weft"],
      ["img/tt-look.jpg", "img/tx-unravel.jpg", "Unravel", "The silk cape", "02 Unravel: threads that fall"],
      ["img/tt-hoop-1.jpg", "img/tx-weave.jpg", "Weave", "The woven samples", "03 Weave: figure over twill"],
      ["img/ln-red.jpg", "img/tx-tension.jpg", "Tension", "Lanterns on chains", "04 Tension: letters on threads"],
      ["img/co-bronze.jpg", "img/tx-repeat.jpg", "Repeat", "My printed repeats", "05 Repeat: mirrored and half-dropped"]],
    skAlt: "Source",
    stepsP: "From a single thought about a Latin word to five chapters you can play with, in six steps.",
    steps: [["One word", "Text and textile share the root texere, to weave. That one fact became the whole brief.", "img/tx-warp.jpg"],
      ["Letters as rows", "I drew each word into the page and read it back row by row, so every letter became a set of weft threads that could move on their own.", "img/tx-unravel.jpg"],
      ["Thread physics", "Each thread springs back when combed, hangs when it lets go and swings when it is pulled, so the motion feels like cloth rather than animation.", "img/tx-tension.jpg"],
      ["A real loom", "The weave chapter follows real structure: the figure floats over the warp and a 2/2 twill holds the ground, row by row, with a shuttle crossing.", "img/tx-weave.jpg"],
      ["Variable type", "Headings are set in a variable serif. Weight and softness shift as the cursor comes close, so even the titles respond like fabric under a hand.", "img/tx-repeat.jpg"],
      ["The repeat", "The last chapter builds cloth the way my prints are built: one drawing, mirrored four ways and half-dropped.", "img/tx-repeat-indigo.jpg"]],
    palP: "Natural dyes: every colour is one a dyer would recognise.",
    pal: [["#15110e", "Loom", "The dark ground every thread is drawn on.", "#efe6d6"],
      ["#efe6d6", "Undyed cotton", "The thread before any dye.", "#15110e"],
      ["#b23a2e", "Madder", "The red root dye of the subcontinent.", "#efe6d6"],
      ["#1e3a6b", "Indigo", "The blue of the warp.", "#efe6d6"],
      ["#e0a43a", "Turmeric", "A bright yellow thread through the weft.", "#15110e"]],
    learn: [["Motion needs a reason", "Every movement worked better once it came from something real: combing, fraying, weaving or pulling."],
      ["Play teaches", "Visitors learn how a twill holds cloth together by weaving their own name, not by reading about it."],
      ["My craft travels", "What I know about textiles turned out to be a complete language for typography and interaction."]],
    cta: ["#/work/texere", "img/tx-repeat-indigo.jpg", "TEXERE"] };
  const CASE_WL = { id: "what-is-a-line", cls: "rs-case-wl", kicker: "Case study · 2021", title: "What Is a Line", em: "one line, one story",
    intro: "What is a line, and what can it do? For me, a line can start a story. In 2021 I drew six frames, put one dark line in each, and let every line decide what it wanted to become. The word line comes from the Latin linea, a linen thread, and like a thread, each one pulled the next scene along.",
    why: [["Where it began", "I'm a visual artist, and I love telling stories. I was curious how little I needed to start one. Six empty frames and six single lines felt like the smallest possible beginning."],
      ["The idea", "Don't plan the story. Look at each line until it looks like something, then draw what it wants to be. A U became a gap with a python in it. A circle became a head."],
      ["The rule", "Pencil only, and the dark line comes first. Everything else, the village, the river, the cemetery, the city, grows around it."]],
    pairsH: "From one line to a story", pairsP: "Five of the six frames. Each card shows the drawing; hover over or tap it to see the single line it started from.",
    pairs: [["img/wl-given-1.jpg", "img/wl-panel-1.jpg", "Scene 1", "A deep U", "The gap under the Dream Wall, and the python in it"],
      ["img/wl-given-2.jpg", "img/wl-panel-2.jpg", "Scene 2", "A closed curve", "Baldy Lock's head"],
      ["img/wl-given-3.jpg", "img/wl-panel-3.jpg", "Scene 3", "A branch", "The edge of the wall and the start of the bridge"],
      ["img/wl-given-4.jpg", "img/wl-panel-4.jpg", "Scene 4", "Two long parallels", "The only bridge across the river"],
      ["img/wl-given-6.jpg", "img/wl-panel-6.jpg", "Scene 6", "Two strokes and an oval", "The city he wanted, and the back of his head"]],
    skAlt: "The starting line",
    stepsP: "From six empty frames to a short film on paper, in six steps.",
    steps: [["Six empty frames", "I started with nothing planned: six frames and one dark line in each.", "img/wl-given-drawn.jpg"],
      ["Looking", "I looked at each line until it turned into something. The round one became a head, and the head got three hairs.", "img/wl-panel-2.jpg"],
      ["Drawing around it", "In pencil I built a world around each line: a village, fish in the river, a cemetery, a city of domes.", "img/wl-panel-1.jpg"],
      ["A character", "Baldy Lock: an ordinary guy on his Dream Wall, scared of a python and a bridge, wondering what his dream was worth.", "img/wl-panel-3.jpg"],
      ["The script", "I wrote the story in my notebook in English and Urdu, like a short film, with shots, dialogue and music cues.", "img/wl-board.jpg"],
      ["The ending", "He reaches the city he dreamed of and realises peace was never in the dream. A restless man in a mansion has a house, not a home.", "img/wl-panel-6.jpg"]],
    palP: "Pencil on paper, and one red to mark where each story started.",
    pal: [["#f1ede4", "Paper", "The sheet the frames were drawn on.", "#1b1a17"],
      ["#1b1a17", "Dark line", "The first line in every frame.", "#f1ede4"],
      ["#9a958c", "Pencil", "Everything that grew around it.", "#1b1a17"],
      ["#d2452b", "First-line red", "Used here to show where each story began.", "#f1ede4"]],
    learn: [["One line is enough", "I didn't need a plan. One line and some patience gave me a character, a fear and an ending."],
      ["Look longer", "The story was already in the lines. My job was to keep looking until I could see it."],
      ["Stories are my way in", "Whether it's a palace, a textile or a single pencil line, I understand things by turning them into stories."]],
    cta: ["#/work/line", "img/wl-given-drawn.jpg", "What Is a Line"] };
  const CASE_HS = { id: "hisaab", cls: "rs-case-hs", kicker: "Case study · 2026", title: "Hisaab", em: "the account of a lawn suit",
    intro: "My textiles begin with a print and end on a body. Hisaab follows the cloth the other way: back from the shop to the cotton field in Sindh, to ask how much of a lawn suit's price reaches the women who picked its cotton.",
    why: [["Where it began", "As a textile designer I know what goes into a print. I knew almost nothing about what went into the cotton underneath it, or who was paid for it."],
      ["The idea", "Treat one suit like a company and write its accounts. Start from a real price, walk the cloth back to the field, and put every rupee on the page."],
      ["The rule", "Only published numbers. Where none existed I made an estimate, marked it and showed the working, so the gaps stay visible instead of being filled in."]],
    pairsH: "From source to graphic", pairsP: "Five published figures became the whole piece. Each card shows the graphic; hover over or tap it to see the source behind it.",
    pairs: [["img/hs-src-5.jpg", "img/hs-p-5.jpg", "The lead", "A lawn suit, Summer 2026", "The swatch is the price; the red square is the picker's share"],
      ["img/hs-src-1.jpg", "img/hs-p-1.jpg", "Measure", "The brand's own listing", "5.75 m of lawn, drawn to scale"],
      ["img/hs-src-2.jpg", "img/hs-p-2.jpg", "Field", "Business Recorder, 21 Sep 2026", "Cloth walked back to 2.68 kg of raw cotton"],
      ["img/hs-src-3.jpg", "img/hs-p-3.jpg", "Statement", "Arab News, 2024", "A thousand squares; the picker's are red"],
      ["img/hs-src-4.jpg", "img/hs-p-4.jpg", "Days of work", "Government of Sindh, 2025–26", "The price measured in working days"]],
    skAlt: "Source",
    stepsP: "From one question to an account anyone can check, in six steps.",
    steps: [["A question", "Every lawn season the prints change and the question stays the same: what did the picking pay?", "img/hs-lead.jpg"],
      ["Collecting", "I gathered what is on the record: a brand's fabric lengths, the weekly cotton rates, the pickers' piece rate, the minimum and living wage.", "img/hs-method.jpg"],
      ["A model", "A small model turns metres of cloth into kilograms, cloth into raw cotton, and raw cotton into minutes and rupees.", "img/hs-field.jpg"],
      ["Drawing the gap", "Everything with no public record is hatched and drawn to the same scale as the rest. The hatching became the finding.", "img/hs-statement.jpg"],
      ["Something to play with", "Readers choose a suit and a picking rate and watch the account move. A link carries any version of it.", "img/hs-days.jpg"],
      ["Print and Urdu", "A clean madder buti print, Urdu headings with their English meanings, and a broadsheet that prints at A3.", "img/hs-measure.jpg"]],
    palP: "A financial daily crossed with a lawn catalogue.",
    pal: [["#f3dfcc", "Newsprint salmon", "The paper of a financial daily.", "#1c1814"],
      ["#1c1814", "Ledger ink", "Every figure and every rule.", "#f3dfcc"],
      ["#b3261e", "Madder", "The picker's share, and the buti print.", "#f3dfcc"],
      ["#c8912e", "Cotton ochre", "The fibre's value at the gin.", "#1c1814"],
      ["#2f3f6e", "Indigo", "The dyed trouser of the suit.", "#f3dfcc"]],
    learn: [["Missing numbers are data", "The most important part of the chart is the part nobody publishes. Drawing it to scale said more than any caption could."],
      ["Show the working", "Marking every estimate made the piece stronger, not weaker: anyone can check it, and anyone can change it."],
      ["A print has a supply chain", "A print is the last step of a long chain. Designing for cloth now includes asking who made the cloth."]],
    cta: ["#/work/hisaab", "img/hs-cover.jpg", "Hisaab"] };
  const CASE_GD = { id: "gad", cls: "rs-case-gd", kicker: "Case study · 2026", title: "Gaḍ", em: "Sindhi and English on one line",
    intro: "Open House set Urdu beside English in a typeface of my own. Gaḍ, گڏ, meaning together, goes further: a whole type system that lets Sindhi and English share a page as equals, built on measurements instead of guesses.",
    why: [["Where it began", "Signs, school books and newspapers in Sindh carry Sindhi and English together, and one of the two nearly always loses: too small, too tight, or running the wrong way."],
      ["The idea", "Treat the pair as one system: a shared unit, a shared baseline rhythm, and a mirrored layout where the two scripts meet at a spine."],
      ["The rule", "Measure, don't guess. The size ratio comes from the fonts themselves, and every Sindhi word on the page carries its English meaning."]],
    pairsH: "From source to system", pairsP: "Five findings became the system. Each card shows the result; hover over or tap it to see where it came from.",
    pairs: [["img/gd-src-1.jpg", "img/gd-p-1.jpg", "Matched size", "Measured in the browser", "1.66×: the English x-height meets the Sindhi bowl"],
      ["img/gd-src-4.jpg", "img/gd-p-4.jpg", "Leading", "Letters with four dots", "Sindhi gets its own leading on the grid"],
      ["img/gd-src-2.jpg", "img/gd-p-2.jpg", "Alphabet", "Sindhi Wikipedia", "All 52 letters, the Sindhi ones in red"],
      ["img/gd-src-5.jpg", "img/gd-p-5.jpg", "Hierarchy", "The 6 px unit", "Five levels, set for both scripts"],
      ["img/gd-src-3.jpg", "img/gd-p-3.jpg", "Broadsheet", "Shah Abdul Latif", "The verse, set on the Sindhi side of the spine"]],
    skAlt: "Source",
    stepsP: "From one measurement to a bilingual front page, in six steps.",
    steps: [["Pairing", "Lateef, made for Sindhi and named after Shah Abdul Latif, with Literata for English.", "img/gd-cover.jpg"],
      ["Measuring", "Naskh has no x-height, so I measured the bowls of ص ع ه and matched them to the English x-height: 1.66×.", "img/gd-metrics.jpg"],
      ["Three problems", "Size, dots and direction, each shown default against tuned, so the reason for every rule can be seen.", "img/gd-problems-tuned.jpg"],
      ["Fifty-two letters", "The whole alphabet in order, with joined forms and sounds, and the letters Sindhi adds picked out in red.", "img/gd-alphabet.jpg"],
      ["The grid", "One 6 px unit. English runs on 30 px lines and Sindhi on 54 px, and they meet every 270 px.", "img/gd-system.jpg"],
      ["The broadsheet", "A bilingual front page that puts the rules to work, and prints at A3.", "img/gd-sheet.jpg"]],
    palP: "One colour for each script, on newsprint.",
    pal: [["#f1eee6", "Newsprint", "The ground of the broadsheet.", "#16171b"],
      ["#16171b", "Ink", "Body text in both scripts.", "#f1eee6"],
      ["#243b8f", "English indigo", "Every English line and label.", "#f1eee6"],
      ["#d9432b", "Sindhi vermilion", "Every Sindhi line and label.", "#f1eee6"],
      ["#f8f6f0", "Specimen card", "The pages of the specimen.", "#16171b"]],
    learn: [["Equal has to be designed", "Two scripts only look equal when the system is built for both. The same point size is not the same size."],
      ["Rhythm over alignment", "Sindhi and English cannot share every line, but they can meet on a steady beat: nine lines to five."],
      ["Measure first", "Reading the fonts in the browser settled a question that taste alone could not."]],
    cta: ["#/work/gad", "img/gd-cover.jpg", "Gaḍ"] };
  const rsCase = (c) => `
      <section class="rs-case ${c.cls || ""}" id="${c.id}">
        <div class="rs-case-head">
          <h2 class="rs-kicker">${c.kicker}</h2>
          <h3 class="rs-case-title">${c.title}: <em>${c.em}</em></h3>
          <p>${c.intro}</p>
        </div>

        <div class="rs-case-why">${c.why.map(([h, p], i) => `<article class="reveal" style="--k:${i}"><span>${h}</span><p>${p}</p></article>`).join("")}</div>

        <div class="rs-case-block">
          <div class="rs-case-sub"><h4>${c.pairsH}</h4><p>${c.pairsP}</p></div>
          <div class="rs-case-pairs">${c.pairs.map((x) => `<figure class="cs-pair" tabindex="0"><div class="cs-pair-img"><img src="${x[1]}" alt="${x[2]}" loading="lazy"><img class="sk" src="${x[0]}" alt="${c.skAlt}: ${x[3]}" loading="lazy"></div><figcaption><b>${x[3]}</b><span>${x[4]}</span></figcaption></figure>`).join("")}</div>
        </div>

        <div class="rs-case-block">
          <div class="rs-case-sub"><h4>How it was made</h4><p>${c.stepsP}</p></div>
          <ol class="rs-case-steps">${c.steps.map((x, i) => `<li class="reveal" style="--k:${i}"><span>0${i + 1}</span><h5>${x[0]}</h5><p>${x[1]}</p></li>`).join("")}</ol>
        </div>

        <div class="rs-case-block">
          <div class="rs-case-sub"><h4>Where the colours come from</h4><p>${c.palP}</p></div>
          <div class="rs-case-pal">${c.pal.map((x) => `<div style="--c:${x[0]};--t:${x[3]}"><b>${x[1]}</b><span>${x[0]}</span><p>${x[2]}</p></div>`).join("")}</div>
        </div>

        <div class="rs-case-block rs-case-end">
          <div class="rs-case-find">${c.learn.map(([h, p], i) => `<article class="reveal" style="--k:${i}"><h5>${h}</h5><p>${p}</p></article>`).join("")}</div>
          <a class="rs-case-cta" href="${c.cta[0]}"><img src="${c.cta[1]}" alt=""><span><small>See the full project</small><b>${c.cta[2]}</b></span></a>
        </div>
      </section>`;
  const split = (t) => { let k = 0; return t.split(" ").map((w) => `<span class="w">${w.split("").map((c) => `<i style="--d:${k++ * 30}ms">${c}</i>`).join("")}</span>`).join(" "); };

  const viewResearch = () => `
    <section class="rs page-enter">
      <header class="rs-hero">
        <small>Field research · Hyderabad, Sindh</small>
        <h1 class="rs-split">${split("Reading a palace")}</h1>
        <p>Before any pattern, there was a building. This is the research behind my work: how I studied the Mir Hassan Ali Palace (1843), what I collected, and what I found.</p>
        <div class="rs-stats">${[[1843, "", "Year the palace was built"], [190, "+", "Photographs taken on site"], [49, "", "Sketchbook pages"], [15, "", "Heirlooms documented"], [7, "", "Compositions developed"]]
          .map(([n, s, l]) => `<div><b data-count="${n}" data-suffix="${s}">0</b><span>${l}</span></div>`).join("")}</div>
      </header>
      <div class="rs-marquee" aria-hidden="true"><div>${[...R_ROOMS, ...R_ROOMS].map((r) => `<img src="${r[1]}" alt="">`).join("")}</div></div>

      <section class="rs-method">
        <div class="rs-sticky"><div class="rs-frames">${R_STEPS.map((s, i) => `<img src="${s[2]}" alt="" data-f="${i}" class="${i ? "" : "on"}">`).join("")}</div><div class="rs-count"><b>01</b>/05</div></div>
        <div class="rs-steps"><h2 class="rs-kicker">Method</h2>${R_STEPS.map((s, i) => `<article data-s="${i}"><img class="rs-step-img" src="${s[2]}" alt="" loading="lazy"><span>0${i + 1}</span><h3>${s[0]}</h3><p>${s[1]}</p></article>`).join("")}</div>
      </section>

      <section class="rs-atlas" style="--n:${R_ROOMS.length}">
        <div class="rs-atlas-pin">
          <div class="rs-atlas-head"><h2 class="rs-kicker">Atlas of the palace</h2><p>Eight rooms, each with its own palette, sampled from my photographs.</p></div>
          <div class="rs-track">${R_ROOMS.map((r, i) => `<figure class="rs-room"><div class="rs-room-img"><img src="${r[1]}" alt="${r[2]}" loading="lazy"></div><figcaption><em>${String(i + 1).padStart(2, "0")}</em><b>${r[2]}</b><span>${r[3]}</span><div class="rs-pal">${R_PAL[r[0]].map((c) => `<i style="background:${c}" title="${c}"></i>`).join("")}</div></figcaption></figure>`).join("")}</div>
          <div class="rs-atlas-bar"><i></i></div>
        </div>
      </section>

      <section class="rs-archive">
        <div class="rs-archive-head"><h2 class="rs-kicker">The archive</h2><p>Hover over or tap an object to see my drawing of it.</p>
          <div class="rs-filters" role="tablist">${["all", "architecture", "light", "objects", "portraits", "heirlooms"].map((f, i) => `<button data-filter="${f}" aria-pressed="${i === 0}">${f}</button>`).join("")}</div></div>
        <div class="rs-grid">${R_SPEC.map((s) => `<figure class="rs-spec" data-cat="${s[0]}" tabindex="0"><div class="rs-spec-img"><img src="${s[2]}" alt="${s[1]}" loading="lazy">${s[3] ? `<img class="sk" src="${s[3]}" alt="My drawing of the ${s[1].toLowerCase()}" loading="lazy">` : ""}</div><figcaption><b>${s[1]}</b><span>${s[0]}${s[3] ? " · drawn" : ""}</span></figcaption></figure>`).join("")}</div>
      </section>

      <section class="rs-history">
        <h2 class="rs-kicker">Context</h2>
        <p class="rs-big reveal">Hyderabad in the 1840s, as British artists recorded it: the city gate, the fort above the river, the tower of the old city. The palace was built in this world.</p>
        <div class="rs-litho">${[["img/litho-gate.jpg", "The city gate"], ["img/litho-river.jpg", "The fort above the river"], ["img/litho-tower.jpg", "The tower of the old city"]].map((l, i) => `<figure style="--k:${i}"><img src="${l[0]}" alt="${l[1]}" loading="lazy"><figcaption>${l[1]}</figcaption></figure>`).join("")}</div>
        <p class="rs-credit">19th-century lithographs of Hyderabad, Sindh.</p>
      </section>

      <section class="rs-findings">
        <h2 class="rs-kicker">Findings</h2>
        <div class="rs-find">${[["Symmetry", "Almost every surface is mirrored: doors between windows, stags in pairs, medallions radiating from a centre. My repeats are built the same way."], ["Rhythm", "Lanterns, arches and chairs repeat at steady intervals down each corridor. That spacing sets the half-drop of the prints."], ["Light", "Coloured glass is everywhere, so the palette moves between deep grounds and jewel-bright accents."], ["Layering", "Ornament sits on ornament: portraits in carved frames, crests on painted grounds. The final prints layer figure over architecture in the same way."]]
          .map(([h, p], i) => `<article class="reveal" style="--k:${i}"><span>0${i + 1}</span><h3>${h}</h3><p>${p}</p></article>`).join("")}</div>
      </section>

      <section class="rs-thesis" id="thesis-paper">
        <div class="rs-thesis-head">
          <h2 class="rs-kicker">Thesis paper · 2025</h2>
          <h3 class="rs-case-title">${esc(PAPER.title)}: <em>the research paper</em></h3>
          <p>${esc(PAPER.sub)}.</p>
        </div>
        <div class="rs-thesis-grid">
          <div class="rs-thesis-abs reveal"><span>Abstract</span><p>${esc(PAPER.abstract)}</p>
            <dl>${PAPER.meta.filter((m) => m[0] !== "Programme").map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div>
          <ol class="rs-thesis-toc reveal">${PAPER.body.filter((b) => b.t === "h").map((b) => `<li><a href="#/research/paper"><span>0${b.n}</span>${esc(b.h)}</a></li>`).join("")}</ol>
        </div>
        <div class="rs-thesis-strip">${[["img/sk-ce-1.jpg", "Sketch"], ["img/comp-4.jpg", "Composition"], ["img/tt-hoop-1.jpg", "Sampling"], ["img/co-bronze.jpg", "Print"], ["img/tt-hero.jpg", "Final look"]].map(([src, l], i) => `<figure class="reveal" style="--k:${i}"><img src="${src}" alt="${l}" loading="lazy"><figcaption>${l}</figcaption></figure>`).join("")}</div>
        <div class="rs-thesis-cta"><a class="btn" href="#/research/paper">Read the full paper</a><a class="u" href="Threads-of-Time-Thesis-Mir-Zuhair.pdf" download>Download PDF (13 pages)</a></div>
      </section>

      <section class="rs-works" id="research-to-work">
        <div class="rs-works-head"><h2 class="rs-kicker">From research to work</h2><p>Each card starts with what I photographed. Hover over or tap it to see the work that came out of it, and, for the compositions, the drawing in between.</p></div>
        ${R_WORKS.map(([h, intro, items]) => `<div class="rs-works-group">
          <div class="rs-works-sub"><h4>${h}</h4><p>${intro}</p></div>
          <div class="rs-works-grid">${items.map(([slug, src, from, work, sk, line], i) => { const p = bySlug(slug); return `<figure class="rw-card reveal" style="--k:${i}" tabindex="0">
            <div class="rw-img">${sk
              ? `<img src="${src}" alt="Source: ${esc(from)}" loading="lazy"><img class="wk" src="${work}" alt="${esc(p.title)}" loading="lazy"><span class="rw-sk"><img src="${sk}" alt="My drawing" loading="lazy"><em>Drawing</em></span><span class="rw-tag"><i>Source</i><i>The work</i></span>`
              : `<img${slug === "quiet-structure" ? ' class="fit"' : ""} src="${work}" alt="${esc(p.title)}" loading="lazy"><img class="wk" src="${src}" alt="Source: ${esc(from)}" loading="lazy"><span class="rw-tag"><i>The work</i><i>Source</i></span>`}</div>
            <figcaption><small>${sk ? esc(from) : "From " + esc(from.charAt(0).toLowerCase() + from.slice(1))}</small><b>${esc(p.title)}</b><p>${esc(line)}</p><a href="#/work/${slug}">${esc(p.date || p.subtitle)} · View project →</a></figcaption>
          </figure>`; }).join("")}</div></div>`).join("")}
      </section>

      ${rsCase(CASE_CAFE)}
      ${rsCase(CASE_OH)}
      ${rsCase(CASE_TX)}
      ${rsCase(CASE_WL)}
      ${rsCase(CASE_HS)}
      ${rsCase(CASE_GD)}
    </section>`;


  /* ---------- Thesis paper ---------- */
  const viewPaper = () => {
    const P = PAPER; let fn = 0; const toc = [];
    const body = P.body.map((b) => {
      switch (b.t) {
        case "h": toc.push([b.n, b.h]); return `<h2 class="pp-h reveal" id="s${b.n}"><span>${b.n}</span>${esc(b.h)}</h2>`;
        case "h3": return `<h3 class="pp-h3">${esc(b.h)}</h3>`;
        case "p": return `<p>${b.text}</p>`;
        case "pull": return `<blockquote class="pp-pull reveal">${esc(b.text)}</blockquote>`;
        case "list": return `<ul class="pp-list">${b.items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
        case "table": return `<div class="pp-table c${b.head.length} reveal"><table><thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
        case "fig": return `<div class="pp-fig pp-${b.layout}${b.tall ? " tall" : ""} reveal">${b.items.map((i) => { fn++; return `<figure class="${i.contain ? "contain" : ""}"><img src="${i.src}" alt="${esc(i.cap)}" loading="lazy" data-cap="Fig. ${fn}. ${esc(i.cap)}"><figcaption><b>Fig. ${fn}</b> ${esc(i.cap)}</figcaption></figure>`; }).join("")}</div>`;
      }
      return "";
    }).join("");
    return `
    <article class="pp page-enter">
      <header class="pp-hero">
        <div class="pp-hero-txt">
          <small>Research paper · BFA Textile Design thesis · 2025</small>
          <h1>${esc(P.title)}</h1>
          <p class="pp-sub">${esc(P.sub)}</p>
          <dl class="pp-meta">${P.meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
          <div class="pp-actions"><a class="btn" href="Threads-of-Time-Thesis-Mir-Zuhair.pdf" download>Download paper (PDF)</a><a class="u" href="#/work/threads-of-time">See the project →</a></div>
        </div>
        <figure class="pp-hero-img"><img src="img/tt-hero.jpg" alt="The final look of Threads of Time"></figure>
      </header>
      <div class="pp-wrap">
        <aside class="pp-toc"><b>Contents</b><ol><li><a href="#abstract" data-jump>Abstract</a></li>${toc.map(([n, h]) => `<li><a href="#s${n}" data-jump><span>${n}</span>${esc(h)}</a></li>`).join("")}<li><a href="#sources" data-jump>Sources</a></li></ol></aside>
        <div class="pp-body">
          <section class="pp-abstract" id="abstract"><h2>Abstract</h2><p>${esc(P.abstract)}</p><p class="pp-kw"><b>Keywords</b> ${P.keywords.map(esc).join(" · ")}</p></section>
          ${body}
          <section class="pp-end" id="sources"><h2>Sources</h2><p>${esc(P.sources)}</p><h2>Acknowledgements</h2><p>${esc(P.thanks)}</p></section>
          <nav class="pager"><a href="#/research"><small>Back to</small><span>Research</span></a><a class="next" href="#/work/threads-of-time"><small>The project</small><span>Threads of Time</span></a></nav>
        </div>
      </div>
    </article>`;
  };

  const viewAbout = () => `
    <section class="about me page-enter">
      <div class="collage">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, i) => `<figure style="--i:${i}"><img src="img/me/${String(n).padStart(2, "0")}.jpg" alt="Mir Zuhair" loading="${i < 6 ? "eager" : "lazy"}"></figure>`).join("")}</div>
      <div class="me-text">
        <h1>Hi! I'm Mir.</h1>
        <p class="lead">I'm a textile and communication designer from Hyderabad, Sindh. I grew up around my family's 1843 palace, among its painted ceilings, glass lanterns and carved doors. Somewhere between sketching them and printing them onto silk, I found my language.</p>
        <p class="lead">I graduated with a BFA in Textile Design from SABS University of Art, Design and Heritage in 2025. My work sits where heritage meets systems: I draw what the past left behind, then turn it into patterns, identities and digital experiences people can actually wear, hold and use.</p>
        <p class="lead">I'm a <u>curious</u>, <u>detail-obsessed</u> and quietly <u>sentimental</u> designer. I care about the story behind a thing as much as the thing itself. Next, I want to take that storytelling further into communication design.</p>
        <p class="lead">Outside the studio you'll find me chasing good light, by the sea, in galleries, or at an airport on my way somewhere new.</p>
        <p class="lead">View my <a class="u" href="#/cv">CV</a>.</p>
      </div>
    </section>`;

  const viewCV = () => `
    <section class="cv page-enter">
      <header class="cv-head">
        <div><h1>Mir Zuhair</h1><p>Textile &amp; Communication Designer · Visual Researcher</p></div>
        <div class="cv-actions"><span>Hyderabad, Sindh, Pakistan</span><a href="mailto:zohairtalpur13@gmail.com">zohairtalpur13@gmail.com</a><a class="btn" href="Mir-Zuhair-CV.pdf" download>Download CV (PDF)</a></div>
      </header>
      ${CV.map((s) => `<div class="cv-sec reveal"><h2>${esc(s.h)}</h2><div>${s.items.map((it) => `
        <div class="cv-item">${it.t ? `<div class="cv-row"><h3>${esc(it.t)}</h3>${it.d ? `<span>${esc(it.d)}</span>` : ""}</div>` : ""}${it.s ? `<p class="cv-sub">${esc(it.s)}</p>` : ""}${it.p ? `<p>${esc(it.p)}</p>` : ""}${it.l ? `<ul>${it.l.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</div>`).join("")}</div></div>`).join("")}
    </section>`;

  /* ---------- Hero: the House of Talpur, 1843 → 2025 ---------- */
  const HX_PRINTS = [
    ["img/litho-gate.jpg", "The city gate, Hyderabad"],
    ["img/litho-river.jpg", "The fort above the river"],
    ["img/litho-tower.jpg", "The tower of the old city"],
  ];
  // [image, title, note]
  const HX_OBJECTS = [
    ["h-coat-red", "Court coat", "Crimson velvet, gold-wire embroidery"],
    ["h-sword", "Talwar and scabbard", "Gilt hilt, pierced gold scabbard"],
    ["h-jacket-back", "Ceremonial jacket", "Aubergine velvet, gold zardozi"],
    ["h-daggers", "Katar and jewelled dagger", "Enamel, rubies, jade"],
    ["h-cap-gold", "Sindhi cap", "Silver wire, seed pearls, garnets"],
    ["h-pistol", "Flintlock pistol", "Gold and enamel inlay"],
    ["h-coat-purple", "Velvet robe", "Silver-wire leaf embroidery"],
    ["h-cane-jade", "Walking cane", "Carved jade, engraved gold collar"],
    ["h-jacket-front", "Waistcoat", "Gold and silver leaves on velvet"],
    ["h-sword-hilt", "Sword hilt", "Gilt beast-head grip"],
    ["h-cap-turq", "Sindhi cap", "Turquoise silk, coloured stones"],
    ["h-sprinkler", "Rosewater sprinkler", "Bohemian ruby glass, gilt enamel"],
    ["h-cane-ivory", "Walking cane", "Carved ivory, cherubs and vines"],
    ["h-gun", "Musket barrel", "Damascus steel, gold koftgari"],
    ["h-goblet", "Goblet", "Cut green glass"],
  ];
  const HX_PAIRS = ["Deer trophy", "Carved eagle", "Glass lantern", "Carriage", "Chandelier", "The corridor"];
  const CH = [
    [0, "", ""],
    [.05, "I", "The old city · 19th-century lithographs"],
    [.23, "II", "The palace · Mir Hassan Ali Palace, 1843"],
    [.44, "III", "The treasury · heirlooms of the palace"],
    [.67, "IV", "From object to drawing"],
    [.89, "V", "2025 · Threads of Time"],
  ];
  // timeline, as fractions of the hero's scroll length
  const T = { intro: [0, .07], prints: [.05, .25], wall: [.23, .45], museum: [.44, .68], pairs: [.67, .9], fin: [.89, .99] };
  let heroOff = null;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const lerp = (a, b, t) => a + (b - a) * t;
  function initHero() {
    if (heroOff) { heroOff(); heroOff = null; }
    const hx = document.getElementById("hx");
    if (!hx) return;
    const $ = (q) => hx.querySelector(q), $$ = (q) => [...hx.querySelectorAll(q)];
    const intro = $(".hx-intro"), prints = $$(".hx-print"), wall = $(".hx-wall"), grid = $(".hx-grid"), tiles = $$(".hx-tile"), centre = $(".hx-tile.c");
    const museum = $(".hx-museum"), track = $(".hx-track"), pieces = $$(".hx-piece");
    const pairsBox = $(".hx-pairs"), pairs = $$(".hx-pair"), fin = $(".hx-finale");
    const year = $(".hx-year span"), cap = $(".hx-cap"), capB = $(".hx-cap b"), capS = $(".hx-cap span"), bar = $(".hx-progress i");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) hx.classList.add("still");
    let last = -1, raf = 0, chap = -1, geo = null;
    const show = (el, on) => { el.style.visibility = on ? "visible" : "hidden"; };

    const WALL_S = .78;
    function measure() {
      grid.style.transform = `translate(-50%,-50%) scale(${WALL_S})`; track.style.transform = "none";
      const c = centre.getBoundingClientRect();
      geo = { cr: { x: c.left, y: c.top, w: c.width, h: c.height }, tw: track.scrollWidth };
    }

    function frame() {
      raf = 0;
      const total = hx.offsetHeight - innerHeight;
      const P = reduce ? 1 : clamp(-hx.getBoundingClientRect().top / total);
      if (Math.abs(P - last) < 0.0003) return; last = P;
      if (!geo) measure();
      hx.style.setProperty("--age", (1 - seg(P, .6, .95)).toFixed(3));
      bar.style.transform = `scaleX(${P})`;
      hx.style.setProperty("--hint", (1 - seg(P, 0, .03)).toFixed(3));

      // 0. title card
      const io = seg(P, .03, .08);
      intro.style.opacity = 1 - io; intro.style.transform = `translateY(${-io * 6}vh)`; show(intro, io < 1);

      // I. lithographs: laid on the table one by one, then gathered and lifted away
      prints.forEach((el, i) => {
        const a = T.prints[0] + i * .045, t = easeOut(seg(P, a, a + .05)), out = ease(seg(P, T.prints[1] - .04, T.prints[1]));
        const pos = [[-24, 4, -5], [0, -3, 2], [24, 5, -2]][i];
        show(el, t > 0 && out < 1);
        el.style.opacity = t * (1 - out);
        el.style.transform = `translate(calc(-50% + ${lerp(pos[0] * 1.8, pos[0], t)}vw), calc(-50% + ${lerp(40, pos[1], t) - out * 30}vh)) rotate(${lerp(pos[2] * 3, pos[2], t)}deg) scale(${1 - out * .15})`;
      });

      // II. the palace: one room fills the screen, then the camera pulls back to the whole wall
      const wIn = seg(P, T.wall[0], T.wall[0] + .03), z = ease(seg(P, T.wall[0] + .03, T.wall[1] - .05)), wOut = ease(seg(P, T.wall[1] - .04, T.wall[1] + .01));
      show(wall, wIn > 0 && wOut < 1);
      wall.style.opacity = wIn * (1 - wOut);
      // the full-resolution photograph shrinks into its place on the wall (resized, never scaled up, so it stays sharp)
      grid.style.transform = `translate(-50%,-50%) translateY(${-wOut * 30}vh) scale(${WALL_S})`;
      tiles.forEach((t, i) => { if (t !== centre) t.style.opacity = seg(z, .25 + (i % 5) * .04, .7 + (i % 5) * .04); });
      const sharp = wall.querySelector(".hx-sharp"), cr = geo.cr;
      sharp.style.left = lerp(0, cr.x, z) + "px";
      sharp.style.top = lerp(0, cr.y, z) - wOut * innerHeight * .3 + "px";
      sharp.style.width = lerp(innerWidth, cr.w, z) + "px";
      sharp.style.height = lerp(innerHeight, cr.h, z) + "px";
      sharp.style.boxShadow = `0 ${z * 16}px ${z * 30}px -${z * 22}px rgba(60,35,10,.7)`;

      // III. the cabinet: a museum wall that moves sideways as you scroll down
      const mIn = seg(P, T.museum[0], T.museum[0] + .03), mx = ease(seg(P, T.museum[0] + .01, T.museum[1] - .02)), mOut = seg(P, T.museum[1] - .02, T.museum[1] + .01);
      show(museum, mIn > 0 && mOut < 1);
      museum.style.opacity = mIn * (1 - mOut);
      const x = lerp(innerWidth * .9, -(geo.tw - innerWidth * .55), mx);
      track.style.transform = `translateX(${x}px)`;
      pieces.forEach((el) => {
        const r = el.getBoundingClientRect(), d = (r.left + r.width / 2 - innerWidth / 2) / innerWidth;
        el.style.setProperty("--d", d.toFixed(3));
        el.querySelector("img").style.filter = `sepia(${clamp(Math.abs(d) * 1.6)}) saturate(${1 - clamp(Math.abs(d)) * .4})`;
      });

      // IV. object to drawing: each photograph wipes into the pencil drawing made from it
      const pIn = seg(P, T.pairs[0], T.pairs[0] + .02), pOut = seg(P, T.pairs[1] - .015, T.pairs[1] + .01);
      show(pairsBox, pIn > 0 && pOut < 1);
      pairsBox.style.opacity = pIn * (1 - pOut);
      const pn = pairs.length, span = (T.pairs[1] - T.pairs[0] - .02) / pn;
      pairs.forEach((el, i) => {
        const a = T.pairs[0] + .01 + i * span, local = seg(P, a - (i ? span * .3 : 0), a + span);
        const enter = easeOut(seg(local, 0, .22)), wipe = ease(seg(local, .22, .68)), exit = ease(seg(local, .76, 1));
        const lastOne = i === pn - 1;
        show(el, local > 0 && (lastOne || exit < 1));
        el.style.opacity = enter * (lastOne ? 1 : 1 - exit);
        el.style.transform = `translate(calc(-50% + ${(1 - enter) * 30 - (lastOne ? 0 : exit * 30)}vw), -50%) rotate(${(1 - enter) * 4}deg)`;
        el.style.setProperty("--w", wipe.toFixed(3));
      });

      // V. the present
      const f = ease(seg(P, T.fin[0], T.fin[1]));
      show(fin, f > 0);
      fin.style.setProperty("--f", f.toFixed(3));
      fin.querySelectorAll(".hx-final span").forEach((s, i) => {
        const t = ease(seg(f, i * .045, .5 + i * .045));
        s.style.transform = `translateY(${(1 - t) * (i % 2 ? 105 : -105)}%)`;
      });
      hx.classList.toggle("fin-on", f > .3);

      // chapter titles and the year
      let ci = 0; CH.forEach((c, i) => { if (P >= c[0]) ci = i; });
      if (ci !== chap) { chap = ci; cap.classList.remove("in"); void cap.offsetWidth; capB.textContent = CH[ci][1]; capS.textContent = CH[ci][2]; if (ci) cap.classList.add("in"); }
      const yr = P < T.wall[0] ? 1843 : lerp(1843, 2025, ease(seg(P, T.wall[0], T.fin[0] + .04)));
      year.textContent = Math.round(yr);
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); document.body.classList.toggle("on-hero", hx.getBoundingClientRect().bottom > 80); };
    const onResize = () => { geo = null; last = -1; onScroll(); };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    hx.querySelectorAll("img").forEach((im) => im.complete || im.addEventListener("load", onResize, { once: true }));
    onScroll(); frame();
    heroOff = () => { document.body.classList.remove("on-hero"); removeEventListener("scroll", onScroll); removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }

  /* ---------- Colour flow: the page takes on each project's tone as you scroll ---------- */
  let flowOff = null;
  function initFlow() {
    if (flowOff) { flowOff(); flowOff = null; }
    const root = document.documentElement;
    const cards = [...app.querySelectorAll(".ws-item[data-tone], .card[data-tone]")];
    if (!cards.length) { root.style.removeProperty("--flow"); document.body.classList.remove("flowing"); return; }
    document.body.classList.add("flowing");
    const brief = app.querySelector(".intro-brief");
    const set = (c) => root.style.setProperty("--flow", c);
    set("#e8d9bd");
    let raf = 0;
    const pick = () => { raf = 0;
      const mid = innerHeight * .5;
      if (brief && brief.getBoundingClientRect().bottom > mid) { set("#e8d9bd"); return; }
      let best = null, bd = 1e9;
      cards.forEach((c) => { const r = c.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - mid); if (d < bd) { bd = d; best = c; } });
      if (best) set(best.dataset.tone || "#fbfaf7");
      const g = app.querySelector(".ws, .grid"); if (g && g.getBoundingClientRect().bottom < mid) set("#fbfaf7");
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(pick); };
    addEventListener("scroll", on, { passive: true }); on();
    flowOff = () => { removeEventListener("scroll", on); document.body.classList.remove("flowing"); root.style.removeProperty("--flow"); };
  }

  /* ---------- Work stack: each project opens up to full screen ---------- */
  let wsOff = null;
  function initWorkStack() {
    if (wsOff) { wsOff(); wsOff = null; }
    const items = [...app.querySelectorAll(".ws-item")];
    if (!items.length) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cl = (v) => Math.min(1, Math.max(0, v)), ez = (t) => 1 - Math.pow(1 - t, 3);
    let raf = 0;
    const frame = () => { raf = 0;
      const vh = innerHeight;
      items.forEach((it) => {
        const r = it.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 1.2) return;
        const p = reduce ? .7 : cl(-r.top / (it.offsetHeight - vh));      // 0 → 1 while pinned
        const enter = reduce ? 1 : ez(cl((vh - r.top) / vh));                // as it slides in
        const open = ez(cl(p / .55));                                        // frame opening
        const leave = cl((p - .82) / .18);                                   // pushed back by the next one
        it.style.setProperty("--open", open.toFixed(4));
        it.style.setProperty("--enter", enter.toFixed(4));
        it.style.setProperty("--leave", leave.toFixed(4));
        it.classList.toggle("ws-on", open > .45);
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(frame); };
    addEventListener("scroll", on, { passive: true }); addEventListener("resize", on); frame();
    wsOff = () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }

  /* ---------- Project page motion ---------- */
  let pjOff = null;
  function initProject() {
    if (pjOff) { pjOff(); pjOff = null; }
    const pj = app.querySelector(".pj");
    if (!pj) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cl = (v) => Math.min(1, Math.max(0, v));
    const hero = pj.querySelector(".pj-hero"), lit = [...pj.querySelectorAll(".pj-lit span")], st = pj.querySelector(".pj-statement");
    const media = [...pj.querySelectorAll(".pj-blocks .blk figure")];
    media.forEach((f, i) => { f.classList.add("pj-reveal"); f.style.setProperty("--d", (i % 4) * 90 + "ms"); });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("pj-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
    media.forEach((f) => io.observe(f)); pj.querySelectorAll(".pj-fact, .blk.step, .pj-next").forEach((f) => io.observe(f));
    let raf = 0;
    const frame = () => { raf = 0; const vh = innerHeight;
      if (hero) { const p = cl(-hero.getBoundingClientRect().top / vh); hero.style.setProperty("--h", reduce ? 0 : p.toFixed(4)); }
      if (st && lit.length) { const r = st.getBoundingClientRect(); const p = reduce ? 1 : cl((vh * .85 - r.top) / (r.height + vh * .35)); const n = Math.round(p * lit.length); lit.forEach((w, i) => w.classList.toggle("on", i < n)); }
      pj.querySelectorAll(".pj-reveal:not(.pj-in), .pj-blocks .blk.step:not(.pj-in), .pj-next:not(.pj-in)").forEach((f) => { if (f.getBoundingClientRect().top < vh * .92) f.classList.add("pj-in"); });
      if (!reduce) media.forEach((f) => { const r = f.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return; const img = f.querySelector("img"); if (img) img.style.setProperty("--py", ((r.top + r.height / 2 - vh / 2) / vh * -18).toFixed(2) + "px"); });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(frame); };
    addEventListener("scroll", on, { passive: true }); addEventListener("resize", on); frame();
    pjOff = () => { removeEventListener("scroll", on); removeEventListener("resize", on); io.disconnect(); };
  }

  /* ---------- Detail tour: the camera moves into one detail after another ---------- */
  /* ---------- Editorial spiral: ring of looks, then each look in turn -> zoom into its print ---------- */
  const SP_INTRO = 1, SP_OUTRO = .5;
  function viewSpiral(p) {
    const S = p.spiral, n = S.items.length;
    // origin that keeps the focus point in the centre of the frame at full zoom
    const org = (c, z) => (Math.min(1 - .5 / z, Math.max(.5 / z, c)) - .5 / z) / (1 - 1 / z) * 100;
    return `<section class="sp" aria-label="Editorial looks" style="height:${(SP_INTRO + n * S.unit + SP_OUTRO) * 100 + 100}vh">
      <div class="sp-stage">
        <div class="sp-top"><span>Mir Zuhair</span><span>Past<br>to<br>future</span></div>
        <div class="sp-bg"><i class="sp-print"></i><i class="sp-sheen"></i></div>
        <h2 class="sp-title">${S.title.map(esc).join("<br>")}</h2>
        <div class="sp-ring">${S.items.map((it) => `<figure class="sp-card" style="--ar:${it.ar}"><img src="${it.src}" alt="" decoding="async" style="transform-origin:${org(it.f[0], it.f[2])}% ${org(it.f[1], it.f[2])}%"></figure>`).join("")}</div>
        <div class="sp-cap">${S.items.map((it, k) => `<div class="sp-c"><em>${String(k + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")} · The print, up close</em><span>${esc(it.cap)}</span></div>`).join("")}</div>
        <div class="sp-foot"><span>${esc(p.tags)}</span><span>Scroll</span></div>
      </div>
    </section>`;
  }

  let spOff = null;
  function initSpiral() {
    if (spOff) { spOff(); spOff = null; }
    const sp = app.querySelector(".sp"); if (!sp) return;
    const slug = location.hash.split("/")[2], S = (PROJECTS.find((x) => x.slug === slug) || {}).spiral; if (!S) return;
    const cards = [...sp.querySelectorAll(".sp-card")], imgs = cards.map((c) => c.querySelector("img")), n = cards.length;
    const ars = S.items.map((it) => it.ar), caps = [...sp.querySelectorAll(".sp-c")];
    const title = sp.querySelector(".sp-title"), top = sp.querySelector(".sp-top"), foot = sp.querySelector(".sp-foot");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cl = (v) => Math.min(1, Math.max(0, v)), ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const seg = (v, a, b) => cl((v - a) / (b - a));
    const t0 = performance.now(), INTRO_MS = 2200;
    const stage = sp.querySelector(".sp-stage"), bg = sp.querySelector(".sp-bg"), print = sp.querySelector(".sp-print");
    let raf = 0, capOn = -1, bgOn = -1;
    const frame = () => {
      const W = innerWidth, H = innerHeight, m = Math.min(W, H * .8);
      const R = m * .37, base = m * Math.min(.17, 2.1 / n);
      // the spiral plays by itself on arrival; scroll then drives rotation and the close-ups
      const a = reduce ? 1 : ease(cl((performance.now() - t0) / INTRO_MS));
      const r = sp.getBoundingClientRect(), total = SP_INTRO + n * S.unit + SP_OUTRO;
      const P = cl(-r.top / Math.max(1, sp.offsetHeight - H)) * total;
      const spin = P / total * Math.PI * 2.2;
      const L = (P - SP_INTRO) / S.unit, k = Math.floor(L), t = L - k;       // active look and its local progress
      const act = L >= 0 && k < n ? k : -1;
      const g = act < 0 ? 0 : ease(seg(t, 0, .22)) * (1 - ease(seg(t, .8, 1)));   // grow to centre, then return
      const z = act < 0 ? 0 : ease(seg(t, .22, .5)) * (1 - ease(seg(t, .66, .84))); // zoom into the print, then out
      cards.forEach((c, j) => {
        const th = -Math.PI / 2 + (j / n) * Math.PI * 2 + (1 - a) * Math.PI * 1.6 + spin;
        let x = Math.cos(th) * R * a, y = Math.sin(th) * R * a, w = base, o = cl(a * 1.6), rot = (1 - a) * -40;
        if (j === act) {
          const tw = Math.min(H * .78 / ars[j], W * .86);
          x *= 1 - g; y *= 1 - g; w = base + (tw - base) * g; c.style.zIndex = 5;
        } else {
          o *= 1 - g * .85; c.style.zIndex = 1;
        }
        c.style.width = w + "px";
        c.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rot}deg)`;
        c.style.opacity = o;
        imgs[j].style.transform = j === act && z > 0 ? `scale(${1 + (S.items[j].f[2] - 1) * z})` : "";
      });
      title.style.opacity = cl(a * 1.4) * (1 - g);
      title.style.transform = `translate(-50%, -50%) scale(${.85 + .15 * a})`;
      top.style.opacity = foot.style.opacity = cl(a * 1.4) * (1 - g);
      // the white space takes on the colour of the dress, with a pale echo of its print
      if (act >= 0 && act !== bgOn) {
        bgOn = act; const it = S.items[act];
        stage.style.setProperty("--c", it.c);
        print.style.backgroundImage = `url(${it.src})`;
        print.style.backgroundSize = `${it.f[2] * 140}% auto`;
        print.style.backgroundPosition = `${it.f[0] * 100}% ${it.f[1] * 100}%`;
      }
      bg.style.opacity = g;
      print.style.transform = `scale(${1.15 - .15 * z})`;
      const on = act >= 0 && z > .6 ? act : -1;
      if (on !== capOn) { capOn = on; caps.forEach((cp, j) => cp.classList.toggle("on", j === on)); }
    };
    const intro = () => { frame(); if (performance.now() - t0 < INTRO_MS + 50) raf = requestAnimationFrame(intro); };
    const onS = () => frame();
    addEventListener("scroll", onS, { passive: true }); addEventListener("resize", onS);
    raf = requestAnimationFrame(intro);
    spOff = () => { removeEventListener("scroll", onS); removeEventListener("resize", onS); cancelAnimationFrame(raf); };
  }

  let tourOff = null;
  function initTour() {
    if (tourOff) { tourOff(); tourOff = null; }
    const tour = app.querySelector(".tour"); if (!tour) return;
    const slug = location.hash.split("/")[2]; const T = TOURS[slug]; if (!T) return;
    const img = tour.querySelector(".tour-img"), box = tour.querySelector(".tour-box"), caps = [...tour.querySelectorAll(".tour-c")], dots = [...tour.querySelectorAll(".tour-dots i")];
    const pts = T.pts, n = pts.length, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cl = (v) => Math.min(1, Math.max(0, v)), ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    let raf = 0, cur = -1;
    const frame = () => {
      if (!img.naturalWidth) return;
      const W = innerWidth, H = innerHeight;
      const fit = Math.min(W * .86 / img.naturalWidth, H * .78 / img.naturalHeight);
      const w = img.naturalWidth * fit, h = img.naturalHeight * fit;
      box.style.width = w + "px"; box.style.height = h + "px";
      const r = tour.getBoundingClientRect(); const P = reduce ? 0 : cl(-r.top / (tour.offsetHeight - H)) * (n - 1);
      const i = Math.min(n - 2, Math.floor(P)), f = n > 1 ? ease(cl((P - i - .15) / .7)) : 0;
      const a = pts[Math.max(0, i)], b = pts[Math.min(n - 1, i + 1)];
      const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f, z = a[2] + (b[2] - a[2]) * f;
      // keep the focus point centred, clamped so the image never leaves empty gaps once zoomed
      let tx = w / 2 - x * w * z, ty = h / 2 - y * h * z;
      tx = Math.min(Math.max(tx, w - w * z - (W - w) / 2 * (z > 1 ? 1 : 0)), (W - w) / 2 * (z > 1 ? 1 : 0));
      ty = Math.min(Math.max(ty, h - h * z - (H - h) / 2 * (z > 1 ? 1 : 0)), (H - h) / 2 * (z > 1 ? 1 : 0));
      img.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`;
      tour.style.setProperty("--z", ((z - 1) / 3).toFixed(3));
      const k = Math.round(P);
      if (k !== cur) { cur = k; caps.forEach((c, j) => c.classList.toggle("on", j === k)); dots.forEach((d, j) => d.classList.toggle("on", j <= k)); }
    };
    const on = () => frame();
    addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    img.complete ? frame() : img.addEventListener("load", frame, { once: true });
    tourOff = () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }

  let resOff = null;
  function initResearch() {
    if (resOff) { resOff(); resOff = null; }
    const rs = app.querySelector(".rs");
    if (!rs) return;
    // counters
    const cio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      const el = e.target, to = +el.dataset.count, from = to > 1000 ? 1700 : 0, t0 = performance.now();
      const tick = (t) => { const k = Math.min(1, (t - t0) / 1600), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); el.textContent = v + (k === 1 ? el.dataset.suffix : ""); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: .6 });
    rs.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));
    // method: swap image as each step passes the middle
    const frames = [...rs.querySelectorAll(".rs-frames img")], count = rs.querySelector(".rs-count b");
    const sio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = +e.target.dataset.s;
      rs.querySelectorAll(".rs-steps article").forEach((a) => a.classList.toggle("on", a === e.target));
      frames.forEach((f, j) => f.classList.toggle("on", j === i)); count.textContent = "0" + (i + 1);
    }), { rootMargin: "-45% 0px -45% 0px" });
    rs.querySelectorAll(".rs-steps article").forEach((a) => sio.observe(a));
    // atlas: vertical scroll drives horizontal travel
    const atlas = rs.querySelector(".rs-atlas"), track = rs.querySelector(".rs-track"), bar = rs.querySelector(".rs-atlas-bar i");
    let raf = 0;
    const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => {
      raf = 0;
      const r = atlas.getBoundingClientRect(), total = atlas.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const max = track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft);
      track.style.transform = `translateX(${-p * Math.max(0, max)}px)`;
      bar.style.transform = `scaleX(${p})`;
      
      rs.querySelectorAll(".rs-litho figure").forEach((f) => { const b = f.getBoundingClientRect(); f.style.setProperty("--y", ((b.top + b.height / 2 - innerHeight / 2) * -.08).toFixed(1) + "px"); });
    }); };
    addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); onScroll();
    // archive filters with a FLIP transition
    const specs = [...rs.querySelectorAll(".rs-spec")];
    rs.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => {
      rs.querySelectorAll("[data-filter]").forEach((x) => x.setAttribute("aria-pressed", x === b));
      const first = new Map(specs.map((s) => [s, s.getBoundingClientRect()]));
      specs.forEach((s) => s.classList.toggle("out", b.dataset.filter !== "all" && s.dataset.cat !== b.dataset.filter));
      specs.forEach((s) => { if (s.classList.contains("out")) return; const a = first.get(s), z = s.getBoundingClientRect(); s.animate([{ transform: `translate(${a.left - z.left}px, ${a.top - z.top}px)` }, { transform: "none" }], { duration: 600, easing: "cubic-bezier(.2,.7,.2,1)" }); });
    }));
    specs.forEach((s) => s.addEventListener("click", () => s.classList.toggle("flip")));
    rs.querySelectorAll(".cs-pair").forEach((s) => s.addEventListener("click", () => s.classList.toggle("flip")));
    rs.querySelectorAll(".rw-card").forEach((s) => s.addEventListener("click", (e) => { if (!e.target.closest("a")) s.classList.toggle("flip"); }));
    resOff = () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cio.disconnect(); sio.disconnect(); };
  }

  const MAIL_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 6l9 7 9-7"/></svg>';
  const viewContact = () => `
    <section class="contact-page page-enter">
      <div class="cp-left">
        <h1>Let's work<br>together!</h1>
        <p><a href="mailto:zohairtalpur13@gmail.com">zohairtalpur13@gmail.com</a></p>
        <p>Based in Hyderabad, Sindh, Pakistan</p>
        <p class="cp-icons"><a href="mailto:zohairtalpur13@gmail.com" aria-label="Email">${MAIL_SVG}</a></p>
      </div>
      <form class="cp-form" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact">
        <p hidden><label>Leave this empty <input name="bot-field"></label></p>
        <fieldset><legend>Name</legend>
          <div class="cp-row">
            <label><b>First Name <span>(required)</span></b><input name="first-name" required autocomplete="given-name"></label>
            <label><b>Last Name <span>(required)</span></b><input name="last-name" required autocomplete="family-name"></label>
          </div>
        </fieldset>
        <label><b>Email <span>(required)</span></b><input type="email" name="email" required autocomplete="email"></label>
        <label><b>Message <span>(required)</span></b><textarea name="message" rows="5" required></textarea></label>
        <button class="cp-send" type="submit">Send</button>
        <p class="cp-status" role="status"></p>
      </form>
    </section>`;

  /* ---------- Router ---------- */
  const setNav = (key) => document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === key));

  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const [seg, slug] = h.split("/");
    let title = "Mir Zuhair — Design Portfolio";
    if (seg === "work" && bySlug(slug)) {
      const p = bySlug(slug);
      app.innerHTML = viewProject(p); setNav("work"); title = `${p.title} — Mir Zuhair`;
    } else if (seg === "research" && slug === "paper") {
      app.innerHTML = viewPaper(); setNav("research"); title = "Threads of Time: Research Paper — Mir Zuhair";
    } else if (seg === "research") {
      app.innerHTML = viewResearch(); setNav("research"); title = "Research — Mir Zuhair";
    } else if (seg === "cv") {
      app.innerHTML = viewCV(); setNav("cv"); title = "CV — Mir Zuhair";
    } else if (seg === "contact") {
      app.innerHTML = viewContact(); setNav("contact"); title = "Contact — Mir Zuhair";
    } else if (seg === "about") {
      app.innerHTML = viewAbout(); setNav(seg); title = "About — Mir Zuhair";
    } else {
      app.innerHTML = viewHome(); setNav("work");
    }
    document.title = title;
    window.scrollTo(0, 0);
    wire();
    initHero();
    initResearch();
    initFlow();
    initWorkStack();
    initProject();
    if (window.OpenHouse) OpenHouse.mount(app);
    initTour();
    initSpiral();
  }

  /* ---------- Behaviours ---------- */
  let io;
  function wire() {
    app.querySelectorAll(".acc-item button").forEach((btn) =>
      btn.addEventListener("click", () => {
        const item = btn.parentElement;
        const open = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", open);
      })
    );
    app.querySelectorAll("[data-twin]").forEach((tw) => tw.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => {
      tw.querySelectorAll("[data-t]").forEach((x) => x.setAttribute("aria-selected", x === b));
      tw.querySelectorAll("[data-c]").forEach((c) => { c.hidden = c.dataset.c !== b.dataset.t; if (!c.hidden) { c.classList.remove("play"); void c.offsetWidth; c.classList.add("play"); } });
    })));
    app.querySelectorAll("[data-jump]").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      const t = document.getElementById(a.getAttribute("href").slice(1));
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    const toc = [...app.querySelectorAll(".pp-toc a")];
    if (toc.length) {
      const heads = [...app.querySelectorAll(".pp-abstract, .pp-h, .pp-end")];
      const spy = () => {
        if (!toc[0].isConnected) return removeEventListener("scroll", spy);
        let cur = heads[0];
        heads.forEach((h) => { if (h.getBoundingClientRect().top < innerHeight * .3) cur = h; });
        toc.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + cur.id));
      };
      addEventListener("scroll", spy, { passive: true }); spy();
    }
    const form = app.querySelector(".cp-form");
    if (form) form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = form.querySelector(".cp-status"), btn = form.querySelector(".cp-send");
      btn.disabled = true; status.textContent = "Sending…";
      try {
        const r = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)).toString() });
        if (!r.ok) throw new Error(r.status);
        form.reset(); status.textContent = "Thank you! Your message has been sent. I'll be in touch soon.";
      } catch (err) {
        status.innerHTML = 'Sorry, that didn\'t go through. Please email me at <a href="mailto:zohairtalpur13@gmail.com">zohairtalpur13@gmail.com</a>.';
      }
      btn.disabled = false;
    });
    const dlg = app.querySelector("#hl-dlg");
    if (dlg) {
      app.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", () => {
        dlg.querySelector(".hl-dlg-body").innerHTML = HL_PANELS[b.dataset.open]();
        const sc = dlg.querySelector(".hl-scan");
        if (sc) sc.addEventListener("click", () => {
          const out = dlg.querySelector(".hl-try-out");
          sc.classList.add("go"); out.textContent = "Scanning…";
          setTimeout(() => { sc.classList.remove("go"); out.innerHTML = "<b>Found:</b> Painted ceiling print · drawn from the palace ceiling, 1843"; }, 1600);
        });
        dlg.showModal();
      }));
      dlg.querySelector(".hl-dlg-x").addEventListener("click", () => dlg.close());
      dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    }
    if (io) io.disconnect();
    io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    app.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  // Lightbox
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector("img"), lbCap = lb.querySelector("figcaption");
  let list = [], idx = 0;
  const show = (n) => { idx = (n + list.length) % list.length; lbImg.src = list[idx].src; lbCap.textContent = list[idx].dataset.cap || ""; };
  const close = () => { lb.hidden = true; document.body.style.overflow = ""; };
  app.addEventListener("click", (e) => {
    const img = e.target.closest(".blk img, .masonry img, .cover img, .pp-fig img");
    if (!img) return;
    list = [...app.querySelectorAll(".blk img, .masonry img, .cover img, .pp-fig img")];
    show(list.indexOf(img)); lb.hidden = false; document.body.style.overflow = "hidden";
  });
  lb.querySelector(".lb-close").onclick = close;
  lb.querySelector(".lb-prev").onclick = () => show(idx - 1);
  lb.querySelector(".lb-next").onclick = () => show(idx + 1);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });

  window.addEventListener("hashchange", route);
  route();
})();
