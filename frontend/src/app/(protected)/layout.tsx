'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      redirect('/login');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0f0f0f',
        color: '#fff'
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}