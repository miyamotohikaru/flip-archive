"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Heptagon from "@/components/Heptagon";
import AxisMark from "@/components/AxisMark";
import JaText from "@/components/JaText";
import { axesFor, casesFor } from "@/data/i18n";
import { LANGS, langOf, path, stripLang } from "@/i18n/lang";
import { INTRO_KEY } from "@/lib/intro";

/**
 * はじめて来た人にだけ出す、企画の説明（スタート画面）。
 *
 * どの頁から入っても、最初の一回は必ずこれを頁の上に重ねる。
 * 「図鑑をひらく」を押したら端末に覚え、二回目からは出さない。
 *
 * 出すかどうかをJSの読み込み後に決めると、二回目の人にも一瞬これが見える。
 * そこで layout の <head> で先に印（html.intro-seen）を付け、CSSで最初から隠す。
 */

const COPY = {
  ja: {
    kicker: "WORLD FLIP ARCHIVE",
    title: "世界のFLIP図鑑",
    spec: "PLACEBO v1.3 ・ 7 AXES ・ 7 CASES",
    catch: ["当たり前には、", "別の姿がある。"],
    body: [
      "現実の当たり前に、具体的な仕掛けをひとつ置く。",
      "人がそれに関わったとき、当たり前の別の姿が立ち上がる。",
      "この図鑑では、そういう企画をFLIPと呼んで記録している。",
    ],
    casesHead: "先行7事例",
    casesLead: "16世紀末の茶室の入口から、2016年の位置情報ゲームまで。",
    axesHead: "7つの軸で読む",
    axesLead: "点数は順位ではない。どこが効いている企画なのかを、七角形の形で読む。",
    howHead: "図鑑の歩き方",
    how: [
      ["図版", "OVERVIEW", "帯をドラッグして版を回す。版を押すと、その事例がひらく。"],
      ["索引", "INDEX", "7件を、図版と評点の二通りで並べて見比べる。"],
      ["評価", "CRITERIA", "7つの軸の定義と、5段階の目盛り。"],
      ["方針", "ABOUT", "何を読み、何を読まないか。"],
    ],
    note: [
      "図版は図鑑が描いた配置図で、実物の写真ではない。",
      "点数はこす.くまの基準による企画の特徴の評価であり、作品の総合点ではない。",
    ],
    outro: "では、ひらいてみよう。",
    ready: "READY ・ 7 CASES",
    start: "図鑑をひらく",
  },
  en: {
    kicker: "WORLD FLIP ARCHIVE",
    title: "World FLIP Archive",
    spec: "PLACEBO v1.3 · 7 AXES · 7 CASES",
    catch: ["Every given", "has another face."],
    body: [
      "Place one concrete device inside something everyone takes for granted.",
      "When people engage with it, another face of that given comes into view.",
      "This archive calls such projects FLIPs, and keeps a record of them.",
    ],
    casesHead: "Seven precedents",
    casesLead: "From the entrance of a late 16th-century tea room to a 2016 location-based game.",
    axesHead: "Read on seven axes",
    axesLead: "Scores are not a ranking. The shape of the heptagon shows where a project does its work.",
    howHead: "How to use this archive",
    how: [
      ["Plates", "OVERVIEW", "Drag the ribbon to turn the plates. Click a plate to open that case."],
      ["Index", "INDEX", "Line up all seven cases by plate or by score, and compare."],
      ["Criteria", "CRITERIA", "What each of the seven axes means, and its five-level scale."],
      ["About", "ABOUT", "What we read, and what we deliberately leave out."],
    ],
    note: [
      "Plates are diagrams drawn by the archive, not photographs of the works.",
      "Scores describe the character of each project by kosu.kuma's criteria; they are not an overall rating of the work.",
    ],
    outro: "Now, open it.",
    ready: "READY · 7 CASES",
    start: "Open the archive",
  },
} as const;

