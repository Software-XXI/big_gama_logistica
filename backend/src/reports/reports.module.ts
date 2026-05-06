import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsExportController } from './reports-export.controller';
import { ReportsService } from './reports.service';
import { ReportsExportService } from './reports-export.service';

@Module({
  controllers: [ReportsController, ReportsExportController],
  providers: [ReportsService, ReportsExportService],
  exports: [ReportsService],
})
export class ReportsModule {}