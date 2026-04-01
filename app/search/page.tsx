'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorkStatusBadge from '@/components/WorkStatusBadge';
import { Search, Filter, X, Eye, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface Girl {
  id: string;
  shop_id: string;
  name: string;
  age: number | null;
  height: number | null;
  bust: number | null;
  waist: number | null;
  hip: number | null;
  thumbnail_url: string | null;
  is_new: boolean;
  view_count: number;
  ranking: number;
  description: string | null;
  available_options: string[] | null;
}

interface Shop {
  id: string;
  name: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Girl[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // フィルター状態
  const [selectedShop, setSelectedShop] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [minHeight, setMinHeight] = useState('');
  const [maxHeight, setMaxHeight] = useState('');
  const [isNewOnly, setIsNewOnly] = useState(false);

  useEffect(() => {
    fetch('/api/shops')
      .then(r => r.json())
      .then(data => setShops(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    doSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doSearch(q: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (selectedShop) params.set('shopId', selectedShop);
      if (minAge) params.set('minAge', minAge);
      if (maxAge) params.set('maxAge', maxAge);
      if (minHeight) params.set('minHeight', minHeight);
      if (maxHeight) params.set('maxHeight', maxHeight);
      if (isNewOnly) params.set('isNew', 'true');

      const res = await fetch(`/api/girls?${params.toString()}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace(`/search?q=${encodeURIComponent(query)}`);
    doSearch(query);
  };

  const handleFilterChange = () => {
    doSearch(query);
  };

  const clearFilters = () => {
    setSelectedShop('');
    setMinAge('');
    setMaxAge('');
    setMinHeight('');
    setMaxHeight('');
    setIsNewOnly(false);
  };

  const hasActiveFilters = selectedShop || minAge || maxAge || minHeight || maxHeight || isNewOnly;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* ページヘッダー */}
        <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">キャスト検索</h1>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="名前・店舗名などで検索..."
                  className="w-full px-6 py-4 pl-14 bg-white rounded-full text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400 text-base"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors font-medium"
                >
                  検索
                </button>
              </div>
            </form>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* フィルターパネル */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-6 py-4 text-neutral-800 font-semibold hover:bg-neutral-50 rounded-2xl transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-rose-500" />
                <span>絞り込み</span>
                {hasActiveFilters && (
                  <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">ON</span>
                )}
              </div>
              {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showFilters && (
              <div className="px-6 pb-6 border-t border-neutral-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* 店舗 */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">店舗</label>
                    <select
                      value={selectedShop}
                      onChange={e => setSelectedShop(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-400 text-sm"
                    >
                      <option value="">全店舗</option>
                      {shops.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 年齢 */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">年齢</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="18"
                        min="18" max="50"
                        value={minAge}
                        onChange={e => setMinAge(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-400 text-sm"
                      />
                      <span className="text-neutral-400">〜</span>
                      <input
                        type="number"
                        placeholder="50"
                        min="18" max="50"
                        value={maxAge}
                        onChange={e => setMaxAge(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-400 text-sm"
                      />
                    </div>
                  </div>

                  {/* 身長 */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">身長 (cm)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="140"
                        min="140" max="180"
                        value={minHeight}
                        onChange={e => setMinHeight(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-400 text-sm"
                      />
                      <span className="text-neutral-400">〜</span>
                      <input
                        type="number"
                        placeholder="180"
                        min="140" max="180"
                        value={maxHeight}
                        onChange={e => setMaxHeight(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-400 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* 新人のみ */}
                <div className="mt-4 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={isNewOnly}
                    onChange={e => setIsNewOnly(e.target.checked)}
                    className="w-4 h-4 text-rose-500 rounded"
                  />
                  <label htmlFor="isNew" className="text-sm font-medium text-neutral-700">新人キャストのみ</label>
                </div>

                <div className="mt-4 flex items-center space-x-3">
                  <button
                    onClick={handleFilterChange}
                    className="px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors font-medium text-sm"
                  >
                    絞り込む
                  </button>
                  {hasActiveFilters && (
                    <button
                      onClick={() => { clearFilters(); setTimeout(() => doSearch(query), 100); }}
                      className="flex items-center space-x-1 px-4 py-2 border border-neutral-200 text-neutral-600 rounded-full hover:bg-neutral-50 transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                      <span>クリア</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 検索結果 */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-neutral-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="text-neutral-600 mb-4 font-medium">
                {query ? `「${query}」の` : ''}検索結果：<span className="text-rose-500 font-bold">{results.length}名</span>
              </p>

              {results.length === 0 ? (
                <div className="text-center py-20">
                  <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500 text-lg">該当するキャストが見つかりませんでした</p>
                  <p className="text-neutral-400 text-sm mt-2">別のキーワードや条件でお試しください</p>
                  <Link href="/girls" className="inline-block mt-6 px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors font-medium">
                    全キャストを見る
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {results.map(girl => {
                    const shop = shops.find(s => s.id === girl.shop_id);
                    return (
                      <Link
                        key={girl.id}
                        href={`/girls/${girl.id}`}
                        className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-rose-100 transition-all duration-300 transform hover:-translate-y-1 border border-neutral-200 hover:border-rose-300"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                          {girl.is_new && (
                            <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                              NEW
                            </div>
                          )}
                          <Image
                            src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                            alt={girl.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-neutral-900 group-hover:text-rose-500 transition-colors truncate mb-1">
                            {girl.name}
                          </h3>
                          <p className="text-xs text-neutral-500 mb-2">
                            {girl.age}歳 · T{girl.height} · B{girl.bust}
                          </p>
                          {shop && (
                            <p className="text-xs text-neutral-400 truncate">{shop.name}</p>
                          )}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{girl.view_count.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <span>{girl.ranking}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-pulse text-neutral-400">読み込み中...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
