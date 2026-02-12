import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateProductDto, UpdateProductDto, PromoteToAdminDto, UpdateUserStatusDto, UpdateUserRoleDto } from './dto';
import { UserRole, OrderStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ====================
  // DASHBOARD STATS
  // ====================

  async getDashboardStats() {
    const [totalOrders, totalProducts, totalCustomers, totalRevenue, recentOrders] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.product.count(),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'DELIVERED' },
      }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      }),
    ]);

    const recentActivity = recentOrders.map((order) => ({
      description: `Order #${order.id.slice(0, 8)} placed by ${order.user.firstName} ${order.user.lastName}`,
      timestamp: order.createdAt,
    }));

    return {
      totalOrders,
      totalProducts,
      totalCustomers,
      totalRevenue: totalRevenue._sum?.totalAmount ? Number(totalRevenue._sum.totalAmount) : 0,
      recentActivity,
    };
  }

  // ====================
  // PRODUCT MANAGEMENT
  // ====================

  async getAllProducts(skip: number = 0, take: number = 10, search?: string) {
    const where: Record<string, any> = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
            { sku: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        include: { category: true, variants: true },
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

  async createProduct(createProductDto: CreateProductDto) {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check for duplicate SKU
    const existingSku = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });

    if (existingSku) {
      throw new BadRequestException('Product with this SKU already exists');
    }

    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        shortDescription: createProductDto.shortDescription,
        price: createProductDto.price,
        discountPrice: createProductDto.discountPrice,
        sku: createProductDto.sku,
        stock: createProductDto.stock,
        categoryId: createProductDto.categoryId,
        images: createProductDto.images || [],
        featured: createProductDto.featured || false,
        active: createProductDto.active !== false,
      },
      include: { category: true },
    });

    return product;
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // If SKU is being updated, check for duplicates
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });

      if (existingSku) {
        throw new BadRequestException('Product with this SKU already exists');
      }
    }

    // If category is being updated, verify it exists
    if (updateProductDto.categoryId && updateProductDto.categoryId !== product.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        ...(updateProductDto.name && { name: updateProductDto.name }),
        ...(updateProductDto.description && { description: updateProductDto.description }),
        ...(updateProductDto.shortDescription && { shortDescription: updateProductDto.shortDescription }),
        ...(updateProductDto.price && { price: updateProductDto.price }),
        ...(updateProductDto.discountPrice !== undefined && { discountPrice: updateProductDto.discountPrice }),
        ...(updateProductDto.sku && { sku: updateProductDto.sku }),
        ...(updateProductDto.stock !== undefined && { stock: updateProductDto.stock }),
        ...(updateProductDto.categoryId && { categoryId: updateProductDto.categoryId }),
        ...(updateProductDto.images && { images: updateProductDto.images }),
        ...(updateProductDto.featured !== undefined && { featured: updateProductDto.featured }),
        ...(updateProductDto.active !== undefined && { active: updateProductDto.active }),
      },
      include: { category: true },
    });

    return updatedProduct;
  }

  async deleteProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({
      where: { id: productId },
    });

    return { message: 'Product deleted successfully' };
  }

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, variants: true, reviews: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // ====================
  // USER MANAGEMENT
  // ====================

  async getAllUsers(skip: number = 0, take: number = 10, role?: string, search?: string) {
    const where: Record<string, any> = {};

    if (role && Object.values(UserRole).includes(role as UserRole)) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          isEmailVerified: true,
          createdAt: true,
          lastLoginAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        phoneNumber: true,
        createdAt: true,
        lastLoginAt: true,
        addresses: true,
        orders: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async promoteToAdmin(dto: PromoteToAdminDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException('User is already an admin');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: dto.userId },
      data: { role: UserRole.ADMIN },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return updatedUser;
  }

  async updateUserStatus(userId: string, dto: UpdateUserStatusDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        role: true,
      },
    });

    return updatedUser;
  }

  async updateUserRole(userId: string, dto: UpdateUserRoleDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!Object.values(UserRole).includes(dto.role as UserRole)) {
      throw new BadRequestException('Invalid role');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: dto.role as UserRole },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return updatedUser;
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete - mark as inactive instead of removing
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), isActive: false },
    });

    return { message: 'User deleted successfully' };
  }

  // ====================
  // ORDER MANAGEMENT
  // ====================

  async getAllOrders(skip: number = 0, take: number = 10, status?: string, search?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          items: { include: { product: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async getOrderById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const validStatuses = Object.values(OrderStatus);
    if (!validStatuses.includes(status as OrderStatus)) {
      throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });

    return updatedOrder;
  }

  // ====================
  // CATEGORY MANAGEMENT
  // ====================

  async getAllCategories() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });

    return categories;
  }

  async createCategory(name: string, description?: string, slug?: string) {
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-');

    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: finalSlug },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this slug already exists');
    }

    const category = await this.prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description,
      },
    });

    return category;
  }

  async updateCategory(categoryId: string, name?: string, description?: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id: categoryId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    return updatedCategory;
  }

  async deleteCategory(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.products > 0) {
      throw new BadRequestException(
        'Cannot delete category with existing products. Please delete or move products first.'
      );
    }

    await this.prisma.category.delete({
      where: { id: categoryId },
    });

    return { message: 'Category deleted successfully' };
  }

  // ====================
  // REPORTS & ANALYTICS
  // ====================

  async getSalesReport(startDate?: Date, endDate?: Date) {
    const where: Record<string, any> = { status: OrderStatus.DELIVERED };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: { items: true },
    });

    const totalSales = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalOrders = orders.length;

    return {
      totalSales,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
      orders,
    };
  }

  async getProductPerformance() {
    const products = await this.prisma.product.findMany({
      include: {
        _count: {
          select: { reviews: true, orderItems: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: { viewCount: 'desc' },
      take: 10,
    });

    return products.map((product) => ({
      ...product,
      totalSold: product._count.orderItems,
      totalReviews: product._count.reviews,
      averageRating: product.reviews.length > 0 
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length 
        : 0,
    }));
  }

  async getUserGrowth(months: number = 12) {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - months, 1);

    const users = await this.prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate },
      },
      _count: true,
    });

    return users;
  }
}
