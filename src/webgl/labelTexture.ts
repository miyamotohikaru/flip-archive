import * as THREE from "three";

/**
 * 版面に刷る事例名のテクスチャ。
 *
 * 帯（three.js のメッシュ）と単票（共有レンダラ）の両方で同じ見え方にしたいので、
 * HTMLの重ね書きではなく、版そのものに焼き込む。
 */

const cache = new Map<string, THREE.CanvasTexture>();
let blank: THREE.CanvasTexture | null = null;

const FONT_STACK =
  '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Helvetica Neue", Arial, sans-serif';

/** 何も刷らないときに渡す1×1の透明テクスチャ。 */
export function blankTexture(): THREE.CanvasTexture {
  if (blank) return blank;
  const c = document.createElement("canvas");
  c.width = 1;
  c.height = 1;
  blank = new THREE.CanvasTexture(c);
  blank.minFilter = THREE.LinearFilter;
  blank.magFilter = THREE.LinearFilter;
  blank.generateMipmaps = false;
  return blank;
}

export type Label = { texture: THREE.CanvasTexture; aspect: number };

export function labelTexture(text: string): Label {
  const hit = cache.get(text);
  if (hit) return { texture: hit, aspect: hit.image.width / hit.image.height };

  const H = 96; // 版面の一行ぶんを、この画素数で持つ
  const PAD = Math.round(H * 0.08);
  const size = Math.round(H * 0.58);

  const c = document.createElement("canvas");
  const probe = c.getContext("2d")!;
  probe.font = `500 ${size}px ${FONT_STACK}`;
  const w = Math.ceil(probe.measureText(text).width) + PAD * 2;

  c.width = Math.max(2, w);
  c.height = H;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, c.width, c.height);
  g.font = `500 ${size}px ${FONT_STACK}`;
  g.textBaseline = "middle";
  g.fillStyle = "#000";
  g.fillText(text, PAD, H * 0.53);

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  cache.set(text, tex);
  return { texture: tex, aspect: c.width / c.height };
}

/** 版面に刷る文字列。通し番号と事例名を並べる。 */
export function plateLabel(c: { id: string; title: string }) {
  return `${c.id}   ${c.title}`;
}
