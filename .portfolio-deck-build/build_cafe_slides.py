#!/usr/bin/env python3
"""Mir's Cafe app, as a four-slide UX case study for the Parsons portal.

Layout primitives live in slide_kit so the Heritage Loop and site decks stay consistent.
"""
import os

from reportlab.lib.colors import HexColor

from slide_kit import (
    W, H, M, CW, BUILD,
    GOLD, LINEN, INK, BODY, MUTED, CARD, RULE, WHITE,
    SERIF_M, SERIF_I, SANS_L, SANS, SANS_M,
    register, y, text, para, eyebrow, rect, arrow, line, img, img_fit, callout, chrome, render,
)

OUT = os.path.join(BUILD, "cafe-slides")
LABEL = "Mir's Café  ·  Ordering & loyalty app"
TOTAL = 4

# sampled from the screens themselves
OX = HexColor("#691f2c")       # Second Cup Club card, primary action
DEEP = HexColor("#2d0e0c")     # offer banner
PINK = HexColor("#e6b3b0")     # Kashmiri pink, rewards
CREAM = HexColor("#f6efe5")    # app background


def slide01(c):
    chrome(c, 1, "A chai house you can order from", None, LABEL, TOTAL)

    top = 206
    para(c, M, top, "Mir's Café is a self-initiated identity and launch campaign for a chai house in "
         "Hyderabad, Sindh. The app is the part of it people hold every day.", SANS_L, 19, MUTED, CW * 0.62, lead=27)

    top = 292
    gw = (CW - 40) / 2
    rect(c, M, top, gw, 200, fill=CARD, r=4)
    eyebrow(c, M + 40, top + 36, "The problem", MUTED, 12)
    para(c, M + 40, top + 70, "Cafés tend to look the same: minimal, beige and interchangeable. A brand "
         "rooted in Sindh risks the opposite — turning heritage into costume.",
         SANS_L, 18, BODY, gw - 80, lead=28)

    rect(c, M + gw + 40, top, gw, 200, fill=OX, r=4)
    eyebrow(c, M + gw + 80, top + 36, "The insight", HexColor("#e0b9b6"), 12)
    para(c, M + gw + 80, top + 68, "In Sindhi homes the second cup is when the real conversation starts. "
         "So the second cup is free, 4–7pm.", SERIF_I, 27, HexColor("#F7F0E6"), gw - 120, lead=38)

    top = 536
    eyebrow(c, M, top, "Three jobs the app has to do")
    jobs = [("Order ahead", "Pick a drink, set size and sweetness, pay, collect at the counter — without queueing."),
            ("Carry the Second Cup Club", "Ten stamps, the tenth cup free. The card has to be legible at a glance, not buried in a profile tab."),
            ("Surface the offer in its window", "The 4–7pm offer only matters between 4 and 7. Outside that window it should get out of the way.")]
    jw = (CW - 2 * 32) / 3
    for i, (h, p) in enumerate(jobs):
        jx = M + i * (jw + 32)
        rect(c, jx, top + 34, jw, 194, fill=CARD, r=4)
        text(c, jx + 34, top + 62, f"0{i+1}", SERIF_M, 34, PINK)
        text(c, jx + 34, top + 112, h, SERIF_M, 27, INK)
        para(c, jx + 34, top + 152, p, SANS_L, 16, BODY, jw - 68, lead=24)

    top = 800
    line(c, M, top, W - M)
    meta = [("Role", "Identity, UX and UI design"), ("Scope", "Ordering, loyalty, offer logic"),
            ("Context", "Hyderabad, Sindh · prices in PKR"), ("Status", "Concept — not yet user-tested")]
    mw = CW / 4
    for i, (k, v) in enumerate(meta):
        mx = M + i * mw
        eyebrow(c, mx, top + 30, k, MUTED, 12)
        para(c, mx, top + 58, v, SANS, 18, INK, mw - 40, lead=26)


