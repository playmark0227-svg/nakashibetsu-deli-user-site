import Link from 'next/link';
import Image from 'next/image';
import { getShopById, getAllShops } from '@/lib/api/shops';
import { getGirlsByShopId } from '@/lib/api/girls';
import { getSchedulesForGirls } from '@/lib/api/schedules';
import { Phone, Clock, ChevronRight } from 'lucide-react';

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
      <main className="min-h-screen bg-[#fdfbf6] flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-6">店舗情報が<br />見つかりません</h1>
          <p className="text-2xl text-[#555]">お店に直接ご連絡ください</p>
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
    <main className="min-h-screen bg-[#fdfbf6] pb-16">
      {/* 店舗ヘッダー */}
      <section className="bg-[#1a1a1a] text-white py-10 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-sm tracking-[0.3em] text-[#c9a961] mb-3 uppercase">
            Welcome
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {shop.name}
          </h1>
          {phoneHref && (
            <a
              href={phoneHref}
              className="flex items-center justify-center gap-3 bg-[#c9a961] text-[#1a1a1a] rounded-2xl py-5 px-6 text-3xl font-bold active:scale-95 transition-transform shadow-lg"
            >
              <Phone size={32} strokeWidth={2.5} />
              <span>{shop.phone}</span>
            </a>
          )}
          <p className="text-base text-[#c9a961] mt-3">
            ↑ タップでお電話できます
          </p>
          {shop.business_hours && (
            <div className="flex items-center justify-center gap-2 mt-6 text-lg text-white/80">
              <Clock size={20} />
              <span>営業時間 {shop.business_hours}</span>
            </div>
          )}
        </div>
      </section>

      {/* 手順説明 */}
      <section className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white border-2 border-[#c9a961]/30 rounded-3xl p-6 text-center shadow-sm">
          <div className="text-[#c9a961] text-sm tracking-[0.3em] uppercase mb-2">
            Step 1
          </div>
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">
            お好きな女の子を<br />お選びください
          </h2>
          <p className="text-xl text-[#555] mt-3">
            写真をタップしてください
          </p>
        </div>
      </section>

      {/* 今すぐ遊べるキャスト */}
      {workingGirls.length > 0 && (
        <section className="max-w-2xl mx-auto px-6 mb-10">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-3xl py-5 px-6 mb-6 text-center shadow-md">
            <div className="text-sm tracking-[0.3em] uppercase opacity-90 mb-1">
              Available Now
            </div>
            <h3 className="text-3xl font-bold">今すぐ会える女の子</h3>
          </div>

          <div className="space-y-5">
            {workingGirls.map((girl) => (
              <QRGirlCard
                key={girl.id}
                girl={girl}
                shopId={shopId}
                accent="emerald"
              />
            ))}
          </div>
        </section>
      )}

      {/* その他のキャスト */}
      {otherGirls.length > 0 && (
        <section className="max-w-2xl mx-auto px-6">
          <div className="bg-[#1a1a1a] text-white rounded-3xl py-5 px-6 mb-6 text-center shadow-md">
            <div className="text-sm tracking-[0.3em] uppercase text-[#c9a961] mb-1">
              All Cast
            </div>
            <h3 className="text-3xl font-bold">在籍キャスト</h3>
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
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
            <p className="text-2xl text-[#333] font-bold mb-3">
              現在キャストの登録がありません
            </p>
            <p className="text-lg text-[#666] mb-6">
              お電話でお問い合わせください
            </p>
            {phoneHref && (
              <a
                href={phoneHref}
                className="inline-flex items-center gap-3 bg-[#c9a961] text-[#1a1a1a] rounded-2xl py-5 px-8 text-2xl font-bold active:scale-95 transition-transform shadow"
              >
                <Phone size={28} />
                <span>{shop.phone}</span>
              </a>
            )}
          </div>
        </section>
      )}

      {/* フッター電話予約 */}
      {phoneHref && (
        <section className="max-w-2xl mx-auto px-6 mt-12">
          <div className="bg-[#1a1a1a] text-white rounded-3xl p-8 text-center shadow-md">
            <p className="text-xl mb-4">
              分からない場合は<br />お電話ください
            </p>
            <a
              href={phoneHref}
              className="inline-flex items-center gap-3 bg-white text-[#1a1a1a] rounded-2xl py-5 px-8 text-2xl font-bold active:scale-95 transition-transform shadow"
            >
              <Phone size={28} strokeWidth={2.5} />
              <span>{shop.phone}</span>
            </a>
          </div>
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
  girl: { id: string; name: string; age: number | null; height: number | null; bust: number | null; thumbnail_url: string | null; is_new?: boolean };
  shopId: string;
  accent: 'emerald' | 'default';
}) {
  const borderClass =
    accent === 'emerald' ? 'border-emerald-400' : 'border-[#e5e0d4]';
  const ctaBg =
    accent === 'emerald'
      ? 'bg-emerald-600 active:bg-emerald-700'
      : 'bg-[#1a1a1a] active:bg-black';

  return (
    <Link
      href={`/qr/${shopId}/book/${girl.id}`}
      className={`block bg-white rounded-3xl overflow-hidden shadow-md border-2 ${borderClass} active:scale-[0.98] transition-transform`}
    >
      <div className="flex">
        {/* 写真 */}
        <div className="relative w-36 h-48 flex-shrink-0 bg-[#f5f1e8]">
          <Image
            src={girl.thumbnail_url || '/placeholder-girl.jpg'}
            alt={girl.name}
            fill
            sizes="144px"
            className="object-cover"
          />
          {accent === 'emerald' && (
            <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">
              出勤中
            </div>
          )}
          {girl.is_new && accent !== 'emerald' && (
            <div className="absolute top-2 left-2 bg-[#c9a961] text-[#1a1a1a] text-xs font-bold px-2 py-1 rounded">
              NEW
            </div>
          )}
        </div>

        {/* 情報 */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-bold text-[#1a1a1a] mb-2">
              {girl.name}
            </h3>
            <div className="text-lg text-[#555] space-y-0.5">
              {girl.age && <div>{girl.age}歳</div>}
              {girl.height && <div>身長 {girl.height}cm</div>}
              {girl.bust && <div>B {girl.bust}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* 予約ボタン */}
      <div
        className={`${ctaBg} text-white py-5 px-6 flex items-center justify-center gap-2 text-2xl font-bold`}
      >
        <span>この子を予約する</span>
        <ChevronRight size={28} strokeWidth={3} />
      </div>
    </Link>
  );
}
