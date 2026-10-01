import type { Score } from "@/data/types";

/**
 * 評点を5つの目盛りで示す。数字だけだと軸ごとの差が読み取れないので、
 * 長さで一目に分かるようにする。未評価は空のまま。
 */
export default function ScoreBar({
  score,
  className = "",
}: {
  score: Score;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-[3px] ${className}`} aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`h-[5px] flex-1 rounded-[1px] ${
            score != null && n <= score ? "bg-ink" : "bg-line"
          }`}
        />
      ))}
    </div>
  );
}