def slide02(c):
    chrome(c, 2, "Ordering flow, and the loop that brings people back", None, LABEL, TOTAL)

    top = 206
    para(c, M, top, "One path to a drink, one rule that changes it, and a loyalty loop that closes back "
         "onto the home screen.", SANS_L, 19, MUTED, CW * 0.62, lead=27)

    # --- main flow ---
    top = 300
    eyebrow(c, M, top, "Order path")
    flow = ["Open app", "Home", "Menu /\nPoured today", "Drink", "Size &\nsweetness",
            "Add to order", "Pay", "Collect at\ncounter"]
    gap = 26.0
    fw = (CW - (len(flow) - 1) * gap) / len(flow)
    fy = top + 40
    for i, f in enumerate(flow):
        fx = M + i * (fw + gap)
        rect(c, fx, fy, fw, 92, fill=CARD, r=4, stroke=RULE)
        lines = f.split("\n")
        for j, ln in enumerate(lines):
            text(c, fx + fw / 2, fy + (32 if len(lines) == 1 else 20) + j * 24, ln, SANS, 16, INK, center=True)
        if i < len(flow) - 1:
            arrow(c, fx + fw + 6, fy + 46, fx + fw + gap - 6, MUTED)

    # --- the time rule ---
    top = 486
    eyebrow(c, M, top, "The one rule that changes the path")
    rw = CW * 0.46
    rect(c, M, top + 34, rw, 132, fill=PINK, r=4)
    text(c, M + 36, top + 62, "Is it 4–7pm, Monday to Thursday?", SANS_M, 21, INK)
    para(c, M + 36, top + 100, "If yes, the home banner and the drink page both say the second cup is free, "
         "and the counter adds it. If no, neither mentions it.", SANS_L, 16, HexColor("#5c3236"), rw - 72, lead=23)

    # --- loyalty loop ---
    lx = M + rw + 48
    lw = CW - rw - 48
    eyebrow(c, lx, top, "Loyalty loop")
    loop = ["Order a cup", "Stamp added", "10 stamps", "Tenth is free", "Back to Home"]
    lgap = 18.0
    lfw = (lw - (len(loop) - 1) * lgap) / len(loop)
    for i, f in enumerate(loop):
        fx = lx + i * (lfw + lgap)
        last = i == len(loop) - 1
        rect(c, fx, top + 34, lfw, 78, fill=OX if last else CARD, r=4, stroke=None if last else RULE)
        text(c, fx + lfw / 2, top + 62, f, SANS, 15, LINEN if last else INK, center=True)
        if i < len(loop) - 1:
            arrow(c, fx + lfw + 4, top + 73, fx + lfw + lgap - 4, MUTED)
    c.setStrokeColor(OX)
    c.setLineWidth(1.4)
    c.setDash(5, 5)
    c.line(lx + 4 * (lfw + lgap) + lfw / 2, y(top + 112), lx + 4 * (lfw + lgap) + lfw / 2, y(top + 150))
    c.line(lx + 4 * (lfw + lgap) + lfw / 2, y(top + 150), lx + lfw / 2, y(top + 150))
    c.line(lx + lfw / 2, y(top + 150), lx + lfw / 2, y(top + 122))
    c.setDash()
    c.setFillColor(OX)
    p = c.beginPath()
    p.moveTo(lx + lfw / 2, y(top + 114))
    p.lineTo(lx + lfw / 2 - 4.5, y(top + 123))
    p.lineTo(lx + lfw / 2 + 4.5, y(top + 123))
    p.close()
    c.drawPath(p, stroke=0, fill=1)

    # --- decisions made ---
    top = 706
    line(c, M, top, W - M)
    eyebrow(c, M, top + 30, "Three decisions this flow encodes")
    dec = [("The loyalty card is on the home screen, not in Rewards",
            "It is the reason people come back, so it sits above the fold rather than behind a tab."),
           ("The offer is stated twice, in context",
            "Once as a home banner, once on the drink itself, so nobody discovers it only at the counter."),
           ("Fulfilment stays human",
            "The app takes the order; the free second cup is added at the counter, which keeps the ritual face to face.")]
    dw = (CW - 2 * 32) / 3
    for i, (h, p) in enumerate(dec):
        dx = M + i * (dw + 32)
        end = para(c, dx, top + 68, h, SANS_M, 18, INK, dw - 24, lead=26)
        para(c, dx, end + 14, p, SANS_L, 16, MUTED, dw - 24, lead=24)


