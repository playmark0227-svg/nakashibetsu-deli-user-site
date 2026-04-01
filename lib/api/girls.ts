import { supabase, Girl } from '../supabase';

// すべての女の子を取得
export async function getAllGirls(): Promise<Girl[]> {
  const { data, error } = await supabase
    .from('girls')
    .select('*')
    .order('ranking', { ascending: true });

  if (error) {
    console.error('Error fetching girls:', error);
    return [];
  }

  return data || [];
}

// IDで女の子を取得
export async function getGirlById(id: string): Promise<Girl | null> {
  const { data, error } = await supabase
    .from('girls')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching girl:', error);
    return null;
  }

  // ビューカウントを増やす
  await incrementViewCount(id);

  return data;
}

// 店舗IDで女の子を取得
export async function getGirlsByShopId(shopId: string): Promise<Girl[]> {
  const { data, error } = await supabase
    .from('girls')
    .select('*')
    .eq('shop_id', shopId)
    .order('ranking', { ascending: true });

  if (error) {
    console.error('Error fetching girls by shop:', error);
    return [];
  }

  return data || [];
}

// 新人の女の子を取得
export async function getNewGirls(limit: number = 4): Promise<Girl[]> {
  const { data, error } = await supabase
    .from('girls')
    .select('*')
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching new girls:', error);
    return [];
  }

  return data || [];
}

// ランキング上位の女の子を取得
export async function getTopRankedGirls(limit: number = 10): Promise<Girl[]> {
  const { data, error } = await supabase
    .from('girls')
    .select('*')
    .order('view_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching top ranked girls:', error);
    return [];
  }

  return data || [];
}

// 女の子を作成
export async function createGirl(girl: Omit<Girl, 'id' | 'created_at' | 'updated_at'>): Promise<Girl | null> {
  try {
    const { data, error } = await supabase
      .from('girls')
      .insert([girl])
      .select()
      .single();

    if (error) {
      console.error('Error creating girl:', error);
      throw new Error(`データの作成に失敗しました: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Create girl error:', error);
    throw error;
  }
}

// 女の子を更新
export async function updateGirl(id: string, updates: Partial<Girl>): Promise<Girl | null> {
  try {
    // updated_atを追加
    const updateData = { 
      ...updates, 
      updated_at: new Date().toISOString() 
    };

    const { data, error } = await supabase
      .from('girls')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating girl:', error);
      throw new Error(`データの更新に失敗しました: ${error.message}`);
    }

    if (!data) {
      throw new Error('更新されたデータが返されませんでした');
    }

    return data;
  } catch (error) {
    console.error('Update girl error:', error);
    throw error;
  }
}

// 女の子を削除
export async function deleteGirl(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('girls')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting girl:', error);
    return false;
  }

  return true;
}

// ビューカウントを増やす
async function incrementViewCount(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_view_count', { girl_id: id });

  if (error) {
    console.error('Error incrementing view count:', error);
  }
}

// 検索・フィルター機能
export interface GirlFilters {
  shopId?: string;
  minAge?: number;
  maxAge?: number;
  minHeight?: number;
  maxHeight?: number;
  minBust?: number;
  maxBust?: number;
  isNew?: boolean;
  searchQuery?: string;
}

export async function searchGirls(filters: GirlFilters): Promise<Girl[]> {
  let query = supabase.from('girls').select('*');

  // 店舗でフィルター
  if (filters.shopId) {
    query = query.eq('shop_id', filters.shopId);
  }

  // 年齢でフィルター
  if (filters.minAge) {
    query = query.gte('age', filters.minAge);
  }
  if (filters.maxAge) {
    query = query.lte('age', filters.maxAge);
  }

  // 身長でフィルター
  if (filters.minHeight) {
    query = query.gte('height', filters.minHeight);
  }
  if (filters.maxHeight) {
    query = query.lte('height', filters.maxHeight);
  }

  // バストでフィルター
  if (filters.minBust) {
    query = query.gte('bust', filters.minBust);
  }
  if (filters.maxBust) {
    query = query.lte('bust', filters.maxBust);
  }

  // 新人でフィルター
  if (filters.isNew !== undefined) {
    query = query.eq('is_new', filters.isNew);
  }

  // 名前で検索
  if (filters.searchQuery) {
    query = query.ilike('name', `%${filters.searchQuery}%`);
  }

  query = query.order('ranking', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error searching girls:', error);
    return [];
  }

  return data || [];
}
