/**
 * Cart Controller
 */

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('cart')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(user.id);
  }

  @Post('add')
  async addToCart(
    @CurrentUser() user: any,
    @Body() data: { productId: string; quantity: number; variantId?: string }
  ) {
    return this.cartService.addToCart(user.id, data.productId, data.quantity, data.variantId);
  }

  @Put(':id')
  async updateCart(
    @CurrentUser() user: any,
    @Param('id') cartItemId: string,
    @Body() data: { quantity: number }
  ) {
    return this.cartService.updateCartItem(user.id, cartItemId, data.quantity);
  }

  @Delete(':id')
  async removeFromCart(@CurrentUser() user: any, @Param('id') cartItemId: string) {
    return this.cartService.removeFromCart(user.id, cartItemId);
  }

  @Delete()
  async clearCart(@CurrentUser() user: any) {
    return this.cartService.clearCart(user.id);
  }
}
