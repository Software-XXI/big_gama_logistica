import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { SyncReportDto, SyncResponseDto } from './dto/sync.dto';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(private prisma: PrismaService) {}

  async syncReports(reports: SyncReportDto[]): Promise<SyncResponseDto> {
    const errors: string[] = [];
    let synced = 0;

    for (const report of reports) {
      try {
        const existing = await this.prisma.report.findUnique({
          where: { code: report.code },
        });

        if (existing) {
          await this.prisma.report.update({
            where: { id: existing.id },
            data: {
              bitacora: report.bitacora,
              latitude: report.latitude,
              longitude: report.longitude,
              status: 'SYNCED',
            },
          });

          if (report.items?.length) {
            await this.prisma.reportItem.deleteMany({
              where: { reportId: existing.id },
            });
            await this.prisma.reportItem.createMany({
              data: report.items.map((item) => ({
                reportId: existing.id,
                productId: item.productId,
                quantity: item.quantity,
              })),
            });
          }

          if (report.photos?.length) {
            for (const photo of report.photos) {
              await this.prisma.photo.upsert({
                where: { id: photo.id },
                create: {
                  id: photo.id,
                  reportId: existing.id,
                  url: photo.url,
                  type: (photo.type as any) || 'EVIDENCE',
                },
                update: {
                  url: photo.url,
                },
              });
            }
          }
        } else {
          await this.prisma.report.create({
            data: {
              id: report.id,
              code: report.code,
              operatorId: report.operatorId,
              conductorId: report.conductorId,
              bitacora: report.bitacora,
              latitude: report.latitude,
              longitude: report.longitude,
              status: 'SYNCED',
              items: report.items
                ? {
                    create: report.items.map((item) => ({
                      productId: item.productId,
                      quantity: item.quantity,
                    })),
                  }
                : undefined,
              photos: report.photos
                ? {
                    create: report.photos.map((photo) => ({
                      id: photo.id,
                      url: photo.url,
                      type: (photo.type as any) || 'EVIDENCE',
                    })),
                  }
                : undefined,
            },
          });
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
      this.prisma.report.count({ where: { status: 'DRAFT' } }),
      this.prisma.report.count({ where: { status: 'SYNCED' } }),
    ]);
    return draftCount + syncedCount;
  }
}