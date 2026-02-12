# Backend API Documentation

## Overview

The backend is built with NestJS, a progressive TypeScript framework for building scalable server-side applications. It provides a REST API with JWT authentication, role-based access control, and complete ecommerce functionality.

## Getting Started

### Installation

```bash
cd server
npm install
```

### Database Setup

```bash
# Set up environment variables
cp .env.example .env

# Run Prisma migrations
npm run db:push

# Seed database with sample data
npm run db:seed

# View database (optional)
npm run db:studio
```

### Development

```bash
npm run start:dev
```

Server runs on `http://localhost:3001`
API Documentation: `http://localhost:3001/api/docs`

### Production

```bash
npm run build
npm run start:prod
```

## Project Structure

```
src/
├── main.ts                      # Application entry point
├── app.module.ts                # Root module
├── app.controller.ts            # Root controller
├── config/                      # Configuration
│   ├── database.module.ts       # Database module
│   └── prisma.service.ts        # Prisma client service
├── modules/                     # Feature modules
│   ├── auth/                    # Authentication
│   ├── users/                   # User management
│   ├── products/                # Product catalog
│   ├── cart/                    # Shopping cart
│   └── orders/                  # Order management
├── common/                      # Shared utilities
│   ├── decorators/              # Custom decorators
│   ├── guards/                  # Authentication guards
│   ├── pipes/                   # Validation pipes
│   └── filters/                 # Exception filters
└── prisma/                      # Database
    └── schema.prisma            # Database schema

```

## API Modules

### Auth Module (`/api/auth`)

Handles user authentication with JWT tokens.

**POST** `/signup` - Register new user
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePassword123!"
}
```

**POST** `/login` - User login
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**POST** `/refresh` - Refresh access token
```json
{
  "refreshToken": "eyJhbGci..."
}
```

### Products Module (`/api/products`)

Manages product catalog, search, and categories.

**GET** `/` - Get all products
- Query: `skip=0&take=20&featured=true`

**GET** `/:id` - Get product details

**GET** `/search` - Search products
- Query: `q=search_term&skip=0&take=20`

**GET** `/categories` - Get all categories

**GET** `/category/:categoryId` - Get products by category

### Cart Module (`/api/cart`) - Protected

Shopping cart operations for authenticated users.

**GET** `/` - Get current user's cart

**POST** `/add` - Add item to cart
```json
{
  "productId": "prod_123",
  "quantity": 1,
  "variantId": "var_123"
}
```

**PUT** `/:id` - Update cart item
```json
{
  "quantity": 2
}
```

**DELETE** `/:id` - Remove item from cart

**DELETE** `/` - Clear entire cart

### Users Module (`/api/users`) - Protected

User profile and address management.

**GET** `/profile` - Get current user profile

**GET** `/addresses` - Get user's addresses

## Authentication

### JWT Token Structure

Tokens contain:
- `sub` - User ID
- `email` - User email
- `iat` - Issued at
- `exp` - Expiration time

### Authorization Header

```
Authorization: Bearer eyJhbGci...
```

### Token Expiration

- Access Token: 15 minutes (configurable)
- Refresh Token: 7 days (configurable)

## Database Schema

### User Model
```sql
- id: String (UUID)
- email: String (unique)
- firstName: String
- lastName: String
- password: String (hashed)
- role: UserRole (CUSTOMER, VENDOR, ADMIN)
- isActive: Boolean
- isEmailVerified: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

### Product Model
```sql
- id: String (UUID)
- name: String
- description: Text
- price: Decimal
- discountPrice: Decimal (optional)
- sku: String (unique)
- stock: Int
- featured: Boolean
- rating: Decimal
- reviewCount: Int
- categoryId: String (FK)
```

### Order Model
```sql
- id: String (UUID)
- userId: String (FK)
- orderNumber: String (unique)
- status: OrderStatus
- paymentStatus: PaymentStatus
- totalAmount: Decimal
- subtotal: Decimal
- tax: Decimal
- shippingCost: Decimal
- createdAt: DateTime
- updatedAt: DateTime
```

See [schema.prisma](./prisma/schema.prisma) for complete schema.

## Error Handling

### Standard Error Response

```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "error": "Validation failed"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Validation

Input validation uses `class-validator` decorators:

```typescript
class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(2)
  firstName: string;
}
```

## Testing

```bash
# Unit tests
npm test

# Watch mode
npm test:watch

# Coverage
npm test:cov

# E2E tests
npm run test:e2e
```

## Configuration

### Environment Variables

```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=your_secret_key
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRATION=7d
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=sk_test_...
```

## Performance

- Database indexing on frequently queried fields
- Redis caching for product queries
- Pagination for large result sets
- Query optimization with Prisma

## Security

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Helmet.js for security headers
- CORS configuration

## Debugging

### Enable Debug Logging

```bash
DEBUG=* npm run start:dev
```

### Database Inspection

```bash
npm run db:studio
```

Opens Prisma Studio for database inspection.

## Troubleshooting

### Database Connection Error

```bash
# Check DATABASE_URL in .env
# Ensure PostgreSQL is running
docker-compose up postgres -d
```

### Port Already in Use

```bash
# Change port in .env
PORT=3002
```

### Migration Issues

```bash
# Reset database (careful in production!)
npx prisma migrate reset
npm run db:seed
```

## Deployment

See main [README.md](../README.md#deployment) for deployment instructions.

---

For more information, see:
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
