import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { OrderRecord } from '@/types';

export async function POST(request: Request) {
  try {
    const order: OrderRecord = await request.json();

    // 1. Basic validation
    if (!order.orderNumber || !order.customerName || !order.customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer order fields' },
        { status: 400 }
      );
    }

    // 2. Vicinity security check: max 18km
    if (order.orderType === 'delivery' && order.distanceKm > 18.0) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Delivery distance exceeds our 18km kitchen freshness limit. Contact us on WhatsApp for special courier booking.',
        },
        { status: 400 }
      );
    }

    // 3. Insert into Supabase if configured
    if (supabase) {
      const { data, error } = await supabase.from('orders').insert([
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
          payment_status: order.paymentStatus || 'paid',
          paystack_reference: order.paystackReference,
          status: 'pending',
        },
      ]);

      if (error) {
        console.error('Supabase orders table error:', error);
      }
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({
      success: true,
      message: 'Order logged successfully (development mode)',
      orderNumber: order.orderNumber,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
