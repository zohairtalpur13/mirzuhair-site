#!/usr/bin/env python3
"""The six craft slides: Quiet Structure, MIR What Remains, Threads of Time.

These carry the visual-design evidence Parsons asks for — typography, composition,
hierarchy and scale, colour, and sequencing — alongside the three UX case studies.
Layout primitives live in slide_kit.
"""
import os

from reportlab.lib.colors import HexColor

from slide_kit import (
    W, H, M, CW, BUILD,
    GOLD, LINEN, INK, BODY, MUTED, CARD, RULE,
    SERIF_M, SERIF_I, SANS_L, SANS, SANS_M,
    register, y, text, para, eyebrow, rect, arrow, line, img, img_fit, chrome, render,
)

OUT = os.path.join(BUILD, "craft-slides")
RASTER = os.path.join(BUILD, "portal-slides", "_raster")

QS = "Quiet Structure  ·  Typographic identity"
MIR = "MIR, What Remains.  ·  Campaign & typography"
TT = "Threads of Time  ·  Pattern system"

MOSS = HexColor("#6b7a63")
CLAY = HexColor("#a4694f")
VERM = HexColor("#c8452f")
OX = HexColor("#6b1e2b")


def caption(c, x, top, n, title, desc, w):
    text(c, x, top, n, SERIF_M, 22, GOLD)
    text(c, x + 34, top + 6, title, SANS_M, 17, INK)
    if desc:
        para(c, x, top + 40, desc, SANS_L, 15, MUTED, w, lead=22, maxlines=3)


# ------------------------------ Quiet Structure ------------------------------
def qs_letterforms(c):
    chrome(c, 1, "Building seven letters", None, QS, 2)

    top = 206
    para(c, M, top, "A designer's name has to be recognisable as a signature and quiet enough that the "
         "work stays the focus. Off-the-shelf faces were either too plain or too decorative, so I drew it.",
         SANS_L, 19, MUTED, CW * 0.62, lead=27)

    top = 300
    eyebrow(c, M, top, "From written exploration to constructed capitals")
    items = [("img/qs-03.jpg", "01", "Written many ways", "Lowercase and capitals, spaced and tight, heavy and light, stacked and horizontal."),
             ("img/qs-06.jpg", "02", "Three directions", "A neutral sans, a literary serif, and a constructed set of custom capitals."),
             ("img/qs-05.jpg", "03", "Rough to vector", "Simplify the contour, control the rhythm, separate the levels."),
             ("img/qs-07.jpg", "04", "On the grid", "Cap height, midline and baseline, with the U dipped below for optical correction.")]
    gap = 30.0
    iw = (CW - 3 * gap) / 4
    ih = 330.0
    for i, (src, n, t, d) in enumerate(items):
        ix = M + i * (iw + gap)
        # these are wide process boards: fit them so their left edge is never cropped off
        rect(c, ix, top + 36, iw, ih, fill=CARD, r=4)
        img_fit(c, src, ix + 6, top + 42, iw - 12, ih - 12)
        caption(c, ix, top + ih + 60, n, t, d, iw)
        if i < 3:
            arrow(c, ix + iw + 8, top + 36 + ih / 2, ix + iw + gap - 8)

    top = 828
    line(c, M, top, W - M)
    notes = [("Strong verticals", "Broad stems set the order of the name."),
             ("Fine bars", "Thin horizontals keep it from reading as heavy."),
             ("One shared diagonal", "The Z and the R cut at the same angle, giving the name movement."),
             ("48 px to poster", "The same construction has to survive both ends of the scale.")]
    nw = CW / 4
    for i, (h, p) in enumerate(notes):
        nx = M + i * nw
        text(c, nx, top + 30, h, SANS_M, 17, INK)
        para(c, nx, top + 58, p, SANS_L, 15, MUTED, nw - 40, lead=22)


