import { supabase, PricePlan } from '../supabase';

// 店舗の料金プランを取得
export async function getPricePlansByShopId(shopId: string): Promise<PricePlan[]> {
  const { data, error } = await supabase
    .from('price_plans')
    .select('*')
    .eq('shop_id', shopId)
    .order('duration', { ascending: true });

  if (error) {
    console.error('Error fetching price plans:', error);
    return [];
  }

  return data || [];
}

// 料金プランを作成
export async function createPricePlan(
  pricePlan: Omit<PricePlan, 'id' | 'created_at'>
): Promise<PricePlan | null> {
  const { data, error } = await supabase
    .from('price_plans')
    .insert([pricePlan])
    .select()
    .single();

  if (error) {
    console.error('Error creating price plan:', error);
    return null;
  }

  return data;
}

// 料金プランを更新
export async function updatePricePlan(id: string, updates: Partial<PricePlan>): Promise<PricePlan | null> {
  const { data, error } = await supabase
    .from('price_plans')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating price plan:', error);
    return null;
  }

  return data;
}

// 料金プランを削除
export async function deletePricePlan(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('price_plans')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting price plan:', error);
    return false;
  }

  return true;
}
