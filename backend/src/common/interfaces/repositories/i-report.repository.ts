import { Report, ReportItem, Photo, AuditLog, ReportStatus, PhotoType, Prisma } from '@prisma/client';

export interface CreateReportDto {
  code: string;
  title?: string;
  operatorId: string;
  companionId?: string;
  conductorId?: string;
  bitacora?: string;
  latitude?: number;
  longitude?: number;
  items?: { productId: string; quantity: number }[];
  photos?: { url: string; type?: PhotoType }[];
}

export interface UpdateReportDto {
  title?: string;
  companionId?: string;
  status?: ReportStatus;
  bitacora?: string;
  latitude?: number;
  longitude?: number;
}

export interface SyncUpdateReportDto {
  title?: string;
  companionId?: string;
  bitacora?: string;
  latitude?: number;
  longitude?: number;
  status?: ReportStatus;
  items?: { productId: string; quantity: number }[];
  photos?: { id: string; url: string; type?: PhotoType }[];
}

export interface IReportRepository {
  create(dto: CreateReportDto): Promise<Report & { items: ReportItem[]; photos: Photo[]; operator?: { id: string; name: string }; companion?: { id: string; name: string } | null; conductor?: { id: string; name: string } | null }>;
  findAll(status?: ReportStatus): Promise<Report[]>;
  findAllForUser(userId: string): Promise<Report[]>;
  findOne(id: string): Promise<Report & { items: ReportItem[]; photos: Photo[]; operator?: { id: string; name: string; email: string }; companion?: { id: string; name: string; email: string } | null; conductor?: { id: string; name: string; email: string } | null; audits: AuditLog[] }>;
  update(id: string, dto: UpdateReportDto): Promise<Report>;
  addItems(id: string, items: { productId: string; quantity: number }[]): Promise<Report & { items: ReportItem[] }>;
  replaceItems(id: string, items: { productId: string; quantity: number }[]): Promise<Report & { items: ReportItem[] }>;
  findByCode(code: string): Promise<Report & { items: ReportItem[]; photos: Photo[] } | null>;
  createAuditLog(reportId: string, userId: string, action: string, details: unknown): Promise<AuditLog>;
  syncUpdate(code: string, dto: SyncUpdateReportDto): Promise<Report>;
  delete(id: string): Promise<void>;
  findAllOperators(): Promise<{ id: string; name: string; email: string }[]>;
}