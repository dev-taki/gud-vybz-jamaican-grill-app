import { NextRequest, NextResponse } from 'next/server';

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = '2024-09-19';
const SQUARE_BASE_URL = 'https://connect.squareup.com/v2';

export async function GET(request: NextRequest) {
  try {
    if (!SQUARE_ACCESS_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Square access token not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const types = searchParams.get('types') || 'ITEM';

    console.log('Fetching Square catalog items...', { types });

    const response = await fetch(`${SQUARE_BASE_URL}/catalog/list?types=${types}`, {
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
        { success: false, error: errorData.message || 'Failed to fetch catalog items' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error fetching Square catalog:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch catalog items',
      },
      { status: 500 }
    );
  }
}
