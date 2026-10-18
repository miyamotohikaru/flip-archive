import type { Metadata } from "next";
import { cases, getCase } from "@/data/cases";
import CasePage from "@/components/pages/CasePage";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return {
    title: `${c.title}（${c.yearLabel}） — 世界のFLIP図鑑`,
    description: c.headline,
  };
}

export default async function Case({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CasePage slug={slug} lang="ja" />;
}
