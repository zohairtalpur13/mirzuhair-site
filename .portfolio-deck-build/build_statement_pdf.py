#!/usr/bin/env python3
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_JUSTIFY

OUT = "/Users/zuhairtalpur/Documents/mirzuhair-site/.portfolio-deck-build/Statement of Purpose - Mir Zuhair.pdf"
TEXT_FILE = "/Users/zuhairtalpur/Documents/mirzuhair-site/.portfolio-deck-build/statement_text.txt"

with open(TEXT_FILE) as f:
    body = [p.strip() for p in f.read().split("\n\n") if p.strip()]

doc = SimpleDocTemplate(
    OUT, pagesize=letter,
    topMargin=0.9 * inch, bottomMargin=0.9 * inch,
    leftMargin=1.0 * inch, rightMargin=1.0 * inch,
    title="Statement of Purpose - Mir Zuhair",
)

name_style = ParagraphStyle("name", fontName="Times-Bold", fontSize=13, leading=16, spaceAfter=2)
contact_style = ParagraphStyle("contact", fontName="Times-Roman", fontSize=10.5, leading=13, spaceAfter=14, textColor="#333333")
title_style = ParagraphStyle("title", fontName="Times-Bold", fontSize=11.5, leading=15, spaceAfter=16)
body_style = ParagraphStyle("body", fontName="Times-Roman", fontSize=11.5, leading=17, alignment=TA_JUSTIFY, spaceAfter=13)

story = [
    Paragraph("Mir Zuhair", name_style),
    Paragraph("Hyderabad, Sindh, Pakistan &nbsp;|&nbsp; zohairtalpur13@gmail.com", contact_style),
    Paragraph("Statement of Purpose, MPS Communication Design, Parsons School of Design (Fall 2027)", title_style),
]
for para in body:
    story.append(Paragraph(para, body_style))

doc.build(story)
print("wrote", OUT)
