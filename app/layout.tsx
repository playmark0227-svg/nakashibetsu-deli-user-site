import type { Metadata } from "next";
import { Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import "./globals.css";
import AgeVerifyGuard from "@/components/AgeVerifyGuard";

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
  title: {
    default: "Velvet | 中標津 プレミアム エスコート",
    template: "%s | Velvet",
  },
  description: "中標津エリアの上質なエスコートサービス情報。在籍キャスト、店舗情報、出勤情報を掲載。",
  keywords: ["中標津", "デリヘル", "エスコート", "Velvet", "キャスト", "店舗情報"],
  authors: [{ name: "Velvet" }],
  openGraph: {
    title: "Velvet | 中標津 プレミアム エスコート",
    description: "中標津エリアの上質なエスコートサービス情報。",
    type: "website",
    locale: "ja_JP",
  },
  robots: { index: true, follow: true },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
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
