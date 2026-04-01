# 🚀 Supabase統合完了ガイド

## ✅ 完了した作業

### 1. Supabaseクライアントライブラリのセットアップ
- `lib/supabase.ts` - Supabaseクライアントと型定義
- `.env.local` - Supabase接続情報の設定（完了済み）

### 2. APIレイヤーの作成
以下のAPIモジュールを作成しました：

- **`lib/api/shops.ts`** - 店舗データの取得・作成・更新・削除
- **`lib/api/girls.ts`** - 女の子データの取得・作成・更新・削除・検索
- **`lib/api/reviews.ts`** - レビューの取得・作成・承認・削除
- **`lib/api/bookings.ts`** - 予約の取得・作成・更新・削除
- **`lib/api/price-plans.ts`** - 料金プランの取得・作成・更新・削除
- **`lib/storage.ts`** - 画像アップロード・削除・リサイズ機能

### 3. APIルートの更新
- **`app/api/bookings/route.ts`** - Supabase統合（予約をDBに保存）
- **`app/api/reviews/route.ts`** - Supabase統合（レビューをDBに保存）

---

## 📋 次のステップ：追加のSQL実行

`supabase-schema.sql` に **ビューカウント増加関数** を追加しました。

### 実行手順

1. **Supabaseダッシュボード**にアクセス
   👉 https://supabase.com/dashboard

2. **nakashibetsu-deliプロジェクト**を選択

3. 左サイドバーから **「SQL Editor」** をクリック

4. **「New query」** をクリック

5. 以下のSQLをコピー&ペーストして実行：

```sql
-- PostgreSQL関数: ビューカウントを増やす
CREATE OR REPLACE FUNCTION increment_view_count(girl_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE girls
  SET view_count = view_count + 1
  WHERE id = girl_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

6. **「Run」** ボタンをクリック

7. ✅ **"Success"** と表示されればOK！

---

## 🎯 利用可能な機能

### データベース操作

#### 店舗（Shops）
```typescript
import { getAllShops, getShopById, createShop, updateShop, deleteShop } from '@/lib/api';

// 全店舗を取得
const shops = await getAllShops();

// IDで店舗を取得
const shop = await getShopById('shop-id');

// 店舗を作成
const newShop = await createShop({
  name: '新しい店舗',
  description: '説明',
  phone: '0153-XX-XXXX',
  address: '北海道標津郡中標津町',
  business_hours: '10:00〜翌5:00',
  image_url: null,
});

// 店舗を更新
const updated = await updateShop('shop-id', { name: '更新後の名前' });

// 店舗を削除
const success = await deleteShop('shop-id');
```

#### 女の子（Girls）
```typescript
import { getAllGirls, getGirlById, getNewGirls, getTopRankedGirls, searchGirls, createGirl, updateGirl, deleteGirl } from '@/lib/api';

// 全女の子を取得
const girls = await getAllGirls();

// IDで女の子を取得（ビューカウントが自動的に増加）
const girl = await getGirlById('girl-id');

// 新人を取得
const newGirls = await getNewGirls(4);

// 人気ランキングを取得
const topRanked = await getTopRankedGirls(10);

// 検索・フィルター
const filtered = await searchGirls({
  shopId: 'shop-id',
  minAge: 20,
  maxAge: 30,
  minHeight: 155,
  maxHeight: 170,
  isNew: true,
  searchQuery: 'あやか',
});

// 女の子を作成
const newGirl = await createGirl({
  shop_id: 'shop-id',
  name: 'さくら',
  age: 22,
  height: 160,
  bust: 85,
  waist: 58,
  hip: 86,
  blood_type: 'A',
  description: '明るく元気な性格です',
  charm_points: ['笑顔が素敵', '優しい'],
  available_options: ['即尺', 'AF'],
  thumbnail_url: null,
  image_urls: null,
  ranking: 999,
  view_count: 0,
  is_new: true,
});

// 女の子を更新
const updated = await updateGirl('girl-id', { age: 23 });

// 女の子を削除
const success = await deleteGirl('girl-id');
```

#### レビュー（Reviews）
```typescript
import { getAllReviews, getReviewsByGirlId, createReview, approveReview, deleteReview, getAverageRating } from '@/lib/api';

// 全レビューを取得（承認済みのみ）
const reviews = await getAllReviews();

// 女の子のレビューを取得
const girlReviews = await getReviewsByGirlId('girl-id');

// レビューを作成
const newReview = await createReview({
  girl_id: 'girl-id',
  shop_id: 'shop-id',
  user_name: 'T.K',
  rating: 5,
  comment: 'とても良かったです！',
});

// レビューを承認（管理者）
const approved = await approveReview('review-id');

// レビューを削除
const success = await deleteReview('review-id');

// 平均評価を取得
const avgRating = await getAverageRating('girl-id');
```

#### 予約（Bookings）
```typescript
import { getAllBookings, createBooking, updateBookingStatus } from '@/lib/api';

// 全予約を取得
const bookings = await getAllBookings();

// 予約を作成
const newBooking = await createBooking({
  girl_id: 'girl-id',
  shop_id: 'shop-id',
  customer_name: '山田太郎',
  customer_phone: '090-1234-5678',
  customer_email: 'customer@example.com',
  booking_date: '2026-01-20',
  time_slot: '18:00',
  duration: 90,
  total_price: 21000,
  notes: 'よろしくお願いします',
});

