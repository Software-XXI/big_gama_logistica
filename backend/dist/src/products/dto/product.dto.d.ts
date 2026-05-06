export declare class CreateProductDto {
    name: string;
    category: string;
    sku: string;
    image?: string;
}
export declare class UpdateProductDto {
    name?: string;
    category?: string;
    sku?: string;
    image?: string;
    isActive?: boolean;
}