def slide03(c):
    chrome(c, 3, "The screens", None, LABEL, TOTAL)

    top = 206
    para(c, M, top, "Concept screens. Prices are illustrative; photography is placed from Unsplash.",
         SANS_L, 19, MUTED, CW * 0.62, lead=27)

    top = 276
    ph = 556.0
    pw = ph * 738 / 1600
    gap = (CW - 3 * pw) / 2
    shots = [
        ("img/mc-app-home.jpg", "Home",
         "Greeting, the Second Cup Club card at 6 of 10, the 4–7pm banner, then what is being poured today."),
        ("img/mc-app-product.jpg", "Drink",
         "Size and sweetness as chips rather than dropdowns, and the offer restated in context before adding to the order."),
        ("img/mc-app-rewards.jpg", "Rewards",
         "Progress to the tenth cup, and a history of recent cups with the stamps each one earned."),
    ]
    for i, (src, name, desc) in enumerate(shots):
        px = M + i * (pw + gap)
        rect(c, px - 5, top - 5, pw + 10, ph + 10, fill=HexColor("#111110"), r=20)
        img(c, src, px, top, pw, ph, r=14)
        text(c, px, top + ph + 44, name, SERIF_M, 30, INK)
        para(c, px, top + ph + 88, desc, SANS_L, 16, MUTED, min(pw + 190, W - M - px), lead=24, maxlines=3)


