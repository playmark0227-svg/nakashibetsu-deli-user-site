import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllShops, getAllGirls } from '@/lib/api';
import { getInstantAvailableGirls, getSchedulesForGirls } from '@/lib/api/schedules';
import { ArrowRight, Phone, Clock, MapPin } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const shops = await getAllShops();
  const allGirls = await getAllGirls();
  const instantGirls = await getInstantAvailableGirls();

  const shopGirls = shops.map(shop => {
    const shopGirlsList = allGirls.filter(g => g.shop_id === shop.id);
    return {
      shop,
      girls: shopGirlsList.slice(0, 6),
      newGirls: shopGirlsList.filter(g => g.is_new).length,
      totalGirls: shopGirlsList.length,
    };
  });

  const displayedGirlIds = shopGirls.flatMap(sg => sg.girls.map(g => g.id));
  const schedules = await getSchedulesForGirls(displayedGirlIds);
  const scheduleMap = new Map(schedules.map(s => [s.girl_id, s]));

  shopGirls.forEach(sg => {
    sg.girls = sg.girls.map(girl => {
      const schedule = scheduleMap.get(girl.id);
      return {
        ...girl,
        status: schedule?.status || 'off',
        instant_available: schedule?.instant_available || false,
      } as any;
    });
  });

  const totalGirls = allGirls.length;
  const totalShops = shops.length;

  return (
    <>
      <Header />
      <main className="bg-[#faf7f2]">
        {/* ============ HERO ============ */}
        <section className="relative bg-[#0b0a09] text-white overflow-hidden grain">
          {/* Hero image as background */}
          {allGirls[0]?.thumbnail_url && (
            <div className="absolute inset-0">
              <Image
                src={allGirls[0].thumbnail_url}
                alt=""
                fill
                priority
                className="object-cover object-center opacity-30"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a09] via-[#0b0a09]/60 to-[#0b0a09]/80" />
            </div>
          )}

          <div className="relative container mx-auto px-6 py-28 md:py-40 lg:py-48">
            <div className="max-w-3xl">
              <div className="text-[11px] tracking-[0.4em] text-[#c9a961] uppercase mb-8">
                Nakashibetsu Premium Escort
              </div>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.15] mb-10 tracking-wider">
                上質な夜を、<br />
                <span className="text-[#c9a961]">あなたに</span>。
              </h1>

              <div className="hairline-gold w-24 mb-10 ml-0" />

              <p className="text-base md:text-lg text-neutral-300 leading-loose mb-12 max-w-xl font-light">
                中標津エリアにおける厳選された店舗と、洗練されたキャストを掲載。
                上質なひとときを、心ゆくまでお過ごしください。
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="#shops"
                  className="group inline-flex items-center gap-4 px-8 py-4 bg-[#c9a961] text-[#0b0a09] text-xs tracking-[0.25em] font-semibold uppercase hover:bg-white transition-colors"
                >
                  <span>店舗を見る</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/girls"
                  className="group inline-flex items-center gap-4 px-8 py-4 border border-white/20 text-white text-xs tracking-[0.25em] font-semibold uppercase hover:border-[#c9a961] hover:text-[#c9a961] transition-colors"
                >
                  <span>キャスト一覧</span>
                </Link>
              </div>

              {/* Stats inline */}
              <div className="mt-20 flex items-center gap-12">
                <div>
                  <div className="font-serif text-5xl text-white">{String(totalShops).padStart(2, '0')}</div>
                  <div className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase mt-2">Shops</div>
                </div>
                <div className="w-px h-16 bg-[#2a2620]" />
                <div>
                  <div className="font-serif text-5xl text-white">{String(totalGirls).padStart(2, '0')}</div>
                  <div className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase mt-2">Casts</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ INSTANT AVAILABLE ============ */}
        {instantGirls.length > 0 && (
          <section className="container mx-auto px-6 py-24 md:py-32">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
              <div>
                <div className="eyebrow mb-4">Available Now</div>
                <h2 className="font-serif text-4xl md:text-5xl text-[#14110d] leading-tight">
                  本日、今すぐ
                </h2>
              </div>
              <div className="text-sm text-[#76705f]">
                現在 <span className="font-serif text-2xl text-[#a8862f] mx-1">{instantGirls.length}</span> 名のキャストがご案内可能
              </div>
            </div>
            <div className="hairline mb-10" />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {instantGirls.slice(0, 8).map((schedule: any) => {
                const girl = schedule.girls;
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
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover lift"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#c9a961] text-[#0b0a09] text-[9px] tracking-[0.2em] font-bold px-2.5 py-1 uppercase">
                          Available
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-serif text-xl text-[#14110d] group-hover:text-[#a8862f] transition-colors">
                        {girl.name}
                      </h3>
                      <p className="text-[11px] tracking-wider text-[#76705f] mt-1">
                        {girl.age} · T{girl.height} · B{girl.bust}
                      </p>
                      <p className="text-[10px] text-[#a8862f] mt-2 tracking-wider">
                        {schedule.start_time?.substring(0, 5)} – {schedule.end_time?.substring(0, 5)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ============ SHOPS ============ */}
        <section id="shops" className="bg-white py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <div className="eyebrow mb-4">Our Shops</div>
              <h2 className="font-serif text-4xl md:text-5xl text-[#14110d] mb-6">
                店舗から探す
              </h2>
              <div className="hairline-gold w-16 mx-auto" />
            </div>

            <div className="space-y-32">
              {shopGirls.map(({ shop, girls, newGirls, totalGirls }, idx) => (
                <article key={shop.id} className="group">
                  {/* Shop Header */}
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 items-center ${idx % 2 === 1 ? 'lg:[&>:first-child]:order-2' : ''}`}>
                    {/* Image */}
                    <div className="lg:col-span-7">
                      <div className="relative aspect-[16/9] overflow-hidden bg-[#f1ede5]">
                        {shop.image_url ? (
                          <Image
                            src={shop.image_url}
                            alt={shop.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="object-cover lift"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#a9a294] font-serif text-2xl">
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
                      <h3 className="font-serif text-3xl md:text-4xl text-[#14110d] mb-6 leading-tight">
                        {shop.name}
                      </h3>
                      <div className="hairline-gold w-12 mb-6 ml-0 mr-auto" />
                      <p className="text-sm text-[#3a342c] leading-loose mb-8">
                        {shop.description || '厳選されたキャストが在籍する上質な店舗です。'}
                      </p>

                      <dl className="space-y-4 text-sm border-t border-[#e7e1d6] pt-6">
                        {shop.business_hours && (
                          <div className="flex items-start gap-4">
                            <Clock className="w-4 h-4 text-[#a8862f] mt-0.5 flex-shrink-0" />
                            <div>
                              <dt className="text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-0.5">Hours</dt>
                              <dd className="text-[#14110d]">{shop.business_hours}</dd>
                            </div>
                          </div>
                        )}
                        {shop.phone && (
                          <div className="flex items-start gap-4">
                            <Phone className="w-4 h-4 text-[#a8862f] mt-0.5 flex-shrink-0" />
                            <div>
                              <dt className="text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-0.5">Tel</dt>
                              <dd>
                                <a href={`tel:${shop.phone.replace(/-/g, '')}`} className="text-[#14110d] hover:text-[#a8862f] transition-colors">
                                  {shop.phone}
                                </a>
                              </dd>
                            </div>
                          </div>
                        )}
                        {shop.address && (
                          <div className="flex items-start gap-4">
                            <MapPin className="w-4 h-4 text-[#a8862f] mt-0.5 flex-shrink-0" />
                            <div>
                              <dt className="text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-0.5">Area</dt>
                              <dd className="text-[#14110d]">{shop.address}</dd>
                            </div>
                          </div>
                        )}
                      </dl>

                      <div className="flex items-center gap-6 mt-8 text-[11px] tracking-[0.15em] uppercase text-[#76705f]">
                        <span>Cast <span className="font-serif text-lg text-[#14110d] ml-1">{totalGirls}</span></span>
                        {newGirls > 0 && (
                          <span>New <span className="font-serif text-lg text-[#a8862f] ml-1">{newGirls}</span></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Girls Grid */}
                  {girls.length > 0 && (
                    <>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-8 mb-10">
                        {girls.map((girl: any) => (
                          <Link
                            key={girl.id}
                            href={`/girls/${girl.id}`}
                            className="group/cast block"
                          >
                            <div className="relative aspect-[3/4] overflow-hidden bg-[#f1ede5] mb-3">
                              <Image
                                src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                                alt={girl.name}
                                fill
                                sizes="(max-width: 768px) 33vw, 16vw"
                                className="object-cover transition-transform duration-700 group-hover/cast:scale-105"
                              />
                              {girl.is_new && (
                                <span className="absolute top-2 left-2 bg-[#c9a961] text-[#0b0a09] text-[8px] tracking-[0.15em] font-bold px-1.5 py-0.5 uppercase">
                                  New
                                </span>
                              )}
                              {girl.instant_available && (
                                <div className="absolute bottom-0 left-0 right-0 bg-[#0b0a09]/85 text-white text-[9px] tracking-[0.2em] py-1 text-center uppercase">
                                  Available Now
                                </div>
                              )}
                            </div>
                            <h4 className="font-serif text-base text-[#14110d] group-hover/cast:text-[#a8862f] transition-colors text-center">
                              {girl.name}
                            </h4>
                            <p className="text-[10px] text-[#76705f] text-center mt-0.5">{girl.age}</p>
                          </Link>
                        ))}
                      </div>

                      <div className="text-center">
                        <Link
                          href={`/shops/${shop.id}`}
                          className="group/btn inline-flex items-center gap-3 px-8 py-3 border border-[#14110d] text-[#14110d] text-[11px] tracking-[0.25em] font-semibold uppercase hover:bg-[#14110d] hover:text-white transition-colors"
                        >
                          <span>View Shop</span>
                          <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FEATURES / Promise ============ */}
        <section className="bg-[#0b0a09] text-white py-24 md:py-32 relative grain overflow-hidden">
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-20">
              <div className="text-[11px] tracking-[0.4em] text-[#c9a961] uppercase mb-4">Our Promise</div>
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">Velvet が選ばれる理由</h2>
              <div className="hairline-gold w-16 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16 max-w-5xl mx-auto">
              {[
                { num: '01', title: '厳選された店舗', desc: '中標津エリアの優良店のみを厳選して掲載。\n安心してご利用いただけます。' },
                { num: '02', title: '最新の出勤情報', desc: 'リアルタイムで更新される出勤情報。\nお気に入りのキャストをすぐに見つけられます。' },
                { num: '03', title: '即時対応可', desc: '今すぐご案内可能なキャストを\n一目で確認できます。' },
              ].map((f) => (
                <div key={f.num} className="text-center md:text-left">
                  <div className="font-serif text-5xl text-[#c9a961] mb-6">{f.num}</div>
                  <h3 className="font-serif text-xl text-white mb-4 tracking-wider">{f.title}</h3>
                  <div className="hairline-gold w-8 mb-4 mx-auto md:mx-0" />
                  <p className="text-sm text-neutral-400 leading-loose whitespace-pre-line">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
