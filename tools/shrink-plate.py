#!/usr/bin/env python3
"""原本のPNGから板の地を抜いて、版に載せる軽いWebPにする。

    python3 tools/shrink-plate.py 01

地を抜いて透過にする。**隣の画素との差**で広げる塗りつぶしなので、
紙の上のなだらかな影も最後まで追えて、切り紙の硬い縁で止まる。
版の紙がそのまま地になり、背景は完全に白になる。
"""
import hashlib
import json
import os
import re
import sys

import numpy as np
from PIL import Image, ImageFilter

ID = sys.argv[1] if len(sys.argv) > 1 else "01"
VERSION_TS = "src/webgl/plateArtVersion.ts"

def peel(img):
    """縁からつながっている地を抜く。

    しきい値を「種の色との差」で測ると、紙の上に落ちた影のところで切れて
    ぎざつく。ここでは**隣の画素との差**で広げるので、なだらかな影は最後まで
    追えて、切り紙の硬い縁でぴたりと止まる。
    """
    from collections import deque

    a = np.asarray(img).astype(np.int16)
    h, w, _ = a.shape
    seen = np.zeros((h, w), dtype=bool)
    q = deque()

    for x in range(w):
        for y in (0, h - 1):
            if not seen[y, x]:
                seen[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if not seen[y, x]:
                seen[y, x] = True
                q.append((y, x))

    tol = 6  # 隣の画素とこれだけ違ってよい
    while q:
        y, x = q.popleft()
        c = a[y, x]
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not seen[ny, nx]:
                if int(np.abs(a[ny, nx] - c).max()) <= tol:
                    seen[ny, nx] = True
                    q.append((ny, nx))
    return seen


# 二枚は溶かし合わせるので、**同じ枠で切る**。別々に切ると、
# 変容前と実行後で組みの位置がずれる。
cut = {}
boxes = []
for name in (f"{ID}-before", f"{ID}-after"):
    src = Image.open(f"tools/plates-src/{name}.png").convert("RGB")
    w = 760
    src = src.resize((w, round(w * src.height / src.width)), Image.LANCZOS)

    bg = peel(src)
    alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8), "L")
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.7))
    alpha = alpha.point(lambda v: 0 if v < 90 else min(255, int((v - 90) * 255 / 130)))

    out = src.convert("RGBA")
    out.putalpha(alpha)
    cut[name] = out
    boxes.append(Image.fromarray(np.array(alpha)).getbbox())

box = (min(b[0] for b in boxes), min(b[1] for b in boxes),
       max(b[2] for b in boxes), max(b[3] for b in boxes))

# 二枚の枠は同じだが、そのぶん《変容前》の中身が枠の中で片寄る
# （《実行後》のほうが人の姿で右へ張り出すため）。版に出るのはまず変容前なので、
# **変容前の中身が真ん中に来るように**、二枚へ同じだけ透明を足す。
ref = np.asarray(cut[f"{ID}-before"].crop(box).split()[-1])
rys, rxs = np.nonzero(ref > 8)
bw, bh = box[2] - box[0], box[3] - box[1]
cx, cy = (rxs.min() + rxs.max()) / 2, (rys.min() + rys.max()) / 2
padL = int(round(max(0, (bw / 2 - cx) * 2)))
padR = int(round(max(0, (cx - bw / 2) * 2)))
padT = int(round(max(0, (bh / 2 - cy) * 2)))
padB = int(round(max(0, (cy - bh / 2) * 2)))
print("変容前の中心", round(cx), round(cy), "／枠", bw, bh, "／足す L,R,T,B =", padL, padR, padT, padB)

for name, img in cut.items():
    out = img.crop(box)
    pad = Image.new("RGBA", (out.width + padL + padR, out.height + padT + padB), (255, 255, 255, 0))
    pad.paste(out, (padL, padT))
    out = pad
    edge = 6
    framed = Image.new("RGBA", (out.width + edge * 2, out.height + edge * 2), (255, 255, 255, 0))
    framed.paste(out, (edge, edge))
    path = f"public/plates/{name}.webp"
    framed.save(path, "WEBP", quality=92, method=6)
    print(name, framed.size, os.path.getsize(path), "bytes")


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
