import { NextRequest, NextResponse } from 'next/server';

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = '2024-09-19';
const SQUARE_BASE_URL = 'https://connect.squareup.com/v2';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Square API connection...');
    console.log('Access Token:', SQUARE_ACCESS_TOKEN ? 'Present' : 'Missing');
    
    if (!SQUARE_ACCESS_TOKEN) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Square access token not configured',
          debug: {
            hasToken: !!SQUARE_ACCESS_TOKEN,
            tokenLength: SQUARE_ACCESS_TOKEN?.length || 0
          }
        },
        { status: 500 }
      );
    }

    // Test with a simple locations API call
    console.log('Making Square API call...');
    const response = await fetch(`${SQUARE_BASE_URL}/locations`, {
      method: 'GET',
      headers: {
        'Square-Version': SQUARE_VERSION,
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Square API Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Square API Error:', errorData);
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.message || 'Square API call failed',
          status: response.status,
          debug: {
            hasToken: !!SQUARE_ACCESS_TOKEN,
            tokenLength: SQUARE_ACCESS_TOKEN?.length || 0,
            responseStatus: response.status
          }
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Square API Success:', data);
    
    return NextResponse.json({
      success: true,
      message: 'Square API connection successful',
      data: {
        locations: data.locations?.length || 0,
        firstLocation: data.locations?.[0]?.name || 'No locations found'
      },
      debug: {
        hasToken: !!SQUARE_ACCESS_TOKEN,
        tokenLength: SQUARE_ACCESS_TOKEN?.length || 0,
        responseStatus: response.status
      }
    });
  } catch (error) {
    console.error('Error testing Square API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          hasToken: !!SQUARE_ACCESS_TOKEN,
          tokenLength: SQUARE_ACCESS_TOKEN?.length || 0,
          errorType: error instanceof Error ? error.constructor.name : typeof error
        }
      },
      { status: 500 }
    );
  }
}
