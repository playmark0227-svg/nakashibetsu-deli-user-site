import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // バケットの一覧を取得
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to list buckets',
        details: bucketsError,
      }, { status: 500 });
    }

    // girl-images バケットの情報を取得
    const girlImagesBucket = buckets?.find(b => b.id === 'girl-images');
    const shopImagesBucket = buckets?.find(b => b.id === 'shop-images');

    // 各バケットのファイル一覧を取得
    let girlImagesFiles = [];
    let shopImagesFiles = [];

    if (girlImagesBucket) {
      const { data: files, error } = await supabase.storage
        .from('girl-images')
        .list('', { limit: 10 });
      
      if (!error) {
        girlImagesFiles = files || [];
      }
    }

    if (shopImagesBucket) {
      const { data: files, error } = await supabase.storage
        .from('shop-images')
        .list('', { limit: 10 });
      
      if (!error) {
        shopImagesFiles = files || [];
      }
    }

    return NextResponse.json({
      success: true,
      buckets: {
        all: buckets,
        'girl-images': {
          exists: !!girlImagesBucket,
          info: girlImagesBucket,
          files: girlImagesFiles,
        },
        'shop-images': {
          exists: !!shopImagesBucket,
          info: shopImagesBucket,
          files: shopImagesFiles,
        },
      },
    });
  } catch (error) {
    console.error('Storage test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error,
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // テスト用の小さな画像を作成（1x1ピクセルのPNG）
    const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    // Base64をBlobに変換
    const base64Data = testImageData.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    
    const testFileName = `test-${Date.now()}.png`;
    
    // アップロードテスト
    const { data, error } = await supabase.storage
      .from('girl-images')
      .upload(`test/${testFileName}`, blob, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Upload failed',
        details: error,
        message: error.message,
      }, { status: 500 });
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from('girl-images')
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      message: 'Upload successful',
      data: {
        path: data.path,
        publicUrl: urlData.publicUrl,
      },
    });
  } catch (error) {
    console.error('Upload test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
