import Link from 'next/link';
import { Home, Search, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen qr-bg-rose flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center border-4 border-pink-300 relative overflow-hidden">
        <div
          className="absolute inset-0 qr-glitter pointer-events-none opacity-50"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="flex items-center justify-center gap-2 mb-2 text-pink-400">
            <Sparkles size={18} className="qr-sparkle" aria-hidden="true" />
            <span className="text-xs font-black tracking-[0.4em] uppercase">
              Page Not Found
            </span>
            <Sparkles size={18} className="qr-sparkle" aria-hidden="true" />
          </div>

          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-br from-pink-500 to-rose-600 bg-clip-text text-transparent leading-none">
            404
          </h1>

          <div className="qr-underline w-24 mx-auto my-4" aria-hidden="true" />

          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">
            ページが
            <br />
            見つかりません
            <span className="qr-heart inline-block ml-1 text-pink-500" aria-hidden="true">
              ♡
            </span>
          </h2>
          <p className="text-base text-gray-700 font-bold mb-8">
            お探しのページは存在しないか、
            <br />
            移動した可能性があります
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="qr-tap-feedback qr-cta-pulse w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-pink-600 rounded-full text-xl font-black shadow-xl border-4 border-yellow-300"
            >
              <Home size={22} strokeWidth={3} aria-hidden="true" />
              <span>トップへ戻る</span>
            </Link>

            <Link
              href="/girls"
              className="qr-tap-feedback w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-lg font-black shadow-lg border-2 border-pink-300"
            >
              <Search size={20} strokeWidth={3} aria-hidden="true" />
              <span>キャスト一覧</span>
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
