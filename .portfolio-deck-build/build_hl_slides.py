#!/usr/bin/env python3
"""Heritage Loop, as a six-slide UX case study for the Parsons portal.

Layout primitives live in slide_kit so the Cafe and site decks stay consistent.
"""
import os

from reportlab.lib.colors import HexColor

from slide_kit import (
    W, H, M, CW, ROOT, BUILD,
    TEAL, BURG, GOLD, LINEN, INK, BODY, MUTED, CARD, RULE, WHITE,
    SERIF, SERIF_M, SERIF_I, SANS_L, SANS, SANS_M,
    register, y, text, wrap, para, eyebrow, rect, arrow, line, img, icon, chrome, render,
)

OUT = os.path.join(BUILD, "hl-slides")


# ------------------------------- slides -------------------------------
def slide01(c):
    chrome(c, 1, "The question behind the product",
           "Heritage Loop is a platform concept that gives a garment two records: its environmental "
           "ancestry and its architectural lineage.")

    top = 280
    rect(c, M, top, CW, 168, fill=BURG, r=4)
    text(c, M + 48, top + 40, "“What if a garment could tell you where it came from —", SERIF_I, 38, HexColor("#F5F5DC"))
    text(c, M + 48, top + 92, "not only the factory, but the building, the object and the family behind its print?”",
         SERIF_I, 38, HexColor("#F5F5DC"))

    top = 500
    eyebrow(c, M, top, "Two gaps the platform closes")
    gw = (CW - 40) / 2
    gaps = [
        ("img/hl-ic-lantern.png", "Environmental ancestry",
         "Sustainability claims in fashion are vague and hard to verify. Buyers are asked to trust a label, not shown the data."),
        ("img/hl-ic-arch.png", "Cultural lineage",
         "The story behind a heritage print — the building, the object, the craft — ends at the swing tag and is lost once the garment leaves the shop."),
    ]
    for i, (ic, h, p) in enumerate(gaps):
        gx = M + i * (gw + 40)
        rect(c, gx, top + 34, gw, 210, fill=CARD, r=4)
        icon(c, ic, gx + 40, top + 72, 58, 58)
        text(c, gx + 122, top + 82, h, SERIF_M, 30, INK)
        para(c, gx + 122, top + 130, p, SANS_L, 17, BODY, gw - 170, lead=26)

    top = 800
    line(c, M, top, W - M)
    meta = [("Role", "Concept, UX and UI design"), ("Scope", "Personas, core screens, design system"),
            ("Built on", "Threads of Time textile thesis"), ("Status", "Concept — not yet user-tested")]
    mw = CW / 4
    for i, (k, v) in enumerate(meta):
        mx = M + i * mw
        eyebrow(c, mx, top + 30, k, MUTED, 12)
        para(c, mx, top + 58, v, SANS, 18, INK, mw - 40, lead=26)


def slide02(c):
    chrome(c, 2, "Who it is for, and how they move through it",
           "Two personas drawn from the people who already buy heritage and sustainable fashion, "
           "and the four-step path that serves them.")

    top = 286
    eyebrow(c, M, top, "Target users")
    pw = (CW - 40) / 2
    personas = [
        ("The Ethical Curator", "28  ·  Creative consultant  ·  London / New York",
         "Sees fashion as investment and activism. Tired of greenwashing and wants hard data presented with a high-end aesthetic.",
         "Needs  —  Sustainability dashboard + Environmental Ancestry Score", TEAL),
        ("The Modern Historian", "35  ·  Academic and designer",
         "Passionate about decolonial fashion and South Asian heritage. Not buying a shirt but a piece of Sindhi history, and wants to see where it came from.",
         "Needs  —  Digital Twin + cultural continuity", BURG),
    ]
    for i, (h, who, p, need, col) in enumerate(personas):
        px = M + i * (pw + 40)
        rect(c, px, top + 34, pw, 262, fill=CARD, r=4)
        rect(c, px, top + 34, 5, 262, fill=col)
        text(c, px + 44, top + 68, h, SERIF_M, 34, INK)
        text(c, px + 44, top + 116, who, SANS_L, 15, MUTED, space=1.2)
        para(c, px + 44, top + 152, p, SANS_L, 17, BODY, pw - 88, lead=26)
        rect(c, px + 44, top + 232, pw - 88, 44, fill=HexColor("#F5F1E4"), r=3)
        text(c, px + 66, top + 246, need, SANS_M, 15, col, space=0.6)

    top = 640
    eyebrow(c, M, top, "How the three screens connect")
    steps = [("Discover", "Home Feed", "Browse traceable pieces, each with a heritage score."),
             ("Scan", "Mandala button", "Scan the garment's tag, or tap the mandala on any product."),
             ("Trace", "Digital Twin", "See the palace element the print was drawn from, and each step between."),
             ("Verify", "Sustainability", "Read the Environmental Ancestry Score, broken into measures.")]
    sw = (CW - 3 * 28) / 4
    for i, (s, w_, d) in enumerate(steps):
        sx = M + i * (sw + 28)
        rect(c, sx, top + 38, sw, 210, fill=CARD, r=4)
        text(c, sx + 32, top + 68, f"0{i+1}", SERIF_M, 40, GOLD)
        text(c, sx + 32, top + 128, s, SERIF_M, 28, INK)
        text(c, sx + 32, top + 166, w_, SANS_M, 14, TEAL, space=1.4)
        para(c, sx + 32, top + 192, d, SANS_L, 15, MUTED, sw - 64, lead=22, maxlines=3)
        if i < 3:
            arrow(c, sx + sw + 6, top + 140, sx + sw + 22)


