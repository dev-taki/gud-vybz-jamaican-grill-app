# Square Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Square API Configuration (Backend)
SQUARE_ACCESS_TOKEN=your_square_access_token_here
SQUARE_LOCATION_ID=your_square_location_id_here

# Square Frontend Configuration (Client-side)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your_square_application_id_here
NEXT_PUBLIC_SQUARE_LOCATION_ID=your_square_location_id_here

# Business Configuration
NEXT_PUBLIC_BUSINESS_ID=your_business_id_here
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com

# Cookie Configuration
NEXT_PUBLIC_COOKIE_AUTH_TOKEN=topped-off-co
NEXT_PUBLIC_COOKIE_USER_ROLE=topped-off-co_role

# PWA Configuration
NEXT_PUBLIC_PWA_NAME=Gud Vybz Jamaican Grill
NEXT_PUBLIC_PWA_SHORT_NAME=GudVybz
NEXT_PUBLIC_PWA_DESCRIPTION=Gud Vybz Jamaican Grill App
NEXT_PUBLIC_PWA_ICON_192=https://cdn.example.com/mobile-icon.png
NEXT_PUBLIC_PWA_ICON_512=https://cdn.example.com/mobile-icon.png

# Logo Configuration
NEXT_PUBLIC_LOGO_TYPE=text
NEXT_PUBLIC_LOGO_TEXT_MAIN=Gud
NEXT_PUBLIC_LOGO_TEXT_SUB=Vybz
NEXT_PUBLIC_LOGO_TAGLINE=jamaican grill
NEXT_PUBLIC_LOGO_IMAGE_PATH=https://cdn.example.com/logo.png

# Color Configuration
NEXT_PUBLIC_PRIMARY_COLOR=#3B3B3B
NEXT_PUBLIC_PRIMARY_HOVER=#333333
NEXT_PUBLIC_PRIMARY_DARK=#2D2D2D
NEXT_PUBLIC_PRIMARY_DISABLED=#d1d5db
NEXT_PUBLIC_SECONDARY_COLOR=#6B7280
NEXT_PUBLIC_SECONDARY_HOVER=#5B6366
NEXT_PUBLIC_SECONDARY_DARK=#4B5563
NEXT_PUBLIC_SECONDARY_DISABLED=#d1d5db
NEXT_PUBLIC_BACKGROUND_PRIMARY=#FFFFFF
NEXT_PUBLIC_BACKGROUND_SECONDARY=#F9FAFB
NEXT_PUBLIC_TEXT_PRIMARY=#000000
NEXT_PUBLIC_TEXT_PRIMARY_HOVER=#1F2937
NEXT_PUBLIC_TEXT_SECONDARY=#3B3B3B
NEXT_PUBLIC_TEXT_SECONDARY_HOVER=#111827
NEXT_PUBLIC_BORDER_PRIMARY=#e5e5e5
NEXT_PUBLIC_BORDER_SECONDARY=#d1d5db
NEXT_PUBLIC_BORDER_LIGHT=#f5f5f5
```

## How to Get Square Credentials

1. **Square Application ID**: 
   - Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
   - Create a new application or use existing one
   - Copy the Application ID

2. **Square Location ID**:
   - Go to [Square Dashboard](https://squareup.com/dashboard)
   - Go to Settings > Business > Locations
   - Copy the Location ID

3. **Square Access Token**:
   - In Square Developer Dashboard
   - Go to your application
   - Copy the Access Token (Sandbox or Production)

## Important Notes

- Replace `your_square_*` with actual values from your Square account
- The `NEXT_PUBLIC_` prefix makes variables available in the browser
- Restart the development server after adding environment variables
- Never commit `.env.local` to version control

## Testing

After setting up environment variables:

1. Restart the development server:
   ```bash
   npm run dev
   ```

2. Test the menu page:
   - Go to `http://localhost:3000/menu`
   - Try to add items to cart
   - Try to process an order

The "Square configuration missing" error should be resolved.
