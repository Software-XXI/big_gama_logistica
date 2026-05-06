'use client';

import type { Product } from '@/types';

interface ProductWithStock extends Product {
  quantity?: number;
  location?: string;
  minStock?: number;
}

interface Props {
  item: ProductWithStock;
  onEdit: (item: ProductWithStock) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  'Maquinaria': '#3b82f6',
  'Electrónica': '#8b5cf6',
  'Herramientas': '#f59e0b',
  'Materiales': '#10b981',
  'Vehículos': '#ec4899',
  'default': '#6b7280',
};

export function InventoryItem({ item, onEdit, onDelete }: Props) {
  const quantity = item.quantity ?? 0;
  const minStock = item.minStock ?? 10;
  const percent = minStock > 0 ? Math.min((quantity / minStock) * 100, 100) : 100;
  
  const isCritical = minStock > 0 && quantity <= minStock;
  const barColor = isCritical ? 'var(--error)' : 'var(--success)';
  const categoryColor = categoryColors[item.category] || categoryColors.default;

  return (
    <div className="inventory-card">
      <div className="inventory-card-header">
        {item.image ? (
          <img src={item.image} alt={item.name} className="inventory-card-image" />
        ) : (
          <div className="inventory-card-placeholder">📦</div>
        )}
        <div className="inventory-card-info">
          <div className="inventory-card-name">{item.name}</div>
          <div className="inventory-card-sku">SKU: {item.sku}</div>
          {item.location && (
            <div className="inventory-card-location">📍 {item.location}</div>
          )}
        </div>
      </div>
      
      <div className="inventory-card-category">
        <span 
          className="category-badge" 
          style={{ backgroundColor: categoryColor + '20', color: categoryColor }}
        >
          {item.category || 'Sin categoría'}
        </span>
      </div>
      
      <div className="inventory-card-stock">
        <div className="stock-header">
          <span className="stock-label">Stock</span>
          <span className={`stock-value ${isCritical ? 'critical' : ''}`}>
            {quantity} (mín: {minStock})
          </span>
        </div>
        <div className="stock-bar-bg">
          <div 
            className="stock-bar-fill" 
            style={{ 
              width: `${percent}%`, 
              backgroundColor: barColor 
            }} 
          />
        </div>
        {isCritical && <span className="stock-warning">⚠️ Stock crítico</span>}
      </div>
      
      <div className="inventory-card-actions">
        <button 
          className="btn btn-sm btn-secondary"
          onClick={() => onEdit(item)}
          title="Editar Stock"
        >
          ✏️ Editar Stock
        </button>
        <button 
          className="btn btn-sm btn-ghost"
          onClick={() => onDelete(item.id)}
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}