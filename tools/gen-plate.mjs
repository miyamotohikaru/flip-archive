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
const STYLE = `A cute miniature diorama built entirely from small glossy plastic toy building blocks — voxel cubes, like nanoblock or LEGO micro build. Photographed as a real physical model: soft studio lighting from the upper left, a gentle soft drop shadow on the surface, shallow depth of field.
Plain flat warm off-white backdrop (#eae7e0), nothing else in the frame.
Playful varied palette: warm brick red, mustard yellow, teal, sage green, cream, soft warm grey, a touch of orange. Slightly busy and richly detailed — many small cubes, hand-built block-toy feel.
Three-quarter isometric view, the whole model centered with comfortable margin on all sides. Upright portrait composition.
Absolutely NO text anywhere: no letters, no Japanese characters, no writing on scrolls or signs, no logos, no watermark, no human photograph. Clean, crisp, high detail.`;

const PLATES = {
  "01": {
    before: `${STYLE}

Subject: a tiny Japanese tea house (chashitsu), built from toy blocks, shown as a cutaway so the inside is visible from the side.
Right now it has a WIDE and TALL doorway — a full-height opening that a person could walk straight through standing upright. Above the doorway the wall is open and airy. The roof sits HIGH.
A small blocky toy figure stands UPRIGHT in front of the doorway, facing it, about to walk in without bending.
Inside, a roomy floor covered with several pale straw-coloured tatami blocks. A short path of round stepping stones leads across the base toward the doorway. Wooden posts, a small tiled roof, a low block base like a display plinth under the whole model.`,
    after: `Keep EXACTLY the same toy block model: same camera angle, same lighting, same shadow, same colours, same backdrop, same style and the same base plinth.

Change ONLY these things:
1. The doorway shrinks into a TINY LOW SQUARE CRAWL HOLE near the ground, about knee height — small enough that a person must get down on hands and knees to pass through. The wall above the hole is now filled in solid with blocks.
2. The small toy figure is now on ALL FOURS in a tidy crawling pose — knees on the stepping stone, both hands on the ground in front, back level, head lowered toward the tiny hole, clearly about to crawl through it. It must look deliberate and balanced, NOT fallen over, NOT lying on its side.
3. Inside, the floor is now exactly TWO tatami mats and the room is TIGHTER and NARROWER.
4. The roof comes DOWN lower over the smaller room.

Everything else stays identical. Same palette, same block style, same soft studio light.
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
