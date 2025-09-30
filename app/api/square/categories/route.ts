import { NextRequest, NextResponse } from 'next/server';

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = '2024-09-19';
const SQUARE_BASE_URL = 'https://connect.squareup.com/v2';

export async function GET(request: NextRequest) {
  try {
    if (!SQUARE_ACCESS_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Square Access Token is not configured.' },
        { status: 500 }
      );
    }

    // Fetch categories from Square Catalog
    const response = await fetch(`${SQUARE_BASE_URL}/catalog/list?types=CATEGORY`, {
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
        { success: false, error: errorData.message || 'Failed to fetch categories' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Process categories to make them more usable
    const categories = data.objects?.map((category: any) => {
      const categoryData = category.category_data;
      
      return {
        id: category.id,
        name: categoryData?.name || 'Unnamed Category',
        description: categoryData?.description || '',
        available: !category.is_deleted,
      };
    }) || [];

    return NextResponse.json({
      success: true,
      data: { categories, total: categories.length },
    });
  } catch (error: any) {
    console.error('Error fetching Square categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
