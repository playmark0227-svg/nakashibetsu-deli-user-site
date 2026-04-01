import { supabase } from '../supabase';
import type { GirlSchedule } from '../types';

/**
 * 本日の出勤スケジュールを取得
 */
export async function getTodaySchedules(shopId?: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let query = supabase
      .from('girl_schedules')
      .select(`
        *,
        girls (
          id,
          name,
          age,
          height,
          bust,
          waist,
          hip,
          thumbnail_url,
          shop_id
        )
      `)
      .eq('date', today);
    
    if (shopId) {
      query = query.eq('shop_id', shopId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      // テーブルが存在しない場合は静かに空配列を返す
      if (error.code === 'PGRST200' || error.message?.includes('girl_schedules')) {
        return [];
      }
      console.error('Error fetching today schedules:', error);
      throw error;
    }
    
    return data || [];
  } catch (error: any) {
    // テーブルが存在しない場合のエラーは無視
    if (error?.code === 'PGRST200' || error?.message?.includes('girl_schedules')) {
      return [];
    }
    console.error('Failed to fetch today schedules:', error);
    return [];
  }
}

/**
 * 特定のキャストの本日のスケジュールを取得
 */
export async function getGirlTodaySchedule(girlId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('girl_schedules')
      .select('*')
      .eq('girl_id', girlId)
      .eq('date', today)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
      // テーブルが存在しない場合は静かにnullを返す
      if (error.code === 'PGRST200' || error.message?.includes('girl_schedules')) {
        return null;
      }
      console.error('Error fetching girl schedule:', error);
      throw error;
    }
    
    return data || null;
  } catch (error: any) {
    // テーブルが存在しない場合のエラーは無視
    if (error?.code === 'PGRST200' || error?.message?.includes('girl_schedules')) {
      return null;
    }
    console.error('Failed to fetch girl schedule:', error);
    return null;
  }
}

/**
 * 出勤中のキャストを取得
 */
export async function getWorkingGirls(shopId?: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let query = supabase
      .from('girl_schedules')
      .select(`
        *,
        girls (
          id,
          name,
          age,
          height,
          bust,
          waist,
          hip,
          thumbnail_url,
          shop_id,
          shops (
            name
          )
        )
      `)
      .eq('date', today)
      .eq('status', 'working')
      .order('instant_available', { ascending: false })
      .order('start_time', { ascending: true });
    
    if (shopId) {
      query = query.eq('shop_id', shopId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      // テーブルが存在しない場合は静かに空配列を返す
      if (error.code === 'PGRST200' || error.message?.includes('girl_schedules')) {
        return [];
      }
      console.error('Error fetching working girls:', error);
      throw error;
    }
    
    return data || [];
  } catch (error: any) {
    // テーブルが存在しない場合のエラーは無視
    if (error?.code === 'PGRST200' || error?.message?.includes('girl_schedules')) {
      return [];
    }
    console.error('Failed to fetch working girls:', error);
    return [];
  }
}

/**
 * ソク姫対応可能なキャストを取得
 */
export async function getInstantAvailableGirls(shopId?: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let query = supabase
      .from('girl_schedules')
      .select(`
        *,
        girls (
          id,
          name,
          age,
          height,
          bust,
          waist,
          hip,
          thumbnail_url,
          shop_id,
          shops (
            name,
            phone
          )
        )
      `)
      .eq('date', today)
      .eq('status', 'working')
      .eq('instant_available', true)
      .order('updated_at', { ascending: false });
    
    if (shopId) {
      query = query.eq('shop_id', shopId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      // テーブルが存在しない場合は静かに空配列を返す
      if (error.code === 'PGRST200' || error.message?.includes('girl_schedules')) {
        console.log('girl_schedules table not found - returning empty array');
        return [];
      }
      console.error('Error fetching instant available girls:', error);
      throw error;
    }
    
    return data || [];
  } catch (error: any) {
    // テーブルが存在しない場合のエラーは無視
    if (error?.code === 'PGRST200' || error?.message?.includes('girl_schedules')) {
      return [];
    }
    console.error('Failed to fetch instant available girls:', error);
    return [];
  }
}

/**
 * スケジュールを作成または更新
 */
export async function upsertSchedule(schedule: Omit<GirlSchedule, 'id' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('girl_schedules')
      .upsert(
        {
          ...schedule,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'girl_id,date',
        }
      )
      .select()
      .single();
    
    if (error) {
      console.error('Error upserting schedule:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to upsert schedule:', error);
    throw error;
  }
}

/**
 * スケジュールを削除
 */
export async function deleteSchedule(girlId: string, date: string) {
  try {
    const { error } = await supabase
      .from('girl_schedules')
      .delete()
      .eq('girl_id', girlId)
      .eq('date', date);
    
    if (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete schedule:', error);
    throw error;
  }
}

/**
 * 複数キャストのスケジュールを一括取得
 */
export async function getSchedulesForGirls(girlIds: string[], date?: string) {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('girl_schedules')
      .select('*')
      .in('girl_id', girlIds)
      .eq('date', targetDate);
    
    if (error) {
      console.error('Error fetching schedules for girls:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch schedules for girls:', error);
    return [];
  }
}
