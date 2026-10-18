"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Intro from "@/components/Intro";
import { LANGS, langOf, path, stripLang } from "@/i18n/lang";

const NAV = [
  { href: "/", label: "OVERVIEW", ja: "図版" },
  { href: "/cases", label: "INDEX", ja: "索引" },
  { href: "/criteria", label: "CRITERIA", ja: "評価" },
  { href: "/about", label: "ABOUT", ja: "方針" },
];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const lang = langOf(pathname);
  const here = stripLang(pathname);
  const isHome = here === "/";

  // <html lang> は layout で ja に固定しているので、英語の頁ではここで直す
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const [scrolled, setScrolled] = useState(false);

  // 本文が頭の下をくぐると読めなくなるので、送ったときだけ地色を敷く。
  // 図版ビューは本文を送らないので、地色は敷かない。
  useEffect(() => {
    if (isHome) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.classList.toggle("locked", isHome);
    document.body.classList.toggle("scrollable", !isHome);
    return () => {
      document.body.classList.remove("locked");
      document.body.classList.remove("scrollable");
    };
  }, [isHome]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-wrap items-baseline gap-x-4 gap-y-2 px-4 py-3.5 sm:gap-x-7 sm:px-6 sm:py-4">
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 border-b border-line bg-bg transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <Link
          href={path(lang, "/")}
          className="pointer-events-auto group order-1 flex items-baseline gap-2"
        >
          <span className="text-13 font-medium tracking-[-0.01em]">
            {lang === "en" ? "World FLIP Archive" : "世界のFLIP図鑑"}
          </span>
          {lang === "ja" && (
            <span className="label hidden sm:inline">
              WORLD FLIP ARCHIVE
            </span>
          )}
        </Link>

        {/* 携帯は名と言語を一行目に、ナビを二行目に置く。一行には収まらない */}
        <nav className="pointer-events-auto order-3 flex w-full items-baseline gap-3 sm:order-2 sm:w-auto sm:gap-6">
          {NAV.map((n) => {
            const active =
              n.href === "/"
                ? isHome
                : n.href === "/cases"
                  ? here.startsWith("/cases") || here.startsWith("/case/")
                  : here.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={path(lang, n.href)}
                className="group relative block"
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={`label transition-colors duration-300 ${
                    active ? "!text-ink" : "group-hover:!text-ink"
                  }`}
                >
                  {n.label}
                </span>
                <span
                  className={`absolute -bottom-1 left-0 block h-px bg-ink transition-all duration-500 ease-out ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* 言語。いま見ている頁のまま移る */}
        {/* 帯の版が右上を通るので、地色の札を敷いて字を浮かせる */}
        <span className="pointer-events-auto order-2 -my-1 ml-auto flex items-baseline gap-2 rounded-full bg-bg/90 px-2.5 py-1 sm:order-3">
          {LANGS.map((l) => (
            <Link
              key={l}
              href={path(l, here)}
              hrefLang={l}
              scroll={false}
              aria-current={l === lang ? "true" : undefined}
              className={`label transition-colors duration-300 ${
                l === lang ? "!text-ink" : "hover:!text-ink"
              }`}
            >
              {l === "ja" ? "JA" : "EN"}
            </Link>
          ))}
        </span>
      </header>

      {children}

      {/* 図版ビューにフッターは置かない。版面を固定要素で汚さないため。 */}
      {!isHome && (
        <footer className="mx-auto mt-24 flex max-w-[68rem] items-end justify-between border-t border-line px-4 py-5 sm:px-6">
          <span className="label">
            KOSU.KUMA<span className="hidden sm:inline"> / INTERNAL WORKING DRAFT</span>
          </span>
          <span className="label hidden sm:inline">
            {lang === "en" ? "PLACEBO CRITERIA v1.3 · R04-5" : "PLACEBO 評価基準 v1.3 ・ R04-5"}
          </span>
        </footer>
      )}

      <Intro />
    </>
  );
}
