-- Bookingsテーブルにoptionsカラムを追加
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS options TEXT;

COMMENT ON COLUMN bookings.options IS 'オプション（例：ローション、コスプレなど）';

-- 確認
SELECT 'Options column added successfully!' as status;
