# 🔧 出勤状況管理機能 - Supabase セットアップ手順

## ⚠️ 重要：このSQLを実行してください！

出勤状況管理機能を使うには、Supabaseに`girl_schedules`テーブルを作成する必要があります。

---

## 📋 セットアップ手順

### Step 1: Supabaseにログイン

1. Supabaseダッシュボードにアクセス：https://supabase.com/dashboard
2. プロジェクトを選択
3. 左メニューから **SQL Editor** をクリック

### Step 2: SQLを実行

以下のファイルの内容をコピーして、SQL Editorで実行してください：

```
nakashibetsu-deli/supabase-girl-schedules-easy.sql
```

または、以下のコマンドを実行：

#### ファイルの場所
```bash
/home/user/webapp/nakashibetsu-deli/supabase-girl-schedules-easy.sql
```

### Step 3: 実行確認

SQL実行後、以下のメッセージが表示されればOK：

```
girl_schedules table created successfully with relaxed RLS policies!
```

### Step 4: テーブル確認

SQL Editorで以下を実行して確認：

```sql
SELECT * FROM girl_schedules LIMIT 5;
```

エラーが出なければ成功です！

---

## 🆘 トラブルシューティング

### エラー1: "relation already exists"

テーブルが既に存在する場合。以下を実行して削除してから再実行：

```sql
DROP TABLE IF EXISTS girl_schedules CASCADE;
```

その後、再度 `supabase-girl-schedules-easy.sql` を実行してください。

### エラー2: "permission denied"

RLSポリシーの問題です。以下を実行：

```sql
ALTER TABLE girl_schedules DISABLE ROW LEVEL SECURITY;
```

---

## 📊 テーブル構造

### `girl_schedules` テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | UUID | 主キー（自動生成） |
| girl_id | TEXT | キャストID |
| shop_id | TEXT | 店舗ID |
| date | DATE | 日付（デフォルト: 今日） |
| status | TEXT | 出勤状況（'working', 'scheduled', 'off', 'unknown'） |
| instant_available | BOOLEAN | ソク姫対応可否 |
| start_time | TIME | 出勤開始時間 |
| end_time | TIME | 退勤時間 |
| notes | TEXT | 備考 |
| updated_at | TIMESTAMPTZ | 更新日時（自動） |
| updated_by | TEXT | 更新者 |

### 制約

- **UNIQUE(girl_id, date)**: 1人のキャストは1日1レコードのみ

---

## ✅ 動作確認

### テスト用サンプルデータ投入

以下のSQLでテストデータを挿入できます：

```sql
-- 実際のgirl_idとshop_idを確認
SELECT id, name, shop_id FROM girls LIMIT 5;
SELECT id, name FROM shops LIMIT 3;

-- サンプルデータ投入（girl_idとshop_idを実際の値に置き換えてください）
INSERT INTO girl_schedules (girl_id, shop_id, date, status, instant_available, start_time, end_time, notes)
VALUES 
  ('実際のgirl_id1', '実際のshop_id1', CURRENT_DATE, 'working', true, '18:00', '24:00', 'ソク姫対応可能！今すぐ遊べます'),
  ('実際のgirl_id2', '実際のshop_id1', CURRENT_DATE, 'working', false, '20:00', '02:00', '20時以降出勤予定・予約のみ'),
  ('実際のgirl_id3', '実際のshop_id2', CURRENT_DATE, 'off', false, NULL, NULL, '本日お休みです');
```

### 確認クエリ

```sql
-- 本日の出勤状況を確認
SELECT 
  g.name as キャスト名,
  s.name as 店舗名,
  gs.status as 出勤状況,
  gs.instant_available as ソク姫OK,
  gs.start_time as 開始時間,
  gs.end_time as 終了時間,
  gs.notes as 備考
FROM girl_schedules gs
JOIN girls g ON g.id = gs.girl_id
JOIN shops s ON s.id = gs.shop_id
WHERE gs.date = CURRENT_DATE;
```

---

## 🌐 管理画面での動作確認

### 店舗管理画面

1. ログイン：https://3011-il4xaruhtlkhd0yoxpuv3-c81df28e.sandbox.novita.ai/login
   - ID: `zero` / PW: `shop123`
2. ダッシュボード → 「出勤状況管理」
3. キャスト一覧が表示される
4. 出勤状況を更新 → 「保存」
5. ✅ 「スケジュールを更新しました」というトースト通知が表示される

### マスター管理画面

1. アクセス：https://3005-il4xaruhtlkhd0yoxpuv3-c81df28e.sandbox.novita.ai/admin
2. ダッシュボード → 「出勤状況管理」
3. 全店舗のキャスト一覧が表示される
4. 店舗フィルターで絞り込み
5. 出勤状況を更新 → 「保存」
6. ✅ トースト通知が表示される

---

## 📝 RLSポリシーについて

本SQLファイルでは、開発を容易にするため**全ユーザーに読み書き権限**を付与しています。

### 本番環境での推奨設定

本番環境では、以下のようにRLSポリシーを厳格化してください：

```sql
-- 認証済みユーザーのみ書き込み可能
DROP POLICY IF EXISTS "Everyone can insert schedules" ON girl_schedules;
DROP POLICY IF EXISTS "Everyone can update schedules" ON girl_schedules;
DROP POLICY IF EXISTS "Everyone can delete schedules" ON girl_schedules;

CREATE POLICY "Authenticated users can insert schedules"
ON girl_schedules FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update schedules"
ON girl_schedules FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete schedules"
ON girl_schedules FOR DELETE
USING (auth.role() = 'authenticated');
```

---

## 🎉 完了！

これでSupabaseのセットアップは完了です。

管理画面で出勤状況を更新できるようになりました！

何か問題があれば、エラーメッセージを教えてください。
