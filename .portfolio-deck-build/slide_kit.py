#!/usr/bin/env python3
"""Shared toolkit for the Parsons portfolio case-study slides.

Parsons MPS Communication Design requires JPEG at 1920x1080, no PDFs, and captions
in the portal's description field rather than burned into the image. Slides are
composed with ReportLab and rasterised with PyMuPDF so the output is exact.

All y values passed to these helpers are measured from the TOP of the slide.
"""
import io
import os

import pymupdf
from PIL import Image, ImageDraw
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, ".portfolio-deck-build")
FONTS = os.path.join(BUILD, "fonts")

W, H = 1920.0, 1080.0
M = 104.0                      # page margin
CW = W - 2 * M                 # content width

# --- Earthy Regal, the house palette these decks are built on ---
TEAL = HexColor("#008080")
BURG = HexColor("#800020")
GOLD = HexColor("#D4AF37")
LINEN = HexColor("#F5F5DC")
INK = HexColor("#1b1a18")
BODY = HexColor("#3b3834")
MUTED = HexColor("#7a746b")
CARD = HexColor("#FFFFFF")
RULE = HexColor("#ded8c8")
WHITE = HexColor("#FFFFFF")

SERIF, SERIF_M, SERIF_I = "Cormorant", "Cormorant-Medium", "Cormorant-Italic"
SANS_L, SANS, SANS_M = "Jost-Light", "Jost", "Jost-Medium"


def register():
    for name, f in [
        (SERIF, "CormorantGaramond-Regular.ttf"), (SERIF_M, "CormorantGaramond-Medium.ttf"),
        (SERIF_I, "CormorantGaramond-Italic.ttf"), (SANS_L, "Jost-Light.ttf"),
        (SANS, "Jost-Regular.ttf"), (SANS_M, "Jost-Medium.ttf"),
    ]:
        pdfmetrics.registerFont(TTFont(name, os.path.join(FONTS, f)))


def y(v):
    return H - v


def text(c, x, top, s, font, size, color, space=0, right=False, center=False):
    """Draw one line. Letter-spacing only exists on text objects, so always use one."""
    base = y(top + pdfmetrics.getAscent(font, size))
    w = pdfmetrics.stringWidth(s, font, size) + space * max(0, len(s) - 1)
    if right:
        x -= w
    elif center:
        x -= w / 2
    t = c.beginText(x, base)
    t.setFont(font, size)
    t.setFillColor(color)
    t.setCharSpace(space)  # Tc persists across text objects, so always set it explicitly
    t.textOut(s)
    c.drawText(t)


def wrap(s, font, size, width, space=0):
    out, cur = [], ""
    for word in s.split():
        t = f"{cur} {word}".strip()
        if pdfmetrics.stringWidth(t, font, size) + space * len(t) <= width or not cur:
            cur = t
        else:
            out.append(cur)
            cur = word
    if cur:
        out.append(cur)
    return out


def para(c, x, top, s, font, size, color, width, lead=None, space=0, maxlines=99):
    lead = lead or size * 1.5
    lines = wrap(s, font, size, width, space)[:maxlines]
    for i, ln in enumerate(lines):
        text(c, x, top + i * lead, ln, font, size, color, space)
    return top + len(lines) * lead


def eyebrow(c, x, top, s, color=MUTED, size=13):
    text(c, x, top, s.upper(), SANS_M, size, color, space=2.6)


def rect(c, x, top, w, h, fill=None, stroke=None, r=0, lw=1):
    if fill:
        c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(lw)
    mode = (1 if fill else 0, 1 if stroke else 0)
    if r:
        c.roundRect(x, y(top + h), w, h, r, stroke=mode[1], fill=mode[0])
    else:
        c.rect(x, y(top + h), w, h, stroke=mode[1], fill=mode[0])


def arrow(c, x0, top, x1, color=GOLD, lw=1.4, head=8.0):
    """Horizontal arrow drawn as vectors — Jost has no U+2192 glyph."""
    c.setStrokeColor(color)
    c.setLineWidth(lw)
    c.line(x0, y(top), x1 - head, y(top))
    c.setFillColor(color)
    p = c.beginPath()
    p.moveTo(x1, y(top))
    p.lineTo(x1 - head, y(top) - head * 0.52)
    p.lineTo(x1 - head, y(top) + head * 0.52)
    p.close()
    c.drawPath(p, stroke=0, fill=1)


def line(c, x0, top, x1, color=RULE, lw=1):
    c.setStrokeColor(color)
    c.setLineWidth(lw)
    c.line(x0, y(top), x1, y(top))


