import type { Response } from 'express';
import { ReportsExportService } from './reports-export.service';
export declare class ReportsExportController {
    private readonly exportService;
    constructor(exportService: ReportsExportService);
    private setExcelHeaders;
    exportExcel(res: Response): Promise<void>;
    exportReportExcel(id: string, res: Response): Promise<void>;
    exportJson(): Promise<({
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                category: string;
                sku: string;
                image: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            reportId: string;
            productId: string;
            quantity: number;
            inventoryItemId: string | null;
        })[];
        photos: {
            id: string;
            createdAt: Date;
            reportId: string;
            url: string;
            type: import(".prisma/client").$Enums.PhotoType;
        }[];
    } & {
        id: string;
        code: string;
        title: string | null;
        status: import(".prisma/client").$Enums.ReportStatus;
        operatorId: string;
        companionId: string | null;
        conductorId: string | null;
        bitacora: string | null;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
    }) | ({
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                category: string;
                sku: string;
                image: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            reportId: string;
            productId: string;
            quantity: number;
            inventoryItemId: string | null;
        })[];
        photos: {
            id: string;
            createdAt: Date;
            reportId: string;
            url: string;
            type: import(".prisma/client").$Enums.PhotoType;
        }[];
    } & {
        id: string;
        code: string;
        title: string | null;
        status: import(".prisma/client").$Enums.ReportStatus;
        operatorId: string;
        companionId: string | null;
        conductorId: string | null;
        bitacora: string | null;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
    })[] | null>;
    exportReportJson(id: string): Promise<({
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                category: string;
                sku: string;
                image: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            reportId: string;
            productId: string;
            quantity: number;
            inventoryItemId: string | null;
        })[];
        photos: {
            id: string;
            createdAt: Date;
            reportId: string;
            url: string;
            type: import(".prisma/client").$Enums.PhotoType;
        }[];
    } & {
        id: string;
        code: string;
        title: string | null;
        status: import(".prisma/client").$Enums.ReportStatus;
        operatorId: string;
        companionId: string | null;
        conductorId: string | null;
        bitacora: string | null;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
    }) | ({
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                category: string;
                sku: string;
                image: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            reportId: string;
            productId: string;
            quantity: number;
            inventoryItemId: string | null;
        })[];
        photos: {
            id: string;
            createdAt: Date;
            reportId: string;
            url: string;
            type: import(".prisma/client").$Enums.PhotoType;
        }[];
    } & {
        id: string;
        code: string;
        title: string | null;
        status: import(".prisma/client").$Enums.ReportStatus;
        operatorId: string;
        companionId: string | null;
        conductorId: string | null;
        bitacora: string | null;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
    })[] | null>;
}