def qs_system(c):
    chrome(c, 2, "One name, three scales", None, QS, 2)

    top = 206
    para(c, M, top, "Three lockups for three scales, a four-colour palette and two supporting "
         "typefaces — enough system to sit beside the work without competing with it.",
         SANS_L, 19, MUTED, CW * 0.62, lead=27)

    top = 300
    eyebrow(c, M, top, "The system in use")
    gap = 32.0
    iw = (CW - 2 * gap) / 3
    ih = 300.0
    row = [("img/qs-08.jpg", "01", "Lockups", "Stacked, compact MZ monogram and horizontal — one name at three scales."),
           ("img/qs-09.jpg", "02", "Colour and supporting type", "Four colours and two supporting faces, set as an editorial system."),
           ("img/qs-10.jpg", "03", "Stationery", "Letterhead and a two-sided card, carrying the compact monogram.")]
    for i, (src, n, t, d) in enumerate(row):
        ix = M + i * (iw + gap)
        img(c, src, ix, top + 36, iw, ih, r=4, focus=0.45)
        caption(c, ix, top + ih + 60, n, t, d, iw)

    top = 780
    line(c, M, top, W - M)
    eyebrow(c, M, top + 30, "Palette")
    sw_ = 148.0
    # values taken from the guidelines artwork itself, so the swatches agree with image 02
    for i, (hexv, nm) in enumerate([("#202A28", "Ink"), ("#F3EFE6", "Paper"),
                                    ("#67705B", "Moss"), ("#AE553C", "Clay")]):
        sxx = M + i * (sw_ + 20)
        rect(c, sxx, top + 66, sw_, 76, fill=HexColor(hexv), r=4,
             stroke=RULE if hexv == "#F3EFE6" else None)
        text(c, sxx, top + 154, nm, SANS_M, 16, INK)
        text(c, sxx, top + 176, hexv, SANS_L, 13, MUTED, space=1.1)

    x2 = M + 4 * (sw_ + 20) + 44
    eyebrow(c, x2, top + 30, "The rule that keeps it quiet")
    para(c, x2, top + 66, "Use the full name first; reserve the MZ monogram for small sizes. Keep clear "
         "space of at least half a cap height on every side, and never set the lettering below 48 px "
         "stacked — the fine bars close up before that.", SANS_L, 18, BODY, CW - (x2 - M), lead=27)


# ------------------------------ MIR, What Remains ------------------------------
def mir_posters(c):
    chrome(c, 1, "One idea, read three ways", None, MIR, 2)

    top = 206
    para(c, M, top, "A fragrance has no visible form. Three posters each test a different way to make "
         "a trace legible — not three styles, one idea read three times.",
         SANS_L, 19, MUTED, CW * 0.62, lead=27)

    top = 292
    posters = [(os.path.join(RASTER, "poster-pressure.png"), "01", "Pressure", "A single oversized M turned into a typographic object in relief."),
               (os.path.join(RASTER, "poster-transfer.png"), "02", "Transfer", "An offset second impression: the mark the first one left behind."),
               (os.path.join(RASTER, "poster-absence.png"), "03", "Absence", "The missing letter is the point; the gap carries the meaning.")]
    gap = 46.0
    pw = (CW - 2 * gap) / 3
    phh = 466.0
    for i, (src, n, t, d) in enumerate(posters):
        px = M + i * (pw + gap)
        rect(c, px, top + 30, pw, phh, fill=CARD, r=4)
        img_fit(c, src, px + 16, top + 46, pw - 32, phh - 32)
        caption(c, px, top + phh + 58, n, t, d, pw)

    top = 912
    line(c, M, top, W - M)
    text(c, M, top + 26, "“What remains.”", SERIF_I, 30, OX)
    para(c, M + 260, top + 34, "One line, short enough for a business card and open enough to carry across "
         "paper, motion and interaction.", SANS_L, 17, MUTED, CW - 300, lead=24)


def mir_identity(c):
    chrome(c, 2, "An identity made from the archive", None, MIR, 2)

    top = 206
    para(c, M, top, "Nothing new was invented for the brand. The wordmark stays deliberately quiet so "
         "the drawings from the thesis can carry the detail.", SANS_L, 19, MUTED, CW * 0.62, lead=27)

    top = 292
    eyebrow(c, M, top, "Wordmark, and the drawing it defers to")
    hw = (CW - 36) / 2
    rect(c, M, top + 32, hw, 260, fill=CARD, r=4)
    img_fit(c, os.path.join(RASTER, "mir-wordmark.png"), M + 60, top + 76, hw - 120, 172)
    caption(c, M, top + 312, "01", "Three letters, kept quiet on purpose", None, hw)

    img(c, "mir-campaign/assets/dd-door.jpg", M + hw + 36, top + 32, hw, 260, r=4, focus=0.45)
    caption(c, M + hw + 36, top + 312, "02", "Its source: the haveli's carved doorway",
            "The same drawing that became the Threads of Time repeat.", hw)

    top = 690
    line(c, M, top, W - M)
    eyebrow(c, M, top + 30, "The same drawing, moved across media")
    aw = (CW - 36) / 2
    img(c, "mir-campaign/assets/stationery.png", M, top + 66, aw, 186, r=4, focus=0.5)
    caption(c, M, top + 272, "03", "Paper — card, scent strip and embossed envelope", None, aw)
    img(c, "mir-campaign/assets/packaging.png", M + aw + 36, top + 66, aw, 186, r=4, focus=0.5)
    caption(c, M + aw + 36, top + 272, "04", "Object — doorway repeat on an ivory carton", None, aw)


