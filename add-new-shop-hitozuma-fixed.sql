-- 新店舗「りある人妻の品格中標津〔幼妻、若妻、熟妻〕」を追加（修正版）

-- 1. 店舗を追加
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

-- 2. 追加された店舗のIDを確認
SELECT id, name, login_id FROM shops WHERE login_id = 'hitozuma';

-- ログイン情報
-- ID: hitozuma
-- パスワード: shop123
