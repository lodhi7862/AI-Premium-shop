import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateProductDto, UpdateProductDto, UpdateUserStatusDto, UpdateUserRoleDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('api/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ====================
  // DASHBOARD
  // ====================

  @Get('stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ====================
  // PRODUCTS
  // ====================

  @Get('products')
  async getProducts(
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
    @Query('search') search?: string
  ) {
    return this.adminService.getAllProducts(skip, take, search);
  }

  @Post('products')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.adminService.createProduct(createProductDto);
  }

  @Get('products/:id')
  async getProductById(@Param('id') productId: string) {
    return this.adminService.getProductById(productId);
  }

  @Put('products/:id')
  async updateProduct(
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.adminService.updateProduct(productId, updateProductDto);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') productId: string) {
    return this.adminService.deleteProduct(productId);
  }

  // ====================
  // USERS & CO-ADMINS
  // ====================

  @Get('users')
  async getUsers(
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
    @Query('role') role?: string,
    @Query('search') search?: string
  ) {
    return this.adminService.getAllUsers(skip, take, role, search);
  }

  @Get('users/:id')
  async getUserById(@Param('id') userId: string) {
    return this.adminService.getUserById(userId);
  }

  @Post('users/:id/promote')
  async promoteToAdmin(@Param('id') userId: string) {
    return this.adminService.promoteToAdmin({ userId });
  }

  @Put('users/:id/status')
  async updateUserStatus(
    @Param('id') userId: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto
  ) {
    return this.adminService.updateUserStatus(userId, updateUserStatusDto);
  }

  @Put('users/:id/role')
  async updateUserRole(
    @Param('id') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ) {
    return this.adminService.updateUserRole(userId, updateUserRoleDto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  // ====================
  // ORDERS
  // ====================

  @Get('orders')
  async getOrders(
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    return this.adminService.getAllOrders(skip, take, status, search);
  }

  @Get('orders/:id')
  async getOrderById(@Param('id') orderId: string) {
    return this.adminService.getOrderById(orderId);
  }

  @Put('orders/:id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body('status') status: string
  ) {
    return this.adminService.updateOrderStatus(orderId, status);
  }

  // ====================
  // CATEGORIES
  // ====================

  @Get('categories')
  async getCategories() {
    return this.adminService.getAllCategories();
  }

  @Post('categories')
  async createCategory(
    @Body('name') name: string,
    @Body('description') description?: string,
    @Body('slug') slug?: string
  ) {
    return this.adminService.createCategory(name, description, slug);
  }

  @Put('categories/:id')
  async updateCategory(
    @Param('id') categoryId: string,
    @Body('name') name?: string,
    @Body('description') description?: string
  ) {
    return this.adminService.updateCategory(categoryId, name, description);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') categoryId: string) {
    return this.adminService.deleteCategory(categoryId);
  }

  // ====================
  // REPORTS & ANALYTICS
  // ====================

  @Get('reports/sales')
  async getSalesReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.adminService.getSalesReport(start, end);
  }

  @Get('reports/products')
  async getProductPerformance() {
    return this.adminService.getProductPerformance();
  }

  @Get('reports/user-growth')
  async getUserGrowth(@Query('months', new ParseIntPipe({ optional: true })) months: number = 12) {
    return this.adminService.getUserGrowth(months);
  }
}
