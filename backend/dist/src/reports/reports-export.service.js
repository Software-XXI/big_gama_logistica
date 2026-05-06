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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsExportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const exceljs_1 = __importDefault(require("exceljs"));
let ReportsExportService = class ReportsExportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async exportToExcel(reportId) {
        const reports = reportId
            ? [await this.prisma.report.findUnique({
                    where: { id: reportId },
                    include: { items: { include: { product: true } }, photos: true },
                })]
            : await this.prisma.report.findMany({
                include: {
                    items: { include: { product: true } },
                    photos: true,
                    operator: { select: { name: true } },
                    conductor: { select: { name: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: 100,
            });
        if (!reports || reports.length === 0) {
            throw new common_1.NotFoundException('No hay reportes para exportar');
        }
        const workbook = new exceljs_1.default.Workbook();
        workbook.creator = 'Big Gamma Logística';
        workbook.created = new Date();
        const sheet = workbook.addWorksheet('Reportes');
        sheet.columns = [
            { header: 'Código', key: 'code', width: 15 },
            { header: 'Estado', key: 'status', width: 12 },
            { header: 'Operario', key: 'operator', width: 20 },
            { header: 'Conductor', key: 'conductor', width: 20 },
            { header: 'Fecha', key: 'createdAt', width: 18 },
            { header: 'Bitácora', key: 'bitacora', width: 40 },
        ];
        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF2563EB' },
        };
        for (const report of reports) {
            if (!report)
                continue;
            const items = report.items
                ?.map((item) => `${item.product?.name || item.productId} x${item.quantity}`)
                .join(', ');
            sheet.addRow({
                code: report.code,
                status: report.status,
                operator: report.operatorId,
                conductor: report.conductorId || '',
                createdAt: report.createdAt.toLocaleDateString('es-CO'),
                bitacora: report.bitacora || '',
            });
        }
        return workbook;
    }
    async exportToJson(reportId) {
        return reportId
            ? this.prisma.report.findUnique({
                where: { id: reportId },
                include: { items: { include: { product: true } }, photos: true },
            })
            : this.prisma.report.findMany({
                include: { items: { include: { product: true } }, photos: true },
                orderBy: { createdAt: 'desc' },
                take: 100,
            });
    }
};
exports.ReportsExportService = ReportsExportService;
exports.ReportsExportService = ReportsExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsExportService);
//# sourceMappingURL=reports-export.service.js.map