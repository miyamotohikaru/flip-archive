#!/usr/bin/env python3
"""原本のPNGから板の地を抜いて、版に載せる軽いWebPにする。

    python3 tools/shrink-plate.py 01

地はまっ白とはかぎらない（#f6f6f6 くらいで返ってくる）。決め打ちの
しきい値ではなく、**四隅の実際の色**を種にして、縁からつながっている
ぶんだけを塗りつぶしで抜く。レリーフの落ち影は地より暗いので残り、
版の紙の上にそのまま落ちる。
"""
import hashlib
import json
import os
import re
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ID = sys.argv[1] if len(sys.argv) > 1 else "01"
KEY = (255, 0, 255)  # 塗りつぶしの目印。絵には出てこない色。
VERSION_TS = "src/webgl/plateArtVersion.ts"

for name in (f"{ID}-before", f"{ID}-after"):
    src = Image.open(f"tools/plates-src/{name}.png").convert("RGB")

    # 地の色は四隅から取る（まっ白とはかぎらない）
    corners = [src.getpixel(p) for p in
               ((2, 2), (src.width - 3, 2), (2, src.height - 3), (src.width - 3, src.height - 3))]
    ground = tuple(int(np.median([c[i] for c in corners])) for i in range(3))

    pad = 3
    canvas = Image.new("RGB", (src.width + pad * 2, src.height + pad * 2), ground)
    canvas.paste(src, (pad, pad))
    # 影は地より十分暗いので、しきい値は狭くてよい
    ImageDraw.floodfill(canvas, (0, 0), KEY, thresh=10)

    arr = np.asarray(canvas)
    bg = np.all(arr == np.array(KEY, dtype=np.uint8), axis=-1)

    alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8), "L")
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.8))
    alpha = alpha.point(lambda v: 0 if v < 70 else min(255, int((v - 70) * 255 / 150)))

    out = canvas.convert("RGBA")
    out.putalpha(alpha)
    px = np.array(out)
    hit = np.all(px[:, :, :3] == np.array(KEY, dtype=np.uint8), axis=-1)
    px[hit, :3] = ground  # 半透明の縁に目印の色が出ないように
    out = Image.fromarray(px, "RGBA").crop(Image.fromarray(np.array(alpha)).getbbox())

    # 縁を完全な透明で囲う（版の側で端の画素が引き伸ばされるのを防ぐ）
    edge = 6
    framed = Image.new("RGBA", (out.width + edge * 2, out.height + edge * 2), (255, 255, 255, 0))
    framed.paste(out, (edge, edge))
    out = framed

    w = 760
    out = out.resize((w, round(w * out.height / out.width)), Image.LANCZOS)
    path = f"public/plates/{name}.webp"
    out.save(path, "WEBP", quality=90, method=6)
    print(name, "地", ground, out.size, os.path.getsize(path), "bytes")


# 絵を差し替えてもURLが同じだと、ブラウザが古い絵を返し続ける。
digest = hashlib.sha1()
for name in (f"{ID}-before", f"{ID}-after"):
    with open(f"public/plates/{name}.webp", "rb") as f:
        digest.update(f.read())
stamp = digest.hexdigest()[:10]

versions = {}
if os.path.exists(VERSION_TS):
    found = re.search(r"= (\{.*?\}) as const;", open(VERSION_TS, encoding="utf-8").read(), re.S)
    if found:
        versions = json.loads(found.group(1).replace("'", '"'))
versions[ID] = stamp

body = json.dumps(versions, ensure_ascii=False, indent=2, sort_keys=True)
with open(VERSION_TS, "w", encoding="utf-8") as f:
    f.write(
        "// tools/shrink-plate.py が書き出す。直接いじらない。\n"
        "// 絵の中身から作った版番号。URLに付けて、古い絵が居座るのを防ぐ。\n"
        f"export const PLATE_ART_VERSION: Record<string, string> = {body} as const;\n"
    )
print("版番号", ID, stamp, "→", VERSION_TS)
