'use client';

import { useActionState } from 'react';
import { login } from '../actions';
import Link from 'next/link';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'var(--bg-primary)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '8px' }}>
            ♻️ web<span>Sampah</span>
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Masuk untuk mengakses dashboard pelaporan
          </p>
        </div>

        {state?.error && (
          <div className="alert alert-error">
            <span>⚠️ {state.error}</span>
          </div>
        )}

        <form action={formAction}>
          <div className="form-group">
            <label htmlFor="email">Alamat Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="admin@websampah.com atau user@websampah.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="admin123 / user123"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={isPending}
          >
            {isPending ? 'Masuk...' : 'Masuk Dashboard'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--color-text-muted)' }}>
          Belum punya akun? <Link href="/register" style={{ fontWeight: '600' }}>Daftar di sini</Link>
        </p>

        <div style={{ marginTop: '24px', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border-color)', fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
          <strong>Info Login Demo:</strong><br />
          • Admin: <code>admin@websampah.com</code> / <code>admin123</code><br />
          • User: <code>user@websampah.com</code> / <code>user123</code>
        </div>
      </div>
    </div>
  );
}
