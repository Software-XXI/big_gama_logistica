import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncReportDto } from './dto/sync.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@Controller('sync')
@UseGuards(JwtAuthGuard)
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