#!/usr/bin/env python3
"""Build the Threads of Time thesis paper PDF from ../paper.js (same content as the web page)."""
import io, json, os, re, subprocess
from PIL import Image
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table,
                                TableStyle, Image as RLImage, KeepTogether, PageBreak, NextPageTemplate, CondPageBreak)

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
OUT = os.path.join(SITE, "Threads-of-Time-Thesis-Mir-Zuhair.pdf")
F = os.path.join(HERE, "fonts")
pdfmetrics.registerFont(TTFont("Serif", os.path.join(F, "CormorantGaramond-Regular.ttf")))
pdfmetrics.registerFont(TTFont("SerifMed", os.path.join(F, "CormorantGaramond-Medium.ttf")))
pdfmetrics.registerFont(TTFont("SerifIt", os.path.join(F, "CormorantGaramond-Italic.ttf")))
pdfmetrics.registerFont(TTFont("Sans", os.path.join(F, "Jost-Light.ttf")))
pdfmetrics.registerFont(TTFont("SansReg", os.path.join(F, "Jost-Regular.ttf")))
pdfmetrics.registerFont(TTFont("SansMed", os.path.join(F, "Jost-Medium.ttf")))
pdfmetrics.registerFontFamily("Serif", normal="Serif", bold="SerifMed", italic="SerifIt", boldItalic="SerifIt")
pdfmetrics.registerFontFamily("Sans", normal="Sans", bold="SansMed", italic="Sans", boldItalic="SansMed")

INK, MUTED, LINE = colors.HexColor("#1b1a18"), colors.HexColor("#76716a"), colors.HexColor("#d9d4cc")
OX, GOLD, LINEN = colors.HexColor("#6b1e2b"), colors.HexColor("#b8923a"), colors.HexColor("#f3ede1")

js = open(os.path.join(SITE, "paper.js")).read()
P = json.loads(subprocess.check_output(["node", "-e", js + "\nprocess.stdout.write(JSON.stringify(PAPER))"]))

W, H = A4
ML, MR, MT, MB = 22 * mm, 22 * mm, 22 * mm, 24 * mm
CW = W - ML - MR

S = {
    "body": ParagraphStyle("body", fontName="Serif", fontSize=12.2, leading=17.4, textColor=INK, alignment=TA_JUSTIFY, spaceAfter=7),
    "h": ParagraphStyle("h", fontName="Serif", fontSize=25, leading=29, textColor=INK, spaceBefore=4, spaceAfter=10),
    "h3": ParagraphStyle("h3", fontName="SansMed", fontSize=8, leading=11, textColor=OX, spaceBefore=12, spaceAfter=5),
    "li": ParagraphStyle("li", fontName="Sans", fontSize=9.6, leading=14, textColor=INK, leftIndent=14, bulletIndent=2, spaceAfter=4),
    "pull": ParagraphStyle("pull", fontName="SerifIt", fontSize=17, leading=22, textColor=OX, leftIndent=14, spaceBefore=10, spaceAfter=12),
    "cap": ParagraphStyle("cap", fontName="Sans", fontSize=7.8, leading=10.5, textColor=MUTED, spaceBefore=4),
    "th": ParagraphStyle("th", fontName="SansReg", fontSize=6.8, leading=9, textColor=MUTED),
    "td": ParagraphStyle("td", fontName="Sans", fontSize=8.6, leading=12, textColor=INK),
    "td1": ParagraphStyle("td1", fontName="Serif", fontSize=11, leading=13.5, textColor=OX),
    "kick": ParagraphStyle("kick", fontName="SansReg", fontSize=7.5, leading=10, textColor=GOLD),
    "meta_k": ParagraphStyle("mk", fontName="SansReg", fontSize=6.8, leading=9, textColor=MUTED),
    "meta_v": ParagraphStyle("mv", fontName="Sans", fontSize=9, leading=12, textColor=INK),
}
up = lambda t: t.upper()
def rich(t):  # paper.js allows <b> only
    t = t.replace("&", "&amp;").replace("&amp;amp;", "&amp;")
    return re.sub(r"<(?!/?b>)", "&lt;", t)

