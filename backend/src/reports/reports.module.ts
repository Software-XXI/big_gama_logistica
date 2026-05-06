import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsExportController } from './reports-export.controller';
import { ReportsService } from './reports.service';
import { ReportsExportService } from './reports-export.service';
import { RepositoriesModule } from '@/common/providers/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [ReportsController, ReportsExportController],
  providers: [ReportsService, ReportsExportService],
  exports: [ReportsService],
})
export class ReportsModule {}