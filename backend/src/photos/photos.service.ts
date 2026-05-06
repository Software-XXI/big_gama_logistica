import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PhotoRepository } from '@/common/providers/repositories/photo.repository';
import type { PhotoType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const VALID_PHOTO_TYPES: PhotoType[] = ['EVIDENCE', 'INVENTORY', 'OTHER'];

@Injectable()
export class PhotosService {
  private uploadPath = './uploads/photos';

  constructor(private photosRepo: PhotoRepository) {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  private sanitizeFilename(filename: string): string {
    const sanitized = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const ext = path.extname(sanitized).toLowerCase();
    const baseName = path.basename(sanitized, ext);
    return `${baseName.substring(0, 50)}${ext}`;
  }

  async upload(file: Express.Multer.File, reportId: string, type: string) {
    const sanitizedName = this.sanitizeFilename(file.originalname);
    const filename = `${Date.now()}-${sanitizedName}`;
    const filepath = path.join(this.uploadPath, filename);

    fs.writeFileSync(filepath, file.buffer);

    const url = `/uploads/photos/${filename}`;

    const photoType = (type as PhotoType) || 'EVIDENCE';
    if (!VALID_PHOTO_TYPES.includes(photoType)) {
      throw new BadRequestException('Tipo de foto inválido. Valores permitidos: EVIDENCE, INVENTORY, OTHER');
    }

    return this.photosRepo.create({
      reportId,
      url,
      type: photoType,
    });
  }

  async findByReport(reportId: string) {
    return this.photosRepo.findByReport(reportId);
  }

  async delete(id: string) {
    const photo = await this.photosRepo.findUnique(id);

    if (!photo) {
      throw new NotFoundException(`Foto ${id} no encontrada`);
    }

    const filepath = path.join('.', photo.url);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return this.photosRepo.delete(id);
  }
}