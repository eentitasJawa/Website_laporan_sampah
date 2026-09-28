'use client';

import { useActionState, startTransition, useEffect, useRef } from 'react';
import { submitReport } from '../../actions';

interface FormProps {
  wilayahList: { id: string; namaWilayah: string }[];
  jenisSampahList: { id: string; namaJenis: string }[];
}

export default function ReportForm({ wilayahList, jenisSampahList }: FormProps) {
  const [state, formAction, isPending] = useActionState(submitReport, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear form on success
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      // Reload page to refresh report list
      window.location.reload();
    }
  }, [state]);

  return (
    <div className="card">
      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: 'var(--color-primary)' }}>
        Buat Laporan Baru
      </h3>

      {state?.error && (
        <div className="alert alert-error">
          <span>⚠️ {state.error}</span>
        </div>
      )}

      {state?.success && (
        <div className="alert alert-success">
          <span>✅ {state.success}</span>
        </div>
      )}

      <form ref={formRef} action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="wilayahId">Lokasi Wilayah</label>
          <select id="wilayahId" name="wilayahId" className="form-input" required defaultValue="">
            <option value="" disabled>Pilih Wilayah Laporan</option>
            {wilayahList.map((w) => (
              <option key={w.id} value={w.id}>
                {w.namaWilayah}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="jenisSampahId">Jenis Sampah</label>
          <select id="jenisSampahId" name="jenisSampahId" className="form-input" required defaultValue="">
            <option value="" disabled>Pilih Jenis Sampah</option>
            {jenisSampahList.map((j) => (
              <option key={j.id} value={j.id}>
                {j.namaJenis}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="fotoUrl">URL Foto Sampah</label>
          <input
            type="url"
            id="fotoUrl"
            name="fotoUrl"
            className="form-input"
            placeholder="https://images.unsplash.com/... atau link foto lainnya"
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="deskripsi">Deskripsi Laporan</label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            className="form-input"
            rows={4}
            placeholder="Jelaskan detail tumpukan sampah, patokan lokasi, dll."
            required
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '8px' }}
          disabled={isPending}
        >
          {isPending ? 'Mengirim...' : 'Kirim Laporan'}
        </button>
      </form>
    </div>
  );
}
