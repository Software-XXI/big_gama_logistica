import { db } from '@/lib/db';
import type { Report, ReportItem, Photo, Product } from '@/types';

interface SyncQueueItem {
  id: string;
  type: 'CREATE_REPORT' | 'UPDATE_REPORT' | 'ADD_PHOTO';
  payload: unknown;
  createdAt: Date;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
}

export async function createReport(data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const id = crypto.randomUUID();
  const now = new Date();
  
  await db.transaction('rw', [db.reports, db.reportItems, db.photos], async () => {
    await db.reports.add({
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    });
    
    if (data.items) {
      for (const item of data.items) {
        await db.reportItems.add({
          ...item,
          id: crypto.randomUUID(),
          reportId: id,
          createdAt: now,
        });
      }
    }
  });
  
  await addToSyncQueue('CREATE_REPORT', { id, ...data });
  
  return id;
}

export async function updateReport(id: string, data: Partial<Report>) {
  await db.reports.update(id, { ...data, updatedAt: new Date() });
  await addToSyncQueue('UPDATE_REPORT', { id, ...data });
}

export async function updateReportItemsAndPhotos(
  reportId: string, 
  items: { productId: string; productName: string; quantity: number }[],
  photos: string[]
) {
  const now = new Date();
  
  await db.transaction('rw', [db.reportItems, db.photos], async () => {
    // 1. Limpiar items y fotos antiguos de este reporte específico
    await db.reportItems.where('reportId').equals(reportId).delete();
    await db.photos.where('reportId').equals(reportId).delete();
    
    // 2. Insertar los items actualizados
    for (const item of items) {
      await db.reportItems.add({
        ...item,
        id: crypto.randomUUID(),
        reportId,
        createdAt: now,
      });
    }
    // 3. Insertar las fotos actualizadas
    for (const photo of photos) {
      await db.photos.add({
        id: crypto.randomUUID(),
        reportId,
        data: photo,
        type: 'EVIDENCE', // Using EVIDENCE as default type, could be adjusted
        createdAt: now,
      });
    }
  });
  // Agregar a la cola de sincronización para que el backend sepa de este cambio
  await addToSyncQueue('UPDATE_REPORT', { 
    id: reportId, 
    items, 
    photos 
  });
}

export async function deleteReport(id: string) {
  await db.transaction('rw', [db.reports, db.reportItems, db.photos], async () => {
    await db.reportItems.where('reportId').equals(id).delete();
    await db.photos.where('reportId').equals(id).delete();
    await db.reports.delete(id);
  });
}

export async function getReport(id: string): Promise<Report | undefined> {
  const report = await db.reports.get(id);
  if (!report) return undefined;
  
  const items = await db.reportItems.where('reportId').equals(id).toArray();
  const photoIds = await db.photos.where('reportId').equals(id).primaryKeys();
  
  return { ...report, items, photoIds: photoIds as string[] };
}

export async function getAllReports(): Promise<Report[]> {
  const reports = await db.reports.orderBy('createdAt').reverse().toArray();
  
  for (const report of reports) {
    report.items = await db.reportItems.where('reportId').equals(report.id).toArray();
    const photoIds = await db.photos.where('reportId').equals(report.id).primaryKeys();
    report.photoIds = photoIds as string[];
  }
  
  return reports;
}

export async function addPhoto(reportId: string, data: string, type: Photo['type']) {
  const id = crypto.randomUUID();
  
  await db.photos.add({
    id,
    reportId,
    data,
    type,
    createdAt: new Date(),
  });
  
  await addToSyncQueue('ADD_PHOTO', { id, reportId, type });
  
  return id;
}

export async function getPhotos(reportId: string) {
  return db.photos.where('reportId').equals(reportId).toArray();
}

export async function getAllProducts(): Promise<Product[]> {
  return db.products.where('isActive').equals(1).toArray();
}

export async function saveProducts(products: Product[]) {
  await db.products.bulkPut(products);
}

async function addToSyncQueue(type: SyncQueueItem['type'], payload: unknown) {
  await db.syncQueue.add({
    id: crypto.randomUUID(),
    type,
    payload,
    createdAt: new Date(),
    retryCount: 0,
    status: 'PENDING',
  });
}

export async function getSyncQueue() {
  return db.syncQueue.where('status').anyOf(['PENDING', 'FAILED']).toArray();
}

export async function updateSyncQueueItem(id: string, status: SyncQueueItem['status'], retryCount?: number) {
  await db.syncQueue.update(id, { 
    status, 
    ...(retryCount !== undefined && { retryCount }) 
  });
}

export async function removeSyncQueueItem(id: string) {
  await db.syncQueue.delete(id);
}