def callout(c, x0, top, x1, top1, color=MUTED, lw=1.0):
    """Thin leader line from an annotation to the thing it labels."""
    c.setStrokeColor(color)
    c.setLineWidth(lw)
    c.line(x0, y(top), x1, y(top1))
    c.setFillColor(color)
    c.circle(x1, y(top1), 3, stroke=0, fill=1)


_cache = {}


def img(c, path, x, top, w, h, r=0, focus=0.5, bg=(245, 245, 220)):
    """Draw an image cover-cropped into the box (optionally rounded)."""
    full = path if os.path.isabs(path) else os.path.join(ROOT, path)
    key = (full, round(w), round(h), r, focus, bg)
    if key not in _cache:
        im = Image.open(full)
        im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
        if im.mode == "RGBA":
            flat = Image.new("RGB", im.size, (255, 255, 255))
            flat.paste(im, mask=im.split()[-1])
            im = flat
        tw, th = int(w * 2), int(h * 2)
        sc = max(tw / im.width, th / im.height)
        im = im.resize((max(1, int(im.width * sc)), max(1, int(im.height * sc))), Image.LANCZOS)
        left = (im.width - tw) // 2
        top_c = int((im.height - th) * focus)
        im = im.crop((left, top_c, left + tw, top_c + th))
        if r:
            mask = Image.new("L", (tw, th), 0)
            ImageDraw.Draw(mask).rounded_rectangle([0, 0, tw - 1, th - 1], radius=int(r * 2), fill=255)
            flat = Image.new("RGB", (tw, th), bg)
            flat.paste(im, mask=mask)
            im = flat
        _cache[key] = ImageReader(im)
    c.drawImage(_cache[key], x, y(top + h), w, h, mask=None)


def img_fit(c, path, x, top, w, h):
    """Draw an image scaled to FIT the box (nothing cropped), centred."""
    im = Image.open(os.path.join(ROOT, path))
    im = im.convert("RGB") if im.mode != "RGBA" else im
    sc = min(w / im.width, h / im.height)
    nw, nh = im.width * sc, im.height * sc
    c.drawImage(ImageReader(im), x + (w - nw) / 2, y(top + h) + (h - nh) / 2, nw, nh, mask="auto")
    return nw, nh


def icon(c, path, x, top, w, h):
    """Draw a transparent PNG icon, preserving alpha and aspect."""
    im = Image.open(os.path.join(ROOT, path)).convert("RGBA")
    sc = min(w / im.width, h / im.height)
    nw, nh = im.width * sc, im.height * sc
    c.drawImage(ImageReader(im), x + (w - nw) / 2, y(top + h) + (h - nh) / 2, nw, nh, mask="auto")


def chrome(c, n, title, kicker, label="Heritage Loop  ·  UX / UI concept", total=6,
           bg=LINEN, ink=INK, muted=MUTED, rule=RULE):
    """Shared slide frame: background, header, footer."""
    rect(c, 0, 0, W, H, fill=bg)
    eyebrow(c, M, 62, label, muted)
    text(c, W - M, 58, f"{n:02d} / {total:02d}", SANS_L, 15, muted, space=2.2, right=True)
    line(c, M, 100, W - M, rule)
    text(c, M, 128, title, SERIF_M, 52, ink)
    if kicker:
        para(c, M, 196, kicker, SANS_L, 19, muted, CW * 0.62, lead=27)
    line(c, M, H - 74, W - M, rule)
    text(c, M, H - 58, "Mir Zuhair", SANS_M, 14, muted, space=1.6)
    text(c, W - M, H - 58, "mirzuhair.com", SANS_L, 14, muted, space=1.6, right=True)


def render(slides, out_dir, prefix):
    """slides: [(fn, name)] -> one 1920x1080 JPEG per slide."""
    os.makedirs(out_dir, exist_ok=True)
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(W, H))
    for fn, _ in slides:
        fn(c)
        c.showPage()
    c.save()

    doc = pymupdf.open(stream=buf.getvalue(), filetype="pdf")
    paths = []
    for i, (_, name) in enumerate(slides):
        pix = doc.load_page(i).get_pixmap(matrix=pymupdf.Matrix(1, 1))
        im = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
        assert im.size == (1920, 1080), im.size
        path = os.path.join(out_dir, f"{prefix}-{name}.jpg")
        im.save(path, quality=92, subsampling=0)
        print("wrote", path, im.size)
        paths.append(path)
    return paths
