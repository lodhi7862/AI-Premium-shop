/**
 * Products Service
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(skip: number = 0, take: number = 20, featured?: boolean) {
    const where: any = { active: true };
    if (featured !== undefined) {
      where.featured = featured;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        include: {
          category: true,
          variants: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        reviews: {
          include: { user: true },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Increment view count
    await this.prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async getProductsByCategory(categoryId: string, skip: number = 0, take: number = 20) {
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { categoryId, active: true },
        skip,
        take,
        include: { category: true, variants: true },
      }),
      this.prisma.product.count({ where: { categoryId, active: true } }),
    ]);

    return {
      data: products,
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async searchProducts(query: string, skip: number = 0, take: number = 20) {
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          active: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { sku: { contains: query, mode: 'insensitive' } },
          ],
        },
        skip,
        take,
        include: { category: true },
      }),
      this.prisma.product.count({
        where: {
          active: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { sku: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    return {
      data: products,
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async getCategories() {
    return this.prisma.category.findMany({
      where: { active: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }
}
