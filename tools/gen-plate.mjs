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
const STYLE = `A flat 2D picture plane that has been tilted into 3D, with everything drawn on it pushed out into solid blocks — the look of an old side-scrolling game screen turned into a diorama.

THE PLANE — this is the key. One single flat rectangular plane, seen at an angle so it reads as a parallelogram receding toward the upper left. Clean straight edges, and a thin visible thickness along its edge so it reads as a solid sheet. Its surface is a quiet flat warm off-white (#eae7e0). This plane is the screen; it fills most of the frame and is unmistakably a tilted flat sheet.

THE EXTRUSION — everything that was drawn on that screen is pushed OUT of it toward the viewer at exactly 90 degrees to the plane, becoming chunky solid voxel blocks with real depth. You can see the side faces of the blocks where they leave the plane. Nothing floats free: every block is rooted in the sheet and grows straight out of it. Deeper things stick out further.

SUBJECT LAYOUT — what is drawn on the screen is a flat SIDE-ON elevation, like a platform-game stage: a ground line running across the lower part of the sheet, and the scene standing on it, all facing the viewer square-on before the extrusion.

SHADING: flat and graphic. Each block face is one single flat tone — the face toward the viewer brightest, the side faces two clearly darker steps. Hard clean edges, no gradients, no blur, no cast shadow.

BACKGROUND: everything outside the tilted sheet is pure flat WHITE (#ffffff), completely empty. No floor, no shadow, no gradient. Only the sheet and the blocks growing out of it.

PALETTE: bold graphic colours — vermilion red, sunny yellow, grass green, sky blue, warm sand, dark charcoal grey, light grey. Bright and varied.

COMPOSITION: upright portrait framing, the tilted sheet centred with an even margin, nothing touching the edge of the frame.

No text, no letters, no Japanese characters, no logos, no watermark.`;

const PLATES = {
  "01": {
    before: `${STYLE}

What is drawn on the tilted sheet, as a flat side-on stage: a tiny Japanese tea house seen from the side. Its front wall has a WIDE, TALL opening — a full-height doorway a person could walk straight through standing upright. A small blocky person stands UPRIGHT on the ground line in front of that opening, facing it. Charcoal roof blocks along the top, red-brown post blocks, a line of round grey stepping-stone blocks along the ground leading to the doorway, a few small green trees standing on the ground line, pale sand-coloured tatami blocks visible through the opening.

All of it pushed out of the sheet toward the viewer at 90 degrees as solid blocks: the roof sticks out furthest, the posts and walls next, the stones and trees less. The sheet itself stays visible as the flat warm off-white background behind and between them.`,
    after: `Keep EXACTLY the same toy block model: same camera angle, same lighting, same shadow, same colours, same backdrop, same style and the same base plinth.

Change ONLY these things:
1. The tall doorway shrinks into a TINY LOW SQUARE CRAWL HOLE near the ground, only two or three cubes high — small enough that a person must get down on hands and knees to pass through. The wall above the hole is now filled in solid with wall cubes.
2. The small voxel person is now on ALL FOURS in a tidy crawling pose — knees on the stepping stone, both hands on the ground ahead, back level and horizontal, head lowered toward the tiny hole, clearly about to crawl through. Deliberate and balanced, NOT fallen over, NOT lying on its side.
3. Inside, the floor is now exactly TWO tatami mats and the room is TIGHTER and NARROWER.
4. Keep the tilted sheet exactly as it is — same angle, same size, same colour — and keep everything rooted in it.
5. The roof comes DOWN lower over the smaller room.

Everything else stays identical: the SAME tilted flat sheet at the SAME angle, the same 90-degree extrusion out of it, same palette, same flat shading, same block depths, and the same pure white empty background outside the sheet.
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
