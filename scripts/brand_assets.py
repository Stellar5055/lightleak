from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets" / "brand" / "prism-source.png"
PUBLIC = ROOT / "public"
SRC_ASSETS = ROOT / "src" / "assets"

PUBLIC.mkdir(exist_ok=True)
SRC_ASSETS.mkdir(parents=True, exist_ok=True)

source = Image.open(SOURCE).convert("RGBA")


def opaque_crop(box: tuple[int, int, int, int]) -> Image.Image:
    crop = source.crop(box)
    black = Image.new("RGBA", crop.size, (0, 0, 0, 255))
    black.alpha_composite(crop)
    return black


def rounded(image: Image.Image, ratio: float = 0.12) -> Image.Image:
    size = image.size[0]
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    radius = int(size * ratio)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    out = image.copy()
    out.putalpha(mask)
    return out


def square(image: Image.Image, size: int) -> Image.Image:
    return image.resize((size, size), Image.LANCZOS)


# The small UI badge gets a tighter prism crop; the favicon keeps more of the
# rainbow so it still reads at 32 px.
badge_crop = opaque_crop((520, 220, 1010, 710))
favicon_crop = opaque_crop((500, 200, 1040, 740))
og_crop = opaque_crop((168, 197, 1368, 827))


# UI brand badge: 256 px, rounded corners, transparent outside the radius.
badge_master = rounded(square(badge_crop, 512), 0.12)
badge_master.resize((256, 256), Image.LANCZOS).save(
    SRC_ASSETS / "brand-mark.png", optimize=True
)


# Favicon family. The master keeps the prism and a short rainbow.
favicon_master = rounded(square(favicon_crop, 512), 0.12)
for size in (16, 32, 192, 512):
    favicon_master.resize((size, size), Image.LANCZOS).save(
        PUBLIC / f"favicon-{size}.png", optimize=True
    )

favicon_master.resize((256, 256), Image.LANCZOS).save(
    PUBLIC / "favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
)


# iOS applies its own mask, so keep the touch icon square.
square(favicon_crop, 180).save(PUBLIC / "apple-touch-icon.png", optimize=True)

# Maskable icon: keep the subject inside the 80% safe zone.
maskable = Image.new("RGBA", (512, 512), (0, 0, 0, 255))
maskable.alpha_composite(square(favicon_crop, 410), (51, 51))
maskable.save(PUBLIC / "favicon-maskable-512.png", optimize=True)


# Social card. The 1200 x 630 crop is exact, so only the crop is needed.
og = og_crop.copy()
draw = ImageDraw.Draw(og)


def font(paths: list[str], size: int) -> ImageFont.FreeTypeFont:
    for path in paths:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


serif = font(
    [
        r"C:\Windows\Fonts\georgiai.ttf",
        r"C:\Windows\Fonts\georgia.ttf",
        r"C:\Windows\Fonts\times.ttf",
    ],
    80,
)
sans = font(
    [r"C:\Windows\Fonts\segoeui.ttf", r"C:\Windows\Fonts\arial.ttf"], 22
)
mono = font(
    [r"C:\Windows\Fonts\consola.ttf", r"C:\Windows\Fonts\cour.ttf"], 13
)

draw.text(
    (60, 52),
    "LIGHTLEAK / OPTICAL LABORATORY",
    font=mono,
    fill=(247, 247, 244, 175),
)
draw.text((54, 84), "Lightleak", font=serif, fill=(247, 247, 244, 255))
draw.text(
    (62, 182),
    "A virtual optical bench.",
    font=sans,
    fill=(247, 247, 244, 205),
)

og.convert("RGB").save(
    PUBLIC / "og-image.jpg", quality=90, optimize=True, progressive=True
)

print("brand-mark.png", (SRC_ASSETS / "brand-mark.png").stat().st_size)
print("favicon.ico", (PUBLIC / "favicon.ico").stat().st_size)
print("og-image.jpg", (PUBLIC / "og-image.jpg").stat().st_size)
