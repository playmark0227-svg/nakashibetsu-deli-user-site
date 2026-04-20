import { getShopById } from '@/lib/api/shops';
import { getGirlById, getAllGirls } from '@/lib/api/girls';
import QRBookingForm from '@/components/QRBookingForm';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamicParams = false;

export async function generateStaticParams() {
  const girls = await getAllGirls();
  return girls
    .filter((g) => g.shop_id)
    .map((g) => ({ shopId: g.shop_id, girlId: g.id }));
}

export default async function QRBookPage({ 
  params 
}: { 
  params: Promise<{ shopId: string; girlId: string }> 
}) {
  const { shopId, girlId } = await params;
  
  const [shop, girl] = await Promise.all([
    getShopById(shopId),
    getGirlById(girlId),
  ]);

  if (!shop || !girl) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              情報が見つかりませんでした
            </h1>
            <Link href="/" className="text-rose-500 hover:text-rose-600 font-semibold text-2xl">
              トップページに戻る
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return <QRBookingForm girl={girl} shop={shop} />;
}
