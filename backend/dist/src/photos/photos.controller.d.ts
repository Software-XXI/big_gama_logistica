import { PhotosService } from './photos.service';
export declare class PhotosController {
    private readonly photosService;
    constructor(photosService: PhotosService);
    upload(file: Express.Multer.File, reportId: string, type: string): Promise<{
        url: string;
        type: import(".prisma/client").$Enums.PhotoType;
        id: string;
        createdAt: Date;
        reportId: string;
    }>;
    findByReport(reportId: string): Promise<{
        url: string;
        type: import(".prisma/client").$Enums.PhotoType;
        id: string;
        createdAt: Date;
        reportId: string;
    }[]>;
    delete(id: string): Promise<{
        url: string;
        type: import(".prisma/client").$Enums.PhotoType;
        id: string;
        createdAt: Date;
        reportId: string;
    }>;
}
