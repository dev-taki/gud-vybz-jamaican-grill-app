# vendocker-sidequest-template

This template inspired by side quest business. It has 2 redemption buttons.

A modern, scalable Next.js template with Redux Toolkit for state management, featuring authentication, subscription management, and a clean, maintainable architecture.

## 🚀 Features

- **Redux Toolkit** - Modern Redux with RTK Query for API calls
- **TypeScript** - Full type safety throughout the application
- **Authentication** - Complete auth flow with JWT tokens
- **Subscription Management** - Handle user subscriptions and plans
- **Persistent State** - Redux persistence for auth and user data
- **Error Handling** - Centralized error handling with retry logic
- **Loading States** - Consistent loading states across the app
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **PWA Ready** - Progressive Web App capabilities

## 📁 Project Structure

```
app/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Loader.tsx
│   │   └── ErrorDisplay.tsx
│   └── examples/         # Example components
│       └── AuthExample.tsx
├── config/
│   └── api.ts           # API configuration and endpoints
├── hooks/
│   └── useApiOperation.ts # Custom hooks for API operations
├── providers/
│   └── ReduxProvider.tsx # Redux provider with persistence
├── services/
│   ├── authService.ts    # Authentication service
│   ├── subscriptionService.ts
│   ├── plansService.ts
│   └── adminService.ts
├── store/
│   ├── hooks.ts         # Typed Redux hooks
│   ├── index.ts         # Store configuration
│   └── slices/
│       ├── authSlice.ts
│       ├── userSlice.ts
│       ├── navigationSlice.ts
│       ├── subscriptionSlice.ts
│       ├── plansSlice.ts
│       └── adminSlice.ts
├── types/
│   └── index.ts         # TypeScript type definitions
├── utils/
│   ├── api.ts           # Centralized API utilities
│   └── storage.ts       # Storage utilities (cookies, localStorage)
├── admin/               # Admin pages
├── client/              # Client pages
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   ├── plans/           # Plans page
│   ├── profile/         # Profile page
│   ├── redeem/          # Redeem page
│   └── home/            # Home page
├── layout.tsx           # Root layout
├── page.tsx             # Home page
└── providers.tsx        # Redux provider
```

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add required dependencies:**
   ```bash
   npm install redux-persist
   ```

3. **Configure environment variables:**
   Create a `.env.local` file with your API configuration:
   ```env
   NEXT_PUBLIC_API_BASE_URL=your_api_base_url
   NEXT_PUBLIC_BUSINESS_ID=your_business_id
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔧 Usage

### Redux Store Setup

The app uses Redux Toolkit with the following slices:

- **Auth Slice** - Handles authentication state, login/logout, user profile
- **User Slice** - Manages user preferences and stats
- **Navigation Slice** - Handles app navigation state
- **Subscription Slice** - Manages user subscriptions
- **Plans Slice** - Handles subscription plans

### Using Redux in Components

```tsx
import { useAuth, useAppDispatch } from '../store/hooks';
import { login } from '../store/slices/authSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading, error } = useAuth();

  const handleLogin = async (credentials) => {
    await dispatch(login(credentials));
  };

  return (
    // Your component JSX
  );
};
```

### API Calls

All API calls are handled through services that use the centralized API utility:

```tsx
import { AuthService } from '../services/authService';

// Login
const response = await AuthService.login({ email, password });

// Get user profile
const profile = await AuthService.getUserProfile();
```

### Error Handling

The app includes centralized error handling with retry logic and consistent error display:

```tsx
import { ErrorDisplay } from '../components/common/ErrorDisplay';

<ErrorDisplay 
  error={error} 
  onClear={() => dispatch(clearError())} 
/>
```

### Loading States

Use the centralized Loader component for consistent loading states:

```tsx
import { PageLoader, ButtonLoader, InlineLoader, CardLoader } from '../components/common/Loader';

// Full page loading
<PageLoader text="Loading..." />

// Button loading
<ButtonLoader size="sm" />

// Inline loading
<InlineLoader size="sm" />

// Card loading
<CardLoader text="Loading data..." />
```

## 🔐 Authentication Flow

1. **Login/Signup** - User credentials are sent to the API
2. **Token Storage** - JWT token is stored in cookies
3. **Profile Fetch** - User profile is fetched and stored in Redux
4. **Persistent Auth** - Auth state persists across page reloads
5. **Auto Logout** - Invalid tokens trigger automatic logout

## 📱 PWA Features

- Service Worker for offline functionality
- App manifest for install prompts
- Responsive design for mobile devices
- Fast loading with optimized assets

## 🎨 Styling

The app uses Tailwind CSS for styling with:
- Responsive design
- Dark/light theme support
- Consistent component styling
- Mobile-first approach

## 🚀 Deployment

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

## 📝 Customization

### Adding New API Endpoints

1. Add endpoint to `src/config/api.ts`
2. Create service method in appropriate service file
3. Add Redux slice action if needed
4. Use in components with Redux hooks

### Adding New Redux Slices

1. Create slice file in `src/store/slices/`
2. Add reducer to store configuration
3. Export typed hooks in `src/store/hooks.ts`
4. Use in components

### Styling Customization

- Modify Tailwind config for theme customization
- Add custom CSS in `src/app/globals.css`
- Use CSS variables for consistent theming

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
