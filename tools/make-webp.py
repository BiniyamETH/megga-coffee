"""Makes a lighter .webp copy next to every .jpg photo in assets/ (newer phones download the
.webp, older phones keep using the .jpg). The big tap-to-view dish photos in items/large are left as .jpg.

Run from the site folder:   python tools/make-webp.py
It only makes copies that are missing or older than their .jpg. Needs Pillow: pip install pillow
You don't have to run it: the publish step makes any missing copy by itself."""
import os
import sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
# Page-top photos that are 1800px wide also get a 900px copy for phones.
HALF_SIZE = ["gallery/cafe-interior.jpg", "gallery/pastry-case.jpg", "gallery/cappuccino.jpg"]

made = saved = 0


def convert(img, jpg, out):
    global made, saved
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(jpg):
        return
    img.save(out, "WEBP", quality=74, method=6)
    made += 1
    saved += os.path.getsize(jpg) - os.path.getsize(out)


for folder, _, files in os.walk(ROOT):
    if os.path.basename(folder) == "large":
        continue
    for name in files:
        if not name.lower().endswith(".jpg"):
            continue
        jpg = os.path.join(folder, name)
        img = Image.open(jpg).convert("RGB")
        convert(img, jpg, jpg[:-4] + ".webp")
        rel = os.path.relpath(jpg, ROOT).replace("\\", "/")
        if rel in HALF_SIZE:
            half = img.resize((900, round(img.height * 900 / img.width)), Image.LANCZOS)
            convert(half, jpg, jpg[:-4] + "-900.webp")

print("make-webp: made %d copies, %d KB smaller than the .jpg files they stand in for" % (made, saved // 1024))