// 予約ステータスを更新
const success = await updateBookingStatus('booking-id', 'confirmed');
```

#### 料金プラン（Price Plans）
```typescript
import { getPricePlansByShopId, createPricePlan } from '@/lib/api';

// 店舗の料金プランを取得
const plans = await getPricePlansByShopId('shop-id');

// 料金プランを作成
const newPlan = await createPricePlan({
  shop_id: 'shop-id',
  duration: 60,
  price: 15000,
});
```

### 画像アップロード

```typescript
import { uploadImage, uploadMultipleImages, deleteImage, resizeImage } from '@/lib/storage';

// 単一画像をアップロード
const imageUrl = await uploadImage(file, 'girl-images', 'profiles/girl-123.jpg');

// 複数画像をアップロード
const imageUrls = await uploadMultipleImages(files, 'girl-images', 'girl-123/');

// 画像を削除
const success = await deleteImage('girl-images', 'profiles/girl-123.jpg');

// 画像をリサイズ（アップロード前）
const resizedFile = await resizeImage(file, 1200, 1600);
```

---

## 🔄 古いモックデータからの移行

現在、`lib/data.ts` の古いモックデータを使用しているページがあります。
これらを新しいSupabase APIに移行する必要があります。

### 移行が必要なページ

1. **トップページ (`app/page.tsx`)**
   - `getAllShops()` → `import { getAllShops } from '@/lib/api'`
   - `getNewGirls()` → `import { getNewGirls } from '@/lib/api'`
   - `getTopRankedGirls()` → `import { getTopRankedGirls } from '@/lib/api'`

2. **女の子一覧 (`app/girls/page.tsx`)**
   - `getAllGirls()` → `import { getAllGirls, searchGirls } from '@/lib/api'`
   - `getAllShops()` → `import { getAllShops } from '@/lib/api'`

3. **女の子詳細 (`app/girls/[id]/page.tsx`)**
   - `getGirlById()` → `import { getGirlById } from '@/lib/api'`
   - `getShopById()` → `import { getShopById } from '@/lib/api'`
   - `getReviewsByGirl()` → `import { getReviewsByGirlId } from '@/lib/api'`

4. **予約ページ (`app/booking/page.tsx`)**
   - `getGirlById()` → `import { getGirlById } from '@/lib/api'`
   - `getShopById()` → `import { getShopById } from '@/lib/api'`
   - `getPricesByShop()` → `import { getPricePlansByShopId } from '@/lib/api'`

5. **レビュー一覧 (`app/reviews/page.tsx`)**
   - `getAllReviews()` → `import { getAllReviews } from '@/lib/api'`
   - `getAllShops()` → `import { getAllShops } from '@/lib/api'`
   - `getAllGirls()` → `import { getAllGirls } from '@/lib/api'`

6. **管理画面 (`app/admin/page.tsx`)**
   - `getAllGirls()` → `import { getAllGirls } from '@/lib/api'`
   - `getAllShops()` → `import { getAllShops } from '@/lib/api'`

7. **管理画面（編集） (`app/admin/girls/[id]/page.tsx`)**
   - `getGirlById()` → `import { getGirlById, updateGirl } from '@/lib/api'`
   - `getAllShops()` → `import { getAllShops } from '@/lib/api'`

8. **管理画面（新規） (`app/admin/girls/new/page.tsx`)**
   - `getAllShops()` → `import { getAllShops } from '@/lib/api'`
   - `createGirl()` を使用

---

## 📝 移行手順の例

### Before（モックデータ）
```typescript
import { getAllGirls, getAllShops } from '@/lib/data';

export default function GirlsPage() {
  const girls = getAllGirls();
  const shops = getAllShops();
  // ...
}
```

### After（Supabase）
```typescript
import { getAllGirls, getAllShops } from '@/lib/api';

export default async function GirlsPage() {
  const girls = await getAllGirls();
  const shops = await getAllShops();
  // ...
}
```

**注意点：**
- 関数の前に `async` を追加
- 関数呼び出しの前に `await` を追加
- Server Component として動作（`'use client'` を削除）

---

## 🎉 統合完了後の機能

- ✅ **リアルタイムデータベース**: Supabaseに保存された実データを使用
- ✅ **予約管理**: 予約がデータベースに保存される
- ✅ **レビュー管理**: レビューがデータベースに保存される（承認待ち）
- ✅ **画像アップロード**: Supabaseストレージに画像をアップロード
- ✅ **ビューカウント**: 女の子の詳細ページを開くたびにカウントが増加
- ✅ **検索・フィルター**: 高度な検索機能が動作
- ✅ **メール通知**: Resendによるメール送信

---

## ❓ 質問や問題がある場合

何か問題が発生した場合は、以下を確認してください：

1. **Supabase接続エラー**
   - `.env.local` の `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しいか確認

2. **データが表示されない**
   - Supabaseに初期データ（shops, girls）が入っているか確認
   - ブラウザの開発者ツールでエラーログを確認

3. **画像アップロードエラー**
   - Supabaseでストレージバケット（girl-images, shop-images）が作成されているか確認
   - バケットが **Public** に設定されているか確認

すぐにサポートします！💪
