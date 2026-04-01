-- このSQLをSupabaseのSQL Editorで実行してください
-- https://supabase.com/dashboard → あなたのプロジェクト → SQL Editor → New query

-- 1. Shops（店舗）テーブル
CREATE TABLE IF NOT EXISTS shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  address TEXT,
  business_hours TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Girls（女の子）テーブル
CREATE TABLE IF NOT EXISTS girls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  height INTEGER,
  bust INTEGER,
  waist INTEGER,
  hip INTEGER,
  blood_type TEXT,
  description TEXT,
  charm_points TEXT[],
  available_options TEXT[],
  thumbnail_url TEXT,
  image_urls TEXT[],
  ranking INTEGER DEFAULT 999,
  view_count INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Reviews（レビュー）テーブル
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  girl_id UUID REFERENCES girls(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Bookings（予約）テーブル
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  girl_id UUID REFERENCES girls(id) ON DELETE SET NULL,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  duration INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Price Plans（料金プラン）テーブル
CREATE TABLE IF NOT EXISTS price_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Schedules（出勤スケジュール）テーブル
CREATE TABLE IF NOT EXISTS schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  girl_id UUID REFERENCES girls(id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,
  available BOOLEAN DEFAULT true,
  time_slots TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(girl_id, schedule_date)
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_girls_shop_id ON girls(shop_id);
CREATE INDEX IF NOT EXISTS idx_girls_is_new ON girls(is_new);
CREATE INDEX IF NOT EXISTS idx_reviews_girl_id ON reviews(girl_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);
CREATE INDEX IF NOT EXISTS idx_bookings_shop_id ON bookings(shop_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_schedules_girl_date ON schedules(girl_id, schedule_date);

-- Row Level Security (RLS) を有効化
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE girls ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- RLSポリシー設定

-- Shops: 読み取りと更新を許可
DROP POLICY IF EXISTS "Public read access" ON shops;
CREATE POLICY "Public read access" ON shops FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable update for all users" ON shops;
CREATE POLICY "Enable update for all users" ON shops FOR UPDATE USING (true) WITH CHECK (true);

-- Girls: 全操作を許可（管理機能用）
DROP POLICY IF EXISTS "Public read access" ON girls;
CREATE POLICY "Public read access" ON girls FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for all users" ON girls;
CREATE POLICY "Enable insert for all users" ON girls FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all users" ON girls;
CREATE POLICY "Enable update for all users" ON girls FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Enable delete for all users" ON girls;
CREATE POLICY "Enable delete for all users" ON girls FOR DELETE USING (true);

-- Price Plans: 読み取りのみ
DROP POLICY IF EXISTS "Public read access" ON price_plans;
CREATE POLICY "Public read access" ON price_plans FOR SELECT USING (true);

-- Schedules: 読み取り、挿入、更新を許可
DROP POLICY IF EXISTS "Public read access" ON schedules;
CREATE POLICY "Public read access" ON schedules FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for all users" ON schedules;
CREATE POLICY "Enable insert for all users" ON schedules FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all users" ON schedules;
CREATE POLICY "Enable update for all users" ON schedules FOR UPDATE USING (true) WITH CHECK (true);

-- Reviews: 承認済みのみ読み取り、誰でも投稿・更新可能
DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (approved = true);
DROP POLICY IF EXISTS "Anyone can create reviews" ON reviews;
CREATE POLICY "Anyone can create reviews" ON reviews FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for all users" ON reviews;
CREATE POLICY "Enable update for all users" ON reviews FOR UPDATE USING (true) WITH CHECK (true);

-- Bookings: 全操作を許可（予約管理用）
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Enable select for all users" ON bookings;
CREATE POLICY "Enable select for all users" ON bookings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable update for all users" ON bookings;
CREATE POLICY "Enable update for all users" ON bookings FOR UPDATE USING (true) WITH CHECK (true);

-- 初期データ投入
INSERT INTO shops (id, name, description, phone, address, business_hours) VALUES
('11111111-1111-1111-1111-111111111111', 'プレミアム中標津', '中標津エリア最高級のサービスをお約束します。厳選された女性キャストが貴方の特別な時間を演出いたします。', '0153-XX-XXXX', '北海道標津郡中標津町', '10:00〜翌5:00'),
('22222222-2222-2222-2222-222222222222', 'ロイヤル中標津', '高品質なサービスとリーズナブルな料金設定が自慢です。初めての方でも安心してご利用いただけます。', '0153-XX-XXXX', '北海道標津郡中標津町', '11:00〜翌4:00'),
('33333333-3333-3333-3333-333333333333', 'エレガンス中標津', '大人の女性が在籍する上質な空間。洗練されたサービスで至福のひとときをお過ごしください。', '0153-XX-XXXX', '北海道標津郡中標津町', '12:00〜翌3:00')
ON CONFLICT (id) DO NOTHING;

-- 料金プラン
INSERT INTO price_plans (shop_id, duration, price) VALUES
('11111111-1111-1111-1111-111111111111', 60, 15000),
('11111111-1111-1111-1111-111111111111', 90, 21000),
('11111111-1111-1111-1111-111111111111', 120, 27000),
('22222222-2222-2222-2222-222222222222', 60, 13000),
('22222222-2222-2222-2222-222222222222', 90, 18000),
('22222222-2222-2222-2222-222222222222', 120, 23000),
('33333333-3333-3333-3333-333333333333', 60, 14000),
('33333333-3333-3333-3333-333333333333', 90, 19500),
('33333333-3333-3333-3333-333333333333', 120, 25000)
ON CONFLICT DO NOTHING;

-- サンプル女の子データ
INSERT INTO girls (id, shop_id, name, age, height, bust, waist, hip, blood_type, description, charm_points, available_options, ranking, view_count, is_new) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'あやか', 23, 158, 86, 58, 85, 'A', '明るく元気な性格で、初めての方でもリラックスしてお過ごしいただけます。笑顔が素敵な癒し系です♪', ARRAY['笑顔が素敵', '優しい性格', '会話上手', 'スタイル抜群'], ARRAY['即尺', 'AF', 'ごっくん', 'ローター'], 1, 1250, false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'みく', 21, 162, 88, 57, 86, 'B', '甘えん坊でドキドキするようなプレイが得意です♡お兄さんと楽しい時間を過ごしたいです！', ARRAY['美肌', '敏感体質', '積極的', '甘えん坊'], ARRAY['即尺', '69', 'ローター', 'バイブ'], 2, 980, true)
ON CONFLICT (id) DO NOTHING;

-- PostgreSQL関数: ビューカウントを増やす
CREATE OR REPLACE FUNCTION increment_view_count(girl_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE girls
  SET view_count = view_count + 1
  WHERE id = girl_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
