'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { getAllProducts } from '@/repo/reports';

const DEMO_PRODUCTS: Product[] = [
  { id: '1', name: 'Tótem', category: 'PROMO', sku: 'TOT-001', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Hielera', category: 'EQUIPO', sku: 'HIE-001', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Banderín', category: 'PROMO', sku: 'BAND-001', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', name: 'Cama elástica', category: 'ACTIVACION', sku: 'CAMA-001', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '5', name: 'Mesa promocional', category: 'MOBILIARIO', sku: 'MESA-001', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '6', name: 'Silla gamer', category: 'MOBILIARIO', sku: 'SILLA-001', isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

interface Props {
  onSelect: (items: { productId: string; productName: string; quantity: number }[]) => void;
  initialItems?: { productId: string; productName: string; quantity: number }[];
}

export function ProductSelector({ onSelect, initialItems = [] }: Props) {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [selected, setSelected] = useState<Map<string, number>>(new Map());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    getAllProducts().then((cached) => {
      if (cached.length > 0) setProducts(cached);
    });
    
    const map = new Map<string, number>();
    initialItems.forEach(item => map.set(item.productId, item.quantity));
    setSelected(map);
  }, []);

  useEffect(() => {
    const items = Array.from(selected.entries()).map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return { productId, productName: product?.name || '', quantity };
    }).filter(item => item.quantity > 0);
    onSelect(items);
  }, [selected]);

  function updateQuantity(productId: string, delta: number) {
    const current = selected.get(productId) || 0;
    const next = Math.max(0, current + delta);
    setSelected(new Map(selected).set(productId, next));
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Productos</h3>
        <button onClick={() => setIsExpanded(!isExpanded)} style={{ color: 'var(--primary)', fontSize: 14 }}>
          {isExpanded ? 'Ocultar' : 'Ver todos'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {products.slice(0, isExpanded ? products.length : 3).map(product => (
          <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 500 }}>{product.name}</div>
              <div style={{ fontSize: 12, color: 'var(--foreground-light)' }}>{product.sku}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => updateQuantity(product.id, -1)} className="btn btn-secondary" style={{ width: 40, height: 40, padding: 0, fontSize: 20 }}>−</button>
              <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 600, fontSize: 18 }}>{selected.get(product.id) || 0}</span>
              <button onClick={() => updateQuantity(product.id, 1)} className="btn btn-secondary" style={{ width: 40, height: 40, padding: 0, fontSize: 20 }}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}