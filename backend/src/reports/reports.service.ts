import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ReportRepository } from '@/common/providers/repositories/report.repository';
import type { CreateReportDto, UpdateReportDto } from '@/common/interfaces/repositories/i-report.repository';
import { ReportStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private reportsRepo: ReportRepository) { }

  async create(dto: CreateReportDto, userId: string) {
    const report = await this.reportsRepo.create(dto);
    await this.reportsRepo.createAuditLog(report.id, userId, 'CREATE_REPORT', report);
    return report;
  }

  async findAll(status?: ReportStatus) {
    return this.reportsRepo.findAll(status);
  }

  async findOne(id: string) {
    const report = await this.reportsRepo.findOne(id);

    if (!report) {
      throw new NotFoundException(`Reporte ${id} no encontrado`);
    }

    return report;
  }

  async addItems(id: string, items: { productId: string; quantity: number }[], userId: string) {
    const report = await this.reportsRepo.addItems(id, items);
    await this.reportsRepo.createAuditLog(id, userId, 'ADD_ITEMS', { items });
    return report;
  }

  async findByCode(code: string) {
    return this.reportsRepo.findByCode(code);
  }

  async findAllForUser(userId: string) {
    return this.reportsRepo.findAllForUser(userId);
  }

  async listOperators() {
    return this.reportsRepo.findAllOperators();
  }

  canView(userId: string, role: string, report: { operatorId: string; companionId?: string | null; conductorId?: string | null }): boolean {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') return true;
    if (report.operatorId === userId) return true;
    if (report.companionId === userId) return true;
    if (report.conductorId === userId) return true;
    return false;
  }

  canEdit(userId: string, role: string, report: { operatorId: string; companionId?: string | null; conductorId?: string | null }): boolean {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') return true;
    if (report.operatorId === userId) return true;
    if (report.companionId === userId) return true;
    if (report.conductorId === userId) return true;
    return false;
  }

  async delete(id: string, userId: string, role: string) {
    const report = await this.reportsRepo.findOne(id);
    if (!report) {
      throw new NotFoundException(`Reporte ${id} no encontrado`);
    }
    if (!this.canEdit(userId, role, report)) {
      throw new ForbiddenException('No tienes permiso para eliminar este reporte');
    }
    await this.reportsRepo.delete(id);
    await this.reportsRepo.createAuditLog(id, userId, 'DELETE_REPORT', { id });
  }

  async update(id: string, dto: UpdateReportDto, userId: string, role: string) {
    const report = await this.reportsRepo.findOne(id);
    if (!report) {
      throw new NotFoundException(`Reporte ${id} no encontrado`);
    }
    if (!this.canEdit(userId, role, report)) {
      throw new ForbiddenException('No tienes permiso para editar este reporte');
    }
    const updated = await this.reportsRepo.update(id, dto);
    await this.reportsRepo.createAuditLog(id, userId, 'UPDATE_REPORT', updated);
    return updated;
  }
}