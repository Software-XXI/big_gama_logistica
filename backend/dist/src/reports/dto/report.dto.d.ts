import { ReportStatus } from '@prisma/client';
export declare class CreateReportDto {
    code: string;
    operatorId: string;
    conductorId?: string;
    bitacora?: string;
    latitude?: number;
    longitude?: number;
    items?: ReportItemDto[];
    photos?: PhotoDto[];
}
export declare class ReportItemDto {
    productId: string;
    quantity: number;
}
export declare class PhotoDto {
    url: string;
    type?: 'EVIDENCE' | 'INVENTORY' | 'OTHER';
}
export declare class UpdateReportDto {
    operatorId?: string;
    status?: ReportStatus;
    bitacora?: string;
    latitude?: number;
    longitude?: number;
}
