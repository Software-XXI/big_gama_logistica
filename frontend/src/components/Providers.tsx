'use client';

import { useEffect, useState } from 'react';
import { startAutoSync, stopAutoSync } from '@/lib/sync';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    startAutoSync(30000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      stopAutoSync();
    };
  }, []);

  return (
    <>
      <div className={`sync-indicator ${isOnline ? 'sync-online' : 'sync-offline'}`}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
        {isOnline ? 'En línea' : 'Sin conexión'}
      </div>
      {children}
    </>
  );
}