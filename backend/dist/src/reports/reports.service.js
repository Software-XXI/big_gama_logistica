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
const user_repository_1 = require("../common/providers/repositories/user.repository");
let ReportsService = class ReportsService {
    reportsRepo;
    userRepo;
    constructor(reportsRepo, userRepo) {
        this.reportsRepo = reportsRepo;
        this.userRepo = userRepo;
    }
    async create(dto, userId) {
        const report = await this.reportsRepo.create(dto);
        await this.reportsRepo.createAuditLog(report.id, userId, 'CREATE_REPORT', report);
        return report;
    }
    async findAll(status) {
        return this.reportsRepo.findAll(status);
    }
    async findAllForUser(userId) {
        return this.reportsRepo.findAllForUser(userId);
    }
    async findOne(id) {
        const report = await this.reportsRepo.findOne(id);
        if (!report) {
            throw new common_1.NotFoundException(`Reporte ${id} no encontrado`);
        }
        return report;
    }
    async update(id, dto, userId, userRole) {
        const report = await this.reportsRepo.findOne(id);
        if (!report) {
            throw new common_1.NotFoundException(`Reporte ${id} no encontrado`);
        }
        if (!this.canEdit(userId, userRole, report)) {
            throw new common_1.ForbiddenException('No tienes permiso para editar este reporte');
        }
        const updated = await this.reportsRepo.update(id, dto);
        await this.reportsRepo.createAuditLog(id, userId, 'UPDATE_REPORT', updated);
        return updated;
    }
    async delete(id, userId, userRole) {
        const report = await this.reportsRepo.findOne(id);
        if (!report) {
            throw new common_1.NotFoundException(`Reporte ${id} no encontrado`);
        }
        if (!this.canDelete(userId, userRole, report)) {
            throw new common_1.ForbiddenException('No tienes permiso para eliminar este reporte');
        }
        await this.reportsRepo.createAuditLog(id, userId, 'DELETE_REPORT', report);
        return this.reportsRepo.update(id, { status: 'REJECTED' });
    }
    async addItems(id, items, userId) {
        const report = await this.reportsRepo.addItems(id, items);
        await this.reportsRepo.createAuditLog(id, userId, 'ADD_ITEMS', { items });
        return report;
    }
    async findByCode(code) {
        return this.reportsRepo.findByCode(code);
    }
    async listOperators() {
        return this.userRepo.findAllByRole('OPERATOR');
    }
    canView(userId, userRole, report) {
        if (userRole === 'ADMIN')
            return true;
        return (report.operatorId === userId ||
            report.companionId === userId ||
            report.conductorId === userId);
    }
    canEdit(userId, userRole, report) {
        if (userRole === 'ADMIN')
            return true;
        return report.operatorId === userId || report.companionId === userId;
    }
    canDelete(userId, userRole, report) {
        if (userRole === 'ADMIN')
            return true;
        return report.operatorId === userId;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [report_repository_1.ReportRepository,
        user_repository_1.UserRepository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map