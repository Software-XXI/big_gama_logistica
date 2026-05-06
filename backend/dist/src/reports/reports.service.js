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
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        const report = await this.prisma.report.create({
            data: {
                code: dto.code,
                operatorId: dto.operatorId || userId,
                conductorId: dto.conductorId,
                bitacora: dto.bitacora,
                latitude: dto.latitude,
                longitude: dto.longitude,
                status: client_1.ReportStatus.SYNCED,
                items: dto.items
                    ? {
                        create: dto.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                    }
                    : undefined,
            },
            include: {
                items: true,
                operator: true,
                conductor: true,
            },
        });
        if (dto.photos?.length) {
            await this.prisma.photo.createMany({
                data: dto.photos.map((photo) => ({
                    reportId: report.id,
                    url: photo.url,
                    type: photo.type || 'EVIDENCE',
                })),
            });
        }
        await this.createAuditLog(report.id, userId, 'CREATE_REPORT', report);
        return report;
    }
    async findAll(status) {
        const where = status ? { status } : undefined;
        return this.prisma.report.findMany({
            where,
            include: {
                items: { include: { product: true } },
                photos: true,
                operator: { select: { id: true, name: true } },
                conductor: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const report = await this.prisma.report.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } },
                photos: true,
                operator: { select: { id: true, name: true, email: true } },
                conductor: { select: { id: true, name: true, email: true } },
                audits: {
                    include: { user: { select: { id: true, name: true } } },
                    orderBy: { timestamp: 'desc' },
                },
            },
        });
        if (!report) {
            throw new common_1.NotFoundException(`Reporte ${id} no encontrado`);
        }
        return report;
    }
    async update(id, dto, userId) {
        const report = await this.prisma.report.update({
            where: { id },
            data: {
                status: dto.status,
                bitacora: dto.bitacora,
                latitude: dto.latitude,
                longitude: dto.longitude,
            },
        });
        await this.createAuditLog(id, userId, 'UPDATE_REPORT', report);
        return report;
    }
    async addItems(id, items, userId) {
        const report = await this.prisma.report.update({
            where: { id },
            data: {
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
            include: { items: true },
        });
        await this.createAuditLog(id, userId, 'ADD_ITEMS', { items });
        return report;
    }
    async findByCode(code) {
        return this.prisma.report.findUnique({
            where: { code },
            include: { items: true, photos: true },
        });
    }
    async createAuditLog(reportId, userId, action, details) {
        await this.prisma.auditLog.create({
            data: {
                reportId,
                userId,
                action,
                entityType: 'Report',
                entityId: reportId,
                details: details,
            },
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map