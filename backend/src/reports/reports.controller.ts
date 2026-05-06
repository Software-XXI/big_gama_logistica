import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { ReportStatus } from '@prisma/client';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { ForbiddenException } from '@nestjs/common';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Post()
  create(@Body() dto: CreateReportDto, @Request() req) {
    return this.reportsService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.reportsService.findAllForUser(req.user.id);
  }

  @Get('operators')
  listOperators() {
    return this.reportsService.listOperators();
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string, @Request() req) {
    const report = await this.reportsService.findByCode(code);
    if (!report) {
      return null;
    }
    if (!this.reportsService.canView(req.user.id, req.user.role, report)) {
      throw new ForbiddenException('No tienes acceso a este reporte');
    }
    return report;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const report = await this.reportsService.findOne(id);
    if (!this.reportsService.canView(req.user.id, req.user.role, report)) {
      throw new ForbiddenException('No tienes acceso a este reporte');
    }
    return report;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReportDto, @Request() req) {
    return this.reportsService.update(id, dto, req.user.id, req.user.role);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.reportsService.delete(id, req.user.id, req.user.role);
  }

  @Post(':id/items')
  async addItems(
    @Param('id') id: string,
    @Body() items: { productId: string; quantity: number }[],
    @Request() req,
  ) {
    const report = await this.reportsService.findOne(id);
    if (!this.reportsService.canEdit(req.user.id, req.user.role, report)) {
      throw new ForbiddenException('No tienes permiso para editar este reporte');
    }
    return this.reportsService.addItems(id, items, req.user.id);
  }
}