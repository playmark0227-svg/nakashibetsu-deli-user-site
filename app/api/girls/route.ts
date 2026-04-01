import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shop_id');

    let query = supabase
      .from('girls')
      .select('*')
      .order('ranking', { ascending: true });

    // shop_id が指定されていればフィルター
    if (shopId) {
      query = query.eq('shop_id', shopId);
    }

    const { data: girls, error } = await query;

    if (error) {
      console.error('Failed to fetch girls:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch girls',
          details: error.message,
          shop_id: shopId || 'all'
        },
        { status: 500 }
      );
    }

    console.log(`Found ${girls?.length || 0} girls${shopId ? ` for shop_id: ${shopId}` : ' (all shops)'}`);

    return NextResponse.json({
      success: true,
      girls: girls || [],
      count: girls?.length || 0
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
