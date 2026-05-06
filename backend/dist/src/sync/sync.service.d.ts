import { PrismaService } from "../prisma.service";
import { SyncReportDto, SyncResponseDto } from './dto/sync.dto';
export declare class SyncService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    syncReports(reports: SyncReportDto[]): Promise<SyncResponseDto>;
    getPendingCount(): Promise<number>;
}
