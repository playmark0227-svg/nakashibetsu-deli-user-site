-- ========================================
-- 新店舗「りある人妻の品格中標津〔幼妻、若妻、熟妻〕」完全セットアップSQL
-- ========================================

-- ステップ1: 店舗を追加
INSERT INTO shops (
  login_id,
  password_hash,
  name,
  description,
  address,
  phone,
  business_hours
) VALUES (
  'hitozuma',
  'shop123',
  'りある人妻の品格中標津〔幼妻、若妻、熟妻〕',
  '人妻専門店。幼妻・若妻・熟妻と幅広い年齢層の魅力的な人妻が在籍。上質な大人の時間をお約束します。',
  '中標津町',
  '0153-XX-XXXX',
  '10:00-24:00'
);

-- ステップ2: 料金プランを追加
WITH shop AS (
  SELECT id FROM shops WHERE login_id = 'hitozuma' LIMIT 1
)
INSERT INTO price_plans (shop_id, duration, price)
SELECT 
  shop.id,
  duration,
  price
FROM shop, (VALUES
  (60, 12000),
  (90, 17000),
  (120, 22000)
) AS plans(duration, price);

-- ========================================
-- 確認クエリ
-- ========================================

-- 店舗確認
SELECT id, name, login_id, phone, business_hours 
FROM shops 
WHERE login_id = 'hitozuma';

-- 料金プラン確認
SELECT pp.id, pp.duration, pp.price, s.name as shop_name 
FROM price_plans pp 
JOIN shops s ON pp.shop_id = s.id 
WHERE s.login_id = 'hitozuma';

-- 全店舗数確認
SELECT COUNT(*) as total_shops FROM shops;

-- ========================================
-- ログイン情報
-- ========================================
-- ID: hitozuma
-- パスワード: shop123
-- 店舗管理画面: https://3011-il4xaruhtlkhd0yoxpuv3-c81df28e.sandbox.novita.ai/login
