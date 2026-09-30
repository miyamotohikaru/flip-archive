import * as THREE from "three";
import { PLATE_ART_VERSION } from "./plateArtVersion";

/**
 * 版に載せる絵。
 *
 * CASEによっては、作図プログラムではなく生成した絵をそのまま版にする。
 * 《変容前》と《実行後》の二枚を持ち、uProgress で溶かし合わせる。
 */

export type Art = {
  before: THREE.Texture;
  after: THREE.Texture;
  /** 絵の 横/縦。版の枠に合わせて寄せるのに使う。 */
  aspect: number;
  ready: boolean;
  /** 読み込み終わりを待っている人たち。 */
  waiting: (() => void)[];
};

const SOURCES: Record<string, { id: string }> = {
  "taian-nijiriguchi": { id: "01" },
};

/**
 * 絵のURL。**中身から作った版番号を必ず付ける。**
 * ファイル名を据え置いて中身だけ差し替えると、
 * ブラウザが4時間ぶん古い絵を返し続ける（実際に踏んだ）。
 */
function url(id: string, side: "before" | "after") {
  const v = PLATE_ART_VERSION[id];
  return `/plates/${id}-${side}.webp${v ? `?v=${v}` : ""}`;
}

export function hasArt(slug: string) {
  return slug in SOURCES;
}

const cache = new Map<string, Art>();
let blank: THREE.Texture | null = null;

export function blankArt(): THREE.Texture {
  if (blank) return blank;
  const c = document.createElement("canvas");
  c.width = 1;
  c.height = 1;
  blank = new THREE.CanvasTexture(c);
  return blank;
}

/** 読み込みが終わったら onReady を呼ぶ。単票はそこで描き直す。 */
export function artFor(slug: string, onReady?: () => void): Art | null {
  const src = SOURCES[slug];
  if (!src) return null;

  const hit = cache.get(slug);
  if (hit) {
    // 届いたあとに呼び返すと、描き直し→取得→呼び返し で回り続ける。
    // 待つのは、まだ届いていないときだけ。
    if (!hit.ready && onReady) hit.waiting.push(onReady);
    return hit;
  }

  const loader = new THREE.TextureLoader();
  let left = 2;
  const done = (t: THREE.Texture) => {
    // 縦横は絵から取る。白地を抜いたぶん、書き出しごとに寸法が変わる。
    const img = t.image as { width: number; height: number } | undefined;
    if (img?.width) art.aspect = img.width / img.height;
    if (--left > 0) return;
    art.ready = true;
    art.waiting.splice(0).forEach((f) => f());
  };
  const tune = (t: THREE.Texture) => {
    t.colorSpace = THREE.SRGBColorSpace;
    // ミップマップは使わない。版の側で小口を描くとき、繰り返しの中で
    // テクスチャを引いているので、段階の選び方が壊れて大きな四角い筋が出る。
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    return t;
  };

  const art: Art = {
    before: tune(loader.load(url(src.id, "before"), done)),
    after: tune(loader.load(url(src.id, "after"), done)),
    aspect: 1,
    ready: false,
    waiting: onReady ? [onReady] : [],
  };
  cache.set(slug, art);
  return art;
}
