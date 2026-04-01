-- りある人妻の品格中標津の料金プランを追加

-- まず店舗IDを取得（手動で置き換える必要があります）
-- SELECT id FROM shops WHERE login_id = 'hitozuma';

-- 以下のSQLで [SHOP_ID_HERE] を実際の店舗IDに置き換えてください

INSERT INTO price_plans (shop_id, duration, price, description) VALUES
('[SHOP_ID_HERE]', 60, 12000, '60分コース'),
('[SHOP_ID_HERE]', 90, 17000, '90分コース'),
('[SHOP_ID_HERE]', 120, 22000, '120分コース');

-- または、店舗IDを自動取得する方法（PostgreSQL）:
WITH shop AS (
  SELECT id FROM shops WHERE login_id = 'hitozuma' LIMIT 1
)
INSERT INTO price_plans (shop_id, duration, price, description)
SELECT 
  shop.id,
  duration,
  price,
  description
FROM shop, (VALUES
  (60, 12000, '60分コース'),
  (90, 17000, '90分コース'),
  (120, 22000, '120分コース')
) AS plans(duration, price, description);

-- 確認
SELECT pp.*, s.name as shop_name 
FROM price_plans pp 
JOIN shops s ON pp.shop_id = s.id 
WHERE s.login_id = 'hitozuma';
