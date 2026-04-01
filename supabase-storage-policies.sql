-- Supabase Storage用のRLSポリシー設定
-- 画像のアップロード・読み取りを許可する

-- girl-images バケットのポリシー
-- 誰でも画像を読み取り可能
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'girl-images');

-- 誰でも画像をアップロード可能
DROP POLICY IF EXISTS "Anyone can upload girl images" ON storage.objects;
CREATE POLICY "Anyone can upload girl images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'girl-images');

-- 誰でも画像を更新可能（上書き）
DROP POLICY IF EXISTS "Anyone can update girl images" ON storage.objects;
CREATE POLICY "Anyone can update girl images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'girl-images')
WITH CHECK (bucket_id = 'girl-images');

-- 誰でも画像を削除可能
DROP POLICY IF EXISTS "Anyone can delete girl images" ON storage.objects;
CREATE POLICY "Anyone can delete girl images"
ON storage.objects FOR DELETE
USING (bucket_id = 'girl-images');

-- shop-images バケットのポリシー
-- 誰でも画像を読み取り可能
DROP POLICY IF EXISTS "Public Access to shop images" ON storage.objects;
CREATE POLICY "Public Access to shop images"
ON storage.objects FOR SELECT
USING (bucket_id = 'shop-images');

-- 誰でも画像をアップロード可能
DROP POLICY IF EXISTS "Anyone can upload shop images" ON storage.objects;
CREATE POLICY "Anyone can upload shop images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'shop-images');

-- 誰でも画像を更新可能（上書き）
DROP POLICY IF EXISTS "Anyone can update shop images" ON storage.objects;
CREATE POLICY "Anyone can update shop images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'shop-images')
WITH CHECK (bucket_id = 'shop-images');

-- 誰でも画像を削除可能
DROP POLICY IF EXISTS "Anyone can delete shop images" ON storage.objects;
CREATE POLICY "Anyone can delete shop images"
ON storage.objects FOR DELETE
USING (bucket_id = 'shop-images');
