#!/usr/bin/env python3
"""mirzuhair.com, as a four-slide product case study for the Parsons portal.

Layout primitives live in slide_kit so all three decks stay consistent.
Every figure on these slides is measured from the repository, not estimated.
"""
import os

from reportlab.lib.colors import HexColor

from slide_kit import (
    W, H, M, CW, BUILD,
    LINEN, INK, BODY, MUTED, CARD, RULE,
    SERIF_M, SANS_L, SANS, SANS_M,
    register, y, text, para, eyebrow, rect, arrow, line, img, chrome, render,
)

OUT = os.path.join(BUILD, "site-slides")
LABEL = "mirzuhair.com  ·  Portfolio platform"
TOTAL = 4

# the site's own tokens, read from styles.css
TEAL = HexColor("#0f5e5c")
OX = HexColor("#6b1e2b")
GOLD = HexColor("#b8923a")
SLINEN = HexColor("#f3ede1")
SBG = HexColor("#fbfaf7")


def stat(c, x, top, value, label, w):
    text(c, x, top, value, SERIF_M, 46, INK)
    para(c, x, top + 62, label, SANS_L, 15, MUTED, w, lead=21)


def slide01(c):
    chrome(c, 1, "One site, three practices", None, LABEL, TOTAL)

    top = 206
    para(c, M, top, "I design, build and maintain mirzuhair.com myself. The brief was to make textile "
         "research, communication design and interface work read as one practice rather than three "
         "portfolios stapled together.", SANS_L, 19, MUTED, CW * 0.62, lead=27)

    # --- IA ---
    top = 320
    eyebrow(c, M, top, "Information architecture")
    pbw = 300.0
    pbx = M + (CW - pbw) / 2
    rect(c, pbx, top + 34, pbw, 58, fill=INK, r=4)
    text(c, pbx + pbw / 2, top + 51, "mirzuhair.com", SANS_M, 19, SLINEN, center=True)

    cols = [("Work", "#/", "13 projects, newest first"),
            ("Research", "#/research", "The method behind the prints"),
            ("About", "#/about", "The practice and the haveli"),
            ("CV", "#/cv", "Page and PDF from one source"),
            ("Contact", "#/contact", "Form, posted to the host")]
    colw = (CW - 4 * 26) / 5
    bus = top + 118
    kids = top + 156
    centres = [M + i * (colw + 26) + colw / 2 for i in range(5)]
    c.setStrokeColor(RULE)
    c.setLineWidth(1.2)
    c.line(pbx + pbw / 2, y(top + 92), pbx + pbw / 2, y(bus))
    c.line(centres[0], y(bus), centres[-1], y(bus))
    for cx in centres:
        c.line(cx, y(bus), cx, y(kids))
    for i, (h, route, note) in enumerate(cols):
        cx0 = M + i * (colw + 26)
        rect(c, cx0, kids, colw, 50, fill=TEAL if i == 0 else CARD, r=4,
             stroke=None if i == 0 else RULE)
        text(c, cx0 + colw / 2, kids + 16, h, SANS_M, 17, SLINEN if i == 0 else INK, center=True)
        text(c, cx0 + colw / 2, kids + 66, route, SANS_L, 14, GOLD, center=True)
        para(c, cx0 + 8, kids + 92, note, SANS_L, 14, MUTED, colw - 16, lead=20)

    # one level deeper
    deep_top = kids + 156
    c.setStrokeColor(RULE)
    c.setLineWidth(1.2)
    c.line(centres[0], y(kids + 50), centres[0], y(deep_top))
    rect(c, M, deep_top, colw, 46, fill=CARD, r=4, stroke=RULE)
    text(c, M + colw / 2, deep_top + 14, "#/work/<slug>", SANS_L, 15, INK, center=True)
    para(c, M + colw + 26, deep_top + 6, "Every project is one route and one data entry — adding a "
         "case study means adding an object, never a new page.", SANS_L, 16, BODY, CW * 0.42, lead=24)

    # --- stats ---
    top = 866
    line(c, M, top, W - M)
    stats = [("13", "case studies"), ("261", "images placed and captioned"),
             ("5", "top-level routes"), ("0", "frameworks or page builders")]
    mw = CW / 4
    for i, (v, l) in enumerate(stats):
        stat(c, M + i * mw, top + 26, v, l, mw - 40)


