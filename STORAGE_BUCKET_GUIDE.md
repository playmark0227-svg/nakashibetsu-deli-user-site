# 📦 Supabase ストレージバケット作成ガイド

## ⚠️ 現在の問題
画像アップロード時にエラーが発生する原因：**ストレージバケットが正しく作成されていないか、RLSポリシーが設定されていない**

## 🔍 確認結果
APIテストの結果、以下のことが判明しました：
- ❌ `girl-images` バケット: 見つかりません
- ❌ `shop-images` バケット: 見つかりません
- ⚠️ バケット一覧: 空（[]）

## 📋 ストレージバケット作成手順

### ステップ1: Supabaseダッシュボードにアクセス
1. https://supabase.com/dashboard にアクセス
2. プロジェクト「**nakashibetsu-deli**」を選択
3. 左メニューから「**Storage**」をクリック

### ステップ2: girl-images バケットを作成
1. 「**New bucket**」ボタンをクリック
2. 以下の設定を入力：
   ```
   Name: girl-images
   Public bucket: ✅ チェックを入れる（重要！）
   File size limit: 5 MB（または空欄）
   Allowed MIME types: 空欄（すべて許可）
   ```
3. 「**Create bucket**」をクリック

### ステップ3: shop-images バケットを作成
1. 再度「**New bucket**」ボタンをクリック
2. 以下の設定を入力：
   ```
   Name: shop-images
   Public bucket: ✅ チェックを入れる（重要！）
   File size limit: 5 MB（または空欄）
   Allowed MIME types: 空欄（すべて許可）
   ```
3. 「**Create bucket**」をクリック

### ステップ4: バケットのポリシーを設定（重要！）

#### 方法A: UIで設定（推奨）
1. `girl-images` バケットをクリック
2. 右上の「**Policies**」タブをクリック
3. 「**New policy**」をクリック
4. 以下の4つのポリシーを作成：

**ポリシー1: 読み取りを許可**
```
Policy name: Public Access
Allowed operation: SELECT
Target roles: public
Policy definition: true
```

**ポリシー2: アップロードを許可**
```
Policy name: Enable insert for all users
Allowed operation: INSERT
Target roles: public
Policy definition: true
```

**ポリシー3: 更新を許可**
```
Policy name: Enable update for all users
Allowed operation: UPDATE
Target roles: public
Policy definition: true
```

**ポリシー4: 削除を許可**
```
Policy name: Enable delete for all users
Allowed operation: DELETE
Target roles: public
Policy definition: true
```

5. `shop-images` バケットにも同じポリシーを設定

#### 方法B: SQLで設定
1. 左メニューから「**SQL Editor**」をクリック
2. 「**New query**」をクリック
3. `supabase-storage-policies.sql` の内容をコピー＆ペースト
4. 「**Run**」をクリック

### ステップ5: 動作確認

#### テスト1: バケットが表示されるか確認
以下のURLにアクセス：
```
https://3001-il4xaruhtlkhd0yoxpuv3-c81df28e.sandbox.novita.ai/api/storage-test
```

✅ 期待される結果：
```json
{
  "success": true,
  "buckets": {
    "girl-images": {
      "exists": true,
      "info": { ... }
    },
    "shop-images": {
      "exists": true,
      "info": { ... }
    }
  }
}
```

#### テスト2: 画像アップロードを試す
以下のコマンドを実行（POSTリクエスト）：
```bash
curl -X POST https://3001-il4xaruhtlkhd0yoxpuv3-c81df28e.sandbox.novita.ai/api/storage-test
```

✅ 期待される結果：
```json
{
  "success": true,
  "message": "Upload successful",
  "data": {
    "path": "test/test-xxxxx.png",
    "publicUrl": "https://jzkhzvlckrvxxrfffexx.supabase.co/storage/v1/object/public/girl-images/test/test-xxxxx.png"
  }
}
```

#### テスト3: 管理画面で画像アップロード
1. 管理画面にアクセス：https://3001-il4xaruhtlkhd0yoxpuv3-c81df28e.sandbox.novita.ai/admin
2. 「あやか」の編集をクリック
3. 画像をアップロード
4. 保存ボタンをクリック
5. ✅ 「保存しました！」と表示されれば成功！

## 🔧 トラブルシューティング

### エラー: "Bucket not found"
→ バケット名を確認してください。正確に `girl-images` と `shop-images` である必要があります。

### エラー: "new row violates row-level security policy"
→ RLSポリシーが設定されていません。**ステップ4**を実行してください。

### エラー: "The resource already exists"
→ バケットは既に作成されていますが、ポリシーが設定されていない可能性があります。**ステップ4**のみ実行してください。

### バケットは作成したがAPIで見えない
→ 以下を確認：
1. `.env.local` の `NEXT_PUBLIC_SUPABASE_URL` が正しいか
2. `.env.local` の `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しいか
3. 開発サーバーを再起動（`npm run dev` を再実行）

### 画像はアップロードされるが表示されない
→ バケットが「Public」に設定されているか確認してください。

## 📸 スクリーンショット参考

### 正しいバケット設定
```
✅ girl-images
   📁 Public: Yes
   📊 Size: 0 bytes
   📝 Files: 0
   
✅ shop-images
   📁 Public: Yes
   📊 Size: 0 bytes
   📝 Files: 0
```

## ✅ 完了チェックリスト

- [ ] Storageページにアクセスした
- [ ] `girl-images` バケットを作成した（Public: ✅）
- [ ] `shop-images` バケットを作成した（Public: ✅）
- [ ] RLSポリシーを設定した（全4種類）
- [ ] `/api/storage-test` でバケットが表示されることを確認した
- [ ] `/api/storage-test` (POST) でアップロードが成功することを確認した
- [ ] 管理画面で実際に画像をアップロードしてみた

すべてチェックが付いたら、画像アップロード機能が使えるようになります！ 🎉
