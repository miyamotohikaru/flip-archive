import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cases, getCase } from "@/data/cases";
import { axes } from "@/data/axes";
import { AXIS_ORDER } from "@/data/types";
import CaseHero from "@/components/CaseHero";
import Heptagon from "@/components/Heptagon";
import BackToIndex from "@/components/BackToIndex";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return {
    title: `${c.title}（${c.yearLabel}） — 世界のFLIP図鑑`,
    description: c.headline,
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  const i = cases.findIndex((x) => x.slug === c.slug);
  const prev = cases[(i - 1 + cases.length) % cases.length];
  const next = cases[(i + 1) % cases.length];

  return (
    <main className="px-4 pb-4 pt-20 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-[68rem]">
        <BackToIndex slug={c.slug} />

        {/* 見出し */}
        <header className="mt-6 border-b border-line pb-8">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="label !text-accent tnum text-12">
              CASE {c.id} / {c.code}
            </span>
            <span className="label tnum">{c.yearLabel}</span>
            <span className="label">{c.place}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <h1 className="text-[2rem] font-medium leading-[1.15] tracking-[-0.025em] sm:text-[3rem]">
              {c.title}
            </h1>
            <p className="label text-11">
              {c.author} <span className="mx-1 opacity-50">|</span> {c.yearLabel}
            </p>
          </div>
          <p className="mt-6 max-w-[44rem] text-[1.25rem] font-medium leading-[1.8] tracking-[-0.01em] sm:text-[1.45rem]">
            {c.headline}
          </p>
        </header>

        <div className="grid gap-12 pt-10 lg:grid-cols-[23rem_minmax(0,1fr)] lg:gap-14">
          {/* 左：図版と七角形 */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <CaseHero c={c} />

            <div className="mt-9">
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <p className="label">評価 PLACEBO</p>
                <p className="label tnum opacity-70">1–5 / R04-5</p>
              </div>
              <Heptagon c={c} size={320} className="-ml-2 w-[calc(100%+1rem)]" />
              <p className="label mt-1 leading-[1.9] opacity-70">
                こす.くまの基準による企画の特徴の評価。作品の総合点ではありません。
              </p>
            </div>

            <div className="mt-8 border-t border-line">
              <div className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-line py-2.5">
                <dt className="label pt-0.5">評価対象</dt>
                <dd className="text-13 leading-[1.8]">{c.target}</dd>
              </div>
              <div className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-line py-2.5">
                <dt className="label pt-0.5">場所</dt>
                <dd className="text-13 leading-[1.8]">{c.place}</dd>
              </div>
              <div className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-line py-2.5">
                <dt className="label pt-0.5">制作者</dt>
                <dd className="text-13 leading-[1.8]">{c.author}</dd>
              </div>
            </div>
          </aside>

          {/* 右：短評と審査 */}
          <div className="space-y-14">
            <section>
              <div className="mb-2.5 flex items-baseline gap-2.5">
                <h2 className="text-13 font-medium tracking-[0.02em]">短評</h2>
                <span className="label">WHAT IT DOES</span>
              </div>
              <p className="max-w-[42rem] text-[1rem] leading-[2] tracking-[0.005em]">
                {c.body}
              </p>
            </section>

            {/* 項目別の審査 */}
            <section>
              <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2.5">
                <h2 className="text-13 font-medium tracking-[0.02em]">
                  内部審査｜理由・根拠・留保
                </h2>
                <span className="label">TRIAL ASSESSMENT</span>
              </div>
              <p className="label mb-6 max-w-[42rem] leading-[1.9]">
                評点／当てはまる目盛り／具体的な理由／留保／出典IDを一組にする。
                v1.2から継承した試行値であり、新たな独立再採点の結果ではない。
              </p>

              <ol className="max-w-[46rem] border-t border-line">
                {AXIS_ORDER.map((id, idx) => {
                  const a = axes[idx];
                  const rv = c.review[id];
                  return (
                    <li key={id} className="border-b border-line py-6">
                      <div className="flex items-baseline gap-3">
                        <span className="label !text-accent tnum text-12">
                          {a.letter}
                        </span>
                        <span className="text-13 font-medium">{a.ja}</span>
                        <span className="label">{a.en}</span>
                        <span className="ml-auto text-[1.5rem] font-medium leading-none tnum">
                          {rv.score ?? "—"}
                          <span className="label ml-1 align-baseline">/5</span>
                        </span>
                      </div>

                      {rv.score != null && (
                        <p className="mt-3 border-l border-line pl-4 text-12 leading-[1.95] text-mute">
                          {a.levels[rv.score - 1]}
                        </p>
                      )}

                      <p className="mt-4 text-[0.9375rem] leading-[1.95]">
                        {rv.reason}
                      </p>
                      <p className="mt-2.5 text-13 leading-[1.95] text-mute">
                        <span className="label mr-2">留保</span>
                        {rv.caveat}
                      </p>
                      <p className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1">
                        {rv.sourceIds.map((sid) => (
                          <a
                            key={sid}
                            href={`#${sid}`}
                            className="label tnum rounded-full border border-line px-2 py-0.5 transition-colors hover:!text-ink"
                          >
                            {sid}
                          </a>
                        ))}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* 出典 */}
            <section>
              <div className="mb-1.5 flex items-baseline gap-2.5">
                <h2 className="text-13 font-medium tracking-[0.02em]">
                  出典索引・継承の記録
                </h2>
                <span className="label">SOURCES</span>
              </div>
              <p className="label mb-5 max-w-[42rem] leading-[1.9]">
                発信者・リンク・支持範囲・留保はv1.2の出典台帳から継承した。
                確認日は2026-09-20であり、今回すべてを再閲覧したという意味ではない。
              </p>
              <ol className="max-w-[46rem] border-t border-line">
                {c.sources.map((s) => (
                  <li
                    key={s.id}
                    id={s.id}
                    className="scroll-mt-24 border-b border-line py-4"
                  >
                    <div className="grid gap-2 sm:grid-cols-[5rem_1fr] sm:gap-4">
                      <span className="label tnum pt-0.5">{s.id}</span>
                      <div>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-13 font-medium leading-[1.8] underline decoration-line underline-offset-[3px] transition-colors hover:decoration-ink"
                        >
                          {s.title}
                        </a>
                        <p className="label mt-1 leading-[1.8]">{s.by}</p>
                        <p className="mt-2 text-12 leading-[1.95] text-sub">
                          <span className="label mr-2">支持</span>
                          {s.support}
                        </p>
                        <p className="mt-1 text-12 leading-[1.95] text-mute">
                          <span className="label mr-2">留保</span>
                          {s.caveat}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="label mt-3 leading-[1.9]">
                事実の根拠と、画像の掲載権利は別に扱う。本CASEに実物の写真は掲載していない。
              </p>
            </section>

            <p className="label max-w-[42rem] leading-[2]">
              人物や作品全体ではなく、上に明記した版と受け手の経験を読む。
              低い項目を含むこと自体は、掲載価値の否定ではない。
              訂正・追加情報は編集部まで。
            </p>
          </div>
        </div>

        {/* 前後 */}
        <nav className="mt-20 grid grid-cols-2 gap-4 border-t border-line pt-5">
          <Link href={`/case/${prev.slug}`} className="group">
            <span className="label transition-colors group-hover:!text-ink">
              ← CASE {prev.id}
            </span>
            <p className="mt-1 text-13 text-mute transition-colors group-hover:text-ink">
              {prev.title}
            </p>
          </Link>
          <Link href={`/case/${next.slug}`} className="group text-right">
            <span className="label transition-colors group-hover:!text-ink">
              CASE {next.id} →
            </span>
            <p className="mt-1 text-13 text-mute transition-colors group-hover:text-ink">
              {next.title}
            </p>
          </Link>
        </nav>
      </div>
    </main>
  );
}
