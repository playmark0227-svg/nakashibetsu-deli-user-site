# 🗄️ Supabase データベース & ストレージ セットアップガイド

このガイドでは、データベースと画像ストレージを実装するためのSupabaseの設定方法を説明します。

## 📋 Supabaseで実装する機能

1. **データベース**
   - 女の子の情報
   - 予約データ
   - レビューデータ
   - 店舗情報

2. **ストレージ**
   - プロフィール画像
   - ギャラリー画像

3. **認証**（オプション）
   - 管理者ログイン
   - 店舗管理者ログイン

---

## 🚀 ステップ1: Supabaseアカウント作成

1. **Supabaseにアクセス**
   - https://supabase.com にアクセス
   - 「Start your project」をクリック
   - GitHubアカウントでサインアップ（推奨）

2. **新しいプロジェクトを作成**
   - 「New Project」をクリック
   - プロジェクト名: `nakashibetsu-deli`
   - データベースパスワード: 強力なパスワードを設定（必ず保存！）
   - リージョン: `Northeast Asia (Tokyo)` を選択（推奨）
   - 「Create new project」をクリック
   - プロジェクトの準備完了まで2-3分待機

---

## 🔑 ステップ2: API認証情報を取得

プロジェクトが作成されたら：

1. **サイドバーから「Settings」→「API」をクリック**

2. **以下の情報をコピー**：
   - `Project URL`: `https://xxxxxxxxx.supabase.co`
   - `anon public key`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **`.env.local` ファイルに貼り付け**：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗃️ ステップ3: データベーススキーマを作成

### 方法1: SQL Editorで実行（推奨）

1. **Supabaseダッシュボード**で左メニューの「SQL Editor」をクリック
2. 「New query」をクリック
3. 以下のSQLをコピー&ペーストして実行：

```sql
-- Shops（店舗）テーブル
CREATE TABLE shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  address TEXT,
  business_hours TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Girls（女の子）テーブル
CREATE TABLE girls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  height INTEGER,
  bust INTEGER,
  waist INTEGER,
  hip INTEGER,
  blood_type TEXT,
  description TEXT,
  charm_points TEXT[], -- 配列型
  available_options TEXT[], -- 配列型
  thumbnail_url TEXT,
  image_urls TEXT[], -- 配列型
  ranking INTEGER DEFAULT 999,
  view_count INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Reviews（レビュー）テーブル
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  girl_id UUID REFERENCES girls(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false, -- 管理者承認
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Bookings（予約）テーブル
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  girl_id UUID REFERENCES girls(id) ON DELETE SET NULL,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  duration INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Price Plans（料金プラン）テーブル
CREATE TABLE price_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL, -- 分
  price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Schedules（出勤スケジュール）テーブル
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  girl_id UUID REFERENCES girls(id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,
  available BOOLEAN DEFAULT true,
  time_slots TEXT[], -- 配列型
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(girl_id, schedule_date)
);

-- インデックスの作成（パフォーマンス向上）
CREATE INDEX idx_girls_shop_id ON girls(shop_id);
CREATE INDEX idx_girls_is_new ON girls(is_new);
CREATE INDEX idx_reviews_girl_id ON reviews(girl_id);
CREATE INDEX idx_reviews_approved ON reviews(approved);
CREATE INDEX idx_bookings_shop_id ON bookings(shop_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_schedules_girl_date ON schedules(girl_id, schedule_date);

-- Row Level Security (RLS) を有効化
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE girls ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- 公開読み取りポリシー（誰でも読める）
CREATE POLICY "Public read access" ON shops FOR SELECT USING (true);
CREATE POLICY "Public read access" ON girls FOR SELECT USING (true);
CREATE POLICY "Public read access" ON price_plans FOR SELECT USING (true);
CREATE POLICY "Public read access" ON schedules FOR SELECT USING (true);

-- レビューは承認済みのみ公開
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (approved = true);

-- 予約は誰でも作成可能
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);

-- レビューは誰でも作成可能（承認待ち）
CREATE POLICY "Anyone can create reviews" ON reviews FOR INSERT WITH CHECK (true);
```

