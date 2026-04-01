# ⚠️ ストレージバケットが見つからないエラー

## エラー内容
```
Console Error: Bucket not found
画像のアップロードに失敗しました
```

## 原因
Supabaseのストレージバケット（`girl-images` と `shop-images`）がまだ作成されていません。

---

## ✅ 解決方法

### ステップ1: Supabaseでストレージバケットを作成

1. **Supabaseダッシュボード**にアクセス
   👉 https://supabase.com/dashboard

2. **nakashibetsu-deliプロジェクト**を選択

3. 左サイドバーから **「Storage」** をクリック

4. **「Create a new bucket」** をクリック

5. **バケット1を作成**
   - Name: `girl-images`
   - ✅ **Public bucket** にチェック
   - 「Create bucket」をクリック

6. **バケット2を作成**
   - Name: `shop-images`
   - ✅ **Public bucket** にチェック
   - 「Create bucket」をクリック

### ステップ2: 確認

Supabaseダッシュボードで：
- ✅ Storage → `girl-images` バケットがある
- ✅ Storage → `shop-images` バケットがある

### ステップ3: 再度画像アップロードを試す

1. 管理画面で女の子の編集ページを開く
2. 画像を選択
3. 「保存する」をクリック
4. ✅ 成功！

---

## 🔧 一時的な回避策

**ストレージバケットを作成する前でも、画像なしで編集・登録はできます。**

1. 管理画面で女の子の編集ページを開く
2. **画像はアップロードせず**に、テキスト情報だけ編集
3. 「保存する」をクリック
4. ✅ データだけ保存される

---

## 📝 参考

- [Supabase Storage ドキュメント](https://supabase.com/docs/guides/storage)
- [バケットの作成方法](https://supabase.com/docs/guides/storage/buckets)
