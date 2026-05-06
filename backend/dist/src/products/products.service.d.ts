import { ProductRepository } from "../common/providers/repositories/product.repository";
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsService {
    private productsRepo;
    constructor(productsRepo: ProductRepository);
    create(dto: CreateProductDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        category: string;
        sku: string;
        image: string | null;
    }>;
    createMany(products: CreateProductDto[]): Promise<{
        count: number;
    }>;
    findAll(activeOnly?: boolean): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        category: string;
        sku: string;
        image: string | null;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        category: string;
        sku: string;
        image: string | null;
    } & {
        items: {
            id: string;
            quantity: number;
            location: string | null;
        }[];
    }>;
    findBySku(sku: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        category: string;
        sku: string;
        image: string | null;
    } | null>;
    update(id: string, dto: UpdateProductDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        category: string;
        sku: string;
        image: string | null;
    }>;
    deactivate(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        category: string;
        sku: string;
        image: string | null;
    }>;
}