def wire(c, x, top, w, h, kind):
    """Mini wireframe of a block type."""
    rect(c, x, top, w, h, fill=CARD, r=3, stroke=RULE)
    p = 9.0
    ix, iy, iw, ih = x + p, top + p, w - 2 * p, h - 2 * p
    f = HexColor("#ddd6c6")
    if kind == "full":
        rect(c, ix, iy, iw, ih, fill=f, r=2)
    elif kind == "pair":
        rect(c, ix, iy, iw / 2 - 4, ih, fill=f, r=2)
        rect(c, ix + iw / 2 + 4, iy, iw / 2 - 4, ih, fill=f, r=2)
    elif kind == "trio":
        for k in range(3):
            rect(c, ix + k * (iw / 3), iy, iw / 3 - 6, ih, fill=f, r=2)
    elif kind == "grid":
        for r_ in range(2):
            for k in range(4):
                rect(c, ix + k * (iw / 4), iy + r_ * (ih / 2), iw / 4 - 5, ih / 2 - 5, fill=f, r=2)
    elif kind == "step":
        text(c, ix, iy + 2, "01", SERIF_M, 19, GOLD)
        rect(c, ix + 34, iy + 6, iw - 34, 7, fill=HexColor("#cfc7b6"), r=3)
        rect(c, ix + 34, iy + 22, iw - 60, 5, fill=f, r=2)
        rect(c, ix + 34, iy + 34, iw - 40, 5, fill=f, r=2)
    elif kind == "text":
        rect(c, ix, iy + 2, iw * 0.5, 8, fill=HexColor("#cfc7b6"), r=3)
        for k in range(3):
            rect(c, ix, iy + 20 + k * 12, iw - (0 if k < 2 else 40), 5, fill=f, r=2)
    elif kind == "related":
        rect(c, ix, iy + 2, iw * 0.7, 6, fill=f, r=2)
        for k in range(3):
            rect(c, ix, iy + 18 + k * 13, iw * (0.5 - k * 0.08), 6, fill=HexColor("#cfc7b6"), r=3)
    elif kind == "linkout":
        rect(c, ix, iy + 6, iw * 0.6, 6, fill=f, r=2)
        rect(c, ix, iy + 24, iw * 0.42, 16, fill=HexColor("#cfc7b6"), r=8)


def slide02(c):
    chrome(c, 2, "Case studies are data, not pages", None, LABEL, TOTAL)

    top = 206
    para(c, M, top, "Content lives in one file. Eight block types compose every project, so layout "
         "decisions are made once and reused rather than re-designed per page.",
         SANS_L, 19, MUTED, CW * 0.62, lead=27)

    top = 300
    eyebrow(c, M, top, "The block taxonomy, with how often each is used")
    blocks = [("full", 33), ("pair", 34), ("trio", 8), ("grid", 20),
              ("step", 48), ("text", 6), ("related", 3), ("linkout", 1)]
    bw = (CW - 7 * 20) / 8
    for i, (kind, count) in enumerate(blocks):
        bx = M + i * (bw + 20)
        wire(c, bx, top + 36, bw, 150, kind)
        text(c, bx, top + 204, kind, SANS_M, 17, INK)
        text(c, bx, top + 230, f"{count}×", SANS_L, 15, GOLD)

    # --- tokens ---
    top = 600
    line(c, M, top, W - M)
    eyebrow(c, M, top + 30, "Design tokens, defined once in :root")

    sw = 118.0
    for i, (hexv, nm) in enumerate([("#6b1e2b", "oxblood"), ("#0f5e5c", "teal"), ("#b8923a", "gold"),
                                    ("#f3ede1", "linen"), ("#fbfaf7", "bg"), ("#1b1a18", "ink")]):
        sx = M + i * (sw + 14)
        rect(c, sx, top + 66, sw, 72, fill=HexColor(hexv), r=4,
             stroke=RULE if hexv in ("#f3ede1", "#fbfaf7") else None)
        text(c, sx, top + 150, nm, SANS_M, 15, INK)
        text(c, sx, top + 172, hexv, SANS_L, 13, MUTED, space=1.1)

    x2 = M + 6 * (sw + 14) + 40
    text(c, x2, top + 60, "Cormorant Garamond", SERIF_M, 40, INK)
    text(c, x2, top + 118, "Jost, for everything that is data", SANS_L, 22, INK)
    para(c, x2, top + 158, "Two families, no third. Serif carries the writing, sans carries dates, "
         "captions and navigation.", SANS_L, 15, MUTED, 460, lead=22)

    x3 = x2 + 520
    rect(c, x3, top + 52, CW - (x3 - M), 132, fill=CARD, r=4)
    text(c, x3 + 30, top + 78, "--gutter: clamp(16px, 3vw, 40px)", SANS, 18, OX, space=0.7)
    para(c, x3 + 30, top + 114, "One fluid value sets every page margin, so the layout breathes with the "
         "viewport instead of stepping between fixed widths.", SANS_L, 15, BODY,
         CW - (x3 - M) - 60, lead=22)

    line(c, M, 906, W - M)
    text(c, M, 934, "Thirteen case studies, one template. Adding a project means adding an object \u2014 "
         "never building a page.", SANS_L, 21, INK)


