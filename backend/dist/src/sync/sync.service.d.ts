import { ReportRepository } from "../common/providers/repositories/report.repository";
import { PhotoRepository } from "../common/providers/repositories/photo.repository";
import { SyncReportDto, SyncResponseDto } from './dto/sync.dto';
export declare class SyncService {
    private reportsRepo;
    private photosRepo;
    private readonly logger;
    constructor(reportsRepo: ReportRepository, photosRepo: PhotoRepository);
    syncReports(reports: SyncReportDto[]): Promise<SyncResponseDto>;
    getPendingCount(): Promise<number>;
}
