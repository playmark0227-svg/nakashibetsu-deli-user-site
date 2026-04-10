import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getGirlById } from '@/lib/api/girls';
import { getShopById } from '@/lib/api/shops';
import { getReviewsByGirlId } from '@/lib/api/reviews';
import { getPricePlansByShopId } from '@/lib/api/price-plans';
import { getGirlTodaySchedule } from '@/lib/api/schedules';
import { Star, Clock, Phone, MessageCircle, MapPin, ArrowLeft } from 'lucide-react';
import FavoriteButton from '@/components/FavoriteButton';

export const revalidate = 60;

export default async function GirlDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const girl = await getGirlById(id);

  if (!girl) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl text-[#14110d] mb-6">キャストが見つかりませんでした</h1>
            <Link href="/girls" className="text-[#a8862f] hover:text-[#14110d] text-sm tracking-wider uppercase">
              ← Back to Cast
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const [shop, reviews, pricePlans, schedule] = await Promise.all([
    getShopById(girl.shop_id),
    getReviewsByGirlId(girl.id),
    getPricePlansByShopId(girl.shop_id),
    getGirlTodaySchedule(girl.id),
  ]);

  if (!shop) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl text-[#14110d] mb-6">店舗情報が見つかりませんでした</h1>
            <Link href="/girls" className="text-[#a8862f] text-sm tracking-wider uppercase">← Back</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const approvedReviews = reviews.filter(r => r.approved);
  const avgRating = approvedReviews.length > 0
    ? approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length
    : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#faf7f2]">
        <div className="container mx-auto px-6 py-12 md:py-16">
          {/* Back Button */}
          <Link
            href="/girls"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] text-[#76705f] hover:text-[#14110d] mb-12 transition-colors uppercase"
          >
            <ArrowLeft size={14} />
            <span>Back to Cast</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column - Image */}
            <div className="lg:col-span-5">
              <div className="sticky top-28">
                <div className="relative aspect-[3/4] bg-[#f1ede5] overflow-hidden mb-6">
                  {girl.thumbnail_url ? (
                    <Image
                      src={girl.thumbnail_url}
                      alt={girl.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#a9a294] font-serif text-3xl">
                      {girl.name}
                    </div>
                  )}
                  {girl.is_new && (
                    <span className="absolute top-4 left-4 bg-[#c9a961] text-[#0b0a09] text-[10px] tracking-[0.25em] font-bold px-3 py-1.5 uppercase">
                      New
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                  <div className="border border-[#e7e1d6] py-4">
                    <div className="text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-1">Rank</div>
                    <div className="font-serif text-2xl text-[#a8862f]">#{girl.ranking}</div>
                  </div>
                  <div className="border border-[#e7e1d6] py-4">
                    <div className="text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-1">Rating</div>
                    <div className="font-serif text-2xl text-[#14110d] flex items-center justify-center gap-1">
                      {avgRating > 0 ? (
                        <>
                          <Star size={14} className="text-[#c9a961] fill-[#c9a961]" />
                          {avgRating.toFixed(1)}
                        </>
                      ) : (
                        <span className="text-[#a9a294]">—</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={`tel:${shop.phone.replace(/-/g, '')}`}
                  className="group flex items-center justify-center gap-3 w-full bg-[#14110d] text-white py-5 mb-3 hover:bg-[#c9a961] hover:text-[#0b0a09] transition-colors"
                >
                  <Phone size={16} />
                  <span className="text-[11px] tracking-[0.25em] font-semibold uppercase">電話で予約</span>
                </a>
                <div className="flex gap-3">
                  <Link
                    href={`/reviews/new?girlId=${girl.id}`}
                    className="flex-1 border border-[#14110d] text-[#14110d] py-4 text-center hover:bg-[#14110d] hover:text-white transition-colors text-[11px] tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={14} />
                    Review
                  </Link>
                  <FavoriteButton girlId={girl.id} girlName={girl.name} size="lg" className="border border-[#14110d] aspect-square" />
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-7 space-y-12">
              {/* Name & Profile */}
              <div>
                <div className="text-[11px] tracking-[0.3em] text-[#a8862f] uppercase mb-3">{shop.name}</div>
                <h1 className="font-serif text-5xl md:text-6xl text-[#14110d] mb-8 leading-tight">{girl.name}</h1>
                <div className="hairline-gold w-12 mb-10 ml-0 mr-auto" />

                {/* Spec Table */}
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  <div className="border-t border-[#e7e1d6] pt-4">
                    <dt className="text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-2">Age</dt>
                    <dd className="font-serif text-2xl text-[#14110d]">{girl.age}</dd>
                  </div>
                  <div className="border-t border-[#e7e1d6] pt-4">
                    <dt className="text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-2">Height</dt>
                    <dd className="font-serif text-2xl text-[#14110d]">{girl.height}<span className="text-sm text-[#76705f] ml-1">cm</span></dd>
                  </div>
                  <div className="border-t border-[#e7e1d6] pt-4">
                    <dt className="text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-2">Blood</dt>
                    <dd className="font-serif text-2xl text-[#14110d]">{girl.blood_type}</dd>
                  </div>
                  <div className="border-t border-[#e7e1d6] pt-4">
                    <dt className="text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-2">Size</dt>
                    <dd className="font-serif text-base text-[#14110d] mt-1">B{girl.bust} W{girl.waist} H{girl.hip}</dd>
                  </div>
                </dl>

                <div>
                  <h3 className="text-[10px] tracking-[0.3em] text-[#a8862f] uppercase mb-4">Profile</h3>
                  <p className="text-[#3a342c] leading-loose whitespace-pre-wrap">{girl.description}</p>
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="bg-white p-10 border border-[#e7e1d6]">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-4 h-4 text-[#a8862f]" />
                  <h3 className="text-[10px] tracking-[0.3em] text-[#a8862f] uppercase">Today's Schedule</h3>
                </div>

                {schedule ? (
                  <>
                    {schedule.status === 'working' && (
                      <div>
                        <div className="font-serif text-3xl text-[#14110d] mb-2">
                          {schedule.start_time?.substring(0, 5)} – {schedule.end_time?.substring(0, 5)}
                        </div>
                        <div className="text-sm text-[#76705f]">本日出勤中</div>
                        {schedule.instant_available && (
                          <div className="mt-8 pt-8 border-t border-[#e7e1d6]">
                            <div className="text-[10px] tracking-[0.3em] text-[#a8862f] uppercase mb-3">Available Now</div>
                            <p className="text-[#3a342c] leading-loose mb-6">
                              現在ご案内可能です。お電話にてご予約ください。
                            </p>
                            <a
                              href={`tel:${shop.phone.replace(/-/g, '')}`}
                              className="inline-flex items-center gap-3 px-6 py-3 bg-[#c9a961] text-[#0b0a09] text-[11px] tracking-[0.25em] font-semibold uppercase hover:bg-[#14110d] hover:text-white transition-colors"
                            >
                              <Phone size={14} />
                              {shop.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                    {schedule.status === 'scheduled' && (
                      <div>
                        <div className="font-serif text-3xl text-[#14110d] mb-2">
                          {schedule.start_time?.substring(0, 5)} –
                        </div>
                        <div className="text-sm text-[#76705f]">出勤予定</div>
                      </div>
                    )}
                    {schedule.status === 'off' && (
                      <div className="text-sm text-[#76705f]">本日はお休みです</div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-[#76705f]">
                    本日の出勤情報は未定です。詳しくはお電話にてお問い合わせください。
                  </div>
                )}
              </div>

              {/* Charm Points */}
              {girl.charm_points && girl.charm_points.length > 0 && (
                <div>
                  <h3 className="text-[10px] tracking-[0.3em] text-[#a8862f] uppercase mb-6">Charm Points</h3>
                  <div className="flex flex-wrap gap-2">
                    {girl.charm_points.map((point, i) => (
                      <span key={i} className="px-4 py-2 border border-[#e7e1d6] text-sm text-[#3a342c]">
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Options */}
              {girl.available_options && girl.available_options.length > 0 && (
                <div>
                  <h3 className="text-[10px] tracking-[0.3em] text-[#a8862f] uppercase mb-6">Options</h3>
                  <div className="flex flex-wrap gap-2">
                    {girl.available_options.map((opt, i) => (
                      <span key={i} className="px-4 py-2 border border-[#e7e1d6] text-sm text-[#3a342c]">
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Plans */}
              {pricePlans.length > 0 && (
                <div>
                  <h3 className="text-[10px] tracking-[0.3em] text-[#a8862f] uppercase mb-6">Price</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pricePlans.map((plan) => (
                      <div key={plan.id} className="border border-[#e7e1d6] p-6 hover:border-[#c9a961] transition-colors">
                        <div className="text-xs tracking-wider text-[#76705f] mb-2">{plan.duration}min</div>
                        <div className="font-serif text-3xl text-[#14110d]">¥{plan.price.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shop Info */}
              <div className="bg-white p-10 border border-[#e7e1d6]">
                <h3 className="text-[10px] tracking-[0.3em] text-[#a8862f] uppercase mb-6">Shop</h3>
                <div className="font-serif text-2xl text-[#14110d] mb-6">{shop.name}</div>
                <dl className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={14} className="text-[#a8862f] mt-1 flex-shrink-0" />
                    <dd className="text-[#3a342c]">{shop.address}</dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={14} className="text-[#a8862f] mt-1 flex-shrink-0" />
                    <dd className="text-[#3a342c]">{shop.phone}</dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={14} className="text-[#a8862f] mt-1 flex-shrink-0" />
                    <dd className="text-[#3a342c]">{shop.business_hours}</dd>
                  </div>
                </dl>
                <Link
                  href={`/shops/${shop.id}`}
                  className="inline-flex items-center gap-2 mt-8 text-[11px] tracking-[0.25em] uppercase text-[#14110d] hover:text-[#a8862f] transition-colors font-semibold"
                >
                  View Shop Detail →
                </Link>
              </div>

              {/* Reviews */}
              {approvedReviews.length > 0 && (
                <div>
                  <h3 className="text-[10px] tracking-[0.3em] text-[#a8862f] uppercase mb-6">
                    Reviews ({approvedReviews.length})
                  </h3>
                  <div className="space-y-6">
                    {approvedReviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border-t border-[#e7e1d6] pt-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="font-serif text-base text-[#14110d]">{review.user_name}</div>
                            {review.verified && (
                              <span className="text-[9px] tracking-[0.2em] text-[#a8862f] uppercase">Verified</span>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < review.rating ? 'text-[#c9a961] fill-[#c9a961]' : 'text-[#e7e1d6]'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#3a342c] text-sm leading-loose">{review.comment}</p>
                        <div className="text-[10px] text-[#a9a294] mt-3 tracking-wider">
                          {new Date(review.created_at).toLocaleDateString('ja-JP')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
