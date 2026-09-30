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
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

PALETTE: __PALETTE__

DENSE: many cut pieces of different sizes stacked at many different heights, with small gaps between them. Small details everywhere.

COMPOSITION: upright portrait, the build centred with a small even margin of empty white around it.

No text, no letters, no Japanese characters, no logos, no watermark.`;


/** CASEごとの色。7枚が並んだときに飽きないよう、それぞれ別の気分にする。 */
const PALETTES = {
  "01": "earthy and warm — charcoal black, vermilion brown, deep ochre yellow, moss green, sand, stone grey. Quiet and old.",
  "02": "a warm gallery — deep forest green for the wall, cream and bone for the frames, soft black, warm grey, and antique brass. The urinal alone is bright glazed white, so it jumps out of the green.",
  "03": "a chalkboard wall in deep indigo violet — a dark blue-purple, definitely not green — with the printed parts in warm cream and soft grey. When writing appears it is in powdery chalk pastels: coral, mint, lemon, sky, lilac, white. Light and dusty against the indigo.",
  "04": "paper in metal-ish colours, never actual metal — mustard, warm grey, terracotta, deep navy, bone, sage, with ONE strong signal red for the car. Flat matte card throughout.",
  "05": "the palette of an old screen — pure saturated primaries: red, blue, green, yellow, magenta, cyan, plus pure white and pure black. Bright and blocky, many colours at once.",
  "06": "soft and sombre with one gold — warm charcoal, dove grey, bone white, a dusty rose for the picture, and a warm gold for the frame. The gold does all the work.",
  "07": "map colours — mint green blocks, pale aqua, warm pale grey roads, soft butter yellow, and coral for the markers. Light, open, a little sunny.",
};

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

  "02": {
    before: `${STYLE}

Subject, seen SQUARE ON — everything faces the camera flat, no tilt, no perspective, no vanishing point; all edges stay horizontal and vertical.
**There is NO wall panel and NO background board.** The bare white page IS the gallery wall. Nothing large and rectangular sits behind the objects — the silhouette of the whole build must be ragged and open, never a filled rectangle.

Across the upper half, a horizontal ROW OF FIVE EMPTY PICTURE FRAMES hangs directly on the white, all about the same size, evenly spaced. The row is COMPLETE and sits well INSIDE the picture: there is a clear band of empty white to the left of the first frame and to the right of the last one, and no frame is cut off by the edge of the image. Each frame is cut from card and stacked to a DIFFERENT thickness — some three sheets, some seven — so the row steps up and down. Each frame is a hollow rectangle of moulding: you see the white page through the middle. Their mouldings are cream, bone, warm grey and antique brass, each with several stepped inner lips like a real frame profile. ONE place in the row is empty — a plain gap with nothing in it.

Below the row, off to the right and clearly apart from it, stands ONE WHITE PORCELAIN URINAL on a low cream plinth — the wall-hung kind found in a gents' lavatory. It is the biggest single object in the picture, as tall as half the build, and it must be INSTANTLY RECOGNISABLE. Build it as exactly FOUR flat cut pieces, no more, so it stays clean and legible:
1. THE BODY — one bone-white silhouette: a tall upright oval, WIDE and softly rounded across the top, narrowing gently down the sides, and closing in a rounded U at the bottom. Symmetrical left to right. Cut from six stacked sheets, its cut edge a clean countable stack all the way round. It is a simple solid shape — NOT a spiral, NOT a coil, NOT concentric rings, NOT a swirl.
2. THE RIM — one slightly smaller piece of the same shape laid on top of the body, two sheets thick, leaving an even bone-white border of body showing all the way around it. This is the raised lip.
3. THE BASIN — one smaller piece of the same shape again, in a pale warm grey, laid inside the rim and sitting LOWER than it, so the middle reads as hollowed out.
4. THE DRAIN — one small dark grey oval low in the basin.
Above the body, a short straight cream pipe goes up from the centre of the top edge, with a small collar near its end.

