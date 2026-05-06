import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { ReportStatus } from '@prisma/client';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

@Post()
create(@Body() dto: CreateReportDto) {
  return this.reportsService.create(dto, dto.operatorId);
}

// @Post('sync')
// sync(@Body() dto: CreateReportDto) {
//   return this.reportsService.create(dto, dto.operatorId);
// }

  @Get()
  findAll(@Query('status') status?: ReportStatus) {
    return this.reportsService.findAll(status);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.reportsService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReportDto) {
    return this.reportsService.update(id, dto, dto.operatorId || 'system-update');
  }

  @Post(':id/items')
  addItems(
    @Param('id') id: string,
    @Body() items: { productId: string; quantity: number }[],
  ) {
    return this.reportsService.addItems(id, items, 'system');
  }
}