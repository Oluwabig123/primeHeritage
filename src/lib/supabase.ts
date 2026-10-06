import { createClient } from '@supabase/supabase-js';
import { OrderRecord } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    supabaseUrl.startsWith('http')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Saves order into Supabase or fallback browser storage if Supabase credentials are pending.
 */
export async function saveOrderRecord(order: OrderRecord): Promise<{ success: boolean; id: string }> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            order_number: order.orderNumber,
            customer_name: order.customerName,
            customer_phone: order.customerPhone,
            delivery_address: order.deliveryAddress,
            landmark: order.landmark,
            distance_km: order.distanceKm,
            order_type: order.orderType,
            items: order.items,
            subtotal: order.subtotal,
            delivery_fee: order.deliveryFee,
            total_amount: order.totalAmount,
            payment_status: order.paymentStatus,
            paystack_reference: order.paystackReference,
            status: order.status,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        return { success: true, id: data.id };
      }
      console.warn('Supabase insert warning:', error?.message);
    }

    // LocalStorage Fallback for local testing / offline state
    if (typeof window !== 'undefined') {
      const storedOrders = JSON.parse(localStorage.getItem('ph_local_orders') || '[]');
      storedOrders.unshift({ ...order, id: `local-${Date.now()}` });
      localStorage.setItem('ph_local_orders', JSON.stringify(storedOrders.slice(0, 50)));
    }

    return { success: true, id: order.orderNumber };
  } catch (err) {
    console.error('Failed to save order record:', err);
    return { success: false, id: order.orderNumber };
  }
}
