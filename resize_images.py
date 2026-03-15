from PIL import Image
import os

IMG_DIR = r"C:\Users\MeesGoetheer\Claude_files\Portfolio\public\images"
TARGET_W, TARGET_H = 1920, 1080

images = [
    # Gwen
    "METZNALLEN_LOWRES_JANTINATALSMA103.jpg",
    "METZNALLEN_LOWRES_JANTINATALSMA62.jpg",
    "METZNALLEN_LOWRES_JANTINATALSMA28.jpg",
    "METZNALLEN_LOWRES_JANTINATALSMA77.jpg",
    "gwen-analog.jpg",
    "gwen-img.jpg",
    "gwen-scheltema-1.jpg",
    "gwen-scheltema-2.jpg",
    "gwen-recent.png",
    # G-Star
    "GSTAR_ANATOMICDENIM_SOPHIEVANVEEN_FULL_074.jpg",
    "GSTAR_ANATOMICDENIM_SOPHIEVANVEEN_FULL_119.jpg",
    "G-StarAnatomicDenimeventAmsterdamAFW-228 kopie.jpg",
    "G-StarAnatomicDenimeventAmsterdamAFW-269 kopie.jpg",
    "G-star_75.jpg",
    "_U9A3870_..jpg",
    "_U9A3905_..jpg",
    "_U9A3954_..jpg",
    "_U9A4225_..jpg",
    # Vrouwmibo
    "Scherm\u00ADafbeelding 2026-03-13 om 11.58.03.png",
]

for filename in images:
    path = os.path.join(IMG_DIR, filename)
    if not os.path.exists(path):
        print(f"NIET GEVONDEN: {filename}")
        continue

    img = Image.open(path)
    orig_w, orig_h = img.size

    target_ratio = TARGET_W / TARGET_H
    orig_ratio = orig_w / orig_h

    if orig_ratio > target_ratio:
        new_w = int(orig_h * target_ratio)
        left = (orig_w - new_w) // 2
        box = (left, 0, left + new_w, orig_h)
    else:
        new_h = int(orig_w / target_ratio)
        top = min((orig_h - new_h) // 4, orig_h - new_h)
        box = (0, top, orig_w, top + new_h)

    img_cropped = img.crop(box)
    img_resized = img_cropped.resize((TARGET_W, TARGET_H), Image.LANCZOS)

    if path.lower().endswith(('.jpg', '.jpeg')):
        if img_resized.mode == 'RGBA':
            img_resized = img_resized.convert('RGB')
        img_resized.save(path, 'JPEG', quality=90)
    else:
        img_resized.save(path)

    print(f"OK: {filename} ({orig_w}x{orig_h} -> {TARGET_W}x{TARGET_H})")

print("\nKlaar!")
