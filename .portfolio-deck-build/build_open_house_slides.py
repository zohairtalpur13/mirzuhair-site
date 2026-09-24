#!/usr/bin/env python3
"""Open House slides for the application portal.

1. Portal strips (portal-slides/): full-bleed contact sheets, images edge to edge, no text,
   the same convention as the MIR and Mir's Café uploads, built from the full-size renders.
2. Craft slides (craft-slides/): two 1920x1080 slides on the typeface and the system, drawn
   with slide_kit, rasterised at 2x and downsampled so type and edges stay crisp.
"""
import io
import os

import pymupdf
from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas

from slide_kit import (
    W, H, M, CW, BUILD, INK, MUTED, RULE,
    SERIF_M, SANS_L, SANS_M,
    register, text, para, eyebrow, rect, line, img, img_fit, chrome,
)

OH = "/Users/zuhairtalpur/Library/Application Support/Claude/scratch-workspaces/db94374a-e221-4ed0-828b-8fbf7b5109e1/ddae5a69-031f-4ae1-94df-cce95936f873/scratch-2026-09-24-e63eec/open-house"
FINAL, ART = os.path.join(OH, "final"), os.path.join(OH, "art")
PORTAL, CRAFT = os.path.join(BUILD, "portal-slides"), os.path.join(BUILD, "craft-slides")

GREEN, LIME, BRASS, KIRM, TEAK = (HexColor(h) for h in ("#134238", "#EFE6D6", "#D6A13C", "#7A1C2A", "#2A1A12"))
BG = (239, 230, 214)
LABEL = "Open House  ·  Identity & typeface"


# ------------------------------------------------------------------ portal strips
def flat(path):
    im = Image.open(path)
    if im.mode in ("RGBA", "LA"):
        base = Image.new("RGB", im.size, BG)
        base.paste(im, mask=im.split()[-1])
        return base
    return im.convert("RGB")


def column(paths, gap=60, pad=80, width=None):
    """Stack flat artwork (tickets) into one column on the plaster ground."""
    ims = [flat(p) for p in paths]
    w = width or max(i.width for i in ims)
    ims = [i.resize((w, round(i.height * w / i.width)), Image.LANCZOS) for i in ims]
    out = Image.new("RGB", (w + 2 * pad, sum(i.height for i in ims) + gap * (len(ims) - 1) + 2 * pad), BG)
    yy = pad
    for i in ims:
        out.paste(i, (pad, yy))
        yy += i.height + gap
    return out


