'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgeVerifyPage() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('age_verified');
    if (verified === 'true') {
      router.push('/');
    }
  }, [router]);

  const handleAgree = () => {
    localStorage.setItem('age_verified', 'true');
    setIsVerified(true);
    router.push('/');
  };

  const handleDisagree = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full text-lg font-bold mb-6">
            18歳未満の方はご利用いただけません
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            年齢確認
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto mb-6"></div>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-800 font-semibold text-sm">
              ⚠️ このサイトはアダルトコンテンツを含みます
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="font-bold text-lg text-gray-800 mb-3">ご利用にあたって</h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">•</span>
                <span>あなたは18歳以上ですか？</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">•</span>
                <span>このサイトはアダルト向けの風俗情報サイトです</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">•</span>
                <span>18歳未満の方、高校生の方は閲覧できません</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">•</span>
                <span>入店・退店を含め法律を遵守してご利用ください</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handleAgree}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            はい、18歳以上です
          </button>
          <button
            onClick={handleDisagree}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-xl transition-all duration-200"
          >
            いいえ、18歳未満です
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          「はい」をクリックすることで、あなたが18歳以上であることに同意したものとみなします。
        </p>
      </div>
    </div>
  );
}
