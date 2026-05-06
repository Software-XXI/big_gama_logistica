'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TabBar } from '@/components/TabBar';
import { getAllReports } from '@/repo/reports';
import type { Report } from '@/types';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<'all' | 'DRAFT' | 'SYNCED' | 'COMPLETED'>('all');

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    const data = await getAllReports();
    setReports(data);
  }

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);

  return (
    <main className="container">
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Reportes</h1>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
          {(['all', 'DRAFT', 'SYNCED', 'COMPLETED'] as const).map(status => (
            <button key={status} onClick={() => setFilter(status)} className={`btn ${filter === status ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '8px 16px', fontSize: 14 }}>
              {status === 'all' ? 'Todos' : status}
            </button>
          ))}
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ color: 'var(--foreground-light)', marginBottom: 16 }}>No hay reportes</p>
          <Link href="/reports/new" className="btn btn-primary">Crear Reporte</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(report => (
            <Link key={report.id} href={`/reports/details?id=${report.id}`} className="card" style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{report.code}</div>
                  <div style={{ fontSize: 12, color: 'var(--foreground-light)' }}>
                    {new Date(report.createdAt).toLocaleString('es-CO')}
                  </div>
                </div>
                <span className={`status-badge status-${report.status.toLowerCase()}`}>
                  {report.status}
                </span>
              </div>
              {report.bitacora && (
                <p style={{ fontSize: 14, color: 'var(--foreground-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {report.bitacora}
                </p>
              )}
              <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: 'var(--foreground-light)' }}>
                <span>📦 {report.items?.length || 0} items</span>
                <span>📷 {report.photoIds?.length || 0} fotos</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/reports/new"
        className="fab"
        style={{ bottom: '90px' }}
      >
        +
      </Link>


      <TabBar />
    </main>
  );
}