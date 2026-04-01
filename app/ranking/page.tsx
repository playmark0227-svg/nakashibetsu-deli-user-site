import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllGirls } from '@/lib/api/girls';
import { getAllShops } from '@/lib/api/shops';
import { getSchedulesForGirls } from '@/lib/api/schedules';
import { Crown, Eye, Star, TrendingUp, Zap, Clock } from 'lucide-react';

export const revalidate = 60;

export default async function RankingPage() {
  const [allGirls, shops] = await Promise.all([
    getAllGirls(),
    getAllShops(),
  ]);

  // view_count降順でソート（ランキング）
  const rankedGirls = [...allGirls].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));

  const girlIds = rankedGirls.map(g => g.id);
  const schedules = await getSchedulesForGirls(girlIds);
  const scheduleMap = new Map(schedules.map(s => [s.girl_id, s]));

  const shopMap = new Map(shops.map(s => [s.id, s]));

  const medalColors = [
    'from-yellow-400 to-yellow-600 text-yellow-900',   // 1位
    'from-gray-300 to-gray-500 text-gray-800',          // 2位
    'from-orange-400 to-orange-600 text-orange-900',    // 3位
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* ページヘッダー */}
        <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
              <TrendingUp className="w-5 h-5 text-white" />
              <span className="text-white font-medium">RANKING</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">人気ランキング</h1>
            <p className="text-neutral-300 text-lg">閲覧数で決まる、今最も注目のキャスト</p>
          </div>
        </section>

        {/* TOP3 表彰台 */}
        {rankedGirls.length >= 3 && (
          <section className="container mx-auto px-4 py-12">
            <div className="flex items-end justify-center gap-4 md:gap-8">
              {/* 2位 */}
              {[1, 0, 2].map((rankIndex) => {
                const girl = rankedGirls[rankIndex];
                const shop = shopMap.get(girl.shop_id);
                const schedule = scheduleMap.get(girl.id);
                const isFirst = rankIndex === 0;
                const heights = ['h-48', 'h-64', 'h-40'];
                const podiumHeights = [heights[1], heights[0], heights[2]];
                const displayOrder = [1, 0, 2];

                return (
                  <Link
                    key={girl.id}
                    href={`/girls/${girl.id}`}
                    className="group flex flex-col items-center flex-1 max-w-[200px]"
                  >
                    {/* ランクバッジ */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-xl mb-3 bg-gradient-to-br ${medalColors[rankIndex]}`}>
                      {rankIndex + 1}
                    </div>

                    {/* 画像 */}
                    <div className={`relative w-full aspect-[3/4] ${isFirst ? 'scale-110' : ''} rounded-2xl overflow-hidden shadow-2xl border-2 ${isFirst ? 'border-yellow-400' : 'border-neutral-200'} mb-3 group-hover:shadow-rose-200 transition-all`}>
                      {isFirst && (
                        <div className="absolute top-3 right-3 z-10">
                          <Crown className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
                        </div>
                      )}
                      {schedule?.instant_available && (
                        <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                          <Zap className="w-3 h-3" />
                          <span>ソク姫</span>
                        </div>
                      )}
                      <Image
                        src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                        alt={girl.name}
                        fill
                        sizes="200px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={rankIndex < 3}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-0 right-0 text-center">
                        <div className="inline-flex items-center space-x-1 bg-white/90 rounded-full px-3 py-1 text-xs">
                          <Eye className="w-3 h-3 text-neutral-600" />
                          <span className="font-bold text-neutral-800">{girl.view_count.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-bold text-neutral-900 group-hover:text-rose-500 transition-colors text-center text-sm md:text-base">
                      {girl.name}
                    </h3>
                    <p className="text-xs text-neutral-500 text-center">{girl.age}歳 · {shop?.name}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 4位以降 */}
        {rankedGirls.length > 3 && (
          <section className="container mx-auto px-4 pb-16">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center space-x-2">
              <Star className="w-6 h-6 text-rose-500" />
              <span>4位以下のランキング</span>
            </h2>
            <div className="space-y-3">
              {rankedGirls.slice(3).map((girl, idx) => {
                const rank = idx + 4;
                const shop = shopMap.get(girl.shop_id);
                const schedule = scheduleMap.get(girl.id);

                return (
                  <Link
                    key={girl.id}
                    href={`/girls/${girl.id}`}
                    className="group flex items-center bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 hover:border-rose-300 hover:shadow-lg transition-all gap-4"
                  >
                    {/* ランク番号 */}
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-neutral-100 font-bold text-neutral-500 text-lg">
                      {rank}
                    </div>

                    {/* サムネイル */}
                    <div className="relative w-16 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
                      <Image
                        src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                        alt={girl.name}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* 情報 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-neutral-900 group-hover:text-rose-500 transition-colors truncate">
                        {girl.name}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {girl.age}歳 · T{girl.height} · {shop?.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        {girl.is_new && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded-full">NEW</span>
                        )}
                        {schedule?.status === 'working' && (
                          <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />出勤中
                          </span>
                        )}
                        {schedule?.instant_available && (
                          <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3" />ソク姫
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ビュー数 */}
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      <div className="flex items-center space-x-1 text-neutral-500 text-sm">
                        <Eye className="w-4 h-4" />
                        <span className="font-bold">{girl.view_count.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {rankedGirls.length === 0 && (
          <div className="container mx-auto px-4 py-20 text-center">
            <TrendingUp className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">まだキャストが登録されていません</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