def slide03(c):
    chrome(c, 3, "Information architecture and the core flow",
           "Three sections, one repeating loop: discover a piece, scan it, trace it, verify it, and come "
           "back out into the feed.")

    # --- IA tree, centred and spanning the full content width ---
    top = 282
    eyebrow(c, M, top, "Information architecture")
    pbw = 340.0
    pbx = M + (CW - pbw) / 2
    rect(c, pbx, top + 34, pbw, 62, fill=INK, r=4)
    text(c, pbx + pbw / 2, top + 53, "Heritage Loop", SANS_M, 20, LINEN, center=True)

    cols = [("Home Feed", ["Traceable pieces", "Heritage score", "Filters: origin, maker", "Saved items"], TEAL, LINEN),
            ("Digital Twin", ["Architectural lineage", "Five-step making chain", "Cultural continuity", "Source object"], BURG, LINEN),
            ("Sustainability", ["Ancestry Score", "Material origin", "Water · transport", "Maker wages"], GOLD, INK)]
    colw = (CW - 2 * 48) / 3
    bus = top + 128                      # horizontal bus line
    kids = top + 170                     # top of the child boxes
    centres = [M + i * (colw + 48) + colw / 2 for i in range(3)]
    c.setStrokeColor(RULE)
    c.setLineWidth(1.2)
    c.line(pbx + pbw / 2, y(top + 96), pbx + pbw / 2, y(bus))
    c.line(centres[0], y(bus), centres[-1], y(bus))
    for cx in centres:
        c.line(cx, y(bus), cx, y(kids))

    for i, (h, items, col, fg) in enumerate(cols):
        cx0 = M + i * (colw + 48)
        rect(c, cx0, kids, colw, 52, fill=col, r=4)
        text(c, cx0 + colw / 2, kids + 17, h, SANS_M, 17, fg, center=True)
        for j, it in enumerate(items):
            text(c, cx0 + 6, kids + 84 + j * 32, "·   " + it, SANS_L, 16, BODY)

    # --- flow ---
    top = 708
    line(c, M, top - 44, W - M)
    eyebrow(c, M, top, "Core user flow")
    flow = ["Open app", "Home Feed", "Tap mandala\n/ scan tag", "Product", "Digital Twin",
            "Sustainability", "Full report"]
    gap = 34.0
    fw = (CW - (len(flow) - 1) * gap) / len(flow)
    for i, f in enumerate(flow):
        fx = M + i * (fw + gap)
        is_decision = "scan" in f
        rect(c, fx, top + 40, fw, 96, fill=GOLD if is_decision else CARD, r=4,
             stroke=None if is_decision else RULE)
        lines = f.split("\n")
        for j, ln in enumerate(lines):
            text(c, fx + fw / 2, top + (70 if len(lines) == 1 else 58) + j * 24, ln, SANS, 17, INK, center=True)
        if i < len(flow) - 1:
            arrow(c, fx + fw + 8, top + 88, fx + fw + gap - 8, MUTED)

    # loop back to the feed
    last_cx = M + (len(flow) - 1) * (fw + gap) + fw / 2
    first_cx = M + fw / 2
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.4)
    c.setDash(5, 5)
    ybot = y(top + 180)
    c.line(last_cx, y(top + 136), last_cx, ybot)
    c.line(last_cx, ybot, first_cx, ybot)
    c.line(first_cx, ybot, first_cx, y(top + 146))
    c.setDash()
    c.setFillColor(GOLD)                               # upward head into the first step
    p = c.beginPath()
    p.moveTo(first_cx, y(top + 138))
    p.lineTo(first_cx - 4.5, y(top + 147))
    p.lineTo(first_cx + 4.5, y(top + 147))
    p.close()
    c.drawPath(p, stroke=0, fill=1)
    text(c, M + CW / 2, top + 192, "returns to the feed with the piece saved and traced",
         SANS_L, 14, GOLD, center=True)


