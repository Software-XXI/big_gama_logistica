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
exports.ReportsExportController = void 0;
const common_1 = require("@nestjs/common");
const reports_export_service_1 = require("./reports-export.service");
let ReportsExportController = class ReportsExportController {
    exportService;
    constructor(exportService) {
        this.exportService = exportService;
    }
    setExcelHeaders(res, filename) {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    }
    async exportExcel(res) {
        const workbook = await this.exportService.exportToExcel();
        const filename = `reportes-${new Date().toISOString().split('T')[0]}.xlsx`;
        this.setExcelHeaders(res, filename);
        await workbook.xlsx.write(res);
        res.end();
    }
    async exportReportExcel(id, res) {
        const workbook = await this.exportService.exportToExcel(id);
        const filename = `reporte-${id}.xlsx`;
        this.setExcelHeaders(res, filename);
        await workbook.xlsx.write(res);
        res.end();
    }
    async exportJson() {
        return this.exportService.exportToJson();
    }
    async exportReportJson(id) {
        return this.exportService.exportToJson(id);
    }
};
exports.ReportsExportController = ReportsExportController;
__decorate([
    (0, common_1.Get)('export/excel'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsExportController.prototype, "exportExcel", null);
__decorate([
    (0, common_1.Get)('export/excel/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsExportController.prototype, "exportReportExcel", null);
__decorate([
    (0, common_1.Get)('export/json'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsExportController.prototype, "exportJson", null);
__decorate([
    (0, common_1.Get)('export/json/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsExportController.prototype, "exportReportJson", null);
exports.ReportsExportController = ReportsExportController = __decorate([
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_export_service_1.ReportsExportService])
], ReportsExportController);
//# sourceMappingURL=reports-export.controller.js.map