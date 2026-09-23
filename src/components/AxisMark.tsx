import type { AxisId } from "@/data/types";

/**
 * 7軸のしるし。
 *
 * 版（図版）と同じ語彙——細い線、丸、四角、破線——だけで組む。
 * 色は currentColor を継ぐので、置いた場所の文字色にそのまま乗る。
 */

const V = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.05,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** 同じものが、別の輪郭で立ち上がる。 */
function PS() {
  return (
    <>
      <rect x="3.5" y="9" width="11" height="11" {...V} />
      <rect x="9.5" y="4" width="11" height="11" {...V} strokeDasharray="2 2" />
    </>
  );
}

/** 着く先は同じでも、通る道そのものが面白い。 */
function PL() {
  return (
    <>
      <path d="M4.5 19 L19.5 5" {...V} strokeDasharray="2 2" opacity="0.5" />
      <path d="M4.5 19 C4 8.5 14.5 20.5 19.5 5" {...V} />
      <circle cx="4.5" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19.5" cy="5" r="1.5" {...V} />
    </>
  );
}

/** 自分の一手が、共有しているものを動かす。 */
function AG() {
  return (
    <>
      <circle cx="14.5" cy="11" r="6" {...V} />
      <path
        d="M20.5 13.5 A6 6 0 0 1 9.5 15.5"
        {...V}
        strokeDasharray="2 2"
        opacity="0.6"
      />
      <path d="M3.5 20 L9 14.8" {...V} />
      <path d="M9 14.8 L6.4 15.9 M9 14.8 L7.9 17.4" {...V} />
      <circle cx="3.5" cy="20" r="1.5" fill="currentColor" stroke="none" />
    </>
  );
}

/** 誘い・行為・見え直しが、ひと続きの輪でつながる。 */
function CO() {
  return (
    <>
      <circle cx="7" cy="12" r="4.2" {...V} />
      <circle cx="12" cy="12" r="4.2" {...V} />
      <circle cx="17" cy="12" r="4.2" {...V} />
    </>
  );
}

/** 手間を越えて、そこへ引かれていく。 */
function EP() {
  return (
    <>
      <circle cx="15.5" cy="12" r="5.5" {...V} strokeDasharray="2 2" />
      <circle cx="15.5" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M2.5 5.5 L9.4 9.3 M2 12 L8.6 12 M2.5 18.5 L9.4 14.7" {...V} />
    </>
  );
}

/** 下からの入力が、作者の決めていない枝をつくる。 */
function EM() {
  return (
    <>
      <path d="M12 21 L12 16" {...V} />
      <path d="M12 16 L7 11 M12 16 L17 11" {...V} />
      <path d="M7 11 L4.5 6 M7 11 L9.5 6 M17 11 L14.5 6 M17 11 L19.5 6" {...V} />
      <circle cx="12" cy="21" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="5.4" r="1.1" {...V} />
      <circle cx="9.5" cy="5.4" r="1.1" {...V} />
      <circle cx="14.5" cy="5.4" r="1.1" {...V} />
      <circle cx="19.5" cy="5.4" r="1.1" {...V} />
    </>
  );
}

/** 先行例と並べたとき、そこだけ形が違う。 */
function OR() {
  return (
    <>
      <rect x="2" y="10" width="4.4" height="4.4" {...V} opacity="0.55" />
      <rect x="8" y="10" width="4.4" height="4.4" {...V} opacity="0.55" />
      <rect x="14" y="10" width="4.4" height="4.4" {...V} opacity="0.55" />
      <path d="M21 8.4 L23.4 12.2 L21 16 L18.6 12.2 Z" {...V} />
    </>
  );
}

const MARKS: Record<AxisId, () => React.ReactElement> = {
  PS,
  PL,
  AG,
  CO,
  EP,
  EM,
  OR,
};

export default function AxisMark({
  axis,
  size = 24,
  className = "",
}: {
  axis: AxisId;
  size?: number;
  className?: string;
}) {
  const Mark = MARKS[axis];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <Mark />
    </svg>
  );
}