def slide04(c):
    chrome(c, 4, "The Digital Twin: palace to garment",
           "The heart of the concept. Every print traces back through the real stages of its making — "
           "photographed, drawn, digitised, repeated, worn.")

    top = 300
    eyebrow(c, M, top, "Deer crest  —  one of four traceable prints")

    steps = [("img/dd-door.jpg", "01", "Palace doorway"), ("img/sk-dd-6.jpg", "02", "Pencil sketch"),
             ("img/cr-drawing.jpg", "03", "Digital line work"), ("img/cr-jq-red.jpg", "04", "Repeat"),
             ("img/hl-deer-look.jpg", "05", "On the body")]
    n = len(steps)
    gap = 42.0
    iw = (CW - (n - 1) * gap) / n
    ih = 340.0
    for i, (src, num, cap) in enumerate(steps):
        ix = M + i * (iw + gap)
        img(c, src, ix, top + 38, iw, ih, r=4, focus=0.42)
        text(c, ix, top + ih + 60, num, SERIF_M, 24, GOLD)
        text(c, ix + 34, top + ih + 66, cap, SANS, 17, INK)
        if i < n - 1:
            arrow(c, ix + iw + 10, top + 38 + ih / 2, ix + iw + gap - 10)

    top = 800
    line(c, M, top, W - M)
    eyebrow(c, M, top + 30, "Three more chains behind the same tab bar")
    tabs = [("img/hl-ic-deer.png", "Deer crest"), ("img/hl-mandala.png", "Painted ceiling"),
            ("img/hl-ic-arch.png", "The corridor"), ("img/hl-ic-lantern.png", "Glass lantern")]
    tw = CW / 4
    for i, (ic, nm) in enumerate(tabs):
        tx = M + i * tw
        active = i == 0
        # the icons are fine gold line art, so the selected tab is marked with a gold
        # rule and label rather than a dark fill the artwork would disappear into
        rect(c, tx, top + 62, tw - 24, 70, fill=CARD, r=4, stroke=None if active else RULE)
        if active:
            rect(c, tx, top + 128, tw - 24, 4, fill=GOLD)
        icon(c, ic, tx + 22, top + 78, 38, 38)
        text(c, tx + 76, top + 86, nm, SANS_M if active else SANS, 17, INK if active else BODY)


def phone(c, x, top, w, h, title, draw_body):
    """A phone frame with a dark status bar; draw_body fills the screen area."""
    rect(c, x, top, w, h, fill=HexColor("#111110"), r=26)
    sx, sy_, sw, sh = x + 10, top + 10, w - 20, h - 20
    rect(c, sx, sy_, sw, sh, fill=HexColor("#FBF8EF"), r=18)
    rect(c, sx, sy_, sw, 52, fill=HexColor("#0f3b3b"), r=18)
    rect(c, sx, sy_ + 30, sw, 22, fill=HexColor("#0f3b3b"))
    text(c, sx + 20, sy_ + 18, title, SANS_M, 15, HexColor("#F5F5DC"))
    c.setFillColor(GOLD)
    c.circle(sx + sw - 26, y(sy_ + 26), 7, stroke=0, fill=1)
    draw_body(sx, sy_ + 52, sw, sh - 52)


