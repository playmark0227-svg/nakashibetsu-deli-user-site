import Link from 'next/link';
import Image from 'next/image';
import { getShopById, getAllShops } from '@/lib/api/shops';
import { getGirlsByShopId } from '@/lib/api/girls';
import { getSchedulesForGirls } from '@/lib/api/schedules';
import { Phone, Clock, Heart, Sparkles, Star, ChevronRight, MapPin } from 'lucide-react';

export const dynamicParams = false;

export async function generateStaticParams() {
  const shops = await getAllShops();
  return shops.map((s) => ({ shopId: s.id }));
}

export default async function QRShopPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;

  const [shop, girls] = await Promise.all([
    getShopById(shopId),
    getGirlsByShopId(shopId),
  ]);

  if (!shop) {
    return (
      <main className="min-h-screen qr-bg-rose flex items-center justify-center p-8">
        <div className="text-center bg-white rounded-3xl p-10 shadow-2xl border-4 border-pink-300">
          <div className="text-6xl mb-4">💔</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            店舗情報が
            <br />
            見つかりません
          </h1>
          <p className="text-2xl text-gray-600">お電話ください</p>
        </div>
      </main>
    );
  }

  const girlIds = girls.map((g) => g.id);
  const schedules = await getSchedulesForGirls(girlIds);
  const scheduleMap = new Map(schedules.map((s) => [s.girl_id, s]));

  const girlsWithStatus = girls.map((girl) => {
    const schedule = scheduleMap.get(girl.id);
    return {
      ...girl,
      status: schedule?.status || 'off',
      instant_available: schedule?.instant_available || false,
    };
  });

  const workingGirls = girlsWithStatus.filter(
    (g) => g.status === 'working' || g.instant_available
  );
  const otherGirls = girlsWithStatus.filter(
    (g) => g.status !== 'working' && !g.instant_available
  );

  const phoneHref = shop.phone ? `tel:${shop.phone.replace(/-/g, '')}` : undefined;

  return (
    <main className="min-h-screen qr-bg-rose pb-12">
      {/* ====== 店舗ヘッダー（ホットピンク・キラキラ） ====== */}
      <section className="relative overflow-hidden qr-bg-hot text-white">
        {/* キラキラ背景 */}
        <div className="absolute inset-0 qr-glitter pointer-events-none" />
        <div className="absolute inset-0 qr-shimmer pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-6 pt-8 pb-10 text-center">
          {/* 装飾上 */}
          <div className="flex items-center justify-center gap-2 mb-3 text-yellow-200">
            <Sparkles size={20} className="qr-sparkle" />
            <Star size={16} className="qr-sparkle fill-yellow-200" />
            <Sparkles size={20} className="qr-sparkle" />
            <Star size={16} className="qr-sparkle fill-yellow-200" />
            <Sparkles size={20} className="qr-sparkle" />
          </div>

          <div className="text-sm tracking-[0.4em] text-yellow-100 mb-2 uppercase font-bold">
            ★ Welcome ★
          </div>

          {/* 店舗名 */}
          <h1
            className="text-4xl md:text-5xl font-black mb-3 leading-tight drop-shadow-lg"
            style={{
              textShadow: '0 2px 12px rgba(0,0,0,0.35), 0 0 24px rgba(255,255,255,0.2)',
            }}
          >
            {shop.name}
          </h1>

          {/* 装飾下線 */}
          <div className="qr-underline w-32 mx-auto mb-5" />

          {shop.description && (
            <p className="text-lg md:text-xl text-pink-50 mb-6 leading-relaxed font-medium px-2">
              {shop.description}
            </p>
          )}

          {/* 電話大ボタン */}
          {phoneHref && (
            <a
              href={phoneHref}
              className="qr-cta-pulse qr-tap-feedback inline-flex items-center justify-center gap-3 bg-white text-pink-600 rounded-full py-5 px-8 text-3xl font-black shadow-2xl border-4 border-yellow-300 mb-3"
            >
              <Phone size={32} strokeWidth={3} className="qr-heart" />
              <span className="tracking-wider">{shop.phone}</span>
            </a>
          )}
          <p className="text-base text-pink-100 mt-1 font-bold">
            👆 タップでお電話できます 👆
          </p>

          {/* 営業時間・住所 */}
          <div className="flex flex-col gap-2 items-center mt-6 text-base text-pink-50">
            {shop.business_hours && (
              <div className="flex items-center gap-2 bg-pink-900/30 rounded-full px-5 py-2 backdrop-blur-sm">
                <Clock size={18} />
                <span>営業時間 {shop.business_hours}</span>
              </div>
            )}
            {shop.address && (
              <div className="flex items-center gap-2 bg-pink-900/30 rounded-full px-5 py-2 backdrop-blur-sm">
                <MapPin size={18} />
                <span>{shop.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* 下部の波形装飾 */}
        <svg
          className="block w-full h-8 -mb-px"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fff5f8"
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          />
        </svg>
      </section>

      {/* ====== 手順カード ====== */}
      <section className="max-w-2xl mx-auto px-6 -mt-2 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-pink-200 text-center relative overflow-hidden">
          <div className="absolute top-2 right-3 text-pink-200 text-3xl opacity-50">
            ♡
          </div>
          <div className="absolute bottom-2 left-3 text-pink-200 text-2xl opacity-50">
            ♡
          </div>

          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wider mb-3">
            <span className="qr-heart">♥</span>
            <span>Step 1</span>
            <span className="qr-heart">♥</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
            お好きな女の子を
            <br />
            <span className="text-pink-600">お選びください</span>
            <span className="qr-heart inline-block ml-2 text-pink-500">♥</span>
          </h2>
          <p className="text-xl text-gray-700 font-bold">
            写真をタップしてください
          </p>
        </div>
      </section>

      {/* ====== 今すぐ会える女の子 ====== */}
      {workingGirls.length > 0 && (
        <section className="max-w-2xl mx-auto px-6 mb-10">
          {/* 緑の出勤中バナー */}
          <div className="relative qr-bg-working text-white rounded-3xl py-5 px-6 mb-6 text-center shadow-xl overflow-hidden">
            <div className="absolute inset-0 qr-shimmer pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-center gap-2 text-yellow-200 text-xs font-bold tracking-[0.4em] uppercase mb-1">
                <Sparkles size={14} className="qr-sparkle" />
                <span>Available Now</span>
                <Sparkles size={14} className="qr-sparkle" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black flex items-center justify-center gap-2">
                <span className="qr-heart">✨</span>
                <span>今すぐ会える女の子</span>
                <span className="qr-heart">✨</span>
              </h3>
            </div>
          </div>

          <div className="space-y-5">
            {workingGirls.map((girl) => (
              <QRGirlCard
                key={girl.id}
                girl={girl}
                shopId={shopId}
                accent="working"
              />
            ))}
          </div>
        </section>
      )}

      {/* ====== 在籍キャスト一覧 ====== */}
      {otherGirls.length > 0 && (
        <section className="max-w-2xl mx-auto px-6 mb-10">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-3xl py-5 px-6 mb-6 text-center shadow-xl">
            <div className="flex items-center justify-center gap-2 text-pink-100 text-xs font-bold tracking-[0.4em] uppercase mb-1">
              <Heart size={14} className="qr-heart fill-pink-100" />
              <span>All Cast</span>
              <Heart size={14} className="qr-heart fill-pink-100" />
            </div>
            <h3 className="text-3xl md:text-4xl font-black">在籍キャスト</h3>
          </div>

          <div className="space-y-5">
            {otherGirls.map((girl) => (
              <QRGirlCard
                key={girl.id}
                girl={girl}
                shopId={shopId}
                accent="default"
              />
            ))}
          </div>
        </section>
      )}

      {/* キャストなし */}
      {workingGirls.length === 0 && otherGirls.length === 0 && (
        <section className="max-w-2xl mx-auto px-6 mt-6">
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl border-4 border-pink-200">
            <div className="text-6xl mb-4">💌</div>
            <p className="text-2xl text-gray-800 font-bold mb-3">
              現在キャストの
              <br />
              登録がありません
            </p>
            <p className="text-lg text-gray-600 mb-6">
              お電話でお問い合わせください
            </p>
            {phoneHref && (
              <a
                href={phoneHref}
                className="qr-tap-feedback inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full py-5 px-8 text-2xl font-black shadow-xl"
              >
                <Phone size={28} />
                <span>{shop.phone}</span>
              </a>
            )}
          </div>
        </section>
      )}

      {/* ====== 電話予約フッター ====== */}
      {phoneHref && (
        <section className="max-w-2xl mx-auto px-6">
          <div className="qr-bg-hot relative overflow-hidden rounded-3xl p-8 text-center shadow-2xl">
            <div className="absolute inset-0 qr-glitter pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-center gap-2 text-yellow-200 mb-2">
                <Sparkles size={18} className="qr-sparkle" />
                <span className="text-sm font-bold tracking-[0.3em] uppercase">
                  Call Us
                </span>
                <Sparkles size={18} className="qr-sparkle" />
              </div>
              <p className="text-2xl text-white font-bold mb-5 leading-relaxed">
                分からない場合は
                <br />
                お電話ください
                <span className="qr-heart inline-block ml-1">♥</span>
              </p>
              <a
                href={phoneHref}
                className="qr-cta-pulse qr-tap-feedback inline-flex items-center justify-center gap-3 bg-white text-pink-600 rounded-full py-5 px-8 text-3xl font-black shadow-2xl border-4 border-yellow-300"
              >
                <Phone size={32} strokeWidth={3} />
                <span className="tracking-wider">{shop.phone}</span>
              </a>
            </div>
          </div>

          <p className="text-center text-sm text-pink-400 mt-6 font-bold">
            ♥ Velvet — Nakashibetsu Premium ♥
          </p>
        </section>
      )}
    </main>
  );
}

function QRGirlCard({
  girl,
  shopId,
  accent,
}: {
  girl: {
    id: string;
    name: string;
    age: number | null;
    height: number | null;
    bust: number | null;
    waist?: number | null;
    hip?: number | null;
    thumbnail_url: string | null;
    is_new?: boolean;
  };
  shopId: string;
  accent: 'working' | 'default';
}) {
  const isWorking = accent === 'working';

  return (
    <Link
      href={`/qr/${shopId}/book/${girl.id}`}
      className={`qr-tap-feedback block bg-white rounded-3xl overflow-hidden shadow-xl border-4 ${
        isWorking ? 'border-emerald-400' : 'border-pink-200'
      }`}
    >
      <div className="flex">
        {/* 写真 */}
        <div className="relative w-40 h-52 md:w-48 md:h-60 flex-shrink-0 bg-pink-50">
          <Image
            src={girl.thumbnail_url || '/placeholder-girl.jpg'}
            alt={girl.name}
            fill
            sizes="200px"
            className="object-cover"
          />
          {/* 出勤中バッジ */}
          {isWorking && (
            <div className="absolute top-2 left-2 qr-pulse-ring bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <span>✨</span>
              <span>出勤中</span>
            </div>
          )}
          {/* NEW バッジ */}
          {girl.is_new && !isWorking && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
              NEW ♥
            </div>
          )}
          {/* ハート装飾 */}
          <div className="absolute top-2 right-2 text-pink-400 text-2xl drop-shadow-lg">
            ♥
          </div>
        </div>

        {/* 情報 */}
        <div className="flex-1 p-4 flex flex-col justify-between bg-gradient-to-br from-white to-pink-50">
          <div>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">
              {girl.name}
              <span className="text-pink-500 ml-1">♥</span>
            </h3>
            <div className="space-y-1 text-base md:text-lg text-gray-700 font-bold">
              {girl.age && (
                <div className="flex items-center gap-2">
                  <span className="text-pink-400">●</span>
                  <span>{girl.age}歳</span>
                </div>
              )}
              {girl.height && (
                <div className="flex items-center gap-2">
                  <span className="text-pink-400">●</span>
                  <span>身長 {girl.height}cm</span>
                </div>
              )}
              {(girl.bust || girl.waist || girl.hip) && (
                <div className="flex items-center gap-2">
                  <span className="text-pink-400">●</span>
                  <span>
                    {girl.bust && `B${girl.bust}`}
                    {girl.waist && ` W${girl.waist}`}
                    {girl.hip && ` H${girl.hip}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 予約ボタン */}
      <div
        className={`py-5 px-6 flex items-center justify-center gap-2 text-2xl md:text-3xl font-black text-white ${
          isWorking
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
            : 'bg-gradient-to-r from-pink-500 to-rose-500'
        }`}
      >
        <span className="qr-heart">♥</span>
        <span>この子を予約する</span>
        <ChevronRight size={28} strokeWidth={3} />
      </div>
    </Link>
  );
}
