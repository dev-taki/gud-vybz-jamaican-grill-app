import { NextRequest, NextResponse } from 'next/server';

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;
const SQUARE_VERSION = '2024-09-19';
const SQUARE_BASE_URL = 'https://connect.squareup.com/v2';

export async function POST(request: NextRequest) {
  try {
    if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
      return NextResponse.json(
        { success: false, error: 'Square configuration missing' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { source_id, amount, currency, order_id, customer_id, note } = body;

    if (!source_id || !amount) {
      return NextResponse.json(
        { success: false, error: 'Source ID and amount are required' },
        { status: 400 }
      );
    }

    // Generate unique idempotency key
    const idempotency_key = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const paymentData = {
      source_id,
      idempotency_key,
      amount_money: {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency || 'USD',
      },
      location_id: SQUARE_LOCATION_ID,
      order_id: order_id || undefined,
      customer_id: customer_id || undefined,
      note: note || undefined,
      autocomplete: true,
    };

    console.log('Creating Square payment:', { ...paymentData, source_id: '[REDACTED]' });

    const response = await fetch(`${SQUARE_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Square-Version': SQUARE_VERSION,
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Square API Error:', errorData);
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to create payment' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error creating Square payment:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!SQUARE_ACCESS_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Square access token not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('location_id') || SQUARE_LOCATION_ID;
    const limit = searchParams.get('limit') || '10';
    const beginTime = searchParams.get('begin_time');
    const endTime = searchParams.get('end_time');

    console.log('Fetching Square payments...', { locationId, limit });

    const url = new URL(`${SQUARE_BASE_URL}/payments`);
    if (locationId) url.searchParams.append('location_id', locationId);
    if (limit) url.searchParams.append('limit', limit);
    if (beginTime) url.searchParams.append('begin_time', beginTime);
    if (endTime) url.searchParams.append('end_time', endTime);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Square-Version': SQUARE_VERSION,
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Square API Error:', errorData);
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to fetch payments' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error fetching Square payments:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payments',
      },
      { status: 500 }
    );
  }
}
