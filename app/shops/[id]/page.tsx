import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import { getShopById } from '@/lib/api/shops';
import { getGirlsByShopId } from '@/lib/api/girls';
import { getPricePlansByShopId } from '@/lib/api/price-plans';
import { getSchedulesForGirls } from '@/lib/api/schedules';
import { Store, MapPin, Phone, Clock, DollarSign, ArrowLeft, Star, Zap } from 'lucide-react';

// 60秒ごとにキャッシュを更新
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
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">店舗が見つかりませんでした</h1>
            <Link href="/shops" className="text-rose-500 hover:text-rose-600 font-semibold">
              店舗一覧に戻る
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // キャストのスケジュール情報を取得
  const girlIds = girls.map(g => g.id);
  const schedules = await getSchedulesForGirls(girlIds);
  const scheduleMap = new Map(schedules.map(s => [s.girl_id, s]));
  
  // キャストにステータスを追加
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
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link 
            href="/shops"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>店舗一覧に戻る</span>
          </Link>

          <div className="max-w-6xl mx-auto">
            {/* Shop Header */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              {/* Shop Image */}
              {shop.image_url && (
                <div className="w-full relative aspect-[4/5] max-h-[500px]">
                  <Image
                    src={shop.image_url}
                    alt={shop.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    className="object-cover"
                    priority={true}
                  />
                </div>
              )}
              
              <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gradient-to-br from-rose-300 to-rose-400 p-4 rounded-xl">
                  <Store className="text-white" size={32} />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {shop.name}
                  </h1>
                  {shop.description && (
                    <p className="text-gray-600 leading-relaxed">
                      {shop.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Shop Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">エリア</div>
                    <div className="text-gray-800 font-semibold">{shop.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-gray-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">電話番号</div>
                    <a 
                      href={`tel:${shop.phone.replace(/-/g, '')}`}
                      className="text-rose-500 font-bold text-lg hover:text-rose-600 transition-colors"
                    >
                      {shop.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="text-gray-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">営業時間</div>
                    <div className="text-gray-800 font-semibold">{shop.business_hours}</div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Price Plans */}
            {pricePlans.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <DollarSign className="text-rose-500" size={28} />
                  料金プラン
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pricePlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="border-2 border-rose-200 rounded-xl p-6 hover:border-rose-400 transition-all hover:shadow-lg"
                    >
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">{plan.duration}分コース</div>
                        <div className="text-3xl font-bold text-rose-500 mb-2">
                          ¥{plan.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          1分あたり ¥{Math.round(plan.price / plan.duration).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Girls List */}
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                在籍キャスト ({girlsWithStatus.length}名)
              </h2>

              {girlsWithStatus.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">現在在籍しているキャストはいません</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {girlsWithStatus.map((girl: any) => (
                    <Link
                      key={girl.id}
                      href={`/girls/${girl.id}`}
                      className="group"
                    >
                      <div className="relative aspect-[4/5] bg-gray-200 rounded-lg overflow-hidden mb-3">
                        {/* ステータスバッジ */}
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                          {girl.is_new && (
                            <div className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              NEW
                            </div>
                          )}
                          {girl.instant_available && (
                            <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                              <Zap className="w-3 h-3" />
                              <span>ソク姫</span>
                            </div>
                          )}
                          {girl.status === 'working' && !girl.instant_available && (
                            <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>出勤中</span>
                            </div>
                          )}
                          {girl.status === 'scheduled' && (
                            <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>出勤予定</span>
                            </div>
                          )}
                        </div>
                        
                        {girl.thumbnail_url ? (
                          <Image
                            src={girl.thumbnail_url}
                            alt={girl.name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover"
                            priority={false}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-rose-200 to-purple-200 flex items-center justify-center">
                            <span className="text-4xl">👧</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="font-bold text-gray-800 group-hover:text-rose-500 transition-colors mb-1">
                        {girl.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {girl.age}歳 / T{girl.height}
                      </p>
                      <p className="text-xs text-gray-500">
                        B{girl.bust}-W{girl.waist}-H{girl.hip}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div className="mt-6">
              <BookingForm shopId={shop.id} shopName={shop.name} shopPhone={shop.phone} />
            </div>

            {/* CTA */}
            <div className="mt-8 bg-gradient-to-r from-rose-300 to-rose-400 rounded-xl shadow-xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">お急ぎの方はお電話で</h2>
              <a 
                href={`tel:${shop.phone.replace(/-/g, '')}`}
                className="inline-block bg-white text-rose-500 font-bold text-2xl px-8 py-4 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                {shop.phone}
              </a>
              <p className="mt-4 text-sm opacity-90">営業時間: {shop.business_hours}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
