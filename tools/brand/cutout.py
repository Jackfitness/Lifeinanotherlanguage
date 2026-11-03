"""
Cuts the logo out of its baked-in checkerboard background and exports a web-ready image.

The source art has a fake "transparency" checkerboard (neutral gray/white squares) instead of
real alpha. Everything in the logo is colored (brown felt, green leaves, pink hearts, cream
ribbon), so neutral light pixels are keyed out, edge colors are decontaminated, and the result
is cropped and resized.

Run: python tools/brand/cutout.py   (needs Pillow + numpy)
Out: src/ui/assets/logo.webp
"""
import os

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(ROOT, 'assets', 'brand', 'logo-source.jpg')
OUT = os.path.join(ROOT, 'src', 'ui', 'assets', 'logo.webp')

img = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)
sat = img.max(2) - img.min(2)
lum = img.mean(2)

# Score how "logo-like" each pixel is: colorful or darker than the checkerboard.
score = np.maximum(sat / 22.0, (205.0 - lum) / 30.0)
alpha = np.clip((score - 0.55) / 0.6, 0, 1)

# Clean JPEG speckle in the background, then soften the edge by a hair.
a_img = Image.fromarray((alpha * 255).astype(np.uint8))
a_img = a_img.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(0.6))
alpha = np.asarray(a_img).astype(np.float32) / 255.0
alpha[alpha < 0.06] = 0

# Remove the gray background bleeding into semi-transparent edge pixels.
bg = np.full(3, 236.0)
a = np.maximum(alpha[..., None], 1e-3)
rgb = np.clip((img - (1 - a) * bg) / a, 0, 255)
rgb = np.where(alpha[..., None] > 0.97, img, rgb)

rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
out = Image.fromarray(rgba, 'RGBA')

# Crop to content with a small margin, then size for retina phone screens.
ys, xs = np.where(alpha > 0.1)
pad = 12
box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(out.width, xs.max() + pad), min(out.height, ys.max() + pad))
out = out.crop(box)
w = 720
out = out.resize((w, round(out.height * w / out.width)), Image.LANCZOS)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
out.save(OUT, 'WEBP', quality=88, method=6)
print('wrote', OUT, out.size, os.path.getsize(OUT) // 1024, 'KB')
