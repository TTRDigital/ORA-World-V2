"""
Animated logo (client, 17 Nov: "have those leaves moving around a little bit"). The official lockup is never
redrawn: this cuts each leaf out of the original artwork's own pixels (the leaves are separate shapes), and writes an
SVG with the rest of the lockup as one image and every leaf as its own small image that sways gently around the point
where it meets its branch. Reduced motion keeps every leaf still.

  python3 scripts/logo-leaves.py   (needs numpy, scipy, Pillow)
"""
import base64, io, random, sys
import numpy as np
from PIL import Image
from scipy import ndimage

W = 560  # output width: covers the footer lockup (150px tall) at 2x

def b64(im: Image.Image) -> str:
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=90, alpha_quality=95, method=6)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()

def build(src: str, out: str, seed: int = 7) -> None:
    im = Image.open(src).convert("RGBA")
    H = round(im.height * W / im.width)
    im = im.resize((W, H), Image.LANCZOS)
    px = np.array(im)
    a = px[..., 3]
    tree_bottom = round(525 * W / 1200)  # the tree sits above the wordmark (rows 0-524 at 1200 wide)
    region = np.zeros_like(a, dtype=bool)
    region[:tree_bottom] = True
    solid = (a > 150) & region  # a firm threshold keeps neighbouring leaves apart
    lab, n = ndimage.label(solid, structure=np.ones((3, 3)))
    areas = ndimage.sum(np.ones_like(lab), lab, index=range(1, n + 1))
    # The ring, trunk and branches form one large shape (the roots meet the ring); everything small is a leaf or the star.
    big = [i + 1 for i, s in enumerate(areas) if s > 0.02 * W * W]
    sizes = sorted(s for i, s in enumerate(areas) if i + 1 not in big and s >= 20)
    typical = sizes[len(sizes) // 2] if sizes else 0
    # Leaves only: the star (a different, smaller shape near the centre) and specks stay with the base.
    leaf_ids = [i + 1 for i, s in enumerate(areas) if i + 1 not in big and s >= 0.55 * typical]
    # Give every faint edge pixel to its nearest shape so no halo is left behind.
    _, (iy, ix) = ndimage.distance_transform_edt(lab == 0, return_indices=True)
    owner = lab[iy, ix]
    owner[~region | (a == 0)] = 0
    trunk_dist = ndimage.distance_transform_edt(~np.isin(owner, big))

    rnd = random.Random(seed)
    base = px.copy()
    leaves = []
    for k in leaf_ids:
        m = owner == k
        ys, xs = np.nonzero(m)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        crop = px[y0:y1, x0:x1].copy()
        crop[..., 3] = np.where(m[y0:y1, x0:x1], crop[..., 3], 0)
        base[..., 3] = np.where(m, 0, base[..., 3])
        # Pivot: the leaf's point nearest the trunk (where it meets its branch).
        d = np.where(m, trunk_dist, np.inf)
        py, pxx = np.unravel_index(np.argmin(d), d.shape)
        leaves.append((x0, y0, x1 - x0, y1 - y0, pxx - x0, py - y0, Image.fromarray(crop)))

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
        "<style>",
        ".l{transform-box:view-box;animation-name:s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;animation-direction:alternate}",
        "@keyframes s{from{transform:rotate(var(--a0))}to{transform:rotate(var(--a1))}}",
        "@media (prefers-reduced-motion:reduce){.l{animation:none}}",
        "</style>",
        f'<image href="{b64(Image.fromarray(base))}" width="{W}" height="{H}"/>',
    ]
    for x, y, w, h, ox, oy, leaf in leaves:
        amp = rnd.uniform(4.5, 8.0)
        dur = rnd.uniform(2.6, 4.4)
        delay = -rnd.uniform(0, dur)
        parts.append(
            f'<image class="l" href="{b64(leaf)}" x="{x}" y="{y}" width="{w}" height="{h}" '
            f'style="transform-origin:{x + ox}px {y + oy}px;--a0:{-amp:.1f}deg;--a1:{amp * 0.6:.1f}deg;'
            f'animation-duration:{dur:.2f}s;animation-delay:{delay:.2f}s"/>'
        )
    parts.append("</svg>")
    open(out, "w").write("\n".join(parts))
    print(out, f"{len(leaves)} leaves", f"{sum(len(p) for p in parts) // 1024} KB", "areas:", sorted(int(s) for s in areas)[-6:])

if __name__ == "__main__":
    build("public/brand/ora-world-logo-gold-header.png", "public/brand/ora-world-logo-gold-header-animated.svg")
    build("public/brand/ora-world-logo-white.png", "public/brand/ora-world-logo-white-animated.svg")
