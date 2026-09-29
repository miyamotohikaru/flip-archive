/**
 * CASE の版（カードの絵）を画像生成でつくる。
 *
 *   GEMINI_API_KEY=... node tools/gen-plate.mjs 01
 *
 * 《変容前》をまず一枚起こし、その絵を渡して《実行後》へ編集させる。
 * 二枚を別々に起こすと色も光も揃わないので、必ず一枚目を種にする。
 * 出力: tools/plates-src/<id>-{before,after}.png（原寸の原本）
 *        public/plates/<id>-{before,after}.webp（版に載せる軽い方・要 tools/shrink-plate.py）
 */
import { GoogleGenAI } from "@google/genai";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MODEL = "gemini-3.1-flash-image-preview";

/** 図鑑じゅうで共通の見え方。ここを揃えないと版が並ばない。 */
const STYLE = `A relief built from voxel blocks on a flat board, seen STRAIGHT ON.

THE VIEW: the camera looks square at the board, dead centre, orthographic. No tilt, no isometric, no perspective skew — horizontals stay horizontal, verticals stay vertical. At a glance it reads as a flat graphic panel.

THE DEPTH: but every element is a solid block standing out from the board toward the camera, each at a different height. You catch only thin slivers of their top and side faces around their edges. Soft shadows fall down and slightly to the right — onto the board and onto the lower blocks — and that is what makes the depth read. Turn it sideways and it would obviously be three-dimensional.

DENSE: pack the board with many blocks of different sizes and heights, tightly fitted like a well-built LEGO panel. Small details everywhere, little gaps, a rich busy surface.

BACKGROUND: the board is plain flat WHITE (#ffffff) and fills the whole frame edge to edge. Nothing outside it, no vignette, no gradient.

SHADING: flat graphic tones. Each block face is one flat colour, its thin side slivers a step darker. Hard clean edges.

PALETTE: bold graphic colours — vermilion red, sunny yellow, grass green, sky blue, warm sand, dark charcoal grey, light grey.

COMPOSITION: upright portrait, the build filling the board with a small even margin.

No text, no letters, no Japanese characters, no logos, no watermark.`;

const PLATES = {
  "01": {
    before: `${STYLE}

Subject, laid out as a flat elevation of a tiny Japanese tea house: a band of charcoal roof blocks across the top, standing out the furthest. Below it, red-brown post blocks and yellow wall panels at a middle height. In the centre of the wall a WIDE, TALL opening — a full-height doorway where the blocks are removed and the white board shows through, with pale sand tatami blocks set low inside it. A small blocky person stands UPRIGHT in front of that opening. Along the bottom, a row of round grey stepping-stone blocks and a few green tree blocks, all at low heights.

Every piece is a block of its own height, casting a soft shadow down-right onto what is behind it.`,
    after: `Keep EXACTLY the same toy block model: same camera angle, same lighting, same shadow, same colours, same backdrop, same style and the same base plinth.

Change ONLY these things:
1. The tall doorway is filled in with wall blocks, flush with the rest of the wall, leaving only a TINY LOW SQUARE HOLE at the very bottom — two or three blocks high, where the white board still shows through. Small enough that a person must get down on hands and knees to pass through.
2. The small blocky person is now CROUCHED LOW in front of that hole, folded down on hands and knees, back level, head lowered toward the hole, clearly about to crawl through. Deliberate and balanced, NOT fallen over.
3. Behind the hole, exactly TWO tatami blocks remain visible instead of a wide floor.
4. Keep every other block exactly where it is, at the same height, with the same shadows.
5. The roof band stays exactly as it is.

Everything else stays identical: the SAME straight-on orthographic view, the same white board, the same palette, the same flat shading, the same block heights and the same soft down-right shadows.
Keep the hanging scroll and every other surface BLANK — do not add any text, letters or Japanese characters anywhere.`,
  },
};

async function image(ai, parts) {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts }],
    config: {
      responseModalities: ["image", "text"],
      // 版は 1:1.38 の縦。既定は横長なので、縦で起こさせる。
      imageConfig: { aspectRatio: "3:4" },
    },
  });
  const out = res.candidates?.[0]?.content?.parts || [];
  const img = out.find((p) => p.inlineData?.data);
  if (!img) {
    const said = out.map((p) => p.text).filter(Boolean).join(" / ");
    throw new Error(`画像が返らなかった: ${said || "(返答なし)"}`);
  }
  return Buffer.from(img.inlineData.data, "base64");
}

const id = process.argv[2] || "01";
const plate = PLATES[id];
if (!plate) throw new Error(`${id} の指定がない`);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY がない");
const ai = new GoogleGenAI({ apiKey });

const dir = join(ROOT, "tools", "plates-src");
mkdirSync(dir, { recursive: true });

console.log(`[${id}] 変容前を起こす…`);
const before = await image(ai, [{ text: plate.before }]);
writeFileSync(join(dir, `${id}-before.png`), before);
console.log(`[${id}] → ${id}-before.png (${before.length} bytes)`);

console.log(`[${id}] その絵を種に、実行後へ…`);
const after = await image(ai, [
  { inlineData: { mimeType: "image/png", data: before.toString("base64") } },
  { text: plate.after },
]);
writeFileSync(join(dir, `${id}-after.png`), after);
console.log(`[${id}] → ${id}-after.png (${after.length} bytes)`);
console.log("次: python3 tools/shrink-plate.py " + id);
