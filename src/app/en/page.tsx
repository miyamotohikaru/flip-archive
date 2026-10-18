import type { Metadata } from "next";
import { EN_DESCRIPTION, enMeta } from "@/lib/meta-en";
import HomePage from "@/components/pages/HomePage";

export const metadata: Metadata = enMeta({ description: EN_DESCRIPTION, path: "" });

export default function HomeEn() {
  return <HomePage lang="en" />;
}
