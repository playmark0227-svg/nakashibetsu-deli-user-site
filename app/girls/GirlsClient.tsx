'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WorkStatusBadge from '@/components/WorkStatusBadge';
import FavoriteButton from '@/components/FavoriteButton';
import { Star, Eye, Heart, Zap, Clock } from 'lucide-react';
import type { Girl, Shop } from '@/lib/supabase';
import type { GirlSchedule } from '@/lib/types';

type GirlWithSchedule = Girl & { schedule: GirlSchedule | null };

type FilterType = 'all' | 'working' | 'instant' | 'new';

interface GirlsClientProps {
  girls: GirlWithSchedule[];
  shops: Shop[];
}

export default function GirlsClient({ girls, shops }: GirlsClientProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedShop, setSelectedShop] = useState<string>('all');

  const filteredGirls = useMemo(() => {
    return girls.filter(girl => {
      // 店舗フィルター
      if (selectedShop !== 'all' && girl.shop_id !== selectedShop) return false;

      // ステータスフィルター
      switch (filter) {
        case 'working':
          return girl.schedule?.status === 'working';
        case 'instant':
          return girl.schedule?.instant_available === true;
        case 'new':
          return girl.is_new === true;
        default:
          return true;
      }
    });
  }, [girls, filter, selectedShop]);

  const workingCount = girls.filter(g => g.schedule?.status === 'working').length;
  const instantCount = girls.filter(g => g.schedule?.instant_available).length;
  const newCount = girls.filter(g => g.is_new).length;

  const filterButtons: { key: FilterType; label: string; count: number; icon?: React.ReactNode }[] = [
    { key: 'all', label: 'すべて', count: girls.length },
    { key: 'working', label: '出勤中', count: workingCount, icon: <span className="w-2 h-2 rounded-full bg-green-400 inline-block mr-1" /> },
    { key: 'instant', label: 'ソク姫OK', count: instantCount, icon: <Zap className="w-3 h-3 mr-1" /> },
    { key: 'new', label: '新人', count: newCount, icon: <Star className="w-3 h-3 mr-1" /> },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-rose-300 via-rose-300 to-rose-400 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              在籍キャスト一覧
            </h1>
            <p className="text-white/90 text-lg">
              {girls.length}名のキャストがあなたをお待ちしています
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* ステータスフィルター */}
            {filterButtons.map(btn => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === btn.key
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-rose-300 hover:text-rose-500'
                }`}
              >
                {btn.icon}
                {btn.label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  filter === btn.key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {btn.count}
                </span>
              </button>
            ))}

            {/* 店舗フィルター */}
            <div className="ml-auto">
              <select
                value={selectedShop}
                onChange={e => setSelectedShop(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-rose-400 bg-white"
              >
                <option value="all">全店舗</option>
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Girls Grid */}
      <section className="container mx-auto px-4 py-12">
        {filteredGirls.length > 0 ? (
          <>
            <p className="text-sm text-neutral-500 mb-6">
              {filteredGirls.length}名表示中
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredGirls.map((girl) => (
                <div key={girl.id} className="relative group">
                  {/* お気に入りボタン */}
                  <div className="absolute top-3 right-3 z-20">
                    <FavoriteButton girlId={girl.id} girlName={girl.name} size="sm" />
                  </div>

                  <Link
                    href={`/girls/${girl.id}`}
                    className="block bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-rose-100 transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 hover:border-rose-300"
                  >
                    {/* 新人バッジ */}
                    {girl.is_new && (
                      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        NEW
                      </div>
                    )}

                    {/* 画像 */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <Image
                        src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                        alt={girl.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        priority={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      {/* 出勤状況バッジ */}
                      {girl.schedule && (
                        <div className="absolute bottom-3 left-3 right-3">
                          <WorkStatusBadge
                            status={girl.schedule.status}
                            instantAvailable={girl.schedule.instant_available}
                            size="sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* 情報 */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-rose-500 transition-colors truncate">
                        {girl.name}
                      </h3>

                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                        <span>{girl.age}歳</span>
                        <span>•</span>
                        <span>T{girl.height}</span>
                        <span>•</span>
                        <span>B{girl.bust}</span>
                      </div>

                      {/* 出勤時間 */}
                      {girl.schedule && girl.schedule.status !== 'unknown' && (
                        <div className="text-xs space-y-1 pt-2 border-t border-gray-100">
                          {girl.schedule.status === 'working' && girl.schedule.start_time && (
                            <div className="text-gray-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {girl.schedule.start_time.substring(0, 5)} 〜 {girl.schedule.end_time?.substring(0, 5)}
                            </div>
                          )}
                          {girl.schedule.status === 'scheduled' && girl.schedule.start_time && (
                            <div className="text-blue-600 font-medium">
                              {girl.schedule.start_time.substring(0, 5)}〜 出勤予定
                            </div>
                          )}
                          {girl.schedule.instant_available && (
                            <div className="text-rose-600 font-bold flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              今すぐ遊べます！
                            </div>
                          )}
                        </div>
                      )}

                      {/* 閲覧数・評価 */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
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
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-2">
              {filter === 'working' && '現在出勤中のキャストはいません'}
              {filter === 'instant' && '現在ソク姫対応可能なキャストはいません'}
              {filter === 'new' && '新人キャストはいません'}
              {filter === 'all' && 'キャストが登録されていません'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors font-medium"
              >
                全キャストを表示
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
