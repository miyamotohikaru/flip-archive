"use client";

import { usePathname } from "next/navigation";
import { langOf } from "./lang";

/** いま見ている頁の言語。URL の /en だけで決める。 */
export function useLang() {
  return langOf(usePathname() ?? "/");
}
