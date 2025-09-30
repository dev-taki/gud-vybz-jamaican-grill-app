# Square API Integration Setup

এই document এ Square API integration এর জন্য প্রয়োজনীয় setup steps দেওয়া আছে।

## Environment Variables

আপনার `.env.local` file এ এই variables গুলো add করুন:

```bash
# Square API Configuration
# Get these from your Square Developer Dashboard: https://developer.squareup.com/

# Square Access Token (Server-side only - keep this secret!)
SQUARE_ACCESS_TOKEN=your_square_access_token_here

# Square Location ID (Get this from Square Locations API)
SQUARE_LOCATION_ID=your_square_location_id_here

# Square Application ID (Public - for frontend Square SDK)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your_square_application_id_here
```

## Square Developer Dashboard Setup

1. **Square Developer Account তৈরি করুন:**
   - যান: https://developer.squareup.com/
   - Account তৈরি করুন এবং login করুন

2. **Application তৈরি করুন:**
   - Dashboard এ "Create Application" click করুন
   - Application name দিন (যেমন: "Gud Vybz Jamaican Grill")
   - Application ID copy করুন (এটা `NEXT_PUBLIC_SQUARE_APPLICATION_ID` এ use করবেন)

3. **Access Token পাবেন:**
   - Application settings এ যান
   - "Sandbox" বা "Production" environment select করুন
   - Access Token copy করুন (এটা `SQUARE_ACCESS_TOKEN` এ use করবেন)

4. **Location ID পাবেন:**
   - Square Dashboard এ "Locations" section এ যান
   - আপনার location এর ID copy করুন
   - অথবা API call করে পাবেন: `GET /api/square/locations`

## API Endpoints

আপনার app এ এই Square API endpoints available:

### Menu Items
- `GET /api/square/menu` - সব menu items fetch করবে
- `GET /api/square/catalog?types=ITEM` - catalog items fetch করবে

### Orders
- `POST /api/square/orders` - নতুন order তৈরি করবে
- `GET /api/square/orders` - existing orders fetch করবে

### Payments
- `POST /api/square/payments` - payment process করবে
- `GET /api/square/payments` - payment history fetch করবে

### Locations
- `GET /api/square/locations` - সব locations fetch করবে

## Components

### SquarePaymentForm.tsx
- Existing subscription payment form
- Square Web Payments SDK ব্যবহার করে card tokenization

### MenuPurchaseForm.tsx
- Menu items display এবং purchase করার জন্য
- Cart functionality সহ
- Order creation এবং payment processing

## Usage Example

```tsx
import MenuPurchaseForm from './components/MenuPurchaseForm';

function MenuPage() {
  const handleOrderSuccess = (orderId: string, paymentId: string) => {
    console.log('Order successful:', { orderId, paymentId });
    // Handle success (redirect, show confirmation, etc.)
  };

  const handleOrderError = (error: string) => {
    console.error('Order failed:', error);
    // Handle error (show error message, etc.)
  };

  return (
    <MenuPurchaseForm
      onSuccess={handleOrderSuccess}
      onError={handleOrderError}
    />
  );
}
```

## Testing

1. **Sandbox Environment:**
   - প্রথমে Square Sandbox environment এ test করুন
   - Test card numbers ব্যবহার করুন:
     - Visa: 4111 1111 1111 1111
     - Mastercard: 5555 5555 5555 4444
     - CVV: 123
     - Expiry: Any future date

2. **Production Environment:**
   - সব কিছু test করার পর production এ move করুন
   - Real payment processing শুরু হবে

## Important Notes

- **Security:** `SQUARE_ACCESS_TOKEN` কখনো frontend এ expose করবেন না
- **Currency:** Square USD currency support করে, BDT support করে না
- **Location:** Bangladesh থেকে Square directly support করে না, কিন্তু international cards accept করতে পারে
- **Testing:** সব কিছু sandbox environment এ test করুন production এ যাওয়ার আগে

## Troubleshooting

### Common Issues:

1. **"Square access token not configured"**
   - Check your `.env.local` file
   - Make sure `SQUARE_ACCESS_TOKEN` is set correctly

2. **"Square configuration missing"**
   - Check `SQUARE_LOCATION_ID` is set
   - Verify your Square account has locations

3. **Menu items not loading**
   - Check your Square catalog has items
   - Verify API permissions in Square Dashboard

4. **Payment failures**
   - Check card details are correct
   - Verify Square SDK is loaded properly
   - Check browser console for errors

## Support

- Square Documentation: https://developer.squareup.com/docs
- Square Support: https://developer.squareup.com/docs/build-basics/using-rest-apis
- Square Community: https://developer.squareup.com/community