def strip(items, name, h):
    ims = []
    for it in items:
        im = it if isinstance(it, Image.Image) else flat(it)
        ims.append(im.resize((round(im.width * h / im.height), h), Image.LANCZOS))
    out = Image.new("RGB", (sum(i.width for i in ims), h), BG)
    x = 0
    for i in ims:
        out.paste(i, (x, 0))
        x += i.width
    path = os.path.join(PORTAL, f"open-house-{name}.jpg")
    out.save(path, quality=95, subsampling=0, optimize=True)
    print("wrote", path, out.size, os.path.getsize(path) // 1024, "KB")


def portal():
    f = lambda n: os.path.join(FINAL, f"open-house-{n}.jpg")
    a = lambda n: os.path.join(ART, n)
    strip([f("poster"), a("poster.png"), f("tote")], "1-poster-tote", 2000)
    strip([f("tickets"), f("badges")], "2-tickets-badges", 1800)
    strip([a("construction.png"), a("specimen.png")], "3-typeface", 1800)
    tix = column([a("ticket-green.png"), a("ticket-lime.png"), a("ticket-kirmizi.png")])
    strip([tix, a("badge-guest.png"), a("badge-press.png"), a("badge-staff.png")], "4-print-artwork", 1800)


# ------------------------------------------------------------------ craft slides
def swatch(c, x, top, w, h, col, name, hexv, ink):
    rect(c, x, top, w, h, fill=col, r=4)
    text(c, x + 18, top + h - 58, name, SANS_M, 15, ink)
    text(c, x + 18, top + h - 34, hexv, SANS_L, 13, ink, space=1.2)


def slide_rules(c):
    chrome(c, 1, "Two rules from one building", None, LABEL, 2)
    para(c, M, 206, "I wanted the palace to live in the letters themselves, not behind them. From my photographs of the "
         "Talpur Haveli I found two rules: the jali gives the grid, the doorway gives the corner.",
         SANS_L, 19, MUTED, CW * 0.66, lead=27)
    top, ih, gap = 300, 470, 30
    iw = (CW - 2 * gap) / 3
    img(c, "img/obj-jali.jpg", M, top, iw, ih, r=4, focus=0.35)
    img(c, "img/dd-door.jpg", M + iw + gap, top, iw, ih, r=4, focus=0.3)
    rect(c, M + 2 * (iw + gap), top, iw, ih, fill=GREEN, r=4)
    img_fit(c, "img/oh-construction-h.jpg", M + 2 * (iw + gap) + 30, top + 30, iw - 60, ih - 60)
    caps = [("01", "The jali gives the grid", "Every letter sits on a 5 × 7 lattice. Each cell is its own tile, separated like the openings of a carved screen."),
            ("02", "The doorway gives the corner", "Where a tile ends a stroke, its corners are cut at 45°: the faceted arch of the teak doors."),
            ("03", "The rule makes the letter", "Joins stay square and ends become arches. Cut tiles in brass; 61 glyphs follow the same rule.")]
    for i, (n, t, d) in enumerate(caps):
        x = M + i * (iw + gap)
        text(c, x, top + ih + 28, n, SERIF_M, 22, BRASS)
        text(c, x + 34, top + ih + 34, t, SANS_M, 17, INK)
        para(c, x, top + ih + 68, d, SANS_L, 15, MUTED, iw - 10, lead=22, maxlines=3)
    line(c, M, 928, W - M, RULE)
    facts = [("5 × 7", "lattice per letter"), ("45°", "the doorway cut"), ("61", "glyphs, compiled to TTF"), ("2", "rules build every letter")]
    fw = CW / 4
    for i, (k, v) in enumerate(facts):
        text(c, M + i * fw, 948, k, SERIF_M, 26, INK)
        text(c, M + i * fw + (len(k) * 13 + 22), 958, v, SANS_L, 15, MUTED)


def slide_system(c):
    chrome(c, 2, "One typeface, one house", None, LABEL, 2)
    para(c, M, 206, "Jharoka carries every touchpoint of a speculative exhibition about the palace. The palette, "
         "Haveli at Dusk, is taken from the same rooms.", SANS_L, 19, MUTED, CW * 0.62, lead=27)
    top = 296
    ph = 600
    pw = ph * 0.8
    img(c, os.path.join(FINAL, "open-house-poster.jpg"), M, top, pw, ph, r=4, focus=0.45)
    x2 = M + pw + 40
    w2 = W - M - x2
    eyebrow(c, x2, top, "Haveli at Dusk")
    sw = (w2 - 4 * 14) / 5
    pal = [(GREEN, "Lantern green", "#134238", LIME), (LIME, "Lime plaster", "#EFE6D6", INK), (BRASS, "Saffron brass", "#D6A13C", INK),
           (KIRM, "Kirmizi red", "#7A1C2A", LIME), (TEAK, "Teak", "#2A1A12", LIME)]
    for i, (col, n, hx, ink) in enumerate(pal):
        swatch(c, x2 + i * (sw + 14), top + 30, sw, 150, col, n, hx, ink)
    eyebrow(c, x2, top + 212, "Tickets and badges")
    img(c, os.path.join(FINAL, "open-house-tickets.jpg"), x2, top + 242, (w2 - 20) / 2, 358, r=4, focus=0.5)
    img(c, os.path.join(FINAL, "open-house-badges.jpg"), x2 + (w2 - 20) / 2 + 20, top + 242, (w2 - 20) / 2, 358, r=4, focus=0.4)
    cap = [("Poster", "The name at full width; seven rooms rise in a stepped halftone like the palace stair."),
           ("Ticketing", "Three colourways, a vertical number in Jharoka and a barcode in the jali's rhythm."),
           ("Bilingual", "The Urdu name, Khula Ghar (Open House), set in brass beside the English.")]
    cw3 = (CW - 60) / 3
    for i, (t, d) in enumerate(cap):
        x = M + i * (cw3 + 30)
        text(c, x, 924, t, SANS_M, 17, INK)
        para(c, x, 954, d, SANS_L, 15, MUTED, cw3, lead=21, maxlines=2)


def render_2x(slides, out_dir, prefix):
    os.makedirs(out_dir, exist_ok=True)
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(W, H))
    for fn, _ in slides:
        fn(c)
        c.showPage()
    c.save()
    doc = pymupdf.open(stream=buf.getvalue(), filetype="pdf")
    for i, (_, name) in enumerate(slides):
        pix = doc.load_page(i).get_pixmap(matrix=pymupdf.Matrix(2, 2))
        im = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB").resize((1920, 1080), Image.LANCZOS)
        path = os.path.join(out_dir, f"{prefix}-{name}.jpg")
        im.save(path, quality=95, subsampling=0, optimize=True)
        print("wrote", path, im.size, os.path.getsize(path) // 1024, "KB")


if __name__ == "__main__":
    register()
    portal()
    render_2x([(slide_rules, "01-typeface"), (slide_system, "02-system")], CRAFT, "craft-open-house")
