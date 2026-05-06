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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                category: string;
                sku: string;
                image: string | null;
            };
        } & {
            productId: string;
            quantity: number;
            id: string;
            createdAt: Date;
            inventoryItemId: string | null;
            reportId: string;
        })[];
        photos: {
            url: string;
            type: import(".prisma/client").$Enums.PhotoType;
            id: string;
            createdAt: Date;
            reportId: string;
        }[];
    } & {
        code: string;
        operatorId: string;
        conductorId: string | null;
        bitacora: string | null;
        latitude: number | null;
        longitude: number | null;
        status: import(".prisma/client").$Enums.ReportStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }) | ({
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                category: string;
                sku: string;
                image: string | null;
            };
        } & {
            productId: string;
            quantity: number;
            id: string;
            createdAt: Date;
            inventoryItemId: string | null;
            reportId: string;
        })[];
        photos: {
            url: string;
            type: import(".prisma/client").$Enums.PhotoType;
            id: string;
            createdAt: Date;
            reportId: string;
        }[];
    } & {
        code: string;
        operatorId: string;
        conductorId: string | null;
        bitacora: string | null;
        latitude: number | null;
        longitude: number | null;
        status: import(".prisma/client").$Enums.ReportStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[] | null>;
    exportReportJson(id: string): Promise<({
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                category: string;
                sku: string;
                image: string | null;
            };
        } & {
            productId: string;
            quantity: number;
            id: string;
            createdAt: Date;
            inventoryItemId: string | null;
            reportId: string;
        })[];
        photos: {
            url: string;
            type: import(".prisma/client").$Enums.PhotoType;
            id: string;
            createdAt: Date;
            reportId: string;
        }[];
    } & {
        code: string;
        operatorId: string;
        conductorId: string | null;
        bitacora: string | null;
        latitude: number | null;
        longitude: number | null;
        status: import(".prisma/client").$Enums.ReportStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }) | ({
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                category: string;
                sku: string;
                image: string | null;
            };
        } & {
            productId: string;
            quantity: number;
            id: string;
            createdAt: Date;
            inventoryItemId: string | null;
            reportId: string;
        })[];
        photos: {
            url: string;
            type: import(".prisma/client").$Enums.PhotoType;
            id: string;
            createdAt: Date;
            reportId: string;
        }[];
    } & {
        code: string;
        operatorId: string;
        conductorId: string | null;
        bitacora: string | null;
        latitude: number | null;
        longitude: number | null;
        status: import(".prisma/client").$Enums.ReportStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[] | null>;
}
