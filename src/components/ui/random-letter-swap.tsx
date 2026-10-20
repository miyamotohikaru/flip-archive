"use client";

import { useRef } from "react";
import { motion, useAnimate, type AnimationOptions } from "motion/react";

/**
 * ホバーすると、一文字ずつ縦に入れ替わる文字列。
 *
 * 各文字は同じ字を上下に二枚重ねて持ち、上の字が抜けると同時に下の字がせり上がる。
 * 入れ替わる順番は毎回ばらばらにし、staggerDuration ずつずらして走らせる。
 * 終わったら見えないところで元の位置へ戻し、次のホバーに備える。
 */
export function RandomLetterSwap({
  label,
  className = "",
  transition = { type: "spring", duration: 0.7 },
  staggerDuration = 0.03,
  reverse = false,
}: {
  label: string;
  className?: string;
  transition?: AnimationOptions;
  /** 一文字ごとのずれ（秒） */
  staggerDuration?: number;
  /** true なら上から下へ入れ替わる */
  reverse?: boolean;
}) {
  const [scope, animate] = useAnimate();
  const busy = useRef(false);
  const letters = label.split("");
  const out = reverse ? "100%" : "-100%";
  const wait = reverse ? "-100%" : "100%";

  const swap = async () => {
    if (busy.current) return;
    busy.current = true;

    // 入れ替わる順番を毎回シャッフルする
    const order = letters.map((_, i) => i).sort(() => Math.random() - 0.5);
    const delayOf = new Array<number>(letters.length);
    order.forEach((idx, n) => (delayOf[idx] = n * staggerDuration));

    await Promise.all(
      letters.map((_, i) =>
        Promise.all([
          animate(`[data-top="${i}"]`, { y: out }, { ...transition, delay: delayOf[i] }),
          animate(`[data-bottom="${i}"]`, { y: "0%" }, { ...transition, delay: delayOf[i] }),
        ]),
      ),
    );

    letters.forEach((_, i) => {
      animate(`[data-top="${i}"]`, { y: "0%" }, { duration: 0 });
      animate(`[data-bottom="${i}"]`, { y: wait }, { duration: 0 });
    });
    busy.current = false;
  };

  return (
    <span ref={scope} onMouseEnter={swap} className={`relative inline-flex overflow-hidden ${className}`}>
      <span className="sr-only">{label}</span>
      {letters.map((ch, i) => (
        <span key={i} aria-hidden="true" className="relative inline-flex whitespace-pre">
          <motion.span data-top={i} className="relative" initial={{ y: "0%" }}>
            {ch}
          </motion.span>
          <motion.span data-bottom={i} className="absolute left-0 top-0" initial={{ y: wait }}>
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
