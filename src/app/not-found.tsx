"use client";

import Link from "next/link";
import { useLang } from "@/i18n/useLang";
import { path } from "@/i18n/lang";

export default function NotFound() {
  const lang = useLang();
  const en = lang === "en";
  return (
    <main className="flex min-h-screen items-center px-4 pt-20 sm:px-6">
      <div className="mx-auto w-full max-w-[68rem]">
        <p className="label !text-accent tnum">404</p>
        <h1 className="mt-3 text-[1.75rem] font-medium leading-[1.25] tracking-[-0.025em] sm:text-[2.5rem]">
          {en ? "This case is not in the archive yet." : "このCASEは、まだ収録していません。"}
        </h1>
        <p className="mt-4 max-w-[34rem] text-13 leading-[1.95] text-mute">
          {en
            ? "A gap is treated as the next research theme. The criteria are set out under Criteria."
            : "空白は、次の調査テーマとして扱う。評価の基準は「評価について」に置いてある。"}
        </p>
        <div className="mt-8 flex gap-6">
          <Link href={path(lang, "/cases")} className="label transition-colors hover:!text-ink">
            {en ? "← Index" : "← 索引へ"}
          </Link>
          <Link href={path(lang, "/criteria")} className="label transition-colors hover:!text-ink">
            {en ? "Criteria" : "評価について"}
          </Link>
        </div>
      </div>
    </main>
  );
}
