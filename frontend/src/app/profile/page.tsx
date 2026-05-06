'use client';

import { useRouter } from 'next/navigation';
import { TabBar } from '@/components/TabBar';
import { useAuth } from '@/lib/auth-context';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <main className="container">
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Perfil</h1>
      </header>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{user?.name || 'Usuario'}</div>
            <div style={{ color: 'var(--foreground-light)' }}>{user?.email}</div>
            <span className="status-badge" style={{ background: 'var(--primary)', color: 'white', marginTop: 4, display: 'inline-block' }}>
              {user?.role}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            ⚙️ Configuración
          </button>
          <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            📤 Exportar Datos
          </button>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ justifyContent: 'flex-start', color: 'var(--error)' }}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      <TabBar />
    </main>
  );
}