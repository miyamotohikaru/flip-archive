import { axes } from "@/data/axes";
import { AXIS_ORDER, type Case, type Score } from "@/data/types";

/**
 * 七角形（評価基準 v1.3 の共通仕様）。
 *
 *  - 上端をPとし、時計回りにP・L・A・C・E・B・Oを置く。
 *  - 最大値は全軸5、目盛りは5段階。
 *  - 多角形は塗りつぶさない。合計・面積による順位を付けない。
 *  - 未評価がある場合も7軸を残し、欠けた頂点を補完・連結しない。
 */

const R = 100;
const CX = 150;
const CY = 150;

function point(i: number, level: number) {
  const a = (-90 + (360 / 7) * i) * (Math.PI / 180);
  const r = (R * level) / 5;
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r] as const;
}

function ringPath(level: number) {
  return (
    AXIS_ORDER.map((_, i) => {
      const [x, y] = point(i, level);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(" ") + " Z"
  );
}

export default function Heptagon({
  c,
  size = 300,
  labels = true,
  className = "",
}: {
  c: Case;
  size?: number;
  /** 頂点の軸名と点数を刷るか。索引の小さい図では落とす。 */
  labels?: boolean;
  className?: string;
}) {
  const scores: Score[] = AXIS_ORDER.map((id) => c.review[id].score);

  // 隣り合う評点のあいだだけを結ぶ。未評価の頂点は連結しない。
  const links: string[] = [];
  scores.forEach((s, i) => {
    const n = scores[(i + 1) % 7];
    if (s == null || n == null) return;
    const [x1, y1] = point(i, s);
    const [x2, y2] = point((i + 1) % 7, n);
    links.push(`M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}`);
  });

  const labelSummary = AXIS_ORDER.map((id, i) => {
    const a = axes[i];
    const s = c.review[id].score;
    return `${a.letter} ${a.ja} ${s ?? "未評価"}`;
  }).join("／");

  return (
    <svg
      viewBox="0 0 300 300"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`${c.title}のPLACEBO七角形。${labelSummary}。こす.くまの基準による企画の特徴の評価で、作品の総合点ではない。`}
    >
      {/* 目盛り。5段階の同心七角形。 */}
      {[1, 2, 3, 4, 5].map((lv) => (
        <path
          key={lv}
          d={ringPath(lv)}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={lv === 5 ? 1 : 0.6}
        />
      ))}

      {/* 軸。中心から各頂点へ。 */}
      {AXIS_ORDER.map((id, i) => {
        const [x, y] = point(i, 5);
        return (
          <line
            key={id}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke="var(--color-line)"
            strokeWidth={0.6}
          />
        );
      })}

      {/* 上端の目盛り数字。1〜5の順序尺度であることを図の中に残す。 */}
      {labels &&
        [1, 2, 3, 4, 5].map((lv) => (
          <text
            key={lv}
            x={CX - 5}
            y={CY - (R * lv) / 5 + 3.5}
            textAnchor="end"
            fill="var(--color-faint)"
            fontSize="8"
            fontFamily="var(--font-mono)"
          >
            {lv}
          </text>
        ))}

      {/* 評点。塗りつぶさない。 */}
      {links.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      ))}
      {scores.map((s, i) =>
        s == null ? null : (
          <circle
            key={i}
            cx={point(i, s)[0]}
            cy={point(i, s)[1]}
            r={2.4}
            fill="var(--color-ink)"
          />
        ),
      )}

      {/* 頂点の名と点 */}
      {labels &&
        AXIS_ORDER.map((id, i) => {
          const a = axes[i];
          const s = c.review[id].score;
          const [x, y] = point(i, 5);
          const dx = (x - CX) * 0.22;
          const dy = (y - CY) * 0.22;
          const anchor =
            Math.abs(x - CX) < 6 ? "middle" : x > CX ? "start" : "end";
          return (
            <g key={id}>
              <text
                x={x + dx}
                y={y + dy - (y < CY ? 4 : -2)}
                textAnchor={anchor}
                fill="var(--color-mute)"
                fontSize="9.5"
              >
                {a.letter} {a.jaShort}
              </text>
              <text
                x={x + dx}
                y={y + dy + (y < CY ? 6 : 10)}
                textAnchor={anchor}
                fill="var(--color-ink)"
                fontSize="10"
                fontFamily="var(--font-mono)"
              >
                {s ?? "—"}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