4. 「RUN」ボタンをクリック
5. 成功メッセージを確認

---

## 📦 ステップ4: ストレージバケットを作成

### 画像アップロード用のストレージを設定

1. **Supabaseダッシュボード**で左メニューの「Storage」をクリック
2. 「New bucket」をクリック
3. バケット設定：
   - Name: `girl-images`
   - Public bucket: ✅ チェック（公開アクセス可能）
   - 「Create bucket」をクリック

4. もう一つバケットを作成：
   - Name: `shop-images`
   - Public bucket: ✅ チェック
   - 「Create bucket」をクリック

### ストレージポリシーの設定

```sql
-- girl-images バケットのポリシー
-- 誰でも画像を見られる
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'girl-images');

-- 認証済みユーザーのみアップロード可能（後で管理者認証を実装）
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'girl-images' AND auth.role() = 'authenticated');

-- shop-images バケットのポリシー
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'shop-images');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'shop-images' AND auth.role() = 'authenticated');
```

---

## 📊 ステップ5: 初期データを投入

### サンプルデータの投入

```sql
-- 店舗データ
INSERT INTO shops (id, name, description, phone, address, business_hours) VALUES
('11111111-1111-1111-1111-111111111111', 'プレミアム中標津', '中標津エリア最高級のサービスをお約束します。', '0153-XX-XXXX', '北海道標津郡中標津町', '10:00〜翌5:00'),
('22222222-2222-2222-2222-222222222222', 'ロイヤル中標津', '高品質なサービスとリーズナブルな料金設定が自慢です。', '0153-XX-XXXX', '北海道標津郡中標津町', '11:00〜翌4:00'),
('33333333-3333-3333-3333-333333333333', 'エレガンス中標津', '大人の女性が在籍する上質な空間。', '0153-XX-XXXX', '北海道標津郡中標津町', '12:00〜翌3:00');

-- 料金プラン
INSERT INTO price_plans (shop_id, duration, price) VALUES
('11111111-1111-1111-1111-111111111111', 60, 15000),
('11111111-1111-1111-1111-111111111111', 90, 21000),
('11111111-1111-1111-1111-111111111111', 120, 27000),
('22222222-2222-2222-2222-222222222222', 60, 13000),
('22222222-2222-2222-2222-222222222222', 90, 18000),
('22222222-2222-2222-2222-222222222222', 120, 23000),
('33333333-3333-3333-3333-333333333333', 60, 14000),
('33333333-3333-3333-3333-333333333333', 90, 19500),
('33333333-3333-3333-3333-333333333333', 120, 25000);
```

---

## 🔧 ステップ6: Next.jsアプリと連携

### Supabaseクライアントの設定

プロジェクトに既にインストール済みです。`.env.local` を更新するだけ！

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://あなたのプロジェクトID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのanon key
```

---

## ✅ 確認方法

### データベースの確認

1. Supabaseダッシュボード → 「Table Editor」
2. 各テーブルが表示されることを確認
3. サンプルデータが入っていることを確認

### ストレージの確認

1. Supabaseダッシュボード → 「Storage」
2. `girl-images` と `shop-images` バケットがあることを確認

---

## 📞 次のステップ

設定が完了したら、以下の情報を教えてください：

1. **Supabase Project URL**
2. **Supabase anon key**

これらを `.env.local` に設定すれば、データベースと連携できます！

---

## 💡 ヒント

### 無料プランの制限

- データベース容量: 500MB
- ストレージ: 1GB
- 帯域幅: 5GB/月

小規模サイトなら無料プランで十分！

### トラブルシューティング

- SQL実行エラー: エラーメッセージを確認して、構文をチェック
- 接続エラー: URLとAPIキーが正しいか確認
- アップロードエラー: バケットが公開設定になっているか確認

---

**更新日**: 2026年1月19日
