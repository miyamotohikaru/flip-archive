/**
 * PLACEBO 評価基準 v1.3（ロック版）に対応する型。
 *
 * 表示は P・L・A・C・E・B・O の順で固定し、内部IDは v1.2 から継承する。
 * 合計・平均・総合順位は作らない。未評価は null で保持し、0 や中間値で埋めない。
 */

/** 内部ID。値の対応付けはこのIDで行い、表示順が変わっても点を移さない。 */
export type AxisId = "PS" | "PL" | "AG" | "CO" | "EP" | "EM" | "OR";

/** 表示順。上端をPとし、時計回りに並べる。 */
export const AXIS_ORDER: AxisId[] = ["PS", "PL", "AG", "CO", "EP", "EM", "OR"];

export type Axis = {
  id: AxisId;
  /** 表示文字。P・L・A・C・E・B・O。 */
  letter: string;
  /** AXIS 01 〜 AXIS 07。 */
  no: string;
  ja: string;
  /** 短縮表記。七角形の頂点と一覧表の見出しに使う。 */
  jaShort: string;
  en: string;
  /** 一行の問い。 */
  lead: string;
  /** 公開用の短い説明。行の順序と各説明の冒頭は入れ替えない。 */
  publicText: string;
  definition: string;
  /** 1〜5。その段階で確認する働き。 */
  levels: string[];
  /** 読み違えないための境界。 */
  boundary: string[];
  /** 採点理由に残すこと。 */
  keep: string;
  /** ほかの軸との違い。 */
  distinct: string[];
};

/** 1〜5の整数。判断に必要な事実・比較が不足する場合は null（未評価）。 */
export type Score = 1 | 2 | 3 | 4 | 5 | null;

/** 軸ごとの審査。評点／理由／隣接点との境界・留保／出典ID を一組にする。 */
export type AxisReview = {
  score: Score;
  reason: string;
  caveat: string;
  sourceIds: string[];
};

export type Source = {
  /** RIK-01 のような出典ID。審査理由から参照する。 */
  id: string;
  title: string;
  /** 発信者。 */
  by: string;
  url: string;
  /** この資料が支持する範囲。 */
  support: string;
  /** この資料では言えないこと。 */
  caveat: string;
};

export type Case = {
  /** 通し番号。 */
  id: string;
  /** 事例コード。出典IDの接頭辞と対応する。 */
  code: string;
  slug: string;
  title: string;
  /** 制作者・実行主体。 */
  author: string;
  year: number;
  yearLabel: string;
  /** 一行概要。 */
  headline: string;
  /** 80〜140字程度の短評。 */
  body: string;
  /** 誰の・どの経験を読んだか。 */
  target: string;
  place: string;
  review: Record<AxisId, AxisReview>;
  sources: Source[];
};

/** 七角形と一覧表が読む値。未評価の頂点は補完・連結しない。 */
export function scoresOf(c: Case): Record<AxisId, Score> {
  return AXIS_ORDER.reduce(
    (acc, id) => {
      acc[id] = c.review[id].score;
      return acc;
    },
    {} as Record<AxisId, Score>,
  );
}
