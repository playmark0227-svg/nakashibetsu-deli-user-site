-- ソク姫対応キャストのサンプルデータ挿入
-- 既存のキャストIDを使用して、今日の出勤状況を設定

-- まず、既存のキャストIDを確認
-- SELECT id, name, shop_id FROM girls LIMIT 10;

-- サンプルデータ挿入（既存のキャストIDに置き換えてください）
-- 例: girl_id は実際のキャストのUUIDに置き換える必要があります

-- 使用例:
-- INSERT INTO girl_schedules (girl_id, shop_id, date, status, instant_available, start_time, end_time, notes, updated_by)
-- VALUES 
--   ('実際のキャストUUID', '実際の店舗UUID', CURRENT_DATE, 'working', true, '18:00', '24:00', '今すぐご案内可能です！', 'admin'),
--   ('実際のキャストUUID', '実際の店舗UUID', CURRENT_DATE, 'working', true, '19:00', '02:00', '電話予約大歓迎♪', 'admin');

-- 実際のデータを取得するためのクエリ
SELECT 
  g.id as girl_id,
  g.name as girl_name,
  g.shop_id,
  s.name as shop_name
FROM girls g
LEFT JOIN shops s ON g.shop_id = s.id
LIMIT 10;

-- 上記の結果を使って、以下のようなINSERT文を作成してください：
-- 
-- INSERT INTO girl_schedules (girl_id, shop_id, date, status, instant_available, start_time, end_time, notes, updated_by)
-- VALUES 
--   ('[girl_id]', '[shop_id]', CURRENT_DATE, 'working', true, '18:00', '24:00', '今すぐご案内可能です！', 'admin');

