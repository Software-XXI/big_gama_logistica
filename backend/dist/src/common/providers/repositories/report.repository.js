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
exports.ReportRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
let ReportRepository = class ReportRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const report = await this.prisma.report.create({
            data: {
                code: dto.code,
                title: dto.title,
                operatorId: dto.operatorId,
                companionId: dto.companionId,
                conductorId: dto.conductorId,
                bitacora: dto.bitacora,
                latitude: dto.latitude,
                longitude: dto.longitude,
                status: 'SYNCED',
                items: dto.items
                    ? { create: dto.items.map((item) => ({ productId: item.productId, quantity: item.quantity })) }
                    : undefined,
            },
            include: {
                items: true,
                photos: true,
                operator: { select: { id: true, name: true } },
                companion: { select: { id: true, name: true } },
                conductor: { select: { id: true, name: true } },
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
        return {
            ...report,
            operator: report.operator ?? undefined,
            companion: report.companion ?? undefined,
            conductor: report.conductor ?? undefined,
        };
    }
    async findAll(status) {
        return this.prisma.report.findMany({
            where: status ? { status } : undefined,
            include: {
                items: { include: { product: true } },
                photos: true,
                operator: { select: { id: true, name: true } },
                companion: { select: { id: true, name: true } },
                conductor: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllForUser(userId) {
        return this.prisma.report.findMany({
            where: {
                OR: [
                    { operatorId: userId },
                    { companionId: userId },
                    { conductorId: userId },
                ],
            },
            include: {
                items: { include: { product: true } },
                photos: true,
                operator: { select: { id: true, name: true } },
                companion: { select: { id: true, name: true } },
                conductor: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.report.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } },
                photos: true,
                operator: { select: { id: true, name: true, email: true } },
                companion: { select: { id: true, name: true, email: true } },
                conductor: { select: { id: true, name: true, email: true } },
                audits: { include: { user: { select: { id: true, name: true } } }, orderBy: { timestamp: 'desc' } },
            },
        });
    }
    async update(id, dto) {
        return this.prisma.report.update({
            where: { id },
            data: {
                title: dto.title,
                companionId: dto.companionId,
                status: dto.status,
                bitacora: dto.bitacora,
                latitude: dto.latitude,
                longitude: dto.longitude,
            },
        });
    }
    async addItems(id, items) {
        return this.prisma.report.update({
            where: { id },
            data: {
                items: { create: items.map((item) => ({ productId: item.productId, quantity: item.quantity })) },
            },
            include: { items: true },
        });
    }
    async findByCode(code) {
        return this.prisma.report.findUnique({
            where: { code },
            include: { items: true, photos: true },
        });
    }
    async createAuditLog(reportId, userId, action, details) {
        return this.prisma.auditLog.create({
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
    async replaceItems(id, items) {
        await this.prisma.reportItem.deleteMany({ where: { reportId: id } });
        return this.prisma.report.update({
            where: { id },
            data: {
                items: { create: items.map((item) => ({ productId: item.productId, quantity: item.quantity })) },
            },
            include: { items: true },
        });
    }
    async syncUpdate(code, dto) {
        const existing = await this.prisma.report.findUnique({ where: { code } });
        if (!existing) {
            throw new Error(`Report with code ${code} not found`);
        }
        await this.prisma.report.update({
            where: { id: existing.id },
            data: {
                title: dto.title,
                companionId: dto.companionId,
                bitacora: dto.bitacora,
                latitude: dto.latitude,
                longitude: dto.longitude,
                status: dto.status || 'SYNCED',
            },
        });
        if (dto.items?.length) {
            await this.prisma.reportItem.deleteMany({ where: { reportId: existing.id } });
            await this.prisma.reportItem.createMany({
                data: dto.items.map((item) => ({
                    reportId: existing.id,
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            });
        }
        return existing;
    }
    async delete(id) {
        await this.prisma.report.delete({ where: { id } });
    }
    async findAllOperators() {
        return this.prisma.user.findMany({
            where: { role: 'OPERATOR' },
            select: { id: true, name: true, email: true },
        });
    }
};
exports.ReportRepository = ReportRepository;
exports.ReportRepository = ReportRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportRepository);
//# sourceMappingURL=report.repository.js.map