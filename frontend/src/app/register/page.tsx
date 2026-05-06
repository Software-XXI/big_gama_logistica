'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('OPERATOR');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await register(email, password, name, role);
    setLoading(false);

    if (success) {
      router.push('/');
    } else {
      setError('Error al registrar. El email puede ya estar en uso.');
    }
  }

  return (
    <main className="container" style={{ maxWidth: 400, paddingTop: 48 }}>
      <form onSubmit={handleSubmit} className="card">
        <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Crear Cuenta</h2>

        {error && (
          <div style={{ padding: 12, background: '#fee2e2', color: '#991b1b', borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div className="input-group">
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            minLength={6}
            required
          />
        </div>

        <div className="input-group">
          <label>Rol</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
            <option value="OPERATOR">Operario</option>
            <option value="CONDUCTOR">Conductor</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--foreground-light)' }}>
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" style={{ color: 'var(--primary)' }}>Inicia Sesión</Link>
      </p>
    </main>
  );
}