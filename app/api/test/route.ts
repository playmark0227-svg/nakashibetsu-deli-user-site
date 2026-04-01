import { NextResponse } from 'next/server';
import { getAllShops } from '@/lib/api/shops';
import { getAllGirls } from '@/lib/api/girls';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    const shops = await getAllShops();
    console.log('Shops:', shops);
    
    const girls = await getAllGirls();
    console.log('Girls:', girls);
    
    return NextResponse.json({
      success: true,
      shops: shops.length,
      girls: girls.length,
      shopsData: shops,
      girlsData: girls,
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
