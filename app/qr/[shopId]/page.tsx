import type { Metadata } from 'next';
import { getShopById, getAllShops } from '@/lib/api/shops';
import { getGirlsByShopId } from '@/lib/api/girls';
import { getSchedulesForGirls } from '@/lib/api/schedules';
import { getPricePlansByShopId } from '@/lib/api/price-plans';
import { getReviewStatsForGirls } from '@/lib/api/reviews';
import { Phone, Clock, Sparkles, Star, MapPin, Lock, JapaneseYen, HeartHandshake } from 'lucide-react';
import StickyPhoneBar from '@/components/StickyPhoneBar';
import QRCastTabs from '@/components/QRCastTabs';
import ShopJsonLd from '@/components/ShopJsonLd';

export const dynamicParams = false;

export async function generateStaticParams() {
  const shops = await getAllShops();
  return shops.map((s) => ({ shopId: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shopId: string }>;
}): Promise<Metadata> {
  const { shopId } = await params;
  const shop = await getShopById(shopId);
  if (!shop) {
    return { title: 'ご予約', description: 'Velvet 中標津 予約ページ' };
  }
  const title = `${shop.name} ご予約`;
  const desc = shop.description
    ? `${shop.name} — ${shop.description}`
    : `${shop.name} のご予約はこちらから。お電話 ${shop.phone ?? ''}`;
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'website',
      siteName: 'Velvet',
    },
  };
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
  // 出勤状況・レビュー統計・料金プランを並列取得
  const [schedules, reviewStats, pricePlans] = await Promise.all([
    getSchedulesForGirls(girlIds),
    getReviewStatsForGirls(girlIds),
    getPricePlansByShopId(shopId),
  ]);
  const scheduleMap = new Map(schedules.map((s) => [s.girl_id, s]));

  // 最安料金（カードに「60分 ¥◯〜」と出して料金不安を先に解消）
  const minPlan =
    pricePlans.length > 0
      ? pricePlans.reduce((a, b) => (a.price <= b.price ? a : b))
      : null;

  const girlsWithStatus = girls.map((girl) => {
    const schedule = scheduleMap.get(girl.id);
    const stat = reviewStats.get(girl.id);
    return {
      ...girl,
      status: schedule?.status || 'off',
      instant_available: schedule?.instant_available || false,
      review_count: stat?.count ?? 0,
      review_avg: stat?.avg ?? 0,
    };
  });

  // 出勤での分類は QRCastTabs 側でクライアント最新化して行う。
  // ここでは「店舗にキャストが1人でも登録されているか」だけ使う。
  const hasAnyGirls = girlsWithStatus.length > 0;

  const phoneHref = shop.phone ? `tel:${shop.phone.replace(/-/g, '')}` : undefined;

  return (
    <main className="min-h-screen qr-bg-rose pb-12" aria-labelledby="shop-name">
      <ShopJsonLd shop={shop} />
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
            id="shop-name"
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
              aria-label={`${shop.name} に電話して予約する ${shop.phone}`}
              className="qr-cta-pulse qr-tap-feedback inline-flex items-center justify-center gap-3 bg-white text-pink-600 rounded-full py-5 px-8 text-3xl font-black shadow-2xl border-4 border-yellow-300 mb-3"
            >
              <Phone size={32} strokeWidth={3} className="qr-heart" aria-hidden="true" />
              <span className="tracking-wider">{shop.phone}</span>
            </a>
          )}
          <p className="text-base text-pink-100 mt-1 font-bold">
            👆 タップでお電話できます 👆
          </p>

          {/* 安心訴求バッジ（来店の最大の障壁=不安を解消） */}
          <ul className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { icon: Phone, label: '電話1本ですぐ手配' },
              { icon: HeartHandshake, label: '初めての方も歓迎' },
              { icon: Lock, label: '秘密厳守' },
              { icon: JapaneseYen, label: '明朗会計' },
            ].map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-1.5 bg-white/95 text-pink-700 rounded-full pl-2.5 pr-3.5 py-1.5 text-sm font-black shadow-md"
              >
                <Icon size={16} strokeWidth={2.8} aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>

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

          {/* STEP プログレスインジケータ */}
          <ol
            aria-label="予約ステップ"
            className="inline-flex items-center justify-center gap-2 mb-3 text-xs font-black tracking-wider"
          >
            <li
              aria-current="step"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500 text-white shadow"
            >
              <span
                className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-pink-600 text-[10px] font-black"
                aria-hidden="true"
              >
                1
              </span>
              <span>女の子選択</span>
            </li>
            <span className="text-pink-300" aria-hidden="true">
              ▸
            </span>
            <li className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-500">
              <span
                className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-200 text-pink-700 text-[10px] font-black"
                aria-hidden="true"
              >
                2
              </span>
              <span>内容入力</span>
            </li>
          </ol>

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

      {/* ====== キャスト一覧（タブ切り替え・出勤はクライアントで最新化） ====== */}
      {hasAnyGirls && (
        <QRCastTabs
          girls={girlsWithStatus}
          shopId={shopId}
          minDuration={minPlan?.duration ?? null}
          minPrice={minPlan?.price ?? null}
        />
      )}

      {/* キャストなし — 電話CTA（タブ自体に空メッセージあり、店舗自体にキャスト未登録の時用） */}
      {!hasAnyGirls && phoneHref && (
        <section className="max-w-2xl mx-auto px-6 mt-6">
          <div className="bg-white rounded-3xl p-8 text-center shadow-xl border-4 border-pink-200">
            <p className="text-lg text-gray-700 mb-5 font-bold">
              お電話でお問い合わせください
            </p>
            <a
              href={phoneHref}
              aria-label={`${shop.name} に電話する ${shop.phone}`}
              className="qr-tap-feedback inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full py-5 px-8 text-2xl font-black shadow-xl"
            >
              <Phone size={28} aria-hidden="true" />
              <span>{shop.phone}</span>
            </a>
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
                aria-label={`${shop.name} に電話する ${shop.phone}`}
                className="qr-cta-pulse qr-tap-feedback inline-flex items-center justify-center gap-3 bg-white text-pink-600 rounded-full py-5 px-8 text-3xl font-black shadow-2xl border-4 border-yellow-300"
              >
                <Phone size={32} strokeWidth={3} aria-hidden="true" />
                <span className="tracking-wider">{shop.phone}</span>
              </a>
            </div>
          </div>

          <p className="text-center text-sm text-pink-400 mt-6 font-bold">
            ♥ Velvet — Nakashibetsu Premium ♥
          </p>
        </section>
      )}

      {/* ====== 画面下に固定電話バー ====== */}
      {shop.phone && <StickyPhoneBar phone={shop.phone} shopName={shop.name} />}
    </main>
  );
}

