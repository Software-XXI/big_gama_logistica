'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TabBar } from '@/components/TabBar';
import { getAllReports } from '@/repo/reports';
import { useAuth } from '@/lib/auth-context';
import type { Report } from '@/types';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ total: 0, syncing: 0, completed: 0 });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function loadData() {
    const reports = await getAllReports();
    setRecentReports(reports.slice(0, 3));
    setStats({
      total: reports.length,
      syncing: reports.filter(r => r.status === 'DRAFT' || r.status === 'SYNCED').length,
      completed: reports.filter(r => r.status === 'COMPLETED').length,
    });
  }

  if (isLoading || !user) return null;

  return (
    <main className="container">
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Big Gamma</h1>
        <p style={{ color: 'var(--foreground-light)' }}>Gestión de Logística</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.total}</div>
          <div style={{ fontSize: 12, color: 'var(--foreground-light)' }}>Total</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--warning)' }}>{stats.syncing}</div>
          <div style={{ fontSize: 12, color: 'var(--foreground-light)' }}>Pendientes</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--success)' }}>{stats.completed}</div>
          <div style={{ fontSize: 12, color: 'var(--foreground-light)' }}>Completados</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Reportes Recientes</h2>
          <Link href="/reports" style={{ color: 'var(--primary)', fontSize: 14 }}>Ver todos</Link>
        </div>

        {recentReports.length === 0 ? (
          <p style={{ color: 'var(--foreground-light)', textAlign: 'center', padding: 24 }}>
            No hay reportes yet. Crea el primero.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentReports.map((report) => (
              <Link key={report.id} href={`/reports/details?id=${report.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--surface-dark)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{report.code}</div>
                  <div style={{ fontSize: 12, color: 'var(--foreground-light)' }}>
                    {new Date(report.createdAt).toLocaleDateString('es-CO')}
                  </div>
                </div>
                <span className={`status-badge status-${report.status.toLowerCase()}`}>
                  {report.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

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