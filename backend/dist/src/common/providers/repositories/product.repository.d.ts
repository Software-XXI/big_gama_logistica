import { PrismaService } from "../../../prisma.service";
import { IProductRepository, CreateProductDto, UpdateProductDto } from "../../interfaces/repositories/i-product.repository";
import { Product } from '@prisma/client';
export declare class ProductRepository implements IProductRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProductDto): Promise<Product>;
    createMany(products: CreateProductDto[]): Promise<{
        count: number;
    }>;
    findAll(activeOnly?: boolean): Promise<Product[]>;
    findOne(id: string): Promise<Product & {
        items: {
            id: string;
            quantity: number;
            location: string | null;
        }[];
    }>;
    findBySku(sku: string): Promise<Product | null>;
    update(id: string, dto: UpdateProductDto): Promise<Product>;
    deactivate(id: string): Promise<Product>;
}
