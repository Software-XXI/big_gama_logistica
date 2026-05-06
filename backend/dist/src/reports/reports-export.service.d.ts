import { PrismaService } from "../prisma.service";
import ExcelJS from 'exceljs';
export declare class ReportsExportService {
    private prisma;
    constructor(prisma: PrismaService);
    exportToExcel(reportId?: string): Promise<ExcelJS.Workbook>;
    exportToJson(reportId?: string): Promise<({
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
