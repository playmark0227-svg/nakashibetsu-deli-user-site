import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingEmailData {
  girlName: string;
  shopName: string;
  shopPhone: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  timeSlot: string;
  duration: number;
  price: number;
  notes?: string;
}

interface ReviewEmailData {
  girlName: string;
  shopName: string;
  userName: string;
  rating: number;
  comment: string;
}

// 予約確認メール（お客様向け）
export async function sendBookingConfirmationEmail(
  customerEmail: string,
  data: BookingEmailData
) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: customerEmail,
      subject: `【予約受付】${data.shopName} - ご予約ありがとうございます`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Hiragino Sans', 'Meiryo', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
              .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
              .info-label { font-weight: bold; width: 120px; color: #6b7280; }
              .info-value { flex: 1; color: #111827; }
              .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
              .button { display: inline-block; background: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">予約受付完了</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">ご予約ありがとうございます</p>
              </div>
              <div class="content">
                <p>${data.customerName} 様</p>
                <p>この度は<strong>${data.shopName}</strong>をご利用いただき、誠にありがとうございます。<br>以下の内容でご予約を承りました。</p>
                
                <div style="margin: 30px 0;">
                  <h2 style="color: #ec4899; border-bottom: 2px solid #ec4899; padding-bottom: 10px;">ご予約内容</h2>
                  <div class="info-row">
                    <div class="info-label">女の子</div>
                    <div class="info-value">${data.girlName}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">日時</div>
                    <div class="info-value">${data.date} ${data.timeSlot}〜</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">コース</div>
                    <div class="info-value">${data.duration}分コース</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">料金</div>
                    <div class="info-value" style="font-size: 20px; font-weight: bold; color: #ec4899;">¥${data.price.toLocaleString()}</div>
                  </div>
                  ${data.notes ? `
                  <div class="info-row">
                    <div class="info-label">ご要望</div>
                    <div class="info-value">${data.notes}</div>
                  </div>
                  ` : ''}
                </div>

                <div class="warning">
                  <strong>⚠️ 重要なお知らせ</strong>
                  <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    <li>店舗から確認のお電話をさせていただきます</li>
                    <li>確認が取れ次第、ご予約が正式に確定となります</li>
                    <li>キャンセルの場合は必ず事前にご連絡ください</li>
                  </ul>
                </div>

                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #374151;">店舗連絡先</h3>
                  <p style="margin: 5px 0;"><strong>${data.shopName}</strong></p>
                  <p style="margin: 5px 0; font-size: 20px; color: #ec4899;"><strong>📞 ${data.shopPhone}</strong></p>
                </div>

                <p style="color: #6b7280; font-size: 14px;">
                  ※このメールは送信専用です。ご返信いただいてもお答えできません。<br>
                  ※ご不明な点は店舗まで直接お電話ください。
                </p>
              </div>
              <div class="footer">
                <p>中標津デリヘル情報<br>https://nakashibetsu-deli.com</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

// 予約通知メール（店舗向け）
export async function sendBookingNotificationToShop(
  shopEmail: string,
  data: BookingEmailData
) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: shopEmail,
      subject: `【新規予約】${data.girlName} - ${data.date} ${data.timeSlot}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Hiragino Sans', 'Meiryo', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
              .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
              .info-label { font-weight: bold; width: 120px; color: #6b7280; }
              .info-value { flex: 1; color: #111827; }
              .urgent { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">🔔 新規予約受付</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">${data.shopName}</p>
              </div>
              <div class="content">
                <div class="urgent">
                  <strong>⚠️ 要対応</strong>
                  <p style="margin: 5px 0 0 0;">新しい予約が入りました。お客様へ確認のお電話をお願いします。</p>
                </div>

                <div style="margin: 30px 0;">
                  <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">予約詳細</h2>
                  <div class="info-row">
                    <div class="info-label">指名</div>
                    <div class="info-value" style="font-size: 18px; font-weight: bold;">${data.girlName}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">日時</div>
                    <div class="info-value" style="font-weight: bold;">${data.date} ${data.timeSlot}〜</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">コース</div>
                    <div class="info-value">${data.duration}分 / ¥${data.price.toLocaleString()}</div>
                  </div>
                </div>

                <div style="margin: 30px 0;">
                  <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">お客様情報</h2>
                  <div class="info-row">
                    <div class="info-label">お名前</div>
                    <div class="info-value">${data.customerName}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">電話番号</div>
                    <div class="info-value" style="font-size: 18px; font-weight: bold; color: #3b82f6;">${data.customerPhone}</div>
                  </div>
                  ${data.customerEmail ? `
                  <div class="info-row">
                    <div class="info-label">メール</div>
                    <div class="info-value">${data.customerEmail}</div>
                  </div>
                  ` : ''}
                  ${data.notes ? `
                  <div class="info-row">
                    <div class="info-label">ご要望</div>
                    <div class="info-value">${data.notes}</div>
                  </div>
                  ` : ''}
                </div>

                <div style="background: #fef3c7; padding: 15px; border-radius: 8px;">
                  <strong>📞 次のアクション</strong>
                  <ol style="margin: 10px 0 0 0; padding-left: 20px;">
                    <li>お客様へ確認のお電話</li>
                    <li>キャストのスケジュール確認</li>
                    <li>予約確定の連絡</li>
                  </ol>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Shop notification error:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Shop notification error:', error);
    return { success: false, error };
  }
}

// レビュー投稿通知メール（管理者向け）
export async function sendReviewNotificationEmail(data: ReviewEmailData) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('ADMIN_EMAIL not configured');
      return { success: false, error: 'Admin email not configured' };
    }

    const stars = '⭐'.repeat(data.rating);

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: adminEmail,
      subject: `【新規口コミ】${data.girlName} - ${stars}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Hiragino Sans', 'Meiryo', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
              .review-box { background: #fffbeb; border: 2px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .rating { font-size: 24px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">💬 新規口コミ投稿</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">確認・承認が必要です</p>
              </div>
              <div class="content">
                <h2 style="color: #f59e0b;">対象キャスト</h2>
                <p style="font-size: 20px; font-weight: bold;">${data.girlName}（${data.shopName}）</p>

                <div class="review-box">
                  <div class="rating">${stars}</div>
                  <p style="margin: 5px 0; color: #6b7280;">投稿者: ${data.userName}</p>
                  <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #fbbf24;">
                    <p style="white-space: pre-wrap;">${data.comment}</p>
                  </div>
                </div>

                <div style="background: #dbeafe; padding: 15px; border-radius: 8px;">
                  <strong>📝 対応が必要です</strong>
                  <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    <li>内容を確認してください</li>
                    <li>不適切な表現がないか確認</li>
                    <li>承認または却下を判断</li>
                  </ul>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    管理画面で確認
                  </a>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Review notification error:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Review notification error:', error);
    return { success: false, error };
  }
}
