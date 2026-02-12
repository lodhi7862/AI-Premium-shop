# 🚀 AI Enhanced Premium Shopping Experience

> Next-generation ecommerce platform powered by AI technology

## 📋 Project Overview

AI Premium Shop is a production-ready ecommerce platform built with modern technology stack and designed for enterprise-level scalability. The application combines a stunning premium UI/UX with powerful AI-driven shopping features.

### Key Features

- 🤖 **AI-Powered Search** - Semantic search with intelligent product discovery
- 🎯 **Smart Recommendations** - Personalized product suggestions using collaborative filtering
- 💬 **Conversational Shopping** - Chat-based shopping assistant
- 🏪 **Full eCommerce** - Complete shopping experience with cart, checkout, orders
- 🎨 **Premium UI** - Modern, responsive design with dark mode support
- ⚡ **High Performance** - Optimized for speed and scalability
- 🔒 **Enterprise Security** - JWT auth, role-based access control, encrypted data

## 🏗️ Architecture

```
ai-premium-shop/
├── client/                 # Next.js Frontend (Port 3000)
├── server/                 # NestJS Backend API (Port 3001)
├── ai-service/             # FastAPI AI Microservice (Port 8000)
├── docker-compose.yml      # Database & Services Setup
└── README.md
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Animations**: Framer Motion
- **3D Support**: React Three Fiber
- **UI Components**: ShadCN UI

#### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (Passport.js)
- **API Docs**: Swagger/OpenAPI
- **Caching**: Redis

#### AI Service
- **Framework**: FastAPI (Python)
- **ML**: scikit-learn for recommendations & search
- **Features**: Product recommendations, semantic search, summaries, conversational AI

#### Supporting Services
- **Search Engine**: Meilisearch
- **Payment**: Stripe Integration
- **Image Storage**: Cloudinary CDN
- **Caching**: Redis

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- Docker & Docker Compose
- PostgreSQL 16+ (or use Docker)

### Installation

1. **Clone and Install Dependencies**

```bash
# Navigate to project
cd ai-premium-shop

# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install

# Install AI service dependencies
cd ../ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Start Database & Services**

```bash
# From project root, start Docker services (PostgreSQL, Redis, Meilisearch)
docker-compose up -d

# Verify services are running
docker-compose ps
```

3. **Setup Backend Database**

```bash
cd server

# Copy environment variables
cp .env.example .env

# Run Prisma migrations
npm run db:push

# Seed database with sample data
npm run db:seed
```

4. **Start Development Servers**

```bash
# Terminal 1 - Backend (from server/)
npm run start:dev
# Runs on http://localhost:3001
# API Docs: http://localhost:3001/api/docs

# Terminal 2 - Frontend (from client/)
npm run dev
# Runs on http://localhost:3000

# Terminal 3 - AI Service (from ai-service/)
source venv/bin/activate
python run.py
# Runs on http://localhost:8000/docs
```

## 📚 API Documentation

### Authentication Endpoints

**POST** `/api/auth/signup` - Register new user
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePassword123!"
}
```

**POST** `/api/auth/login` - Login user
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**POST** `/api/auth/refresh` - Refresh access token
```json
{
  "refreshToken": "your_refresh_token"
}
```

### Products Endpoints

**GET** `/api/products` - Get all products
- Query params: `skip=0&take=20&featured=true`

**GET** `/api/products/:id` - Get product details

**GET** `/api/products/search` - Search products
- Query params: `q=search_term&skip=0&take=20`

**GET** `/api/products/categories` - Get all categories

### Cart Endpoints (Protected)

**GET** `/api/cart` - Get user's cart

**POST** `/api/cart/add` - Add item to cart
```json
{
  "productId": "prod_123",
  "quantity": 1,
  "variantId": "var_123" // optional
}
```

**PUT** `/api/cart/:id` - Update cart item quantity
```json
{
  "quantity": 2
}
```

**DELETE** `/api/cart/:id` - Remove item from cart

### AI Service Endpoints

**POST** `/api/recommend` - Get product recommendations
```json
{
  "user_id": "user_123",
  "limit": 10,
  "min_rating": 4.0
}
```

**POST** `/api/search` - Smart semantic search
```json
{
  "query": "wireless headphones",
  "limit": 20
}
```

**POST** `/api/summary` - Generate product summary
```json
{
  "product_id": "prod_123",
  "product_data": { /* product details */ }
}
```

**POST** `/api/chat` - Conversational shopping
```json
{
  "user_id": "user_123",
  "message": "Show me premium headphones"
}
```

## 🗂️ Project Structure

### Frontend (`client/`)

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Page route groups
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── providers.tsx      # Global providers
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Button.tsx
│   ├── ProductCard.tsx
│   ├── HeroSection.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities & API client
│   ├── api-client.ts      # Axios instance
│   └── utils.ts           # Helper functions
├── store/                 # Zustand stores (state management)
│   └── index.ts           # Cart, Auth, UI stores
├── styles/                # Global styles
└── types/                 # TypeScript types
```

