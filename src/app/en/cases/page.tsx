import type { Metadata } from "next";
import { enMeta } from "@/lib/meta-en";
import IndexPage from "@/components/pages/IndexPage";

export const metadata: Metadata = enMeta({
  title: "Index",
  description: "The seven precedents, laid out by plate and by score on the seven PLACEBO axes.",
  path: "/cases",
});

export default function CasesEn() {
  return <IndexPage lang="en" />;
}
