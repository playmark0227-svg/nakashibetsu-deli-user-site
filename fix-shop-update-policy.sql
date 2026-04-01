-- 店舗更新ポリシーの修正
-- 新しく追加された店舗（hitozuma）が更新できない問題を解決

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Public read access" ON shops;
DROP POLICY IF EXISTS "Enable update for all users" ON shops;
DROP POLICY IF EXISTS "Enable insert for all users" ON shops;

-- 読み取り: 誰でも可能
CREATE POLICY "Public read access" ON shops 
  FOR SELECT 
  USING (true);

-- 挿入: 誰でも可能
CREATE POLICY "Enable insert for all users" ON shops 
  FOR INSERT 
  WITH CHECK (true);

-- 更新: 誰でも可能（店舗管理画面用）
CREATE POLICY "Enable update for all users" ON shops 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- 削除: 誰でも可能（マスター管理用）
CREATE POLICY "Enable delete for all users" ON shops 
  FOR DELETE 
  USING (true);

-- 確認: ポリシー一覧を表示
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'shops';
