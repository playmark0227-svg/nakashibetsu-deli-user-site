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
      <main className="min-h-screen bg-[#fdfbf6] flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-6">
            情報が<br />見つかりませんでした
          </h1>
          <Link
            href={`/qr/${shopId}`}
            className="inline-block bg-[#1a1a1a] text-white rounded-2xl py-5 px-8 text-2xl font-bold"
          >
            一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  return <QRBookingForm girl={girl} shop={shop} pricePlans={pricePlans} />;
}
