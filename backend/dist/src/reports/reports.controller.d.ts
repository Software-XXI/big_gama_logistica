import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    create(dto: CreateReportDto, req: any): Promise<{
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
    findAll(req: any): Promise<{
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
    findByCode(code: string, req: any): Promise<({
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
    findOne(id: string, req: any): Promise<{
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
    update(id: string, dto: UpdateReportDto, req: any): Promise<{
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
    delete(id: string, req: any): Promise<void>;
    addItems(id: string, items: {
        productId: string;
        quantity: number;
    }[], req: any): Promise<{
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
}
