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
  const viewHome = () => {
    const STAGE = { "threads-of-time": "img/tt-hero.jpg", "deer-and-doorway": "img/cr-mock-2.jpg", "painted-ceiling": "img/ce-final-teal.jpg",
      "portrait-of-an-ancestor": "img/pt-jq-3.jpg", "corridors-and-chandeliers": "img/cc-hall.jpg", "ivory-table": "img/gr-dark.jpg",
      "lanterns": "img/ln-pattern.jpg", "greek-ornament": "img/ed-red.jpg", "quiet-structure": "img/qs-01.jpg",
      "heritage-loop": "img/hl-deer-look.jpg", "editorial-mockups": "img/ed-vogue-margot.jpg" };
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
    const acc = Object.entries(p.sections).map(([k, v], n) => `
      <div class="acc-item ${n === 0 ? "open" : ""}">
        <button aria-expanded="${n === 0}"><span>${esc(k)}</span><span class="pm"></span></button>
        <div class="acc-panel"><div><p>${esc(v)}</p></div></div>
      </div>`).join("");
    const cover = p.coverHTML
      ? `<div class="cover hl">${hlCover()}</div>`
      : `<div class="cover"><img src="${p.cover}" alt="${esc(p.title)}" data-cap="${esc(p.title)}"></div>`;
    return `
      <article class="page-enter">
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
        <section class="blocks">${p.blocks.map(renderBlock).join("")}</section>
        <nav class="pager">
          <a href="#/work/${prev.slug}"><small>Previous</small><span>${esc(prev.title)}</span></a>
          <a class="next" href="#/work/${next.slug}"><small>Next</small><span>${esc(next.title)}</span></a>
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
    </section>`;

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
    const img = e.target.closest(".blk img, .masonry img, .cover img");
    if (!img) return;
    list = [...app.querySelectorAll(".blk img, .masonry img, .cover img")];
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
