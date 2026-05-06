import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { CreateReportDto, UpdateReportDto } from '@/common/interfaces/repositories/i-report.repository';
import { ReportRepository } from '@/common/providers/repositories/report.repository';
import { UserRepository } from '@/common/providers/repositories/user.repository';
import { ReportStatus } from '@prisma/client';

export interface UserInfo {
  id: string;
  role: string;
}

@Injectable()
export class ReportsService {
  constructor(
    private reportsRepo: ReportRepository,
    private userRepo: UserRepository,
  ) {}

  async create(dto: CreateReportDto, userId: string) {
    const report = await this.reportsRepo.create(dto);
    await this.reportsRepo.createAuditLog(report.id, userId, 'CREATE_REPORT', report);
    return report;
  }

  async findAll(status?: ReportStatus) {
    return this.reportsRepo.findAll(status);
  }

  async findAllForUser(userId: string) {
    return this.reportsRepo.findAllForUser(userId);
  }

  async findOne(id: string) {
    const report = await this.reportsRepo.findOne(id);

    if (!report) {
      throw new NotFoundException(`Reporte ${id} no encontrado`);
    }

    return report;
  }

  async update(id: string, dto: UpdateReportDto, userId: string, userRole: string) {
    const report = await this.reportsRepo.findOne(id);

    if (!report) {
      throw new NotFoundException(`Reporte ${id} no encontrado`);
    }

    if (!this.canEdit(userId, userRole, report)) {
      throw new ForbiddenException('No tienes permiso para editar este reporte');
    }

    const updated = await this.reportsRepo.update(id, dto);
    await this.reportsRepo.createAuditLog(id, userId, 'UPDATE_REPORT', updated);
    return updated;
  }

  async delete(id: string, userId: string, userRole: string) {
    const report = await this.reportsRepo.findOne(id);

    if (!report) {
      throw new NotFoundException(`Reporte ${id} no encontrado`);
    }

    if (!this.canDelete(userId, userRole, report)) {
      throw new ForbiddenException('No tienes permiso para eliminar este reporte');
    }

    await this.reportsRepo.createAuditLog(id, userId, 'DELETE_REPORT', report);
    return this.reportsRepo.update(id, { status: 'REJECTED' as ReportStatus });
  }

  async addItems(id: string, items: { productId: string; quantity: number }[], userId: string) {
    const report = await this.reportsRepo.addItems(id, items);
    await this.reportsRepo.createAuditLog(id, userId, 'ADD_ITEMS', { items });
    return report;
  }

  async findByCode(code: string) {
    return this.reportsRepo.findByCode(code);
  }

  async listOperators() {
    return this.userRepo.findAllByRole('OPERATOR');
  }

  canView(userId: string, userRole: string, report: any): boolean {
    if (userRole === 'ADMIN') return true;
    return (
      report.operatorId === userId ||
      report.companionId === userId ||
      report.conductorId === userId
    );
  }

  canEdit(userId: string, userRole: string, report: any): boolean {
    if (userRole === 'ADMIN') return true;
    return report.operatorId === userId || report.companionId === userId;
  }

  canDelete(userId: string, userRole: string, report: any): boolean {
    if (userRole === 'ADMIN') return true;
    return report.operatorId === userId;
  }
}