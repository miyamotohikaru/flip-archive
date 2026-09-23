import type { Metadata } from "next";
import { cases } from "@/data/cases";

export const metadata: Metadata = {
  title: "方針 — 世界のFLIP図鑑",
  description:
    "何を読み、何を読まないか。先行7事例の試行審査を読むときの前提と、今回の確かさと限界。",
};

function H2({ ja, latin }: { ja: string; latin: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-2.5">
      <h2 className="text-[1.05rem] font-medium tracking-[-0.01em]">{ja}</h2>
      <span className="label">{latin}</span>
    </div>
  );
}

const PREMISES: [string, string][] = [
  [
    "点数は、順位ではない",
    "点数は企画の特徴を読むための編集判断で、作者や作品の総合価値ではない。すべて1〜5の整数。合計・平均・総合順位は作らない。低い項目を含むこと自体は、掲載価値の否定ではない。",
  ],
  [
    "読むのは、人物ではなく版と受け手",
    "人物や作品全体ではなく、各件に明記した版と受け手の経験を読む。《泉》は1917年の誌面への接触、Banksyは2018年の公開記録を主対象としている。そのため創発性・当事者性が低くても、出来事全体の影響が小さいという意味にはならない。",
  ],
  [
    "公開は短く、根拠は残す",
    "七角形と短評が公開表示の要で、項目別の審査・出典・留保は内部確認用の記録にあたる。この図鑑では、公開の簡潔さを理由に根拠や不都合な事実を捨てないため、内部審査を各CASEの下段にそのまま刷っている。",
  ],
];

const CHANGES: [string, string][] = [
  [
    "名称・英語",
    "PLACEBOを採用。遊戯性の英語をLudic Quality、創発性の英語をBottom-up Emergenceへ変更。",
  ],
  [
    "表示順",
    "再知覚／遊戯／当事者／必然／誘発／創発／独創。7件の表・項目別理由・七角形をすべて同じ順序へ。",
  ],
  [
    "評点・意味",
    "v1.2の49欄と同値。日本語の定義・R04-5の35目盛り・評価対象を変えない。英語の文字合わせを新たな採点条件にしない。",
  ],
  [
    "公開演出",
    "PLACEBOと、基準説明の「きめつけないで」を併用。内部資料には仕掛けの仕様を残し、公開カードでは種明かしを繰り返さない。",
  ],
  [
    "根拠・留保",
    "出典ID・支持範囲・未確認を継承。今回、新たな外部検証、評価者間の再現性検証、30件の独立再審査は行っていない。",
  ],
];

export default function AboutPage() {
  return (
    <main className="px-4 pb-4 pt-20 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-[68rem]">
        <header className="border-b border-line pb-8">
          <p className="label !text-accent">ABOUT / TRIAL ASSESSMENTS</p>
          <h1 className="mt-3 text-[2rem] font-medium leading-[1.15] tracking-[-0.025em] sm:text-[2.6rem]">
            方針
          </h1>
          <p className="mt-7 max-w-[44rem] text-[1.05rem] leading-[2]">
            世界のFLIP図鑑は、現実の当たり前に具体的な仕掛けを置き、
            人が関わる経験を通して、その当たり前の別の姿を立ち上げた企画を記録する。
            いま公開しているのは、評価基準 v1.3 とその目盛りで読み直した
            <span className="tnum">{cases.length}</span>件の先行事例である。
          </p>
          <p className="mt-4 max-w-[44rem] text-13 leading-[2] text-mute">
            {cases.length}件49欄の点数は v1.2 で保存した試行値をそのまま再提出したもので、
            今回、新たな外部リサーチ・独立再採点を行った結果ではない。
          </p>
        </header>

        <section className="pt-12">
          <H2 ja="読むときの前提" latin="BEFORE YOU READ" />
          <dl className="max-w-[46rem] space-y-8">
            {PREMISES.map(([k, v]) => (
              <div key={k}>
                <dt className="text-13 font-medium">{k}</dt>
                <dd className="mt-2 text-13 leading-[2]">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="pt-14">
          <H2 ja="収録した7件" latin="SEVEN CASES" />
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
                  <p className="mt-1 text-12 leading-[1.9] text-mute">{c.target}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="pt-14">
          <H2 ja="今回の扱い" latin="CHANGE LOG" />
          <dl className="max-w-[46rem] border-t border-line">
            {CHANGES.map(([k, v]) => (
              <div
                key={k}
                className="grid gap-1 border-b border-line py-3.5 sm:grid-cols-[7rem_1fr] sm:gap-5"
              >
                <dt className="label pt-0.5">{k}</dt>
                <dd className="text-13 leading-[1.95]">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 max-w-[44rem] text-13 leading-[2] text-mute">
            前版までの変更を、今回の変更と混ぜない。v1.1→v1.2では、越境性を七角形から外して当事者性を新設し、
            Banksy と Pokémon GO の必然性を5から4へ変更している。
            これらは前版で保存済みの判断であり、今回改めて点数を下げたわけではない。
          </p>
        </section>

        <section className="pt-14">
          <H2 ja="今回の確かさと限界" latin="REVIEW LIMITS" />
          <div className="max-w-[44rem] space-y-5 text-13 leading-[2]">
            <p>
              軸の意味と値を固定した上で、表示名と並びを変更した。7件の点数と理由を資料へ揃えて載せられることは、
              測定の客観性や、別の審査者が同じ点を付けることの証明ではない。
              必然性4／5と当事者性1／2・4／5などには編集判断の幅が残る。
            </p>
            <p>
              低い創発性が出ている記録鑑賞と、実際に行為する企画とでは、評価する受け手の立場が異なる。
              表・七角形だけを切り離して作品全体の順位にしない。
              名称の遊びは、誤りへの免責や根拠不足を隠すためには使わない。
            </p>
            <p className="text-mute">
              照合した内容：7項目の定義と35目盛り、7件49評点、短評、評価対象、49欄の理由・留保・出典IDをv1.2と照合。
              表・図の描画値は内部IDによって対応させ、位置の入れ替えで誤って点を移さない。
            </p>
            <p className="text-mute">
              出典の確認日は旧Workの 2026-09-20 であり、今回すべてを再閲覧したという意味ではない。
              各CASEの出典索引には、支持範囲と留保をそのまま残している。
            </p>
          </div>
        </section>

        <section className="pt-14">
          <H2 ja="図版について" latin="ON THE PLATES" />
          <div className="max-w-[44rem] space-y-4 text-13 leading-[2]">
            <p>
              実物の写真は権利処理が必要なため一切掲載していない。
              かわりに、CASEごとに固有の作図プログラムで配置図を描いている。
              静止時は《変容前の配置》を示し、触れると《配置操作の実行後》へ移る。
            </p>
            <p className="text-mute">
              共通のパターン生成器で乱数違いを並べる作りにはしない。
              図版は事例ごとに別の図として書き下ろす。
            </p>
          </div>
        </section>

        <p className="label mt-16 max-w-[42rem] leading-[2]">
          ここに収録した制作者が、自らの活動をFLIPと呼んでいるわけではない。
          収録は賞賛・推奨・免責を意味しない。訂正・追加情報は編集部まで。
        </p>
      </div>
    </main>
  );
}
