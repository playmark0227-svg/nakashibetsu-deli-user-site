import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllShops, getAllGirls } from '@/lib/api';
import { getInstantAvailableGirls, getSchedulesForGirls } from '@/lib/api/schedules';
import { Store, Star, Crown, ArrowRight, Zap, Building2, Clock } from 'lucide-react';

// 60秒ごとにキャッシュを更新（パフォーマンス最適化）
export const revalidate = 60;

export default async function HomePage() {
  const shops = await getAllShops();
  const allGirls = await getAllGirls();
  const instantGirls = await getInstantAvailableGirls();
  
  // 店舗ごとにキャストをグループ化（最適化版）
  const shopGirls = shops.map(shop => {
    const shopGirlsList = allGirls.filter(g => g.shop_id === shop.id);
    return {
      shop,
      girls: shopGirlsList.slice(0, 6), // 各店舗6名まで
      newGirls: shopGirlsList.filter(g => g.is_new).length,
    };
  });
  
  // トップページ表示用のキャストのみスケジュール取得（最適化）
  const displayedGirlIds = shopGirls.flatMap(sg => sg.girls.map(g => g.id));
  const schedules = await getSchedulesForGirls(displayedGirlIds);
  const scheduleMap = new Map(schedules.map(s => [s.girl_id, s]));
  
  // 表示するキャストにステータスを追加
  shopGirls.forEach(sg => {
    sg.girls = sg.girls.map(girl => {
      const schedule = scheduleMap.get(girl.id);
      return {
        ...girl,
        status: schedule?.status || 'off',
        instant_available: schedule?.instant_available || false,
      };
    });
  });

  const totalGirls = allGirls.length;
  const totalShops = shops.length;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 relative">
        {/* 左右デッドスペースの幾何学パターン背景 */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="deadspace-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                {/* ダイヤモンドグリッド */}
                <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="rgba(23,23,23,0.04)" strokeWidth="1"/>
                {/* 内側の小さいダイヤモンド */}
                <path d="M40 20 L60 40 L40 60 L20 40 Z" fill="none" stroke="rgba(23,23,23,0.03)" strokeWidth="0.5"/>
                {/* ドット */}
                <circle cx="40" cy="40" r="2" fill="rgba(23,23,23,0.03)"/>
                <circle cx="0" cy="0" r="1" fill="rgba(23,23,23,0.02)"/>
                <circle cx="80" cy="0" r="1" fill="rgba(23,23,23,0.02)"/>
                <circle cx="0" cy="80" r="1" fill="rgba(23,23,23,0.02)"/>
                <circle cx="80" cy="80" r="1" fill="rgba(23,23,23,0.02)"/>
                {/* 斜めライン */}
                <line x1="0" y1="0" x2="80" y2="80" stroke="rgba(23,23,23,0.02)" strokeWidth="0.3"/>
                <line x1="80" y1="0" x2="0" y2="80" stroke="rgba(23,23,23,0.02)" strokeWidth="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#deadspace-pattern)"/>
          </svg>
        </div>
        {/* Hero Section - 幾何学パターン背景 */}
        <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
          {/* 幾何学パターン背景 */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hexagons" x="0" y="0" width="50" height="43.4" patternUnits="userSpaceOnUse">
                  <path d="M25 0 L50 12.5 L50 31.5 L25 43.4 L0 31.5 L0 12.5 Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagons)" className="text-white"/>
            </svg>
          </div>
          
          {/* グリッドパターン */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-8">
                <Crown className="w-5 h-5 text-white" />
                <span className="text-sm text-white font-medium tracking-wider">NAKASHIBETSU PREMIUM</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight text-white tracking-tight">
                Velvet
              </h1>
              <p className="text-2xl md:text-3xl text-neutral-300 mb-12 font-light">
                中標津で、上質な夜を
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-12">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-white mb-2">{totalShops}</div>
                  <div className="text-sm text-neutral-400 uppercase tracking-wider">Shops</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-white mb-2">{totalGirls}</div>
                  <div className="text-sm text-neutral-400 uppercase tracking-wider">Casts</div>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="#shops"
                className="inline-flex items-center space-x-3 px-10 py-5 bg-white text-neutral-900 font-semibold rounded-full hover:bg-neutral-100 transition-all transform hover:scale-105 shadow-2xl"
              >
                <Building2 className="w-5 h-5" />
                <span>店舗から探す</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ソク姫セクション */}
        {instantGirls.length > 0 && (
          <section className="relative container mx-auto px-4 py-16 z-10">
            <div className="relative bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl overflow-hidden shadow-2xl">
              {/* 幾何学パターン */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1))] bg-[length:20px_20px]"></div>
              </div>
              
              <div className="relative p-8 md:p-12">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">今すぐ遊べる！</h2>
                    <p className="text-white/80 text-sm">ソク姫対応 {instantGirls.length}名</p>
                  </div>
                  <span className="ml-auto bg-white text-rose-600 text-xs font-bold px-4 py-2 rounded-full animate-bounce">
                    LIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {instantGirls.map((schedule: any) => {
                    const girl = schedule.girls;
                    return (
                      <Link
                        key={girl.id}
                        href={`/girls/${girl.id}`}
                        className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                      >
                        <div className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span>ソク姫</span>
                        </div>

                        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                          <Image
                            src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                            alt={girl.name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            priority={false}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
                              <div className="flex items-center justify-between text-neutral-700">
                                <span className="font-semibold">出勤中</span>
                                <span>{schedule.start_time?.substring(0, 5)} 〜 {schedule.end_time?.substring(0, 5)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-bold text-neutral-900 mb-1 group-hover:text-rose-500 transition-colors">
                            {girl.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-neutral-600">
                            <span>{girl.age}歳</span>
                            <span>•</span>
                            <span>T{girl.height}</span>
                            <span>•</span>
                            <span>B{girl.bust}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 店舗ベースセクション */}
        <section id="shops" className="relative container mx-auto px-4 py-16 z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">店舗から選ぶ</h2>
            <p className="text-neutral-600 text-lg">お好みの店舗からキャストをお選びください</p>
          </div>

          <div className="space-y-12">
            {shopGirls.map(({ shop, girls, newGirls }) => (
              <div key={shop.id} className="relative">
                {/* 店舗カード */}
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl border border-neutral-200 hover:shadow-2xl transition-shadow duration-300">
                  
                  {/* 店舗ヘッダー - 横並びレイアウト */}
                  <div className="flex flex-col md:flex-row">
                    {/* 左側: 店舗情報（2/3） */}
                    <div className="flex-1 p-10 md:p-12">
                      <div className="flex flex-col h-full justify-between gap-6">
                        <div>
                          {/* 店舗名 - さらに大きく */}
                          <h3 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 leading-tight">
                            {shop.name}
                          </h3>
                          
                          {/* 説明文 - より詳しく、読みやすく */}
                          <p className="text-neutral-700 text-lg leading-relaxed mb-6 font-medium">
                            {shop.description || '厳選されたキャストが在籍する上質な店舗です。'}
                          </p>
                          
                          {/* 追加情報エリア */}
                          <div className="space-y-3 mb-6">
                            {/* 営業時間 */}
                            {shop.business_hours && (
                              <div className="flex items-center gap-3 text-base text-neutral-600">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-xs text-neutral-500 font-medium">営業時間</div>
                                  <div className="font-semibold">{shop.business_hours}</div>
                                </div>
                              </div>
                            )}
                            
                            {/* 電話番号 */}
                            {shop.phone && (
                              <div className="flex items-center gap-3 text-base text-neutral-600">
                                <div className="w-10 h-10 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <Building2 className="w-5 h-5 text-rose-600" />
                                </div>
                                <div>
                                  <div className="text-xs text-neutral-500 font-medium">お問い合わせ</div>
                                  <a 
                                    href={`tel:${shop.phone.replace(/-/g, '')}`}
                                    className="font-semibold hover:text-rose-600 transition-colors"
                                  >
                                    {shop.phone}
                                  </a>
                                </div>
                              </div>
                            )}
                            
                            {/* エリア情報 */}
                            {shop.address && (
                              <div className="flex items-center gap-3 text-base text-neutral-600">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <Store className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                  <div className="text-xs text-neutral-500 font-medium">エリア</div>
                                  <div className="font-semibold">{shop.address}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* バッジエリア - より目立つデザイン */}
                        <div className="flex flex-wrap items-center gap-3">
                          {newGirls > 0 && (
                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-rose-200">
                              <Star className="w-4 h-4 fill-white" />
                              <span>新人 {newGirls}名</span>
                            </div>
                          )}
                          <div className="inline-flex items-center gap-2 text-sm text-neutral-700 bg-neutral-100 px-5 py-2.5 rounded-xl border border-neutral-200 font-semibold">
                            <Crown className="w-4 h-4 text-neutral-600" />
                            <span>在籍 {girls.length}名</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 右側: 店舗画像（1/3） */}
                    {shop.image_url && (
                      <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden group">
                        <Image
                          src={shop.image_url}
                          alt={shop.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          priority={false}
                        />
                        {/* 微細なグラデーションオーバーレイ */}
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/5 to-black/10"></div>
                      </div>
                    )}
                    
                    {/* 画像がない場合のプレースホルダー */}
                    {!shop.image_url && (
                      <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                        <Store className="w-20 h-20 text-neutral-300" />
                      </div>
                    )}
                  </div>

                  {/* キャスト一覧 */}
                  {girls.length > 0 ? (
                    <div className="p-8">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        {girls.map((girl: any) => (
                          <Link
                            key={girl.id}
                            href={`/girls/${girl.id}`}
                            className="group"
                          >
                            <div className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden mb-2 border border-neutral-200 hover:border-rose-300 hover:shadow-lg transition-all">
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
                              
                              <Image
                                src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                                alt={girl.name}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                priority={false}
                              />
                            </div>
                            <h4 className="font-semibold text-sm text-neutral-900 group-hover:text-rose-500 transition-colors text-center">
                              {girl.name}
                            </h4>
                            <p className="text-xs text-neutral-500 text-center">{girl.age}歳</p>
                          </Link>
                        ))}
                      </div>

                      {/* 店舗詳細ボタン */}
                      <div className="text-center">
                        <Link
                          href={`/shops/${shop.id}`}
                          className="inline-flex items-center space-x-2 px-8 py-4 bg-neutral-900 text-white font-semibold rounded-full hover:bg-neutral-800 transition-all transform hover:scale-105"
                        >
                          <span>この店舗の詳細を見る</span>
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-neutral-500">
                      現在キャストの登録がありません
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="relative bg-neutral-900 text-white py-20 overflow-hidden z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Velvetが選ばれる理由</h2>
              <p className="text-neutral-400 text-lg">最高のエスコート体験をお約束します</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                  <Crown className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-3">厳選された店舗</h3>
                <p className="text-neutral-400 leading-relaxed">
                  中標津エリアの優良店のみを掲載。安心してご利用いただけます。
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                  <Star className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-3">リアルタイム情報</h3>
                <p className="text-neutral-400 leading-relaxed">
                  出勤情報や新人情報を常に最新の状態で更新しています。
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                  <Zap className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-3">ソク姫対応</h3>
                <p className="text-neutral-400 leading-relaxed">
                  今すぐ遊べるキャストを簡単に探せます。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
