interface ShopJsonLdProps {
  shop: {
    id: string;
    name: string;
    description?: string | null;
    phone?: string | null;
    address?: string | null;
    business_hours?: string | null;
    image_url?: string | null;
  };
}

const SITE_URL = 'https://playmark0227-svg.github.io/nakashibetsu-deli-user-site';

/**
 * 店舗の構造化データ (schema.org LocalBusiness)。
 * Google のリッチリザルト / ナレッジパネルに店名・電話・住所・営業時間が
 * 反映されやすくなる。<script type="application/ld+json"> を出力するだけ。
 */
export default function ShopJsonLd({ shop }: ShopJsonLdProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: shop.name,
    url: `${SITE_URL}/shops/${shop.id}/`,
    '@id': `${SITE_URL}/shops/${shop.id}/`,
  };

  if (shop.description) data.description = shop.description;
  if (shop.phone) data.telephone = shop.phone;
  if (shop.image_url) data.image = shop.image_url;
  if (shop.business_hours) data.openingHours = shop.business_hours;
  if (shop.address) {
    data.address = {
      '@type': 'PostalAddress',
      addressLocality: '中標津町',
      addressRegion: '北海道',
      addressCountry: 'JP',
      streetAddress: shop.address,
    };
  }
  data.areaServed = {
    '@type': 'City',
    name: '中標津町',
  };

  return (
    <script
      type="application/ld+json"
      // 信頼できる自前データのみ。ユーザー入力は含まない。
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
