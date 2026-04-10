'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgeVerifyPage() {
  const router = useRouter();

  useEffect(() => {
    const verified = localStorage.getItem('age_verified');
    if (verified === 'true') {
      router.push('/');
    }
  }, [router]);

  const handleAgree = () => {
    localStorage.setItem('age_verified', 'true');
    router.push('/');
  };

  const handleDisagree = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="min-h-screen bg-[#0b0a09] grain relative flex items-center justify-center p-6">
      <div className="relative max-w-xl w-full text-center">
        {/* Brand */}
        <div className="mb-12">
          <div className="font-serif text-5xl tracking-[0.18em] text-white mb-3">Velvet</div>
          <div className="text-[10px] tracking-[0.4em] text-[#c9a961] uppercase">
            Nakashibetsu Premium Escort
          </div>
        </div>

        <div className="hairline-gold w-16 mx-auto mb-12" />

        <div className="text-[10px] tracking-[0.4em] text-[#c9a961] uppercase mb-4">
          Age Verification
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-white mb-8 leading-relaxed">
          年齢確認
        </h1>

        <p className="text-sm text-neutral-400 leading-loose mb-12 max-w-md mx-auto">
          当サイトはアダルトコンテンツを含みます。<br />
          18歳未満の方、および高校生の方はご覧いただけません。<br />
          ご利用にあたっては各種法令を遵守してください。
        </p>

        <div className="text-base text-white font-serif mb-10">
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

        <p className="text-[10px] text-neutral-600 mt-12 tracking-wider">
          By entering, you confirm that you are 18 years of age or older.
        </p>
      </div>
    </div>
  );
}
