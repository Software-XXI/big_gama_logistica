import { ReportRepository } from "../common/providers/repositories/report.repository";
import type { CreateReportDto, UpdateReportDto } from "../common/interfaces/repositories/i-report.repository";
import { ReportStatus } from '@prisma/client';
export declare class ReportsService {
    private reportsRepo;
    constructor(reportsRepo: ReportRepository);
    create(dto: CreateReportDto, userId: string): Promise<{
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
    } & {
        items: import(".prisma/client").ReportItem[];
        photos: import(".prisma/client").Photo[];
        operator?: {
            id: string;
            name: string;
        };
        companion?: {
            id: string;
            name: string;
        } | null;
        conductor?: {
            id: string;
            name: string;
        } | null;
    }>;
    findAll(status?: ReportStatus): Promise<{
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
    }[]>;
    findOne(id: string): Promise<{
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
    } & {
        items: import(".prisma/client").ReportItem[];
        photos: import(".prisma/client").Photo[];
        operator?: {
            id: string;
            name: string;
            email: string;
        };
        companion?: {
            id: string;
            name: string;
            email: string;
        } | null;
        conductor?: {
            id: string;
            name: string;
            email: string;
        } | null;
        audits: import(".prisma/client").AuditLog[];
    }>;
    addItems(id: string, items: {
        productId: string;
        quantity: number;
    }[], userId: string): Promise<{
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
    } & {
        items: import(".prisma/client").ReportItem[];
    }>;
    findByCode(code: string): Promise<({
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
    } & {
        items: import(".prisma/client").ReportItem[];
        photos: import(".prisma/client").Photo[];
    }) | null>;
    findAllForUser(userId: string): Promise<{
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
    }[]>;
    listOperators(): Promise<{
        id: string;
        name: string;
        email: string;
    }[]>;
    canView(userId: string, role: string, report: {
        operatorId: string;
        companionId?: string | null;
        conductorId?: string | null;
    }): boolean;
    canEdit(userId: string, role: string, report: {
        operatorId: string;
        companionId?: string | null;
        conductorId?: string | null;
    }): boolean;
    delete(id: string, userId: string, role: string): Promise<void>;
    update(id: string, dto: UpdateReportDto, userId: string, role: string): Promise<{
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
    }>;
}
