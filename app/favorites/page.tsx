'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoriteButton from '@/components/FavoriteButton';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { Heart, ArrowRight } from 'lucide-react';

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

    import('@/lib/supabase').then(async ({ supabase }) => {
      const [{ data: girlsData }, { data: shopsData }] = await Promise.all([
        supabase.from('girls').select('*').in('id', favorites),
        supabase.from('shops').select('id, name'),
      ]);
      setGirls((girlsData as Girl[]) || []);
      setShops((shopsData as Shop[]) || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [favorites, loaded]);

  const shopMap = new Map(shops.map(s => [s.id, s]));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#faf7f2]">
        {/* Header */}
        <section className="bg-[#0b0a09] text-white py-24 md:py-32 grain relative">
          <div className="container mx-auto px-6 relative text-center">
            <div className="text-[11px] tracking-[0.4em] text-[#c9a961] uppercase mb-4">Favorites</div>
            <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">お気に入り</h1>
            <div className="hairline-gold w-16 mx-auto mb-6" />
            <p className="text-sm text-neutral-400 tracking-wider">
              {loaded && !loading ? (
                <><span className="font-serif text-2xl text-[#c9a961] mx-1">{girls.length}</span> Saved</>
              ) : 'Loading...'}
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16 md:py-24">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-14">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[#f1ede5] mb-4" />
                  <div className="h-4 bg-[#f1ede5] w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-[#f1ede5] w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : girls.length === 0 ? (
            <div className="text-center py-32">
              <Heart className="w-12 h-12 text-[#e7e1d6] mx-auto mb-8" strokeWidth={1} />
              <h2 className="font-serif text-2xl text-[#14110d] mb-4">お気に入りはまだありません</h2>
              <p className="text-sm text-[#76705f] mb-10">
                キャストページのハートマークからお気に入りに追加できます
              </p>
              <Link
                href="/girls"
                className="inline-flex items-center gap-3 px-6 py-3 border border-[#14110d] text-[11px] tracking-[0.25em] uppercase text-[#14110d] hover:bg-[#14110d] hover:text-white transition-colors"
              >
                <span>Browse Cast</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-14">
              {girls.map(girl => {
                const shop = shopMap.get(girl.shop_id);
                return (
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
                      </div>
                      <div className="text-center">
                        <h3 className="font-serif text-xl text-[#14110d] group-hover:text-[#a8862f] transition-colors truncate">
                          {girl.name}
                        </h3>
                        <p className="text-[10px] tracking-[0.15em] text-[#76705f] mt-1.5">
                          {girl.age} · T{girl.height} · B{girl.bust}
                        </p>
                        {shop && (
                          <p className="text-[10px] text-[#a9a294] mt-1 truncate">{shop.name}</p>
                        )}
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
