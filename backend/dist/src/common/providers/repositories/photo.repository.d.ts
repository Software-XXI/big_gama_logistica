import { PrismaService } from "../../../prisma.service";
import { IPhotoRepository, CreatePhotoDto } from "../../interfaces/repositories/i-photo.repository";
import { Photo } from '@prisma/client';
export declare class PhotoRepository implements IPhotoRepository {
    private prisma;
    constructor(prisma: PrismaService);
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
