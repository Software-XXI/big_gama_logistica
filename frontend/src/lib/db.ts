import Dexie, { type EntityTable } from 'dexie';
import type { Report, ReportItem, Photo, Product, SyncQueueItem, User } from '@/types';

interface ProductWithStock extends Product {
  quantity?: number;
  location?: string;
  minStock?: number;
}

const db = new Dexie('BigGammaLogistica') as Dexie & {
  reports: EntityTable<Report, 'id'>;
  reportItems: EntityTable<ReportItem, 'id'>;
  photos: EntityTable<Photo, 'id'>;
  products: EntityTable<ProductWithStock, 'id'>;
  users: EntityTable<User, 'id'>;
  syncQueue: EntityTable<SyncQueueItem, 'id'>;
};

db.version(1).stores({
  reports: 'id, code, status, operatorId, createdAt, syncedAt',
  reportItems: 'id, reportId, productId, createdAt',
  photos: 'id, reportId, type, createdAt',
  products: 'id, name, category, sku, isActive, location',
  users: 'id, email, name, role',
  syncQueue: 'id, type, status, createdAt',
});

export async function clearAllData() {
  await db.transaction('rw', [db.reports, db.reportItems, db.photos, db.products, db.users, db.syncQueue], async () => {
    await db.reports.clear();
    await db.reportItems.clear();
    await db.photos.clear();
    await db.products.clear();
    await db.users.clear();
    await db.syncQueue.clear();
  });
}

export async function clearFailedSyncItems() {
  try {
    const allItems = await db.syncQueue.toArray();
    const failedItems = allItems.filter(item => item.status === 'FAILED');
    for (const item of failedItems) {
      await db.syncQueue.delete(item.id);
    }
    console.log(`Cleared ${failedItems.length} failed sync items`);
    return failedItems.length;
  } catch (e) {
    console.log('No failed sync items to clear');
    return 0;
  }
}

export async function getPendingReports() {
  return db.reports.where('status').anyOf(['DRAFT', 'SYNCED']).toArray();
}

export async function getUnsyncedPhotos() {
  return db.photos.toArray();
}

export { db };