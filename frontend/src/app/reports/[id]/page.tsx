'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TabBar } from '@/components/TabBar';
import { getReport, getPhotos } from '@/repo/reports';
import type { Report, Photo } from '@/types';

export default function ReportDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (id) loadReport(id);
  }, [id]);

  async function loadReport(reportId: string) {
    const data = await getReport(reportId);
    setReport(data || null);
    const photosData = await getPhotos(reportId);
    setPhotos(photosData);
  }

  async function handleComplete() {
    if (!report || !confirm('¿Marcar como completado?')) return;
    // Need to import updateReport
    const { updateReport } = await import('@/repo/reports');
    await updateReport(report.id, { status: 'COMPLETED' });
    await loadReport(report.id);
  }

  async function handleDelete() {
    if (!report || !confirm('¿Eliminar reporte?')) return;
    const { deleteReport } = await import('@/repo/reports');
    await deleteReport(report.id);
    router.push('/reports');
  }

  async function handleEdit() {
    if (!report) return;
    router.push(`/reports/edit?id=${report.id}`);
  }

  if (!report) {
    return (
      <main className="container">
        <p>Cargando...</p>
        <TabBar />
      </main>
    );
  }

  return (
    <main className="container">
      <header style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => router.back()} style={{ fontSize: 24 }}>←</button>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>{report.code}</h1>
      </header>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Estado</span>
          <span className={`status-badge status-${report.status.toLowerCase()}`}>{report.status}</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--foreground-light)', marginTop: 8 }}>
          Creado: {new Date(report.createdAt).toLocaleString('es-CO')}
        </p>
      </div>

      {report.bitacora && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 className="card-title">Bitácora</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{report.bitacora}</p>
        </div>
      )}

      {photos.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 className="card-title">Fotos ({photos.length})</h3>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {photos.map(photo => (
              <img key={photo.id} src={photo.data} alt="" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="card-title">Items ({report.items?.length || 0})</h3>
        {report.items?.length === 0 ? (
          <p style={{ color: 'var(--foreground-light)' }}>Sin items</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {report.items?.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{item.productName || item.productId}</span>
                <span style={{ fontWeight: 600 }}>x{item.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 16, marginBottom: 80 }}>
        <button onClick={handleDelete} className="btn btn-secondary" style={{ flex: 1, background: 'var(--error)' }}>
          Eliminar
        </button>
        {report.status !== 'COMPLETED' && (
          <>
            <button onClick={handleEdit} className="btn btn-secondary" style={{ flex: 1 }}>
              Editar
            </button>
            <button onClick={handleComplete} className="btn btn-primary" style={{ flex: 1 }}>
              Completar
            </button>
          </>
        )}
      </div>

      <TabBar />
    </main>
  );
}