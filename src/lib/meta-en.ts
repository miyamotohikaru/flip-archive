import type { Metadata } from "next";
import { OG_VERSION } from "@/app/og-version";

/** 英語の頁の共有タグ。呼び名は「World FLIP Archive」。 */
export function enMeta({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const url = `https://flip-archive.kosukuma.com/en${path}`;
  return {
    title: title ? `${title} — World FLIP Archive` : "World FLIP Archive",
    description,
    alternates: { canonical: url, languages: { ja: path || "/", en: `/en${path}` } },
    openGraph: {
      title: "World FLIP Archive",
      description,
      url,
      siteName: "World FLIP Archive",
      locale: "en_US",
      type: "website",
      images: [{ url: `/og.png?v=${OG_VERSION}`, width: 1200, height: 630, alt: "World FLIP Archive" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "World FLIP Archive",
      description,
      images: [`/og.png?v=${OG_VERSION}`],
    },
  };
}

export const EN_DESCRIPTION =
  "An archive of projects that place a concrete device in an everyday given and, through people's engagement, bring another face of that given into view. Seven precedents read on the seven PLACEBO axes.";