### Backend (`server/`)

```
src/
├── main.ts                # Application entry point
├── app.module.ts          # Root module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
├── config/                # Configuration
│   ├── database.module.ts # Database setup
│   └── prisma.service.ts  # Prisma client
├── modules/               # Feature modules
│   ├── auth/              # Authentication
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── strategies/    # JWT strategy
│   │   └── dto/           # Data transfer objects
│   ├── users/             # User management
│   ├── products/          # Product catalog
│   ├── cart/              # Shopping cart
│   └── orders/            # Order management
├── common/                # Shared utilities
│   ├── decorators/        # Custom decorators
│   ├── guards/            # Auth guards
│   ├── pipes/             # Validation pipes
│   └── filters/           # Exception filters
└── prisma/                # Database
    ├── schema.prisma      # Prisma schema
    └── seed.ts            # Database seed

```

### AI Service (`ai-service/`)

```
app/
├── main.py                # FastAPI app
├── routes/                # API endpoints
│   ├── health.py
│   ├── recommendations.py
│   ├── search.py
│   ├── summary.py
│   └── conversational.py
├── services/              # Business logic
│   └── ai_services.py     # AI algorithms
├── schemas/               # Pydantic models
│   └── schemas.py         # Request/response schemas
└── models/                # ML models & data models
```

## 🔐 Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-Based Access Control** - RBAC for different user types
- ✅ **Password Hashing** - bcrypt with salt
- ✅ **Helmet** - Security headers middleware
- ✅ **CORS** - Configured origins
- ✅ **Input Validation** - Class validators & Pydantic
- ✅ **SQL Injection Prevention** - Prisma parameterized queries
- ✅ **Rate Limiting** - Configurable per endpoint
- ✅ **Environment Variables** - Secrets management

## 📊 Database Schema

### Key Tables

- **Users** - User accounts with roles
- **Products** - Product catalog with variants
- **Categories** - Product categories with hierarchy
- **Orders** - Customer orders with items
- **CartItems** - Shopping cart items
- **Reviews** - Product reviews & ratings
- **Addresses** - Customer addresses
- **Payments** - Payment transactions

See [Prisma Schema](server/prisma/schema.prisma) for complete details.

## 🧪 Testing

```bash
# Backend unit tests
cd server && npm test

# Backend test coverage
npm run test:cov

# Backend e2e tests
npm run test:e2e

# Frontend component tests
cd ../client && npm test
```

## 📦 Deployment

### Docker Setup

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up

# Stop services
docker-compose down
```

### Production Build

```bash
# Frontend
cd client && npm run build && npm start

# Backend
cd server && npm run build && npm run start:prod

# AI Service
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🔄 Environment Variables

### Frontend (client/.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

### Backend (server/.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/aipremiumshop
JWT_SECRET=your_secret_key
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=sk_test_...
```

### AI Service (ai-service/.env)
```
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

## 🎯 Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   - Follow code style guidelines
   - Add tests for new features
   - Update documentation

3. **Test Locally**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   git push origin feature/new-feature
   ```

## 📝 Code Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier
- **Formatting**: Automatic via Prettier
- **Testing**: Minimum 80% coverage
- **Documentation**: JSDoc comments on public APIs
- **Git**: Conventional commits

## 🚀 Performance Optimizations

- 🖼️ **Image Optimization** - Next.js Image component with Cloudinary
- ⚡ **Code Splitting** - Dynamic imports for components
- 💾 **Caching** - Redis for queries, browser caching headers
- 🔍 **Database Indexing** - Optimized indexes on frequently queried fields
- 📦 **Bundle Size** - Tree-shaking, minification
- 🌐 **CDN** - Cloudinary for images, Edge caching

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Reset database
npm run db:push
npm run db:seed
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# For other ports, change in environment variables
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Contributing

We welcome contributions! Please read our contributing guidelines and code of conduct.

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Join our community discord

---

**Built with ❤️ by the AI Premium Shop Team**

Version 0.1.0 | Last Updated: February 2026
