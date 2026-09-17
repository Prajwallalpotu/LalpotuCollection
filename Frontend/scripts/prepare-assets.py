"""Create optimized, local derivatives of existing approved website imagery."""
from pathlib import Path
import sys
from PIL import Image, ImageOps, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'assets'
hero_path, social_dir = map(Path, sys.argv[1:3])

hero = ImageOps.exif_transpose(Image.open(hero_path)).convert('RGB')
for width in (480, 720, 1200):
    resized = hero.resize((width, round(width * hero.height / hero.width)), Image.Resampling.LANCZOS)
    resized.save(OUT / f'editorial-{width}.webp', quality=82, method=6)

posts = {
    'rajmata': '7575c433801d4ca8.jpg',
    'maheshwari': 'cbdbd6312b09c86b.jpg',
    'viscose': 'e027e4466ac7ebba.jpg',
    'organza': '681e8f4718a64b7d.jpg',
}
for name, filename in posts.items():
    im = ImageOps.exif_transpose(Image.open(social_dir / filename)).convert('RGB')
    for width in (180, 360):
        resized = im.resize((width, round(width * im.height / im.width)), Image.Resampling.LANCZOS)
        resized.save(OUT / f'{name}-{width}.webp', quality=84, method=6)

logo = Image.open(OUT / 'lalpotu-wordmark.png').convert('RGBA')
small = logo.copy()
small.thumbnail((320, 320), Image.Resampling.LANCZOS)
small.save(OUT / 'logo.webp', lossless=True, method=6)
# A mechanical crop of the supplied circular mark, not a replacement logo.
mark = logo.crop((488, 105, 1048, 665))
for name, size in (('favicon.png', 64), ('apple-touch-icon.png', 180)):
    canvas = Image.new('RGBA', (size, size), '#f8f3eb')
    thumb = mark.resize((size - 8, size - 8), Image.Resampling.LANCZOS)
    canvas.alpha_composite(thumb, (4, 4))
    canvas.convert('RGB').save(OUT / name, optimize=True)

# Code-native brand lockup for sharing previews, using the original logo.
card = Image.new('RGB', (1200, 630), '#f8f3eb')
draw = ImageDraw.Draw(card)
draw.rectangle((28, 28, 1171, 601), outline='#946c43', width=2)
thumb = logo.copy()
thumb.thumbnail((440, 400), Image.Resampling.LANCZOS)
card.paste(thumb, (65, 105), thumb)
serif = '/System/Library/Fonts/Supplemental/Georgia.ttf'
sans = '/System/Library/Fonts/Supplemental/Arial.ttf'
draw.text((565, 188), 'Lalpotu', font=ImageFont.truetype(serif, 70), fill='#4a1425')
draw.text((565, 271), 'Collection', font=ImageFont.truetype(serif, 70), fill='#4a1425')
draw.text((569, 383), 'SAREES & ETHNIC WEAR', font=ImageFont.truetype(sans, 23), fill='#735034')
draw.text((569, 427), 'Nanded, Maharashtra', font=ImageFont.truetype(sans, 25), fill='#4a1425')
card.save(OUT / 'social-share.jpg', quality=90, optimize=True)
print('Prepared responsive photographs, logo, favicon and sharing image.')
