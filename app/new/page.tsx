import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorkStatusBadge from '@/components/WorkStatusBadge';
import { getAllShops } from '@/lib/api/shops';
import { getNewGirls } from '@/lib/api/girls';
import { getSchedulesForGirls } from '@/lib/api/schedules';
import { Sparkles, Star, Eye, ArrowRight, Clock } from 'lucide-react';

export const revalidate = 60;

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
      <main className="min-h-screen bg-neutral-50">
        {/* ページヘッダー */}
        <section className="bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1))] bg-[length:20px_20px]" />
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <span className="text-white font-bold tracking-wider">NEW ARRIVAL</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">新人キャスト</h1>
            <p className="text-white/90 text-lg mb-2">フレッシュな魅力で登場！</p>
            <p className="text-white/70 text-base">
              <span className="font-bold text-white text-2xl">{newGirls.length}</span>名の新人キャストが在籍中
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          {newGirls.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 text-lg">現在、新人キャストはいません</p>
              <Link href="/girls" className="inline-flex items-center space-x-2 mt-6 px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors font-medium">
                <span>全キャストを見る</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {newGirls.map((girl) => {
                const shop = shopMap.get(girl.shop_id);
                const schedule = scheduleMap.get(girl.id);

                return (
                  <Link
                    key={girl.id}
                    href={`/girls/${girl.id}`}
                    className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-rose-100 transition-all duration-300 transform hover:-translate-y-2 border border-neutral-200 hover:border-rose-300"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                      {/* NEWバッジ */}
                      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>NEW</span>
                      </div>

                      <Image
                        src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                        alt={girl.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* 出勤状況バッジ */}
                      {schedule && (
                        <div className="absolute bottom-3 left-3 right-3">
                          <WorkStatusBadge
                            status={schedule.status}
                            instantAvailable={schedule.instant_available}
                            size="sm"
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-neutral-900 mb-1 group-hover:text-rose-500 transition-colors truncate">
                        {girl.name}
                      </h3>
                      <p className="text-sm text-neutral-500 mb-1">
                        {girl.age}歳 · T{girl.height} · B{girl.bust}
                      </p>
                      {shop && (
                        <p className="text-xs text-neutral-400 truncate">{shop.name}</p>
                      )}

                      {/* 出勤時間 */}
                      {schedule?.status === 'working' && schedule.start_time && (
                        <div className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{schedule.start_time.substring(0, 5)} 〜 {schedule.end_time?.substring(0, 5)}</span>
                        </div>
                      )}

                      {/* ビュー数 */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{girl.view_count.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span>#{girl.ranking}</span>
                        </div>
                      </div>
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
