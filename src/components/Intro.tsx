"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Heptagon from "@/components/Heptagon";
import Plate from "@/components/Plate";
import { casesFor } from "@/data/i18n";
import { LANGS, langOf, path, stripLang } from "@/i18n/lang";
import { INTRO_KEY } from "@/lib/intro";

/**
 * はじめて来た人にだけ出す、企画の説明（スタート画面）。
 *
 * どの頁から入っても、最初の一回は必ずこれを頁の上に重ねる。
 * 「図鑑をひらく」を押したら端末に覚え、二回目からは出さない。
 *
 * サムネのように一枚で伝わることを優先し、情報は「名・ひとこと・何の図鑑か・図」だけにする。
 * 収録の一覧や軸の説明は、図鑑の中（索引・評価・方針）に任せる。
 *
 * 出すかどうかをJSの読み込み後に決めると、二回目の人にも一瞬これが見える。
 * そこで layout の <head> で先に印（html.intro-seen）を付け、CSSで最初から隠す。
 */

const COPY = {
  ja: {
    kicker: "WORLD FLIP ARCHIVE",
    title: "世界のFLIP図鑑",
    catch: ["当たり前には、", "別の姿がある。"],
    lead: [
      "世界のFLIP図鑑は、",
      "現実の当たり前に具体的な仕掛けを置き、",
      "人が関わる経験を通して、",
      "その当たり前の別の姿を立ち上げた企画を記録する。",
    ],
    spec: "先行7事例 ・ 7軸 × 5段階",
    start: "図鑑をひらく",
  },
  en: {
    kicker: "WORLD FLIP ARCHIVE",
    title: "World FLIP Archive",
    catch: ["Every given", "has another face."],
    lead: [
      "The World FLIP Archive records projects",
      "that place a concrete device in an everyday given",
      "and, through people\u2019s engagement,",
      "bring another face of that given into view.",
    ],
    spec: "7 CASES · 7 AXES × 5 LEVELS",
    start: "Open the archive",
  },
} as const;

export default function Intro() {
  const pathname = usePathname() ?? "/";
  const lang = langOf(pathname);
  const t = COPY[lang];
  const cases = casesFor(lang);

  // サーバーでは常に「出す」で描き、見たことがある人はCSSで隠しておく。
  // 読み込み後に端末の記録を見て、要らなければ外す。
  const [open, setOpen] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [shown, setShown] = useState(0);
  // カードは《変容前》で少し止まってから《実行後》へ動く
  const [after, setAfter] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!localStorage.getItem(INTRO_KEY);
    } catch {}
    if (seen) setOpen(false);
  }, []);

  // 開いているあいだは、下の頁を送らせない
  useEffect(() => {
    document.body.classList.toggle("intro-open", open);
    return () => document.body.classList.remove("intro-open");
  }, [open]);

  // カードと七角形を7件ぶん順に替えて、事例ごとに仕掛けも形も違うことを見せる
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const flip = window.setTimeout(() => setAfter(true), 1200);
    const next = window.setTimeout(() => {
      setAfter(false);
      setShown((i) => (i + 1) % cases.length);
    }, 3400);
    return () => {
      window.clearTimeout(flip);
      window.clearTimeout(next);
    };
  }, [open, shown, cases.length]);

  const start = () => {
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {}
    document.documentElement.classList.add("intro-seen");
    setLeaving(true);
    window.setTimeout(() => setOpen(false), 520);
  };

  if (!open) return null;

  const c = cases[shown];
  const here = stripLang(pathname);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      className={`intro fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-bg transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex min-h-full flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4 sm:px-6 lg:px-10 lg:pb-8">
        {/* 頭の一行。左に名、右に言語 */}
        <div className="flex items-center justify-between border-b border-dashed border-line pb-3">
          <span className="label">{t.kicker}</span>
          <span className="flex items-center gap-1">
            {LANGS.map((l) => (
              <Link
                key={l}
                href={path(l, here)}
                hrefLang={l}
                aria-current={l === lang ? "true" : undefined}
                className={`label rounded-full px-2 py-0.5 transition-colors ${
                  l === lang ? "bg-ink !text-bg" : "hover:!text-ink"
                }`}
              >
                {l === "ja" ? "JA" : "EN"}
              </Link>
            ))}
          </span>
        </div>

        {/* 一枚。携帯は図が上・字が下、パソコンは字が左・図が右 */}
        <div className="mx-auto grid w-full max-w-[76rem] flex-1 content-center items-center gap-y-4 py-4 lg:grid-cols-2 lg:gap-x-16 lg:py-8">
          {/* 図。事例のカードと七角形を並べ、7件ぶん順に替える */}
          <div className="lg:order-2">
            <div className="mx-auto flex max-w-[34rem] items-center justify-center gap-3 sm:gap-5 lg:max-w-[42rem] lg:gap-8">
              <div className="w-[38%] max-w-[13rem] shrink-0 lg:w-[44%] lg:max-w-[19rem]">
                <Plate c={c} lang={lang} active={after} className="block aspect-[1/1.38] w-full" />
              </div>
              <div
                key={c.slug}
                className="min-w-0 flex-1 [animation:riseIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]"
              >
                <Heptagon c={c} lang={lang} size={300} labelSize={lang === "en" ? 15 : 17} className="h-auto w-full" />
              </div>
            </div>
            <p className="label tnum mt-3 text-center">
              <span className="!text-accent">CASE {c.id}</span>
              <span className="mx-2 opacity-50">／</span>
              <span className="!text-ink">{c.title}</span>
            </p>
          </div>

          {/* 字 */}
          <div className="text-left lg:order-1">
            <h1
              id="intro-title"
              className={`font-medium leading-[1.05] tracking-[-0.035em] ${
                lang === "en"
                  ? "text-[2.3rem] sm:text-[2.8rem] xl:text-[3.6rem]"
                  : "text-[2.5rem] sm:text-[3rem] xl:text-[4.6rem]"
              }`}
            >
              {t.title}
            </h1>
            <p className="mt-4 text-[1.2rem] font-medium leading-[1.5] tracking-[-0.01em] lg:mt-8 lg:text-[1.6rem]">
              {t.catch[0]}
              <br />
              {t.catch[1]}
            </p>
            <p className="mt-3 text-[0.875rem] leading-[1.75] text-sub lg:mt-5 lg:text-[1rem] lg:leading-[1.9]">
              {t.lead.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
            <p className="label tnum mt-3 lg:mt-5">{t.spec}</p>

            <button
              type="button"
              onClick={start}
              className="mt-6 flex w-full max-w-[22rem] items-center justify-center gap-3 rounded-[0.6rem] border border-ink bg-accent py-3.5 text-paper shadow-[0_4px_0_0_var(--color-ink)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--color-ink)] lg:mt-10"
            >
              <span className="font-mono text-11 tracking-[0.14em] opacity-80">OPEN ▸</span>
              <span className="text-[1.05rem] font-medium tracking-[0.04em]">{t.start}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