def slide03(c):
    chrome(c, 3, "Motion that carries meaning", None, LABEL, TOTAL)

    top = 206
    para(c, M, top, "The home page opens with a scroll-driven sequence: three lithographs of Hyderabad "
         "resolve into the objects of the haveli, then into the work made from them.",
         SANS_L, 19, MUTED, CW * 0.62, lead=27)

    top = 300
    eyebrow(c, M, top, "Scroll sequence, home page")
    frames = [("img/litho-gate.jpg", "00", "The city gate"),
              ("img/litho-tower.jpg", "01", "The old city"),
              ("img/hx/h-coat-red.jpg", "02", "Objects of the court"),
              ("img/hx/h-daggers.jpg", "03", "The collection"),
              ("img/tt-hero.jpg", "04", "The work it became")]
    gap = 34.0
    fw = (CW - 4 * gap) / 5
    fh = 290.0
    for i, (src, n, cap) in enumerate(frames):
        fx = M + i * (fw + gap)
        img(c, src, fx, top + 36, fw, fh, r=4, focus=0.4)
        text(c, fx, top + fh + 58, n, SERIF_M, 22, GOLD)
        text(c, fx + 32, top + fh + 64, cap, SANS, 16, INK)
        if i < 4:
            arrow(c, fx + fw + 8, top + 36 + fh / 2, fx + fw + gap - 8)

    top = 714
    line(c, M, top, W - M)
    eyebrow(c, M, top + 30, "Four rules the motion follows")
    rules = [("Scroll is the timeline", "Nothing autoplays. Every transition is tied to scroll position, so the reader sets the pace."),
             ("Motion explains a lineage", "Each sequence moves from source to outcome — city, object, drawing, cloth — never decoration for its own sake."),
             ("Reveal, never obstruct", "Sections fade in once and stay. No parallax that fights the text, no scroll-jacking."),
             ("Reduced motion is honoured", "Nine separate prefers-reduced-motion rules switch the sequences to plain, static layouts.")]
    rw = (CW - 3 * 30) / 4
    for i, (h, p) in enumerate(rules):
        rx = M + i * (rw + 30)
        end = para(c, rx, top + 68, h, SANS_M, 18, INK, rw, lead=26)
        para(c, rx, end + 12, p, SANS_L, 15, MUTED, rw, lead=23)


def slide04(c):
    chrome(c, 4, "Built, shipped and maintained", None, LABEL, TOTAL)

    top = 206
    para(c, M, top, "No framework, no page builder, no CMS. Hand-written HTML, CSS and JavaScript, "
         "deployed as static files on a custom domain.", SANS_L, 19, MUTED, CW * 0.62, lead=27)

    # --- responsive diagram ---
    top = 300
    eyebrow(c, M, top, "One layout system, five breakpoints")
    sizes = [("Desktop", 420.0, 214.0, 4), ("Laptop 900", 300.0, 214.0, 3),
             ("Tablet 700", 200.0, 214.0, 2), ("Phone 600", 132.0, 214.0, 1)]
    sx = M
    for nm, bwid, bh, cols_n in sizes:
        rect(c, sx, top + 40, bwid, bh, fill=CARD, r=6, stroke=RULE)
        rect(c, sx, top + 40, bwid, 24, fill=SLINEN, r=6)
        rect(c, sx, top + 56, bwid, 8, fill=SLINEN)
        for k in range(3):
            c.setFillColor(HexColor("#cfc7b6"))
            c.circle(sx + 14 + k * 11, y(top + 52), 3.4, stroke=0, fill=1)
        gcols = cols_n
        pad = 14.0
        gw = (bwid - 2 * pad - (gcols - 1) * 8) / gcols
        for r_ in range(2):
            for k in range(gcols):
                rect(c, sx + pad + k * (gw + 8), top + 80 + r_ * 84, gw, 74,
                     fill=HexColor("#e4ddcd"), r=3)
        text(c, sx, top + 276, nm, SANS_M, 16, INK)
        sx += bwid + 36

    # --- build facts ---
    fx = sx + 10
    eyebrow(c, fx, top, "How it is put together")
    facts = [("Vanilla JS, hash routing", "A single router swaps views on #/ without a server or a build step."),
             ("data.js is the CMS", "All copy, captions and image order live in one editable file."),
             ("Static hosting, own domain", "Committed to Git and served as static files at mirzuhair.com."),
             ("Lazy images, versioned assets", "Images load on demand; CSS and JS carry cache-busting stamps.")]
    for i, (h, p) in enumerate(facts):
        fy = top + 40 + i * 74
        text(c, fx, fy, h, SANS_M, 18, INK)
        para(c, fx, fy + 26, p, SANS_L, 15, MUTED, W - M - fx, lead=21)

    # --- stats ---
    top = 716
    line(c, M, top, W - M)
    eyebrow(c, M, top + 30, "Written by hand")
    stats = [("216 KB", "of hand-written JS, CSS and content"),
             ("9", "prefers-reduced-motion rules"),
             ("21", "ARIA attributes across the interface"),
             ("13 → 1", "case studies rendered by one template")]
    mw = CW / 4
    for i, (v, l) in enumerate(stats):
        stat(c, M + i * mw, top + 70, v, l, mw - 40)


SLIDES = [(slide01, "01-brief-ia"), (slide02, "02-system"),
          (slide03, "03-motion"), (slide04, "04-build")]


def main():
    register()
    render(SLIDES, OUT, "mirzuhair-com")


if __name__ == "__main__":
    main()
