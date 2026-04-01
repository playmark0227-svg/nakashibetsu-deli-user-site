# 📧 Resendメール通知設定ガイド

## 概要
Velvetの予約システムでは、予約が入ると以下の3つのメールが自動送信されます：
1. **お客様への確認メール** - 予約内容の確認
2. **店舗への通知メール** - 新規予約の通知
3. **管理者への通知メール** - システム全体の予約状況把握

## 🚀 Resend設定手順

### Step 1: Resendアカウント作成

1. [Resend](https://resend.com)にアクセス
2. 「Sign Up」をクリックして無料アカウントを作成
3. メールアドレスを確認

### Step 2: API キーを取得

1. Resendダッシュボードにログイン
2. **Settings** → **API Keys** に移動
3. 「Create API Key」をクリック
4. 名前を入力（例: `Velvet Production`）
5. **Full access** を選択
6. API キーをコピー（**一度しか表示されません！**）

### Step 3: ドメイン設定（オプション）

独自ドメインでメールを送信する場合：

1. **Domains** → **Add Domain**
2. ドメイン名を入力（例: `velvet-nakashibetsu.jp`）
3. 表示されるDNSレコード（SPF, DKIM, DMARC）を追加
4. 認証が完了するまで待機（数分～1時間）

**初期テストの場合**:
- ドメイン設定は不要
- `onboarding@resend.dev` から送信可能
- ただし、自分のメールアドレス宛のみ送信可能

### Step 4: 環境変数を設定

`.env.local` ファイルに以下を追加：

```bash
# Resend Email Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# メール送信元（独自ドメイン設定後）
EMAIL_FROM=Velvet <noreply@velvet-nakashibetsu.jp>

# 管理者メール（必須）
ADMIN_EMAIL=admin@your-domain.com

# 店舗メール（オプション - 店舗ごとに設定可能）
SHOP_EMAIL=shop@your-domain.com

# または店舗IDごとに個別設定
SHOP_EMAIL_SHOP1=shop1@your-domain.com
SHOP_EMAIL_SHOP2=shop2@your-domain.com
SHOP_EMAIL_SHOP3=shop3@your-domain.com
```

### Step 5: サーバーを再起動

```bash
npm run dev
```

## 📝 環境変数の詳細

### 必須項目

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `RESEND_API_KEY` | ResendのAPIキー | `re_123abc...` |
| `ADMIN_EMAIL` | 管理者メールアドレス | `admin@example.com` |

### オプション項目

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `EMAIL_FROM` | 送信元メールアドレス | `Velvet <onboarding@resend.dev>` |
| `SHOP_EMAIL` | 全店舗共通の通知先 | - |
| `SHOP_EMAIL_SHOP1` | 店舗1の通知先 | - |
| `SHOP_EMAIL_SHOP2` | 店舗2の通知先 | - |

## 🧪 テスト方法

### 1. 基本テスト

1. ユーザーサイトで店舗詳細ページを開く
2. 予約フォームに入力（メールアドレス入力）
3. 送信
4. 以下を確認：
   - 予約が Supabase に保存される
   - お客様にメールが届く
   - 店舗にメールが届く
   - 管理者にメールが届く

### 2. メール内容の確認

**お客様メール**:
- ✅ 予約内容が正確に表示される
- ✅ 店舗の電話番号がクリック可能
- ✅ Velvetブランディングが適用されている

**店舗メール**:
- ✅ お客様の連絡先が表示される
- ✅ 指名キャストが表示される（指名がある場合）
- ✅ オプションが表示される（オプションがある場合）

**管理者メール**:
- ✅ 予約サマリーが見やすい
- ✅ 店舗名と日時が表示される

## 🛠️ トラブルシューティング

### メールが届かない

**原因1: APIキーが無効**
```bash
# ログを確認
tail -f /tmp/velvet-booking-api.log

# エラーメッセージ: "Invalid API key"
# 対処法: .env.local の RESEND_API_KEY を確認
```

**原因2: 送信先メールアドレスが未設定**
```bash
# 環境変数を確認
cat .env.local | grep EMAIL

# ADMIN_EMAIL が設定されているか確認
```

**原因3: Resendの無料プランの制限**
- 無料プランは **1日100通まで**
- `onboarding@resend.dev` からは **自分のメールアドレス宛のみ**
- 対処法: ドメイン認証を完了させる

### メールがスパム扱いされる

1. ドメイン認証を完了させる（SPF, DKIM, DMARC）
2. 送信元アドレスを `noreply@` に変更
3. メール内容に適切なヘッダー情報を追加

## 📊 メール送信のフロー

```
予約フォーム送信
   ↓
予約APIに送信
   ↓
Supabaseに保存
   ↓
メール送信開始
   ├─→ お客様への確認メール（メールアドレスがある場合）
   ├─→ 店舗への通知メール（SHOP_EMAIL設定がある場合）
   └─→ 管理者への通知メール（ADMIN_EMAIL設定がある場合）
   ↓
送信結果を返す（emailResults）
```

## 🎯 本番環境での推奨設定

### 1. 独自ドメインの設定
```bash
# 例: velvet-nakashibetsu.jp
EMAIL_FROM=Velvet <noreply@velvet-nakashibetsu.jp>
```

### 2. 各店舗に個別メール
```bash
SHOP_EMAIL_SHOP1=zero@velvet-nakashibetsu.jp
SHOP_EMAIL_SHOP2=aikoro@velvet-nakashibetsu.jp
SHOP_EMAIL_SHOP3=blackcherry@velvet-nakashibetsu.jp
```

### 3. 管理者用メール
```bash
ADMIN_EMAIL=admin@velvet-nakashibetsu.jp
```

### 4. 送信ログの監視

Resendダッシュボードで以下を確認：
- **Emails** - 送信履歴
- **Logs** - エラーログ
- **Analytics** - 開封率、クリック率

## ✅ 確認リスト

セットアップが完了したら、以下を確認してください：

- [ ] Resendアカウントを作成した
- [ ] API キーを取得した
- [ ] `.env.local` に `RESEND_API_KEY` を設定した
- [ ] `.env.local` に `ADMIN_EMAIL` を設定した
- [ ] サーバーを再起動した
- [ ] テスト予約を送信した
- [ ] メールが届くことを確認した

## 📚 参考リンク

- [Resend公式ドキュメント](https://resend.com/docs)
- [Resend APIリファレンス](https://resend.com/docs/api-reference/emails/send-email)
- [Next.jsでResendを使う方法](https://resend.com/docs/send-with-nextjs)

---

**問題が発生した場合は、Resendのサポートに問い合わせるか、開発者にご連絡ください。**
