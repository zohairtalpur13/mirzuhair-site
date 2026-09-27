/* TALPUR — the artifacts of the Talpur haveli as a magazine. Configures the shared
   cover compositor (scrap/covers.js) before it loads. */
window.COVER_CONFIG = {
  masthead: "TALPUR",
  // The masthead is the name in Nastaliq calligraphy; English sits beneath in spaced capitals.
  drawMasthead: function (ctx, issue, L) {
    ctx.save();
    ctx.fillStyle = issue.ink;
    ctx.direction = "rtl";
    ctx.textAlign = "right";
    ctx.font = '290px "Gulzar"';
    ctx.fillText("\u0679\u0627\u0644\u067E\u0631", L.W - L.MARGIN + 6, 282);
    ctx.direction = "ltr";
    ctx.textAlign = "left";
    ctx.font = '400 34px "Instrument Serif"';
    let x = L.MARGIN;
    "TALPUR".split("").forEach(function (ch) {
      ctx.fillText(ch, x, 128);
      x += ctx.measureText(ch).width + 16;
    });
    ctx.font = 'italic 25px "Instrument Serif"';
    ctx.fillText("the house and its objects", L.MARGIN, 166);
    ctx.globalAlpha = 0.7;
    ctx.fillRect(L.MARGIN, 190, 120, 1.5);
    ctx.restore();
    return 318;
  },
  tagline: ["THE ARTIFACTS OF THE TALPUR HAVELI", "HYDERABAD, SINDH  ·  SINCE 1843"],
  fonts: ['290px "Gulzar"', '400 34px "Instrument Serif"', 'italic 25px "Instrument Serif"'],
  file: function (n) { return "talpur-" + n; },
  issues: [
    { n: "01", scrim: "rgba(45,12,14,0.62)", myth: "The Ruby Vase", word: "GLASS", ink: "#f4efe4", accent: "#ecc77c",
      headline: ["Still", "here."],
      season: "The survivor issue",
      lines: ["Ruby glass, gilt by hand", "Why objects outlive us", "The carriage print, redrawn"],
      story: "A ruby glass vase with gilt vines stands on the dining table of the haveli, on a red runner, where it has stood longer than anyone can remember. It is rendered here from my photographs of it and placed in front of the repeat I drew from the house, where the same vase appears between the carriage and the stag.",
      object: "Ruby glass, gilt vine, scalloped foot. The dining room." },
    { n: "02", scrim: "rgba(45,12,14,0.62)", myth: "The Ewer", word: "HEIRLOOM", ink: "#f4efe4", accent: "#e8c47a",
      headline: ["Handle", "with care."],
      season: "The inheritance issue",
      lines: ["A painted boy, a gilded spout", "Porcelain that crossed an ocean", "The clock print, in ivory"],
      story: "A porcelain ewer with a gilded collar and foot, a spout that ends in a bird’s head, and a small painted scene of a boy lighting a toy cannon. The painting on the render is taken from my own photograph, so the object carries its real picture into the magazine.",
      object: "Porcelain, gilding, hand-painted panel. The sideboard." },
    { n: "03", scrim: "rgba(244,232,206,0.72)", myth: "The Goblet", word: "CHEERS", ink: "#141210", accent: "#0f4a2a",
      headline: ["Cut", "to clear."],
      season: "The toast issue",
      lines: ["Green glass, cut to the light", "The jali, drawn in gold", "Toasts nobody remembers"],
      story: "A green overlay goblet, cut through to clear glass in a diamond lattice so the light arrives in facets. It stands in front of the jali repeat, the carved screen that divides the haveli’s light in the same way the cuts divide the glass.",
      object: "Green overlay glass, diamond cut. The marble table." },
    { n: "04", scrim: "rgba(22,20,18,0.6)", myth: "The Cabinet", word: "CABINET", ink: "#f4efe4", accent: "#e0a64b",
      headline: ["Shelf", "life."],
      season: "The collection issue",
      lines: ["Three objects, one house", "What a family keeps", "The chandelier print, in amber"],
      story: "The three objects together, as a family keeps them: not in a museum case but on a shelf, used, dusted and put back. The amber chandelier repeat behind them is drawn from the room they share.",
      object: "Ewer, vase and goblet together. Edition of the house." },
    { n: "05", scrim: "rgba(20,24,48,0.62)", myth: "The Lantern", word: "LANTERN", ink: "#f4efe4", accent: "#f2c94c",
      headline: ["Keep", "the light."],
      season: "The light issue",
      lines: ["Yellow enamel, set with glass jewels", "The hallway, after dark", "The clock print, in saffron"],
      story: "A yellow enamelled glass lantern hangs from the ceiling on a brass chain, painted with sprigs of flowers and set with red, green and amber glass jewels. The render uses my photograph of it as its skin, so every jewel sits where it really is.",
      object: "Enamelled glass, glass jewels, brass. The hallway." },
    { n: "06", scrim: "rgba(18,16,14,0.62)", myth: "The Clock", word: "CLOCK", ink: "#f1e6d0", accent: "#d9b36a",
      headline: ["Time,", "kept."],
      season: "The hours issue",
      lines: ["Walnut, bronze and a gilt dial", "Its dial names Calcutta", "The carriage print, in bronze"],
      story: "A carved walnut mantel clock with bronze mounts: lion masks down the sides, a green man below the dial, a bird on the crest and paw feet. I cut it out of my own photograph and set it on a wooden body, so the render keeps every carving exactly as it is.",
      object: "Walnut, gilt bronze, enamel dial. The mantelpiece." },
    { n: "07", scrim: "rgba(40,14,34,0.62)", myth: "The Decanter", word: "DECANTER", ink: "#f4efe4", accent: "#e7c77d",
      headline: ["Pour", "slowly."],
      season: "The ceremony issue",
      lines: ["Ruby glass, cut and gilded", "A stopper taller than the bottle", "The chandelier print, in emerald"],
      story: "A ruby cut-glass decanter, gilded and enamelled with flowers, with a tall stopper ringed in red. It stands on the marble table among the goblets, under the coloured glass of the fanlights.",
      object: "Bohemian ruby glass, gilding, enamel. The marble table." },
    { n: "08", scrim: "rgba(40,16,26,0.62)", myth: "The Cranberry Vase", word: "CRANBERRY", ink: "#f4efe4", accent: "#f0b6c8",
      headline: ["Pink,", "on purpose."],
      season: "The colour issue",
      lines: ["Fluted glass, gilt ferns", "Gold in the melt makes the pink", "The stairwell print, in rose"],
      story: "A fluted cranberry glass vase painted with gilt ferns. Its pink comes from gold dissolved into the glass, so the colour and the decoration are made of the same metal. It stands in front of the rose stairwell print.",
      object: "Cranberry glass, gilt enamel. The dining room." },
    { n: "09", noMask: true, scrim: "rgba(16,12,10,0.62)", myth: "The Ivory Table", word: "IVORY", ink: "#f4efe4", accent: "#eadcc0",
      headline: ["Carved", "by hand."],
      season: "The ivory issue",
      lines: ["Eagles, faces and roses", "Two tables, one carver", "Photographed where it stands"],
      story: "Two tables in the haveli stand on ivory pedestals carved with eagles, faces, vines and roses. They are too fine to rebuild in 3D, so this cover is my own photograph of one of them, set exactly as the other issues are.",
      object: "Carved ivory pedestal. The drawing room." }
  ]
};
