import Link from 'next/link';
import { Home, Search, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 mb-4">
            <AlertCircle className="text-pink-600" size={40} />
          </div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ページが見つかりません
          </h2>
          <p className="text-gray-600">
            お探しのページは存在しないか、移動した可能性があります。
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg transition-all font-semibold"
          >
            <Home size={20} />
            <span>トップページへ戻る</span>
          </Link>

          <Link
            href="/girls"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all font-semibold"
          >
            <Search size={20} />
            <span>キャスト一覧を見る</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">人気のページ</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/shops"
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm transition-colors"
            >
              店舗一覧
            </Link>
            <Link
              href="/girls"
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm transition-colors"
            >
              キャスト一覧
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
