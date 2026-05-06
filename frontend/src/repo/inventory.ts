import { db } from '@/lib/db';
import type { Product } from '@/types';

export async function getAllInventoryItems(): Promise<Product[]> {
  const allProducts = await db.products.toArray();
  return allProducts.filter(p => p.isActive === true);
}

export async function addInventoryItem(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const id = crypto.randomUUID();
  const now = new Date();
  
  await db.products.add({
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
    isActive: true,
  });

  await addToSyncQueue('CREATE_PRODUCT', { id, ...data });
  
  return id;
}

export async function updateInventoryItem(id: string, data: Partial<Product>) {
  await db.products.update(id, { ...data, updatedAt: new Date() });
  await addToSyncQueue('UPDATE_PRODUCT', { id, ...data });
}

export async function deleteInventoryItem(id: string) {
  await db.products.update(id, { isActive: false, updatedAt: new Date() });
  await addToSyncQueue('DELETE_PRODUCT', { id });
}

export async function getInventoryItem(id: string): Promise<Product | undefined> {
  return db.products.get(id);
}

async function addToSyncQueue(type: 'CREATE_PRODUCT' | 'UPDATE_PRODUCT' | 'DELETE_PRODUCT', payload: unknown) {
  await db.syncQueue.add({
    id: crypto.randomUUID(),
    type,
    payload,
    createdAt: new Date(),
    retryCount: 0,
    status: 'PENDING',
  });
}