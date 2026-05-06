import { Injectable, Logger } from '@nestjs/common';
import { ReportRepository } from '@/common/providers/repositories/report.repository';
import type { CreateReportDto, SyncUpdateReportDto } from '@/common/interfaces/repositories/i-report.repository';
import { PhotoRepository } from '@/common/providers/repositories/photo.repository';
import type { PhotoType } from '@prisma/client';
import { SyncReportDto, SyncResponseDto } from './dto/sync.dto';

const DEFAULT_PHOTO_TYPE: PhotoType = 'EVIDENCE';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private reportsRepo: ReportRepository,
    private photosRepo: PhotoRepository,
  ) {}

  async syncReports(reports: SyncReportDto[]): Promise<SyncResponseDto> {
    const errors: string[] = [];
    let synced = 0;

    for (const report of reports) {
      try {
        const existing = await this.reportsRepo.findByCode(report.code);

        if (existing) {
          const updateDto: SyncUpdateReportDto = {
            title: report.title,
            companionId: report.companionId,
            bitacora: report.bitacora,
            latitude: report.latitude,
            longitude: report.longitude,
            status: 'SYNCED' as any,
            items: report.items,
          };
          await this.reportsRepo.syncUpdate(report.code, updateDto);

          if (report.items?.length) {
            await this.reportsRepo.replaceItems(existing.id, report.items);
          }

          if (report.photos?.length) {
            for (const photo of report.photos) {
              await this.photosRepo.upsert(photo.id, {
                reportId: existing.id,
                url: photo.url,
                type: (photo.type as PhotoType) || DEFAULT_PHOTO_TYPE,
              });
            }
          }
        } else {
          const createDto: CreateReportDto = {
            code: report.code,
            title: report.title,
            operatorId: report.operatorId,
            companionId: report.companionId,
            conductorId: report.conductorId,
            bitacora: report.bitacora,
            latitude: report.latitude,
            longitude: report.longitude,
            items: report.items,
            photos: report.photos?.map((p) => ({ url: p.url, type: (p.type as PhotoType) || DEFAULT_PHOTO_TYPE })),
          };
          await this.reportsRepo.create(createDto);
        }

        synced++;
      } catch (error) {
        this.logger.error(`Error syncing report ${report.code}:`, error);
        errors.push(`Error en ${report.code}: ${error}`);
      }
    }

    return {
      success: errors.length === 0,
      synced,
      errors: errors.length > 0 ? errors : undefined,
      message: errors.length > 0 ? `${synced}/${reports.length} sincronizados` : undefined,
    };
  }

  async getPendingCount(): Promise<number> {
    const [draftCount, syncedCount] = await Promise.all([
      this.reportsRepo.findAll('DRAFT' as any),
      this.reportsRepo.findAll('SYNCED' as any),
    ]);
    return (draftCount?.length || 0) + (syncedCount?.length || 0);
  }
}