Place two small dull fittings — a pipe collar and a tap — low and to the left, one or two sheets thick each, so they sit far below the urinal. Nothing else.`,
    after: `Keep the light, the shadows and the bare white page exactly as they are, and keep the SAME white urinal — the same four clean cut pieces, the same care in the detail, and above all THE SAME SIZE. It must stay the biggest object in the picture; do not shrink it.
Change ONLY these:
1. The urinal is LAID ON ITS BACK — rotated exactly a quarter turn clockwise, so its wide rounded top points LEFT and its rounded foot points RIGHT. It stays perfectly level: nothing tilted on a slant.
2. It has been RAISED UP into the row of frames and now fills the empty gap there, resting on its cream plinth, taking the place a picture would have had. Because it is large, the frames on either side of it shift outward to make room, and the row now steps around it.
3. A small blank cream label card is fixed on the white just below it.
4. The frames are no longer empty — each holds a small flat collage of muted colour.
The row of frames stays complete and well inside the picture, with empty white at both ends; no frame is cut off by the edge.
Remove the pipe collar and the tap. Still NO wall panel and NO background board — the white page stays bare behind everything.`,
  },
  "03": {
    before: `${STYLE}

Subject, seen SQUARE ON, flat, no tilt and no perspective.
Down the middle of the page run ten identical ROWS, stacked one above the other like the lines of a form. Each row is built as its own thick object standing on the white page:
— on the left, the printed opening phrase: a small deep INDIGO VIOLET bar (a dark blue-purple, no green in it), built from FIVE OR SIX stacked sheets so it stands up as a chunky block with its layers countable along the cut edge;
— to its right, the blank to be filled: a long cream tray, three sheets thick, with a hairline rule along its lower edge and NOTHING written on it.
The rows are the ONLY things in the picture. **There is NO wall panel, NO board and NO backing rectangle behind them** — the bare white page shows between and around every row, so the silhouette of the whole build is a ragged stack of separate bars, never one filled rectangle.
Give the rows clearly different lengths so the right-hand edge steps in and out, and vary their heights so some blocks sit noticeably taller than their neighbours. Every blank is completely empty — no writing, no marks, no colour.`,
    after: `Keep the rows identical: same indigo blocks, same cream trays, same positions, same heights, same style and light, same bare white page with no panel behind them.
Change ONLY this: most of the cream trays are now covered by HANDWRITING — long thin wavy strips of card cut like a line of cursive script, with loops and gaps, lying along the tray. Each one is a different powdery chalk colour — coral, mint, lemon, sky, lilac, white — and a different length: some trail off after a couple of words, some run the whole tray. Each is only one or two sheets thick, so the writing stays much lower than the indigo blocks.
Three or four trays are still empty.
The writing is ABSTRACT SCRIBBLE, not language: no readable letters, no words, no alphabet, no numbers — just the rise and fall of a hand moving along the line.
Do NOT add arrows, boxes, books, frames, labels, a background panel or any other straight-edged shape — only the wavy written lines.`,
  },
  "04": {
    before: `${STYLE}

Subject, flat and straight on: one small car in the middle, seen from the side, CUT FROM MATTE CARD and stacked five or six sheets thick so it is the tallest thing in the picture. Around it, eleven keys, each CUT FROM MATTE CARD as a flat silhouette — a ring at one end, a toothed blade at the other — in different paper colours, stacked at clearly different thicknesses, some thin, some thick. They are paper keys: no metal, no gloss, no shine, no photographic detail.
SPREAD THEM RIGHT OUT. The keys reach into all four corners of the composition and use the whole of it — none of them huddle around the car, and there is a generous, even breath of empty white between every key and its neighbours. Lay them at many different angles: some upright, some lying flat, some on the diagonal. The car sits alone in a clear opening at the centre with nothing touching it. Exactly ONE key is joined to the car by a single line. All the other keys are joined to nothing.`,
    after: `Keep every key exactly where it is, same colours, same style, same light.
Change ONLY these:
1. EVERY key is now joined to the car by its own STRIP OF PAPER — a thin flat cut ribbon, not a wire or a cable — so the strips converge on the car from all around.
2. The car has MOVED to a different place on the board, and a dashed outline marks where it used to be.`,
  },
  "05": {
    before: `${STYLE}

