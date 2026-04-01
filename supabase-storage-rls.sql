-- ストレージバケット用のRLSポリシーを設定
-- これを実行すると、ANON キーでバケットにアクセスできるようになります

-- girl-images バケットのポリシー
CREATE POLICY IF NOT EXISTS "Public Access to girl-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'girl-images');

CREATE POLICY IF NOT EXISTS "Anyone can upload to girl-images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'girl-images');

CREATE POLICY IF NOT EXISTS "Anyone can update girl-images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'girl-images')
WITH CHECK (bucket_id = 'girl-images');

CREATE POLICY IF NOT EXISTS "Anyone can delete from girl-images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'girl-images');

-- shop-images バケットのポリシー
CREATE POLICY IF NOT EXISTS "Public Access to shop-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'shop-images');

CREATE POLICY IF NOT EXISTS "Anyone can upload to shop-images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'shop-images');

CREATE POLICY IF NOT EXISTS "Anyone can update shop-images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'shop-images')
WITH CHECK (bucket_id = 'shop-images');

CREATE POLICY IF NOT EXISTS "Anyone can delete from shop-images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'shop-images');
