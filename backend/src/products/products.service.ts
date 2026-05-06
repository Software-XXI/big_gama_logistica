import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '@/common/providers/repositories/product.repository';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private productsRepo: ProductRepository) {}

  async create(dto: CreateProductDto) {
    return this.productsRepo.create(dto);
  }

  async createMany(products: CreateProductDto[]) {
    return this.productsRepo.createMany(products);
  }

  async findAll(activeOnly = true) {
    return this.productsRepo.findAll(activeOnly);
  }

  async findOne(id: string) {
    const product = await this.productsRepo.findOne(id);

    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }

    return product;
  }

  async findBySku(sku: string) {
    return this.productsRepo.findBySku(sku);
  }

  async update(id: string, dto: UpdateProductDto) {
    return this.productsRepo.update(id, dto);
  }

  async deactivate(id: string) {
    return this.productsRepo.deactivate(id);
  }
}