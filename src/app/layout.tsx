import type { Metadata } from "next";
import { OG_VERSION } from "./og-version";
import { Inter, IBM_Plex_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { INTRO_PRELUDE } from "@/lib/intro";

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

const DESCRIPTION =
  "現実の当たり前に具体的な仕掛けを置き、人が関わる経験を通して、その当たり前の別の姿を立ち上げた企画を記録するアーカイブ。PLACEBO 7軸で読んだ先行7事例の試行審査結果。";

export const metadata: Metadata = {
  metadataBase: new URL("https://flip-archive.kosukuma.com"),
  title: "世界のFLIP図鑑 — WORLD FLIP ARCHIVE",
  description: DESCRIPTION,
  openGraph: {
    // 呼び名で出す。<title> の流用にしない。
    title: "世界のFLIP図鑑",
    description: DESCRIPTION,
    url: "https://flip-archive.kosukuma.com",
    siteName: "世界のFLIP図鑑",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: `/og.png?v=${OG_VERSION}`,
        width: 1200,
        height: 630,
        alt: "世界のFLIP図鑑 — WORLD FLIP ARCHIVE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "世界のFLIP図鑑",
    description: DESCRIPTION,
    images: [`/og.png?v=${OG_VERSION}`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // html の class は描画前の印（intro-seen）で書き換わるので、食い違いを咎めない
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_PRELUDE }} />
      </head>
      <body
        className={`${inter.variable} ${plexMono.variable} ${notoSansJp.variable}`}
      >
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
