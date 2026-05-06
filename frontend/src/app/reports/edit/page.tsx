'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductSelector } from '@/components/ProductSelector';
import { Camera } from '@/components/Camera';
import { BitacoraEditor } from '@/components/BitacoraEditor';
import { getReport, getPhotos, addPhoto, updateReport, updateReportItemsAndPhotos } from '@/repo/reports';
import { getOperatorsCached } from '@/repo/operators';
import type { PhotoType, Operator, Report } from '@/types';
import { useAuth } from '@/lib/auth-context';

interface ReportWithFields extends Report {
  companionId?: string;
  companionName?: string;
  conductorName?: string;
}

export default function EditReportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = searchParams.get('id');
  
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<{ productId: string; productName: string; quantity: number }[]>([]);
  const [initialItems, setInitialItems] = useState<{ productId: string; productName: string; quantity: number }[]>([]);
  const [bitacora, setBitacora] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [initialPhotos, setInitialPhotos] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [operators, setOperators] = useState<Operator[]>([]);
  const [companionId, setCompanionId] = useState<string>('');
  const [companionName, setCompanionName] = useState<string>('');
  const [conductorName, setConductorName] = useState('');
  const [isLoadingOperators, setIsLoadingOperators] = useState(true);

  useEffect(() => {
    async function loadOperators() {
      const ops = await getOperatorsCached();
      const otherOperators = ops.filter(op => op.id !== user?.id);
      setOperators(otherOperators);
      setIsLoadingOperators(false);
    }
    if (user) {
      loadOperators();
    }
  }, [user]);

  useEffect(() => {
    if (id) loadReport(id);
  }, [id]);

  async function loadReport(reportId: string) {
    const report = await getReport(reportId) as ReportWithFields | null;
    if (report) {
      setTitle(report.title || '');
      setBitacora(report.bitacora || '');
      setCompanionId(report.companionId || '');
      setCompanionName(report.companionName || '');
      setConductorName(report.conductorName || '');
      
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
      await updateReport(id, { 
        bitacora,
        title: title || undefined,
        companionId: companionId || undefined,
        companionName: companionName || undefined,
        conductorName: conductorName || undefined,
      });

      await updateReportItemsAndPhotos(id, items, photos);

      router.push(`/reports/details?id=${id}`);
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Error al guardar el reporte. Por favor intente nuevamente.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleCompanionChange(newCompanionId: string) {
    setCompanionId(newCompanionId);
    const selectedOp = operators.find(op => op.id === newCompanionId);
    setCompanionName(selectedOp?.name || '');
  }

  function handlePhotoCapture(photo: string, _type: PhotoType) {
    setPhotos(prev => [...prev, photo]);
  }

  function removePhoto(index: number) {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <main className="container">
      <header className="page-header">
        <button 
          className="back-button"
          onClick={() => router.back()}
        >
          <span className="back-icon">←</span>
          <span className="back-text">Volver</span>
        </button>
        <h1 className="page-title">Editar Reporte</h1>
      </header>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <h3 className="card-title">Información del Reporte</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
              Título del reporte
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Entrega Zona Norte - Lunes"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 14,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--background)',
                color: 'var(--foreground)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <h3 className="card-title">Equipo de Trabajo</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
              Operador principal
            </label>
            <input
              type="text"
              value={user?.name || 'Cargando...'}
              disabled
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 14,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--muted)',
                color: 'var(--foreground-light)',
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
              Operador acompañante (opcional)
            </label>
            {isLoadingOperators ? (
              <input
                type="text"
                disabled
                placeholder="Cargando operadores..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 14,
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                }}
              />
            ) : (
              <select
                value={companionId}
                onChange={(e) => handleCompanionChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 14,
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                }}
              >
                <option value="">Sin acompañante</option>
                {operators.map(op => (
                  <option key={op.id} value={op.id}>{op.name}</option>
                ))}
              </select>
            )}
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
              Conductor (opcional)
            </label>
            <input
              type="text"
              value={conductorName}
              onChange={(e) => setConductorName(e.target.value)}
              placeholder="Nombre del conductor"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 14,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--background)',
                color: 'var(--foreground)',
              }}
            />
          </div>
        </div>
      </div>

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