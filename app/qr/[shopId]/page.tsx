import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getShopById, getAllShops } from '@/lib/api/shops';
import { getGirlsByShopId } from '@/lib/api/girls';
import { getSchedulesForGirls } from '@/lib/api/schedules';
import { Phone, ArrowRight, Clock, User } from 'lucide-react';

export const dynamicParams = false;

export async function generateStaticParams() {
  const shops = await getAllShops();
  return shops.map((s) => ({ shopId: s.id }));
}

export default async function QRShopPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params;
  
  const [shop, girls] = await Promise.all([
    getShopById(shopId),
    getGirlsByShopId(shopId),
  ]);

  if (!shop) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">店舗が見つかりませんでした</h1>
            <Link href="/" className="text-rose-500 hover:text-rose-600 font-semibold text-2xl">
              トップページに戻る
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

  // 出勤中のキャストを優先表示
  const workingGirls = girlsWithStatus.filter(g => g.status === 'working' || g.instant_available);
  const otherGirls = girlsWithStatus.filter(g => g.status !== 'working' && !g.instant_available);
  const sortedGirls = [...workingGirls, ...otherGirls];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        {/* 店舗ヘッダー - 高齢者向けに大きく見やすく */}
        <section className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {shop.name}
              </h1>
              <p className="text-2xl md:text-3xl mb-8 leading-relaxed">
                {shop.description}
              </p>
              
              {/* 電話番号 - 大きく目立つように */}
              <a 
                href={`tel:${shop.phone?.replace(/-/g, '')}`}
                className="inline-flex items-center gap-4 bg-white text-rose-600 px-10 py-6 rounded-2xl text-3xl font-bold hover:bg-rose-50 transition-all transform hover:scale-105 shadow-2xl mb-6"
              >
                <Phone size={40} />
                <span>{shop.phone}</span>
              </a>
              
              {/* 営業時間 */}
              {shop.business_hours && (
                <div className="flex items-center justify-center gap-3 text-2xl">
                  <Clock size={32} />
                  <span>営業時間: {shop.business_hours}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* キャスト一覧 - 高齢者向けに大きく分かりやすく */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-6xl mx-auto">
            
            {/* 案内テキスト */}
            <div className="bg-blue-50 border-4 border-blue-200 rounded-3xl p-8 mb-12 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                👇 お好きなキャストをお選びください 👇
              </h2>
              <p className="text-2xl text-gray-700 leading-relaxed">
                写真をタップすると詳細が見れます
              </p>
            </div>

            {/* 出勤中のキャスト表示 */}
            {workingGirls.length > 0 && (
              <div className="mb-16">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-6 mb-8 text-center">
                  <h3 className="text-4xl font-bold flex items-center justify-center gap-4">
                    <Clock size={40} />
                    今すぐ遊べるキャスト
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {workingGirls.map((girl) => (
                    <Link
                      key={girl.id}
                      href={`/qr/${shopId}/book/${girl.id}`}
                      className="group block"
                    >
                      <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-green-200">
                        {/* 出勤バッジ */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 text-center">
                          <span className="text-2xl font-bold">✨ 出勤中 ✨</span>
                        </div>
                        
                        {/* 画像 */}
                        <div className="relative aspect-[3/4] bg-gray-100">
                          <Image
                            src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                            alt={girl.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                            priority={true}
                          />
                        </div>
                        
                        {/* 情報 */}
                        <div className="p-8 text-center">
                          <h3 className="text-4xl font-bold text-gray-900 mb-4">
                            {girl.name}
                          </h3>
                          <div className="space-y-3 text-2xl text-gray-700 mb-6">
                            <p>年齢: <span className="font-semibold">{girl.age}歳</span></p>
                            <p>身長: <span className="font-semibold">T{girl.height}cm</span></p>
                            <p>スリーサイズ: <span className="font-semibold">B{girl.bust} W{girl.waist} H{girl.hip}</span></p>
                          </div>
                          
                          {/* 予約ボタン */}
                          <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-5 rounded-2xl text-2xl font-bold flex items-center justify-center gap-3 group-hover:from-rose-600 group-hover:to-pink-700 transition-all">
                            <span>このキャストを予約する</span>
                            <ArrowRight size={32} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* その他のキャスト */}
            {otherGirls.length > 0 && (
              <div>
                <div className="bg-gray-100 rounded-3xl p-6 mb-8 text-center">
                  <h3 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-4">
                    <User size={40} />
                    在籍キャスト一覧
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {otherGirls.map((girl) => (
                    <Link
                      key={girl.id}
                      href={`/qr/${shopId}/book/${girl.id}`}
                      className="group block"
                    >
                      <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                        {/* 画像 */}
                        <div className="relative aspect-[3/4] bg-gray-100">
                          {girl.is_new && (
                            <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white px-6 py-3 rounded-full text-2xl font-bold">
                              NEW
                            </div>
                          )}
                          <Image
                            src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                            alt={girl.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                            priority={false}
                          />
                        </div>
                        
                        {/* 情報 */}
                        <div className="p-8 text-center">
                          <h3 className="text-4xl font-bold text-gray-900 mb-4">
                            {girl.name}
                          </h3>
                          <div className="space-y-3 text-2xl text-gray-700 mb-6">
                            <p>年齢: <span className="font-semibold">{girl.age}歳</span></p>
                            <p>身長: <span className="font-semibold">T{girl.height}cm</span></p>
                            <p>スリーサイズ: <span className="font-semibold">B{girl.bust} W{girl.waist} H{girl.hip}</span></p>
                          </div>
                          
                          {/* 予約ボタン */}
                          <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-5 rounded-2xl text-2xl font-bold flex items-center justify-center gap-3 group-hover:from-gray-700 group-hover:to-gray-800 transition-all">
                            <span>このキャストを予約する</span>
                            <ArrowRight size={32} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* キャストがいない場合 */}
            {sortedGirls.length === 0 && (
              <div className="bg-yellow-50 border-3 border-yellow-200 rounded-2xl p-8 text-center">
                <p className="text-xl md:text-2xl text-gray-700 font-semibold">
                  現在、キャストの登録がありません
                </p>
                <p className="text-lg text-gray-600 mt-3">
                  お電話でお問い合わせください
                </p>
                <a 
                  href={`tel:${shop.phone?.replace(/-/g, '')}`}
                  className="inline-flex items-center gap-3 bg-rose-500 text-white px-8 py-4 rounded-xl text-2xl font-bold hover:bg-rose-600 transition-all transform hover:scale-105 shadow-xl mt-6"
                >
                  <Phone size={32} />
                  <span>{shop.phone}</span>
                </a>
              </div>
            )}
          </div>
        </section>

        {/* 電話予約の案内 */}
        <section className="bg-gradient-to-r from-rose-500 to-pink-600 py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                電話でのご予約も受付中
              </h2>
              <p className="text-lg text-white/90 mb-6">
                お気軽にお電話ください
              </p>
              <a 
                href={`tel:${shop.phone?.replace(/-/g, '')}`}
                className="inline-flex items-center gap-3 bg-white text-rose-600 px-10 py-5 rounded-xl text-2xl md:text-3xl font-bold hover:bg-rose-50 transition-all transform hover:scale-105 shadow-2xl"
              >
                <Phone size={36} />
                <span>{shop.phone}</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
