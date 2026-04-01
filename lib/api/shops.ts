import { supabase, Shop } from '../supabase';

// すべての店舗を取得
export async function getAllShops(): Promise<Shop[]> {
  const { data, error } = await supabase
    .from('shops')
    .select('*');

  if (error) {
    console.error('Error fetching shops:', error);
    return [];
  }

  if (!data) return [];

  // カスタムソート: ZEROを最初に、その後は名前順
  return data.sort((a, b) => {
    // ZEROを最初に
    if (a.name === 'ZERO') return -1;
    if (b.name === 'ZERO') return 1;
    
    // それ以外は名前順（五十音順）
    return a.name.localeCompare(b.name, 'ja');
  });
}

// IDで店舗を取得
export async function getShopById(id: string): Promise<Shop | null> {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching shop:', error);
    return null;
  }

  return data;
}

// 店舗を作成
export async function createShop(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop | null> {
  const { data, error } = await supabase
    .from('shops')
    .insert([shop])
    .select()
    .single();

  if (error) {
    console.error('Error creating shop:', error);
    return null;
  }

  return data;
}

// 店舗を更新
export async function updateShop(id: string, updates: Partial<Shop>): Promise<Shop | null> {
  try {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('shops')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating shop:', error);
      throw new Error(`データの更新に失敗しました: ${error.message}`);
    }

    if (!data) {
      throw new Error('更新されたデータが返されませんでした');
    }

    return data;
  } catch (error) {
    console.error('Update shop error:', error);
    throw error;
  }
}

// 店舗を削除
export async function deleteShop(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('shops')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting shop:', error);
    return false;
  }

  return true;
}
