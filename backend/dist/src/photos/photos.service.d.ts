import { PhotoRepository } from "../common/providers/repositories/photo.repository";
export declare class PhotosService {
    private photosRepo;
    private uploadPath;
    constructor(photosRepo: PhotoRepository);
    private sanitizeFilename;
    upload(file: Express.Multer.File, reportId: string, type: string): Promise<{
        id: string;
        createdAt: Date;
        reportId: string;
        url: string;
        type: import(".prisma/client").$Enums.PhotoType;
    }>;
    findByReport(reportId: string): Promise<{
        id: string;
        createdAt: Date;
        reportId: string;
        url: string;
        type: import(".prisma/client").$Enums.PhotoType;
    }[]>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        reportId: string;
        url: string;
        type: import(".prisma/client").$Enums.PhotoType;
    }>;
}
