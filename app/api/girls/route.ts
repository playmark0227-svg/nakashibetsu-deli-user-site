import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId') || searchParams.get('shop_id');
    const q = searchParams.get('q');
    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');
    const minHeight = searchParams.get('minHeight');
    const maxHeight = searchParams.get('maxHeight');
    const isNew = searchParams.get('isNew');

    let query = supabase
      .from('girls')
      .select('*')
      .order('ranking', { ascending: true });

    if (shopId) {
      query = query.eq('shop_id', shopId);
    }
    if (q) {
      query = query.ilike('name', `%${q}%`);
    }
    if (minAge) {
      query = query.gte('age', parseInt(minAge));
    }
    if (maxAge) {
      query = query.lte('age', parseInt(maxAge));
    }
    if (minHeight) {
      query = query.gte('height', parseInt(minHeight));
    }
    if (maxHeight) {
      query = query.lte('height', parseInt(maxHeight));
    }
    if (isNew === 'true') {
      query = query.eq('is_new', true);
    }

    const { data: girls, error } = await query;

    if (error) {
      console.error('Failed to fetch girls:', error);
      return NextResponse.json([], { status: 500 });
    }

    return NextResponse.json(girls || []);
  } catch (error: unknown) {
    console.error('API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
