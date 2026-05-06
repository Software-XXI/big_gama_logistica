import { db } from '@/lib/db';
import type { Product } from '@/types';

interface ProductWithStock extends Product {
  quantity?: number;
  location?: string;
  minStock?: number;
}

export async function getAllInventoryItems(): Promise<ProductWithStock[]> {
  const allProducts = await db.products.toArray();
  return allProducts.filter(p => p.isActive === true);
}

export async function addInventoryItem(data: Omit<ProductWithStock, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
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

export async function updateInventoryItem(id: string, data: Partial<ProductWithStock>) {
  await db.products.update(id, { ...data, updatedAt: new Date() });
  await addToSyncQueue('UPDATE_PRODUCT', { id, ...data });
}

export async function deleteInventoryItem(id: string) {
  await db.products.update(id, { isActive: false, updatedAt: new Date() });
  await addToSyncQueue('DELETE_PRODUCT', { id });
}

export async function getInventoryItem(id: string): Promise<ProductWithStock | undefined> {
  return db.products.get(id);
}

export async function getInventoryStats() {
  const items = await getAllInventoryItems();
  
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalCapacity = totalItems * 100;
  const capacityPercent = totalCapacity > 0 ? Math.round((totalQuantity / totalCapacity) * 100) : 0;
  
  const criticalStock = items.filter(item => 
    item.quantity !== undefined && 
    item.minStock !== undefined && 
    item.quantity <= item.minStock
  ).length;
  
  return {
    totalItems,
    totalQuantity,
    capacityPercent,
    criticalStock,
  };
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