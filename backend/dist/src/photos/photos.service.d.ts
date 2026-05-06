import { PrismaService } from "../prisma.service";
export declare class PhotosService {
    private prisma;
    private uploadPath;
    constructor(prisma: PrismaService);
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