export default function Intro() {
  const pathname = usePathname() ?? "/";
  const lang = langOf(pathname);
  const t = COPY[lang];
  const cases = casesFor(lang);
  const axes = axesFor(lang);

  // サーバーでは常に「出す」で描き、見たことがある人はCSSで隠しておく。
  // 読み込み後に端末の記録を見て、要らなければ外す。
  const [open, setOpen] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [shown, setShown] = useState(0);

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

  // 七角形を7件ぶん順に替えて、事例ごとに形が違うことを見せる
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setShown((i) => (i + 1) % cases.length), 2400);
    return () => window.clearInterval(id);
  }, [open, cases.length]);

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
      <div className="mx-auto flex min-h-full max-w-[34rem] flex-col px-5 pb-36 pt-5 sm:px-6 sm:pt-7">
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

        {/* 図。7件の七角形が順に替わる */}
        <div className="relative mx-auto mt-6 w-full max-w-[19rem]">
          <div key={c.slug} className="[animation:riseIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <Heptagon c={c} lang={lang} size={300} labelSize={13} className="h-auto w-full" />
          </div>
          <p className="label tnum -mt-1 text-center">
            <span className="!text-accent">CASE {c.id}</span>
            <span className="mx-2 opacity-50">／</span>
            <span className="!text-ink">{c.title}</span>
          </p>
        </div>

        {/* 名 */}
        <h1
          id="intro-title"
          className="mt-9 text-center text-[2.4rem] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.8rem]"
        >
          {t.title}
        </h1>
        <p className="label tnum mt-3 text-center">{t.spec}</p>

        <p className="mt-7 text-center text-[1.3rem] font-medium leading-[1.55] tracking-[-0.01em]">
          {t.catch[0]}
          <br />
          {t.catch[1]}
        </p>

        <div className="copy mt-7 space-y-1">
          {t.body.map((line) => (
            <p key={line}>
              <JaText>{line}</JaText>
            </p>
          ))}
        </div>

        {/* SEC.01 収録 */}
        <section className="mt-12">
          <p className="label">SEC.01 — CASES</p>
          <h2 className="mt-1.5 text-[1.35rem] font-medium tracking-[-0.015em]">{t.casesHead}</h2>
          <p className="copy-sm mt-2 text-mute">
            <JaText>{t.casesLead}</JaText>
          </p>
          <ol className="mt-4 border-t border-line">
            {cases.map((x, i) => (
              <li
                key={x.slug}
                className={`flex items-baseline gap-3 border-b border-line py-2.5 transition-colors duration-300 ${
                  i === shown ? "text-ink" : "text-sub"
                }`}
              >
                <span className={`label tnum w-6 shrink-0 ${i === shown ? "!text-accent" : ""}`}>
                  {x.id}
                </span>
                <span className="min-w-0 flex-1 text-[0.95rem] font-medium leading-snug">{x.title}</span>
                <span className="label tnum shrink-0">{x.yearLabel}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* SEC.02 7つの軸 */}
        <section className="mt-12">
          <p className="label">SEC.02 — AXES</p>
          <h2 className="mt-1.5 text-[1.35rem] font-medium tracking-[-0.015em]">{t.axesHead}</h2>
          <p className="copy-sm mt-2 text-mute">
            <JaText>{t.axesLead}</JaText>
          </p>
          <ul className="mt-5 space-y-4">
            {axes.map((a) => (
              <li key={a.id} className="flex items-start gap-3.5">
                <AxisMark axis={a.id} size={30} className="mt-0.5 shrink-0 text-ink" />
                <div className="min-w-0">
                  <p className="flex items-baseline gap-2">
                    <span className="label !text-accent">{a.letter}</span>
                    <span className="text-[0.95rem] font-medium">{a.ja}</span>
                  </p>
                  <p className="copy-sm text-sub">
                    <JaText>{a.publicText}</JaText>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* SEC.03 歩き方 */}
        <section className="mt-12">
          <p className="label">SEC.03 — HOW TO READ</p>
          <h2 className="mt-1.5 text-[1.35rem] font-medium tracking-[-0.015em]">{t.howHead}</h2>
          <ol className="mt-4 border-t border-line">
            {t.how.map(([name, en, desc], i) => (
              <li key={en} className="grid grid-cols-[2rem_1fr] gap-x-2 border-b border-line py-3">
                <span className="label tnum pt-0.5">0{i + 1}</span>
                <div>
                  <p className="flex items-baseline gap-2">
                    <span className="text-[0.95rem] font-medium">{name}</span>
                    {lang === "ja" && <span className="label">{en}</span>}
                  </p>
                  <p className="copy-sm mt-0.5 text-mute">
                    <JaText>{desc}</JaText>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="fineprint mt-8">
          {t.note.map((line) => (
            <p key={line}>
              {/* 「こす.くま」の点で折れないよう、名だけは一続きにする */}
              {line.split("こす.くま").map((part, i) => (
                <span key={i}>
                  {i > 0 && <span className="whitespace-nowrap">こす.くま</span>}
                  <JaText>{part}</JaText>
                </span>
              ))}
            </p>
          ))}
        </div>

        <p className="mt-14 text-center text-[1.1rem] font-medium tracking-[0.02em]">{t.outro}</p>
      </div>

      {/* 下に固定した開始の札 */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-dashed border-line bg-bg/95 pb-[calc(env(safe-area-inset-bottom)+0.9rem)] pt-2.5 backdrop-blur-sm">
        <div className="mx-auto max-w-[34rem] px-5 sm:px-6">
          <p className="label tnum text-center">{t.ready}</p>
          <button
            type="button"
            onClick={start}
            className="mt-2 flex w-full items-center justify-center gap-3 rounded-[0.6rem] border border-ink bg-accent py-3.5 text-paper shadow-[0_4px_0_0_var(--color-ink)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--color-ink)]"
          >
            <span className="font-mono text-11 tracking-[0.14em] opacity-80">OPEN ▸</span>
            <span className="text-[1.05rem] font-medium tracking-[0.04em]">{t.start}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
