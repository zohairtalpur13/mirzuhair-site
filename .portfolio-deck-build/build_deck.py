#!/usr/bin/env python3
"""Build a portfolio slide deck PDF from the mirzuhair-site project data."""
import os
from PIL import Image
from reportlab.lib.colors import Color, white
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

ROOT = "/Users/zuhairtalpur/Documents/mirzuhair-site"
BUILD = os.path.join(ROOT, ".portfolio-deck-build")
FONTS = os.path.join(BUILD, "fonts")
OUT_PDF = os.path.join(BUILD, "Mir Zuhair - Portfolio.pdf")
CROP_CACHE = os.path.join(BUILD, "crops")
os.makedirs(CROP_CACHE, exist_ok=True)

pdfmetrics.registerFont(TTFont("Cormorant-Medium", os.path.join(FONTS, "CormorantGaramond-Medium.ttf")))
pdfmetrics.registerFont(TTFont("Cormorant-Regular", os.path.join(FONTS, "CormorantGaramond-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Cormorant-Italic", os.path.join(FONTS, "CormorantGaramond-Italic.ttf")))
pdfmetrics.registerFont(TTFont("Jost-Light", os.path.join(FONTS, "Jost-Light.ttf")))
pdfmetrics.registerFont(TTFont("Jost-Regular", os.path.join(FONTS, "Jost-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Jost-Medium", os.path.join(FONTS, "Jost-Medium.ttf")))

PAGE_W, PAGE_H = 960, 540

OXBLOOD = Color(0x6b/255, 0x1e/255, 0x2b/255)
GOLD = Color(0xc9/255, 0xa4/255, 0x5c/255)
INK_BLACK = Color(0x0c/255, 0x0a/255, 0x08/255)
LINEN = Color(0xf3/255, 0xed/255, 0xe1/255)
MUTED = Color(0xcf/255, 0xc7/255, 0xb7/255)

PROJECTS = [
    dict(cover="img/tt-hero.jpg", pos=("center", 0.28), title="Threads of Time",
         subtitle="A Fusion Between Past and Future", date="Textile Thesis, 2025",
         tags="Digital print on silk · Brass-sheet sculpture · Installation",
         desc="A textile thesis: a single look that wears a building. From primary research at the Talpur Haveli in Hyderabad, Sindh, the painted ceiling became a draped silk cape and the corridor of arches and lanterns became a mermaid skirt, closed with a hand-cut brass corset of blooming roses."),
    dict(cover="mir-campaign/assets/stationery.png", pos=("center", 0.5), title="MIR, What Remains.",
         subtitle="A Speculative Fragrance & Communication Campaign", date="Self-Initiated, Communication Design, 2025",
         tags="Identity · Packaging · Typography · Motion · Interaction",
         desc="A speculative fragrance brand built by reusing the doorway and painted-ceiling drawings from Threads of Time, extended into stationery, packaging, three typographic posters, a twelve-second motion study and an interactive postcard maker."),
    dict(cover="img/dd-pattern.jpg", pos=("center", 0.5), title="The Deer & the Doorway",
         subtitle="Compositions 02 & 03", date="Pattern Design, 2025",
         tags="Pencil sketch · Digital illustration · Repeat pattern",
         desc="Mounted stag trophies above the haveli's arched teak doors, redrawn as a symmetrical crest of doors flanked by stags. Developed across colourways and production separations for jacquard weave and screen print."),
    dict(cover="img/ce-final-teal.jpg", pos=("center", 0.5), title="The Painted Ceiling",
         subtitle="Composition 04", date="Pattern Design, 2025",
         tags="Geometric ornament · Colourway development",
         desc="Drawn from painted ceilings: star medallions, radiating petals and dense floral infill. Sketched by hand, redrawn as a flat cut-paper motif, and printed in rose-gold for the Threads of Time silk cape."),
    dict(cover="img/pt-pattern.jpg", pos=("center", 0.3), title="Portrait of an Ancestor",
         subtitle="Composition 05", date="Illustration & Pattern, 2025",
         tags="Archival research · Line illustration · Repeat",
         desc="The haveli holds painted portraits of Talpur ancestors. This composition frames a figure in the same carved foliate ornament as the furniture around it, putting family history back into circulation as something worn, not kept behind glass."),
    dict(cover="img/co-c2.jpg", pos=("center", 0.4), title="Corridors & Chandeliers",
         subtitle="Compositions 01 & 06", date="Pattern Design, 2025",
         tags="Spatial research · Toile · Placement print",
         desc="Drawn from the haveli's light: the long beamed corridor with its lanterns and carved chairs, mirrored into a toile, and a ceremonial chandelier placement print flanked by peacocks and vases."),
    dict(cover="img/gr-dark.jpg", pos=("center", 0.5), title="The Ivory Table",
         subtitle="Composition 07", date="Pattern Design, 2025",
         tags="Object study · Line illustration · Colourways",
         desc="Drawn from a single object: a carved ivory table with an eagle, faces and acanthus scrolls on its pedestal. Translated from sculptural light and shadow into flat ornament without losing its carved richness."),
    dict(cover="img/ln-pattern.jpg", pos=("center", 0.5), title="Lanterns of the Haveli",
         subtitle="From object to repeat", date="Pattern Design, 2025",
         tags="Observational drawing · Colour · Repeat",
         desc="A pattern study built from the hand-painted, jewelled glass lanterns that hang through the haveli's corridors, linked by chains of dots into a dense, nocturnal diagonal repeat in emerald and amber on black."),
    dict(cover="img/gk-key-pattern.jpg", pos=("center", 0.5), title="Greek Architecture & Ornament",
         subtitle="Three prints", date="Pattern Design",
         tags="Classical ornament · Photoshop · Pattern mapping",
         desc="Testing the same method built for the haveli on a second architectural tradition: Colonnade, Greek Key and Hummingbird, three prints built from individually illustrated motifs and mapped onto editorial photography."),
    dict(cover="img/qs-01.jpg", layout="contain", title="Quiet Structure",
         subtitle="A personal typographic identity", date="Identity & Typography, 2026",
         tags="Lettering · Wordmark · Identity system",
         desc="A self-initiated identity for my own name: a custom seven-glyph wordmark, a compact MZ monogram and a small visual system, refined letter by letter so it can sit confidently beside the work without competing with it."),
    dict(cover="img/mc-st-crosswalk.jpg", pos=("center", 0.4), title="Mir's Café",
         subtitle="Brand identity & campaign", date="Brand & Campaign, 2026",
         tags="Identity · Packaging · Out-of-home · App · Social",
         desc="A self-initiated identity and launch campaign for a chai house in Hyderabad, Sindh, built from my own palace drawings: the lantern, corridor, painted ceiling, chandelier and deer crest, carried across packaging, the street and a phone screen."),
    dict(cover="img/hl-phones.jpg", pos=("center", 0.22), zoom=2.3, title="Heritage Loop",
         subtitle="Digital platform concept", date="UX / Service Concept, 2025",
         tags="Personas · UI · Design system",
         desc="A concept for a digital platform linking fashion transparency with cultural heritage: every garment carries two records, its environmental ancestry and its architectural lineage from the Talpur era, verifiable with one scan."),
    dict(cover="img/ed-vogue-adele.jpg", layout="contain", title="Pattern in Editorial",
         subtitle="Speculative applications", date="Art Direction, 2025",
         tags="Moodboard · Photoshop · Pattern mapping",
         desc="Speculative mockups that test the Threads of Time patterns in contemporary fashion media: what these ancestral motifs look like on a magazine cover, a red carpet or a runway."),
]


def crop_cover(src_path, out_path, target_w, target_h, focus=("center", 0.5), gradient_frac=0.0, zoom=1.0):
    img = Image.open(src_path).convert("RGB")
    sw, sh = img.size
    target_ratio = target_w / target_h
    win_h = sh / zoom
    win_w = win_h * target_ratio
    if win_w > sw / zoom:
        win_w = sw / zoom
        win_h = win_w / target_ratio
    fx, fy = focus
    cx = sw * (0.5 if fx == "center" else fx)
    cy = sh * fy
    left = max(0, min(sw - win_w, cx - win_w / 2))
    top = max(0, min(sh - win_h, cy - win_h / 2))
    box = (int(left), int(top), int(left + win_w), int(top + win_h))
    img = img.crop(box).resize((target_w, target_h), Image.LANCZOS)

    if gradient_frac > 0:
        band_start = int(target_h * (1 - gradient_frac))
        top_strip = int(target_h * 0.06)
        column = Image.new("L", (1, target_h), 0)
        cpx = column.load()
        for y in range(target_h):
            if y < top_strip:
                a = int(90 * (1 - y / top_strip))
            elif y >= band_start:
                t = (y - band_start) / max(1, (target_h - band_start))
                a = int(40 + 195 * (t ** 1.4))
            else:
                a = 40
            cpx[0, y] = a
        overlay = column.resize((target_w, target_h), Image.NEAREST)
        black = Image.new("RGB", (target_w, target_h), (7, 6, 5))
        img = Image.composite(black, img, overlay)

    img.save(out_path, quality=92)
    return out_path


def wrap_text(c, text, font, size, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if pdfmetrics.stringWidth(test, font, size) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def cover_slide(c):
    c.setFillColor(INK_BLACK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.75)
    c.line(80, PAGE_H - 190, 240, PAGE_H - 190)
    c.setFillColor(GOLD)
    c.setFont("Jost-Regular", 12)
    c.drawString(80, PAGE_H - 170, "PORTFOLIO  ·  SELECTED WORK")
    c.setFillColor(LINEN)
    c.setFont("Cormorant-Medium", 64)
    c.drawString(78, PAGE_H - 260, "Mir Zuhair")
    c.setFont("Cormorant-Italic", 24)
    c.setFillColor(MUTED)
    c.drawString(80, PAGE_H - 300, "Textile & Communication Designer")
    c.setFont("Jost-Light", 13)
    c.setFillColor(MUTED)
    c.drawString(80, 70, "Hyderabad, Sindh")
    c.drawRightString(PAGE_W - 80, 70, "mirzuhair.com")
    c.showPage()


def closing_slide(c):
    c.setFillColor(INK_BLACK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(LINEN)
    c.setFont("Cormorant-Medium", 40)
    c.drawCentredString(PAGE_W / 2, PAGE_H / 2 + 30, "Thank you")
    c.setFont("Jost-Light", 14)
    c.setFillColor(MUTED)
    c.drawCentredString(PAGE_W / 2, PAGE_H / 2 - 10, "mirzuhair.com   ·   zohairtalpur13@gmail.com")
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.75)
    c.line(PAGE_W / 2 - 60, PAGE_H / 2 + 5, PAGE_W / 2 + 60, PAGE_H / 2 + 5)
    c.showPage()


def project_slide_contain(c, p, index, total):
    src = os.path.join(ROOT, p["cover"])
    img = Image.open(src).convert("RGB")
    sw, sh = img.size

    c.setFillColor(INK_BLACK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    panel_h = 210
    img_zone_h = PAGE_H - panel_h
    box_w, box_h = PAGE_W - 160, img_zone_h - 60
    scale = min(box_w / sw, box_h / sh)
    dw, dh = sw * scale, sh * scale
    dx = (PAGE_W - dw) / 2
    dy = panel_h + (img_zone_h - dh) / 2 - 10
    c.setFillColor(Color(0x16 / 255, 0x17 / 255, 0x13 / 255))
    c.rect(dx - 14, dy - 14, dw + 28, dh + 28, fill=1, stroke=0)
    c.drawImage(ImageReader(src), dx, dy, dw, dh)

    c.setFillColor(INK_BLACK)
    c.rect(0, 0, PAGE_W, panel_h, fill=1, stroke=0)

    c.setFillColor(GOLD)
    c.setFont("Jost-Regular", 10.5)
    c.drawString(64, 14, f"{index:02d} / {total}")
    c.setFillColor(MUTED)
    c.drawRightString(PAGE_W - 64, 14, "MIR ZUHAIR \u00b7 PORTFOLIO")

    text_x = 64
    y = panel_h - 44
    c.setFillColor(GOLD)
    c.setFont("Jost-Medium", 11.5)
    c.drawString(text_x, y, p["date"].upper())
    y -= 30
    c.setFillColor(LINEN)
    c.setFont("Cormorant-Medium", 26)
    c.drawString(text_x, y, f"{p['title']}   ·   {p['subtitle']}")

    style = ParagraphStyle("desc2", fontName="Jost-Light", fontSize=12, leading=17, textColor=MUTED)
    para = Paragraph(p["desc"], style)
    max_w = PAGE_W - text_x - 300
    w, h = para.wrap(max_w, 80)
    para.drawOn(c, text_x, 42)

    c.setFillColor(MUTED)
    c.setFont("Jost-Light", 10.5)
    c.drawRightString(PAGE_W - 64, y + 4, p["tags"])
    c.showPage()


def project_slide(c, p, index, total):
    if p.get("layout") == "contain":
        return project_slide_contain(c, p, index, total)
    src = os.path.join(ROOT, p["cover"])
    out = os.path.join(CROP_CACHE, f"slide-{index:02d}.jpg")
    crop_cover(src, out, PAGE_W * 2, PAGE_H * 2, focus=p["pos"], gradient_frac=300 / PAGE_H, zoom=p.get("zoom", 1.0))
    c.drawImage(ImageReader(out), 0, 0, PAGE_W, PAGE_H)

    c.setFillColor(GOLD)
    c.setFont("Jost-Regular", 10.5)
    c.drawString(64, 14, f"{index:02d} / {total}")
    c.setFillColor(MUTED)
    c.drawRightString(PAGE_W - 64, 14, "MIR ZUHAIR \u00b7 PORTFOLIO")

    text_x = 64
    y = 235
    c.setFillColor(GOLD)
    c.setFont("Jost-Medium", 11.5)
    c.drawString(text_x, y, p["date"].upper())
    y -= 44
    c.setFillColor(LINEN)
    c.setFont("Cormorant-Medium", 38)
    c.drawString(text_x, y, p["title"])
    y -= 30
    c.setFillColor(MUTED)
    c.setFont("Cormorant-Italic", 18)
    c.drawString(text_x, y, p["subtitle"])
    y -= 34

    style = ParagraphStyle(
        "desc", fontName="Jost-Light", fontSize=12.5, leading=18,
        textColor=LINEN,
    )
    para = Paragraph(p["desc"], style)
    max_w = PAGE_W - text_x - 340
    w, h = para.wrap(max_w, 100)
    para.drawOn(c, text_x, y - h)
    y = y - h - 14

    c.setFillColor(MUTED)
    c.setFont("Jost-Light", 10.5)
    c.drawString(text_x, y, p["tags"])

    c.showPage()


def build():
    c = canvas.Canvas(OUT_PDF, pagesize=(PAGE_W, PAGE_H))
    c.setTitle("Mir Zuhair - Portfolio")
    c.setAuthor("Mir Zuhair")
    cover_slide(c)
    total = len(PROJECTS)
    for i, p in enumerate(PROJECTS, start=1):
        project_slide(c, p, i, total)
    closing_slide(c)
    c.save()
    print("Wrote", OUT_PDF)


if __name__ == "__main__":
    build()
