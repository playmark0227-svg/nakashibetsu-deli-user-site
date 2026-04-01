import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Failed to fetch shops:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch shops',
          details: error.message 
        },
        { status: 500 }
      );
    }

    console.log(`Found ${shops?.length || 0} shops`);

    return NextResponse.json({
      success: true,
      shops: shops || [],
      count: shops?.length || 0
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