# ------------------------------ Threads of Time ------------------------------
def tt_method(c):
    chrome(c, 1, "One method, repeated seven times", None, TT, 2)

    top = 206
    para(c, M, top, "Every print in the thesis followed the same five steps, from a photograph of the "
         "Talpur Haveli to a production-ready repeat. This is the painted ceiling.",
         SANS_L, 19, MUTED, CW * 0.62, lead=27)

    top = 300
    eyebrow(c, M, top, "Photograph · drawing · line work · repeat · cloth")
    steps = [("img/tt-ceiling-detail.jpg", "01", "The ceiling", "Star medallions, gilt lines and dense floral infill."),
             ("img/sk-ce-1.jpg", "02", "Pencil study", "Drawn by hand before anything is digitised."),
             ("img/ce-drawing.jpg", "03", "Digital line work", "Cleaned to a single-weight contour."),
             ("img/ce-final-teal.jpg", "04", "Seamless repeat", "Built as a half-drop on the building's own rhythm."),
             ("img/tt-side.jpg", "05", "The silk cape", "Printed rose-gold on oxblood, cut to drape into a cowl.")]
    gap = 34.0
    iw = (CW - 4 * gap) / 5
    ih = 330.0
    for i, (src, n, t, d) in enumerate(steps):
        ix = M + i * (iw + gap)
        img(c, src, ix, top + 36, iw, ih, r=4, focus=0.45)
        caption(c, ix, top + ih + 60, n, t, d, iw)
        if i < 4:
            arrow(c, ix + iw + 8, top + 36 + ih / 2, ix + iw + gap - 8)

    top = 812
    line(c, M, top, W - M)
    eyebrow(c, M, top + 30, "Colourways, tested as a set rather than one at a time")
    cw_ = (CW - 8 * 14) / 9
    for i, n in enumerate(["ce-c1", "ce-c2", "ce-c3", "ce-c4", "ce-c5", "ce-c6", "ce-c7", "ce-c8", "ce-c9"]):
        img(c, f"img/{n}.jpg", M + i * (cw_ + 14), top + 66, cw_, 96, r=3)


def tt_look(c):
    chrome(c, 2, "A house you can wear", None, TT, 2)

    top = 206
    para(c, M, top, "The look reads top to bottom like a walk through the haveli: the ceiling at the "
         "shoulders, the corridor falling to the floor, and hand-cut brass where the lanterns would hang.",
         SANS_L, 19, MUTED, CW * 0.62, lead=27)

    top = 296
    hero_w = CW * 0.38
    hero_h = 600.0
    img(c, "img/tt-hero.jpg", M, top, hero_w, hero_h, r=4, focus=0.3)

    sx = M + hero_w + 36
    sw = CW - hero_w - 36
    sub_w = (sw - 2 * 24) / 3
    for i, (src, n, t) in enumerate([("img/tt-front.jpg", "01", "Front"),
                                     ("img/tt-side.jpg", "02", "Side"),
                                     ("img/tt-back.jpg", "03", "Back")]):
        ix = sx + i * (sub_w + 24)
        img(c, src, ix, top, sub_w, 360, r=4, focus=0.35)
        text(c, ix, top + 384, n, SERIF_M, 20, GOLD)
        text(c, ix + 30, top + 389, t, SANS_M, 16, INK)

    para(c, sx, top + 440, "The silk carries the imagery and moves with the wearer; the rigid brass brings "
         "the permanence of the building. The tension between them is the message.",
         SANS_L, 18, BODY, sw, lead=27)

    rect(c, sx, top + 528, sw, 72, fill=OX, r=4)
    text(c, sx + 32, top + 552, "Memory soft enough to wear, and strong enough to last.",
         SERIF_I, 26, HexColor("#F5F5DC"))

    top = 912
    line(c, M, top, W - M)
    meta = [("Role", "Research, textile and print design"), ("Made with", "Digital print on silk · brass sculpture"),
            ("Source", "Mir Hassan Ali Palace, 1843"), ("Shown as", "Installation, BFA thesis 2025")]
    mw = CW / 4
    for i, (k, v) in enumerate(meta):
        mx = M + i * mw
        eyebrow(c, mx, top + 26, k, MUTED, 12)
        para(c, mx, top + 52, v, SANS, 17, INK, mw - 40, lead=24)


SLIDES = [
    (qs_letterforms, "quiet-structure-01-letterforms"),
    (qs_system, "quiet-structure-02-system"),
    (mir_posters, "mir-what-remains-01-posters"),
    (mir_identity, "mir-what-remains-02-identity"),
    (tt_method, "threads-of-time-01-method"),
    (tt_look, "threads-of-time-02-look"),
]


def main():
    register()
    render(SLIDES, OUT, "craft")


if __name__ == "__main__":
    main()
