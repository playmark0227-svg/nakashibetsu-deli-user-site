# 新店舗「りある人妻の品格中標津〔幼妻、若妻、熟妻〕」セットアップガイド

## 店舗情報

- **店舗名**: りある人妻の品格中標津〔幼妻、若妻、熟妻〕
- **ログインID**: `hitozuma`
- **パスワード**: `shop123`
- **説明**: 人妻専門店。幼妻・若妻・熟妻と幅広い年齢層の魅力的な人妻が在籍。上質な大人の時間をお約束します。
- **営業時間**: 10:00-24:00
- **電話番号**: 0153-XX-XXXX（実際の番号に変更してください）

## セットアップ手順

### 1. Supabaseにログイン
https://supabase.com/dashboard にアクセスし、プロジェクトを開く

### 2. SQL Editorを開く
左メニューから「SQL Editor」を選択

### 3. 店舗を追加

以下のSQLを実行：

```sql
-- 新店舗を追加
INSERT INTO shops (
  login_id,
  password_hash,
  name,
  description,
  address,
  phone,
  business_hours
) VALUES (
  'hitozuma',
  'shop123',
  'りある人妻の品格中標津〔幼妻、若妻、熟妻〕',
  '人妻専門店。幼妻・若妻・熟妻と幅広い年齢層の魅力的な人妻が在籍。上質な大人の時間をお約束します。',
  '中標津町',
  '0153-XX-XXXX',
  '10:00-24:00'
);

-- 追加された店舗を確認
SELECT id, name, login_id FROM shops WHERE login_id = 'hitozuma';
```

### 4. 料金プランを追加

```sql
-- 料金プランを追加
WITH shop AS (
  SELECT id FROM shops WHERE login_id = 'hitozuma' LIMIT 1
)
INSERT INTO price_plans (shop_id, duration, price)
SELECT 
  shop.id,
  duration,
  price
FROM shop, (VALUES
  (60, 12000),
  (90, 17000),
  (120, 22000)
) AS plans(duration, price);

-- 確認
SELECT pp.*, s.name as shop_name 
FROM price_plans pp 
JOIN shops s ON pp.shop_id = s.id 
WHERE s.login_id = 'hitozuma';
```

### 5. 店舗管理画面にログイン

**URL**: https://3011-il4xaruhtlkhd0yoxpuv3-c81df28e.sandbox.novita.ai/login

**ログイン情報**:
- ID: `hitozuma`
- パスワード: `shop123`

### 6. キャストを追加

店舗管理画面から：
1. 「キャスト管理」を選択
2. 「新規追加」をクリック
3. キャスト情報を入力
4. 写真をアップロード
5. 保存

### 7. 出勤管理

1. 「出勤管理」を選択
2. 今日の日付を選択
3. キャストの出勤状況を設定
4. 「ソク姫対応可能」にチェックを入れる（必要に応じて）
5. 保存

## 確認事項

### ユーザーサイトで確認
https://3002-il4xaruhtlkhd0yoxpuv3-c81df28e.sandbox.novita.ai/

- トップページに新店舗が表示されているか
- 店舗一覧に表示されているか
- 店舗詳細ページが正しく表示されるか

### 店舗数の確認
- 登録店舗数が「4店舗」になっているか確認

## 既存店舗のログイン情報

### ZERO店
- ID: `zero`
- パスワード: `shop123`

### あいどる×美少女系
- ID: `aikoro`
- パスワード: `shop123`

### ブラックチェリー
- ID: `black-cherry`
- パスワード: `shop123`

### りある人妻の品格中標津〔幼妻、若妻、熟妻〕（NEW）
- ID: `hitozuma`
- パスワード: `shop123`

## トラブルシューティング

### 店舗が表示されない場合
1. Supabaseでデータが正しく登録されているか確認
2. ブラウザのキャッシュをクリア
3. ページをリロード

### ログインできない場合
1. ログインIDとパスワードを再確認
2. データベースの `shops` テーブルを確認

## サポート

問題が発生した場合は、マスター管理画面から店舗情報を確認・編集できます。

**マスター管理画面**: https://3005-il4xaruhtlkhd0yoxpuv3-c81df28e.sandbox.novita.ai/admin
