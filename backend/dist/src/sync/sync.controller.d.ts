import { SyncService } from './sync.service';
import { SyncReportDto } from './dto/sync.dto';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    sync(reports: SyncReportDto[]): Promise<import("./dto/sync.dto").SyncResponseDto>;
    getPendingCount(): Promise<number>;
}
