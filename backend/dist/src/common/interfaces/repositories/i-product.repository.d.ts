import { Product } from '@prisma/client';
export interface CreateProductDto {
    sku: string;
    name: string;
    description?: string;
    category: string;
    unit?: string;
    isActive?: boolean;
}
export interface UpdateProductDto {
    name?: string;
    description?: string;
    category?: string;
    unit?: string;
    isActive?: boolean;
}
export interface IProductRepository {
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
