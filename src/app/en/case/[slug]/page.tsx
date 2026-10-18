import type { Metadata } from "next";
import { cases } from "@/data/cases";
import { getCaseIn } from "@/data/i18n";
import { enMeta } from "@/lib/meta-en";
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
  const c = getCaseIn(slug, "en");
  if (!c) return {};
  return enMeta({
    title: `${c.title} (${c.yearLabel})`,
    description: c.headline,
    path: `/case/${slug}`,
  });
}

export default async function CaseEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CasePage slug={slug} lang="en" />;
}
