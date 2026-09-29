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
const STYLE = `A crisp isometric VOXEL illustration — a little world built entirely from perfectly square 3D pixel cubes, in the style of voxel art (MagicaVoxel / 3D pixel art).

NOT a photograph. NOT plastic toy bricks: no studs, no glossy plastic, no bevelled edges, no depth of field, no reflections.

SHADING: flat and graphic. Every cube face is one single flat tone — the top face brightest, the two visible side faces two clearly darker steps of the same hue. Hard clean edges between faces. No soft gradients, no blur, no ambient occlusion, no cast shadow on the ground.

THE PAGE IS THE FLOOR. Pure flat WHITE (#ffffff) everywhere, and that white IS the ground the objects stand on. So: NO base plate, NO ground slab, NO platform, NO island, NO grass tile, NO visible edge of ground anywhere. Do not build the scene on top of a block of earth. Every object — the building, the trees, the stones, the person — rests DIRECTLY on that invisible flat floor, feet and trunks and bases meeting it cleanly, all standing on one shared ground plane so the eye reads a floor. No shadow, no gradient, no vignette, nothing else in the frame.

PALETTE: bold graphic colours — vermilion red, sunny yellow, grass green, sky blue, warm sand, dark charcoal grey, light grey, and a few pure white cubes. Bright and varied, many colours at once.

CAMERA: a STEEP high-angle three-quarter view looking DOWN at about 65–70 degrees, with real PERSPECTIVE — a moderately wide lens (around 35mm), NOT an orthographic isometric. Near edges are clearly larger than far edges, vertical lines converge, and the depth is obvious and a little dramatic. The floor plane faces the viewer almost square-on and the building RISES OUT of it toward the camera; the roof's top surface is broad, the walls are strongly foreshortened. Ground-level things — stones, tree bases, the person's feet — spread out across the floor.

VOLUME: everything must read as SOLID and chunky, with real thickness. Thick walls two or three cubes deep, a deep roof slab whose edge thickness is clearly visible, posts with square section, trees as fat blocky masses. Each cube shows its top face and two side faces so the mass is unmistakable. Make it feel like a heavy physical build, not a thin cut-out.

COMPOSITION: looking down onto that floor. The main build sits in the middle; a few small single cubes sit ON the floor around it and a few more hover just above it — loose and playful, but only blocks, nothing else. Upright portrait framing, the whole scene centred with an even margin, nothing touching the edge of the frame.

No text, no letters, no Japanese characters, no logos, no watermark.`;

const PLATES = {
  "01": {
    before: `${STYLE}

Subject: a tiny Japanese tea house (chashitsu) built from voxel cubes, cut away on one side so the inside is visible.
Right now it has a WIDE, TALL opening in the front wall — a full-height doorway a person could walk straight through standing upright.
A small voxel person stands UPRIGHT on the path in front of that opening, facing it.
Inside, a floor of pale sand-coloured tatami cubes raised one cube above the ground. A short line of round grey stepping-stone cubes lies flat on the floor, leading to the doorway. Charcoal roof cubes, red-brown post cubes that reach down and meet the floor, a few small green trees whose trunks stand on the floor.
Loose single cubes — red, yellow, blue, green — a few resting on the floor around the house, a few hovering just above it.
Remember: the white page IS the floor. No base plate, no grass tile, no island, no shadow.`,
    after: `Keep EXACTLY the same toy block model: same camera angle, same lighting, same shadow, same colours, same backdrop, same style and the same base plinth.

Change ONLY these things:
1. The tall doorway shrinks into a TINY LOW SQUARE CRAWL HOLE near the ground, only two or three cubes high — small enough that a person must get down on hands and knees to pass through. The wall above the hole is now filled in solid with wall cubes.
2. The small voxel person is now on ALL FOURS in a tidy crawling pose — knees on the stepping stone, both hands on the ground ahead, back level and horizontal, head lowered toward the tiny hole, clearly about to crawl through. Deliberate and balanced, NOT fallen over, NOT lying on its side.
3. Inside, the floor is now exactly TWO tatami mats and the room is TIGHTER and NARROWER.
4. Keep the loose cubes around the house, and keep the white page as the floor — still no base plate, no grass tile, no island, no shadow.
5. The roof comes DOWN lower over the smaller room.

Everything else stays identical: same palette, same flat voxel shading, the SAME STEEP PERSPECTIVE CAMERA looking down at about 65–70 degrees, the same chunky solid volumes, and the SAME PURE WHITE EMPTY BACKGROUND with no shadow and no ground plane.
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
