import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(_request: NextRequest) {
  try {
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Failed to fetch shops:', error);
      return NextResponse.json([], { status: 500 });
    }

    return NextResponse.json(shops || []);
  } catch (error: unknown) {
    console.error('API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
