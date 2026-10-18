import type { Metadata } from "next";
import { axesFor } from "@/data/i18n";
import { enMeta } from "@/lib/meta-en";
import AxisMark from "@/components/AxisMark";
import DefTable from "@/components/DefTable";

export const metadata: Metadata = enMeta({
  title: "Criteria",
  description:
    "The seven PLACEBO axes (Perceptual Shift, Ludic Quality, Agency, Coherence, Engagement Pull, Bottom-up Emergence, Originality): definitions, five-level scales, and how reviews are carried out.",
  path: "/criteria",
});

const axes = axesFor("en");

function Head({ en }: { en: string }) {
  return <h2 className="h-sec">{en}</h2>;
}

export default function CriteriaPageEn() {
  return (
    <main className="px-4 pb-4 pt-20 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-[68rem]">
        <header className="border-b border-line pb-8">
          <h1 className=" text-[2rem] font-medium leading-[1.15] tracking-[-0.025em] sm:text-[2.6rem]">
            Criteria
          </h1>
          <p className="copy-sm mt-3 text-mute tnum">
            7 axes × 5 levels / scale R04-5 / 21 September 2026
          </p>
          <p className="lead mt-7 max-w-[44rem]">
            We read projects that place a concrete device in an everyday given and,
            through people&rsquo;s engagement, bring another face of that given into view.
            Rather than the authority of the medium or the maker, we describe which condition is changed and what happens as a result.
          </p>
          <p className="copy-sm mt-4 max-w-[44rem] text-mute">
            Scores are editorial judgements made to read a project&rsquo;s character. They do not measure the greatness of the maker,
            the value of the work as a whole, or any change in participants&rsquo; minds. A project that scores high on every axis is not held up as the ideal.
          </p>
        </header>

        {/* 7行の公開説明 */}
        <section className="pt-12">
          <Head en="The seven axes" />
          <ol className="max-w-[48rem] border-t border-line">
            {axes.map((a) => (
              <li
                key={a.id}
                className="grid gap-2 border-b border-line py-4 sm:grid-cols-[15rem_1fr] sm:gap-6"
              >
                <div className="flex items-center gap-3.5">
                  <AxisMark axis={a.id} size={32} className="shrink-0 text-ink" />
                  <div className="flex items-baseline gap-2.5">
                    <span className="label !text-accent tnum text-12">
                      {a.letter}
                    </span>
                    <p className="text-13 font-medium">{a.ja}</p>
                  </div>
                </div>
                <p className="copy-sm sm:self-center">
                  {a.publicText}
                </p>
              </li>
            ))}
          </ol>
          <p className="copy-sm mt-3 text-mute">
            The display order is fixed as P, L, A, C, E, B, O. The order of the rows and the opening of each description are not rearranged.
          </p>
        </section>

        {/* 各軸の定義と目盛り */}
        <section className="pt-16">
          <Head en="Definitions and scales, axis by axis" />
          <div className="space-y-16 pt-4">
            {axes.map((a) => (
              <article key={a.id} className="border-t border-ink pt-6">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="label !text-accent tnum">{a.no}</span>
                  <span className="label tnum">{a.letter}</span>
                  <span className="label tnum opacity-70">INTERNAL ID {a.id}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <AxisMark axis={a.id} size={42} className="shrink-0 text-ink" />
                  <h3 className="text-[1.5rem] font-medium tracking-[-0.02em]">
                    {a.ja}
                  </h3>
                </div>
                <p className="mt-1 text-13 text-mute">{a.lead}</p>

                <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
                  <div>
                    <p className="tag mb-2">Definition</p>
                    <p className="copy max-w-[40rem]">
                      {a.definition}
                    </p>

                    <ol className="mt-7 border-t border-line">
                      {a.levels.map((lv, i) => (
                        <li
                          key={i}
                          className="grid grid-cols-[2rem_1fr] gap-3 border-b border-line py-3"
                        >
                          <span className="text-13 font-medium tnum">{i + 1}</span>
                          <span className="copy-sm">{lv}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <aside className="space-y-6 lg:pt-1">
                    <div>
                      <p className="tag mb-2">Boundaries, to avoid misreading</p>
                      {a.boundary.map((b, i) => (
                        <p key={i} className="copy-sm mt-2 text-mute">
                          {b}
                        </p>
                      ))}
                    </div>
                    <div>
                      <p className="tag mb-2">What the reason must record</p>
                      <p className="copy-sm text-sub">{a.keep}</p>
                    </div>
                    <div>
                      <p className="tag mb-2">How it differs from other axes</p>
                      {a.distinct.map((d, i) => (
                        <p key={i} className="copy-sm mt-2 text-mute">
                          {d}
                        </p>
                      ))}
                    </div>
                  </aside>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 表示の扱い */}
        <section className="pt-16">
          <Head en="How values are handled" />
          <DefTable
            head={["Value", "Meaning"]}
            rows={[
              [
                "1–5",
                "The strength or role of the specified function can be judged on the evidence. This is an ordinal scale: a 4 is not worth twice a 2.",
              ],
              [
                "— (not rated)",
                "The facts or comparisons needed for a judgement are missing. Never filled with 0, 1 or a midpoint; stored as null in the data.",
              ],
              [
                "Not applicable",
                "Used, with a reason, when the question itself cannot apply to the subject. Not used to avoid a low score, such as low Bottom-up Emergence for a fixed image.",
              ],
            ]}
          />
        </section>

        {/* 七角形の共通仕様 */}
        <section className="pt-16">
          <Head en="Common rules for the heptagon" />
          <div className="copy max-w-[44rem] space-y-4">
            <p>
              P sits at the top, followed clockwise by L, A, C, E, B and O. Every axis maxes out at 5, on a five-level scale.
              Existing values are matched by axis name or internal ID, never moved by array position alone.
              The polygon is not filled, and no ranking is made from totals or area.
            </p>
            <p>
              The basic set is: name, maker and year; a one-line summary; the heptagon; and a short commentary.
              Differences in the version or audience being read are stated briefly.
              Where an axis is not rated, all seven axes remain and the missing vertex is neither filled in nor connected.
            </p>
            <p className="text-mute">
              Standard notice: A reading of the project&rsquo;s character by kosu.kuma&rsquo;s criteria. Not an overall rating of the work.
            </p>
          </div>
        </section>

        {/* 審査の考え方と手順 */}
        <section className="pt-16">
          <Head en="How a review is carried out" />
          <div className="max-w-[44rem] space-y-10">
            <div>
              <p className="h-item">First, whose experience, and of what</p>
              <p className="copy mt-2">
                We never score from a title alone. We first record the version, period, place, main audience, mode of contact, information required, and what is included and excluded.
                Buyers, actual participants and viewers of records are not added together. A person&rsquo;s whole career, a game&rsquo;s later features or posthumous fame are not folded into the original device.
              </p>
            </div>
            <div>
              <p className="h-item">Before scoring, write the design statement</p>
              <p className="copy-sm mt-2 text-accent">
                The given → the condition changed → reasons and costs of taking part → the experience that occurs → what arises next → what comes to be seen anew
              </p>
              <p className="copy mt-2">
                Begin by stating what the project did. Keep facts, the maker&rsquo;s stated intent, recorded responses, the archive&rsquo;s interpretation and unverified points apart.
                One fact may support several axes, but each axis must explain a different function.
              </p>
            </div>
            <div>
              <p className="h-item">Judge each axis together with its evidence</p>
              <p className="copy mt-2">
                Score, matching scale level, concrete reason, source IDs and caveats form one set.
                When torn between adjacent scores, note what would need to be confirmed to change the judgement.
                Each source records page title, publisher, URL, date checked and scope of support.
              </p>
            </div>
            <div>
              <p className="h-item">Do not raise neighbouring axes for the same reason</p>
              <p className="copy mt-2">
                Engagement Pull is the motive to take part; Ludic Quality is play within the process. Perceptual Shift is the other outline; Coherence is the connection that leads there.
                Agency is where the work acts on the audience; Bottom-up Emergence is what arises after input and how it feeds forward.
                Only Originality requires comparison with precedents.
              </p>
            </div>
            <div>
              <p className="h-item">Internal records are never discarded</p>
              <p className="copy mt-2">
                Freedom, burden, boundary-crossing, ripple effects and the like are not added as fixed public fields or extra tags.
                Important cautions and constraints are kept internally, and what is needed is woven into the commentary.
                Evidence and inconvenient facts are not dropped for the sake of a concise public view.
              </p>
            </div>
          </div>
        </section>

        <p className="fineprint mt-16 max-w-[42rem]">
          Integers from 1 to 5; no totals, averages or overall rankings; insufficient evidence treated as not rated;
          and a two-layer structure that keeps the public view short and the evidence internal. None of these change.
        </p>
      </div>
    </main>
  );
}
