import { Controller, Post, Body, Get } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncReportDto } from './dto/sync.dto';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  sync(@Body() reports: SyncReportDto[]) {
    return this.syncService.syncReports(reports);
  }

  @Get('pending')
  getPendingCount() {
    return this.syncService.getPendingCount();
  }
}