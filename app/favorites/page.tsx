'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoriteButton from '@/components/FavoriteButton';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { Heart, ArrowRight, Eye, Star } from 'lucide-react';

interface Girl {
  id: string;
  shop_id: string;
  name: string;
  age: number | null;
  height: number | null;
  bust: number | null;
  thumbnail_url: string | null;
  is_new: boolean;
  view_count: number;
  ranking: number;
}

interface Shop {
  id: string;
  name: string;
}

export default function FavoritesPage() {
  const { favorites, loaded } = useFavorites();
  const [girls, setGirls] = useState<Girl[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loaded) return;
    if (favorites.length === 0) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch('/api/girls').then(r => r.json()),
      fetch('/api/shops').then(r => r.json()),
    ]).then(([girlsData, shopsData]) => {
      const favGirls = (girlsData as Girl[]).filter(g => favorites.includes(g.id));
      setGirls(favGirls);
      setShops(shopsData);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [favorites, loaded]);

  const shopMap = new Map(shops.map(s => [s.id, s]));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        <section className="bg-gradient-to-br from-rose-500 to-pink-600 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-4">
              <Heart className="w-5 h-5 text-white fill-white" />
              <span className="text-white font-bold">MY FAVORITES</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">お気に入り</h1>
            <p className="text-white/80">
              {loaded && !loading ? (
                <span><span className="text-white font-bold text-2xl">{girls.length}</span>名 登録中</span>
              ) : '読み込み中...'}
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-neutral-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : girls.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-20 h-20 text-neutral-200 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-neutral-700 mb-3">お気に入りはまだありません</h2>
              <p className="text-neutral-500 mb-8">
                キャストページの <Heart className="w-4 h-4 inline text-rose-400" /> ボタンでお気に入りに追加できます
              </p>
              <Link
                href="/girls"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-rose-500 text-white font-bold rounded-full hover:bg-rose-600 transition-colors"
              >
                <span>キャストを探す</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {girls.map(girl => {
                const shop = shopMap.get(girl.shop_id);
                return (
                  <div key={girl.id} className="relative group">
                    {/* お気に入りボタン */}
                    <div className="absolute top-3 right-3 z-20">
                      <FavoriteButton girlId={girl.id} girlName={girl.name} size="sm" />
                    </div>
                    <Link
                      href={`/girls/${girl.id}`}
                      className="block bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-rose-100 transition-all duration-300 transform hover:-translate-y-2 border border-neutral-200 hover:border-rose-300"
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
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-neutral-900 group-hover:text-rose-500 transition-colors truncate mb-1">
                          {girl.name}
                        </h3>
                        <p className="text-xs text-neutral-500 mb-1">
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
                            <span>#{girl.ranking}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
