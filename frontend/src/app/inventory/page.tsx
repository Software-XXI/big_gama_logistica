'use client';

import { useState, useEffect } from 'react';
import { TabBar } from '@/components/TabBar';
import { InventoryItem } from '@/components/InventoryItem';
import { InventoryModal } from '@/components/InventoryModal';
import { 
  getAllInventoryItems, 
  addInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from '@/repo/inventory';
import { clearFailedSyncItems } from '@/lib/db';
import type { Product } from '@/types';

export default function InventoryPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItems();
    clearFailedSyncItems();
  }, []);

  async function loadItems() {
    setIsLoading(true);
    const data = await getAllInventoryItems();
    setItems(data);
    setIsLoading(false);
  }

  async function handleSave(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    if (editingItem) {
      await updateInventoryItem(editingItem.id, data);
    } else {
      await addInventoryItem(data);
    }
    await loadItems();
    setShowModal(false);
    setEditingItem(null);
  }

  async function handleDelete(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este item?')) {
      await deleteInventoryItem(id);
      await loadItems();
    }
  }

  function handleEdit(item: Product) {
    setEditingItem(item);
    setShowModal(true);
  }

  function handleAddNew() {
    setEditingItem(null);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingItem(null);
  }

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="container">
      <div className="inventory-header">
        <h1 className="inventory-title">Inventario</h1>
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Añadir
        </button>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Buscar items..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <p>Cargando inventario...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ color: 'var(--foreground-light)', marginBottom: 16 }}>
            {searchQuery ? 'No se encontraron items' : 'No hay items en el inventario'}
          </p>
          {!searchQuery && (
            <button className="btn btn-primary" onClick={handleAddNew}>
              Añadir primer item
            </button>
          )}
        </div>
      ) : (
        <div className="inventory-grid">
          {filteredItems.map(item => (
            <InventoryItem
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <InventoryModal
          item={editingItem}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}

      <TabBar />
    </main>
  );
}