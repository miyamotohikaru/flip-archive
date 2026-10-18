/**
 * 言語。日本語は URL の先頭に何も付けず（/cases）、
 * 英語は /en を付ける（/en/cases）。日本語の URL は変えない。
 */
export type Lang = "ja" | "en";

export const LANGS: Lang[] = ["ja", "en"];

/** その言語での道筋を作る。ja はそのまま、en は先頭に /en */
export function path(lang: Lang, href: string) {
  if (lang === "ja") return href;
  return href === "/" ? "/en" : `/en${href}`;
}

/** いまの道筋から言語を読む */
export function langOf(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ja";
}

/** 言語を外した道筋（切り替えのときに同じページへ移るため） */
export function stripLang(pathname: string) {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}
