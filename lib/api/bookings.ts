import { supabase } from '../supabase';
import type { Booking } from '../types';

/**
 * 新規予約を作成
 */
export async function createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'status'>) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          ...bookingData,
          status: 'pending',
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create booking:', error);
    throw error;
  }
}

/**
 * 店舗IDで予約一覧を取得
 */
export async function getBookingsByShopId(shopId: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
}

/**
 * 予約IDで予約を取得
 */
export async function getBookingById(id: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return null;
  }
}

/**
 * 予約ステータスを更新
 */
export async function updateBookingStatus(id: string, status: 'confirmed' | 'cancelled') {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update booking:', error);
    throw error;
  }
}

/**
 * 全予約を取得（管理画面用）
 */
export async function getAllBookings() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        shops (
          name,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch all bookings:', error);
    return [];
  }
}

/**
 * 予約を削除
 */
export async function deleteBooking(id: string) {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete booking:', error);
    throw error;
  }
}
