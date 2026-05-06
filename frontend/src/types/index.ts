export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  isActive: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportItem {
  id: string;
  reportId: string;
  productId: string;
  productName?: string;
  productSku?: string;
  quantity: number;
  createdAt: Date;
}

export interface Photo {
  id: string;
  reportId: string;
  data: string;
  type: PhotoType;
  createdAt: Date;
}

export type PhotoType = 'EVIDENCE' | 'INVENTORY' | 'OTHER';

export type ReportStatus = 'DRAFT' | 'SYNCED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';

export interface Report {
  id: string;
  code: string;
  status: ReportStatus;
  operatorId: string;
  operatorName?: string;
  conductorId?: string;
  conductorName?: string;
  bitacora?: string;
  latitude?: number;
  longitude?: number;
  items?: ReportItem[];
  photoIds?: string[];
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
}

export interface SyncQueueItem {
  id: string;
  type: 'CREATE_REPORT' | 'UPDATE_REPORT' | 'ADD_PHOTO' | 'CREATE_PRODUCT' | 'UPDATE_PRODUCT' | 'DELETE_PRODUCT';
  payload: unknown;
  createdAt: Date;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR' | 'CONDUCTOR';
}