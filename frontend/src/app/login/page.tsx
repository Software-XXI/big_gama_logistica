"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      router.push("/");
    } else {
      setError("Email o contraseña inválidos");
    }
  }

  return (
    <main className="split-container">
      <div className="split-left">
        <div className="brand-side">
          <div className="logo-mark">
            <svg viewBox="0 0 60 60" width="80" height="80">
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#F01B43" />
                </linearGradient>
              </defs>
              <polygon
                points="30,5 55,50 30,40 5,50"
                fill="url(#logoGradient)"
              />
              <polygon
                points="30,20 45,50 30,42 15,50"
                fill="url(#logoGradient)"
                opacity="0.7"
              />
            </svg>
          </div>
          <h1 className="brand-title">BIG GAMMA</h1>
          <p className="brand-tagline">Logística de siguiente nivel</p>
        </div>
        <div className="bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
      </div>

      <div className="split-right">
        <div className="form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <h2
              style={{ marginBottom: 24, textAlign: "center", fontWeight: 700 }}
            >
              Iniciar Sesión
            </h2>

            {error && (
              <div
                style={{
                  padding: 12,
                  background: "#fee2e2",
                  color: "#991b1b",
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            <div className="input-group">
              <label>Correo</label>
              <div className="input-with-icon">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <div className="input-with-icon">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Iniciando..." : "Entrar"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 24,
              color: "var(--foreground-light)",
            }}
          >
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              style={{ color: "var(--primary)", fontWeight: 600 }}
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