def slide05(c):
    chrome(c, 5, "Core screens",
           "Concept screens. Scores and prices are illustrative placeholder data.")

    pw, ph = 380.0, 560.0
    gap = (CW - 3 * pw) / 2
    top = 276

    def feed(sx, sy_, sw, sh):
        items = [("img/tt-look.jpg", "Talpur Silk Slip", "£485", "94"),
                 ("img/cc-pattern.jpg", "Ceiling Print Jacket", "£395", "88"),
                 ("img/dd-pattern.jpg", "Metal Corset", "£685", "82"),
                 ("img/co-bronze.jpg", "Corridor Print Skirt", "£520", "79")]
        iy = sy_ + 14
        for k, (src, t, p, score) in enumerate(items):
            img(c, src, sx + 16, iy, 96, 96, r=6, focus=0.35)
            text(c, sx + 128, iy + 6, t, SANS_M, 16, INK)
            text(c, sx + 128, iy + 30, f"Hyderabad, Sindh  ·  {p}", SANS_L, 13, MUTED)
            rect(c, sx + 128, iy + 54, 52, 24, fill=HexColor("#EFEADB"), r=12)
            text(c, sx + 154, iy + 60, score, SANS_M, 13, TEAL, center=True)
            rect(c, sx + 190, iy + 54, 60, 24, fill=TEAL, r=12)
            text(c, sx + 220, iy + 60, "Scan", SANS_M, 13, HexColor("#FFFFFF"), center=True)
            iy += 116
            if k < len(items) - 1:
                line(c, sx + 16, iy - 10, sx + sw - 16, HexColor("#E8E1D0"))

    def twin(sx, sy_, sw, sh):
        img(c, "img/dd-pattern.jpg", sx + 16, sy_ + 16, sw - 32, 190, r=6)
        img(c, "img/dd-door.jpg", sx + sw - 118, sy_ + 128, 88, 88, r=6)
        eyebrow(c, sx + 16, sy_ + 228, "Architectural lineage", MUTED, 11)
        para(c, sx + 16, sy_ + 252, "Deer crest, from the arched doorway of the Talpur Haveli",
             SERIF_M, 21, INK, sw - 32, lead=27)
        eyebrow(c, sx + 16, sy_ + 320, "Cultural continuity", MUTED, 11)
        para(c, sx + 16, sy_ + 344, "Motif drawn by hand, digitised and printed on silk.",
             SANS_L, 14, BODY, sw - 32, lead=21)
        rect(c, sx + 16, sy_ + 412, sw - 32, 46, fill=BURG, r=23)
        text(c, sx + sw / 2, sy_ + 426, "View the source", SANS_M, 15, HexColor("#F5F5DC"), center=True)

    def sustain(sx, sy_, sw, sh):
        rect(c, sx + 16, sy_ + 16, sw - 32, 124, fill=TEAL, r=6)
        eyebrow(c, sx + 36, sy_ + 40, "Environmental Ancestry Score", HexColor("#CFE1DE"), 10)
        text(c, sx + 36, sy_ + 60, "82", SANS_M, 52, HexColor("#F5F5DC"))
        my = sy_ + 174
        for label, v in [("Material origin", 88), ("Water use", 64), ("Transport", 72), ("Maker wages", 91)]:
            text(c, sx + 16, my, label, SANS, 14, INK)
            text(c, sx + sw - 16, my, str(v), SANS_M, 14, TEAL, right=True)
            rect(c, sx + 16, my + 26, sw - 32, 8, fill=HexColor("#E8E1D0"), r=4)
            rect(c, sx + 16, my + 26, (sw - 32) * v / 100, 8, fill=GOLD, r=4)
            my += 62
        rect(c, sx + 16, my + 8, sw - 32, 46, fill=INK, r=23)
        text(c, sx + sw / 2, my + 22, "Full report", SANS_M, 15, LINEN, center=True)

    specs = [(feed, "Heritage Loop", "Home Feed",
              "A modular grid of traceable garments, each carrying a heritage score and a scan action."),
             (twin, "Digital Twin", "Digital Twin",
              "Each print links back to the exact architectural element it was drawn from."),
             (sustain, "Sustainability", "Sustainability",
              "The Environmental Ancestry Score, broken into verifiable measures.")]
    for i, (fn, bar, name, desc) in enumerate(specs):
        px = M + i * (pw + gap)
        phone(c, px, top, pw, ph, bar, fn)
        text(c, px, top + ph + 40, name, SERIF_M, 30, INK)
        para(c, px, top + ph + 84, desc, SANS_L, 16, MUTED, pw, lead=24)