Subject, flat and straight on: a large empty grid of square cells, fourteen by fourteen, cut from paper so the grid lines stand proud and the cells sit low. Only ONE cell is filled, with a single bright colour. Below the grid, a thin horizontal bar marks a waiting time, mostly empty.`,
    after: `Keep the grid exactly the same size and position, same style and light.
Change ONLY these:
1. Most of the cells are now FILLED with many colours, forming several distinct patches of pattern side by side.
2. A few cells are half-overwritten, showing a lower layer underneath.
3. Bold lines run along the borders where neighbouring patches meet.
4. The waiting bar below is now partly filled.`,
  },
  "06": {
    before: `${STYLE}

Subject, flat and straight on: ONE framed picture, whole and intact, hanging at the centre.
Draw the frame with real care: a wide gold moulding built from six or seven stacked sheets so it stands well proud, its profile stepping down in three or four distinct ledges from the outer edge to the picture, each ledge a slightly different gold — pale, warm, deep — and the stack countable along every cut edge. Inside it a thin bone slip, then the picture: a low flat collage of dusty rose, warm charcoal and dove grey, only one or two sheets thick, so the frame clearly rides above it.
Around and behind the frame, a loose drift of plain rectangles in charcoal, grey and bone — like other canvases stacked against a wall — at many different thicknesses and many different sizes, some tall, some small, reaching out past the frame on every side so the outline of the whole build is RAGGED. **No single large panel or board behind everything** — the bare white page shows through the gaps.
Below the frame, a long row of narrow upright bars of different heights and thicknesses, like a record of prices, each its own cut piece with a clear gap beside it.`,
    after: `Keep the frame, the drift of rectangles, the row of bars and the upper half of the picture identical — same style, same light, same shadows.
Change ONLY these:
1. The LOWER HALF of the picture has become a row of narrow vertical strips hanging down out of the bottom edge of the frame, at slightly different lengths, as if it had been shredded. The strips keep the colours of the part of the picture they came from, and a few hang below the frame onto the white page.
2. One of the bars below is now much taller and thicker than all the others.`,
  },
  "07": {
    before: `${STYLE}

Subject, flat and straight on, seen from directly above: a simple city street grid: FIVE wide straight roads running down and SIX running across, crossing at right angles. The roads are WIDE, EMPTY and pale, and they sit LOW. Between them sit large plain blocks of a single quiet colour each, cut from paper and stacked so they stand well proud of the roads. Keep it simple and open — few colours, plenty of empty road, the grid must read clearly at a glance. A line of small markers runs across the grid from one corner to the opposite one, taking the shortest way along the roads.`,
    after: `Keep the streets and blocks exactly the same, same style and light.
Change ONLY these:
1. Small bright round markers and small square markers are now scattered across the grid at many places along the roads.
2. The line of markers no longer runs straight — it wanders and detours to pass by them.`,
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

const palette = PALETTES[id] || PALETTES["01"];
console.log(`[${id}] 変容前を起こす…`);
// 《実行後》だけ描き直したいときは --after で、置いてある《変容前》を種にする
const afterOnly = process.argv.includes("--after");
const before = afterOnly
  ? readFileSync(join(dir, `${id}-before.png`))
  : await image(ai, [{ text: plate.before.replace("__PALETTE__", palette) }]);
if (afterOnly) {
  console.log(`[${id}] 《変容前》は置いてあるものを使う`);
} else {
  writeFileSync(join(dir, `${id}-before.png`), before);
  console.log(`[${id}] → ${id}-before.png (${before.length} bytes)`);
}

console.log(`[${id}] その絵を種に、実行後へ…`);
const after = await image(ai, [
  { inlineData: { mimeType: "image/png", data: before.toString("base64") } },
  { text: plate.after.replace("__PALETTE__", palette) },
]);
writeFileSync(join(dir, `${id}-after.png`), after);
console.log(`[${id}] → ${id}-after.png (${after.length} bytes)`);
console.log("次: python3 tools/shrink-plate.py " + id);
