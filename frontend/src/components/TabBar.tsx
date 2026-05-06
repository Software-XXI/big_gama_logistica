'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', icon: '🏠', label: 'Inicio' },
  { href: '/reports', icon: '📋', label: 'Reportes' },
  { href: '/inventory', icon: '📦', label: 'Inventario' },
  { href: '/profile', icon: '👤', label: 'Perfil' },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} className={`tab-item ${pathname === tab.href ? 'active' : ''}`}>
          <span className="tab-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}