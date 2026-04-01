-- ソク姫対応キャストのサンプルデータ自動生成
-- 実行手順: Supabase SQL Editorで実行してください

-- Step 1: 既存のキャストを確認
-- SELECT id, name, shop_id FROM girls LIMIT 10;

-- Step 2: 今日の日付で全キャストの最初の3名をソク姫対応として設定
WITH sample_girls AS (
  SELECT 
    g.id as girl_id,
    g.shop_id,
    ROW_NUMBER() OVER (ORDER BY g.created_at DESC) as rn
  FROM girls g
  WHERE g.shop_id IS NOT NULL
  LIMIT 3
)
INSERT INTO girl_schedules (girl_id, shop_id, date, status, instant_available, start_time, end_time, notes, updated_by)
SELECT 
  girl_id,
  shop_id,
  CURRENT_DATE,
  'working',
  true,
  '18:00'::time,
  '24:00'::time,
  CASE 
    WHEN rn = 1 THEN '今すぐご案内可能です！お電話お待ちしております♪'
    WHEN rn = 2 THEN '本日出勤中！すぐにご案内できます😊'
    ELSE 'ソク姫対応OK！お気軽にお電話ください✨'
  END as notes,
  'system'
FROM sample_girls
ON CONFLICT (girl_id, date) DO UPDATE
SET 
  status = EXCLUDED.status,
  instant_available = EXCLUDED.instant_available,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  notes = EXCLUDED.notes,
  updated_at = NOW();

-- 結果確認
SELECT 
  gs.id,
  g.name as girl_name,
  s.name as shop_name,
  gs.date,
  gs.status,
  gs.instant_available,
  gs.start_time,
  gs.end_time,
  gs.notes
FROM girl_schedules gs
JOIN girls g ON gs.girl_id = g.id
JOIN shops s ON gs.shop_id = s.id
WHERE gs.date = CURRENT_DATE
  AND gs.instant_available = true;
