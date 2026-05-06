import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { IProductRepository, CreateProductDto, UpdateProductDto } from '@/common/interfaces/repositories/i-product.repository';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: dto as Prisma.ProductCreateInput,
    });
  }

  async createMany(products: CreateProductDto[]): Promise<{ count: number }> {
    return this.prisma.product.createMany({
      data: products as Prisma.ProductCreateManyInput[],
      skipDuplicates: true,
    });
  }

  async findAll(activeOnly = true): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<Product & { items: { id: string; quantity: number; location: string | null }[] }> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { items: true },
    });
    return product as Product & { items: { id: string; quantity: number; location: string | null }[] };
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { sku } });
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data: dto as Prisma.ProductUpdateInput });
  }

  async deactivate(id: string): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data: { isActive: false } });
  }
}