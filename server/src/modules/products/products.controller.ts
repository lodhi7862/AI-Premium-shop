/**
 * Products Controller
 */

import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('api/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 20,
    @Query('featured') featured?: boolean
  ) {
    return this.productsService.getProducts(skip, take, featured);
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 20
  ) {
    return this.productsService.searchProducts(query, skip, take);
  }

  @Get('categories')
  async getCategories() {
    return this.productsService.getCategories();
  }

  @Get('category/:categoryId')
  async getByCategory(
    @Param('categoryId') categoryId: string,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 20
  ) {
    return this.productsService.getProductsByCategory(categoryId, skip, take);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }
}