def slide04(c):
    chrome(c, 4, "From brand system to interface", None, LABEL, TOTAL)

    top = 206
    para(c, M, top, "The identity is built from my own palace drawings. The app reuses them as components "
         "rather than decoration.", SANS_L, 19, MUTED, CW * 0.62, lead=27)

    # --- palette ---
    top = 292
    eyebrow(c, M, top, "Palette, sampled from the build")
    sw = 150.0
    for i, (hexv, nm, use) in enumerate([("#691f2c", "Oxblood", "Primary action"),
                                         ("#2d0e0c", "Roast", "Offer banner"),
                                         ("#e6b3b0", "Kashmiri pink", "Rewards"),
                                         ("#f6efe5", "Cream", "Background")]):
        sx = M + i * (sw + 18)
        rect(c, sx, top + 32, sw, 92, fill=HexColor(hexv), r=4,
             stroke=RULE if hexv == "#f6efe5" else None)
        text(c, sx, top + 140, nm, SANS_M, 16, INK)
        text(c, sx, top + 164, hexv, SANS_L, 13, MUTED, space=1.2)
        text(c, sx, top + 186, use, SANS_L, 13, MUTED)

    # --- type ---
    x2 = M + 4 * (sw + 18) + 44
    eyebrow(c, x2, top, "Voice and data")
    text(c, x2, top + 26, "Sana, chai time?", SERIF_M, 46, INK)
    text(c, x2, top + 92, "Display serif carries the brand's voice", SANS_L, 15, MUTED)
    text(c, x2, top + 130, "Rs 450  ·  6 / 10 stamps  ·  4–7pm", SANS, 24, INK)
    text(c, x2, top + 172, "Sans carries prices, counts and times", SANS_L, 15, MUTED)

    # --- photography rule ---
    x3 = x2 + 470
    eyebrow(c, x3, top, "One photography rule")
    para(c, x3, top + 30, "Every drink is shown as a real photograph, never an illustration. "
         "The drawings are reserved for ornament and packaging, so the menu always tells the truth "
         "about what arrives.", SANS_L, 17, BODY, CW - (x3 - M), lead=26)

    # --- components ---
    top = 590
    line(c, M, top, W - M)
    eyebrow(c, M, top + 30, "Components the identity produced")

    cw4 = (CW - 3 * 30) / 4
    cy = top + 66

    # 1 stamp card
    rect(c, M, cy, cw4, 200, fill=OX, r=6)
    text(c, M + 26, cy + 26, "Second Cup", SERIF_M, 26, HexColor("#F7F0E6"))
    text(c, M + 168, cy + 32, "Club", SERIF_I, 22, PINK)
    text(c, M + cw4 - 26, cy + 32, "6 / 10", SANS_L, 15, PINK, right=True)
    for k in range(10):
        cx = M + 30 + k * ((cw4 - 60) / 9)
        c.setFillColor(PINK if k < 6 else HexColor("#8a3a46"))
        c.circle(cx, y(cy + 86), 11, stroke=0, fill=1)
    para(c, M + 26, cy + 116, "Four more stamps and the tenth is on the house.",
         SANS_L, 14, HexColor("#e0b9b6"), cw4 - 52, lead=20)
    text(c, M, cy + 228, "Stamp card", SANS_M, 17, INK)

    # 2 offer banner
    x = M + cw4 + 30
    rect(c, x, cy, cw4, 200, fill=DEEP, r=6)
    text(c, x + 26, cy + 34, "Stay for the", SERIF_M, 26, HexColor("#F7F0E6"))
    text(c, x + 26, cy + 68, "second cup", SERIF_I, 26, PINK)
    rect(c, x + 26, cy + 112, 196, 34, fill=HexColor("#F7F0E6"), r=17)
    text(c, x + 124, cy + 121, "2ND CHAI FREE · 4–7PM", SANS_M, 11, DEEP, space=0.8, center=True)
    text(c, x, cy + 228, "Offer banner", SANS_M, 17, INK)

    # 3 option chips
    x = M + 2 * (cw4 + 30)
    rect(c, x, cy, cw4, 200, fill=CARD, r=6)
    eyebrow(c, x + 24, cy + 24, "Size", MUTED, 10)
    for k, (lab, price, sel) in enumerate([("Glass", "Rs 350", False), ("Cup", "Rs 450", True), ("Kettle", "Rs 990", False)]):
        bx = x + 24 + k * ((cw4 - 48) / 3)
        bw = (cw4 - 48) / 3 - 8
        rect(c, bx, cy + 48, bw, 54, fill=CARD, r=6, stroke=OX if sel else RULE, lw=1.6 if sel else 1)
        text(c, bx + bw / 2, cy + 58, lab, SANS_M, 14, INK, center=True)
        text(c, bx + bw / 2, cy + 78, price, SANS_L, 12, MUTED, center=True)
    eyebrow(c, x + 24, cy + 116, "Sweetness", MUTED, 10)
    for k, (lab, sel) in enumerate([("None", False), ("A little", True), ("Proper", False)]):
        bx = x + 24 + k * ((cw4 - 48) / 3)
        bw = (cw4 - 48) / 3 - 8
        rect(c, bx, cy + 136, bw, 24, fill=CARD, r=12, stroke=OX if sel else RULE, lw=1.6 if sel else 1)
        text(c, bx + bw / 2, cy + 141, lab, SANS_L, 12, INK, center=True)
    text(c, x, cy + 228, "Option chips", SANS_M, 17, INK)

    # 4 tab bar with cup action
    x = M + 3 * (cw4 + 30)
    rect(c, x, cy, cw4, 200, fill=CARD, r=6)
    labels = ["Home", "Menu", "", "Rewards", "Profile"]
    for k, lab in enumerate(labels):
        bx = x + 24 + k * ((cw4 - 48) / 5) + ((cw4 - 48) / 5) / 2
        if not lab:
            continue
        c.setFillColor(OX if k == 0 else HexColor("#c9c2b4"))
        c.circle(bx, y(cy + 86), 7, stroke=0, fill=1)
        text(c, bx, cy + 100, lab, SANS_L, 11, INK if k == 0 else MUTED, center=True)
    cxm = x + 24 + 2 * ((cw4 - 48) / 5) + ((cw4 - 48) / 5) / 2
    c.setFillColor(OX)
    c.circle(cxm, y(cy + 78), 25, stroke=0, fill=1)
    text(c, cxm, cy + 70, "∪", SANS_L, 18, HexColor("#F7F0E6"), center=True)
    para(c, x + 24, cy + 126, "The cup sits above the bar: ordering is always one tap away.",
         SANS_L, 13, MUTED, cw4 - 48, lead=19)
    text(c, x, cy + 228, "Tab bar + order action", SANS_M, 17, INK)


SLIDES = [(slide01, "01-problem"), (slide02, "02-flow"), (slide03, "03-screens"), (slide04, "04-system")]


def main():
    register()
    render(SLIDES, OUT, "mirs-cafe-app")


if __name__ == "__main__":
    main()
