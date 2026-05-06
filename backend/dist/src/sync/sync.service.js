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
var SyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let SyncService = SyncService_1 = class SyncService {
    prisma;
    logger = new common_1.Logger(SyncService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async syncReports(reports) {
        const errors = [];
        let synced = 0;
        for (const report of reports) {
            try {
                const existing = await this.prisma.report.findUnique({
                    where: { code: report.code },
                });
                if (existing) {
                    await this.prisma.report.update({
                        where: { id: existing.id },
                        data: {
                            bitacora: report.bitacora,
                            latitude: report.latitude,
                            longitude: report.longitude,
                            status: 'SYNCED',
                        },
                    });
                    if (report.items?.length) {
                        await this.prisma.reportItem.deleteMany({
                            where: { reportId: existing.id },
                        });
                        await this.prisma.reportItem.createMany({
                            data: report.items.map((item) => ({
                                reportId: existing.id,
                                productId: item.productId,
                                quantity: item.quantity,
                            })),
                        });
                    }
                    if (report.photos?.length) {
                        for (const photo of report.photos) {
                            await this.prisma.photo.upsert({
                                where: { id: photo.id },
                                create: {
                                    id: photo.id,
                                    reportId: existing.id,
                                    url: photo.url,
                                    type: photo.type || 'EVIDENCE',
                                },
                                update: {
                                    url: photo.url,
                                },
                            });
                        }
                    }
                }
                else {
                    await this.prisma.report.create({
                        data: {
                            id: report.id,
                            code: report.code,
                            operatorId: report.operatorId,
                            conductorId: report.conductorId,
                            bitacora: report.bitacora,
                            latitude: report.latitude,
                            longitude: report.longitude,
                            status: 'SYNCED',
                            items: report.items
                                ? {
                                    create: report.items.map((item) => ({
                                        productId: item.productId,
                                        quantity: item.quantity,
                                    })),
                                }
                                : undefined,
                            photos: report.photos
                                ? {
                                    create: report.photos.map((photo) => ({
                                        id: photo.id,
                                        url: photo.url,
                                        type: photo.type || 'EVIDENCE',
                                    })),
                                }
                                : undefined,
                        },
                    });
                }
                synced++;
            }
            catch (error) {
                this.logger.error(`Error syncing report ${report.code}:`, error);
                errors.push(`Error en ${report.code}: ${error}`);
            }
        }
        return {
            success: errors.length === 0,
            synced,
            errors: errors.length > 0 ? errors : undefined,
            message: errors.length > 0 ? `${synced}/${reports.length} sincronizados` : undefined,
        };
    }
    async getPendingCount() {
        const [draftCount, syncedCount] = await Promise.all([
            this.prisma.report.count({ where: { status: 'DRAFT' } }),
            this.prisma.report.count({ where: { status: 'SYNCED' } }),
        ]);
        return draftCount + syncedCount;
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SyncService);
//# sourceMappingURL=sync.service.js.map