'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from '@/components/FavoriteButton';
import { Heart } from 'lucide-react';
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
      if (selectedShop !== 'all' && girl.shop_id !== selectedShop) return false;
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

  const filterButtons: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'ALL', count: girls.length },
    { key: 'working', label: 'WORKING', count: workingCount },
    { key: 'instant', label: 'AVAILABLE', count: instantCount },
    { key: 'new', label: 'NEW', count: newCount },
  ];

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      {/* Page Header */}
      <section className="bg-[#0b0a09] text-white py-24 md:py-32 grain relative">
        <div className="container mx-auto px-6 relative text-center">
          <div className="text-[11px] tracking-[0.4em] text-[#c9a961] uppercase mb-4">Our Cast</div>
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">在籍キャスト</h1>
          <div className="hairline-gold w-16 mx-auto mb-6" />
          <p className="text-sm text-neutral-400 tracking-wider">
            <span className="font-serif text-2xl text-[#c9a961] mx-1">{girls.length}</span> Casts
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-[#e7e1d6] sticky top-20 z-40">
        <div className="container mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            {filterButtons.map(btn => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`px-4 py-2 text-[11px] tracking-[0.2em] font-semibold uppercase transition-colors border ${
                  filter === btn.key
                    ? 'bg-[#14110d] text-white border-[#14110d]'
                    : 'bg-transparent text-[#76705f] border-[#e7e1d6] hover:border-[#14110d] hover:text-[#14110d]'
                }`}
              >
                {btn.label}
                <span className="ml-2 text-[10px] opacity-70">({btn.count})</span>
              </button>
            ))}

            <div className="ml-auto">
              <select
                value={selectedShop}
                onChange={e => setSelectedShop(e.target.value)}
                className="px-4 py-2 border border-[#e7e1d6] text-[11px] tracking-[0.15em] uppercase text-[#14110d] bg-white focus:outline-none focus:border-[#14110d]"
              >
                <option value="all">ALL SHOPS</option>
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Girls Grid */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        {filteredGirls.length > 0 ? (
          <>
            <p className="text-[11px] tracking-[0.2em] text-[#76705f] uppercase mb-10">
              {filteredGirls.length} Cast{filteredGirls.length > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-14">
              {filteredGirls.map((girl) => (
                <div key={girl.id} className="relative group">
                  <div className="absolute top-3 right-3 z-20">
                    <FavoriteButton girlId={girl.id} girlName={girl.name} size="sm" />
                  </div>

                  <Link href={`/girls/${girl.id}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f1ede5] mb-4">
                      <Image
                        src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                        alt={girl.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover lift"
                      />
                      {girl.is_new && (
                        <span className="absolute top-3 left-3 bg-[#c9a961] text-[#0b0a09] text-[9px] tracking-[0.2em] font-bold px-2 py-1 uppercase">
                          New
                        </span>
                      )}
                      {girl.schedule?.instant_available && (
                        <div className="absolute bottom-0 left-0 right-0 bg-[#0b0a09]/85 text-white text-[10px] tracking-[0.25em] py-1.5 text-center uppercase">
                          Available Now
                        </div>
                      )}
                      {girl.schedule?.status === 'working' && !girl.schedule?.instant_available && (
                        <div className="absolute bottom-0 left-0 right-0 bg-white/90 text-[#14110d] text-[10px] tracking-[0.25em] py-1.5 text-center uppercase">
                          Working
                        </div>
                      )}
                    </div>

                    <div className="text-center px-1">
                      <h3 className="font-serif text-xl text-[#14110d] group-hover:text-[#a8862f] transition-colors truncate">
                        {girl.name}
                      </h3>
                      <p className="text-[10px] tracking-[0.15em] text-[#76705f] mt-1.5">
                        {girl.age} · T{girl.height} · B{girl.bust}
                      </p>
                      {girl.schedule?.start_time && girl.schedule.status === 'working' && (
                        <p className="text-[10px] text-[#a8862f] mt-2 tracking-wider">
                          {girl.schedule.start_time.substring(0, 5)} – {girl.schedule.end_time?.substring(0, 5)}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-32">
            <Heart className="w-12 h-12 text-[#e7e1d6] mx-auto mb-6" strokeWidth={1} />
            <p className="text-sm tracking-wider text-[#76705f] mb-6">
              該当するキャストが見つかりませんでした
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="px-6 py-3 border border-[#14110d] text-[11px] tracking-[0.25em] uppercase text-[#14110d] hover:bg-[#14110d] hover:text-white transition-colors"
              >
                View All
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
