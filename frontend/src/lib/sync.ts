import { db } from '@/lib/db';
import { getSyncQueue, updateSyncQueueItem, removeSyncQueueItem } from '@/repo/reports';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface SyncResult {
  success: boolean;
  processed: number;
  errors: string[];
}

export async function syncPendingData(): Promise<SyncResult> {
  if (!navigator.onLine) {
    return { success: false, processed: 0, errors: ['Sin conexión'] };
  }
  
  const queue = await getSyncQueue();
  const errors: string[] = [];
  let processed = 0;

  for (const item of queue) {
    if (item.status === 'SYNCING') continue;
    
    try {
      if (item.retryCount >= 3) {
        console.warn(`Item ${item.id} exceeded max retries, skipping`);
        continue;
      }
      
      await updateSyncQueueItem(item.id, 'SYNCING');
      
      await processSyncItem(item);
      
      await removeSyncQueueItem(item.id);
      processed++;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Sync error for ${item.id}:`, errorMsg);
      errors.push(`${item.type}: ${errorMsg}`);
      await updateSyncQueueItem(item.id, 'FAILED', item.retryCount + 1);
    }
  }

  return { success: errors.length === 0, processed, errors };
}

async function processSyncItem(item: { type: string; payload: unknown }) {
  switch (item.type) {
    case 'CREATE_REPORT':
    case 'UPDATE_REPORT':
      await syncReport(item.payload as { id: string });
      break;
    case 'ADD_PHOTO':
      await syncPhoto(item.payload as { id: string; reportId: string });
      break;
    case 'CREATE_PRODUCT':
    case 'UPDATE_PRODUCT':
      await syncProduct(item.payload as { id: string });
      break;
    case 'DELETE_PRODUCT':
      await syncDeleteProduct(item.payload as { id: string });
      break;
  }
}

async function syncReport(data: { id: string }) {
  const report = await db.reports.get(data.id);
  if (!report) return;

  const items = await db.reportItems.where('reportId').equals(data.id).toArray();
  
  await fetch(`${API_URL}/reports/sync`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    },
    body: JSON.stringify({
      id: report.id,
      code: report.code,
      status: 'SYNCED',
      operatorId: report.operatorId,
      conductorId: report.conductorId,
      bitacora: report.bitacora,
      latitude: report.latitude,
      longitude: report.longitude,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    }),
  });

  await db.reports.update(data.id, { status: 'SYNCED', syncedAt: new Date() });
}

async function syncPhoto(data: { id: string; reportId: string }) {
  const photo = await db.photos.get(data.id);
  if (!photo) {
    console.warn(`Photo ${data.id} not found`);
    return;
  }

  try {
    const blob = dataURItoBlob(photo.data);
    const formData = new FormData();
    formData.append('photo', blob, `${photo.id}.jpg`);
    formData.append('reportId', data.reportId);
    formData.append('type', photo.type);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/photos/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    console.log(`Photo ${photo.id} uploaded successfully`);
  } catch (error) {
    console.error(`Error uploading photo ${photo.id}:`, error);
    throw error;
  }
}

async function syncProduct(data: { id: string }) {
  const product = await db.products.get(data.id);
  if (!product) return;

  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      name: product.name,
      category: product.category,
      sku: product.sku,
      image: product.image,
    }),
  });

  if (!response.ok) {
    throw new Error(`Product sync failed: ${response.status}`);
  }

  console.log(`Product ${product.id} synced successfully`);
}

async function syncDeleteProduct(data: { id: string }) {
  const product = await db.products.get(data.id);
  if (!product) return;

  const token = localStorage.getItem('token');
  
  await fetch(`${API_URL}/products/${data.id}/deactivate`, {
    method: 'PATCH',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  });

  console.log(`Product ${data.id} deactivated on backend`);
}

function dataURItoBlob(dataURI: string): Blob {
  const mimeMatch = dataURI.match(/data:([^;]+);/);
  const mimeString = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  
  const base64 = dataURI.split(',')[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeString });
}

let syncInterval: ReturnType<typeof setInterval> | undefined;
let isSyncing = false;

export function startAutoSync(intervalMs = 30000) {
  if (syncInterval) clearInterval(syncInterval);

  const runSync = async () => {
    if (isSyncing || !navigator.onLine) return;
    
    isSyncing = true;
    try {
      await syncPendingData();
    } finally {
      isSyncing = false;
    }
  };

  syncInterval = setInterval(runSync, intervalMs);
  
  window.addEventListener('online', () => {
    console.log('Connection restored, syncing...');
    runSync();
  });

  console.log('Auto-sync started');
}

export function stopAutoSync() {
  if (syncInterval) clearInterval(syncInterval);
  syncInterval = undefined;
  window.removeEventListener('online', () => syncPendingData());
  console.log('Auto-sync stopped');
}

export async function forceSyncNow(): Promise<SyncResult> {
  return syncPendingData();
}