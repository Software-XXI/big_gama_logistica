import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { ReportStatus } from '@prisma/client';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    create(dto: CreateReportDto): Promise<{
        items: {
            productId: string;
            quantity: number;
            id: string;
            createdAt: Date;
            inventoryItemId: string | null;
            reportId: string;
        }[];
        operator: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
        };
        conductor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
        } | null;
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
    }>;
    findAll(status?: ReportStatus): Promise<({
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
        operator: {
            id: string;
            name: string;
        };
        conductor: {
            id: string;
            name: string;
        } | null;
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
    })[]>;
    findByCode(code: string): Promise<({
        items: {
            productId: string;
            quantity: number;
            id: string;
            createdAt: Date;
            inventoryItemId: string | null;
            reportId: string;
        }[];
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
    }) | null>;
    findOne(id: string): Promise<{
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
        operator: {
            id: string;
            name: string;
            email: string;
        };
        conductor: {
            id: string;
            name: string;
            email: string;
        } | null;
        audits: ({
            user: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            timestamp: Date;
            action: string;
            entityType: string;
            entityId: string;
            details: import("@prisma/client/runtime/library").JsonValue | null;
            reportId: string | null;
            userId: string;
        })[];
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
    }>;
    update(id: string, dto: UpdateReportDto): Promise<{
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
    }>;
    addItems(id: string, items: {
        productId: string;
        quantity: number;
    }[]): Promise<{
        items: {
            productId: string;
            quantity: number;
            id: string;
            createdAt: Date;
            inventoryItemId: string | null;
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
    }>;
}
