/* “RAW” — a wabi-sabi magazine in black and red, in Virgil Abloh's label language.
   Configures the shared cover compositor (scrap/covers.js) before it loads. */
window.COVER_CONFIG = {
  masthead: "RAW",
  tagline: ["A MAGAZINE ABOUT THINGS", "THAT SHOW THEIR AGE  ·  FREE"],
  fonts: ['900 300px "Archivo"', '800 20px "Archivo"'],
  file: function (n) { return "raw-" + n; },
  // “RAW” in quotation marks, and a factory label beside it, like his printed bags.
  drawMasthead: function (ctx, issue, L) {
    ctx.save();
    const word = "\u201CRAW\u201D";
    const track = -14;
    ctx.font = '900 300px "Archivo"';
    const natural = word.split("").reduce(function (w, ch) { return w + ctx.measureText(ch).width + track; }, 0);
    const size = Math.floor(300 * (L.W - 2 * L.MARGIN + 16) / natural);
    ctx.font = '900 ' + size + 'px "Archivo"';
    ctx.fillStyle = "#c8261b";
    let x = L.MARGIN - 8;
    const baseline = 70 + size * 0.73;
    word.split("").forEach(function (ch) {
      ctx.fillText(ch, x, baseline);
      x += ctx.measureText(ch).width + track * size / 300;
    });
    // the factory label, right-aligned beneath the name
    ctx.fillStyle = issue.ink;
    ctx.font = '800 20px "Archivo"';
    ctx.textAlign = "right";
    ["\u201C" + issue.word + "\u201D"].concat(issue.label, ["c/o MIR ZUHAIR\u2122", "\u00A92026"])
      .forEach(function (line, i) { ctx.fillText(line, L.W - L.MARGIN, baseline + 58 + i * 27); });
    ctx.restore();
    return baseline + 16;
  },
  issues: [
    { n: "01", myth: "Vessel", word: "VESSEL", label: ["BLACK STONE", "RED LACQUER INSIDE"],
      ink: "#efe9df", accent: "#c8261b", scrim: "rgba(0,0,0,0.5)",
      headline: ["Made", "by hand."],
      season: "The imperfect issue",
      lines: ["Black stone, red lacquer inside", "Wabi-sabi in three words", "The beauty of a thing that wobbles"],
      story: "Wabi-sabi finds beauty in what is rough, aged and not quite finished. The first issue is a vessel formed by hand and left out of true: black stone outside, red lacquer inside, so the colour only shows to someone who looks in.",
      object: "“VESSEL”, stone, red lacquer interior. Edition of 7." },
    { n: "02", myth: "Repair", word: "REPAIR", label: ["BLACK RAKU", "RED LACQUER SEAMS"],
      ink: "#efe9df", accent: "#c8261b", scrim: "rgba(0,0,0,0.5)",
      headline: ["Broken", "is better."],
      season: "The repair issue",
      lines: ["Kintsugi, in red", "Why the crack is the point", "Raku, fired twice"],
      story: "A black raku bowl, broken and mended with red lacquer instead of gold. The repair is not hidden: it becomes the pattern, a map of every time the bowl was dropped and kept.",
      object: "“REPAIR”, raku, red lacquer seams. Unique." },
    { n: "03", myth: "Rest", word: "BENCH", label: ["BLACK LIME PLASTER", "RED LINEN"],
      ink: "#efe9df", accent: "#c8261b", scrim: "rgba(0,0,0,0.5)",
      headline: ["Sit", "still."],
      season: "The quiet issue",
      lines: ["One bench, one red cushion", "Rooms that do less", "Light as furniture"],
      story: "A room with almost nothing in it: a bench of black plaster, one red cushion and a slot of daylight moving across the wall. The emptiness is the design; the light does the decorating.",
      object: "“BENCH”, black lime plaster, red linen." },
    { n: "04", myth: "The Book", word: "BOOK", label: ["RED BOOKCLOTH", "BLACK INK"],
      ink: "#efe9df", accent: "#c8261b", scrim: "rgba(0,0,0,0.5)",
      headline: ["Read", "slowly."],
      season: "The reading issue",
      lines: ["The most honest object", "is the one that shows its age", "Cloth, worn at the corners"],
      story: "A red cloth book on a black plaster block, its title printed like a statement: the most honest object is the one that shows its age. It answers the book on my desk, whose orange cover says the most creative act is creating yourself.",
      object: "“BOOK”, red bookcloth, black ink." },
    { n: "05", myth: "Stones", word: "STONE", label: ["RAW STONE", "ONE STAINED RED"],
      ink: "#efe9df", accent: "#c8261b", scrim: "rgba(0,0,0,0.5)",
      headline: ["Three", "stones."],
      season: "The found issue",
      lines: ["Found, not made", "One of them is red", "The floor as a plinth"],
      story: "Three rough stone pots set straight on the floor, the way they appear in quiet rooms: unpolished, uneven, one of them stained red. Nothing is placed on a pedestal; the floor is enough.",
      object: "“STONE”, three pots, one red. Set of 3." }
  ]
};
