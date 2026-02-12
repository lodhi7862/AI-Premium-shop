# Frontend Setup Guide

## Overview

The frontend is built with Next.js 14, TypeScript, and modern React patterns. It provides a premium shopping experience with AI-powered features.

## Features

- ✅ App Router (Next.js 14)
- ✅ Server & Client Components
- ✅ Dark Mode Support
- ✅ Responsive Design
- ✅ Type-Safe Components
- ✅ State Management with Zustand
- ✅ Data Fetching with React Query
- ✅ Animation with Framer Motion
- ✅ 3D Elements with React Three Fiber

## Installation

```bash
cd client
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start
```

## Code Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and API client
├── store/                  # Zustand state stores
├── styles/                 # Global CSS
└── types/                  # TypeScript type definitions
```

## Key Components

### Header
Navigation bar with theme toggle, search, cart, and user menu.

### ProductCard
Reusable product display with image, price, rating, and add-to-cart button.

### HeroSection
Animated landing page hero with call-to-action buttons.

## State Management

Uses Zustand for global state:

```typescript
import { useCartStore, useAuthStore, useUIStore } from '@/store';

// Cart operations
const { addItem, removeItem } = useCartStore();

// Auth state
const { user, isAuthenticated } = useAuthStore();

// UI toggles
const { isDarkMode, toggleDarkMode } = useUIStore();
```

## API Integration

The API client handles:
- Automatic token management
- Request/response interceptors
- Token refresh logic
- Error handling

```typescript
import { apiClient } from '@/lib/api-client';

// Making requests
const response = await apiClient.get('/products');
const result = await apiClient.post('/auth/login', credentials);
```

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

## Styling

- **Tailwind CSS** for utility-first styling
- **Dark mode** support with next-themes
- **Custom configuration** in tailwind.config.ts

## Performance Tips

- Use `next/image` for images
- Code splitting with dynamic imports
- Server components for heavy data fetching
- React Query caching
- Image optimization with Cloudinary

## Testing

```bash
npm test
npm run test:watch
```

## Linting

```bash
npm run lint
npm run lint:fix
npm run format
```

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Styles not applying
- Clear `.next` folder
- Restart dev server

### Module errors
```bash
rm -rf node_modules .next
npm install && npm run dev
```

For more details, see the main [README.md](../README.md).
