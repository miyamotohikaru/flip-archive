import type { Axis, AxisId, Case } from "./types";
import type { Lang } from "@/i18n/lang";
import { cases } from "./cases";
import { axes } from "./axes";
import { casesEnA } from "./en/cases-a";
import { casesEnB } from "./en/cases-b";
import { axesEn } from "./en/axes";

/**
 * 英語の中身は、日本語のデータに「訳した文字だけ」を重ねて作る。
 * 点数・ID・URL・並び順は日本語のデータだけが持ち、英語側には書かない。
 * 点を英語側で書き換えてしまう事故を、形の上で起こせないようにするため。
 */

export type SourceEn = {
  title: string;
  by: string;
  support: string;
  caveat: string;
};

export type CaseEn = {
  title: string;
  author: string;
  yearLabel: string;
  headline: string;
  outline: string;
  body: string;
  target: string;
  place: string;
  review: Record<AxisId, { reason: string; caveat: string }>;
  sources: Record<string, SourceEn>;
};

export type AxisEn = {
  /** 七角形の頂点と表の見出しに使う短い名。日本語の jaShort にあたる。 */
  short: string;
  lead: string;
  publicText: string;
  definition: string;
  levels: string[];
  boundary: string[];
  keep: string;
  distinct: string[];
};

const casesEnBySlug: Record<string, CaseEn> = { ...casesEnA, ...casesEnB };

function caseIn(c: Case, lang: Lang): Case {
  if (lang === "ja") return c;
  const e = casesEnBySlug[c.slug];
  if (!e) return c;
  const review = { ...c.review };
  (Object.keys(review) as AxisId[]).forEach((id) => {
    review[id] = { ...review[id], ...e.review[id] };
  });
  return {
    ...c,
    title: e.title,
    author: e.author,
    yearLabel: e.yearLabel,
    headline: e.headline,
    outline: e.outline,
    body: e.body,
    target: e.target,
    place: e.place,
    review,
    sources: c.sources.map((s) => ({ ...s, ...e.sources[s.id] })),
  };
}

const casesEn = cases.map((c) => caseIn(c, "en"));

export function casesFor(lang: Lang): Case[] {
  return lang === "en" ? casesEn : cases;
}

export function getCaseIn(slug: string, lang: Lang) {
  return casesFor(lang).find((c) => c.slug === slug);
}

/** 英語では ja に英名を、jaShort に英語の短い名を入れて返す。描画側は ja / jaShort を読むだけでよい。 */
const axesEnList: Axis[] = axes.map((a) => {
  const e = axesEn[a.id];
  return {
    ...a,
    ja: a.en,
    jaShort: e.short,
    lead: e.lead,
    publicText: e.publicText,
    definition: e.definition,
    levels: e.levels,
    boundary: e.boundary,
    keep: e.keep,
    distinct: e.distinct,
  };
});

export function axesFor(lang: Lang): Axis[] {
  return lang === "en" ? axesEnList : axes;
}
