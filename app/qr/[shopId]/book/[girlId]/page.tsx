import type { Metadata } from 'next';
import { getShopById } from '@/lib/api/shops';
import { getGirlById, getAllGirls } from '@/lib/api/girls';
import { getPricePlansByShopId } from '@/lib/api/price-plans';
import QRBookingForm from '@/components/QRBookingForm';
import Link from 'next/link';

export const dynamicParams = false;

export async function generateStaticParams() {
  const girls = await getAllGirls();
  return girls
    .filter((g) => g.shop_id)
    .map((g) => ({ shopId: g.shop_id, girlId: g.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shopId: string; girlId: string }>;
}): Promise<Metadata> {
  const { shopId, girlId } = await params;
  const [shop, girl] = await Promise.all([
    getShopById(shopId),
    getGirlById(girlId),
  ]);
  if (!shop || !girl) {
    return { title: 'ご予約', description: 'Velvet 中標津 予約ページ' };
  }
  const title = `${girl.name} ご予約 — ${shop.name}`;
  const desc = `${shop.name} の ${girl.name}${
    girl.age ? `(${girl.age}歳)` : ''
  } のご予約はこちらから。`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: 'website', siteName: 'Velvet' },
  };
}

export default async function QRBookPage({
  params,
}: {
  params: Promise<{ shopId: string; girlId: string }>;
}) {
  const { shopId, girlId } = await params;

  const [shop, girl, pricePlans] = await Promise.all([
    getShopById(shopId),
    getGirlById(girlId),
    getPricePlansByShopId(shopId),
  ]);

  if (!shop || !girl) {
    return (
      <main className="min-h-screen qr-bg-rose flex items-center justify-center p-8">
        <div className="text-center bg-white rounded-3xl p-10 shadow-2xl border-4 border-pink-300">
          <div className="text-6xl mb-4" aria-hidden="true">
            💔
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            情報が
            <br />
            見つかりませんでした
          </h1>
          <Link
            href={`/qr/${shopId}`}
            className="qr-tap-feedback inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full py-5 px-8 text-2xl font-black shadow-xl border-4 border-yellow-300"
          >
            ♥ 一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  return <QRBookingForm girl={girl} shop={shop} pricePlans={pricePlans} />;
}
