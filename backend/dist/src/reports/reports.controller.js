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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const report_dto_1 = require("./dto/report.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const common_2 = require("@nestjs/common");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    create(dto, req) {
        return this.reportsService.create(dto, req.user.id);
    }
    findAll(req) {
        return this.reportsService.findAllForUser(req.user.id);
    }
    listOperators() {
        return this.reportsService.listOperators();
    }
    async findByCode(code, req) {
        const report = await this.reportsService.findByCode(code);
        if (!report) {
            return null;
        }
        if (!this.reportsService.canView(req.user.id, req.user.role, report)) {
            throw new common_2.ForbiddenException('No tienes acceso a este reporte');
        }
        return report;
    }
    async findOne(id, req) {
        const report = await this.reportsService.findOne(id);
        if (!this.reportsService.canView(req.user.id, req.user.role, report)) {
            throw new common_2.ForbiddenException('No tienes acceso a este reporte');
        }
        return report;
    }
    update(id, dto, req) {
        return this.reportsService.update(id, dto, req.user.id, req.user.role);
    }
    delete(id, req) {
        return this.reportsService.delete(id, req.user.id, req.user.role);
    }
    async addItems(id, items, req) {
        const report = await this.reportsService.findOne(id);
        if (!this.reportsService.canEdit(req.user.id, req.user.role, report)) {
            throw new common_2.ForbiddenException('No tienes permiso para editar este reporte');
        }
        return this.reportsService.addItems(id, items, req.user.id);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_dto_1.CreateReportDto, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('operators'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "listOperators", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, report_dto_1.UpdateReportDto, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "addItems", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map