import { NextRequest, NextResponse } from 'next/server';
import {
  getTodaySchedules,
  getGirlTodaySchedule,
  getWorkingGirls,
  getInstantAvailableGirls,
  upsertSchedule,
  deleteSchedule,
} from '@/lib/api/schedules';

// GET: スケジュール取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'today' | 'working' | 'instant' | 'girl'
    const shopId = searchParams.get('shop_id');
    const girlId = searchParams.get('girl_id');

    switch (type) {
      case 'girl':
        if (!girlId) {
          return NextResponse.json(
            { success: false, error: 'girl_id is required' },
            { status: 400 }
          );
        }
        const girlSchedule = await getGirlTodaySchedule(girlId);
        return NextResponse.json({
          success: true,
          schedule: girlSchedule,
        });

      case 'working':
        const workingGirls = await getWorkingGirls(shopId || undefined);
        return NextResponse.json({
          success: true,
          schedules: workingGirls,
        });

      case 'instant':
        const instantGirls = await getInstantAvailableGirls(shopId || undefined);
        return NextResponse.json({
          success: true,
          schedules: instantGirls,
        });

      case 'today':
      default:
        const todaySchedules = await getTodaySchedules(shopId || undefined);
        return NextResponse.json({
          success: true,
          schedules: todaySchedules,
        });
    }
  } catch (error) {
    console.error('Schedule GET error:', error);
    return NextResponse.json(
      { success: false, error: 'スケジュールの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// POST: スケジュール作成・更新
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      girl_id,
      shop_id,
      date,
      status,
      instant_available,
      start_time,
      end_time,
      notes,
      updated_by,
    } = body;

    // バリデーション
    if (!girl_id || !shop_id || !date || !status) {
      return NextResponse.json(
        { success: false, error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // status の妥当性チェック
    const validStatuses = ['working', 'scheduled', 'off', 'unknown'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: '無効なステータスです' },
        { status: 400 }
      );
    }

    // スケジュールを保存
    const schedule = await upsertSchedule({
      girl_id,
      shop_id,
      date,
      status,
      instant_available: instant_available || false,
      start_time: start_time || null,
      end_time: end_time || null,
      notes: notes || null,
      updated_by: updated_by || null,
    });

    return NextResponse.json({
      success: true,
      message: 'スケジュールを更新しました',
      schedule,
    });
  } catch (error) {
    console.error('Schedule POST error:', error);
    return NextResponse.json(
      { success: false, error: 'スケジュールの更新に失敗しました' },
      { status: 500 }
    );
  }
}

// DELETE: スケジュール削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const girlId = searchParams.get('girl_id');
    const date = searchParams.get('date');

    if (!girlId || !date) {
      return NextResponse.json(
        { success: false, error: 'girl_id and date are required' },
        { status: 400 }
      );
    }

    await deleteSchedule(girlId, date);

    return NextResponse.json({
      success: true,
      message: 'スケジュールを削除しました',
    });
  } catch (error) {
    console.error('Schedule DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'スケジュールの削除に失敗しました' },
      { status: 500 }
    );
  }
}
