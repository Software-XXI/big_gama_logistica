import { PrismaService } from "../prisma.service";
import ExcelJS from 'exceljs';
export declare class ReportsExportService {
    private prisma;
    constructor(prisma: PrismaService);
    exportToExcel(reportId?: string): Promise<ExcelJS.Workbook>;
    exportToJson(reportId?: string): Promise<({
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
