-- りある人妻の品格中標津の料金プランを追加（修正版）

-- 料金プランを追加（descriptionカラムなし）
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

-- 確認
SELECT pp.*, s.name as shop_name 
FROM price_plans pp 
JOIN shops s ON pp.shop_id = s.id 
WHERE s.login_id = 'hitozuma';
