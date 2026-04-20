import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllShops } from '@/lib/api/shops';
import { getGirlsByShopId } from '@/lib/api/girls';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';



export default async function ShopsPage() {
  const shops = await getAllShops();

  const shopsWithGirlCount = await Promise.all(
    shops.map(async (shop) => {
      const girls = await getGirlsByShopId(shop.id);
      return { ...shop, girlCount: girls.length };
    })
  );

  const totalCasts = shopsWithGirlCount.reduce((sum, shop) => sum + shop.girlCount, 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#faf7f2]">
        {/* Header */}
        <section className="bg-[#0b0a09] text-white py-24 md:py-32 grain relative">
          <div className="container mx-auto px-6 relative text-center">
            <div className="text-[11px] tracking-[0.4em] text-[#c9a961] uppercase mb-4">Our Shops</div>
            <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">店舗一覧</h1>
            <div className="hairline-gold w-16 mx-auto mb-6" />
            <p className="text-sm text-neutral-400 tracking-wider">
              中標津エリアの厳選店舗
            </p>

            <div className="mt-12 flex items-center justify-center gap-12">
              <div>
                <div className="font-serif text-4xl text-white">{String(shops.length).padStart(2, '0')}</div>
                <div className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase mt-2">Shops</div>
              </div>
              <div className="w-px h-12 bg-[#2a2620]" />
              <div>
                <div className="font-serif text-4xl text-white">{String(totalCasts).padStart(2, '0')}</div>
                <div className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase mt-2">Casts</div>
              </div>
            </div>
          </div>
        </section>

        {/* Shop Cards */}
        <section className="container mx-auto px-6 py-20 md:py-28">
          <div className="space-y-24">
            {shopsWithGirlCount.map((shop, idx) => (
              <Link
                key={shop.id}
                href={`/shops/${shop.id}`}
                className="group block"
              >
                <article className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${idx % 2 === 1 ? 'lg:[&>:first-child]:order-2' : ''}`}>
                  {/* Image */}
                  <div className="lg:col-span-7">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#f1ede5]">
                      {shop.image_url ? (
                        <Image
                          src={shop.image_url}
                          alt={shop.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover lift"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#a9a294] font-serif text-3xl">
                          {shop.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="lg:col-span-5">
                    <div className="text-[10px] tracking-[0.3em] text-[#a8862f] uppercase mb-3">
                      Shop No. {String(idx + 1).padStart(2, '0')}
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl text-[#14110d] mb-6 group-hover:text-[#a8862f] transition-colors">
                      {shop.name}
                    </h2>
                    <div className="hairline-gold w-12 mb-6 ml-0 mr-auto" />
                    {shop.description && (
                      <p className="text-sm text-[#3a342c] leading-loose mb-8">
                        {shop.description}
                      </p>
                    )}

                    <dl className="space-y-3 text-sm border-t border-[#e7e1d6] pt-6 mb-8">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#a8862f] mt-0.5 flex-shrink-0" />
                        <dd className="text-[#14110d]">{shop.address}</dd>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-[#a8862f] mt-0.5 flex-shrink-0" />
                        <dd className="text-[#14110d]">{shop.phone}</dd>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-[#a8862f] mt-0.5 flex-shrink-0" />
                        <dd className="text-[#14110d]">{shop.business_hours}</dd>
                      </div>
                    </dl>

                    <div className="flex items-center justify-between">
                      <div className="text-[11px] tracking-[0.2em] uppercase text-[#76705f]">
                        Cast <span className="font-serif text-lg text-[#14110d] ml-1">{shop.girlCount}</span>
                      </div>
                      <div className="inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-[#14110d] font-semibold">
                        <span>View Detail</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {shops.length === 0 && (
            <div className="text-center py-32">
              <p className="text-sm text-[#76705f] tracking-wider">店舗がまだ登録されていません</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