def img(src, w, h=None):
    """Downscale for print (~220 dpi) and return a flowable of width w (and max height h)."""
    im = Image.open(os.path.join(SITE, src)).convert("RGB")
    ar = im.height / im.width
    dw, dh = w, w * ar
    if h and dh > h:
        dh, dw = h, h / ar
    px = int(dw / 72 * 220)
    if im.width > px:
        im = im.resize((px, int(px * ar)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, "JPEG", quality=84, optimize=True); b.seek(0)
    return RLImage(b, dw, dh)

fig_n = [0]
def figure(b):
    items, lay = b["items"], b["layout"]
    n = {"full": 1, "pair": 2, "trio": 3, "grid": 4}[lay]
    gap = 5 * mm
    cw = (CW - gap * (n - 1)) / n
    maxh = {"full": 150 * mm if not b.get("tall") else 190 * mm, "pair": 80 * mm, "trio": 70 * mm, "grid": 55 * mm}[lay]
    cells = []
    for it in items:
        fig_n[0] += 1
        cells.append([img(it["src"], cw, maxh), Paragraph(f'<font name="SansMed" color="#1b1a18">Fig. {fig_n[0]}</font>&nbsp; {rich(it["cap"])}', S["cap"])])
    colw = [cw + (gap if i < n - 1 else 0) for i in range(n)]
    t = Table([[c[0] for c in cells], [c[1] for c in cells]], colWidths=colw, hAlign="LEFT")
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, 0), "BOTTOM"), ("VALIGN", (0, 1), (-1, 1), "TOP"),
                           ("ALIGN", (0, 0), (-1, 0), "CENTER" if lay == "full" else "LEFT"),
                           ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                           ("TOPPADDING", (0, 0), (-1, 0), 8), ("BOTTOMPADDING", (0, 1), (-1, 1), 12),
                           ("TOPPADDING", (0, 1), (-1, 1), 0), ("BOTTOMPADDING", (0, 0), (-1, 0), 0)]
                          + [("RIGHTPADDING", (i, 0), (i, -1), gap) for i in range(n - 1)]))
    return t

def table(b):
    ncol = len(b["head"])
    widths = {3: [0.2, 0.5, 0.3], 2: [0.45, 0.55]}[ncol]
    data = [[Paragraph(up(h) if h else "", S["th"]) for h in b["head"]]]
    for r in b["rows"]:
        data.append([Paragraph(rich(c), S["td1"] if i == 0 else S["td"]) for i, c in enumerate(r)])
    t = Table(data, colWidths=[CW * w for w in widths], repeatRows=1)
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LINEBELOW", (0, 0), (-1, 0), 0.8, INK),
                           ("LINEBELOW", (0, 1), (-1, -1), 0.4, LINE), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                           ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 7)]))
    return [Spacer(1, 6), t, Spacer(1, 10)]

def rule(color=INK, w=0.8, before=0, after=8):
    t = Table([[""]], colWidths=[CW], rowHeights=[1]); t.setStyle(TableStyle([("LINEABOVE", (0, 0), (-1, 0), w, color)]))
    return [Spacer(1, before), t, Spacer(1, after)]

# ---------- story ----------
story = []
# Cover
cover_img = img("img/tt-hero.jpg", 80 * mm, 150 * mm)
left = [Paragraph(up("Research paper · BFA Textile Design thesis"), S["kick"]), Spacer(1, 14),
        Paragraph(P["title"], ParagraphStyle("t", fontName="Serif", fontSize=54, leading=52, textColor=INK)), Spacer(1, 16),
        Paragraph(P["sub"], ParagraphStyle("s", fontName="SerifIt", fontSize=14.5, leading=19, textColor=colors.HexColor("#3b3834")))]
ct = Table([[left, cover_img]], colWidths=[CW - 86 * mm, 86 * mm])
ct.setStyle(TableStyle([("VALIGN", (0, 0), (0, 0), "BOTTOM"), ("VALIGN", (1, 0), (1, 0), "TOP"), ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (0, 0), 14), ("RIGHTPADDING", (1, 0), (1, 0), 0)]))
story += [Spacer(1, 18 * mm), ct, Spacer(1, 14 * mm)] + rule(LINE, 0.5, 0, 10)
meta = [[[Paragraph(up(k), S["meta_k"]), Spacer(1, 3), Paragraph(v, S["meta_v"])] for k, v in P["meta"][:3]],
        [[Paragraph(up(k), S["meta_k"]), Spacer(1, 3), Paragraph(v, S["meta_v"])] for k, v in P["meta"][3:]] + [""]]
