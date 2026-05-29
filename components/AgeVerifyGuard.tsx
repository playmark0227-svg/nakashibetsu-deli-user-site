'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 年齢確認ゲート（オーバーレイ方式）。
 *
 * 旧実装は children を isLoading で包み、静的エクスポート時に本文が
 * 「Loading」だけになり SEO/LCP が壊れていた。
 *
 * 新実装は本文を常に SSR したうえでゲートを上に被せる:
 *  - 本文は HTML に存在 → クローラーがインデックス可能、LCP も速い
 *  - layout の no-flash スクリプトが <html data-age="ok"> を付けるので
 *    確認済みユーザーにはゲートが一切描画されない（CSS で display:none）
 *  - /qr/* (名刺来店) と /age-verify はゲート対象外
 */
export default function AgeVerifyGuard() {
  const pathname = usePathname();
  const [verified, setVerified] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem('age_verified') === 'true') {
        setVerified(true);
        document.documentElement.setAttribute('data-age', 'ok');
      }
    } catch {
      // iOS Safari Private mode 等では localStorage 例外になり得る
    }
  }, []);

  const normalized = (pathname || '').replace(/\/+$/, '') || '/';
  const isExempt = normalized === '/age-verify' || normalized.startsWith('/qr');

  // 対象外ページ / 確認済みなら何も描画しない
  if (isExempt || verified) return null;

  const handleAgree = () => {
    try {
      localStorage.setItem('age_verified', 'true');
    } catch {}
    document.documentElement.setAttribute('data-age', 'ok');
    setVerified(true);
  };

  const handleDisagree = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div
      className="age-gate fixed inset-0 z-[9999] bg-[#0b0a09] grain flex items-center justify-center p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="年齢確認"
    >
      {/* ハイドレーション後・未確認のときのみ body スクロールを止める */}
      {mounted && <style>{`body{overflow:hidden!important}`}</style>}

      <div className="relative max-w-xl w-full text-center py-10">
        {/* Brand */}
        <div className="mb-10">
          <div className="font-serif text-5xl tracking-[0.18em] text-white mb-3">
            Velvet
          </div>
          <div className="text-[10px] tracking-[0.4em] text-[#c9a961] uppercase">
            Nakashibetsu Premium Escort
          </div>
        </div>

        <div className="hairline-gold w-16 mx-auto mb-10" />

        <div className="text-[10px] tracking-[0.4em] text-[#c9a961] uppercase mb-4">
          Age Verification
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-white mb-8 leading-relaxed">
          年齢確認
        </h1>

        <p className="text-sm text-neutral-400 leading-loose mb-10 max-w-md mx-auto">
          当サイトはアダルトコンテンツを含みます。
          <br />
          18歳未満の方、および高校生の方はご覧いただけません。
          <br />
          ご利用にあたっては各種法令を遵守してください。
        </p>

        <div className="text-base text-white font-serif mb-8">
          あなたは 18歳以上 ですか？
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleAgree}
            className="px-10 py-4 bg-[#c9a961] text-[#0b0a09] text-[11px] tracking-[0.25em] font-semibold uppercase hover:bg-white transition-colors"
          >
            Yes — Enter
          </button>
          <button
            onClick={handleDisagree}
            className="px-10 py-4 border border-[#2a2620] text-neutral-400 text-[11px] tracking-[0.25em] font-semibold uppercase hover:border-neutral-500 hover:text-neutral-200 transition-colors"
          >
            No — Exit
          </button>
        </div>

        <p className="text-[10px] text-neutral-600 mt-10 tracking-wider">
          By entering, you confirm that you are 18 years of age or older.
        </p>
      </div>
    </div>
  );
}