def slide06(c):
    chrome(c, 6, "Earthy Regal: the design system",
           "One system ties the product back to the collection — palette, type, and interface "
           "elements drawn from the palace itself.")

    top = 300
    eyebrow(c, M, top, "Palette")
    sw_ = 200.0
    for i, (hexv, nm, use) in enumerate([("#008080", "Deep Teal", "Primary actions"),
                                         ("#800020", "Burgundy", "Heritage focus"),
                                         ("#D4AF37", "Gold", "Premium elements"),
                                         ("#F5F5DC", "Raw Linen", "Background")]):
        sx = M + i * (sw_ + 22)
        rect(c, sx, top + 34, sw_, 118, fill=HexColor(hexv), r=4,
             stroke=RULE if hexv == "#F5F5DC" else None)
        text(c, sx, top + 170, nm, SANS_M, 17, INK)
        text(c, sx, top + 196, hexv, SANS_L, 14, MUTED, space=1.2)
        text(c, sx, top + 220, use, SANS_L, 14, MUTED)

    x2 = M + 4 * (sw_ + 22) + 40
    eyebrow(c, x2, top, "Type")
    text(c, x2, top + 30, "Heritage Loop", SERIF_M, 62, INK)
    text(c, x2, top + 112, "High-contrast serif  —  headings", SANS_L, 15, MUTED)
    text(c, x2, top + 152, "Environmental Ancestry Score", SANS_L, 28, INK)
    text(c, x2, top + 198, "Minimal sans-serif  —  body and data", SANS_L, 15, MUTED)

    top = 596
    line(c, M, top, W - M)
    eyebrow(c, M, top + 30, "Interface elements drawn from the palace")

    cw3 = (CW - 2 * 40) / 3
    # 1. mandala scan button
    rect(c, M, top + 66, cw3, 300, fill=INK, r=4)
    icon(c, "img/hl-mandala.png", M + cw3 / 2 - 52, top + 96, 104, 104)
    text(c, M + cw3 / 2, top + 212, "Scan", SANS_M, 15, GOLD, center=True, space=2)
    text(c, M + 32, top + 254, "Scan button as palace mandala", SANS_M, 18, LINEN)
    para(c, M + 32, top + 286, "The primary action is the painted ceiling's central medallion, "
         "redrawn in gold line. It rotates while scanning.", SANS_L, 14, HexColor("#b9b2a4"), cw3 - 64, lead=21)

    # 2. data icons
    x = M + cw3 + 40
    rect(c, x, top + 66, cw3, 300, fill=CARD, r=4)
    for i, (n_, k) in enumerate([("deer", "Origin"), ("lantern", "Energy"), ("arch", "Craft"), ("eagle", "Provenance")]):
        ix = x + 32 + i * ((cw3 - 64) / 4)
        icon(c, f"img/hl-ic-{n_}.png", ix, top + 104, 52, 52)
        text(c, ix + 26, top + 168, k, SANS_L, 13, MUTED, center=True)

    text(c, x + 32, top + 254, "Data icons from Talpur motifs", SANS_M, 18, INK)
    para(c, x + 32, top + 286, "Each sustainability measure takes its icon from a palace object, "
         "drawn first in the sketchbook.", SANS_L, 14, BODY, cw3 - 64, lead=21)

    # 3. sketch archive background
    x = M + 2 * (cw3 + 40)
    rect(c, x, top + 66, cw3, 300, fill=CARD, r=4)
    for i, n_ in enumerate(["sk-co-1", "sk-ce-4", "sk-dd-9", "sk-ln-4"]):
        ix = x + 32 + i * ((cw3 - 64) / 4)
        img(c, f"img/{n_}.jpg", ix, top + 100, (cw3 - 64) / 4 - 12, 118, r=3)
    text(c, x + 32, top + 254, "Backgrounds from the sketch archive", SANS_M, 18, INK)
    para(c, x + 32, top + 286, "Deconstruction sketches from the Threads of Time archive sit behind "
         "content at low opacity, so the archive is always present.", SANS_L, 14, BODY, cw3 - 64, lead=21)


SLIDES = [
    (slide01, "01-problem"), (slide02, "02-users-journey"), (slide03, "03-ia-flow"),
    (slide04, "04-digital-twin"), (slide05, "05-core-screens"), (slide06, "06-design-system"),
]


def main():
    register()
    render(SLIDES, OUT, "heritage-loop")


if __name__ == "__main__":
    main()
