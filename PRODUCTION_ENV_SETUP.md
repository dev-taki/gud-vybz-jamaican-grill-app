# Production Environment Variables Setup

## 🚨 **CRITICAL: Square Configuration Missing in Production**

The error `Square configuration missing` indicates that environment variables are not properly configured in production.

## 🔧 **Required Environment Variables for Production**

### **1. Square API Configuration (Backend)**
```bash
SQUARE_ACCESS_TOKEN=your_square_access_token_here
SQUARE_LOCATION_ID=your_square_location_id_here
```

### **2. Square Frontend Configuration (Client-side)**
```bash
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your_square_application_id_here
NEXT_PUBLIC_SQUARE_LOCATION_ID=your_square_location_id_here
```

### **3. Business Configuration**
```bash
NEXT_PUBLIC_BUSINESS_ID=your_business_id_here
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

### **4. Cookie Configuration**
```bash
NEXT_PUBLIC_COOKIE_AUTH_TOKEN=gud-vybz-jamaican-grill
NEXT_PUBLIC_COOKIE_USER_ROLE=gud-vybz-jamaican-grill_role
```

### **5. PWA Configuration**
```bash
NEXT_PUBLIC_PWA_NAME=Gud Vybz Jamaican Grill
NEXT_PUBLIC_PWA_SHORT_NAME=GudVybzJamaicanGrill
NEXT_PUBLIC_PWA_DESCRIPTION=Gud Vybz Jamaican Grill App
NEXT_PUBLIC_PWA_ICON_192=https://your-domain.com/icon-192.png
NEXT_PUBLIC_PWA_ICON_512=https://your-domain.com/icon-512.png
```

### **6. Logo Configuration**
```bash
NEXT_PUBLIC_LOGO_TYPE=image
NEXT_PUBLIC_LOGO_IMAGE_PATH=https://your-domain.com/logo.png
NEXT_PUBLIC_LOGO_TAGLINE=Gud Vybz Jamaican Grill
```

### **7. Color Configuration**
```bash
NEXT_PUBLIC_PRIMARY_COLOR=#e23232
NEXT_PUBLIC_PRIMARY_HOVER=#cb2d2d
NEXT_PUBLIC_PRIMARY_DARK=#b42828
NEXT_PUBLIC_PRIMARY_DISABLED=#d1d5db
NEXT_PUBLIC_SECONDARY_COLOR=#1d56c9
NEXT_PUBLIC_SECONDARY_HOVER=#1a4db4
NEXT_PUBLIC_SECONDARY_DARK=#1744a0
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

## 🚀 **Deployment Platform Setup**

### **Vercel Deployment:**
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all the variables above
5. Redeploy your application

### **Netlify Deployment:**
1. Go to your Netlify dashboard
2. Select your site
3. Go to Site settings → Environment variables
4. Add all the variables above
5. Redeploy your site

### **Other Platforms:**
- **Railway:** Add environment variables in project settings
- **Render:** Add environment variables in service settings
- **DigitalOcean App Platform:** Add environment variables in app settings

## 🔍 **How to Get Square Credentials**

### **1. Square Application ID:**
1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Create a new application or use existing one
3. Copy the Application ID

### **2. Square Location ID:**
1. Go to [Square Dashboard](https://squareup.com/dashboard)
2. Go to Settings → Business → Locations
3. Copy the Location ID

### **3. Square Access Token:**
1. In Square Developer Dashboard
2. Go to your application
3. Copy the Access Token (Sandbox or Production)

## ⚠️ **Important Notes**

1. **NEXT_PUBLIC_ prefix** is required for client-side variables
2. **Restart/Redeploy** after adding environment variables
3. **Never commit** environment variables to version control
4. **Use production credentials** for production deployment
5. **Test locally** with production credentials before deploying

## 🧪 **Testing Environment Variables**

### **Local Testing:**
```bash
# Check if variables are loaded
echo $NEXT_PUBLIC_SQUARE_APPLICATION_ID
echo $NEXT_PUBLIC_SQUARE_LOCATION_ID
```

### **Production Testing:**
1. Open browser console
2. Check for Square configuration logs
3. Verify Square SDK loads properly
4. Test payment form functionality

## 🚨 **Current Issue**

The production deployment at `https://gudvybz.subport.us` is missing Square environment variables, causing:
- `Square configuration missing` error
- Payment form not working
- Order processing failing

**Fix:** Add the required environment variables to your production deployment platform and redeploy.

## 📞 **Support**

If you need help setting up environment variables for your specific deployment platform, please provide:
1. Your deployment platform (Vercel, Netlify, etc.)
2. Your Square credentials
3. Your business configuration details
