-- ストレージバケット用のRLSポリシーを設定
-- まず既存のポリシーを削除してから作成します

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Public Access to girl-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to girl-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update girl-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from girl-images" ON storage.objects;

DROP POLICY IF EXISTS "Public Access to shop-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to shop-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update shop-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from shop-images" ON storage.objects;

-- girl-images バケットのポリシーを作成
CREATE POLICY "Public Access to girl-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'girl-images');

CREATE POLICY "Anyone can upload to girl-images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'girl-images');

CREATE POLICY "Anyone can update girl-images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'girl-images')
WITH CHECK (bucket_id = 'girl-images');

CREATE POLICY "Anyone can delete from girl-images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'girl-images');

-- shop-images バケットのポリシーを作成
CREATE POLICY "Public Access to shop-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'shop-images');

CREATE POLICY "Anyone can upload to shop-images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'shop-images');

CREATE POLICY "Anyone can update shop-images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'shop-images')
WITH CHECK (bucket_id = 'shop-images');

CREATE POLICY "Anyone can delete from shop-images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'shop-images');
