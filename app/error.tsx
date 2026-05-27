'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen qr-bg-rose flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center border-4 border-pink-300 relative overflow-hidden">
        <div
          className="absolute inset-0 qr-glitter pointer-events-none opacity-50"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 mb-4 border-4 border-pink-300">
            <AlertTriangle
              className="text-rose-600"
              size={36}
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            エラーが発生しました
          </h1>
          <div className="qr-underline w-24 mx-auto my-3" aria-hidden="true" />
          <p className="text-base text-gray-700 font-bold mb-6">
            申し訳ございません。
            <br />
            ページの読み込み中に
            <br />
            問題が発生しました
            <span className="qr-heart inline-block ml-1 text-pink-500" aria-hidden="true">
              ♡
            </span>
          </p>

          {error.message && (
            <div className="mb-6 p-4 bg-rose-50 rounded-2xl border-2 border-rose-200 text-left">
              <p className="text-xs text-rose-800 font-mono break-all">
                {error.message}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={reset}
              className="qr-tap-feedback qr-cta-pulse w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-pink-600 rounded-full text-xl font-black shadow-xl border-4 border-yellow-300"
            >
              <RefreshCw size={22} strokeWidth={3} aria-hidden="true" />
              <span>もう一度試す</span>
            </button>

            <Link
              href="/"
              className="qr-tap-feedback w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-lg font-black shadow-lg border-2 border-pink-300"
            >
              <Home size={20} strokeWidth={3} aria-hidden="true" />
              <span>トップへ戻る</span>
            </Link>
          </div>

          <p className="mt-6 text-xs text-pink-400 font-bold">
            ♥ Velvet — Nakashibetsu Premium ♥
          </p>
        </div>
      </div>
    </div>
  );
}
