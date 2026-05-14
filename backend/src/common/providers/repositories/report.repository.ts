import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { IReportRepository, CreateReportDto, UpdateReportDto, SyncUpdateReportDto } from '@/common/interfaces/repositories/i-report.repository';
import { Report, ReportItem, Photo, AuditLog, ReportStatus, Prisma } from '@prisma/client';

@Injectable()
export class ReportRepository implements IReportRepository {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReportDto): Promise<Report & { items: ReportItem[]; photos: Photo[]; operator?: { id: string; name: string }; companion?: { id: string; name: string } | null; conductor?: { id: string; name: string } | null }> {
    const report = await this.prisma.report.create({
      data: {
        code: dto.code,
        title: dto.title,
        operatorId: dto.operatorId,
        companionId: dto.companionId,
        conductorId: dto.conductorId,
        bitacora: dto.bitacora,
        latitude: dto.latitude,
        longitude: dto.longitude,
        status: 'SYNCED' as ReportStatus,
        items: dto.items
          ? { create: dto.items.map((item) => ({ productId: item.productId, quantity: item.quantity })) }
          : undefined,
      },
      include: {
        items: true,
        photos: true,
        operator: { select: { id: true, name: true } },
        companion: { select: { id: true, name: true } },
        conductor: { select: { id: true, name: true } },
      },
    });

    if (dto.photos?.length) {
      await this.prisma.photo.createMany({
        data: dto.photos.map((photo) => ({
          reportId: report.id,
          url: photo.url,
          type: photo.type || 'EVIDENCE',
        })),
      });
    }

    return {
      ...report,
      operator: report.operator ?? undefined,
      companion: report.companion ?? undefined,
      conductor: report.conductor ?? undefined,
    };
  }

  async findAll(status?: ReportStatus): Promise<Report[]> {
    return this.prisma.report.findMany({
      where: status ? { status } : undefined,
      include: {
        items: { include: { product: true } },
        photos: true,
        operator: { select: { id: true, name: true } },
        companion: { select: { id: true, name: true } },
        conductor: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllForUser(userId: string): Promise<Report[]> {
    return this.prisma.report.findMany({
      where: {
        OR: [
          { operatorId: userId },
          { companionId: userId },
          { conductorId: userId },
        ],
      },
      include: {
        items: { include: { product: true } },
        photos: true,
        operator: { select: { id: true, name: true } },
        companion: { select: { id: true, name: true } },
        conductor: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Report & { items: ReportItem[]; photos: Photo[]; operator?: { id: string; name: string; email: string }; companion?: { id: string; name: string; email: string } | null; conductor?: { id: string; name: string; email: string } | null; audits: AuditLog[] }> {
    return this.prisma.report.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        photos: true,
        operator: { select: { id: true, name: true, email: true } },
        companion: { select: { id: true, name: true, email: true } },
        conductor: { select: { id: true, name: true, email: true } },
        audits: { include: { user: { select: { id: true, name: true } } }, orderBy: { timestamp: 'desc' } },
      },
    }) as Promise<Report & { items: ReportItem[]; photos: Photo[]; operator?: { id: string; name: string; email: string }; companion?: { id: string; name: string; email: string } | null; conductor?: { id: string; name: string; email: string } | null; audits: AuditLog[] }>;
  }

  async update(id: string, dto: UpdateReportDto): Promise<Report> {
    return this.prisma.report.update({
      where: { id },
      data: {
        title: dto.title,
        companionId: dto.companionId,
        status: dto.status,
        bitacora: dto.bitacora,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
    });
  }

  async addItems(id: string, items: { productId: string; quantity: number }[]): Promise<Report & { items: ReportItem[] }> {
    return this.prisma.report.update({
      where: { id },
      data: {
        items: { create: items.map((item) => ({ productId: item.productId, quantity: item.quantity })) },
      },
      include: { items: true },
    });
  }

  async findByCode(code: string): Promise<Report & { items: ReportItem[]; photos: Photo[] } | null> {
    return this.prisma.report.findUnique({
      where: { code },
      include: { items: true, photos: true },
    });
  }

  async createAuditLog(reportId: string, userId: string, action: string, details: unknown): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: {
        reportId,
        userId,
        action,
        entityType: 'Report',
        entityId: reportId,
        details: details as Prisma.JsonObject,
      },
    });
  }

  async replaceItems(id: string, items: { productId: string; quantity: number }[]): Promise<Report & { items: ReportItem[] }> {
    await this.prisma.reportItem.deleteMany({ where: { reportId: id } });
    return this.prisma.report.update({
      where: { id },
      data: {
        items: { create: items.map((item) => ({ productId: item.productId, quantity: item.quantity })) },
      },
      include: { items: true },
    });
  }

  async syncUpdate(code: string, dto: SyncUpdateReportDto): Promise<Report> {
    const existing = await this.prisma.report.findUnique({ where: { code } });
    if (!existing) {
      throw new Error(`Report with code ${code} not found`);
    }

    await this.prisma.report.update({
      where: { id: existing.id },
      data: {
        title: dto.title,
        companionId: dto.companionId,
        bitacora: dto.bitacora,
        latitude: dto.latitude,
        longitude: dto.longitude,
        status: dto.status || 'SYNCED',
      },
    });

    if (dto.items?.length) {
      await this.prisma.reportItem.deleteMany({ where: { reportId: existing.id } });
      await this.prisma.reportItem.createMany({
        data: dto.items.map((item) => ({
          reportId: existing.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    }

    return existing;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.report.delete({ where: { id } });
  }

  async findAllOperators(): Promise<{ id: string; name: string; email: string }[]> {
    return this.prisma.user.findMany({
      where: { role: 'OPERATOR' },
      select: { id: true, name: true, email: true },
    });
  }
}