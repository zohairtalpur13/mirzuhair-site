/* Detail tours: [x, y, zoom, title, text] — x/y are fractions of the image; zoom 1 = whole image */
const TOURS = {
  "threads-of-time": { img: "img/tt-hero.jpg", pts: [
    [.5, .5, 1, "The whole look", "A house you can wear: ceiling at the shoulders, corridor to the floor, gold where the lanterns would hang."],
    [.5, .2, 2.2, "Brass corset", "Roses and leaves cut and shaped from brass sheet, made in collaboration with a sculptor."],
    [.7, .3, 2, "Ceiling cape", "The painted-ceiling medallions, printed in rose-gold line on oxblood silk and draped into a cowl."],
    [.5, .72, 1.8, "Corridor skirt", "The corridor toile in bronze on charcoal silk, cut so the arches flare open at the hem."]] },
  "deer-and-doorway": { img: "img/cr-drawing.jpg", pts: [
    [.5, .5, 1, "The crest", "Doorway, windows and stags composed into a single emblem."],
    [.5, .1, 4, "The stag crown", "A single stag head crowns the crest, drawn from the trophies above the palace doors."],
    [.5, .34, 2.6, "The doorway", "The arched teak double door, with its divided fanlight."],
    [.2, .33, 3.2, "Gothic windows", "Arched windows flank the door, keeping the façade's symmetry."],
    [.2, .53, 3.4, "Stags and vines", "Stags among grapes and vines hold the sides of the crest."],
    [.5, .86, 3, "Scrollwork", "Baroque scrolls close the crest at its base."]] },
  "painted-ceiling": { img: "img/ce-final-teal.jpg", pts: [
    [.5, .5, 1, "The repeat", "The painted ceiling rebuilt as a continuous medallion pattern."],
    [.5, .5, 3.2, "The sunburst", "A central medallion of radiating petals, as seen looking straight up."],
    [.27, .38, 3.4, "Petal infill", "Every petal holds its own floral line drawing."],
    [.1, .1, 3.4, "The lattice", "Interlaced bands tie each medallion into the next."]] },
  "portrait-of-an-ancestor": { img: "img/pt-jq-3.jpg", pts: [
    [.5, .5, 1, "The final print", "An ancestor's portrait layered over the ceiling pattern, in teal on crimson."],
    [.5, .24, 3.4, "The crown", "The crown and turban from the archival portrait, redrawn in line."],
    [.5, .52, 2.4, "The sitter", "Embroidered waistcoat and robe, simplified into print-ready line work."],
    [.3, .36, 3, "Lotus cartouche", "A frame of lotus and leaves drawn from the palace's carved wood."],
    [.15, .12, 3, "Ceiling ground", "The painted-ceiling pattern runs quietly behind the figure."]] },
  "corridors-and-chandeliers": { img: "img/co-drawing.jpg", pts: [
    [.5, .5, 1, "The corridor", "The whole corridor drawn as one scene, built to tile seamlessly."],
    [.33, .15, 3, "Hanging lanterns", "Glass lanterns set the rhythm of the space."],
    [.62, .43, 3, "Carved chairs", "The palace's carved chairs, repeated down the length of the hall."],
    [.22, .46, 2.8, "Balustrade", "A carved balustrade gives the drawing depth."],
    [.24, .86, 3, "Arches", "Arches and doorways open the scene into the next repeat."]] },
  "ivory-table": { img: "img/sk-iv-1.jpg", pts: [
    [.5, .5, 1, "The eagle", "The carved eagle of the ivory table, drawn in pencil."],
    [.44, .18, 3.4, "The head", "Beak and brow, where the carving is sharpest."],
    [.3, .42, 2.6, "Feathers", "Layered feathers, drawn to capture carved light and shadow."],
    [.46, .72, 3, "Talons and base", "The talons grip the pedestal's rounded base."]] },
  "lanterns": { img: "img/ln-drawing.jpg", pts: [
    [.5, .5, 1, "The lantern", "One jewelled glass lantern, drawn as a detailed line illustration."],
    [.38, .07, 3.4, "The chain", "The hanging chain, later extended into the dotted links of the repeat."],
    [.5, .43, 2.4, "Sunflower vines", "The painted sunflowers and vines on the glass."],
    [.5, .72, 3, "Painted band", "A band of triangles and dots at the lantern's base."],
    [.5, .93, 3.6, "The finial", "The small drop finial that ends the silhouette."]] },
  "greek-ornament": { img: "img/gk-colonnade-pattern.jpg", pts: [
    [.5, .5, 1, "Colonnade", "Domed pavilions and columns wrapped in roses, on vibrant pink."],
    [.32, .25, 2.8, "The pavilion", "A classical domed pavilion, the anchor of the repeat."],
    [.33, .55, 2.8, "Rose vines", "Pastel roses climb the columns between pavilions."]] },
  "quiet-structure": { img: "img/qs-07.jpg", pts: [
    [.5, .5, 1, "The lettering", "Custom capitals on a cap-height, midline and baseline grid."],
    [.13, .52, 3, "Directional cuts", "The Z and R share one descending diagonal."],
    [.36, .52, 3, "Deliberate contrast", "Broad stems against fine bars keep the interior light."],
    [.6, .52, 3, "Optical correction", "The rounded forms dip below the baseline to look even."]] },
  "heritage-loop": { img: "img/hl-phones.jpg", pts: [
    [.5, .5, 1, "Three core screens", "Discover, trace and verify: the Heritage Loop app."],
    [.2, .5, 2.6, "Home Feed", "Traceable garments, each with a heritage score and a scan action."],
    [.52, .5, 2.6, "Digital Twin", "Each print linked to the palace element it was drawn from."],
    [.84, .5, 2.6, "Sustainability", "The Environmental Ancestry Score, broken into measures."]] },
  "editorial-mockups": { img: "img/ed-group.jpg", pts: [
    [.5, .5, 1, "The line-up", "Several repeats styled together as a runway collection."],
    [.62, .42, 2.5, "Ball gown", "A tonal oxblood repeat on a full ball gown."],
    [.36, .8, 2.4, "Draped print", "The pattern following folds and light across draped silk."],
    [.44, .24, 3, "Crest print", "The doorway crest printed on a fitted column dress."]] },
};
