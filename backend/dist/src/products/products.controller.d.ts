import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
    findAll(active?: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        category: string;
        sku: string;
        image: string | null;
    }[]>;
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
