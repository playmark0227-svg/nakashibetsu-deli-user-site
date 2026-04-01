import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface VelvetBookingEmailData {
  shopName: string;
  shopPhone: string;
  girlName?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  options?: string;
  message?: string;
}

// 予約確認メール（お客様向け）
export async function sendCustomerBookingEmail(
  customerEmail: string,
  data: VelvetBookingEmailData
) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Velvet <onboarding@resend.dev>',
      to: customerEmail,
      subject: `【Velvet】ご予約を承りました - ${data.shopName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Hiragino Sans', 'Meiryo', sans-serif; line-height: 1.6; color: #333; background: #f9fafb; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #d4a5a5 0%, #e8c4c4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
              .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
              .info-label { font-weight: bold; width: 140px; color: #6b7280; }
              .info-value { flex: 1; color: #111827; }
              .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
              .button { display: inline-block; background: linear-gradient(135deg, #d4a5a5 0%, #e8c4c4 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">👑 Velvet</div>
                <p style="margin: 0;">中標津プレミアムエスコート</p>
              </div>
              <div class="content">
                <h2 style="color: #d4a5a5; margin-top: 0;">ご予約を承りました</h2>
                <p>${data.customerName} 様</p>
                <p>この度はVelvetをご利用いただき、誠にありがとうございます。<br>以下の内容でご予約を承りました。</p>
                
                <div style="margin: 30px 0;">
                  <div class="info-row">
                    <div class="info-label">店舗名</div>
                    <div class="info-value">${data.shopName}</div>
                  </div>
                  ${data.girlName ? `
                  <div class="info-row">
                    <div class="info-label">指名キャスト</div>
                    <div class="info-value">${data.girlName}</div>
                  </div>
                  ` : ''}
                  <div class="info-row">
                    <div class="info-label">ご予約日時</div>
                    <div class="info-value">${data.bookingDate} ${data.bookingTime}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">コース時間</div>
                    <div class="info-value">${data.duration}分</div>
                  </div>
                  ${data.options ? `
                  <div class="info-row">
                    <div class="info-label">オプション</div>
                    <div class="info-value">${data.options}</div>
                  </div>
                  ` : ''}
                  <div class="info-row">
                    <div class="info-label">お名前</div>
                    <div class="info-value">${data.customerName}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">お電話番号</div>
                    <div class="info-value">${data.customerPhone}</div>
                  </div>
                  ${data.message ? `
                  <div class="info-row">
                    <div class="info-label">ご要望</div>
                    <div class="info-value">${data.message}</div>
                  </div>
                  ` : ''}
                </div>

                <div class="warning">
                  <strong>⚠️ 重要なお知らせ</strong><br>
                  こちらは仮予約の確認メールです。<br>
                  最終的な予約確定のため、店舗へ直接お電話をお願いいたします。
                </div>

                <div style="text-align: center;">
                  <a href="tel:${data.shopPhone.replace(/-/g, '')}" class="button">
                    📞 ${data.shopPhone} に電話する
                  </a>
                </div>

                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                  ※ このメールに心当たりがない場合は、お手数ですが店舗までご連絡ください。
                </p>
              </div>
              <div class="footer">
                <p>Velvet - 中標津プレミアムエスコート<br>
                お問い合わせ: info@velvet-nakashibetsu.jp</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Customer email error:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Failed to send customer email:', error);
    return { success: false, error };
  }
}

// 店舗への通知メール
export async function sendShopBookingNotification(
  shopEmail: string,
  data: VelvetBookingEmailData
) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Velvet <onboarding@resend.dev>',
      to: shopEmail,
      subject: `【新規予約】${data.customerName}様 - ${data.bookingDate} ${data.bookingTime}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Hiragino Sans', 'Meiryo', sans-serif; line-height: 1.6; color: #333; background: #f9fafb; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #d4a5a5 0%, #e8c4c4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
              .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
              .info-label { font-weight: bold; width: 140px; color: #6b7280; }
              .info-value { flex: 1; color: #111827; }
              .alert { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">🔔 新規予約通知</h1>
                <p style="margin: 5px 0 0 0;">Velvet予約システム</p>
              </div>
              <div class="content">
                <div class="alert">
                  <strong>📌 お客様への確認電話をお願いします</strong><br>
                  仮予約が入りました。お客様に確認のお電話をお願いいたします。
                </div>

                <h3 style="color: #d4a5a5;">予約詳細</h3>
                <div style="margin: 20px 0;">
                  ${data.girlName ? `
                  <div class="info-row">
                    <div class="info-label">指名キャスト</div>
                    <div class="info-value"><strong style="color: #d4a5a5; font-size: 18px;">${data.girlName}</strong></div>
                  </div>
                  ` : ''}
                  <div class="info-row">
                    <div class="info-label">ご予約日時</div>
                    <div class="info-value"><strong style="font-size: 18px;">${data.bookingDate} ${data.bookingTime}</strong></div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">コース時間</div>
                    <div class="info-value">${data.duration}分</div>
                  </div>
                  ${data.options ? `
                  <div class="info-row">
                    <div class="info-label">オプション</div>
                    <div class="info-value"><strong style="color: #d4a5a5;">${data.options}</strong></div>
                  </div>
                  ` : ''}
                </div>

                <h3 style="color: #d4a5a5;">お客様情報</h3>
                <div style="margin: 20px 0;">
                  <div class="info-row">
                    <div class="info-label">お名前</div>
                    <div class="info-value">${data.customerName}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">電話番号</div>
                    <div class="info-value"><strong style="font-size: 18px;"><a href="tel:${data.customerPhone.replace(/-/g, '')}">${data.customerPhone}</a></strong></div>
                  </div>
                  ${data.customerEmail ? `
                  <div class="info-row">
                    <div class="info-label">メール</div>
                    <div class="info-value">${data.customerEmail}</div>
                  </div>
                  ` : ''}
                  ${data.message ? `
                  <div class="info-row">
                    <div class="info-label">ご要望・備考</div>
                    <div class="info-value">${data.message}</div>
                  </div>
                  ` : ''}
                </div>

                <p style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 4px; font-size: 14px;">
                  💡 <strong>対応手順</strong><br>
                  1. お客様に確認のお電話をする<br>
                  2. 予約内容の最終確認<br>
                  3. キャストのスケジュール調整<br>
                  4. 管理画面で予約ステータスを「確定」に変更
                </p>
              </div>
              <div class="footer">
                <p>Velvet予約管理システム<br>
                このメールは自動送信されています</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Shop email error:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Failed to send shop email:', error);
    return { success: false, error };
  }
}

// 管理者への通知メール
export async function sendAdminBookingNotification(
  adminEmail: string,
  data: VelvetBookingEmailData
) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Velvet <onboarding@resend.dev>',
      to: adminEmail,
      subject: `【Velvet】新規予約 - ${data.shopName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Hiragino Sans', 'Meiryo', sans-serif; line-height: 1.6; color: #333; background: #f9fafb; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1f2937; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
              .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
              .info-label { font-weight: bold; width: 140px; color: #6b7280; }
              .info-value { flex: 1; color: #111827; }
              .stats { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">📊 Velvet管理者通知</h1>
                <p style="margin: 5px 0 0 0;">新規予約が登録されました</p>
              </div>
              <div class="content">
                <h3>予約サマリー</h3>
                <div class="stats">
                  <strong>店舗:</strong> ${data.shopName}<br>
                  <strong>日時:</strong> ${data.bookingDate} ${data.bookingTime}<br>
                  <strong>お客様:</strong> ${data.customerName} (${data.customerPhone})<br>
                  ${data.girlName ? `<strong>指名:</strong> ${data.girlName}<br>` : ''}
                  <strong>時間:</strong> ${data.duration}分${data.options ? ` + オプション: ${data.options}` : ''}
                </div>

                <h3>詳細情報</h3>
                <div style="margin: 20px 0;">
                  <div class="info-row">
                    <div class="info-label">予約日時</div>
                    <div class="info-value">${data.bookingDate} ${data.bookingTime}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">店舗</div>
                    <div class="info-value">${data.shopName}</div>
                  </div>
                  ${data.girlName ? `
                  <div class="info-row">
                    <div class="info-label">指名</div>
                    <div class="info-value">${data.girlName}</div>
                  </div>
                  ` : ''}
                  <div class="info-row">
                    <div class="info-label">お客様</div>
                    <div class="info-value">${data.customerName}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">連絡先</div>
                    <div class="info-value">${data.customerPhone}${data.customerEmail ? ` / ${data.customerEmail}` : ''}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">コース</div>
                    <div class="info-value">${data.duration}分</div>
                  </div>
                  ${data.options ? `
                  <div class="info-row">
                    <div class="info-label">オプション</div>
                    <div class="info-value">${data.options}</div>
                  </div>
                  ` : ''}
                  ${data.message ? `
                  <div class="info-row">
                    <div class="info-label">備考</div>
                    <div class="info-value">${data.message}</div>
                  </div>
                  ` : ''}
                </div>

                <p style="margin-top: 20px; padding: 15px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px; font-size: 14px;">
                  ℹ️ 店舗へ予約通知メールを送信済みです。<br>
                  管理画面で予約状況を確認できます。
                </p>
              </div>
              <div class="footer">
                <p>Velvet予約管理システム<br>
                このメールは自動送信されています</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Admin email error:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Failed to send admin email:', error);
    return { success: false, error };
  }
}
