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
const report_repository_1 = require("../common/providers/repositories/report.repository");
const photo_repository_1 = require("../common/providers/repositories/photo.repository");
const DEFAULT_PHOTO_TYPE = 'EVIDENCE';
let SyncService = SyncService_1 = class SyncService {
    reportsRepo;
    photosRepo;
    logger = new common_1.Logger(SyncService_1.name);
    constructor(reportsRepo, photosRepo) {
        this.reportsRepo = reportsRepo;
        this.photosRepo = photosRepo;
    }
    async syncReports(reports) {
        const errors = [];
        let synced = 0;
        for (const report of reports) {
            try {
                const existing = await this.reportsRepo.findByCode(report.code);
                if (existing) {
                    const updateDto = {
                        title: report.title,
                        companionId: report.companionId,
                        bitacora: report.bitacora,
                        latitude: report.latitude,
                        longitude: report.longitude,
                        status: 'SYNCED',
                        items: report.items,
                    };
                    await this.reportsRepo.syncUpdate(report.code, updateDto);
                    if (report.items?.length) {
                        await this.reportsRepo.replaceItems(existing.id, report.items);
                    }
                    if (report.photos?.length) {
                        for (const photo of report.photos) {
                            await this.photosRepo.upsert(photo.id, {
                                reportId: existing.id,
                                url: photo.url,
                                type: photo.type || DEFAULT_PHOTO_TYPE,
                            });
                        }
                    }
                }
                else {
                    const createDto = {
                        code: report.code,
                        title: report.title,
                        operatorId: report.operatorId,
                        companionId: report.companionId,
                        conductorId: report.conductorId,
                        bitacora: report.bitacora,
                        latitude: report.latitude,
                        longitude: report.longitude,
                        items: report.items,
                        photos: report.photos?.map((p) => ({ url: p.url, type: p.type || DEFAULT_PHOTO_TYPE })),
                    };
                    await this.reportsRepo.create(createDto);
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
            this.reportsRepo.findAll('DRAFT'),
            this.reportsRepo.findAll('SYNCED'),
        ]);
        return (draftCount?.length || 0) + (syncedCount?.length || 0);
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [report_repository_1.ReportRepository,
        photo_repository_1.PhotoRepository])
], SyncService);
//# sourceMappingURL=sync.service.js.map