mt = Table(meta, colWidths=[CW / 3] * 3); mt.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 10)]))
story += [mt, NextPageTemplate("body"), PageBreak()]

# Abstract + contents
abs_t = Table([[[Paragraph(up("Abstract"), S["h3"]), Paragraph(rich(P["abstract"]), S["body"]), Spacer(1, 4),
                 Paragraph(f'<font name="SansMed">{up("Keywords")}</font>&nbsp;&nbsp; ' + " · ".join(P["keywords"]), S["cap"])]]], colWidths=[CW])
abs_t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), LINEN), ("LEFTPADDING", (0, 0), (-1, -1), 16), ("RIGHTPADDING", (0, 0), (-1, -1), 16), ("TOPPADDING", (0, 0), (-1, -1), 10), ("BOTTOMPADDING", (0, 0), (-1, -1), 14)]))
story += [abs_t, Spacer(1, 18), Paragraph(up("Contents"), S["h3"])]
heads = [b for b in P["body"] if b["t"] == "h"]
toc = Table([[Paragraph(b["n"], S["td1"]), Paragraph(b["h"], ParagraphStyle("tc", parent=S["body"], alignment=0, spaceAfter=0))] for b in heads],
            colWidths=[12 * mm, CW - 12 * mm])
toc.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.4, LINE), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 5)]))
story += [toc, PageBreak()]

first = True
for b in P["body"]:
    t = b["t"]
    if t == "h":
        if not first:
            story.append(CondPageBreak(90 * mm))
            story += rule(INK, 0.8, 18, 6)
        first = False
        story.append(Paragraph(f'<font name="SansReg" size="9" color="#b8923a">{b["n"]}</font>&nbsp;&nbsp;&nbsp;{b["h"]}', S["h"]))
    elif t == "h3":
        story.append(CondPageBreak(30 * mm)); story.append(Paragraph(up(b["h"]), S["h3"]))
    elif t == "p":
        story.append(Paragraph(rich(b["text"]), S["body"]))
    elif t == "pull":
        pt = Table([[Paragraph(b["text"], S["pull"])]], colWidths=[CW]); pt.setStyle(TableStyle([("LINEBEFORE", (0, 0), (0, 0), 1.6, GOLD), ("LEFTPADDING", (0, 0), (-1, -1), 0)]))
        story += [Spacer(1, 6), pt, Spacer(1, 8)]
    elif t == "list":
        story += [Paragraph(rich(i), S["li"], bulletText="–") for i in b["items"]] + [Spacer(1, 4)]
    elif t == "table":
        story += table(b)
    elif t == "fig":
        story.append(KeepTogether([figure(b)]))

story += rule(INK, 0.8, 22, 6)
story += [Paragraph(up("Sources"), S["h3"]), Paragraph(rich(P["sources"]), S["body"]),
          Paragraph(up("Acknowledgements"), S["h3"]), Paragraph(rich(P["thanks"]), S["body"])]

def on_body(c, d):
    c.saveState()
    c.setFont("Sans", 7); c.setFillColor(MUTED)
    c.drawString(ML, 12 * mm, "MIR ZUHAIR  ·  THREADS OF TIME")
    c.drawRightString(W - MR, 12 * mm, str(d.page))
    c.setStrokeColor(LINE); c.setLineWidth(0.4); c.line(ML, 16 * mm, W - MR, 16 * mm)
    c.restoreState()

doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=ML, rightMargin=MR, topMargin=MT, bottomMargin=MB,
                      title="Threads of Time — Mir Zuhair", author="Mir Zuhair Talpur",
                      subject="BFA Textile Design thesis, SABS University of Art, Design and Heritages, 2025")
fr = Frame(ML, MB, CW, H - MT - MB, id="f", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate("cover", [fr]), PageTemplate("body", [fr], onPage=on_body)])
doc.build(story)
print("wrote", OUT, os.path.getsize(OUT) // 1024, "KB")
