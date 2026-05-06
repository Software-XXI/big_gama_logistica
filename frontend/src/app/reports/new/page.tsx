'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductSelector } from '@/components/ProductSelector';
import { Camera } from '@/components/Camera';
import { BitacoraEditor } from '@/components/BitacoraEditor';
import { createReport, addPhoto } from '@/repo/reports';
import type { PhotoType } from '@/types';

export default function NewReport() {
  const router = useRouter();
  const [items, setItems] = useState<{ productId: string; productName: string; quantity: number }[]>([]);
  const [bitacora, setBitacora] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);

  async function handleSaveDraft() {
    setIsSaving(true);
    
    const id = reportId || crypto.randomUUID();
    const now = new Date();
    const code = `REP-${Date.now().toString(36).toUpperCase()}`;
    
    try {
      const reportItems = items
        .filter(item => item.quantity > 0)
        .map(item => ({
          reportId: id,
          productId: item.productId,
          productName: item.productName,
          productSku: '',
          quantity: item.quantity,
        }));
      
      const photoIds: string[] = [];
      for (const photoData of photos) {
        const photoId = await addPhoto(id, photoData, 'EVIDENCE');
        photoIds.push(photoId);
      }
      
      await createReport({
        code,
        status: 'DRAFT',
        operatorId: 'demo-operator',
        bitacora,
        items: reportItems,
        photoIds,
      });
      
      router.push('/reports');
    } finally {
      setIsSaving(false);
    }
  }

  function handlePhotoCapture(photo: string, _type: PhotoType) {
    setPhotos(prev => [...prev, photo]);
  }

  function removePhoto(index: number) {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <main className="container">
      <header style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => router.back()} style={{ fontSize: 24 }}>←</button>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>Nuevo Reporte</h1>
      </header>

      <ProductSelector onSelect={setItems} />

      <Camera reportId={reportId || ''} onCapture={handlePhotoCapture} />

      {photos.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Fotos ({photos.length})</h3>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
            {photos.map((photo, i) => (
              <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
                <img src={photo} alt={`Foto ${i + 1}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                <button onClick={() => removePhoto(i)} style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%', background: 'var(--error)', color: 'white', fontSize: 14 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <BitacoraEditor onChange={setBitacora} initialContent={bitacora} />

      <div style={{ display: 'flex', gap: 12, marginTop: 16, marginBottom: 80 }}>
        <button onClick={() => router.back()} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
        <button onClick={handleSaveDraft} className="btn btn-primary" style={{ flex: 1 }} disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </main>
  );
}