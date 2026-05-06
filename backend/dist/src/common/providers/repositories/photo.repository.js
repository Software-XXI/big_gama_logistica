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
exports.PhotoRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
let PhotoRepository = class PhotoRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.photo.create({
            data: {
                reportId: data.reportId,
                url: data.url,
                type: data.type || 'EVIDENCE',
            },
        });
    }
    async createMany(data) {
        return this.prisma.photo.createMany({
            data: data.map((d) => ({
                reportId: d.reportId,
                url: d.url,
                type: d.type || 'EVIDENCE',
            })),
        });
    }
    async findByReport(reportId) {
        return this.prisma.photo.findMany({ where: { reportId }, orderBy: { createdAt: 'desc' } });
    }
    async findUnique(id) {
        return this.prisma.photo.findUnique({ where: { id } });
    }
    async delete(id) {
        return this.prisma.photo.delete({ where: { id } });
    }
    async deleteMany(reportId) {
        return this.prisma.photo.deleteMany({ where: { reportId } });
    }
    async upsert(id, data) {
        return this.prisma.photo.upsert({
            where: { id },
            create: {
                id,
                reportId: data.reportId,
                url: data.url,
                type: data.type || 'EVIDENCE',
            },
            update: { url: data.url },
        });
    }
};
exports.PhotoRepository = PhotoRepository;
exports.PhotoRepository = PhotoRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PhotoRepository);
//# sourceMappingURL=photo.repository.js.map