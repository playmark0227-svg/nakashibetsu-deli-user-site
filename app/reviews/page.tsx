'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllShops, getAllGirls } from '@/lib/data';
import { reviews } from '@/data/mockData';
import { Star, MessageCircle, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale/ja';

export default function ReviewsPage() {
  const shops = getAllShops();
  const girls = getAllGirls();
  
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedGirl, setSelectedGirl] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  // フィルタリング
  const filteredReviews = reviews.filter((review) => {
    if (selectedShop && review.shopId !== selectedShop) return false;
    if (selectedGirl && review.girlId !== selectedGirl) return false;
    if (selectedRating && review.rating !== Number(selectedRating)) return false;
    return true;
  });

  // 最新順にソート
  const sortedReviews = [...filteredReviews].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              口コミ・レビュー
            </h1>
            <p className="text-gray-600">
              全{reviews.length}件の口コミ（表示中: {sortedReviews.length}件）
            </p>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="text-pink-600" size={20} />
              <h2 className="text-lg font-bold text-gray-800">絞り込み</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Shop Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  店舗
                </label>
                <select
                  value={selectedShop}
                  onChange={(e) => setSelectedShop(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">すべての店舗</option>
                  {shops.map((shop) => (
                    <option key={shop.id} value={shop.id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Girl Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  女の子
                </label>
                <select
                  value={selectedGirl}
                  onChange={(e) => setSelectedGirl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">すべての女の子</option>
                  {girls.map((girl) => (
                    <option key={girl.id} value={girl.id}>
                      {girl.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  評価
                </label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">すべての評価</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="1">⭐</option>
                </select>
              </div>
            </div>

            {(selectedShop || selectedGirl || selectedRating) && (
              <button
                onClick={() => {
                  setSelectedShop('');
                  setSelectedGirl('');
                  setSelectedRating('');
                }}
                className="mt-4 text-pink-600 hover:text-pink-700 font-semibold text-sm"
              >
                フィルターをクリア
              </button>
            )}
          </div>

          {/* Reviews List */}
          {sortedReviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500 text-lg">条件に一致する口コミが見つかりませんでした</p>
              <button
                onClick={() => {
                  setSelectedShop('');
                  setSelectedGirl('');
                  setSelectedRating('');
                }}
                className="mt-4 text-pink-600 hover:text-pink-700 font-semibold"
              >
                フィルターをクリア
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedReviews.map((review) => {
                const girl = girls.find((g) => g.id === review.girlId);
                const shop = shops.find((s) => s.id === review.shopId);

                return (
                  <div
                    key={review.id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Girl Info */}
                      <div className="flex items-center gap-4 md:w-64 flex-shrink-0">
                        <Link
                          href={`/girls/${review.girlId}`}
                          className="w-16 h-20 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center text-3xl hover:opacity-80 transition-opacity"
                        >
                          👧
                        </Link>
                        <div>
                          <Link
                            href={`/girls/${review.girlId}`}
                            className="font-bold text-lg text-gray-800 hover:text-pink-600 transition-colors"
                          >
                            {girl?.name}
                          </Link>
                          <p className="text-sm text-gray-500">{shop?.name}</p>
                          {girl && (
                            <p className="text-xs text-gray-400">
                              {girl.age}歳 / T{girl.height}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={18}
                                  className={
                                    i < review.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300'
                                  }
                                />
                              ))}
                            </div>
                            <span className="font-semibold text-gray-700">
                              {review.userName}
                            </span>
                            {review.verified && (
                              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                                認証済み
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {format(new Date(review.date), 'yyyy年M月d日', { locale: ja })}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Post Review Button */}
          <div className="mt-8 text-center">
            <Link
              href="/reviews/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <MessageCircle size={20} />
              <span>口コミを投稿する</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
