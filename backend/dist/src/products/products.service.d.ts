import { PrismaService } from "../prisma.service";
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProductDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        category: string;
        sku: string;
        image: string | null;
    }>;
    createMany(products: CreateProductDto[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    findAll(activeOnly?: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        category: string;
        sku: string;
        image: string | null;
    }[]>;
    findOne(id: string): Promise<{
        items: {
            productId: string;
            quantity: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            condition: import(".prisma/client").$Enums.ItemCondition | null;
            notes: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        category: string;
        sku: string;
        image: string | null;
    }>;
    findBySku(sku: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        category: string;
        sku: string;
        image: string | null;
    } | null>;
    update(id: string, dto: UpdateProductDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        category: string;
        sku: string;
        image: string | null;
    }>;
    deactivate(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        category: string;
        sku: string;
        image: string | null;
    }>;
}
