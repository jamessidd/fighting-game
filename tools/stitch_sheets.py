#!/usr/bin/env python3
"""Stitch per-frame source folders (defend / roll) into horizontal sprite sheets
that match the game's 864x384 frame size, so they can be loaded like the other
animations. Run from the repo root: python3 tools/stitch_sheets.py
"""
import os
import re
from PIL import Image

IMG_DIR = os.path.join(os.path.dirname(__file__), "..", "img")
FRAME_W, FRAME_H = 864, 384

CHARACTERS = [
    "FireKnight",
    "WaterPrincess",
    "MetalBladeMaster",
    "WindAssassin",
    "GroundMonk",
    "CrystalMauler",
]


def natural_key(name):
    stem = os.path.splitext(name)[0]
    digits = re.findall(r"\d+", stem)
    return (int("".join(digits)) if digits else 0, stem)


def find_folder(char_dir, *keywords):
    for entry in sorted(os.listdir(char_dir)):
        full = os.path.join(char_dir, entry)
        if os.path.isdir(full) and any(k in entry.lower() for k in keywords):
            return full
    return None


def stitch(folder):
    frames = sorted(
        [f for f in os.listdir(folder) if f.lower().endswith(".png")],
        key=natural_key,
    )
    if not frames:
        return None, 0
    sheet = Image.new("RGBA", (FRAME_W * len(frames), FRAME_H), (0, 0, 0, 0))
    for i, fname in enumerate(frames):
        im = Image.open(os.path.join(folder, fname)).convert("RGBA")
        if im.size != (FRAME_W, FRAME_H):
            im = im.resize((FRAME_W, FRAME_H), Image.NEAREST)
        sheet.paste(im, (i * FRAME_W, 0))
    return sheet, len(frames)


def main():
    print("frame counts (plug into characters.js as framesMax):")
    for char in CHARACTERS:
        char_dir = os.path.join(IMG_DIR, char)
        for out_name, keywords in [("defend", ("defend",)), ("roll", ("roll", "tumble"))]:
            folder = find_folder(char_dir, *keywords)
            if not folder:
                print(f"  {char}/{out_name}: NO SOURCE FOLDER")
                continue
            sheet, n = stitch(folder)
            out_path = os.path.join(char_dir, f"{out_name}.png")
            sheet.save(out_path)
            print(f"  {char}/{out_name}.png: {n} frames  (from {os.path.basename(folder)})")


if __name__ == "__main__":
    main()
