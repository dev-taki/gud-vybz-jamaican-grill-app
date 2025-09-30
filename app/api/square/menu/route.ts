import { NextRequest, NextResponse } from 'next/server';

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = '2024-09-19';
const SQUARE_BASE_URL = 'https://connect.squareup.com/v2';

// Helper function to get Square image URL
const getSquareImageUrl = (imageId: string): string => {
  return `https://connect.squareup.com/v2/catalog/object/${imageId}/image`;
};

export async function GET(request: NextRequest) {
  try {
    if (!SQUARE_ACCESS_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Square access token not configured' },
        { status: 500 }
      );
    }

    console.log('Fetching Square menu items...');

    const response = await fetch(`${SQUARE_BASE_URL}/catalog/list?types=ITEM`, {
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
        { success: false, error: errorData.message || 'Failed to fetch menu items' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Process menu items to make them more usable
    const menuItems = data.objects?.map((item: any) => {
      const itemData = item.item_data;
      const variations = itemData?.variations || [];
      
      return {
        id: item.id,
        name: itemData?.name || 'Unnamed Item',
        description: itemData?.description || '',
        category: itemData?.category_id || '',
        variations: variations.map((variation: any) => ({
          id: variation.id,
          name: variation.item_variation_data?.name || 'Default',
          price: variation.item_variation_data?.price_money?.amount || 0,
          currency: variation.item_variation_data?.price_money?.currency || 'USD',
          sku: variation.item_variation_data?.sku || '',
          available: !variation.is_deleted,
        })),
        available: !item.is_deleted,
        image_url: itemData?.image_ids?.[0] ? getSquareImageUrl(itemData.image_ids[0]) : null,
      };
    }) || [];

    return NextResponse.json({
      success: true,
      data: {
        menuItems,
        total: menuItems.length,
      },
    });
  } catch (error) {
    console.error('Error fetching Square menu:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch menu items',
      },
      { status: 500 }
    );
  }
}
