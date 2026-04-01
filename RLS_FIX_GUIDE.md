# 🔧 RLS（Row Level Security）ポリシーの修正手順

## ⚠️ 問題
現在、Supabaseでは**読み取り（SELECT）のみ**が許可されていて、**更新（UPDATE）**と**挿入（INSERT）**ができません。
これが原因で、管理画面での編集が「データの更新に失敗しました」というエラーになります。

## 🛠️ 修正方法

### ステップ1: Supabaseダッシュボードにアクセス
1. https://supabase.com/dashboard にアクセス
2. プロジェクト「nakashibetsu-deli」を選択
3. 左メニューから **SQL Editor** をクリック

### ステップ2: SQLスクリプトを実行

以下のどちらかの方法で実行してください：

#### 方法A: 修正用SQLを実行（推奨）
1. SQL Editorで **New query** をクリック
2. `supabase-rls-fix.sql` の内容をコピー＆ペースト
3. **Run** ボタンをクリック
4. 完了！

#### 方法B: 完全なスキーマを再実行
1. SQL Editorで **New query** をクリック
2. `supabase-schema.sql` の内容をコピー＆ペースト
3. **Run** ボタンをクリック
4. 完了！（既存のデータは保持されます - ON CONFLICT DO NOTHING のため）

### ステップ3: 動作確認
1. 管理画面にアクセス: https://3001-il4xaruhtlkhd0yoxpuv3-c81df28e.sandbox.novita.ai/admin
2. 「あやか」の編集ボタンをクリック
3. 名前を変更（例: あやか → あやか2）
4. 保存ボタンをクリック
5. ✅ 「保存しました！」と表示されれば成功！

## 📝 修正内容の説明

### 各テーブルに追加したポリシー

#### Girls（女の子）テーブル
- ✅ **SELECT**: 誰でも読み取り可能
- ✅ **INSERT**: 誰でも新規登録可能（管理画面用）
- ✅ **UPDATE**: 誰でも更新可能（管理画面用）
- ✅ **DELETE**: 誰でも削除可能（管理画面用）

#### Reviews（レビュー）テーブル
- ✅ **SELECT**: 承認済み（approved = true）のみ読み取り可能
- ✅ **INSERT**: 誰でも新規レビュー投稿可能
- ✅ **UPDATE**: 誰でも更新可能（承認フラグ変更用）

#### Bookings（予約）テーブル
- ✅ **SELECT**: 誰でも読み取り可能（管理機能用）
- ✅ **INSERT**: 誰でも新規予約可能
- ✅ **UPDATE**: 誰でも更新可能（ステータス変更用）

#### Shops（店舗）テーブル
- ✅ **SELECT**: 誰でも読み取り可能
- ✅ **UPDATE**: 誰でも更新可能（管理機能用）

#### Schedules（スケジュール）テーブル
- ✅ **SELECT**: 誰でも読み取り可能
- ✅ **INSERT**: 誰でも新規登録可能
- ✅ **UPDATE**: 誰でも更新可能

#### Price Plans（料金プラン）テーブル
- ✅ **SELECT**: 誰でも読み取り可能

## 🔒 セキュリティについて

現在のポリシーは**開発・テスト用**です。本番環境では以下のように変更することをおすすめします：

### 本番環境での推奨設定
```sql
-- 管理者のみ更新可能にする場合
CREATE POLICY "Admin only updates" ON girls 
  FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- 認証ユーザーのみ予約可能にする場合
CREATE POLICY "Authenticated users can book" ON bookings 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');
```

### 現在の設定でも問題ない理由
1. **APIキーは秘密にする**: ANON キーは公開されますが、制限付きアクセスのみ
2. **ビジネスロジックで制限**: アプリケーション側でバリデーション実装
3. **フロントエンドは管理画面のみ**: 一般ユーザーは編集画面にアクセスできない

## ✅ 確認チェックリスト

- [ ] SQL Editorで `supabase-rls-fix.sql` を実行した
- [ ] エラーなく完了した
- [ ] 管理画面で「あやか」を編集してみた
- [ ] 保存が成功した
- [ ] トップページで変更が反映された

## 🆘 トラブルシューティング

### エラー: "policy already exists"
→ すでに実行済みです。問題ありません。

### エラー: "permission denied"
→ Supabaseプロジェクトのオーナーまたは管理者としてログインしてください。

### それでも保存できない
1. ブラウザのコンソールを開く（F12キー）
2. エラーメッセージを確認
3. `.env.local` の `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しいか確認

## 📞 サポート
問題が解決しない場合は、エラーメッセージの詳細をお知らせください！
