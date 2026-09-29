import * as THREE from "three";

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

const SOURCES: Record<string, { before: string; after: string; aspect: number }> = {
  "taian-nijiriguchi": {
    before: "/plates/01-before.webp",
    after: "/plates/01-after.webp",
    aspect: 720 / 964,
  },
};

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
  const done = () => {
    if (--left > 0) return;
    art.ready = true;
    art.waiting.splice(0).forEach((f) => f());
  };
  const tune = (t: THREE.Texture) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = true;
    t.anisotropy = 8;
    return t;
  };

  const art: Art = {
    before: tune(loader.load(src.before, done)),
    after: tune(loader.load(src.after, done)),
    aspect: src.aspect,
    ready: false,
    waiting: onReady ? [onReady] : [],
  };
  cache.set(slug, art);
  return art;
}
