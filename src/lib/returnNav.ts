/**
 * 索引からCASEを開いて戻ったとき、見ていた場所へそのまま返すための記憶。
 *
 * 絞り込みや表示モードまで含めて覚えておかないと、
 * 戻った先が「先頭の01」になってしまい、探し直しになる。
 */

const KEY = "flip-return";

export type ReturnState = {
  /** 開いたCASEのslug。位置合わせの目印にする。 */
  slug: string;
  /** 索引の縦スクロール位置。 */
  y: number;
  /** 索引の表示（図版／評点）。 */
  mode: "PLATES" | "SCORES";
  filters: Record<string, string | undefined>;
  opFilter: string | null;
  /** 絞り込みパネルを開いていたか。 */
  panelOpen: boolean;
  /** 「変容前／実行後」のどちらを見ていたか。 */
  played: boolean;
};

export function saveReturn(state: ReturnState) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // プライベートモード等で書けなくても、動作は妨げない
  }
}

export function loadReturn(): ReturnState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReturnState;
  } catch {
    return null;
  }
}

export function clearReturn() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // 同上
  }
}
