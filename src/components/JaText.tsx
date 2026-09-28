import { Fragment } from "react";

/**
 * 和文を、句読点の切れ目で折り返す。
 *
 * 既定のままだと和文はどこでも折れるので、「街をつくり替えずに、街」で切れる。
 * 句読点のうしろだけを折り返し位置として許し、
 * ひと続きが行に収まらないときだけ、そこでも折る。
 */
export default function JaText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const parts = children.split(/(?<=[、。！？])/);
  return (
    <span
      className={`[word-break:keep-all] [overflow-wrap:anywhere] ${className}`}
    >
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p}
          {i < parts.length - 1 && <wbr />}
        </Fragment>
      ))}
    </span>
  );
}
