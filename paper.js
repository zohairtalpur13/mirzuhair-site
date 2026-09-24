/* Threads of Time — the thesis paper, edited for the web.
   Items render in order. Figures are numbered automatically.
   t: "h" (section heading) · "h3" (sub-heading) · "p" (paragraph) · "list" · "pull" (pull quote)
      "fig" (layout: full | pair | trio | grid) · "table" */

const PAPER = {
  title: "Threads of Time",
  sub: "Reading a Sindhi palace as a textile: architectural ornament from the Talpur Haveli, Hyderabad, translated into digitally printed silk and sculpted brass",
  meta: [
    ["Author", "Mir Zuhair Talpur"],
    ["Programme", "BFA Textile Design, Department of Textile Design"],
    ["Institution", "Shaheed Allah Bux Soomro University of Art, Design and Heritages, Jamshoro"],
    ["Supervisor", "Ijaz Hussain"],
    ["Submitted", "December 2025"]
  ],
  abstract:
    "This thesis asks how the architectural ornament of the Talpur Haveli in Hyderabad, Sindh, a palace built in 1843, can be documented and carried into contemporary fashion without being reduced to surface decoration. Through repeated site visits I built a primary archive of more than 190 photographs and 49 sketchbook pages covering the palace's painted ceilings, lantern-lit corridors, carved doorways, ancestral portraits and furniture. From this archive I developed seven compositions, each redrawn as digital line work and built into a seamless repeat. Jacquard weaving and digital printing on silk were both sampled; digital printing was chosen for its ability to hold fine line detail. The outcome is a single look that reads like a walk through the building: a draped silk cape printed with the painted ceiling, a floor-length mermaid skirt printed with the corridor, and a corset of hand-cut brass roses made in collaboration with a sculptor. The project shows that a site-specific, drawing-led method can turn endangered regional ornament into wearable work, and it proposes that the same archive can extend into identity, packaging and digital products.",
  keywords: ["Sindhi architecture", "Talpur Haveli", "heritage motifs", "digital textile printing", "silk", "surface design", "cultural preservation"],
  body: [
    { t: "h", n: "1", h: "Introduction" },
    { t: "p", text: "Pakistan's architectural heritage is rich, but it is rarely used as a source by the country's textile and fashion industry. When it is, the reference is usually Mughal. The buildings of the Talpur Mirs, who ruled Sindh from 1783 until 1843, carry their own visual language of carved teak, painted ceilings, coloured glass and gilt, and much of it is slowly disappearing through neglect, urban change and a lack of documentation." },
    { t: "p", text: "The Talpur Haveli in Hyderabad is one of the places where this language survives. I grew up around it. This thesis began as an attempt to record it properly, room by room, and then to ask what it would mean to wear it." },
    { t: "fig", layout: "pair", items: [
      { src: "img/hx-facade.jpg", cap: "The Talpur Haveli, Hyderabad: the façade." },
      { src: "img/cc-hall.jpg", cap: "The main corridor: beamed ceiling, carved chairs and a crystal chandelier." }
    ]},
    { t: "h3", h: "1.1 Research question" },
    { t: "pull", text: "How can the architectural ornament of the Talpur Haveli be reinterpreted through digital textile processes to produce silk garments that are culturally rooted, but read as contemporary?" },
    { t: "h3", h: "1.2 Why it is needed" },
    { t: "list", items: [
      "There is no systematic documentation of the Haveli's motifs for design use.",
      "Sindhi architecture is under-represented in textile research compared with Mughal and Indo-Persian sources.",
      "Where heritage appears in fashion, it is often lifted as decoration, stripped of the structure and meaning it came from.",
      "Few collections translate Sindhi architectural heritage specifically into wearable work."
    ]},
    { t: "h3", h: "1.3 Aims" },
    { t: "list", items: [
      "Document the palace's architecture, objects and ornament through photography and drawing.",
      "Extract a vocabulary of motifs and redraw them as print-ready digital line work.",
      "Build a colour palette sampled directly from the rooms.",
      "Test weave and print, and produce high-quality digital prints on silk.",
      "Design a final look in which the garment carries the logic of the building (its rhythm, weight and light), not only its surface."
    ]},

    { t: "h", n: "2", h: "Context" },
    { t: "h3", h: "2.1 The palace and its ornament" },
    { t: "p", text: "Built in 1843, the Haveli combines several decorative systems in one house. The ceilings are painted with star-shaped medallions, radiating petals and dense floral infill, outlined in gilt. The corridors are measured out by hanging glass lanterns, chandeliers and rows of carved chairs. Arched teak doors are crowned with mounted stags. Portraits of Talpur ancestors hang in carved frames, and objects such as a carved ivory table with an eagle pedestal sit among them." },
    { t: "fig", layout: "trio", items: [
      { src: "img/tt-ceiling-detail.jpg", cap: "Painted ceiling: medallions, gilt line and floral infill." },
      { src: "img/dd-door.jpg", cap: "Arched doorway crowned with deer trophies." },
      { src: "img/ln-red.jpg", cap: "Hand-painted glass lantern set with stones." }
    ]},
    { t: "p", text: "These surfaces belong to a wider Sindhi material culture: a wood-carving tradition of floral vines, mandalas and geometric balance; the jharoka and the arch as symbols of hospitality and status; and a textile heritage (Ajrak, Bandhani, Ralli) built on pattern, symmetry and repetition. The palace is, in effect, already a pattern book." },
    { t: "h3", h: "2.2 Heritage in contemporary fashion" },
    { t: "p", text: "Designers have long turned historical and architectural material into print. Mary Katrantzou is known for digital prints built from objects, interiors and architecture. Sabyasachi Mukherjee reworks Indian historical references into couture. In Pakistan, labels such as Sania Maskatiya and Élan regularly build collections around cultural and architectural motifs. Schiaparelli's sculptural gold jewellery and bodices, under Daniel Roseberry, informed the brass corset in this project." },
    { t: "p", text: "Most of this work uses heritage as a general mood or a decorative reference. The gap this thesis addresses is narrower: a site-specific method, based on primary fieldwork, that documents a single endangered building and translates it into cloth." },

    { t: "h", n: "3", h: "Methodology" },
    { t: "p", text: "The research was primary and practice-led. It moved through five stages: observe, document, draw, decode, translate." },
    { t: "table", head: ["Stage", "What I did", "Output"], rows: [
      ["Observe", "Walked the palace room by room over repeated visits, looking for elements that repeat: arches, lanterns, stags, medallions.", "A list of eight rooms and their dominant motifs"],
      ["Document", "Photographed architecture, objects and heirlooms at high resolution, from the façade to the jewels on a lantern.", "190+ photographs"],
      ["Draw", "Traced and sketched each element on site and from photographs, first in pencil, then in ink.", "49 sketchbook pages"],
      ["Decode", "Analysed the drawings for symmetry, rhythm and proportion; sampled colour palettes from each room.", "Motif vocabulary and room palettes"],
      ["Translate", "Redrew motifs as digital line work, built repeats, and sampled them in weave and print.", "Seven compositions; silk and jacquard samples"]
    ]},
    { t: "fig", layout: "grid", items: [
      { src: "img/sk-co-1.jpg", cap: "Sketchbook: the corridor, ink.", contain: true },
      { src: "img/sk-ce-1.jpg", cap: "Sketchbook: ceiling medallion, pencil.", contain: true },
      { src: "img/sk-dd-9.jpg", cap: "Sketchbook: the stag crest, pencil.", contain: true },
      { src: "img/sk-iv-1.jpg", cap: "Sketchbook: the carved eagle of the ivory table.", contain: true }
    ]},
    { t: "p", text: "Looking closely at the material, and not only the pattern, mattered. I studied how light falls across carved surfaces, where gilt has worn through, and how coloured glass tints the rooms. These observations fed directly into line weight, layering and palette." },
    { t: "h3", h: "3.1 A sustainability frame: reduce, reuse, recycle" },
    { t: "list", items: [
      "<b>Reduce.</b> Digital printing is print-on-demand: only the required metres are produced, with less dye water and fabric waste than conventional dyeing and screen printing.",
      "<b>Reuse.</b> Existing cultural archives are reused as design sources, instead of borrowing foreign aesthetics.",
      "<b>Recycle.</b> Once digitised, the motifs become reusable assets. The same drawings have since carried a fragrance identity, a café brand and a digital platform."
    ]},

    { t: "h", n: "4", h: "Design development" },
    { t: "h3", h: "4.1 Stylisation" },
    { t: "p", text: "The palace's ornament was made for walls and ceilings, not bodies. Each drawing was redrawn as continuous line work in Photoshop and simplified: visual noise that would blur on silk was removed, forms were mirrored, rotated or elongated, and symmetry was kept as the organising principle. The aim was to make each motif clear enough to print while keeping it recognisable as the Haveli." },
    { t: "fig", layout: "pair", items: [
      { src: "img/ce-drawing.jpg", cap: "Digital line drawing of the painted ceiling.", contain: true },
      { src: "img/co-drawing.jpg", cap: "Digital line drawing of the corridor.", contain: true }
    ]},
    { t: "h3", h: "4.2 Seven compositions" },
    { t: "p", text: "The motif vocabulary was organised into seven compositions, each drawn from a different part of the house:" },
    { t: "table", head: ["", "Composition", "Source"], rows: [
      ["01", "The corridor", "Beamed ceilings, green glass lanterns, chandeliers and carved chairs"],
      ["02", "The deer", "Mounted stags above the arched doors"],
      ["03", "Windows and doors", "Arched teak doors and fanlights"],
      ["04", "The painted ceiling", "Star medallions, radiating petals and floral infill"],
      ["05", "Portrait of an ancestor", "Painted portraits in carved foliate frames"],
      ["06", "Chandeliers", "Candelabra, peacocks, vases and the carved eagle"],
      ["07", "The ivory table", "The carved pedestal: eagle, faces, acanthus and roses"]
    ]},
    { t: "fig", layout: "trio", items: [
      { src: "img/comp-1.jpg", cap: "Composition 01 board: the corridor.", contain: true },
      { src: "img/comp-4.jpg", cap: "Composition 04 board: the painted ceiling.", contain: true },
      { src: "img/comp-7.jpg", cap: "Composition 07 board: the ivory table.", contain: true }
    ]},
    { t: "p", text: "Compositions 02 and 03 were combined into the central emblem of the collection: a crest of arched doors flanked by stags. Placement was planned for the body. The ceiling works as an all-over medallion field, and the corridor works as a scenic toile whose arches and staircases open out at a flared hem." },
    { t: "fig", layout: "full", items: [
      { src: "img/dd-colour.jpg", cap: "The stag crest, drawn from Compositions 02 and 03, in two colourways.", contain: true }
    ]},
    { t: "h3", h: "4.3 Colour" },
    { t: "p", text: "Palettes were sampled from my own photographs of each room: the oxblood and ember of the red hall, the lime-wash and amber of the yellow hall, the gilt and rose of the painted ceiling, the bronze and charcoal of the lantern-lit gallery. Each palette was then tuned during sampling to account for how silk takes colour." },
    { t: "h3", h: "4.4 Sampling: jacquard and digital print" },
    { t: "p", text: "Two processes were tested. Jacquard weaving gave the motifs depth and structure, but it could not hold the fine line detail of the ceiling and corridor drawings at garment scale. Digital printing on silk held every line, reproduced colour with high saturation, and kept the fabric's drape. Digital print was chosen for the final look, and the jacquard work remains part of the pattern system." },
    { t: "fig", layout: "trio", items: [
      { src: "img/tt-hoop-1.jpg", cap: "Samples on hoops: the doorway composition." },
      { src: "img/tt-hoop-2.jpg", cap: "Samples on hoops: the ceiling medallion." },
      { src: "img/tt-hoop-3.jpg", cap: "Samples on hoops: black-and-white doorway repeat." }
    ]},
    { t: "fig", layout: "pair", items: [
      { src: "img/cr-jq-red.jpg", cap: "Jacquard file: the crest, crimson on navy." },
      { src: "img/co-bronze.jpg", cap: "Final print repeat: the corridor, bronze on charcoal." }
    ]},

    { t: "h", n: "5", h: "The final look" },
    { t: "p", text: "The outcome is a single look that reads from top to bottom like a walk through the Haveli. The ceiling sits at the shoulders, the corridor falls to the floor, and gold blooms where the lanterns would hang." },
    { t: "fig", layout: "full", tall: true, items: [
      { src: "img/tt-hero.jpg", cap: "Threads of Time: brass corset, painted-ceiling silk cape and corridor mermaid skirt.", contain: true }
    ]},
    { t: "h3", h: "5.1 The ceiling cape" },
    { t: "p", text: "Composition 04 printed in rose-gold line on oxblood silk. The cape is cut with volume so that it drapes into a deep cowl, letting the medallions fold and catch the light in the way the painted ceiling does." },
    { t: "h3", h: "5.2 The corridor skirt" },
    { t: "p", text: "Composition 01 printed in bronze on charcoal silk and cut as a panelled mermaid skirt. The panels are placed so that the corridor's arches, lanterns and staircases flare open at the hem." },
    { t: "h3", h: "5.3 The brass corset" },
    { t: "p", text: "Made in collaboration with a sculptor and inspired by Schiaparelli's surrealist gold, the corset is cut, shaped and assembled from brass sheet into petals, buds and leaves. Its roses climb over one shoulder. The rigid metal gives the look the permanence and weight of the building, and it contrasts with the fluid silk." },
    { t: "fig", layout: "trio", items: [
      { src: "img/tt-front.jpg", cap: "Front." },
      { src: "img/tt-side.jpg", cap: "Side: the cape's cowl." },
      { src: "img/tt-back.jpg", cap: "Back." }
    ]},
    { t: "h3", h: "5.4 The installation" },
    { t: "p", text: "The look was exhibited in a curtained room lit by bare bulbs on knotted rope. Silk banners printed with the stag crest in every colourway hung beside it, so visitors could see the whole pattern system around the finished garment." },

    { t: "h", n: "6", h: "Discussion" },
    { t: "h3", h: "6.1 Challenges and responses" },
    { t: "table", head: ["Challenge", "Response"], rows: [
      ["Architectural ornament is too detailed to print directly at body scale.", "Stylised into clean line work; test prints showed which motifs held on silk."],
      ["Ceiling- and wall-scale compositions lose proportion when placed on a garment.", "Several placements were tested digitally so the print follows the cut rather than overwhelming it."],
      ["Silk takes dye differently from screen colour.", "Extensive sampling and adjusted colour files to match the room palettes."],
      ["Heritage references can look like costume.", "Contemporary silhouettes (cape, mermaid skirt) and a restrained, tonal palette."],
      ["Metal is rigid, heavy and hard to fit.", "Worked with a sculptor; the corset was built as an open structure of flowers and leaves, not a closed shell."]
    ]},
    { t: "h3", h: "6.2 Where the work sits" },
    { t: "p", text: "Compared with heritage-led couture, which often relies on heavy embellishment, this project keeps the surface to printed line and puts the weight into one sculptural piece. Compared with contemporary labels that use cultural motifs in a general way, its motifs are site-specific and traceable: every print can be followed back to a room, an object and a drawing. Its contribution is a documented method as much as a garment." },
    { t: "pull", text: "The tension between soft silk and rigid brass is the message: memory soft enough to wear and strong enough to last." },

    { t: "h", n: "7", h: "Conclusion" },
    { t: "p", text: "Threads of Time shows that a single building, studied closely enough, can supply a complete design language. Primary fieldwork gave the work its authenticity, drawing gave it structure, and digital printing on silk let fine architectural detail survive the move onto the body. The process also produced a reusable archive. Since the thesis, the same drawings have carried a fragrance identity, a café brand and a digital heritage platform, which supports the claim that documented heritage can keep producing new work." },
    { t: "h3", h: "7.1 Future work" },
    { t: "list", items: [
      "<b>A complete motif archive.</b> The Haveli holds hundreds of geometric, floral, calligraphic and symbolic motifs; this study used a selection.",
      "<b>Mixed media.</b> Laser cutting, embroidery, 3D printing or augmented reality could extend the brass work.",
      "<b>Wider fabric testing.</b> Organza, velvet, cotton-silk blends and recycled fibres.",
      "<b>Artisan collaboration.</b> Working with Sindhi craftspeople, historians and cultural institutions.",
      "<b>Market testing.</b> Consumer research and commercial feasibility for heritage-led print."
    ]}
  ],
  sources:
    "The primary sources for this research are my own site visits to the Talpur Haveli, Hyderabad, a photographic archive of more than 190 images, and 49 sketchbook pages. Context images of Hyderabad are from 19th-century lithographs. Designers named in Section 2.2 are referred to by their publicly known work.",
  thanks:
    "With thanks to my supervisor, Ijaz Hussain; to Aasma and Javeria for their help with the initial data collection; and to my father, Mir Akhtar, my mother, my sister Abeeha and my brother Qais."
};
