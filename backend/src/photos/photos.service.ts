import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PhotosService {
  private uploadPath = './uploads/photos';

  constructor(private prisma: PrismaService) {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, reportId: string, type: string) {
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(this.uploadPath, filename);

    fs.writeFileSync(filepath, file.buffer);

    const url = `/uploads/photos/${filename}`;

    return this.prisma.photo.create({
      data: {
        reportId,
        url,
        type: type as any,
      },
    });
  }

  async findByReport(reportId: string) {
    return this.prisma.photo.findMany({
      where: { reportId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string) {
    const photo = await this.prisma.photo.findUnique({ where: { id } });
    
    if (!photo) {
      throw new NotFoundException(`Foto ${id} no encontrada`);
    }

    const filepath = path.join('.', photo.url);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return this.prisma.photo.delete({ where: { id } });
  }
}