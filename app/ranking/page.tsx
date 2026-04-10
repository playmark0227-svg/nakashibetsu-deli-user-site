import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllGirls } from '@/lib/api/girls';
import { getAllShops } from '@/lib/api/shops';
import { getSchedulesForGirls } from '@/lib/api/schedules';
import { Crown } from 'lucide-react';

export const revalidate = 60;

export default async function RankingPage() {
  const [allGirls, shops] = await Promise.all([
    getAllGirls(),
    getAllShops(),
  ]);

  const rankedGirls = [...allGirls].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
  const girlIds = rankedGirls.map(g => g.id);
  const schedules = await getSchedulesForGirls(girlIds);
  const scheduleMap = new Map(schedules.map(s => [s.girl_id, s]));
  const shopMap = new Map(shops.map(s => [s.id, s]));

  const top3 = rankedGirls.slice(0, 3);
  const rest = rankedGirls.slice(3);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#faf7f2]">
        {/* Page Header */}
        <section className="bg-[#0b0a09] text-white py-24 md:py-32 grain relative">
          <div className="container mx-auto px-6 relative text-center">
            <div className="text-[11px] tracking-[0.4em] text-[#c9a961] uppercase mb-4">Ranking</div>
            <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">人気ランキング</h1>
            <div className="hairline-gold w-16 mx-auto mb-6" />
            <p className="text-sm text-neutral-400 tracking-wider">
              閲覧数で決まる、今最も注目のキャスト
            </p>
          </div>
        </section>

        {/* TOP 3 — Editorial layout */}
        {top3.length === 3 && (
          <section className="container mx-auto px-6 py-24 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {top3.map((girl, idx) => {
                const shop = shopMap.get(girl.shop_id);
                const rank = idx + 1;
                return (
                  <Link
                    key={girl.id}
                    href={`/girls/${girl.id}`}
                    className={`group block ${idx === 0 ? 'md:-mt-8' : ''} ${idx === 2 ? 'md:mt-8' : ''}`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f1ede5] mb-6">
                      <Image
                        src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                        alt={girl.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover lift"
                        priority
                      />
                      <div className="absolute top-0 left-0 bg-[#0b0a09] text-[#c9a961] px-4 py-3">
                        <div className="font-serif text-3xl leading-none">
                          {String(rank).padStart(2, '0')}
                        </div>
                      </div>
                      {rank === 1 && (
                        <div className="absolute top-4 right-4">
                          <Crown className="w-6 h-6 text-[#c9a961]" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] tracking-[0.3em] text-[#a8862f] uppercase mb-2">
                        Rank {String(rank).padStart(2, '0')}
                      </div>
                      <h3 className="font-serif text-2xl text-[#14110d] group-hover:text-[#a8862f] transition-colors">
                        {girl.name}
                      </h3>
                      <p className="text-[11px] tracking-wider text-[#76705f] mt-2">
                        {girl.age} · T{girl.height} · {shop?.name}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 4位以降 */}
        {rest.length > 0 && (
          <section className="container mx-auto px-6 pb-24 md:pb-32">
            <div className="hairline mb-12" />
            <h2 className="text-[10px] tracking-[0.3em] text-[#a8862f] uppercase mb-10">
              Rank 04 –
            </h2>
            <div className="space-y-px bg-[#e7e1d6]">
              {rest.map((girl, idx) => {
                const rank = idx + 4;
                const shop = shopMap.get(girl.shop_id);
                const schedule = scheduleMap.get(girl.id);

                return (
                  <Link
                    key={girl.id}
                    href={`/girls/${girl.id}`}
                    className="group flex items-center bg-white hover:bg-[#faf7f2] px-6 py-5 gap-6 transition-colors"
                  >
                    <div className="font-serif text-2xl text-[#a9a294] w-10 flex-shrink-0">
                      {String(rank).padStart(2, '0')}
                    </div>

                    <div className="relative w-14 h-18 flex-shrink-0 bg-[#f1ede5] overflow-hidden" style={{ aspectRatio: '3/4' }}>
                      <Image
                        src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                        alt={girl.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg text-[#14110d] group-hover:text-[#a8862f] transition-colors truncate">
                        {girl.name}
                      </h3>
                      <p className="text-[11px] tracking-wider text-[#76705f] mt-0.5">
                        {girl.age} · T{girl.height} · {shop?.name}
                      </p>
                    </div>

                    <div className="hidden md:flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase">
                      {girl.is_new && (
                        <span className="text-[#a8862f]">New</span>
                      )}
                      {schedule?.status === 'working' && (
                        <span className="text-[#76705f]">Working</span>
                      )}
                      {schedule?.instant_available && (
                        <span className="text-[#a8862f]">Available</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {rankedGirls.length === 0 && (
          <div className="container mx-auto px-6 py-32 text-center">
            <p className="text-sm text-[#76705f] tracking-wider">
              まだキャストが登録されていません
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
