import { supabase } from './supabase';

/**
 * 画像をSupabaseストレージにアップロード
 * @param file アップロードするファイル
 * @param bucket バケット名 ('girl-images' または 'shop-images')
 * @param path ストレージ内のパス（例: 'profiles/girl-id.jpg'）
 * @returns アップロードされた画像のURL
 */
export async function uploadImage(
  file: File,
  bucket: 'girl-images' | 'shop-images',
  path: string
): Promise<string | null> {
  try {
    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      console.error('File size exceeds 5MB');
      return null;
    }

    // ファイル形式チェック
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type');
      return null;
    }

    // アップロード
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true, // 同じファイル名があれば上書き
      });

    if (error) {
      console.error('Error uploading image:', error);
      // バケットが存在しない場合の詳細なエラーメッセージ
      if (error.message && error.message.includes('Bucket not found')) {
        throw new Error('ストレージバケットが見つかりません。Supabaseで「girl-images」と「shop-images」バケットを作成してください。');
      }
      throw new Error(`画像のアップロードに失敗しました: ${error.message}`);
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

/**
 * 画像を削除
 * @param bucket バケット名
 * @param path ストレージ内のパス
 * @returns 成功したかどうか
 */
export async function deleteImage(
  bucket: 'girl-images' | 'shop-images',
  path: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * 複数の画像をアップロード
 * @param files アップロードするファイルの配列
 * @param bucket バケット名
 * @param basePath ベースパス（例: 'girl-id/'）
 * @returns アップロードされた画像のURLの配列
 */
export async function uploadMultipleImages(
  files: File[],
  bucket: 'girl-images' | 'shop-images',
  basePath: string
): Promise<string[]> {
  const uploadPromises = files.map((file, index) => {
    const extension = file.name.split('.').pop();
    const path = `${basePath}image-${index + 1}.${extension}`;
    return uploadImage(file, bucket, path);
  });

  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
}

/**
 * URLからストレージパスを抽出
 * @param url SupabaseストレージのURL
 * @returns ストレージパス
 */
export function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // /storage/v1/object/public/bucket-name/path の形式
    const bucketIndex = pathParts.indexOf('public') + 1;
    if (bucketIndex > 0 && pathParts.length > bucketIndex + 1) {
      return pathParts.slice(bucketIndex + 1).join('/');
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 画像をリサイズ（クライアント側）
 * @param file 元のファイル
 * @param maxWidth 最大幅
 * @param maxHeight 最大高さ
 * @returns リサイズされたファイル
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1600
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // アスペクト比を維持してリサイズ
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Failed to resize image'));
          }
        }, file.type);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
