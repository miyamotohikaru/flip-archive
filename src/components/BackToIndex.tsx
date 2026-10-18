"use client";

import Link from "next/link";
import { useEffect } from "react";
import { loadReturn, saveReturn } from "@/lib/returnNav";
import { path, type Lang } from "@/i18n/lang";

/**
 * 索引へ戻る導線。
 * 索引側は「どのCASEを開いたか」を目印に位置を復元するので、
 * 前後のCASEへ移った場合は目印を今見ているCASEへ付け替えておく。
 */
export default function BackToIndex({ slug, lang = "ja" }: { slug: string; lang?: Lang }) {
  useEffect(() => {
    const st = loadReturn();
    if (st && st.slug !== slug) saveReturn({ ...st, slug });
  }, [slug]);

  return (
    <Link
      href={path(lang, "/cases")}
      scroll={false}
      className="label inline-flex items-center gap-2 transition-colors hover:!text-ink"
    >
      {lang === "en" ? "← Back to index" : "← 索引にもどる"}
    </Link>
  );
}
