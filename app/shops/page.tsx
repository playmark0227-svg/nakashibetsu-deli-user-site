import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllShops } from '@/lib/api/shops';
import { getGirlsByShopId } from '@/lib/api/girls';
import { Store, MapPin, Phone, Clock, Users, ArrowRight } from 'lucide-react';

// 60秒ごとにキャッシュを更新
export const revalidate = 60;

export default async function ShopsPage() {
  const shops = await getAllShops();
  
  // 各店舗の女の子の数を取得
  const shopsWithGirlCount = await Promise.all(
    shops.map(async (shop) => {
      const girls = await getGirlsByShopId(shop.id);
      return {
        ...shop,
        girlCount: girls.length,
      };
    })
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Store size={40} />
                <h1 className="text-3xl md:text-4xl font-bold">店舗一覧</h1>
              </div>
              <p className="text-lg md:text-xl opacity-90">
                中標津エリアの優良デリヘル店舗
              </p>
            </div>
          </div>
        </section>

        {/* Shops List */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">登録店舗数</div>
                  <div className="text-3xl font-bold text-pink-600">{shops.length}店舗</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">総在籍キャスト</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {shopsWithGirlCount.reduce((sum, shop) => sum + shop.girlCount, 0)}名
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Cards */}
            <div className="space-y-6">
              {shopsWithGirlCount.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/shops/${shop.id}`}
                  className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Shop Image */}
                    <div className="w-full md:w-64 flex-shrink-0">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        {shop.image_url ? (
                          <Image
                            src={shop.image_url}
                            alt={shop.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 256px"
                            className="object-cover"
                            priority={false}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                            <Store className="text-white" size={64} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shop Info */}
                    <div className="flex-1 p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                          {shop.name}
                        </h2>
                        {shop.description && (
                          <p className="text-gray-600 leading-relaxed">
                            {shop.description}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <div className="bg-pink-100 text-pink-700 px-4 py-2 rounded-lg text-center">
                          <div className="text-xs font-semibold mb-1">在籍キャスト</div>
                          <div className="text-2xl font-bold">{shop.girlCount}名</div>
                        </div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <MapPin className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                        <div>
                          <div className="text-xs text-gray-500 mb-1">エリア</div>
                          <div className="text-sm text-gray-800">{shop.address}</div>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start gap-3">
                        <Phone className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                        <div>
                          <div className="text-xs text-gray-500 mb-1">電話番号</div>
                          <div className="text-sm text-gray-800 font-semibold">{shop.phone}</div>
                        </div>
                      </div>

                      {/* Business Hours */}
                      <div className="flex items-start gap-3">
                        <Clock className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                        <div>
                          <div className="text-xs text-gray-500 mb-1">営業時間</div>
                          <div className="text-sm text-gray-800">{shop.business_hours}</div>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} />
                        <span>キャスト一覧を見る</span>
                      </div>
                      <ArrowRight className="text-pink-600" size={20} />
                    </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* No Shops Message */}
            {shops.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Store className="mx-auto mb-4 text-gray-300" size={64} />
                <p className="text-gray-500 text-lg">店舗がまだ登録されていません</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                お気に入りの女の子を見つけよう
              </h2>
              <p className="text-lg mb-8 opacity-90">
                中標津エリア最大級のキャスト数から選べます
              </p>
              <Link
                href="/girls"
                className="inline-block bg-white text-pink-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                女の子一覧を見る
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
