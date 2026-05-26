import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import "./globals.css";
import AgeVerifyGuard from "@/components/AgeVerifyGuard";

const SITE_URL = "https://playmark0227-svg.github.io/nakashibetsu-deli-user-site";
// Next.js does NOT auto-prepend basePath to metadata.manifest / metadata.icons URLs,
// so we prepend it manually for GitHub Pages.
const BASE = process.env.NODE_ENV === "production" ? "/nakashibetsu-deli-user-site" : "";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${shipporiMincho.variable} antialiased`}>
        <AgeVerifyGuard>{children}</AgeVerifyGuard>
      </body>
    </html>
  );
}
