import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllShops } from '@/lib/api/shops';
import { getNewGirls } from '@/lib/api/girls';
import { getSchedulesForGirls } from '@/lib/api/schedules';
import { ArrowRight } from 'lucide-react';



export default async function NewGirlsPage() {
  const [newGirls, shops] = await Promise.all([
    getNewGirls(50),
    getAllShops(),
  ]);

  const girlIds = newGirls.map(g => g.id);
  const schedules = await getSchedulesForGirls(girlIds);
  const scheduleMap = new Map(schedules.map(s => [s.girl_id, s]));
  const shopMap = new Map(shops.map(s => [s.id, s]));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#faf7f2]">
        {/* Header */}
        <section className="bg-[#0b0a09] text-white py-24 md:py-32 grain relative">
          <div className="container mx-auto px-6 relative text-center">
            <div className="text-[11px] tracking-[0.4em] text-[#c9a961] uppercase mb-4">New Arrival</div>
            <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">新人キャスト</h1>
            <div className="hairline-gold w-16 mx-auto mb-6" />
            <p className="text-sm text-neutral-400 tracking-wider">
              <span className="font-serif text-2xl text-[#c9a961] mx-1">{newGirls.length}</span> New Casts
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16 md:py-24">
          {newGirls.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-sm text-[#76705f] tracking-wider mb-8">
                現在、新人キャストはいません
              </p>
              <Link
                href="/girls"
                className="inline-flex items-center gap-3 px-6 py-3 border border-[#14110d] text-[11px] tracking-[0.25em] uppercase text-[#14110d] hover:bg-[#14110d] hover:text-white transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-14">
              {newGirls.map((girl) => {
                const shop = shopMap.get(girl.shop_id);
                const schedule = scheduleMap.get(girl.id);

                return (
                  <Link
                    key={girl.id}
                    href={`/girls/${girl.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f1ede5] mb-4">
                      <Image
                        src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                        alt={girl.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover lift"
                      />
                      <span className="absolute top-3 left-3 bg-[#c9a961] text-[#0b0a09] text-[9px] tracking-[0.2em] font-bold px-2 py-1 uppercase">
                        New
                      </span>
                      {schedule?.instant_available && (
                        <div className="absolute bottom-0 left-0 right-0 bg-[#0b0a09]/85 text-white text-[10px] tracking-[0.25em] py-1.5 text-center uppercase">
                          Available Now
                        </div>
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
