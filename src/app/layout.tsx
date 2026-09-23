import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "世界のFLIP図鑑 — WORLD FLIP ARCHIVE",
  description:
    "現実の当たり前に具体的な仕掛けを置き、人が関わる経験を通して、その当たり前の別の姿を立ち上げた企画を記録するアーカイブ。PLACEBO 7軸で読んだ先行7事例の試行審査結果。",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${plexMono.variable} ${notoSansJp.variable}`}
      >
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
