import type { Metadata } from "next";
import { casesFor } from "@/data/i18n";
import { enMeta } from "@/lib/meta-en";
import DefTable from "@/components/DefTable";

export const metadata: Metadata = enMeta({
  title: "About",
  description:
    "What we read and what we leave out: the premises for reading the trial review of seven precedents, and the confidence and limits of this round.",
  path: "/about",
});

const cases = casesFor("en");

function H2({ en }: { en: string }) {
  return <h2 className="h-sec">{en}</h2>;
}

const PREMISES: [string, string][] = [
  [
    "A score is not a rank",
    "Scores are editorial judgements made to read a project's character, not the overall value of the maker or the work. All are integers from 1 to 5. No totals, averages or overall rankings are made. A low score on some axis is not a judgement against inclusion.",
  ],
  [
    "We read the version and its audience, not the person",
    "We read the specific version and the audience experience stated for each case, not the person or the work as a whole. Fountain is read through contact with the 1917 magazine page; Banksy through the public record of 2018. A low Bottom-up Emergence or Agency score therefore does not mean the event as a whole had little impact.",
  ],
  [
    "Keep the public view short, keep the evidence",
    "The heptagon and the commentary are the core of the public view; the axis-by-axis review, sources and caveats are records for internal checking. This archive does not discard evidence or inconvenient facts for the sake of brevity, so the internal review is printed as is in the lower part of each case.",
  ],
];

const CHANGES: [string, string][] = [
  [
    "Name and English",
    "Adopted PLACEBO. Changed the English for 遊戯性 to Ludic Quality and for 創発性 to Bottom-up Emergence.",
  ],
  [
    "Display order",
    "Perceptual / Ludic / Agency / Coherence / Engagement / Emergence / Originality. The table of seven cases, the per-axis reasons and the heptagons all follow this order.",
  ],
  [
    "Scores and meaning",
    "Identical to the 49 cells of v1.2. The Japanese definitions, the 35 scale levels of R04-5 and the evaluated units are unchanged. Matching the English wording is not made a new scoring condition.",
  ],
  [
    "Public presentation",
    "PLACEBO is used alongside the phrase used in the criteria notes. The device's specification is kept in internal documents; public cards do not keep repeating the reveal.",
  ],
  [
    "Evidence and caveats",
    "Source IDs, scope of support and unverified points are carried over. No new external verification, inter-rater reproducibility check, or independent re-review of 30 cases was done this time.",
  ],
];

export default function AboutPageEn() {
  return (
    <main className="px-4 pb-4 pt-20 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-[68rem]">
        <header className="border-b border-line pb-8">
          <h1 className=" text-[2rem] font-medium leading-[1.15] tracking-[-0.025em] sm:text-[2.6rem]">
            About
          </h1>
          <p className="lead mt-7 max-w-[44rem]">
            The World FLIP Archive records projects that place a concrete device in an everyday given and,
            through people&rsquo;s engagement, bring another face of that given into view.
            What is published now is <span className="tnum">{cases.length}</span> precedents,
            re-read with criteria v1.3 and its scale.
          </p>
          <p className="copy-sm mt-4 max-w-[44rem] text-mute">
            The 49 scores across {cases.length} cases are the trial values saved in v1.2, resubmitted as they are.
            They are not the result of new external research or independent re-scoring.
          </p>
        </header>

        <section className="pt-12">
          <H2 en="Premises for reading" />
          <dl className="max-w-[46rem] space-y-10">
            {PREMISES.map(([k, v]) => (
              <div key={k}>
                <dt className="h-item">{k}</dt>
                <dd className="copy mt-2.5">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="pt-14">
          <H2 en="The seven cases" />
          <ol className="max-w-[46rem] border-t border-line">
            {cases.map((c) => (
              <li
                key={c.slug}
                className="grid gap-1 border-b border-line py-3.5 sm:grid-cols-[3rem_1fr] sm:gap-5"
              >
                <span className="label tnum pt-0.5">{c.id}</span>
                <div>
                  <p className="flex flex-wrap items-baseline gap-x-2.5">
                    <span className="text-13 font-medium">{c.title}</span>
                    <span className="label">{c.author}</span>
                    <span className="label tnum">{c.yearLabel}</span>
                  </p>
                  <p className="copy-sm mt-1 text-mute">{c.target}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="pt-14">
          <H2 en="What changed this round" />
          <DefTable head={["Item", "This round"]} rows={CHANGES} />
          <p className="copy-sm mt-5 max-w-[44rem] text-mute">
            Changes from earlier versions are not mixed with this round&rsquo;s. From v1.1 to v1.2, Boundary-crossing was removed from the heptagon and Agency was added,
            and Coherence for Banksy and Pokémon GO was changed from 5 to 4.
            These are judgements saved in the earlier version; the scores were not lowered again this time.
          </p>
        </section>

        <section className="pt-14">
          <H2 en="Confidence and limits of this round" />
          <div className="copy max-w-[44rem] space-y-5">
            <p>
              With the meaning and values of each axis fixed, only the display names and order were changed. Being able to align the scores and reasons for seven cases with the documents
              does not prove that the measurement is objective, or that another reviewer would give the same scores.
              Judgements such as Coherence 4 or 5, and Agency 1 or 2 and 4 or 5, still leave room for editorial discretion.
            </p>
            <p>
              Viewing a record, where Bottom-up Emergence comes out low, and taking part in a project directly place the audience in different positions.
              Do not lift the table or heptagon out on its own and turn it into a ranking of whole works.
              Play with names is never used to excuse errors or hide a lack of evidence.
            </p>
            <p className="text-mute">
              Checked: the seven definitions and 35 scale levels, the 49 scores for seven cases, the commentaries, the evaluated units, and the reasons, caveats and source IDs of the 49 cells, against v1.2.
              Values drawn in tables and figures are matched by internal ID, so that no score is moved by mistake when positions are swapped.
            </p>
            <p className="text-mute">
              The sources were checked on 2026-09-20 in the earlier working file; this does not mean every one was revisited this time.
              Each case&rsquo;s source index keeps the scope of support and caveats as they are.
            </p>
          </div>
        </section>

        <section className="pt-14">
          <H2 en="About the plates" />
          <div className="copy max-w-[44rem] space-y-4">
            <p>
              No photographs of the actual works are shown, since they would require rights clearance.
              Instead, each case has its own drawing program that renders a layout diagram.
              At rest it shows the arrangement before the change; on touch it moves to the arrangement after the intervention.
            </p>
            <p className="text-mute">
              The plates are not variations of one shared pattern generator with different random seeds.
              Each case gets a diagram written for it alone.
            </p>
          </div>
        </section>

        <p className="fineprint mt-16 max-w-[42rem]">
          The makers collected here do not themselves call their work a FLIP.
          Inclusion implies no praise, endorsement or exemption. Corrections and further information are welcome via the editors.
        </p>
      </div>
    </main>
  );
}
