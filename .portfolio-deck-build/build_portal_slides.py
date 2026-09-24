#!/usr/bin/env python3
"""Build flattened contact-sheet style slide images for the New School portal upload,
matching the visual convention already used in the applicant's existing uploaded slides
(multiple source images placed edge to edge, common height, no text overlay)."""
import os
from PIL import Image

ROOT = "/Users/zuhairtalpur/Documents/mirzuhair-site"
OUT = os.path.join(ROOT, ".portfolio-deck-build", "portal-slides")
os.makedirs(OUT, exist_ok=True)

BG = (245, 242, 235)
TARGET_H = 1400


def strip(paths, out_name, target_h=TARGET_H, max_total_w=5600):
    imgs = []
    for p in paths:
        full = p if os.path.isabs(p) else os.path.join(ROOT, p)
        im = Image.open(full)
        if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
            im = im.convert("RGBA")
            flat = Image.new("RGB", im.size, BG)
            flat.paste(im, mask=im.split()[-1])
            im = flat
        else:
            im = im.convert("RGB")
        w, h = im.size
        new_w = int(w * (target_h / h))
        imgs.append(im.resize((new_w, target_h), Image.LANCZOS))
    total_w = sum(im.width for im in imgs)
    scale = min(1.0, max_total_w / total_w)
    if scale < 1.0:
        imgs = [im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS) for im in imgs]
        total_w = sum(im.width for im in imgs)
        target_h = imgs[0].height
    canvas = Image.new("RGB", (total_w, target_h), BG)
    x = 0
    for im in imgs:
        canvas.paste(im, (x, 0))
        x += im.width
    out_path = os.path.join(OUT, out_name)
    canvas.save(out_path, quality=94)
    print("wrote", out_path, canvas.size)
    return out_path


# --- MIR, What Remains. ---
strip(
    ["mir-campaign/assets/stationery.png", "mir-campaign/assets/packaging.png"],
    "mir-what-remains-1-identity-packaging.jpg",
)
RASTER = os.path.join(OUT, "_raster")
strip(
    [os.path.join(RASTER, "poster-pressure.png"), os.path.join(RASTER, "poster-transfer.png"), os.path.join(RASTER, "poster-absence.png")],
    "mir-what-remains-2-typographic-posters.jpg",
    target_h=1800,
)

# --- Mir's Cafe ---
strip(
    ["img/mc-st-crosswalk.jpg", "img/mc-box4.jpg", "img/mc-cups2.jpg"],
    "mirs-cafe-1-identity-packaging.jpg",
)
strip(
    ["img/mc-billboard1.jpg", "img/mc-app-home.jpg"],
    "mirs-cafe-2-street-app.jpg",
)
strip(
    ["img/mc-cup3.jpg", "img/mc-kraft2.jpg", "img/mc-tote3.jpg", "img/mc-tin1.jpg"],
    "mirs-cafe-3-packaging-objects.jpg",
)
strip(
    ["img/mc-ig1.jpg", "img/mc-ig4.jpg", "img/mc-book1.jpg", "img/mc-sticker1.jpg"],
    "mirs-cafe-4-social-book-stickers.jpg",
)

# --- MIR, What Remains. wordmark + source ---
strip(
    [os.path.join(RASTER, "mir-wordmark.png"), "img/dd-door.jpg"],
    "mir-what-remains-3-wordmark-source.jpg",
)
