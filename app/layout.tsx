import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import AgeVerifyGuard from "@/components/AgeVerifyGuard";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "中標津デリヘル情報 | ヘブンネット風",
    template: "%s | 中標津デリヘル情報",
  },
  description: "中標津エリアのデリヘル情報サイト。人気ランキング、新人情報、口コミレビューなど充実した情報をお届けします。",
  keywords: ["中標津", "デリヘル", "風俗", "ヘブンネット", "キャスト", "店舗情報", "新人", "ランキング"],
  authors: [{ name: "中標津デリヘル情報" }],
  openGraph: {
    title: "中標津デリヘル情報 | ヘブンネット風",
    description: "中標津エリアのデリヘル情報サイト。人気ランキング、新人情報、口コミレビューなど充実した情報をお届けします。",
    type: "website",
    locale: "ja_JP",
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body className={`${notoSansJP.variable} antialiased`}>
        <AgeVerifyGuard>{children}</AgeVerifyGuard>
      </body>
    </html>
  );
}
