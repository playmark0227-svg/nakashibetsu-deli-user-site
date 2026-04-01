# 🚀 メール機能セットアップガイド

このガイドでは、予約確認メールとレビュー通知メールを実際に機能させるための手順を説明します。

## 📧 メール機能の概要

### 実装済みの機能

1. **予約確認メール**（お客様向け）
   - 予約内容の詳細
   - 店舗連絡先
   - 注意事項

2. **予約通知メール**（店舗向け）
   - 新規予約の通知
   - お客様情報
   - 確認が必要な旨

3. **レビュー通知メール**（管理者向け）
   - 新規口コミ投稿の通知
   - 承認・却下の判断依頼

## 🔧 セットアップ手順

### ステップ1: Resendアカウントの作成

1. [Resend](https://resend.com) にアクセス
2. 「Sign Up」をクリックしてアカウント作成
3. GitHubアカウントまたはメールアドレスで登録

### ステップ2: API Keyの取得

1. Resendにログイン後、ダッシュボードへ
2. 左メニューから「API Keys」をクリック
3. 「Create API Key」をクリック
4. 名前を入力（例: `nakashibetsu-deli-production`）
5. 表示されたAPIキーをコピー（一度しか表示されません！）

### ステップ3: ドメインの設定（推奨）

Resendの無料プランでは `onboarding@resend.dev` から送信できますが、本番環境では独自ドメインの設定を推奨します。

1. Resendダッシュボードで「Domains」をクリック
2. 「Add Domain」をクリック
3. あなたのドメイン（例: `nakashibetsu-deli.com`）を入力
4. 表示されるDNSレコードをドメイン管理画面に追加
5. 認証が完了するまで待機（数分〜数時間）

### ステップ4: 環境変数の設定

#### ローカル開発環境

1. プロジェクトルートの `.env.local` ファイルを編集：

```bash
# Resend API Key
RESEND_API_KEY=re_あなたのAPIキー

# メール送信元（独自ドメイン設定後）
EMAIL_FROM=noreply@nakashibetsu-deli.com

# 店舗通知用メールアドレス
SHOP_EMAIL_PREMIUM=premium@example.com
SHOP_EMAIL_ROYAL=royal@example.com
SHOP_EMAIL_ELEGANCE=elegance@example.com

# 管理者メールアドレス
ADMIN_EMAIL=admin@example.com

# サイトURL（ローカル）
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### 本番環境（Vercel）

1. Vercelプロジェクトの設定画面へ
2. 「Settings」→「Environment Variables」
3. 以下の環境変数を追加：

| 変数名 | 値 | 環境 |
|--------|-----|------|
| `RESEND_API_KEY` | あなたのAPIキー | Production, Preview |
| `EMAIL_FROM` | `noreply@yourdomain.com` | Production, Preview |
| `SHOP_EMAIL_PREMIUM` | 店舗1のメールアドレス | Production, Preview |
| `SHOP_EMAIL_ROYAL` | 店舗2のメールアドレス | Production, Preview |
| `SHOP_EMAIL_ELEGANCE` | 店舗3のメールアドレス | Production, Preview |
| `ADMIN_EMAIL` | 管理者メールアドレス | Production, Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | Production, Preview |

### ステップ5: テスト送信

1. 開発サーバーを起動：
```bash
npm run dev
```

2. ブラウザで予約フォームへアクセス
3. テスト予約を実行（自分のメールアドレスを入力）
4. メールが届くか確認

## 📬 メール配信の確認

### Resendダッシュボード

1. Resendにログイン
2. 「Emails」タブをクリック
3. 送信されたメールの履歴を確認
4. 配信状況（Delivered / Bounced / Failed）を確認

### トラブルシューティング

#### メールが届かない場合

1. **APIキーの確認**
   - `.env.local` のAPIキーが正しいか確認
   - サーバーを再起動

2. **迷惑メールフォルダの確認**
   - 初回送信時は迷惑メールに分類されることがあります

3. **ログの確認**
   - ターミナルにエラーメッセージが出ていないか確認
   - `console.log` でデバッグ

4. **Resend送信制限の確認**
   - 無料プランの制限を超えていないか確認
   - 無料プラン: 100通/日、3,000通/月

## 💰 料金プラン

### Resend料金

| プラン | 月額 | 送信数/月 | 備考 |
|--------|------|-----------|------|
| Free | $0 | 3,000通 | 開発・テストに最適 |
| Pro | $20 | 50,000通 | 小規模ビジネス |
| Business | カスタム | カスタム | 大規模ビジネス |

詳細: https://resend.com/pricing

## 🎨 メールテンプレートのカスタマイズ

メールのデザインを変更するには：

1. `lib/email/templates.ts` を編集
2. HTML/CSSを変更
3. テスト送信で確認

### カスタマイズ例

```typescript
// 色の変更
background: linear-gradient(135deg, #your-color 0%, #your-color2 100%);

// ロゴの追加
<img src="https://yourdomain.com/logo.png" alt="Logo" style="max-width: 200px;" />

// フッターの変更
<p>© 2026 あなたの会社名</p>
```

## 🔐 セキュリティのベストプラクティス

1. **APIキーの管理**
   - `.env.local` はGitにコミットしない（`.gitignore`に含まれています）
   - 定期的にAPIキーをローテーション

2. **メールアドレスの検証**
   - 既に実装済み（バリデーション機能）

3. **スパム対策**
   - reCAPTCHAの導入を検討
   - レート制限の実装

## 📊 メール配信の監視

### 推奨ツール

1. **Resendダッシュボード**
   - リアルタイム配信状況
   - バウンス率の監視

2. **Google Analytics**
   - メール経由のアクセス分析

3. **アラート設定**
   - 配信失敗時の通知設定

## 🚀 次のステップ

1. ✅ Resendアカウント作成
2. ✅ APIキー取得・設定
3. ✅ テスト送信
4. 📧 独自ドメイン設定（推奨）
5. 📊 配信監視の設定
6. 🎨 メールデザインのカスタマイズ

## ❓ よくある質問

### Q: 無料プランで十分？
A: 月間3,000通までなら無料プランで十分です。1日100通まで送信可能です。

### Q: 他のメールサービスは使える？
A: はい、以下のサービスも対応可能です：
- SendGrid
- AWS SES
- Mailgun
- Postmark

コードの変更が必要ですが、構造は同じです。

### Q: 日本語メールは問題ない？
A: 問題ありません。Resendは日本語に完全対応しています。

### Q: メール配信が遅い？
A: Resendは通常数秒以内に配信されます。遅延がある場合はResendダッシュボードで確認してください。

## 📞 サポート

問題が解決しない場合：

1. [Resendドキュメント](https://resend.com/docs)
2. [Resendサポート](https://resend.com/support)
3. プロジェクトのIssueで質問

---

**更新日**: 2026年1月19日
