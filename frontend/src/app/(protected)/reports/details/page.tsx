'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TabBar } from '@/components/TabBar';
import { getReport, getPhotos, updateReport, deleteReport } from '@/repo/reports';
import type { Report, Photo } from '@/types';

function ReportDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
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
    await updateReport(report.id, { status: 'COMPLETED' });
    await loadReport(report.id);
  }

  async function handleDelete() {
    if (!report || !confirm('¿Eliminar reporte?')) return;
    await deleteReport(report.id);
    router.push('/reports');
  }

  async function handleEdit() {
    if (!report) return;
    await updateReport(report.id, { status: 'DRAFT' });
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
      <header className="page-header">
        <button 
          className="back-button"
          onClick={() => router.push('/reports')}
        >
          <span className="back-icon">←</span>
          <span className="back-text">Volver</span>
        </button>
        <h1 className="page-title">{report.code}</h1>
      </header>

      <div className="card" style={{ marginBottom: 16 }}>
        {report.title && (
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
            {report.title}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span>Estado</span>
          <span className={`status-badge status-${report.status.toLowerCase()}`}>{report.status}</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div>👤 <strong>Operador:</strong> {report.operatorName || report.operatorId}</div>
          {report.companionName && (
            <div>+ 👤 <strong>Acompañante:</strong> {report.companionName}</div>
          )}
          {report.conductorName && (
            <div>🚛 <strong>Conductor:</strong> {report.conductorName}</div>
          )}
        </div>
        <p style={{ fontSize: 12, color: 'var(--foreground-light)', marginTop: 12 }}>
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

export default function ReportDetailsPage() {
  return (
    <Suspense fallback={<main className="container"><p>Cargando...</p></main>}>
      <ReportDetailsContent />
    </Suspense>
  );
}