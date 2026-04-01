import { NextRequest, NextResponse } from 'next/server';
import { createBooking } from '@/lib/api/bookings';
import { getShopById } from '@/lib/api/shops';
import {
  sendCustomerBookingEmail,
  sendShopBookingNotification,
  sendAdminBookingNotification,
} from '@/lib/email/velvet-templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      shop_id,
      girl_name,
      customer_name, 
      phone,
      email: customer_email,
      booking_date, 
      booking_time, 
      duration,
      options,
      message 
    } = body;

    // バリデーション
    if (!shop_id || !customer_name || !phone || !booking_date || !booking_time || !duration) {
      return NextResponse.json(
        { success: false, error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // 電話番号の形式チェック（簡易的）
    const phoneRegex = /^[0-9-]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: '電話番号の形式が正しくありません' },
        { status: 400 }
      );
    }

    // 店舗情報を取得
    const shop = await getShopById(shop_id);
    if (!shop) {
      return NextResponse.json(
        { success: false, error: '店舗が見つかりません' },
        { status: 404 }
      );
    }

    // データベースに予約情報を保存
    // オプションをメッセージに統合（Supabaseテーブルに options カラムがない場合）
    let combinedMessage = message || '';
    if (options) {
      combinedMessage = combinedMessage 
        ? `【オプション】${options}\n\n【備考】${message}`
        : `【オプション】${options}`;
    }
    
    const booking = await createBooking({
      shop_id,
      girl_name: girl_name || null,
      customer_name,
      phone,
      booking_date,
      booking_time,
      duration: Number(duration),
      message: combinedMessage || null,
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: '予約の保存に失敗しました' },
        { status: 500 }
      );
    }

    // メール通知データを準備
    const emailData = {
      shopName: shop.name,
      shopPhone: shop.phone,
      girlName: girl_name,
      customerName: customer_name,
      customerPhone: phone,
      customerEmail: customer_email,
      bookingDate: booking_date,
      bookingTime: booking_time,
      duration: Number(duration),
      options: options,
      message: message,
    };

    // メール送信結果を記録
    const emailResults = {
      customerEmail: false,
      shopEmail: false,
      adminEmail: false,
    };

    // 1. お客様への確認メール（メールアドレスがある場合）
    if (customer_email) {
      try {
        const customerResult = await sendCustomerBookingEmail(customer_email, emailData);
        emailResults.customerEmail = customerResult.success;
        if (!customerResult.success) {
          console.error('Customer email failed:', customerResult.error);
        }
      } catch (error) {
        console.error('Customer email error:', error);
      }
    }

    // 2. 店舗への通知メール
    const shopEmail = process.env.SHOP_EMAIL || process.env[`SHOP_EMAIL_${shop_id.toUpperCase()}`];
    if (shopEmail) {
      try {
        const shopResult = await sendShopBookingNotification(shopEmail, emailData);
        emailResults.shopEmail = shopResult.success;
        if (!shopResult.success) {
          console.error('Shop email failed:', shopResult.error);
        }
      } catch (error) {
        console.error('Shop email error:', error);
      }
    }

    // 3. 管理者への通知メール
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        const adminResult = await sendAdminBookingNotification(adminEmail, emailData);
        emailResults.adminEmail = adminResult.success;
        if (!adminResult.success) {
          console.error('Admin email failed:', adminResult.error);
        }
      } catch (error) {
        console.error('Admin email error:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: '予約を受け付けました',
      emailResults,
      booking: {
        id: booking.id,
        customer_name: booking.customer_name,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        duration: booking.duration,
      },
    });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { success: false, error: '予約処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 予約一覧を取得（管理画面用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shop_id = searchParams.get('shop_id');

    // 全予約または店舗別予約を取得
    // TODO: 実装
    
    return NextResponse.json({
      success: true,
      bookings: [],
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { success: false, error: '予約の取得に失敗しました' },
      { status: 500 }
    );
  }
}
