'use client';

import type { Product } from '@/types';

interface Props {
  item: Product;
  onEdit: (item: Product) => void;
  onDelete: (id: string) => void;
}

export function InventoryItem({ item, onEdit, onDelete }: Props) {
  return (
    <div className="inventory-item">
      {item.image ? (
        <img src={item.image} alt={item.name} className="inventory-item-image" />
      ) : (
        <div className="inventory-item-placeholder">📦</div>
      )}
      <div className="inventory-item-info">
        <div className="inventory-item-name">{item.name}</div>
        <div className="inventory-item-category">{item.category || 'Sin categoría'}</div>
      </div>
      <div className="inventory-item-overlay">
        <button 
          className="edit-btn" 
          onClick={() => onEdit(item)}
          title="Editar"
        >
          ✏️
        </button>
        <button 
          className="delete-btn"
          onClick={() => onDelete(item.id)}
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}