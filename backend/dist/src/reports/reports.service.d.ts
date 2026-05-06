import type { CreateReportDto, UpdateReportDto } from "../common/interfaces/repositories/i-report.repository";
import { ReportRepository } from "../common/providers/repositories/report.repository";
import { UserRepository } from "../common/providers/repositories/user.repository";
import { ReportStatus } from '@prisma/client';
export interface UserInfo {
    id: string;
    role: string;
}
export declare class ReportsService {
    private reportsRepo;
    private userRepo;
    constructor(reportsRepo: ReportRepository, userRepo: UserRepository);
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
    update(id: string, dto: UpdateReportDto, userId: string, userRole: string): Promise<{
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
    delete(id: string, userId: string, userRole: string): Promise<{
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
    listOperators(): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
    }[]>;
    canView(userId: string, userRole: string, report: any): boolean;
    canEdit(userId: string, userRole: string, report: any): boolean;
    canDelete(userId: string, userRole: string, report: any): boolean;
}
