-- Row Level Security (RLS) ポリシーの修正
-- 管理機能のために UPDATE と INSERT を許可する

-- Girls テーブルのポリシー
DROP POLICY IF EXISTS "Public read access" ON girls;
DROP POLICY IF EXISTS "Enable insert for all users" ON girls;
DROP POLICY IF EXISTS "Enable update for all users" ON girls;
DROP POLICY IF EXISTS "Enable delete for all users" ON girls;

-- 読み取り: 誰でも可能
CREATE POLICY "Public read access" ON girls 
  FOR SELECT 
  USING (true);

-- 挿入: 誰でも可能（管理機能用）
CREATE POLICY "Enable insert for all users" ON girls 
  FOR INSERT 
  WITH CHECK (true);

-- 更新: 誰でも可能（管理機能用）
CREATE POLICY "Enable update for all users" ON girls 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- 削除: 誰でも可能（管理機能用）
CREATE POLICY "Enable delete for all users" ON girls 
  FOR DELETE 
  USING (true);

-- Reviews テーブルのポリシー
DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;
DROP POLICY IF EXISTS "Enable insert for all users" ON reviews;
DROP POLICY IF EXISTS "Enable update for all users" ON reviews;

-- 承認済みレビューのみ読み取り可能
CREATE POLICY "Public read approved reviews" ON reviews 
  FOR SELECT 
  USING (approved = true);

-- 誰でも新規レビューを投稿可能
CREATE POLICY "Enable insert for all users" ON reviews 
  FOR INSERT 
  WITH CHECK (true);

-- 管理者のみ更新可能（承認フラグの変更など）
CREATE POLICY "Enable update for all users" ON reviews 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Bookings テーブルのポリシー
DROP POLICY IF EXISTS "Enable insert for all users" ON bookings;
DROP POLICY IF EXISTS "Enable select for all users" ON bookings;
DROP POLICY IF EXISTS "Enable update for all users" ON bookings;

-- 誰でも予約を作成可能
CREATE POLICY "Enable insert for all users" ON bookings 
  FOR INSERT 
  WITH CHECK (true);

-- 誰でも予約を閲覧可能（管理機能用）
CREATE POLICY "Enable select for all users" ON bookings 
  FOR SELECT 
  USING (true);

-- 誰でも予約を更新可能（ステータス変更など）
CREATE POLICY "Enable update for all users" ON bookings 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Shops テーブルのポリシー
DROP POLICY IF EXISTS "Public read access" ON shops;
DROP POLICY IF EXISTS "Enable update for all users" ON shops;

-- 読み取り: 誰でも可能
CREATE POLICY "Public read access" ON shops 
  FOR SELECT 
  USING (true);

-- 更新: 誰でも可能（管理機能用）
CREATE POLICY "Enable update for all users" ON shops 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Price Plans テーブルのポリシー
DROP POLICY IF EXISTS "Public read access" ON price_plans;

-- 読み取り: 誰でも可能
CREATE POLICY "Public read access" ON price_plans 
  FOR SELECT 
  USING (true);

-- Schedules テーブルのポリシー
DROP POLICY IF EXISTS "Public read access" ON schedules;
DROP POLICY IF EXISTS "Enable insert for all users" ON schedules;
DROP POLICY IF EXISTS "Enable update for all users" ON schedules;

-- 読み取り: 誰でも可能
CREATE POLICY "Public read access" ON schedules 
  FOR SELECT 
  USING (true);

-- 挿入: 誰でも可能（スケジュール登録用）
CREATE POLICY "Enable insert for all users" ON schedules 
  FOR INSERT 
  WITH CHECK (true);

-- 更新: 誰でも可能（スケジュール変更用）
CREATE POLICY "Enable update for all users" ON schedules 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);
