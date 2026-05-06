'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductSelector } from '@/components/ProductSelector';
import { Camera } from '@/components/Camera';
import { BitacoraEditor } from '@/components/BitacoraEditor';
import { getReport, getPhotos, addPhoto, updateReport, updateReportItemsAndPhotos } from '@/repo/reports';
import type { PhotoType, ReportItem } from '@/types';

export default function EditReportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [items, setItems] = useState<{ productId: string; productName: string; quantity: number }[]>([]);
  const [bitacora, setBitacora] = useState('');
  const [initialItems, setInitialItems] = useState<{ productId: string; productName: string; quantity: number }[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [initialPhotos, setInitialPhotos] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) loadReport(id);
  }, [id]);

  async function loadReport(reportId: string) {
    const report = await getReport(reportId);
    if (report) {
      setBitacora(report.bitacora || '');
      const mappedItems = (report.items || []).map(item => ({
        productId: item.productId,
        productName: item.productName || '',
        quantity: item.quantity,
      }));
      setItems(mappedItems);
      setInitialItems(mappedItems);
      const photosData = await getPhotos(reportId);
      const mappedPhotos = photosData.map(p => p.data);
      setPhotos(mappedPhotos);
      setInitialPhotos(mappedPhotos);
    }
  }

  async function handleSave() {
    if (!id) return;
    setIsSaving(true);

    try {
      // 1. Update the basic report info (bitacora and any other top-level fields)
      await updateReport(id, { bitacora });

      // 2. Update items and photos completely (replace all)
      await updateReportItemsAndPhotos(id, items, photos);

      router.push(`/reports/details?id=${id}`);
    } catch (error) {
      console.error('Error saving report:', error);
      // Show error to user in a real app
      alert('Error al guardar el reporte. Por favor intente nuevamente.');
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
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>Editar Reporte</h1>
      </header>



      <ProductSelector onSelect={setItems} initialItems={items} />

      <Camera reportId={id || ''} onCapture={handlePhotoCapture} />

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
        <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }} disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </main>
  );
}