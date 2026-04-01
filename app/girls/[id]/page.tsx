import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorkStatusBadge from '@/components/WorkStatusBadge';
import { getGirlById } from '@/lib/api/girls';
import { getShopById } from '@/lib/api/shops';
import { getReviewsByGirlId } from '@/lib/api/reviews';
import { getPricePlansByShopId } from '@/lib/api/price-plans';
import { getGirlTodaySchedule } from '@/lib/api/schedules';
import { Star, Calendar, Clock, Phone, Heart, MessageCircle, MapPin, DollarSign, ArrowLeft, Zap } from 'lucide-react';

// 60秒ごとにキャッシュを更新
export const revalidate = 60;

export default async function GirlDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // データを並行取得
  const girl = await getGirlById(id);
  
  if (!girl) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">女の子が見つかりませんでした</h1>
            <Link href="/girls" className="text-pink-600 hover:text-pink-700 font-semibold">
              一覧に戻る
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
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">店舗情報が見つかりませんでした</h1>
            <Link href="/girls" className="text-pink-600 hover:text-pink-700 font-semibold">
              一覧に戻る
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // 承認済みレビューのみを表示
  const approvedReviews = reviews.filter(r => r.approved);
  
  const avgRating = approvedReviews.length > 0
    ? approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length
    : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link 
            href="/girls"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>一覧に戻る</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Image Gallery */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                <div className="relative aspect-[4/5] bg-gray-200">
                  {girl.is_new && (
                    <div className="absolute top-4 right-4 bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10">
                      NEW
                    </div>
                  )}
                  {girl.thumbnail_url ? (
                    <Image
                      src={girl.thumbnail_url}
                      alt={girl.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                      priority={true}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                      <span className="text-6xl">👧</span>
                    </div>
                  )}
                </div>
                
                {/* Quick Stats */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">閲覧数</span>
                    <span className="font-semibold text-gray-800">{girl.view_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ランキング</span>
                    <span className="font-semibold text-pink-600">#{girl.ranking}</span>
                  </div>
                  {avgRating > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">評価</span>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-800">{avgRating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({approvedReviews.length})</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="p-6 pt-0 space-y-3">
                  <Link
                    href={`/booking?girlId=${girl.id}`}
                    className="block w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg text-center hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Calendar className="inline-block mr-2" size={20} />
                    予約する
                  </Link>
                  <Link
                    href={`/reviews/new?girlId=${girl.id}`}
                    className="block w-full border-2 border-pink-600 text-pink-600 font-bold py-3 px-6 rounded-lg text-center hover:bg-pink-50 transition-all"
                  >
                    <MessageCircle className="inline-block mr-2" size={20} />
                    口コミを書く
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{girl.name}</h1>
                <p className="text-gray-600 mb-4">{shop.name}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">年齢</div>
                    <div className="text-2xl font-bold text-pink-600">{girl.age}歳</div>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">身長</div>
                    <div className="text-2xl font-bold text-pink-600">{girl.height}cm</div>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">血液型</div>
                    <div className="text-2xl font-bold text-pink-600">{girl.blood_type}型</div>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">スリーサイズ</div>
                    <div className="text-lg font-bold text-pink-600">{girl.bust}-{girl.waist}-{girl.hip}</div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">プロフィール</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{girl.description}</p>
                </div>
              </div>

              {/* Work Status - 出勤状況 */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl shadow-md p-6 border-2 border-rose-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-rose-500" />
                  <span>本日の出勤状況</span>
                </h3>
                
                {schedule ? (
                  <div className="space-y-4">
                    <WorkStatusBadge
                      status={schedule.status}
                      instantAvailable={schedule.instant_available}
                      startTime={schedule.start_time}
                      endTime={schedule.end_time}
                      notes={schedule.notes}
                      size="lg"
                      showDetails={true}
                    />

                    {/* ソク姫OK の場合の強調表示 */}
                    {schedule.status === 'working' && schedule.instant_available && (
                      <div className="bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <Zap className="w-8 h-8 animate-pulse" />
                          <h4 className="text-2xl font-bold">今すぐ遊べます！</h4>
                        </div>
                        <p className="text-white/90 mb-4 leading-relaxed">
                          {girl.name}は現在出勤中で、ソク姫対応が可能です！<br />
                          今すぐお電話いただければ、すぐにご案内できます。
                        </p>
                        <a
                          href={`tel:${shop.phone.replace(/-/g, '')}`}
                          className="inline-flex items-center space-x-2 bg-white text-rose-500 font-bold px-6 py-3 rounded-full hover:shadow-xl transition-all transform hover:scale-105"
                        >
                          <Phone className="w-5 h-5" />
                          <span>{shop.phone} に電話する</span>
                        </a>
                      </div>
                    )}

                    {/* 出勤予定の場合 */}
                    {schedule.status === 'scheduled' && (
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                        <p className="text-blue-800 font-medium">
                          📅 {schedule.start_time?.substring(0, 5)}〜 出勤予定です。<br />
                          事前予約を承っております。
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                    <p className="text-gray-600">
                      本日の出勤情報は未定です。<br />
                      店舗にお問い合わせください。
                    </p>
                    <a
                      href={`tel:${shop.phone.replace(/-/g, '')}`}
                      className="inline-flex items-center space-x-2 mt-4 text-rose-500 hover:text-rose-600 font-semibold"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{shop.phone}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Charm Points */}
              {girl.charm_points && girl.charm_points.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Heart className="text-pink-600" size={20} />
                    チャームポイント
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {girl.charm_points.map((point, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Options */}
              {girl.available_options && girl.available_options.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">対応可能オプション</h3>
                  <div className="flex flex-wrap gap-2">
                    {girl.available_options.map((option, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Plans */}
              {pricePlans.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <DollarSign className="text-pink-600" size={20} />
                    料金プラン
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pricePlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="p-4 border-2 border-pink-200 rounded-lg hover:border-pink-500 transition-all"
                      >
                        <div className="text-sm text-gray-600 mb-1">{plan.duration}分コース</div>
                        <div className="text-2xl font-bold text-pink-600">¥{plan.price.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shop Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">店舗情報</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-gray-800">{shop.name}</div>
                      <div className="text-sm text-gray-600">{shop.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400 flex-shrink-0" size={20} />
                    <div className="text-gray-800">{shop.phone}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-gray-400 flex-shrink-0" size={20} />
                    <div className="text-gray-800">{shop.business_hours}</div>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              {approvedReviews.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageCircle className="text-pink-600" size={20} />
                    口コミ ({approvedReviews.length})
                  </h3>
                  <div className="space-y-4">
                    {approvedReviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-gray-800">{review.user_name}</div>
                            {review.verified && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                認証済み
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(review.created_at).toLocaleDateString('ja-JP')}
                        </div>
                      </div>
                    ))}
                  </div>
                  {approvedReviews.length > 5 && (
                    <div className="text-center mt-6">
                      <Link
                        href={`/reviews?girlId=${girl.id}`}
                        className="text-pink-600 hover:text-pink-700 font-semibold"
                      >
                        すべての口コミを見る →
                      </Link>
                    </div>
                  )}
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
