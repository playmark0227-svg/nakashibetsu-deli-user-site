import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import "./globals.css";
import AgeVerifyGuard from "@/components/AgeVerifyGuard";

const SITE_URL = "https://playmark0227-svg.github.io/nakashibetsu-deli-user-site";
// Next.js does NOT auto-prepend basePath to metadata.manifest / metadata.icons URLs,
// so we prepend it manually for GitHub Pages.
const BASE = process.env.NODE_ENV === "production" ? "/nakashibetsu-deli-user-site" : "";

// Trimmed weights: each Japanese font weight subset is ~100KB.
// Only ship weights actually used by classNames in the codebase.
const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Velvet | 中標津 プレミアム エスコート",
    template: "%s | Velvet",
  },
  description: "中標津エリアの上質なエスコートサービス情報。在籍キャスト、店舗情報、出勤情報を掲載。",
  keywords: ["中標津", "デリヘル", "エスコート", "Velvet", "キャスト", "店舗情報"],
  authors: [{ name: "Velvet" }],
  manifest: `${BASE}/manifest.webmanifest`,
  applicationName: "Velvet",
  icons: {
    icon: [
      { url: `${BASE}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${BASE}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: `${BASE}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Velvet | 中標津 プレミアム エスコート",
    description: "中標津エリアの上質なエスコートサービス情報。",
    type: "website",
    locale: "ja_JP",
    siteName: "Velvet",
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Velvet",
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ff1f7a",
};

// 描画前に同期実行し、年齢確認済みなら <html data-age="ok"> を付ける。
// これにより確認済みユーザーはゲートのちらつきなく即コンテンツが見える。
// 未確認なら data-age 無し → CSS でゲートが被さる（本文は HTML に存在＝SEO/LCP OK）。
const ageGateNoFlashScript = `(function(){try{if(localStorage.getItem('age_verified')==='true'){document.documentElement.setAttribute('data-age','ok')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script dangerouslySetInnerHTML={{ __html: ageGateNoFlashScript }} />
      </head>
      <body className={`${notoSansJP.variable} ${shipporiMincho.variable} antialiased`}>
        {children}
        <AgeVerifyGuard />
      </body>
    </html>
  );
}
