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
      <header className="page-header">
        <h1 className="page-title">Reportes</h1>
      </header>

      <div className="filter-bar">
        {(['all', 'DRAFT', 'SYNCED', 'COMPLETED'] as const).map(status => (
          <button key={status} onClick={() => setFilter(status)} className={`btn ${filter === status ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '8px 16px', fontSize: 14 }}>
            {status === 'all' ? 'Todos' : status}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ color: 'var(--foreground-light)', marginBottom: 16 }}>No hay reportes</p>
          <Link href="/reports/new" className="btn btn-primary">Crear Reporte</Link>
        </div>
      ) : (
        <div className="reports-list">
          {filtered.map(report => (
            <Link key={report.id} href={`/reports/details?id=${report.id}`} className="card report-card">
              <div className="report-card-header">
                <div>
                  {report.title ? (
                    <div className="report-title">{report.title}</div>
                  ) : null}
                  <div className="report-code">{report.code}</div>
                  <div className="report-date">
                    {new Date(report.createdAt).toLocaleString('es-CO')}
                  </div>
                </div>
                <span className={`status-badge status-${report.status.toLowerCase()}`}>
                  {report.status}
                </span>
              </div>
              
              <div className="report-meta">
                <span className="meta-operator">
                  👤 {report.operatorName || report.operatorId}
                </span>
                {report.companionName && (
                  <span className="meta-companion">
                    + 👤 {report.companionName}
                  </span>
                )}
                {report.conductorName && (
                  <span className="meta-conductor">
                    🚛 {report.conductorName}
                  </span>
                )}
              </div>
              
              {report.bitacora && (
                <p className="report-bitacora">
                  {report.bitacora}
                </p>
              )}
              <div className="report-stats">
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
      >
        +
      </Link>

      <TabBar />
    </main>
  );
}