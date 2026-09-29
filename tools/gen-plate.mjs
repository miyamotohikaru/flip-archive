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
const STYLE = `A layered cut-paper relief — every shape is cut from coloured paper and stacked, the way a papercraft or a laser-cut card is built up.

THE MATERIAL — this is the key. Matte coloured card stock with a faint paper fibre. Every piece is a flat sheet that has been CUT OUT, and along every cut edge you see the THICKNESS OF THE PAPER: a thin pale cream core line running around the shape, the way cut cardstock shows its core. Where a piece stands taller it is several sheets glued together, and at the edge you can COUNT THE SHEETS — a little stack of fine lines, like the edge of plywood or a stack of paper.

THE STACK — pieces sit ON TOP of one another, three to five sheets deep in places. Each layer casts a soft shadow onto the layer beneath and onto the page. Nothing is flush; every piece reads as a separate cut sheet laid over the one below. The whole build sits proud of the page and casts one larger soft shadow around itself.

THE VIEW: a real camera with a normal lens, aimed square at the CENTRE of the build. Horizontals stay horizontal, verticals stay vertical — at a glance it reads as a flat graphic panel. But it is a photograph of a real paper object: pieces toward the edges of the frame clearly reveal their stacked paper edges, so you can see how many sheets thick each one is.

LIGHT: one soft light from the upper left, like a big window. Gentle, no harsh speculars, no gloss — paper is matte.

BACKGROUND: plain flat WHITE (#ffffff), edge to edge. **Do NOT draw a board, panel, plaque, card, tray, frame or backing of any kind** — no rectangle behind the build, no edge, no shadow around a panel. The empty white IS the page the paper is stacked on.

SHAPES: simple, blocky, graphic — the shapes of pixel art, but cut from paper.

PALETTE: bold graphic colours in matte paper — vermilion red, sunny yellow, grass green, sky blue, warm sand, charcoal grey, light grey.

DENSE: many cut pieces of different sizes stacked at many different heights, with small gaps between them. Small details everywhere.

COMPOSITION: upright portrait, the build centred with a small even margin of empty white around it.

No text, no letters, no Japanese characters, no logos, no watermark.`;

const PLATES = {
  "01": {
    before: `${STYLE}

Subject, laid out as a flat elevation of a tiny Japanese tea house: a band of charcoal roof blocks across the top, standing out the furthest. Below it, red-brown post blocks and yellow wall panels at a middle height. In the centre of the wall a WIDE, TALL opening — a full-height doorway where the blocks are removed and the white board shows through, with pale sand tatami blocks set low inside it. A small blocky person stands UPRIGHT in front of that opening. Along the bottom, a row of round grey stepping-stone blocks and a few green tree blocks, all at low heights.

Build it in clear paper layers: the wall panels lowest, the posts and beams cut and laid on top of them, the roof cut and laid on top of that, standing highest of all — several sheets thick, its stacked edges visible. The person is a separate little cut figure standing on the boards, well above them. Every piece shows its pale cut edge and casts its own soft shadow onto the sheet beneath. The stack must be obvious.`,
    after: `Keep EXACTLY the same toy block model: same camera angle, same lighting, same shadow, same colours, same backdrop, same style and the same base plinth.

Change ONLY these things:
1. The tall doorway is filled in with cut paper wall pieces, stacked like the rest of the wall, leaving only a TINY LOW SQUARE HOLE at the very bottom — two or three blocks high, where the white board still shows through. Small enough that a person must get down on hands and knees to pass through.
2. The small cut-paper person is now CROUCHED LOW in front of that hole, folded down on hands and knees, back level, head lowered toward the hole, clearly about to crawl through. Deliberate and balanced, NOT fallen over.
3. Behind the hole, exactly TWO tatami pieces remain visible instead of a wide floor.
4. Keep every other piece exactly where it is, at the same height, with the same cut edges and shadows.
5. The roof stays exactly as it is.

Everything else stays identical: the SAME straight-on view, the same white page, the same matte paper material with visible cut edges, the same palette, the same stacked layers and the same long soft down-right shadows.
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
