import type { Metadata } from "next";
import { axes } from "@/data/axes";

export const metadata: Metadata = {
  title: "評価について — 世界のFLIP図鑑",
  description:
    "PLACEBO 7軸（再知覚性・遊戯性・当事者性・必然性・誘発性・創発性・独創性）の定義と、5段階の目盛り、審査の考え方と手順。",
};

function Head({ ja, latin }: { ja: string; latin: string }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline gap-x-2.5">
      <h2 className="text-13 font-medium tracking-[0.02em]">{ja}</h2>
      <span className="label">{latin}</span>
    </div>
  );
}

export default function CriteriaPage() {
  return (
    <main className="px-4 pb-4 pt-20 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-[68rem]">
        <header className="border-b border-line pb-8">
          <p className="label !text-accent">CRITERIA / PLACEBO v1.3</p>
          <h1 className="mt-3 text-[2rem] font-medium leading-[1.15] tracking-[-0.025em] sm:text-[2.6rem]">
            評価について
          </h1>
          <p className="label mt-3 tnum">
            7軸 × 5段階 ／ 目盛り R04-5 ／ 2026年9月21日
          </p>
          <p className="mt-7 max-w-[44rem] text-[1.05rem] leading-[2]">
            現実の当たり前に具体的な仕掛けを置き、人が関わる経験を通して、
            その当たり前の別の姿を立ち上げる企画を読む。
            媒体や作者の権威ではなく、何の条件を変えると、何が起きるかを記述する。
          </p>
          <p className="mt-4 max-w-[44rem] text-13 leading-[2] text-mute">
            評点は企画の特徴を読むための編集判断であり、作者の偉大さ、作品全体の価値、
            参加者の心理変化の測定値ではない。すべての軸が高い企画だけを理想にしない。
          </p>
        </header>

        {/* 7行の公開説明 */}
        <section className="pt-12">
          <Head ja="7つの項目" latin="THE SEVEN" />
          <ol className="max-w-[48rem] border-t border-line">
            {axes.map((a) => (
              <li
                key={a.id}
                className="grid gap-1 border-b border-line py-4 sm:grid-cols-[12rem_1fr] sm:gap-6"
              >
                <div className="flex items-baseline gap-2.5">
                  <span className="label !text-accent tnum text-12">{a.letter}</span>
                  <div>
                    <p className="text-13 font-medium">{a.ja}</p>
                    <p className="label mt-0.5">{a.en}</p>
                  </div>
                </div>
                <p className="text-13 leading-[1.95]">{a.publicText}</p>
              </li>
            ))}
          </ol>
          <p className="label mt-3 leading-[1.9]">
            表示順は P・L・A・C・E・B・O で固定する。行の順序と各説明の冒頭は入れ替えない。
          </p>
        </section>

        {/* 各軸の定義と目盛り */}
        <section className="pt-16">
          <Head ja="項目ごとの定義と目盛り" latin="DEFINITIONS AND SCALES" />
          <div className="space-y-16 pt-4">
            {axes.map((a) => (
              <article key={a.id} className="border-t border-ink pt-6">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="label !text-accent tnum">{a.no}</span>
                  <span className="label tnum">{a.letter}</span>
                  <span className="label tnum opacity-70">内部ID {a.id}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="text-[1.5rem] font-medium tracking-[-0.02em]">
                    {a.ja}
                  </h3>
                  <p className="text-13 font-medium">{a.en}</p>
                </div>
                <p className="mt-1 text-13 text-mute">{a.lead}</p>

                <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
                  <div>
                    <p className="label mb-2">定義 DEFINITION</p>
                    <p className="max-w-[40rem] text-[0.9375rem] leading-[1.95]">
                      {a.definition}
                    </p>

                    <ol className="mt-7 border-t border-line">
                      {a.levels.map((lv, i) => (
                        <li
                          key={i}
                          className="grid grid-cols-[2rem_1fr] gap-3 border-b border-line py-3"
                        >
                          <span className="text-13 font-medium tnum">{i + 1}</span>
                          <span className="text-13 leading-[1.9]">{lv}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <aside className="space-y-6 lg:pt-1">
                    <div>
                      <p className="label mb-2">読み違えないための境界</p>
                      {a.boundary.map((b, i) => (
                        <p key={i} className="mt-2 text-12 leading-[1.95] text-mute">
                          {b}
                        </p>
                      ))}
                    </div>
                    <div>
                      <p className="label mb-2">採点理由に残すこと</p>
                      <p className="text-12 leading-[1.95] text-sub">{a.keep}</p>
                    </div>
                    <div>
                      <p className="label mb-2">ほかの軸との違い</p>
                      {a.distinct.map((d, i) => (
                        <p key={i} className="mt-2 text-12 leading-[1.95] text-mute">
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
          <Head ja="点の扱い" latin="HOW VALUES ARE READ" />
          <dl className="max-w-[46rem] border-t border-line">
            {[
              [
                "1〜5",
                "根拠に基づき、指定した働きの強さ・役割を判定できる状態。順序尺度であり、4が2の倍の価値ではない。",
              ],
              [
                "—（未評価）",
                "判断に必要な事実・比較が不足する状態。0・1・中間値で埋めない。データはnullで保持する。",
              ],
              [
                "適用対象外",
                "問い自体が対象に適用できない場合に理由付きで使う。固定画像の創発性が低い、といった低得点を避ける用途では使わない。",
              ],
            ].map(([k, v]) => (
              <div
                key={k}
                className="grid gap-1 border-b border-line py-3.5 sm:grid-cols-[8rem_1fr] sm:gap-5"
              >
                <dt className="label pt-0.5">{k}</dt>
                <dd className="text-13 leading-[1.95]">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 七角形の共通仕様 */}
        <section className="pt-16">
          <Head ja="七角形の共通仕様" latin="THE HEPTAGON" />
          <div className="max-w-[44rem] space-y-4 text-13 leading-[2]">
            <p>
              上端をPとし、時計回りにP・L・A・C・E・B・Oを置く。最大値は全軸5、目盛りは5段階。
              既存の値を項目名／内部IDで対応させ、配列の位置だけで移さない。
              多角形は塗りつぶさず、合計・面積による順位を付けない。
            </p>
            <p>
              名称・制作者・年、一行概要、七角形、80〜140字程度の短評を基本とする。
              対象版や受け手の違いは短く明示する。
              未評価がある場合も7軸を残し、欠けた頂点を補完・連結しない。
            </p>
            <p className="text-mute">
              共通表示：こす.くまの基準による企画の特徴の評価。作品の総合点ではありません。
            </p>
          </div>
        </section>

        {/* 審査の考え方と手順 */}
        <section className="pt-16">
          <Head ja="審査の考え方と手順" latin="HOW TO READ A FLIP" />
          <div className="max-w-[44rem] space-y-8">
            <div>
              <p className="text-13 font-medium">まず、誰の・どの経験を読むか</p>
              <p className="mt-2 text-13 leading-[2]">
                作品名だけでは採点しない。実施版・時期・場所・主な受け手・接触方法・必要情報・含める範囲・除外する範囲を先に記録する。
                購入者、実参加者、記録の視聴者を足し合わせない。人物の全活動、ゲームの後年機能、後世の名声を当初の仕掛けへ合算しない。
              </p>
            </div>
            <div>
              <p className="text-13 font-medium">点数の前に、作意記述を書く</p>
              <p className="mt-2 text-12 leading-[2] text-accent">
                当たり前 → 変えた条件 → 関わる理由と負担 → 起きる経験 → 次に生まれること → 見え直すもの
              </p>
              <p className="mt-2 text-13 leading-[2]">
                最初に何をした企画かを書く。事実、作者が述べる意図、記録された反応、図鑑の解釈、未確認を分ける。
                一つの事実が複数軸の根拠になってもよいが、それぞれ別の働きを説明する。
              </p>
            </div>
            <div>
              <p className="text-13 font-medium">各項目を、根拠と一緒に判定する</p>
              <p className="mt-2 text-13 leading-[2]">
                評点／当てはまる目盛り／具体的な理由／出典ID／留保を一組にする。
                隣の点と迷う場合は、何が確認できれば判定が変わるかを残す。
                出典はページ名・発信者・URL・確認日・支持範囲を記録する。
              </p>
            </div>
            <div>
              <p className="text-13 font-medium">隣の軸を、同じ理由で上げない</p>
              <p className="mt-2 text-13 leading-[2]">
                誘発性は関わる動機、遊戯性は過程の戯れ。再知覚性は別の輪郭、必然性はそこへ至る接続。
                当事者性は受け手に与える作用の位置、創発性は入力の後に生まれる内容と次への返り方。
                独創性だけは先行例との比較が必要になる。
              </p>
            </div>
            <div>
              <p className="text-13 font-medium">内部の記録は捨てない</p>
              <p className="mt-2 text-13 leading-[2]">
                自由・負担・越境・波及などを公開の固定欄や追加タグへ増やさない。
                ただし重要な注意や制約は内部に保存し、必要なものを短評へ織り込む。
                公開の簡潔さを理由に、根拠や不都合な事実を捨てない。
              </p>
            </div>
          </div>
        </section>

        <p className="label mt-16 max-w-[42rem] leading-[2]">
          1〜5の整数、合計・平均・総合順位を作らないこと、根拠不足を未評価として扱うこと、
          公開は短く・内部は根拠を残す二層構造。これらは変更しない。
        </p>
      </div>
    </main>
  );
}
