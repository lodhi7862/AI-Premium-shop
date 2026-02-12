/**
 * Cart Service
 */

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
        variant: true,
      },
    });

    let total = 0;
    items.forEach((item) => {
      const price = item.product.discountPrice || item.product.price;
      total += price.toNumber() * item.quantity;
    });

    return {
      items,
      total,
      itemCount: items.length,
    };
  }

  async addToCart(userId: string, productId: string, quantity: number, variantId?: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId,
          productId,
          variantId: (variantId as any) || null,
        },
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true, variant: true },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        productId,
        variantId,
        quantity,
      },
      include: { product: true, variant: true },
    });
  }

  async updateCartItem(userId: string, cartItemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true },
    });

    if (!item || item.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    if (quantity <= 0) {
      return this.prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true, variant: true },
    });
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!item || item.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return { message: 'Cart cleared' };
  }
}
