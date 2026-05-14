import { PrismaService } from "../../../prisma.service";
import { IReportRepository, CreateReportDto, UpdateReportDto, SyncUpdateReportDto } from "../../interfaces/repositories/i-report.repository";
import { Report, ReportItem, Photo, AuditLog, ReportStatus } from '@prisma/client';
export declare class ReportRepository implements IReportRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateReportDto): Promise<Report & {
        items: ReportItem[];
        photos: Photo[];
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
    findAll(status?: ReportStatus): Promise<Report[]>;
    findAllForUser(userId: string): Promise<Report[]>;
    findOne(id: string): Promise<Report & {
        items: ReportItem[];
        photos: Photo[];
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
        audits: AuditLog[];
    }>;
    update(id: string, dto: UpdateReportDto): Promise<Report>;
    addItems(id: string, items: {
        productId: string;
        quantity: number;
    }[]): Promise<Report & {
        items: ReportItem[];
    }>;
    findByCode(code: string): Promise<Report & {
        items: ReportItem[];
        photos: Photo[];
    } | null>;
    createAuditLog(reportId: string, userId: string, action: string, details: unknown): Promise<AuditLog>;
    replaceItems(id: string, items: {
        productId: string;
        quantity: number;
    }[]): Promise<Report & {
        items: ReportItem[];
    }>;
    syncUpdate(code: string, dto: SyncUpdateReportDto): Promise<Report>;
    delete(id: string): Promise<void>;
    findAllOperators(): Promise<{
        id: string;
        name: string;
        email: string;
    }[]>;
}
