import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import ExcelJS from 'exceljs';

@Injectable()
export class ReportsExportService {
  constructor(private prisma: PrismaService) {}

  async exportToExcel(reportId?: string) {
    const reports = reportId
      ? [await this.prisma.report.findUnique({
          where: { id: reportId },
          include: { items: { include: { product: true } }, photos: true },
        })]
      : await this.prisma.report.findMany({
          include: {
            items: { include: { product: true } },
            photos: true,
            operator: { select: { name: true } },
            conductor: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 100,
        });

    if (!reports || reports.length === 0) {
      throw new NotFoundException('No hay reportes para exportar');
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Big Gamma Logística';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Reportes');

    sheet.columns = [
      { header: 'Código', key: 'code', width: 15 },
      { header: 'Estado', key: 'status', width: 12 },
      { header: 'Operario', key: 'operator', width: 20 },
      { header: 'Conductor', key: 'conductor', width: 20 },
      { header: 'Fecha', key: 'createdAt', width: 18 },
      { header: 'Bitácora', key: 'bitacora', width: 40 },
    ];

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2563EB' },
    };

    for (const report of reports) {
      if (!report) continue;

      const items = report.items
        ?.map((item) => `${item.product?.name || item.productId} x${item.quantity}`)
        .join(', ');

      sheet.addRow({
        code: report.code,
        status: report.status,
        operator: report.operatorId,
        conductor: report.conductorId || '',
        createdAt: report.createdAt.toLocaleDateString('es-CO'),
        bitacora: report.bitacora || '',
      });
    }

    return workbook;
  }

  async exportToJson(reportId?: string) {
    return reportId
      ? this.prisma.report.findUnique({
          where: { id: reportId },
          include: { items: { include: { product: true } }, photos: true },
        })
      : this.prisma.report.findMany({
          include: { items: { include: { product: true } }, photos: true },
          orderBy: { createdAt: 'desc' },
          take: 100,
        });
  }
}