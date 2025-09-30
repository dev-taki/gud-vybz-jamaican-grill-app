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
    const { line_items, customer_id, note } = body;

    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Line items are required' },
        { status: 400 }
      );
    }

    // Generate unique idempotency key
    const idempotency_key = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const orderData = {
      order: {
        location_id: SQUARE_LOCATION_ID,
        line_items: line_items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity.toString(),
          base_price_money: {
            amount: Math.round(item.price * 100), // Convert to cents
            currency: item.currency || 'USD',
          },
          catalog_object_id: item.catalog_object_id,
          variation_name: item.variation_name,
          note: item.note,
        })),
        metadata: {
          customer_id: customer_id || '',
          order_source: 'web_app',
        },
      },
      idempotency_key,
    };

    console.log('Creating Square order:', orderData);

    const response = await fetch(`${SQUARE_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Square-Version': SQUARE_VERSION,
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Square API Error:', errorData);
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to create order' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error creating Square order:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order',
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

    console.log('Fetching Square orders...', { locationId, limit });

    const searchBody = {
      query: {
        filter: {
          location_ids: locationId ? [locationId] : undefined,
        },
        sort: {
          sort_field: 'CREATED_AT',
          sort_order: 'DESC',
        },
      },
      limit: parseInt(limit),
    };

    const response = await fetch(`${SQUARE_BASE_URL}/orders/search`, {
      method: 'POST',
      headers: {
        'Square-Version': SQUARE_VERSION,
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Square API Error:', errorData);
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to fetch orders' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error fetching Square orders:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}
