#!/usr/bin/env python3
"""原本のPNGから板の地を抜いて、版に載せる軽いWebPにする。

    python3 tools/shrink-plate.py 01

**白抜きはしない。** 紙の上に落ちた影の縁で切れてぎざつくため。
かわりに四隅から地の色を測り、そこが255になるように全体を持ち上げる。
地が版の紙と同じ白になるので、そのまま敷いても継ぎ目が出ない。
影は地より暗いぶんだけ残る。
"""
import hashlib
import json
import os
import re
import sys

import numpy as np
from PIL import Image

ID = sys.argv[1] if len(sys.argv) > 1 else "01"
VERSION_TS = "src/webgl/plateArtVersion.ts"

for name in (f"{ID}-before", f"{ID}-after"):
    src = Image.open(f"tools/plates-src/{name}.png").convert("RGB")

    # 地の色は四隅から取る（まっ白とはかぎらない）
    corners = [src.getpixel(p) for p in
               ((2, 2), (src.width - 3, 2), (2, src.height - 3), (src.width - 3, src.height - 3))]
    ground = tuple(int(np.median([c[i] for c in corners])) for i in range(3))

    # 抜かずに、地を版の紙と同じ白へ合わせる。
    # 抜こうとすると、紙の上に落ちた影の縁で切れてぎざつく（実際に出た）。
    gain = 255.0 / max(1, int(np.mean(ground)))
    arr = np.asarray(src).astype(np.float32) * gain
    out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")

    w = 760
    out = out.resize((w, round(w * out.height / out.width)), Image.LANCZOS)
    path = f"public/plates/{name}.webp"
    out.save(path, "WEBP", quality=92, method=6)
    print(name, "地", ground, "→白", out.size, os.path.getsize(path), "bytes")


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
