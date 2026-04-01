import { NextRequest, NextResponse } from 'next/server';
import { sendReviewNotificationEmail } from '@/lib/email/templates';
import { getGirlById } from '@/lib/api/girls';
import { getShopById } from '@/lib/api/shops';
import { createReview } from '@/lib/api/reviews';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { girlId, userName, rating, comment } = body;

    // バリデーション
    if (!girlId || !userName || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: '評価は1〜5の範囲で入力してください' },
        { status: 400 }
      );
    }

    if (comment.length < 10) {
      return NextResponse.json(
        { success: false, error: '口コミは10文字以上入力してください' },
        { status: 400 }
      );
    }

    // 女の子と店舗の情報を取得
    const girl = await getGirlById(girlId);
    if (!girl) {
      return NextResponse.json(
        { success: false, error: '女の子が見つかりません' },
        { status: 404 }
      );
    }

    const shop = await getShopById(girl.shop_id);
    if (!shop) {
      return NextResponse.json(
        { success: false, error: '店舗が見つかりません' },
        { status: 404 }
      );
    }

    // データベースにレビュー情報を保存
    const review = await createReview({
      girl_id: girlId,
      shop_id: shop.id,
      user_name: userName,
      rating: Number(rating),
      comment,
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'レビューの保存に失敗しました' },
        { status: 500 }
      );
    }

    // 管理者へ通知メール送信
    const emailResult = await sendReviewNotificationEmail({
      girlName: girl.name,
      shopName: shop.name,
      userName,
      rating: Number(rating),
      comment,
    });

    return NextResponse.json({
      success: true,
      message: '口コミを投稿しました。管理者の確認後に公開されます。',
      emailSent: emailResult.success,
      review: {
        id: review.id,
        girlId,
        girlName: girl.name,
        shopName: shop.name,
        userName,
        rating: Number(rating),
        comment,
        date: review.created_at,
        verified: review.verified,
        approved: review.approved,
      },
    });
  } catch (error) {
    console.error('Review API error:', error);
    return NextResponse.json(
      { success: false, error: 'レビュー投稿中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
