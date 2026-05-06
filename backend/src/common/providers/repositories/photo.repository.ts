import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { IPhotoRepository, CreatePhotoDto } from '@/common/interfaces/repositories/i-photo.repository';
import { Photo, PhotoType, Prisma } from '@prisma/client';

@Injectable()
export class PhotoRepository implements IPhotoRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePhotoDto): Promise<Photo> {
    return this.prisma.photo.create({
      data: {
        reportId: data.reportId,
        url: data.url,
        type: data.type || 'EVIDENCE',
      } as unknown as Prisma.PhotoCreateInput,
    });
  }

  async createMany(data: CreatePhotoDto[]): Promise<{ count: number }> {
    return this.prisma.photo.createMany({
      data: data.map((d) => ({
        reportId: d.reportId,
        url: d.url,
        type: d.type || 'EVIDENCE',
      })) as unknown as Prisma.PhotoCreateManyInput[],
    });
  }

  async findByReport(reportId: string): Promise<Photo[]> {
    return this.prisma.photo.findMany({ where: { reportId }, orderBy: { createdAt: 'desc' } });
  }

  async findUnique(id: string): Promise<Photo | null> {
    return this.prisma.photo.findUnique({ where: { id } });
  }

  async delete(id: string): Promise<Photo> {
    return this.prisma.photo.delete({ where: { id } });
  }

  async deleteMany(reportId: string): Promise<{ count: number }> {
    return this.prisma.photo.deleteMany({ where: { reportId } });
  }

  async upsert(id: string, data: CreatePhotoDto): Promise<Photo> {
    return this.prisma.photo.upsert({
      where: { id },
      create: {
        id,
        reportId: data.reportId,
        url: data.url,
        type: data.type || 'EVIDENCE',
      } as unknown as Prisma.PhotoCreateInput,
      update: { url: data.url } as unknown as Prisma.PhotoUpdateInput,
    });
  }
}