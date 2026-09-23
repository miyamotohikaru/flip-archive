"use client";

import { useEffect, useRef, useState } from "react";
import Plate from "@/components/Plate";
import type { Case } from "@/data/types";

/**
 * 詳細ページの図版。
 *
 * ホバーできる端末では、初期表示が《変容前》で、ホバー／クリックで《配置操作》が走る。
 * ホバーのない端末では触れる手がかりがないので、二つの状態を自分で往復させる。
 * 一度触られたら往復を止め、以後はタップで切り替える。
 */
export default function CaseHero({ c }: { c: Case }) {
  const [on, setOn] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [manual, setManual] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (canHover || manual) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let alive = true;
    // 変容前で少し止まり、実行後で長めに止まる。
    const wait = (next: boolean) => (next ? 2600 : 2000);
    const step = (next: boolean) => {
      if (!alive) return;
      setOn(next);
      timer.current = window.setTimeout(() => step(!next), wait(next));
    };
    timer.current = window.setTimeout(() => step(true), 1100);

    return () => {
      alive = false;
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [canHover, manual]);

  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setManual(true);
  };

  const auto = !canHover && !manual;

  return (
    <div className="select-none">
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <p className="label">
          <span className={on ? "" : "!text-ink"}>変容前</span>
          <span className="mx-1.5 opacity-50">／</span>
          <span className={on ? "!text-ink" : ""}>実行後</span>
        </p>
        <p className="label opacity-70">{canHover ? "HOVER" : auto ? "AUTO" : "TAP"}</p>
      </div>
      <button
        type="button"
        onMouseEnter={() => canHover && setOn(true)}
        onMouseLeave={() => canHover && setOn(false)}
        onFocus={() => canHover && setOn(true)}
        onBlur={() => canHover && setOn(false)}
        onClick={() => {
          if (!canHover) stop();
          setOn((v) => !v);
        }}
        aria-pressed={on}
        className="block w-full cursor-pointer"
      >
        <Plate c={c} active={on} className="block aspect-[1/1.38] w-full" />
      </button>
      <p className="label mt-2.5 leading-[1.9] opacity-70">
        本図鑑が生成した配置図。実物の写真ではない。
      </p>
    </div>
  );
}
