import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, expectedAmountKobo } = body;

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    // In local dev without live secret key, allow testing
    if (!secretKey) {
      return NextResponse.json({
        success: true,
        verified: true,
        mock: true,
        message: 'Verified locally (PAYSTACK_SECRET_KEY not set)',
      });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const data = await response.json();

    if (!data.status || data.data.status !== 'success') {
      return NextResponse.json(
        { success: false, error: 'Transaction verification failed at gateway' },
        { status: 400 }
      );
    }

    // Security check: verify amount match
    if (expectedAmountKobo && data.data.amount !== expectedAmountKobo) {
      return NextResponse.json(
        { success: false, error: 'Payment amount mismatch detected' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      data: data.data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
