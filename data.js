/* All portfolio content lives here. Edit text, captions and image order in this file. */

const PROJECTS = [
  {
    slug: "threads-of-time",
    tone: "#e6d6c3",
    title: "Threads of Time",
    subtitle: "A Fusion Between Past and Future",
    date: "Textile Thesis · 2025",
    tags: "Digital print on silk · Brass-sheet sculpture · Installation",
    cover: "img/tt-hero.jpg",
    covers: [{ src: "img/tt-hero.jpg", pos: "center 25%" }, { src: "img/tt-side.jpg", pos: "center 35%" }, { src: "img/tt-back.jpg", pos: "center 40%" }, { src: "img/co-bronze.jpg" }],
    sections: {
      "The Project":
        "Threads of Time is my textile thesis: a single look that wears a building. From primary research at the Talpur Haveli in Hyderabad, Sindh, I translated two parts of the house into print. The painted ceiling became a draped silk cape, and the long corridor of arches, lanterns and carved chairs became a floor-length mermaid skirt. Over them sits a corset of hand-cut brass flowers and leaves, made in collaboration with sculpture.",
      "The Process":
        "Every surface began as a drawing. I photographed the haveli, sketched its elements in pencil, redrew them as line work in Photoshop and built them into seamless repeats. The ceiling medallions were printed in rose-gold on oxblood silk, and the corridor toile in bronze on charcoal. Inspired by Schiaparelli's surrealist, sculptural gold, I worked with a sculptor to cut, shape and assemble brass sheet into a corset of blooming roses and leaves that climb over the shoulder like the haveli's gilded ornament.",
      "The Problem":
        "Heritage motifs are usually lifted onto fabric as surface decoration, stripped of the structure and meaning they came from. I wanted the garment to carry the logic of the building (its rhythm, weight and light), not just its look.",
      "The Goal":
        "To let architecture be experienced on the body. The fluid silk carries the imagery and moves with the wearer, while the rigid brass brings the permanence of the building. The tension between the two is the message: memory that is soft enough to wear and strong enough to last."
    },
    blocks: [
      { type: "full", src: "img/tt-hero.jpg", cap: "The final look: brass-sheet corset, ceiling-print silk cape and corridor-print mermaid skirt.", contain: true },
      { type: "text", h: "A house you can wear",
        p: "The look is read from top to bottom like a walk through the haveli. The ceiling is at the shoulders, the corridor falls to the floor, and gold blooms where the lanterns would hang. The skirt is cut so the corridor's arches and staircases flare open at the hem." },
      { type: "trio", items: [
        { src: "img/tt-front.jpg", cap: "Front: the brass rose corset over the draped cape." },
        { src: "img/tt-side.jpg", cap: "Side: the cape's cowl, printed with the painted-ceiling medallions." },
        { src: "img/tt-back.jpg", cap: "Back: the cape spreads like a ceiling above the corridor skirt." }
      ]},
      { type: "step", n: "00", h: "Drawn by hand first", p: "Every print in the look began in my sketchbook: the palace's ceilings, corridors, chandeliers and chairs, drawn in pencil and ink before anything was digitised." },
      { type: "grid", cols: 4, items: [
        { src: "img/sk-co-1.jpg", cap: "The corridor, ink.", contain: true },
        { src: "img/sk-ce-4.jpg", cap: "Ceiling panel, ink.", contain: true },
        { src: "img/sk-dd-9.jpg", cap: "The crest, pencil.", contain: true },
        { src: "img/sk-iv-1.jpg", cap: "The carved eagle, pencil.", contain: true }
      ]},
      { type: "step", n: "01", h: "The brass corset", p: "A collaboration with sculpture, inspired by Schiaparelli's surrealist gold. Brass sheet was cut and shaped into petals, buds and leaves, then assembled into a corset of blooming roses that grows over one shoulder. It brings the weight of the palace's gilded ornament directly onto the body." },
      { type: "step", n: "02", h: "The ceiling cape", p: "The painted-ceiling composition (Composition 04), printed in rose-gold line on oxblood silk. The volume is cut to drape into a deep cowl so the medallions fold and catch the light, the way the real ceiling does." },
      { type: "grid", cols: 3, items: [
        { src: "img/sk-ce-1.jpg", cap: "Sketchbook: the ceiling medallion in pencil.", contain: true },
        { src: "img/sk-ce-4.jpg", cap: "Sketchbook: the floral and dragon panel, inked.", contain: true },
        { src: "img/sk-ce-2.jpg", cap: "Sketchbook: the square repeat tile.", contain: true }
      ]},
      { type: "pair", items: [
        { src: "img/ce-drawing.jpg", cap: "The ceiling line drawing behind the cape print.", contain: true },
        { src: "img/tt-look.jpg", cap: "The cape in the exhibition, lit from above." }
      ]},
      { type: "step", n: "03", h: "The corridor skirt", p: "The corridor toile (Composition 01), printed in bronze on charcoal silk and cut as a panelled mermaid skirt." },
      { type: "grid", cols: 4, items: [
        { src: "img/sk-co-1.jpg", cap: "Sketchbook: the corridor scene in ink.", contain: true },
        { src: "img/sk-co-2.jpg", cap: "The corridor in perspective, pencil.", contain: true },
        { src: "img/sk-co-4.jpg", cap: "Chandeliers drawn from life.", contain: true },
        { src: "img/sk-co-3.jpg", cap: "Carved chairs.", contain: true }
      ]},
      { type: "pair", items: [
        { src: "img/co-drawing.jpg", cap: "The corridor line drawing." },
        { src: "img/co-bronze.jpg", cap: "The printed repeat: bronze on charcoal." }
      ]},
      { type: "step", n: "04", h: "The installation", p: "The look was shown in a curtained room lit by bare bulbs hung on knotted rope. Silk banners printed with the stag crest in every colourway hang beside it, so visitors see the full pattern system around the finished garment." },
      { type: "related", text: "Each composition behind the collection is documented as its own project:",
        links: ["corridors-and-chandeliers", "deer-and-doorway", "painted-ceiling", "portrait-of-an-ancestor", "ivory-table", "lanterns", "mir-what-remains"] }
    ]
  },

  {
    slug: "mir-what-remains",
    tone: "#e8c3ba",
    title: "MIR — What Remains.",
    subtitle: "A Speculative Fragrance & Communication Campaign",
    date: "Self-Initiated · Communication Design · 2025",
    tags: "Identity · Packaging · Typography · Motion · Interaction",
    cover: "mir-campaign/assets/stationery.png",
    covers: [{ src: "mir-campaign/assets/stationery.png" }, { src: "mir-campaign/assets/packaging.png" }, { src: "mir-campaign/artwork/poster-pressure.svg" }, { src: "mir-campaign/artwork/poster-transfer.svg" }],
    sections: {
      "The Project":
        "MIR is a self-initiated fragrance and communication-design concept built to ask one question: how does a campaign communicate something a screen can't let you smell? It's a speculative brand, not a commissioned or manufactured one, built by reusing the doorway and painted-ceiling drawings from Threads of Time and extending them into stationery, packaging, a set of typographic posters, a twelve-second motion study and an interactive postcard maker, all held together by one line: What remains.",
      "The Process":
        "Every application traces back to two existing drawings, the doorway repeat and the ceiling line work, rather than a new emblem invented for the occasion. The MIR wordmark stays deliberately quiet, three letters in high-contrast strokes, so the archive drawings can carry the detail: on a card reverse, a carton panel, a textile label, or masked into the interactive piece. Three posters, Pressure, Transfer and Absence, each test a different way to make a trace visible, and a short film and a gesture-based postcard maker carry the same idea into time and touch.",
      "The Problem":
        "A fragrance has no visible form, and a good-looking mockup on its own can read as a generic styling exercise, disconnected from the practice behind it. The campaign needed to give an invisible experience a visible behaviour, and keep that behaviour recognisably tied to the palace drawings rather than inventing an identity from nothing.",
      "The Goal":
        "To let one idea, an impression that outlasts contact, hold together five different media without repeating the same bottle photograph. Paper carries pressure and relief, motion carries an afterimage, and the interactive piece lets a visitor leave their own mark and keep it."
    },
    blocks: [
      { type: "full", src: "mir-campaign/artwork/poster-pressure.svg", cap: "Poster 01, Pressure: a single oversized M turned into a typographic object.", contain: true },
      { type: "text", h: "One line: What remains.",
        p: "Short enough to sit on a business card, open enough to carry across paper, motion and interaction: a trace that stays behind after the contact that made it has ended." },
      { type: "pair", items: [
        { src: "mir-campaign/artwork/mir-wordmark.svg", cap: "The wordmark: three letters, kept quiet on purpose.", contain: true },
        { src: "mir-campaign/assets/dd-door.jpg", cap: "Its source: the haveli's carved doorway, the same one behind Threads of Time." }
      ]},
      { type: "step", n: "01", h: "Paper", p: "An 85 × 55mm card in vermilion and carbon, its reverse carrying the doorway repeat instead of a new emblem, plus a scent strip that extends the same identity into a sampling ritual." },
      { type: "full", src: "mir-campaign/assets/stationery.png", cap: "Stationery system: card, scent strip, embossed envelope. Material visualisation." },
      { type: "step", n: "02", h: "Object", p: "The doorway drawing moves from textile repeat to carton panel, paired with the green glass and oxblood cap already established in the palette." },
      { type: "full", src: "mir-campaign/assets/packaging.png", cap: "Packaging: doorway illustration on an ivory carton, vermilion side panel. Material visualisation." },
      { type: "step", n: "03", h: "Three typographic routes", p: "Pressure, Transfer and Absence each test a different way of making a trace legible, not three unrelated styles but one idea read three ways." },
      { type: "trio", items: [
        { src: "mir-campaign/artwork/poster-pressure.svg", cap: "Pressure: a letter turned into relief.", contain: true },
        { src: "mir-campaign/artwork/poster-transfer.svg", cap: "Transfer: an offset second impression.", contain: true },
        { src: "mir-campaign/artwork/poster-absence.svg", cap: "Absence: the missing letter as the point.", contain: true }
      ]},
      { type: "step", n: "04", h: "Motion & interaction", p: "A twelve-second film moves the identity through time; a postcard maker lets a visitor stamp the ceiling, doorway or lantern motif into their own composition and keep it. Both are playable, not just documented here." },
      { type: "linkout", items: [
        { href: "mir-campaign/motion.html", label: "Play the motion study" },
        { href: "mir-campaign/interactive.html", label: "Try the interactive postcard" },
        { href: "mir-campaign/case-study.html", label: "Read the extended case study" }
      ]},
      { type: "related", text: "Built directly on top of the archive drawings from the thesis:",
        links: ["threads-of-time", "deer-and-doorway", "painted-ceiling"] }
    ]
  },

  {
    slug: "deer-and-doorway",
    tone: "#ecc9c5",
    title: "The Deer & the Doorway",
    subtitle: "Compositions 02 & 03",
    date: "Pattern Design · 2025",
    tags: "Pencil sketch · Digital illustration · Repeat pattern",
    cover: "img/dd-pattern.jpg",
    thumb: "img/dd-pattern.jpg",
    covers: [{ src: "img/cr-mock-2.jpg", pos: "center 20%" }, { src: "img/dd-pattern.jpg" }],
    sections: {
      "The Project":
        "Above the arched teak doors of the haveli hang mounted deer trophies. Composition 02 takes the deer as its subject; Composition 03 takes the windows and doors. Together they became the central emblem of Threads of Time: a crest of arched doors flanked by stags.",
      "The Process":
        "I photographed the doorways, made pencil sketches of the stags, arches and fanlights, then redrew them as clean digital line work in Photoshop. The elements were composed into a symmetrical crest, coloured in several palettes and mirrored into repeats, then tested on garment mockups.",
      "The Problem":
        "The source is visually busy: wood grain, glass, plaster and trophies all compete. A motif that works on silk needs a clear silhouette and a hierarchy that still reads at a distance.",
      "The Goal":
        "A crest that is both an emblem and a repeat. It had to work as a single placement print and as an all-over pattern, and hold up across very different colourways."
    },
    note: "Mockups use existing editorial and red-carpet photography; only the textile patterns are my work.",
    blocks: [
      { type: "step", n: "01", h: "Source" },
      { type: "pair", items: [
        { src: "img/dd-door.jpg", cap: "Source: deer trophies above an arched doorway in the haveli." },
        { src: "img/comp-2.jpg", cap: "Composition 02 board: the deer.", contain: true }
      ]},
      { type: "full", src: "img/comp-3.jpg", cap: "Composition 03 board: windows and doors.", contain: true },
      { type: "step", n: "02", h: "Sketchbook", p: "The crest began as pages of loose studies: stags, fanlights, dragons and daggers, drawn from the house, then combined and redrawn until the emblem settled." },
      { type: "grid", cols: 4, items: [
        { src: "img/sk-dd-1.jpg", cap: "Deer heads and window, first observations.", contain: true },
        { src: "img/sk-dd-2.jpg", cap: "Doors, fanlights and stag profiles.", contain: true },
        { src: "img/sk-dd-3.jpg", cap: "Window, dagger and ornament fragments.", contain: true },
        { src: "img/sk-dd-4.jpg", cap: "Dragons and scrolls for the crest.", contain: true },
        { src: "img/sk-dd-5.jpg", cap: "Gothic window and fanlight.", contain: true },
        { src: "img/sk-dd-6.jpg", cap: "Stag head, final pencil.", contain: true },
        { src: "img/sk-dd-7.jpg", cap: "Stag in a floral oval.", contain: true },
        { src: "img/sk-dd-8.jpg", cap: "The doorway crest takes shape.", contain: true },
        { src: "img/sk-dd-9.jpg", cap: "Early crest: stag, doors and lanterns in a wreath.", contain: true },
        { src: "img/sk-dd-10.jpg", cap: "Round crest with crossed swords.", contain: true },
        { src: "img/sk-dd-11.jpg", cap: "Oval crest: window and stag.", contain: true },
        { src: "img/sk-dd-12.jpg", cap: "Round crest with the lion.", contain: true },
        { src: "img/sk-dd-13.jpg", cap: "Doorway crest with dragons.", contain: true },
        { src: "img/sk-dd-14.jpg", cap: "Stag and serpent study.", contain: true }
      ]},
      { type: "step", n: "03", h: "Digital line work", p: "Two crests were redrawn digitally. The first frames the arched double door between two windows, flanked by stags among vines and baroque scrolls. The second puts a stag head at the centre, with gothic windows, dragons, a sword and a shell." },
      { type: "pair", items: [
        { src: "img/cr-drawing.jpg", cap: "Doorway crest: final line drawing.", contain: true },
        { src: "img/de-drawing.jpg", cap: "Stag crest: final line drawing.", contain: true }
      ]},
      { type: "pair", items: [
        { src: "img/de-oval.jpg", cap: "Stag in a floral oval: an early study.", contain: true },
        { src: "img/dd-deer.jpg", cap: "Stag line study.", contain: true }
      ]},
      { type: "step", n: "04", h: "Colouring the crest" },
      { type: "trio", items: [
        { src: "img/cr-teal.jpg", cap: "Single-colour fill.", contain: true },
        { src: "img/cr-two.jpg", cap: "Two-colour version: teal and burnt orange.", contain: true }
      ]},
      { type: "step", n: "05", h: "Seamless repeats" },
      { type: "pair", items: [
        { src: "img/cr-line.jpg", cap: "Doorway crest: line repeat." },
        { src: "img/de-line.jpg", cap: "Stag crest: line repeat." }
      ]},
      { type: "step", n: "06", h: "Colour options" },
      { type: "grid", cols: 4, items: [
        { src: "img/dd-pattern.jpg", cap: "Teal and burnt orange on oxblood." },
        { src: "img/cr-c1.jpg", cap: "Oxblood on green." },
        { src: "img/cr-c2.jpg", cap: "Navy on blush." },
        { src: "img/cr-c3.jpg", cap: "Plum on coral." },
        { src: "img/cr-c4.jpg", cap: "Olive on terracotta." },
        { src: "img/cr-pink.jpg", cap: "Rose on aqua." },
        { src: "img/de-colour.jpg", cap: "Stag crest in rust." },
        { src: "img/de-repeat.jpg", cap: "Stag crest in violet and teal." }
      ]},
      { type: "step", n: "07", h: "Production files", p: "Separations prepared for jacquard weaving and screen printing." },
      { type: "trio", items: [
        { src: "img/cr-jq-red.jpg", cap: "Jacquard file: crimson on navy." },
        { src: "img/cr-screen-1.jpg", cap: "Screen-print separation." },
        { src: "img/cr-screen-2.jpg", cap: "Screen-print separation, line layer." }
      ]},
      { type: "step", n: "08", h: "Mockups" },
      { type: "full", src: "img/cr-mock-2.jpg", cap: "Doorway crest print on a catsuit: teal doors and crimson scrolls." }
    ]
  },

  {
    slug: "painted-ceiling",
    tone: "#d6e2d6",
    title: "The Painted Ceiling",
    subtitle: "Composition 04",
    date: "Pattern Design · 2025",
    tags: "Geometric ornament · Colourway development",
    cover: "img/ce-final-teal.jpg",
    thumb: "img/ce-c1.jpg",
    covers: [{ src: "img/ce-mock-scarf.jpg", pos: "center 30%" }, { src: "img/ce-final-teal.jpg" }],
    sections: {
      "The Project":
        "A composition drawn from painted ceilings: star-shaped medallions, radiating petals and dense floral infill. This composition became the print for the silk jacket in Threads of Time.",
      "The Process":
        "I sketched the central medallion in pencil, redrew it in Photoshop as a flat, cut-paper style motif, then tested it in several palettes: oxblood and green, teal and pink, violet and gold, charcoal and pink. The strongest were built into full repeats and tested on a gown mockup.",
      "The Problem":
        "A ceiling is seen from far below and is meant to overwhelm. On fabric, the same density becomes noise unless the scale and contrast are controlled.",
      "The Goal":
        "Keep the radiating geometry of the ceiling while giving it enough breathing space and contrast to read on a moving body."
    },
    note: "Mockups use existing editorial and red-carpet photography; only the textile patterns are my work.",
    blocks: [
      { type: "step", n: "01", h: "Source" },
      { type: "pair", items: [
        { src: "img/tt-ceiling-hall.jpg", cap: "Reference: a painted ceiling of the kind that inspired the composition." },
        { src: "img/tt-ceiling-detail.jpg", cap: "Reference detail: star-and-medallion geometry." }
      ]},
      { type: "full", src: "img/comp-4.jpg", cap: "Composition 04 board: reference, sketches, colourways, palette and gown mockup.", contain: true },
      { type: "step", n: "02", h: "Sketchbook", p: "Before any screen: every petal and scroll of the ceiling drawn by hand in pencil, then inked, as the base for the digital line work." },
      { type: "grid", cols: 4, items: [
        { src: "img/sk-ce-1.jpg", cap: "The ceiling medallion, first drawn by hand.", contain: true },
        { src: "img/sk-ce-2.jpg", cap: "Square repeat tile, pencil.", contain: true },
        { src: "img/sk-ce-3.jpg", cap: "Centre-square ornament study.", contain: true },
        { src: "img/sk-ce-4.jpg", cap: "Floral and dragon panel: the full ceiling motif in ink.", contain: true },
        { src: "img/sk-ce-5.jpg", cap: "Flower and leaf studies.", contain: true }
      ]},
      { type: "step", n: "03", h: "Digital line work", p: "The ceiling redrawn digitally as one continuous line drawing: a central sunburst medallion, radiating petals, dense floral infill and the ewers and candlesticks of the haveli." },
      { type: "full", src: "img/ce-drawing.jpg", cap: "Line drawing: the full ceiling composition, drawn for repeat.", contain: true },
      { type: "step", n: "04", h: "Colour options", p: "The same drawing tested across a range of grounds and line colours, from single-colour tonal versions to multi-colour medallion versions." },
      { type: "grid", cols: 4, items: [
        { src: "img/ce-c1.jpg", cap: "Crimson, green and blue on oxblood." },
        { src: "img/ce-c2.jpg", cap: "Pink line on slate." },
        { src: "img/ce-c3.jpg", cap: "Coral tonal." },
        { src: "img/ce-c4.jpg", cap: "Pink on graded blue." },
        { src: "img/ce-c5.jpg", cap: "Rose on teal." },
        { src: "img/ce-c6.jpg", cap: "Crimson on plum, graded." },
        { src: "img/ce-c7.jpg", cap: "Blush and slate." }
      ]},
      { type: "full", src: "img/tt-comp-violet.jpg", cap: "Filled medallion repeat: violet and gold." },
      { type: "step", n: "05", h: "Final prints" },
      { type: "pair", items: [
        { src: "img/ce-final-teal.jpg", cap: "Final medallion print: coral, green and navy." },
        { src: "img/ce-digital.jpg", cap: "Digital print: the crest medallion on the ceiling ground, in teal, orange and oxblood." }
      ]},
      { type: "step", n: "06", h: "Mockups", p: "The ceiling print carried into use as a silk scarf, styled for an editorial cover." },
      { type: "full", src: "img/ce-mock-scarf.jpg", cap: "Editorial cover concept: the ceiling medallion print in crimson on a silk headscarf.", contain: true }
    ]
  },

  {
    slug: "portrait-of-an-ancestor",
    tone: "#e7cbd0",
    title: "Portrait of an Ancestor",
    subtitle: "Composition 05",
    date: "Illustration & Pattern · 2025",
    tags: "Archival research · Line illustration · Repeat",
    cover: "img/pt-pattern.jpg",
    thumb: "img/pt-drawing.jpg",
    thumbPos: "center 12%",
    covers: [{ src: "img/pt-black.jpg" }, { src: "img/pt-jq-3.jpg" }],
    sections: {
      "The Project":
        "The haveli holds painted portraits of Talpur ancestors. Composition 05 takes inspiration from their clothes and personalities: the figure is framed in the same foliate ornament as the carved furniture around it.",
      "The Process":
        "Working from the archival portrait, I made a pencil sketch of the figure's crown, embroidered waistcoat and dress, then drew the floral framing from a carved wooden cabinet. Both were redrawn digitally, tested in white-on-black and teal-on-burgundy, and repeated.",
      "The Problem":
        "A portrait is personal and specific; a textile repeat is anonymous and endless. The challenge was to keep the dignity of the sitter while letting the image become part of a pattern.",
      "The Goal":
        "To put family history back into circulation, as something worn and handled every day rather than kept behind glass on a wall."
    },
    blocks: [
      { type: "step", n: "01", h: "Source" },
      { type: "pair", items: [
        { src: "img/pt-portrait.jpg", cap: "Source: painted portrait of a Talpur ancestor." },
        { src: "img/comp-5.jpg", cap: "Composition 05 board.", contain: true }
      ]},
      { type: "step", n: "02", h: "Sketchbook", p: "The portrait redrawn in pencil, working out how the figure and the carved floral frame lock together." },
      { type: "grid", cols: 4, items: [
        { src: "img/sk-pt-1.jpg", cap: "The ancestor inside a lotus cartouche, pencil.", contain: true },
        { src: "img/sk-pt-2.jpg", cap: "Full figure in floral frame.", contain: true },
        { src: "img/sk-pt-3.jpg", cap: "Crowned figure, oval study.", contain: true },
        { src: "img/sk-pt-4.jpg", cap: "Figure in a carved panel.", contain: true }
      ]},
      { type: "step", n: "03", h: "Digital line work", p: "The sitter redrawn digitally in line: crown, embroidered waistcoat and robe, first inside a carved leaf panel, then inside a lotus cartouche." },
      { type: "grid", cols: 4, items: [
        { src: "img/pt-panel.jpg", cap: "The seated figure in a carved leaf panel.", contain: true },
        { src: "img/pt-floral.jpg", cap: "The lotus cartouche, drawn on its own.", contain: true },
        { src: "img/pt-white.jpg", cap: "Figure and cartouche combined.", contain: true },
        { src: "img/pt-black.jpg", cap: "Reversed: white on black.", contain: true }
      ]},
      { type: "step", n: "04", h: "Repeats" },
      { type: "pair", items: [
        { src: "img/pt-drawing.jpg", cap: "Line illustration in a foliate frame.", contain: true },
        { src: "img/pt-pattern.jpg", cap: "Teal cartouches on burgundy." }
      ]},
      { type: "step", n: "05", h: "Final prints", p: "The portrait placed over the ceiling ground, layering the ancestor and the architecture in a single cloth." },
      { type: "grid", cols: 3, items: [
        { src: "img/pt-jq-2.jpg", cap: "Plum figure on the ceiling ground." },
        { src: "img/pt-jq-3.jpg", cap: "Teal figure on crimson." },
        { src: "img/pt-jq-4.jpg", cap: "Violet on dusk, half-drop." }
      ]},
      { type: "full", src: "img/pt-portrait-2.jpg", cap: "A second archival portrait from the haveli collection." }
    ]
  },

  {
    slug: "corridors-and-chandeliers",
    tone: "#e8d0d9",
    title: "Corridors & Chandeliers",
    subtitle: "Compositions 01 & 06",
    date: "Pattern Design · 2025",
    tags: "Spatial research · Toile · Placement print",
    cover: "img/co-c2.jpg",
    thumb: "img/co-c1.jpg",
    covers: [{ src: "img/cc-hall.jpg" }, { src: "img/co-c2.jpg" }],
    sections: {
      "The Project":
        "Two compositions drawn from the haveli's light. Composition 01 comes from the long corridors, with their beamed ceilings, green glass lanterns, crystal chandeliers and rows of carved chairs. Composition 06 comes from the chandeliers and candelabra, reworked with peacocks, vases and the carved eagle of the ivory table.",
      "The Process":
        "For Composition 01, early pencil sketches picked out the main elements, which I redrew in Photoshop and arranged as a mirrored, toile-like repeat in charcoal and walnut. Composition 06 is a symmetrical placement print: the chandelier at the centre, flanked by peacocks and vases, in gold and lime on crimson.",
      "The Problem":
        "A corridor is a space defined by perspective and repetition. Flattening it into a textile risks losing the sense of depth that makes it feel monumental.",
      "The Goal":
        "Keep the rhythm of the corridor by mirroring and stacking its furniture and lights, so the fabric reads as architecture folded flat, and give the chandelier its own ceremonial, centred composition."
    },
    blocks: [
      { type: "step", n: "01", h: "Source" },
      { type: "pair", items: [
        { src: "img/cc-hall.jpg", cap: "Source: the main corridor, with green lanterns and a chandelier." },
        { src: "img/cc-chandelier.jpg", cap: "Detail: etched-glass chandelier." }
      ]},
      { type: "pair", items: [
        { src: "img/comp-1.jpg", cap: "Composition 01 board.", contain: true },
        { src: "img/comp-6.jpg", cap: "Composition 06 board.", contain: true }
      ]},
      { type: "step", n: "02", h: "Sketchbook", p: "The corridor drawn by hand, object by object and then as one scene, before it was redrawn and mirrored into the toile." },
      { type: "grid", cols: 4, items: [
        { src: "img/sk-co-1.jpg", cap: "The corridor scene: arches, lanterns and chairs, in ink.", contain: true },
        { src: "img/sk-co-2.jpg", cap: "The corridor in perspective.", contain: true },
        { src: "img/sk-co-3.jpg", cap: "Carved chairs.", contain: true },
        { src: "img/sk-co-4.jpg", cap: "Chandeliers.", contain: true },
        { src: "img/sk-co-5.jpg", cap: "The carriage.", contain: true },
        { src: "img/sk-co-6.jpg", cap: "The palace façade.", contain: true },
        { src: "img/sk-co-7.jpg", cap: "Carriage and lantern, loose sketch.", contain: true }
      ]},
      { type: "grid", cols: 4, items: [
        { src: "img/sk-ch-1.jpg", cap: "Candelabra, goblets and vessels.", contain: true },
        { src: "img/sk-ch-2.jpg", cap: "Glass bottles and goblets.", contain: true },
        { src: "img/sk-ch-3.jpg", cap: "Vase wrapped by a serpent, on a sword.", contain: true },
        { src: "img/sk-ch-4.jpg", cap: "Vase between crossed daggers.", contain: true },
        { src: "img/sk-ch-5.jpg", cap: "Lion-headed bottle.", contain: true },
        { src: "img/sk-ch-6.jpg", cap: "Ram crest, lamp and goblet.", contain: true },
        { src: "img/sk-ch-7.jpg", cap: "Clock and bottle.", contain: true }
      ]},
      { type: "step", n: "03", h: "Digital line work: the corridor", p: "Arches, balustrades, staircases, carved chairs and hanging lanterns drawn as one continuous scene, then mirrored into a kaleidoscopic toile." },
      { type: "full", src: "img/co-drawing.jpg", cap: "Line drawing: the corridor scene, drawn to tile seamlessly." },
      { type: "step", n: "04", h: "Colour options" },
      { type: "full", src: "img/co-bronze.jpg", cap: "Straight repeat: bronze on charcoal." },
      { type: "grid", cols: 4, items: [
        { src: "img/co-c1.jpg", cap: "Lavender on charcoal, mirrored." },
        { src: "img/co-c2.jpg", cap: "Pink on aubergine." },
        { src: "img/co-c3.jpg", cap: "Aubergine on orchid." },
        { src: "img/co-c4.jpg", cap: "Charcoal on tobacco." },
        { src: "img/co-c5.jpg", cap: "Slate blue on tobacco." },
        { src: "img/co-c6.jpg", cap: "Mint on dusk." },
        { src: "img/co-c7.jpg", cap: "Tonal black, for jacquard." }
      ]},
      { type: "step", n: "05", h: "Composition 06: the chandelier", p: "A placement print with a chandelier at the centre, flanked by peacocks, vases and lamps." },
      { type: "pair", items: [
        { src: "img/ch-drawing.jpg", cap: "Line drawing in gold and green.", contain: true },
        { src: "img/ch-colour.jpg", cap: "Gold and lime on magenta." }
      ]},
      { type: "pair", items: [
        { src: "img/cc-chandelier-2.jpg", cap: "Crystal chandelier in the yellow hall." },
        { src: "img/cc-window.jpg", cap: "Companion repeat: window arches in teal on oxblood." }
      ]}
    ]
  },

  {
    slug: "ivory-table",
    tone: "#ece5d6",
    title: "The Ivory Table",
    subtitle: "Composition 07",
    date: "Pattern Design · 2025",
    tags: "Object study · Line illustration · Colourways",
    cover: "img/gr-dark.jpg",
    thumb: "img/gr-dark.jpg",
    covers: [{ src: "img/gr-marble.jpg", pos: "center 35%" }, { src: "img/gr-dark.jpg" }],
    sections: {
      "The Project":
        "Composition 07 is drawn from one object: a carved ivory table in the haveli. Its pedestal has a carved eagle, faces, acanthus scrolls and roses.",
      "The Process":
        "I photographed the table from several angles and made a detailed line drawing of the pedestal's carving. From it I isolated a face-and-scroll motif, surrounded it with scattered flowers and leaves, and developed it in navy, burnt orange, sand and cream, then as a darker colourway.",
      "The Problem":
        "Carved ivory is monochrome: all of its information is in light and shadow. To become a print, the form had to be translated into line and flat colour without losing its sculptural richness.",
      "The Goal":
        "Turn a three-dimensional heirloom into a flat ornamental language that still feels carved, layered and precious."
    },
    blocks: [
      { type: "pair", items: [
        { src: "img/gr-marble.jpg", cap: "Source: the carved pedestal of the ivory table, with its eagle and scrollwork." },
        { src: "img/comp-7.jpg", cap: "Composition 07 board: table photographs, line drawing, motif, palette and pattern tests.", contain: true }
      ]},
      { type: "step", n: "01", h: "Sketchbook", p: "The carved pedestal drawn part by part: the eagle, the faces, the acanthus scrolls, before the motif was built digitally." },
      { type: "grid", cols: 4, items: [
        { src: "img/sk-iv-1.jpg", cap: "The eagle, first drawn from the carved pedestal.", contain: true },
        { src: "img/sk-iv-2.jpg", cap: "Eagle over the carved faces and scrolls.", contain: true },
        { src: "img/sk-iv-3.jpg", cap: "Carved panel with the eagle, inked.", contain: true },
        { src: "img/sk-iv-4.jpg", cap: "Faces and scrolls from the pedestal.", contain: true },
        { src: "img/sk-iv-5.jpg", cap: "Crest and scroll fragments.", contain: true },
        { src: "img/sk-iv-6.jpg", cap: "Fleur-de-lis and acanthus studies.", contain: true },
        { src: "img/sk-iv-7.jpg", cap: "Lion heads and corner brackets.", contain: true }
      ]},
      { type: "full", src: "img/gr-light.jpg", cap: "Repeat, light colourway." },
      { type: "full", src: "img/gr-dark.jpg", cap: "Repeat, night colourway." }
    ]
  },

  {
    slug: "lanterns",
    tone: "#efd9be",
    title: "Lanterns of the Haveli",
    subtitle: "From object to repeat",
    date: "Pattern Design · 2025",
    tags: "Observational drawing · Colour · Repeat",
    cover: "img/ln-pattern.jpg",
    thumb: "img/ln-pattern.jpg",
    covers: [{ src: "img/ln-red.jpg" }, { src: "img/ln-black.jpg" }],
    sections: {
      "The Project":
        "A pattern study built from the jewelled glass lanterns that hang through the haveli's corridors. Each one is hand-painted and set with coloured glass stones, and the whole house has a rhythm of hanging light.",
      "The Process":
        "I photographed the lanterns from below, drew one as a detailed line illustration, then tested how the form behaves when it is linked by chains of dots and turned into a diagonal repeat. The final colourway uses emerald and amber on black, taken from the glass itself.",
      "The Problem":
        "Glass, light and reflection don't translate directly into flat print. The work was to find which qualities (the jewel points, the bulbous silhouette, the hanging chain) carry the feeling of the object.",
      "The Goal":
        "A dense, nocturnal pattern that feels like looking up into a corridor of lit lanterns, and that still reads clearly at garment scale."
    },
    blocks: [
      { type: "step", n: "01", h: "Source" },
      { type: "pair", items: [
        { src: "img/ln-yellow.jpg", cap: "Source: a yellow glass lantern with inset stones." },
        { src: "img/ln-red.jpg", cap: "Source: a ruby lantern hanging from the beamed ceiling." }
      ]},
      { type: "step", n: "02", h: "Sketchbook", p: "Lanterns drawn from life, then linked by chains on paper to find the rhythm of the repeat before it was built digitally." },
      { type: "grid", cols: 4, items: [
        { src: "img/sk-ln-1.jpg", cap: "The lantern, first pencil study.", contain: true },
        { src: "img/sk-ln-2.jpg", cap: "Lantern and flower vine.", contain: true },
        { src: "img/sk-ln-3.jpg", cap: "Lanterns linked by chains: testing rhythm.", contain: true },
        { src: "img/sk-ln-4.jpg", cap: "The repeat, drawn by hand.", contain: true },
        { src: "img/sk-ln-5.jpg", cap: "Rosewater sprinkler, lantern and dagger.", contain: true }
      ]},
      { type: "step", n: "03", h: "Digital line work" },
      { type: "full", src: "img/ln-drawing.jpg", cap: "Line drawing: the lantern and its painted sunflower vines.", contain: true },
      { type: "step", n: "04", h: "Motif and colour test" },
      { type: "full", src: "img/ln-colourtest.jpg", cap: "The motif with dotted chains and flowers: amber and green, and black.", contain: true },
      { type: "step", n: "05", h: "Seamless repeats and colour options" },
      { type: "grid", cols: 3, items: [
        { src: "img/ln-white.jpg", cap: "Amber and green on white." },
        { src: "img/ln-gradient.jpg", cap: "Green on a radial pink-to-blue gradient." },
        { src: "img/ln-pattern.jpg", cap: "Emerald and amber on black." }
      ]}
    ]
  },

  {
    slug: "greek-ornament",
    tone: "#efd2e1",
    title: "Greek Architecture & Ornament",
    subtitle: "Three prints",
    date: "Pattern Design",
    tags: "Classical ornament · Photoshop · Pattern mapping",
    cover: "img/gk-key-pattern.jpg",
    thumb: "img/gk-colonnade-mockups.jpg",
    covers: [{ src: "img/ed-red.jpg", pos: "center top" }, { src: "img/gk-colonnade-pattern.jpg" }],
    sections: {
      "The Project":
        "A set of three prints that apply my method to classical European ornament: Colonnade (domed pavilions and columns wrapped in roses), Greek Key (baroque scrolls, Greek-key medallions and interlocking chains) and Hummingbird (peonies, acanthus, chains and birds).",
      "The Process":
        "Each print was built in Photoshop from individually illustrated motifs, arranged through layered composition. Masks and clipping masks integrate each element with the ground while keeping fine detail sharp; transparency, gradients and overlays add depth and the shimmer of fabric. Each print is documented on a board of colours, motifs and technique, then mapped onto editorial photography.",
      "The Problem":
        "Classical ornament is so familiar it has become wallpaper. I wanted to see whether the method I built for the haveli could make it feel new.",
      "The Goal":
        "To test the method on a second architectural tradition, and to explore the contrast between organic forms and structured ornament as a kind of controlled luxury."
    },
    note: "Mockups use existing editorial and red-carpet photography; only the textile patterns are my work.",
    blocks: [
      { type: "text", h: "01 — Colonnade",
        p: "Greek-inspired columns and domed pavilions intertwined with delicate floral vines. The palette is vibrant pink with soft purple undertones, pastel florals and hints of gold." },
      { type: "pair", items: [
        { src: "img/gk-colonnade-pattern.jpg", cap: "Colonnade repeat." },
        { src: "img/gk-colonnade-board.jpg", cap: "Process board: colours, motifs and Photoshop technique.", contain: true }
      ]},
      { type: "full", src: "img/gk-colonnade-mockups.jpg", cap: "Colonnade mapped onto a sari and a red-carpet gown.", contain: true },

      { type: "text", h: "02 — Greek Key",
        p: "Baroque scrolls, floral flourishes and geometric Greek-key medallions, combined with interlocking chains. A deep midnight-blue ground sets off crimson, magenta and burnt-orange ornament." },
      { type: "pair", items: [
        { src: "img/gk-key-pattern.jpg", cap: "Greek Key repeat." },
        { src: "img/gk-key-board.jpg", cap: "Process board: colours, motifs and Photoshop technique.", contain: true }
      ]},
      { type: "full", src: "img/gk-key-mockups.jpg", cap: "Greek Key mapped onto a fitted gown and a ball gown.", contain: true },

      { type: "text", h: "03 — Hummingbird",
        p: "Baroque ornament, classical Greek decorative language and heritage floral illustration: peonies, acanthus and hummingbirds linked by chains. Rich blue brings depth and fluidity; bold pink brings energy to the motifs." },
      { type: "pair", items: [
        { src: "img/gk-humming-pattern.jpg", cap: "Hummingbird repeat." },
        { src: "img/gk-humming-board.jpg", cap: "Process board: colours, motifs and Photoshop technique.", contain: true }
      ]},
      { type: "full", src: "img/gk-humming-mockups.jpg", cap: "Hummingbird mapped onto a sari and a runway coat.", contain: true }
    ]
  },

  {
    slug: "quiet-structure",
    tone: "#d0dbd3",
    title: "Quiet Structure",
    subtitle: "A personal typographic identity",
    date: "Identity & Typography · 2026",
    tags: "Lettering · Wordmark · Identity system",
    cover: "img/qs-01.jpg",
    covers: [{ src: "img/qs-01.jpg" }, { src: "img/qs-07.jpg" }],
    sections: {
      "The Project":
        "Quiet Structure is a self-initiated identity for my own name. It turns MIR ZUHAIR into a custom seven-glyph wordmark, a compact MZ monogram and a small visual system: colour, supporting type, stationery and a poster, so the name can sit confidently beside my work without competing with it.",
      "The Process":
        "I explored the name across many writings (lowercase, spaced capitals, heavy and light weights, stacked and horizontal lockups), then compared three directions: a neutral sans, a literary serif and a constructed set of custom capitals. The constructed direction was refined letter by letter on a cap-height, midline and baseline grid, then built into primary, secondary and compact lockups.",
      "The Problem":
        "A designer's name has to do two jobs at once: be recognisable as a signature, and stay quiet enough that the portfolio, not the logo, is the focus. Off-the-shelf fonts were either too plain to be distinctive or too decorative to sit beside heritage textiles.",
      "The Goal":
        "Presence without the excess: strong verticals for order, fine serifs for detail and a single diagonal, shared by the Z and the R, that gives the name movement. The result had to hold up from a 48 px monogram to a full poster."
    },
    blocks: [
      { type: "full", src: "img/qs-01.jpg", cap: "Quiet Structure: the primary stacked wordmark." },
      { type: "full", src: "img/qs-02.jpg", cap: "The brief: contrast, rhythm and direction." },
      { type: "step", n: "01", h: "Name exploration", p: "The name written many ways: lowercase and capitals, spaced and tight, heavy and light, horizontal and stacked, with notes on what each version does well or badly." },
      { type: "pair", natural: true, items: [
        { src: "img/qs-03.jpg", cap: "Digital sketchbook study: name, weight and rhythm." },
        { src: "img/qs-04.jpg", cap: "Digital sketchbook study: letterform, spacing and hierarchy." }
      ]},
      { type: "full", src: "img/qs-05.jpg", cap: "From rough to vector: simplify the contour, control the rhythm, separate the levels." },
      { type: "step", n: "02", h: "Three ways to write a name", p: "A neutral sans (clear but anonymous), a literary serif (personal but inconsistent) and a constructed set of custom capitals. The third was selected and developed." },
      { type: "full", src: "img/qs-06.jpg", cap: "Comparing directions: A neutral, B literary, C constructed." },
      { type: "step", n: "03", h: "Letter construction", p: "Directional cuts shared by the Z and R, broad stems against fine bars, and an optical correction that lets the U dip below the baseline." },
      { type: "full", src: "img/qs-07.jpg", cap: "Order, with an angle: the lettering on its construction grid." },
      { type: "step", n: "04", h: "The system", p: "Three lockups for three scales, a four-colour palette (Ink, Paper, Moss, Clay) and two supporting typefaces." },
      { type: "pair", natural: true, items: [
        { src: "img/qs-08.jpg", cap: "One name, three scales: stacked, compact MZ and horizontal." },
        { src: "img/qs-09.jpg", cap: "Earthbound, editorial: colour and supporting type." }
      ]},
      { type: "step", n: "05", h: "In use" },
      { type: "pair", natural: true, items: [
        { src: "img/qs-10.jpg", cap: "Stationery concept: letterhead and two-sided card." },
        { src: "img/qs-11.jpg", cap: "Poster study: the diagonal of the Z as a graphic device." }
      ]},
      { type: "full", src: "img/qs-12.jpg", cap: "Usage guidelines: clear space, minimum sizes and reproduction notes." }
    ]
  },
  {
    slug: "mirs-cafe",
    tone: "#ecc7c4",
    title: "Mir's Café",
    subtitle: "Brand identity & campaign",
    date: "Brand & Campaign · 2026",
    tags: "Identity · Packaging · Out-of-home · App · Social",
    cover: "img/mc-st-crosswalk.jpg",
    covers: [{ src: "img/mc-st-crosswalk.jpg" }, { src: "img/mc-box4.jpg" }],
    sections: {
      "The Project":
        "Mir's Café is a self-initiated identity and launch campaign for a chai house in Hyderabad, Sindh. Instead of inventing new ornament, it is built from my own palace drawings: the lantern, the corridor, the painted ceiling, the chandelier and the deer crest become one-ink illustrations across packaging, the street and a phone screen.",
      "The Process":
        "I cut the line drawings from Threads of Time into single-colour artwork and paired them with a Bodoni wordmark and a script signature. The palace doorway arch became the frame for the campaign photography. Each piece was set in Photoshop mockups and real street photography, so the prints follow folds, paper grain and light.",
      "The Problem":
        "Cafés tend to look the same: minimal, beige and interchangeable. A brand rooted in Sindh risks the opposite, turning heritage into costume. It needed a sense of place that still reads as contemporary.",
      "The Goal":
        "A chai house you would recognise from across the street, and a campaign with a single warm idea: \"Stay for the second cup.\" In Sindhi homes the second cup is when the real conversation starts, so from Monday to Thursday, 4 to 7pm, it is on the house."
    },
    note: "Product mockups use free templates from mockups-design.com; street, food and drink photography is from Unsplash. The identity, drawings and all applied artwork are my work.",
    blocks: [
      { type: "full", src: "img/mc-st-crosswalk.jpg", cap: "Wall mural: the lantern drawing and the campaign line on a city corner." },
      { type: "text", h: "Stay for the second cup",
        p: "One line carries the whole campaign. Four key visuals frame real chai photography inside the palace arch: the second cup, Kashmiri pink chai, the copper kettle and morning bun maska." },
      { type: "grid", cols: 4, items: [
        { src: "img/mc-kv1.jpg", cap: "Stay for the second cup." },
        { src: "img/mc-kv2.jpg", cap: "Pink is a flavour." },
        { src: "img/mc-kv3.jpg", cap: "Poured the palace way." },
        { src: "img/mc-kv4.jpg", cap: "Bun maska o'clock." }
      ]},
      { type: "step", n: "01", h: "Packaging", p: "Kraft, canvas and paper printed in oxblood, with colour saved for the pieces people keep: tins, tea pouches and the gift mailers." },
      { type: "full", src: "img/mc-box4.jpg", cap: "Pastry boxes sealed with branded tape." },
      { type: "pair", natural: true, items: [
        { src: "img/mc-cups2.jpg", cap: "Cups in three designs: lantern, deer and corridor band." },
        { src: "img/mc-cup3.jpg", cap: "The second cup: \"The second is ours.\"" }
      ]},
      { type: "pair", natural: true, items: [
        { src: "img/mc-kraft2.jpg", cap: "Takeaway bag with the corridor drawing." },
        { src: "img/mc-tote3.jpg", cap: "Canvas tote with the lantern." }
      ]},
      { type: "pair", natural: true, items: [
        { src: "img/mc-pouch3.jpg", cap: "Loose-leaf chai: house blend under the chandelier, Kashmiri chai under the ceiling." },
        { src: "img/mc-mailers3.jpg", cap: "Mailers: pastry box, Kashmiri chai kit and Eid edition." }
      ]},
      { type: "grid", cols: 3, items: [
        { src: "img/mc-tin1.jpg", cap: "Nankhatai tin, ceiling medallion on the lid." },
        { src: "img/mc-tape2.jpg", cap: "Packing tape." },
        { src: "img/mc-box5.jpg", cap: "Delivery box." }
      ]},
      { type: "pair", natural: true, items: [
        { src: "img/mc-cup1.jpg", cap: "House cup." },
        { src: "img/mc-apron2.jpg", cap: "Barista apron." }
      ]},
      { type: "step", n: "02", h: "The app", p: "Order ahead, collect Second Cup Club stamps and see the 4–7pm offer. Every drink is shown as a real photograph." },
      { type: "trio", natural: true, items: [
        { src: "img/mc-app-home.jpg", cap: "Home: loyalty card, today's offer and drinks." },
        { src: "img/mc-app-product.jpg", cap: "Kashmiri chai." },
        { src: "img/mc-app-rewards.jpg", cap: "Rewards." }
      ]},
      { type: "full", src: "img/mc-iphone1.jpg", cap: "The home screen in the hand." },
      { type: "step", n: "03", h: "On the street", p: "The campaign runs from billboards and bus shelters to wheat-pasted walls, placed in real streets with people walking past." },
      { type: "full", src: "img/mc-billboard1.jpg", cap: "Street billboard." },
      { type: "pair", natural: true, items: [
        { src: "img/mc-st-umbrella.jpg", cap: "Wheat-paste wall." },
        { src: "img/mc-st-hoarding.jpg", cap: "Shop hoardings." }
      ]},
      { type: "pair", natural: true, items: [
        { src: "img/mc-st-roadside.jpg", cap: "Roadside billboard and poster run." },
        { src: "img/mc-busstop.jpg", cap: "Bus shelter." }
      ]},
      { type: "grid", cols: 3, items: [
        { src: "img/mc-citylight.jpg", cap: "City light." },
        { src: "img/mc-cylinder.jpg", cap: "Advertising column." },
        { src: "img/mc-st-airport.jpg", cap: "Airport lightbox." }
      ]},
      { type: "pair", natural: true, items: [
        { src: "img/mc-subway2.jpg", cap: "Subway." },
        { src: "img/mc-st-underground.jpg", cap: "Underground lightboxes." }
      ]},
      { type: "full", src: "img/mc-sign.jpg", cap: "Wrought-iron hanging sign." },
      { type: "step", n: "04", h: "Social & print", p: "Instagram alternates photo posts with type-led posts. The story continues in a cookbook, The Second Cup, and on stickers for every takeaway." },
      { type: "grid", cols: 3, items: [
        { src: "img/mc-ig1.jpg", cap: "" }, { src: "img/mc-ig2.jpg", cap: "" }, { src: "img/mc-ig3.jpg", cap: "" },
        { src: "img/mc-ig4.jpg", cap: "" }, { src: "img/mc-ig5.jpg", cap: "" }, { src: "img/mc-ig6.jpg", cap: "" }
      ]},
      { type: "pair", natural: true, items: [
        { src: "img/mc-book1.jpg", cap: "The Second Cup: stories and recipes from the Mir's table." },
        { src: "img/mc-book2.jpg", cap: "Cover and belly band." }
      ]},
      { type: "pair", natural: true, items: [
        { src: "img/mc-sticker1.jpg", cap: "Emblem sticker." },
        { src: "img/mc-sticker3.jpg", cap: "Second Cup Club sticker." }
      ]},
      { type: "related", text: "The drawings behind the brand are documented in:",
        links: ["lanterns", "corridors-and-chandeliers", "deer-and-doorway", "painted-ceiling"] }
    ]
  },

  {
    slug: "heritage-loop",
    tone: "#cfe1de",
    title: "Heritage Loop",
    subtitle: "Digital platform concept",
    date: "UX / Service Concept · 2025",
    tags: "Personas · UI · Design system",
    coverHTML: true,
    sections: {
      "The Project":
        "Heritage Loop is a concept for a digital platform that links fashion transparency with cultural heritage. Every garment carries two records: its environmental ancestry and its architectural lineage from the Talpur era.",
      "The Process":
        "I started from two user personas, mapped what each needs to trust a garment, and designed three core screens: a Home Feed of traceable pieces, a Digital Twin showing the architectural source of each print, and a Sustainability dashboard. A design system, 'Earthy Regal', ties the product to the collection.",
      "The Problem":
        "Buyers of heritage and sustainable fashion are tired of vague claims and greenwashing. The cultural story behind a textile usually ends at the label.",
      "The Goal":
        "Present hard data with a high-end aesthetic, so that a garment's heritage and its impact are both visible and verifiable with one scan."
    },
    blocks: [
      { type: "hl-overview" },
      { type: "hl-problem" },
      { type: "personas" },
      { type: "hl-journey" },
      { type: "hl-twin" },
      { type: "screens" },
      { type: "system" },
      { type: "hl-ui" },
      { type: "hl-next" }
    ]
  },

  {
    slug: "editorial-mockups",
    tone: "#eed6d8",
    title: "Pattern in Editorial",
    subtitle: "Speculative applications",
    date: "Art Direction · 2025",
    tags: "Moodboard · Photoshop · Pattern mapping",
    cover: "img/ed-vogue-adele.jpg",
    thumb: "img/ed-vogue-margot.jpg",
    thumbPos: "center 20%",
    covers: [{ src: "img/ed-vogue-margot.jpg", pos: "center top" }, { src: "img/ed-vogue-adele.jpg", pos: "center top" }, { src: "img/ed-elle.jpg", pos: "center top" }],
    sections: {
      "The Project":
        "A set of speculative mockups that test the Threads of Time patterns in contemporary fashion media, asking what these ancestral motifs look like on a magazine cover, a red carpet or a runway.",
      "The Process":
        "I started with a moodboard of recent fashion covers to understand the colour, pose and styling of contemporary editorial. Then, in Photoshop, I mapped my pattern designs onto existing photography, using displacement, clipping masks and blend modes so each print follows the folds, light and shadow of the garment.",
      "The Problem":
        "A flat repeat on screen says little about how a textile behaves at scale, in movement or under light. Designers and buyers need to see it in context.",
      "The Goal":
        "To set up a dialogue between Sindhi architectural heritage and the visual language of global fashion, and to test scale, colour and placement before anything is printed."
    },
    spiral: {
      title: ["Pattern", "in", "Editorial"],
      unit: .8,
      items: [
        { src: "img/ed-vogue-margot.jpg", ar: 1.249, f: [0.5, 0.6, 2.6], c: "#e0529a", cap: "Deer-crest print, tone on tone in pink, on a sculpted dress." },
        { src: "img/ed-schiap.jpg", ar: 1.36, f: [0.566, 0.79, 3], c: "#d9674f", cap: "Composition 02 deer print in coral, following the flare and folds of the skirt." },
        { src: "img/ed-elle.jpg", ar: 1.303, f: [0.55, 0.7, 2.6], c: "#c2154a", cap: "Tonal oxblood repeat on a strapless ball gown." },
        { src: "img/ed-vogue-adele.jpg", ar: 1.25, f: [0.4, 0.72, 2.6], c: "#0a8f8a", cap: "Architectural print in teal on a structured gown." },
        { src: "img/ed-red.jpg", ar: 1.244, f: [0.591, 0.62, 2.8], c: "#d95c8f", cap: "Colonnade print on a column gown." },
        { src: "img/ed-vogue-adria.jpg", ar: 1.255, f: [0.412, 0.444, 2.4], c: "#5f8f99", cap: "Draped silk in a soft teal-and-rose colourway." },
        { src: "img/ed-fashion.jpg", ar: 1.247, f: [0.285, 0.697, 2.4], c: "#ac2c3d", cap: "Headscarf rendered in a burgundy ornament repeat." },
        { src: "img/ed-vogue-mexico.jpg", ar: 1.251, f: [0.468, 0.524, 2.6], c: "#1f3a6b", cap: "Portrait-and-floral repeat, tone on tone in navy, on a satin top and fitted skirt." },
        { src: "img/ed-balenciaga.jpg", ar: 1.393, f: [0.528, 0.36, 3], c: "#1d6b70", cap: "Doorway crest in teal and red on a second-skin catsuit." },
        { src: "img/ed-vogue-france.jpg", ar: 1.251, f: [0.438, 0.712, 3.4], c: "#d20b35", cap: "Lantern and archway print in tonal red on a draped skirt." },
        { src: "img/ed-bazaar.jpg", ar: 1.296, f: [0.5, 0.379, 2.6], c: "#c2185b", cap: "Doorway crest in navy and magenta on a sculpted bubble dress." },
        { src: "img/ed-marble.jpg", ar: 1.34, f: [0.527, 0.6, 2.6], c: "#5fae98", cap: "Greek Key print on a fitted gown." },
        { src: "img/ed-gown.jpg", ar: 1.601, f: [0.5, 0.55, 2.4], c: "#7b2fb0", cap: "Hummingbird print on an evening coat." },
        { src: "img/ed-group.jpg", ar: 1.205, f: [0.5, 0.6, 2.2], c: "#7a2436", cap: "Collection view: several repeats styled together as a runway line-up." }
      ]
    },
    note: "These are speculative mockups made for study. Original photography, models and magazine mastheads belong to their respective publications and photographers; only the textile patterns are my work.",
    blocks: [
      { type: "full", src: "img/ed-moodboard.jpg", cap: "Moodboard: contemporary fashion covers as the visual context for the collection.", contain: true },
      { type: "trio", items: [
        { src: "img/ed-vogue-margot.jpg", cap: "Deer-crest print, tone on tone in pink, on a sculpted dress." },
        { src: "img/ed-vogue-adele.jpg", cap: "Architectural print in teal on a structured gown." },
        { src: "img/ed-elle.jpg", cap: "Tonal oxblood repeat on a strapless ball gown." }
      ]},
      { type: "trio", items: [
        { src: "img/ed-vogue-adria.jpg", cap: "Draped silk in a soft teal-and-rose colourway." },
        { src: "img/ed-schiap.jpg", cap: "Composition 02 deer print in coral on a flared silhouette." },
        { src: "img/ed-fashion.jpg", cap: "Headscarf rendered in a burgundy ornament repeat." }
      ]},
      { type: "trio", items: [
        { src: "img/ed-red.jpg", cap: "Colonnade print on a column gown." },
        { src: "img/ed-marble.jpg", cap: "Greek Key print on a fitted gown." },
        { src: "img/ed-gown.jpg", cap: "Hummingbird print on an evening coat." }
      ]},
      { type: "pair", items: [
        { src: "img/ed-vogue-mexico.jpg", cap: "Portrait-and-floral repeat, tone on tone in navy, on a satin top and fitted skirt." },
        { src: "img/ed-vogue-france.jpg", cap: "Lantern and archway print in tonal red on a draped skirt." }
      ]},
      { type: "pair", items: [
        { src: "img/ed-balenciaga.jpg", cap: "Doorway crest in teal and red on a second-skin catsuit." },
        { src: "img/ed-bazaar.jpg", cap: "Doorway crest in navy and magenta on a sculpted bubble dress." }
      ]},
      { type: "full", src: "img/ed-group.jpg", cap: "Collection view: multiple repeats styled together as a runway line-up." }
    ]
  }
];

const RESEARCH = [
  { src: "img/cc-exterior.jpg", cap: "Talpur Haveli, exterior" },
  { src: "img/cc-hall.jpg", cap: "Main corridor" },
  { src: "img/cc-yellow.jpg", cap: "The yellow hall" },
  { src: "img/cc-chandelier.jpg", cap: "Etched-glass chandelier" },
  { src: "img/dd-door.jpg", cap: "Doorway with deer trophies" },
  { src: "img/ln-yellow.jpg", cap: "Jewelled lantern, yellow" },
  { src: "img/ln-red.jpg", cap: "Jewelled lantern, ruby" },
  { src: "img/cc-chandelier-2.jpg", cap: "Chandelier, yellow hall" },
  { src: "img/pt-portrait.jpg", cap: "Ancestral portrait" },
  { src: "img/pt-portrait-2.jpg", cap: "Ancestral portrait" },
  { src: "img/gr-marble.jpg", cap: "The ivory table, carved pedestal" }
];
