import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import { getShopById } from '@/lib/api/shops';
import { getGirlsByShopId } from '@/lib/api/girls';
import { getPricePlansByShopId } from '@/lib/api/price-plans';
import { getSchedulesForGirls } from '@/lib/api/schedules';
import { MapPin, Phone, Clock, ArrowLeft } from 'lucide-react';

export const revalidate = 60;

export default async function ShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [shop, girls, pricePlans] = await Promise.all([
    getShopById(id),
    getGirlsByShopId(id),
    getPricePlansByShopId(id),
  ]);

  if (!shop) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl text-[#14110d] mb-6">店舗が見つかりませんでした</h1>
            <Link href="/shops" className="text-[#a8862f] text-sm tracking-wider uppercase">← Back to Shops</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const girlIds = girls.map(g => g.id);
  const schedules = await getSchedulesForGirls(girlIds);
  const scheduleMap = new Map(schedules.map(s => [s.girl_id, s]));

  const girlsWithStatus = girls.map(girl => {
    const schedule = scheduleMap.get(girl.id);
    return {
      ...girl,
      status: schedule?.status || 'off',
      instant_available: schedule?.instant_available || false,
    };
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#faf7f2]">
        {/* Hero with shop image */}
        <section className="relative bg-[#0b0a09] text-white">
          {shop.image_url && (
            <div className="absolute inset-0">
              <Image
                src={shop.image_url}
                alt={shop.name}
                fill
                priority
                className="object-cover opacity-40"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a09] via-[#0b0a09]/60 to-[#0b0a09]/40" />
            </div>
          )}
          <div className="relative container mx-auto px-6 py-32 md:py-48">
            <Link
              href="/shops"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] text-neutral-400 hover:text-[#c9a961] mb-12 transition-colors uppercase"
            >
              <ArrowLeft size={14} />
              <span>Back to Shops</span>
            </Link>
            <div className="text-[11px] tracking-[0.4em] text-[#c9a961] uppercase mb-4">Shop</div>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-8 leading-tight">{shop.name}</h1>
            {shop.description && (
              <p className="text-base text-neutral-300 leading-loose max-w-2xl">
                {shop.description}
              </p>
            )}
          </div>
        </section>

        <div className="container mx-auto px-6 py-20 md:py-28">
          {/* Shop Info Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-[#e7e1d6] py-10 mb-20">
            <div className="flex items-start gap-4">
              <MapPin className="w-4 h-4 text-[#a8862f] mt-1 flex-shrink-0" />
              <div>
                <div className="text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-1">Area</div>
                <div className="text-[#14110d] text-sm">{shop.address}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-4 h-4 text-[#a8862f] mt-1 flex-shrink-0" />
              <div>
                <div className="text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-1">Tel</div>
                <a
                  href={`tel:${shop.phone.replace(/-/g, '')}`}
                  className="text-[#14110d] hover:text-[#a8862f] transition-colors font-serif text-xl"
                >
                  {shop.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="w-4 h-4 text-[#a8862f] mt-1 flex-shrink-0" />
              <div>
                <div className="text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-1">Hours</div>
                <div className="text-[#14110d] text-sm">{shop.business_hours}</div>
              </div>
            </div>
          </div>

          {/* Price Plans */}
          {pricePlans.length > 0 && (
            <section className="mb-24">
              <div className="text-center mb-12">
                <div className="text-[11px] tracking-[0.4em] text-[#a8862f] uppercase mb-3">Price</div>
                <h2 className="font-serif text-3xl md:text-4xl text-[#14110d]">料金プラン</h2>
                <div className="hairline-gold w-12 mx-auto mt-6" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {pricePlans.map((plan) => (
                  <div key={plan.id} className="border border-[#e7e1d6] bg-white p-10 text-center hover:border-[#c9a961] transition-colors">
                    <div className="text-[10px] tracking-[0.3em] text-[#a9a294] uppercase mb-4">
                      {plan.duration} min
                    </div>
                    <div className="font-serif text-4xl text-[#14110d] mb-3">
                      ¥{plan.price.toLocaleString()}
                    </div>
                    <div className="text-[11px] tracking-wider text-[#76705f]">
                      ¥{Math.round(plan.price / plan.duration).toLocaleString()} / min
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cast Grid */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <div className="text-[11px] tracking-[0.4em] text-[#a8862f] uppercase mb-3">Cast</div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#14110d]">在籍キャスト</h2>
              <div className="hairline-gold w-12 mx-auto mt-6" />
              <p className="text-sm text-[#76705f] mt-4 tracking-wider">
                {girlsWithStatus.length} Cast{girlsWithStatus.length !== 1 ? 's' : ''}
              </p>
            </div>

            {girlsWithStatus.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-sm text-[#76705f] tracking-wider">現在在籍しているキャストはいません</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-14">
                {girlsWithStatus.map((girl: any) => (
                  <Link
                    key={girl.id}
                    href={`/girls/${girl.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f1ede5] mb-4">
                      {girl.thumbnail_url ? (
                        <Image
                          src={girl.thumbnail_url}
                          alt={girl.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 20vw"
                          className="object-cover lift"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#a9a294] font-serif">
                          {girl.name}
                        </div>
                      )}
                      {girl.is_new && (
                        <span className="absolute top-3 left-3 bg-[#c9a961] text-[#0b0a09] text-[9px] tracking-[0.2em] font-bold px-2 py-1 uppercase">
                          New
                        </span>
                      )}
                      {girl.instant_available && (
                        <div className="absolute bottom-0 left-0 right-0 bg-[#0b0a09]/85 text-white text-[10px] tracking-[0.25em] py-1.5 text-center uppercase">
                          Available Now
                        </div>
                      )}
                      {girl.status === 'working' && !girl.instant_available && (
                        <div className="absolute bottom-0 left-0 right-0 bg-white/90 text-[#14110d] text-[10px] tracking-[0.25em] py-1.5 text-center uppercase">
                          Working
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
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Booking Form */}
          <div className="mb-24">
            <BookingForm shopId={shop.id} shopName={shop.name} shopPhone={shop.phone} />
          </div>

          {/* Phone CTA */}
          <section className="bg-[#0b0a09] text-white text-center py-20 px-6 grain relative">
            <div className="relative">
              <div className="text-[11px] tracking-[0.4em] text-[#c9a961] uppercase mb-4">Reservation</div>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-8">お電話でのご予約</h2>
              <a
                href={`tel:${shop.phone.replace(/-/g, '')}`}
                className="inline-flex items-center gap-3 px-10 py-5 bg-[#c9a961] text-[#0b0a09] font-serif text-2xl hover:bg-white transition-colors"
              >
                <Phone size={20} />
                {shop.phone}
              </a>
              <p className="mt-8 text-xs text-neutral-500 tracking-wider">
                {shop.business_hours}
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
