#!/usr/bin/env python3
"""原本のPNGを、版に載せる軽いWebPに落とす。

    python3 tools/shrink-plate.py 01

絵の地は白で、版の紙とほぼ同じ。**白抜きはしない**——レリーフの落ち影は
白い板の上に落ちているので、白を抜くと影だけが灰色の染みとして残る。
版いっぱいに敷いて、絵の白がそのまま紙になるようにする。
"""
import hashlib
import json
import os
import re
import sys

from PIL import Image

ID = sys.argv[1] if len(sys.argv) > 1 else "01"
VERSION_TS = "src/webgl/plateArtVersion.ts"

for name in (f"{ID}-before", f"{ID}-after"):
    im = Image.open(f"tools/plates-src/{name}.png").convert("RGB")
    w = 760
    im = im.resize((w, round(w * im.height / im.width)), Image.LANCZOS)
    path = f"public/plates/{name}.webp"
    im.save(path, "WEBP", quality=90, method=6)
    print(name, im.size, os.path.getsize(path), "bytes")


# 絵を差し替えてもURLが同じだと、ブラウザが古い絵を返し続ける。
# 中身から版番号を作り、読み込み側がクエリに付けられるようにする。
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
