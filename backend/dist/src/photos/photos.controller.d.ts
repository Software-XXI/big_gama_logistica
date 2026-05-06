import { PhotosService } from './photos.service';
export declare class PhotosController {
    private readonly photosService;
    constructor(photosService: PhotosService);
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
