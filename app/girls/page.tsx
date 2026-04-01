import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorkStatusBadge from '@/components/WorkStatusBadge';
import { getAllGirls } from '@/lib/api/girls';
import { getSchedulesForGirls } from '@/lib/api/schedules';
import { Star, Eye, Heart, Filter } from 'lucide-react';

// 60秒ごとにキャッシュを更新
export const revalidate = 60;

export default async function GirlsPage() {
  // 全キャストを取得
  const girls = await getAllGirls();
  
  // キャストのIDを抽出
  const girlIds = girls.map(g => g.id);
  
  // 本日のスケジュールを一括取得
  const schedules = await getSchedulesForGirls(girlIds);
  
  // スケジュールをマップに変換（高速検索用）
  const scheduleMap = new Map(schedules.map(s => [s.girl_id, s]));
  
  // キャストにスケジュール情報を統合
  const girlsWithSchedule = girls.map(girl => ({
    ...girl,
    schedule: scheduleMap.get(girl.id),
  }));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-rose-300 via-rose-300 to-rose-400 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                在籍キャスト一覧
              </h1>
              <p className="text-white/90 text-lg">
                {girls.length}名のキャストがあなたをお待ちしています
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <button className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium">
                すべて
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-rose-300 hover:text-rose-500 transition-colors">
                🟢 出勤中
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-rose-300 hover:text-rose-500 transition-colors">
                ⚡ ソク姫OK
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-rose-300 hover:text-rose-500 transition-colors">
                🆕 新人
              </button>
            </div>
          </div>
        </section>

        {/* Girls Grid */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {girlsWithSchedule.map((girl) => (
              <Link
                key={girl.id}
                href={`/girls/${girl.id}`}
                className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-rose-100 transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 hover:border-rose-300"
              >
                {/* 新人バッジ */}
                {girl.is_new && (
                  <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    NEW
                  </div>
                )}

                {/* 画像 */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <Image
                    src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                    alt={girl.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    priority={false}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                  
                  {/* 出勤状況バッジ（画像上） */}
                  {girl.schedule && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <WorkStatusBadge
                        status={girl.schedule.status}
                        instantAvailable={girl.schedule.instant_available}
                        size="sm"
                      />
                    </div>
                  )}
                </div>

                {/* 情報 */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-rose-500 transition-colors truncate">
                    {girl.name}
                  </h3>
                  
                  {/* スペック */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <span>{girl.age}歳</span>
                    <span>•</span>
                    <span>T{girl.height}</span>
                    <span>•</span>
                    <span>B{girl.bust}</span>
                  </div>

                  {/* 詳細な出勤情報 */}
                  {girl.schedule && girl.schedule.status !== 'unknown' && (
                    <div className="text-xs space-y-1 pt-2 border-t border-gray-100">
                      {girl.schedule.status === 'working' && girl.schedule.start_time && (
                        <div className="text-gray-600">
                          {girl.schedule.start_time.substring(0, 5)} 〜 {girl.schedule.end_time?.substring(0, 5)}
                        </div>
                      )}
                      {girl.schedule.status === 'scheduled' && girl.schedule.start_time && (
                        <div className="text-blue-600 font-medium">
                          {girl.schedule.start_time.substring(0, 5)}〜 出勤予定
                        </div>
                      )}
                      {girl.schedule.instant_available && (
                        <div className="text-rose-600 font-bold">
                          今すぐ遊べます！
                        </div>
                      )}
                    </div>
                  )}

                  {/* 閲覧数・評価 */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{girl.view_count || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span>{girl.ranking || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {girls.length === 0 && (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">キャストが登録されていません</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
