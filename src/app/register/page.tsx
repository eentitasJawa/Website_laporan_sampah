'use client';

import { useActionState } from 'react';
import { register } from '../actions';
import Link from 'next/link';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, null);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'var(--bg-primary)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '8px' }}>
            ♻️ web<span>Sampah</span>
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Daftar akun baru untuk mulai mengirim laporan
          </p>
        </div>

        {state?.error && (
          <div className="alert alert-error">
            <span>⚠️ {state.error}</span>
          </div>
        )}

        <form action={formAction}>
          <div className="form-group">
            <label htmlFor="nama">Nama Lengkap</label>
            <input
              type="text"
              id="nama"
              name="nama"
              className="form-input"
              placeholder="Masukkan nama lengkap Anda"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Alamat Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="contoh@domain.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="noHp">Nomor HP</label>
            <input
              type="tel"
              id="noHp"
              name="noHp"
              className="form-input"
              placeholder="08123456789"
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
              placeholder="Minimal 6 karakter"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={isPending}
          >
            {isPending ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--color-text-muted)' }}>
          Sudah punya akun? <Link href="/login" style={{ fontWeight: '600' }}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
