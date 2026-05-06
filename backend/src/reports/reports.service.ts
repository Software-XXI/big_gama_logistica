import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { ReportStatus, Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateReportDto, userId: string) {
    const report = await this.prisma.report.create({
      data: {
        code: dto.code,
        operatorId: dto.operatorId || userId,
        conductorId: dto.conductorId,
        bitacora: dto.bitacora,
        latitude: dto.latitude,
        longitude: dto.longitude,
        status: ReportStatus.SYNCED,
        items: dto.items
          ? {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          }
          : undefined,
      },
      include: {
        items: true,
        operator: true,
        conductor: true,
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

    await this.createAuditLog(report.id, userId, 'CREATE_REPORT', report);

    return report;
  }

  async findAll(status?: ReportStatus) {
    const where = status ? { status } : undefined;
    return this.prisma.report.findMany({
      where,
      include: {
        items: { include: { product: true } },
        photos: true,
        operator: { select: { id: true, name: true } },
        conductor: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        photos: true,
        operator: { select: { id: true, name: true, email: true } },
        conductor: { select: { id: true, name: true, email: true } },
        audits: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!report) {
      throw new NotFoundException(`Reporte ${id} no encontrado`);
    }

    return report;
  }

  async update(id: string, dto: UpdateReportDto, userId: string) {
    const report = await this.prisma.report.update({
      where: { id },
      data: {
        status: dto.status,
        bitacora: dto.bitacora,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
    });

    await this.createAuditLog(id, userId, 'UPDATE_REPORT', report);

    return report;
  }

  async addItems(id: string, items: { productId: string; quantity: number }[], userId: string) {
    const report = await this.prisma.report.update({
      where: { id },
      data: {
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    await this.createAuditLog(id, userId, 'ADD_ITEMS', { items });

    return report;
  }

  async findByCode(code: string) {
    return this.prisma.report.findUnique({
      where: { code },
      include: { items: true, photos: true },
    });
  }

  private async createAuditLog(
    reportId: string,
    userId: string,
    action: string,
    details: unknown,
  ) {
    await this.prisma.auditLog.create({
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
}