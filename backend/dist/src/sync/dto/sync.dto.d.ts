export declare class SyncReportDto {
    id: string;
    code: string;
    operatorId: string;
    conductorId?: string;
    bitacora?: string;
    latitude?: number;
    longitude?: number;
    items?: SyncItemDto[];
    photos?: SyncPhotoDto[];
}
export declare class SyncItemDto {
    productId: string;
    quantity: number;
}
export declare class SyncPhotoDto {
    id: string;
    url: string;
    type?: string;
}
export declare class SyncResponseDto {
    success: boolean;
    synced?: number;
    errors?: string[];
    message?: string;
}
