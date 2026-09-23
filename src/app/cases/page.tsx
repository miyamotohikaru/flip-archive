"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { cases } from "@/data/cases";
import { axes } from "@/data/axes";
import { AXIS_ORDER, type AxisId, type Case } from "@/data/types";
import Plate from "@/components/Plate";
import Heptagon from "@/components/Heptagon";
import { clearReturn, loadReturn, saveReturn } from "@/lib/returnNav";

export default function IndexPage() {
  // CASEを開く直前の状態を覚えてあれば、そこから開き直す
  const restored = useRef(typeof window === "undefined" ? null : loadReturn());
  const r = restored.current;

  const [hovered, setHovered] = useState<Case | null>(null);
  const [mode, setMode] = useState<"PLATES" | "SCORES">(
    (r?.mode as "PLATES" | "SCORES") ?? "PLATES",
  );
  const [played, setPlayed] = useState(r?.played ?? false);
  // 列の読み比べ用。並べ替えではないので、順序は動かさない。
  const [markedAxis, setMarkedAxis] = useState<AxisId | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 開いていたCASEの位置へ、アニメーションなしで戻す
  useLayoutEffect(() => {
    const st = restored.current;
    if (!st) return;
    restored.current = null;
    clearReturn();

    const jump = () => {
      const card = listRef.current?.querySelector<HTMLElement>(
        `[data-case="${st.slug}"]`,
      );
      if (card) {
        const top =
          card.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.28;
        window.scrollTo({ top: Math.max(0, top), behavior: "instant" as ScrollBehavior });
      } else {
        window.scrollTo({ top: st.y, behavior: "instant" as ScrollBehavior });
      }
    };
    jump();
    // 図版のキャンバスが寸法を確定させたあと、もう一度合わせる
    const id = requestAnimationFrame(jump);
    return () => cancelAnimationFrame(id);
  }, []);

  // ブラウザの復元と競合させない
  useEffect(() => {
    if ("scrollRestoration" in history) {
      const prev = history.scrollRestoration;
      history.scrollRestoration = "manual";
      return () => {
        history.scrollRestoration = prev;
      };
    }
  }, []);

  const remember = (slug: string) => {
    saveReturn({
      slug,
      y: window.scrollY,
      mode,
      filters: {},
      opFilter: null,
      panelOpen: false,
      played,
    });
  };

  const onMove = (e: React.MouseEvent) => {
    const el = floatRef.current;
    if (el) {
      el.style.transform = `translate3d(${e.clientX + 24}px, ${e.clientY - 130}px, 0)`;
    }
  };

  return (
    <main className="min-h-screen px-4 pb-4 pt-20 sm:px-6 sm:pt-24" onMouseMove={onMove}>
      <div ref={listRef} className="mx-auto max-w-[68rem]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 border-b border-line pb-4">
          <div>
            <h1 className="text-[1.6rem] font-medium tracking-[-0.02em] sm:text-[2rem]">
              索引
            </h1>
            <p className="label mt-1">INDEX OF CASES / 先行7事例</p>
          </div>
          <div className="flex items-baseline gap-5">
            <div className="flex items-baseline gap-3">
              {(["PLATES", "SCORES"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className="group relative">
                  <span
                    className={`label transition-colors ${
                      mode === m ? "!text-ink" : "group-hover:!text-ink"
                    }`}
                  >
                    {m === "PLATES" ? "図版" : "評点"}
                    <span className="ml-1.5 opacity-60">{m}</span>
                  </span>
                  <span
                    className={`absolute -bottom-1.5 left-0 block h-px bg-ink transition-all duration-500 ease-out ${
                      mode === m ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              ))}
            </div>
            {mode === "PLATES" && (
              <button
                onClick={() => setPlayed((v) => !v)}
                className="label transition-colors hover:!text-ink"
                title="図版を、変容前と配置操作の実行後で見比べる"
              >
                <span className={played ? "" : "!text-ink"}>変容前</span>
                <span className="mx-1.5 opacity-50">／</span>
                <span className={played ? "!text-ink" : ""}>実行後</span>
              </button>
            )}
            <p className="label tnum">{String(cases.length).padStart(2, "0")} CASES</p>
          </div>
        </div>

        {/* 図版の一覧 */}
        {mode === "PLATES" && (
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {cases.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/case/${c.slug}`}
                  data-case={c.slug}
                  className="group block"
                  onClick={() => remember(c.slug)}
                  onMouseEnter={() => setHovered(c)}
                  onMouseLeave={() => setHovered((h) => (h === c ? null : h))}
                >
                  <Plate
                    c={c}
                    active={played || hovered === c}
                    className="block aspect-[1/1.38] w-full"
                  />
                  <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="label tnum transition-colors duration-300 group-hover:!text-accent">
                      CASE {c.id}
                    </span>
                    <span className="label tnum">{c.yearLabel}</span>
                  </div>
                  <p className="mt-0.5 text-13 font-medium leading-snug tracking-[-0.01em]">
                    {c.title}
                  </p>
                  <p className="label mt-0.5">{c.author}</p>
                  <p className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5">
                    {AXIS_ORDER.map((id, i) => (
                      <span key={id} className="label tnum">
                        {axes[i].letter}
                        <span className="ml-0.5 !text-ink">
                          {c.review[id].score ?? "—"}
                        </span>
                      </span>
                    ))}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* 7件の評点一覧 */}
        {mode === "SCORES" && (
          <>
            <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[40rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-ink">
                    <th className="py-2.5 pr-4">
                      <span className="label">事例 CASE</span>
                    </th>
                    {AXIS_ORDER.map((id, i) => {
                      const a = axes[i];
                      const on = markedAxis === id;
                      return (
                        <th key={id} className="py-2.5 text-center">
                          <button
                            onClick={() => setMarkedAxis(on ? null : id)}
                            className="block w-full"
                            title={a.publicText}
                          >
                            <span
                              className={`label block ${on ? "!text-accent" : "!text-ink"}`}
                            >
                              {a.letter}
                            </span>
                            <span
                              className={`label mt-0.5 block ${on ? "!text-accent" : ""}`}
                            >
                              {a.jaShort}
                            </span>
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr
                      key={c.slug}
                      className="border-b border-line transition-colors duration-300 hover:bg-paper"
                      onMouseEnter={() => setHovered(c)}
                      onMouseLeave={() => setHovered((h) => (h === c ? null : h))}
                    >
                      <td className="py-3 pr-4">
                        <Link
                          href={`/case/${c.slug}`}
                          data-case={c.slug}
                          onClick={() => remember(c.slug)}
                          className="group flex flex-wrap items-baseline gap-x-2.5"
                        >
                          <span className="label tnum transition-colors duration-300 group-hover:!text-accent">
                            {c.id}
                          </span>
                          <span className="text-[1.02rem] font-medium leading-tight tracking-[-0.015em]">
                            {c.title}
                          </span>
                          <span className="label">{c.author}</span>
                          <span className="label tnum">{c.yearLabel}</span>
                        </Link>
                      </td>
                      {AXIS_ORDER.map((id) => (
                        <td
                          key={id}
                          className={`py-3 text-center text-13 tnum ${
                            markedAxis === id ? "text-accent" : ""
                          }`}
                        >
                          {c.review[id].score ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="label mt-3 leading-[2]">
              P 再知覚性／L 遊戯性／A 当事者性／C 必然性／E 誘発性／B 創発性／O 独創性。
              <br />
              列の見出しを押すと、その軸だけを刷り分ける。合計・平均・総合順位は作らない。
            </p>

            {/* 七角形の一覧 */}
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {cases.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/case/${c.slug}`}
                    onClick={() => remember(c.slug)}
                    className="group block"
                  >
                    <Heptagon c={c} size={220} className="w-full" />
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="label tnum transition-colors duration-300 group-hover:!text-accent">
                        {c.id}
                      </span>
                      <span className="text-13 font-medium leading-snug">
                        {c.title}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-16 max-w-[40rem] text-11 leading-[2] text-mute">
          こす.くまの基準による企画の特徴の評価であり、作品の総合点ではありません。
          点数は企画の特徴を読むための編集判断で、作者の偉大さ、作品全体の価値、
          参加者の心理変化の測定値ではない。低い項目を含むこと自体は、掲載価値の否定ではない。
          <br />
          ここに収録した制作者が、自らの活動をFLIPと呼んでいるわけではない。
        </p>
      </div>

      {/* カーソルに付く図版 */}
      <div
        ref={floatRef}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
        style={{ willChange: "transform" }}
      >
        <div
          className={`transition-opacity duration-300 ${
            hovered && mode === "SCORES" ? "opacity-100" : "opacity-0"
          }`}
        >
          {hovered && mode === "SCORES" && (
            <Plate
              key={hovered.slug}
              c={hovered}
              active
              className="block h-[17rem] w-[12.3rem]"
            />
          )}
        </div>
      </div>
    </main>
  );
}
