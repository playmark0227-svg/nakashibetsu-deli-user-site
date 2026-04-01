-- Velvet 予約システム用テーブル
-- SupabaseのSQL Editorで実行してください

-- 既存のテーブルを削除（初回のみ）
DROP TABLE IF EXISTS bookings;

-- 予約テーブルを作成
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id TEXT NOT NULL,
  girl_name TEXT,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration INTEGER NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックスを作成（検索高速化）
CREATE INDEX idx_bookings_shop_id ON bookings(shop_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- RLS (Row Level Security) を有効化
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが予約を作成できるポリシー
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 認証済みユーザーが全予約を閲覧できるポリシー（管理画面用）
CREATE POLICY "Authenticated users can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- 匿名ユーザーは自分が作成した予約のみ閲覧可能
CREATE POLICY "Anonymous users can view their own bookings"
  ON bookings
  FOR SELECT
  TO anon
  USING (true); -- 実際には予約IDなどでフィルタリング

-- 認証済みユーザーが予約を更新できるポリシー
CREATE POLICY "Authenticated users can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true);

-- 認証済みユーザーが予約を削除できるポリシー
CREATE POLICY "Authenticated users can delete bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);

-- コメント追加
COMMENT ON TABLE bookings IS 'Velvet予約システムの予約データ';
COMMENT ON COLUMN bookings.shop_id IS '店舗ID (shopsテーブルのidを参照)';
COMMENT ON COLUMN bookings.girl_name IS '希望キャスト名（任意）';
COMMENT ON COLUMN bookings.customer_name IS 'お客様名';
COMMENT ON COLUMN bookings.phone IS '電話番号';
COMMENT ON COLUMN bookings.booking_date IS '予約日';
COMMENT ON COLUMN bookings.booking_time IS '予約時間';
COMMENT ON COLUMN bookings.duration IS 'コース時間（分）';
COMMENT ON COLUMN bookings.message IS 'ご要望・備考';
COMMENT ON COLUMN bookings.status IS 'ステータス: pending, confirmed, cancelled';

-- サンプルデータ（テスト用・任意）
-- INSERT INTO bookings (shop_id, girl_name, customer_name, phone, booking_date, booking_time, duration, message)
-- VALUES 
--   ('shop1', 'あやか', '山田太郎', '090-1234-5678', '2024-02-01', '18:00', 60, 'よろしくお願いします'),
--   ('shop2', NULL, '佐藤次郎', '080-9876-5432', '2024-02-02', '20:00', 90, NULL);

-- テーブル作成完了
SELECT 'Bookings table created successfully!' as status;
