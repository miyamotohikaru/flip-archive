#!/usr/bin/env python3
"""原本のPNGを、版に載せる軽いWebPへ落とす。

    python3 tools/shrink-plate.py 01

版に出る幅はいちばん大きくても700pxほどなので、720pxで足りる。
"""
import os, sys
from PIL import Image

ID = sys.argv[1] if len(sys.argv) > 1 else "01"
for name in (f"{ID}-before", f"{ID}-after"):
    im = Image.open(f"tools/plates-src/{name}.png").convert("RGB")
    im = im.resize((720, round(720 * im.height / im.width)), Image.LANCZOS)
    out = f"public/plates/{name}.webp"
    im.save(out, "WEBP", quality=90, method=6)
    print(name, im.size, os.path.getsize(out), "bytes")
