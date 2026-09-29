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

THE VIEW: a real camera with a normal lens, aimed square at the CENTRE of the board. Horizontals stay horizontal, verticals stay vertical — at a glance it reads as a flat graphic panel. But it is a real photograph, not an orthographic drawing: pieces near the centre are seen face-on, while pieces toward the edges clearly reveal their THICK SIDE FACES. That mild perspective is what shows how far each piece stands out.

THE DEPTH — make this strong. Every element is a CHUNKY SOLID standing far out from the board toward the camera, each at a clearly different height, like a deep bas-relief you could grip.

Rough depths: the roof band stands out the furthest, roughly a third of its own height; the posts and beams stand out about half that; the wall panels are set back behind them; the doorway is a deep recess; the person is a fully rounded figure standing well proud of the wall, with obvious thickness front to back; the trees and stones are fat lumps.

You must SEE the side faces — thick slabs of colour along every edge, not thin slivers. Long soft shadows fall down and to the right onto the board and onto the pieces behind, long enough to read how far each piece projects. Turn it sideways and it would obviously be a deep three-dimensional build.

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

Every piece is a chunky solid of its own depth, standing well out from the board, showing its thick side faces and casting a long soft shadow down-right onto what is behind it. The person in particular must read as a rounded solid figure, not a flat cut-out.`,
    after: `Keep EXACTLY the same toy block model: same camera angle, same lighting, same shadow, same colours, same backdrop, same style and the same base plinth.

Change ONLY these things:
1. The tall doorway is filled in with wall blocks, flush with the rest of the wall, leaving only a TINY LOW SQUARE HOLE at the very bottom — two or three blocks high, where the white board still shows through. Small enough that a person must get down on hands and knees to pass through.
2. The small blocky person is now CROUCHED LOW in front of that hole, folded down on hands and knees, back level, head lowered toward the hole, clearly about to crawl through. Deliberate and balanced, NOT fallen over.
3. Behind the hole, exactly TWO tatami blocks remain visible instead of a wide floor.
4. Keep every other block exactly where it is, at the same height, with the same shadows.
5. The roof band stays exactly as it is.

Everything else stays identical: the SAME straight-on view, the same white board, the same palette, the same shading, the same deep block projections and the same long soft down-right shadows.
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
