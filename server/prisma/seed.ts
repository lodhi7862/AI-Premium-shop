/**
 * Prisma Seed Script
 * Run with: npm run db:seed
 */

import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@aipremiumshop.com' },
    update: {},
    create: {
      email: 'admin@aipremiumshop.com',
      firstName: 'Admin',
      lastName: 'User',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing and accessories',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home' },
      update: {},
      create: {
        name: 'Home & Garden',
        slug: 'home',
        description: 'Home and garden products',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'PROD-001' },
      update: {},
      create: {
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        shortDescription: 'Wireless headphones with noise cancellation',
        sku: 'PROD-001',
        price: 199.99,
        discountPrice: 149.99,
        stock: 50,
        featured: true,
        rating: 4.5,
        reviewCount: 128,
        categoryId: categories[0].id,
        images: [],
      },
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-002' },
      update: {},
      create: {
        name: 'Premium Cotton T-Shirt',
        description: 'Comfortable premium cotton t-shirt',
        shortDescription: 'Premium quality cotton shirt',
        sku: 'PROD-002',
        price: 49.99,
        discountPrice: 39.99,
        stock: 100,
        featured: true,
        rating: 4.2,
        reviewCount: 45,
        categoryId: categories[1].id,
        images: [],
      },
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-003' },
      update: {},
      create: {
        name: 'Smart Home Security Camera',
        description: '4K Smart home security camera with AI detection',
        shortDescription: '4K Smart security camera',
        sku: 'PROD-003',
        price: 299.99,
        stock: 30,
        featured: true,
        rating: 4.8,
        reviewCount: 95,
        categoryId: categories[0].id,
        images: [],
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} sample products`);

  console.log('🎉 Database seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
