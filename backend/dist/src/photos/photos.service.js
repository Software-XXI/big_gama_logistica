"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotosService = void 0;
const common_1 = require("@nestjs/common");
const photo_repository_1 = require("../common/providers/repositories/photo.repository");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const VALID_PHOTO_TYPES = ['EVIDENCE', 'INVENTORY', 'OTHER'];
let PhotosService = class PhotosService {
    photosRepo;
    uploadPath = './uploads/photos';
    constructor(photosRepo) {
        this.photosRepo = photosRepo;
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }
    sanitizeFilename(filename) {
        const sanitized = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const ext = path.extname(sanitized).toLowerCase();
        const baseName = path.basename(sanitized, ext);
        return `${baseName.substring(0, 50)}${ext}`;
    }
    async upload(file, reportId, type) {
        const sanitizedName = this.sanitizeFilename(file.originalname);
        const filename = `${Date.now()}-${sanitizedName}`;
        const filepath = path.join(this.uploadPath, filename);
        fs.writeFileSync(filepath, file.buffer);
        const url = `/uploads/photos/${filename}`;
        const photoType = type || 'EVIDENCE';
        if (!VALID_PHOTO_TYPES.includes(photoType)) {
            throw new common_1.BadRequestException('Tipo de foto inválido. Valores permitidos: EVIDENCE, INVENTORY, OTHER');
        }
        return this.photosRepo.create({
            reportId,
            url,
            type: photoType,
        });
    }
    async findByReport(reportId) {
        return this.photosRepo.findByReport(reportId);
    }
    async delete(id) {
        const photo = await this.photosRepo.findUnique(id);
        if (!photo) {
            throw new common_1.NotFoundException(`Foto ${id} no encontrada`);
        }
        const filepath = path.join('.', photo.url);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        return this.photosRepo.delete(id);
    }
};
exports.PhotosService = PhotosService;
exports.PhotosService = PhotosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [photo_repository_1.PhotoRepository])
], PhotosService);
//# sourceMappingURL=photos.service.js.map