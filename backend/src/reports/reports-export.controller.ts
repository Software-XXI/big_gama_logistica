import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsExportService } from './reports-export.service';

@Controller('reports')
export class ReportsExportController {
  constructor(private readonly exportService: ReportsExportService) {}

  private setExcelHeaders(res: Response, filename: string): void {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${filename}`,
    );
  }

  @Get('export/excel')
  async exportExcel(@Res() res: Response) {
    const workbook = await this.exportService.exportToExcel();
    const filename = `reportes-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    this.setExcelHeaders(res, filename);
    
    await workbook.xlsx.write(res);
    res.end();
  }

  @Get('export/excel/:id')
  async exportReportExcel(@Param('id') id: string, @Res() res: Response) {
    const workbook = await this.exportService.exportToExcel(id);
    const filename = `reporte-${id}.xlsx`;
    
    this.setExcelHeaders(res, filename);
    
    await workbook.xlsx.write(res);
    res.end();
  }

  @Get('export/json')
  async exportJson() {
    return this.exportService.exportToJson();
  }

  @Get('export/json/:id')
  async exportReportJson(@Param('id') id: string) {
    return this.exportService.exportToJson(id);
  }
}