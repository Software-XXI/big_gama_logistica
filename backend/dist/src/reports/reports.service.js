"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const report_repository_1 = require("../common/providers/repositories/report.repository");
let ReportsService = class ReportsService {
    reportsRepo;
    constructor(reportsRepo) {
        this.reportsRepo = reportsRepo;
    }
    async create(dto, userId) {
        const report = await this.reportsRepo.create(dto);
        await this.reportsRepo.createAuditLog(report.id, userId, 'CREATE_REPORT', report);
        return report;
    }
    async findAll(status) {
        return this.reportsRepo.findAll(status);
    }
    async findOne(id) {
        const report = await this.reportsRepo.findOne(id);
        if (!report) {
            throw new common_1.NotFoundException(`Reporte ${id} no encontrado`);
        }
        return report;
    }
    async addItems(id, items, userId) {
        const report = await this.reportsRepo.addItems(id, items);
        await this.reportsRepo.createAuditLog(id, userId, 'ADD_ITEMS', { items });
        return report;
    }
    async findByCode(code) {
        return this.reportsRepo.findByCode(code);
    }
    async findAllForUser(userId) {
        return this.reportsRepo.findAllForUser(userId);
    }
    async listOperators() {
        return this.reportsRepo.findAllOperators();
    }
    canView(userId, role, report) {
        if (role === 'ADMIN' || role === 'SUPER_ADMIN')
            return true;
        if (report.operatorId === userId)
            return true;
        if (report.companionId === userId)
            return true;
        if (report.conductorId === userId)
            return true;
        return false;
    }
    canEdit(userId, role, report) {
        if (role === 'ADMIN' || role === 'SUPER_ADMIN')
            return true;
        if (report.operatorId === userId)
            return true;
        if (report.companionId === userId)
            return true;
        if (report.conductorId === userId)
            return true;
        return false;
    }
    async delete(id, userId, role) {
        const report = await this.reportsRepo.findOne(id);
        if (!report) {
            throw new common_1.NotFoundException(`Reporte ${id} no encontrado`);
        }
        if (!this.canEdit(userId, role, report)) {
            throw new common_1.ForbiddenException('No tienes permiso para eliminar este reporte');
        }
        await this.reportsRepo.delete(id);
        await this.reportsRepo.createAuditLog(id, userId, 'DELETE_REPORT', { id });
    }
    async update(id, dto, userId, role) {
        const report = await this.reportsRepo.findOne(id);
        if (!report) {
            throw new common_1.NotFoundException(`Reporte ${id} no encontrado`);
        }
        if (!this.canEdit(userId, role, report)) {
            throw new common_1.ForbiddenException('No tienes permiso para editar este reporte');
        }
        const updated = await this.reportsRepo.update(id, dto);
        await this.reportsRepo.createAuditLog(id, userId, 'UPDATE_REPORT', updated);
        return updated;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [report_repository_1.ReportRepository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map