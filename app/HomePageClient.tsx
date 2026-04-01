'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Star, Crown, ArrowRight, Eye } from 'lucide-react';
import { Shop, Girl } from '@/lib/supabase';

interface HomePageClientProps {
  shops: Shop[];
  rankedGirls: (Girl & { avgRating: number })[];
}

export default function HomePageClient({ shops, rankedGirls }: HomePageClientProps) {
  const [selectedShopId, setSelectedShopId] = useState<string>('all');
  
  const filteredRankedGirls = selectedShopId === 'all' 
    ? rankedGirls 
    : rankedGirls.filter(g => g.shop_id === selectedShopId);

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-300 to-rose-400 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">人気ランキング</h2>
            <p className="text-gray-500 text-sm mt-1">今、最も注目されているキャスト</p>
          </div>
        </div>
        
        <select
          value={selectedShopId}
          onChange={(e) => setSelectedShopId(e.target.value)}
          className="bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 hover:border-rose-300 transition-colors"
        >
          <option value="all">全店舗</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {filteredRankedGirls.slice(0, 10).map((girl, index) => {
          const shop = shops.find(s => s.id === girl.shop_id);
          
          return (
            <Link
              key={girl.id}
              href={`/girls/${girl.id}`}
              className="group relative"
            >
              {/* Rank Badge */}
              <div className="absolute -top-2 -left-2 z-20">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900' : ''}
                  ${index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900' : ''}
                  ${index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900' : ''}
                  ${index >= 3 ? 'bg-gradient-to-br from-rose-300 to-rose-400 text-white' : ''}
                `}>
                  {index + 1}
                </div>
              </div>

              <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-3 border border-gray-200 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-100 transition-all">
                {/* Top 3 Crown */}
                {index < 3 && (
                  <div className="absolute top-3 right-3 z-10">
                    <Crown className="w-6 h-6 text-yellow-500 filter drop-shadow-lg" />
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-[1]" />
                
                {girl.thumbnail_url ? (
                  <img 
                    src={`${girl.thumbnail_url}?t=${Date.now()}`}
                    alt={girl.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-rose-100 to-rose-100 flex items-center justify-center">
                    <Crown className="w-16 h-16 text-rose-300" />
                  </div>
                )}

                {/* View count */}
                <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 z-10">
                  <Eye className="w-3 h-3 text-gray-600" />
                  <span className="text-xs text-gray-600 font-medium">{girl.view_count.toLocaleString()}</span>
                </div>

                {/* Rating */}
                {girl.avgRating > 0 && (
                  <div className="absolute top-3 left-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 z-10">
                    <Star size={12} className="text-rose-400 fill-rose-400" />
                    <span className="text-xs text-gray-900 font-semibold">{girl.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <h3 className="font-bold text-base text-gray-900 group-hover:text-pink-600 transition-colors mb-1">
                {girl.name}
              </h3>
              <p className="text-xs text-gray-600 mb-1">{girl.age}歳 / T{girl.height} / B{girl.bust}</p>
              <p className="text-xs text-gray-500">{shop?.name}</p>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/ranking"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-rose-200 transition-all transform hover:scale-105"
        >
          <span>ランキングをもっと見る</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
