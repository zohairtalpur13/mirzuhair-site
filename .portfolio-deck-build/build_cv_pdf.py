#!/usr/bin/env python3
"""Build Mir-Zuhair-CV.pdf from cv.js, so the page and the PDF always carry the same text.

Layout reproduces the existing CV: A4, a left label column and a right content
column, hairline rules between sections. Section and item gaps are tightened
automatically (down to a floor) so the CV stays on one page as content grows.
"""
import json
import os
import subprocess

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "Mir-Zuhair-CV.pdf")

NAME = "Mir Zuhair"
ROLE = "Textile & Communication Designer · Visual Researcher"
CONTACT = "Hyderabad, Sindh, Pakistan · zohairtalpur13@gmail.com · mirzuhair.com"

PW, PH = A4
LABEL_X = 51.0
COL_X = 159.5
RIGHT_X = 544.3
HEAD_X = 57.0
HEAD_RIGHT = 538.3
TOP = 57.6
BOTTOM = PH - 57.0

INK = HexColor("#1b1a18")
MUTED = HexColor("#76716a")
BODY = HexColor("#3b3834")
ACCENT = HexColor("#6b1e2b")
HAIRLINE = HexColor("#d9d4cc")

SERIF, SERIF_B = "Georgia", "Georgia-Bold"
SANS, SANS_B = "Helvetica", "Helvetica-Bold"

BODY_SIZE, BODY_LEAD = 9.0, 13.0
TITLE_SIZE = 11.0
SUB_SIZE = 8.5
LABEL_SIZE = 8.0
TITLE_OFFSET = 3.0      # item title top, relative to the section label top
SUB_AFTER_TITLE = 10.9
BODY_AFTER_SUB = 12.0
BODY_AFTER_TITLE = 10.9
RULE_TO_LABEL = 5.4

GAP_SECTION = 22.7      # last line top -> next section rule
GAP_ITEM = 22.1         # last line top -> next item title top
GAP_SECTION_MIN = 15.0
GAP_ITEM_MIN = 15.5


def load_cv():
    js = (
        "const fs=require('fs');"
        "const src=fs.readFileSync(%r,'utf8');"
        "process.stdout.write(JSON.stringify(eval(src + ';CV')));" % os.path.join(ROOT, "cv.js")
    )
    return json.loads(subprocess.run(["node", "-e", js], capture_output=True, check=True).stdout)


def register_fonts():
    sup = "/System/Library/Fonts/Supplemental"
    pdfmetrics.registerFont(TTFont(SERIF, os.path.join(sup, "Georgia.ttf")))
    pdfmetrics.registerFont(TTFont(SERIF_B, os.path.join(sup, "Georgia Bold.ttf")))


def ascent(font, size):
    return pdfmetrics.getAscent(font, size)


