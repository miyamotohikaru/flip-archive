"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { casesFor } from "@/data/i18n";
import { path, type Lang } from "@/i18n/lang";
import Heptagon from "@/components/Heptagon";
import JaText from "@/components/JaText";

const Ribbon = dynamic(() => import("@/webgl/Ribbon"), { ssr: false });

export default function HomePage({ lang }: { lang: Lang }) {
  const cases = casesFor(lang);
  const [focus, setFocus] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  const shown = cases[hover ?? focus] ?? cases[0];

  return (
    <main className="fixed inset-0 overflow-hidden">
      <Ribbon lang={lang} onFocusChange={setFocus} onHoverChange={setHover} />

      {/* 図鑑の定義。左上に小さく置き、図版の読み取りの手前に立たせない */}
      <div className="pointer-events-none absolute left-4 top-[5.6rem] z-30 sm:left-6 sm:top-16">
        {/* 携帯は右下に表を置く幅がないので、帯が通らない左上に出す */}
        <Heptagon
          c={shown}
          lang={lang}
          size={176}
          labelSize={22}
          className="-ml-1 -mt-4 block opacity-0 [animation:fadeIn_1.4s_1.6s_forwards] sm:hidden"
        />
        {lang === "en" ? (
          <p className="hidden max-w-[19rem] text-11 leading-[1.9] text-mute opacity-0 [animation:fadeIn_1.4s_1.8s_forwards] sm:block">
            A record of projects that place a concrete device
            <br />
            in an everyday given and, through people&rsquo;s engagement,
            <br />
            bring another face of that given into view.
          </p>
        ) : (
          <p className="hidden max-w-[18rem] text-11 leading-[2] text-mute opacity-0 [animation:fadeIn_1.4s_1.8s_forwards] sm:block">
            現実の当たり前に具体的な仕掛けを置き、
            <br />
            人が関わる経験を通して、
            <br />
            その当たり前の別の姿を立ち上げた企画の記録。
          </p>
        )}
      </div>

      {/* 手前の版の書誌と評価。帯が通らない右下の隅にまとめる。 */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-30 flex max-w-[calc(100%-2rem)] items-end gap-5 sm:bottom-5 sm:right-6 sm:gap-7">
        {/* 携帯では、帯の版に文字が乗らない幅までしか広げない */}
        <div className="max-w-[14rem] text-right sm:max-w-none">
          <div
            key={shown.slug}
            className="[animation:riseIn_0.7s_cubic-bezier(0.16,1,0.3,1)_forwards]"
          >
            <div className="mb-1.5 flex flex-wrap items-baseline justify-end gap-x-2.5">
              <span className="label !text-ink tnum">CASE {shown.id}</span>
              <span className="label tnum">{shown.yearLabel}</span>
              <span className="label">{shown.author}</span>
            </div>
            <h2 className="ml-auto max-w-[22rem] text-balance text-[1.35rem] font-medium leading-[1.25] tracking-[-0.02em] sm:text-[1.7rem]">
              {shown.title}
            </h2>
            <p className="mt-1.5 ml-auto max-w-[24rem] text-12 leading-[1.8] text-mute">
              {lang === "en" ? shown.headline : <JaText>{shown.headline}</JaText>}
            </p>
          </div>
        </div>

        <Heptagon
          c={shown}
          lang={lang}
          size={262}
          labelSize={12}
          className="-mb-2 -mr-2 hidden shrink-0 sm:block"
        />
      </div>

      {/* WebGLを使えない環境とキーボード操作のための実体 */}
      <nav className="sr-only">
        <h1>{lang === "en" ? "World FLIP Archive — seven precedents" : "世界のFLIP図鑑 — 先行7事例"}</h1>
        <ul>
          {cases.map((c) => (
            <li key={c.slug}>
              <Link href={path(lang, `/case/${c.slug}`)}>
                CASE {c.id} {c.title}
                {lang === "en" ? ` (${c.author}, ${c.yearLabel})` : `（${c.author}／${c.yearLabel}）`}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
