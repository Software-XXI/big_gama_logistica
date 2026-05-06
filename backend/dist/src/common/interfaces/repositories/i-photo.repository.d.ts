import { Photo, PhotoType } from '@prisma/client';
export interface CreatePhotoDto {
    reportId: string;
    url: string;
    type?: PhotoType;
}
export interface IPhotoRepository {
    create(data: CreatePhotoDto): Promise<Photo>;
    createMany(data: CreatePhotoDto[]): Promise<{
        count: number;
    }>;
    findByReport(reportId: string): Promise<Photo[]>;
    findUnique(id: string): Promise<Photo | null>;
    delete(id: string): Promise<Photo>;
    deleteMany(reportId: string): Promise<{
        count: number;
    }>;
    upsert(id: string, data: CreatePhotoDto): Promise<Photo>;
}