def wrap(text, font, size, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if pdfmetrics.stringWidth(trial, font, size) <= width or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


class Sheet:
    """Two passes over the same code: measure (draw=False) then render."""

    def __init__(self, cv, gap_section, gap_item, draw=False):
        self.cv, self.gs, self.gi, self.draw = cv, gap_section, gap_item, draw
        self.pages = 1
        self.c = canvas.Canvas(OUT, pagesize=A4) if draw else None
        self.y = 0.0

    # --- primitives (y values are the TOP of a text line) ---
    def text(self, x, top, s, font, size, color, right=False):
        if self.draw:
            self.c.setFont(font, size)
            self.c.setFillColor(color)
            base = PH - (top + ascent(font, size))
            (self.c.drawRightString if right else self.c.drawString)(x, base, s)

    def rule(self, top, x0, x1, color, width):
        if self.draw:
            self.c.setStrokeColor(color)
            self.c.setLineWidth(width)
            self.c.line(x0, PH - top, x1, PH - top)

    def new_page(self):
        if self.draw:
            self.c.showPage()
        self.pages += 1
        self.y = TOP

    def fits(self, height):
        return self.y + height <= BOTTOM

    # --- blocks ---
    def header(self):
        self.text(HEAD_X, TOP, NAME, SERIF, 28, INK)
        self.text(HEAD_X, 86.6, ROLE, SANS, 10, MUTED)
        self.text(HEAD_X, 100.6, CONTACT, SANS, 10, MUTED)
        self.rule(125.2, HEAD_X, HEAD_RIGHT, INK, 0.8)
        self.y = 137.6 - RULE_TO_LABEL - self.gs  # so the first section lands at 137.6

    def item_lines(self, it):
        """Line tops relative to the item's own start, plus its total height."""
        w = RIGHT_X - COL_X
        out, top = [], 0.0
        if it.get("t"):
            out.append(("title", top, it["t"]))
            top += SUB_AFTER_TITLE if it.get("s") else BODY_AFTER_TITLE
        if it.get("s"):
            out.append(("sub", top - SUB_AFTER_TITLE + SUB_AFTER_TITLE, it["s"]))
            top += BODY_AFTER_SUB
        if it.get("p"):
            for i, ln in enumerate(wrap(it["p"], SANS, BODY_SIZE, w)):
                out.append(("body", top + i * BODY_LEAD, ln))
            top += (len(wrap(it["p"], SANS, BODY_SIZE, w)) - 1) * BODY_LEAD
        for i, li in enumerate(it.get("l", [])):
            for j, ln in enumerate(wrap(li, SANS, BODY_SIZE, w - 10)):
                out.append(("bullet" if j == 0 else "body-ind", top, ln))
                top += BODY_LEAD
            top -= BODY_LEAD
            if i < len(it["l"]) - 1:
                top += BODY_LEAD
        return out, top  # top == offset of the LAST line

    def section(self, sec):
        items = sec["items"]
        blocks = [self.item_lines(it) for it in items]
        # height from the rule down to the last line's top
        h = RULE_TO_LABEL + TITLE_OFFSET + blocks[0][1]
        for b in blocks[1:]:
            h += self.gi + b[1]
        if not self.fits(self.y + self.gs + h - self.y) or not self.fits(self.gs + h):
            self.new_page()
            rule_top = self.y
        else:
            rule_top = self.y + self.gs
        self.rule(rule_top, LABEL_X, RIGHT_X, HAIRLINE, 0.4)
        label_top = rule_top + RULE_TO_LABEL
        self.text(LABEL_X, label_top, sec["h"].upper(), SANS_B, LABEL_SIZE, INK)

        item_top = label_top + TITLE_OFFSET
        for it, (lines, last) in zip(items, blocks):
            if it.get("d"):
                self.text(RIGHT_X, label_top if it is items[0] else item_top - TITLE_OFFSET,
                          it["d"], SANS, SUB_SIZE, MUTED, right=True)
            for kind, off, s in lines:
                top = item_top + off
                if kind == "title":
                    self.text(COL_X, top, s, SERIF_B, TITLE_SIZE, INK)
                elif kind == "sub":
                    self.text(COL_X, top, s, SANS, SUB_SIZE, ACCENT)
                elif kind == "bullet":
                    self.text(COL_X, top - 0.2, "·", SANS, 12, BODY)
                    self.text(COL_X + 10, top, s, SANS, BODY_SIZE, BODY)
                elif kind == "body-ind":
                    self.text(COL_X + 10, top, s, SANS, BODY_SIZE, BODY)
                else:
                    self.text(COL_X, top, s, SANS, BODY_SIZE, BODY)
            self.y = item_top + last
            item_top = self.y + self.gi

    def build(self):
        self.header()
        for sec in self.cv:
            self.section(sec)
        self.rule(self.y + self.gs, LABEL_X, RIGHT_X, HAIRLINE, 0.4)
        if self.draw:
            self.c.setTitle("Mir Zuhair — CV")
            self.c.setAuthor("Mir Zuhair")
            self.c.setSubject("Curriculum Vitae")
            self.c.save()
        return self.pages


def main():
    register_fonts()
    cv = load_cv()
    gs, gi = GAP_SECTION, GAP_ITEM
    while Sheet(cv, gs, gi).build() > 1 and (gs > GAP_SECTION_MIN or gi > GAP_ITEM_MIN):
        gs = max(GAP_SECTION_MIN, gs - 0.5)
        gi = max(GAP_ITEM_MIN, gi - 0.5)
    pages = Sheet(cv, gs, gi, draw=True).build()
    print(f"wrote {OUT} — {pages} page(s), section gap {gs:.1f}, item gap {gi:.1f}")


if __name__ == "__main__":
    main()
