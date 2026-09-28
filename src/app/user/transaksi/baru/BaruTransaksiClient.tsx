'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createTransaksi } from '../../../actions';

interface JenisSampahOption {
  id: string;
  namaJenis: string;
  hargaPerKg: number;
}

interface BaruTransaksiClientProps {
  jenisList: JenisSampahOption[];
}

export default function BaruTransaksiClient({ jenisList }: BaruTransaksiClientProps) {
  const router = useRouter();

  const [jenisId, setJenisId] = useState<string>('');
  const [berat, setBerat] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedJenis = jenisList.find((j) => j.id === jenisId);
  const hargaPerKg = selectedJenis ? selectedJenis.hargaPerKg : 0;
  const numBerat = parseFloat(berat) || 0;
  const estimasiTotal = numBerat > 0 && hargaPerKg > 0 ? Math.round(numBerat * hargaPerKg) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!jenisId) {
      setErrorMsg('Silakan pilih jenis sampah terlebih dahulu.');
      return;
    }

    if (numBerat <= 0) {
      setErrorMsg('Berat sampah harus lebih dari 0 kg.');
      return;
    }

    setLoading(true);

    try {
      const res = await createTransaksi(jenisId, numBerat);

      if (!res.success) {
        setErrorMsg(res.message || 'Gagal membuat transaksi.');
        setLoading(false);
        return;
      }

      router.push('/user/transaksi');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      setErrorMsg(message);
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ paddingBottom: '60px' }}>
      <div
        style={{
          maxWidth: '650px',
          margin: '30px auto',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <Link
            href="/user/transaksi"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Kembali ke Riwayat Transaksi
          </Link>

          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              marginTop: '12px',
              marginBottom: '6px',
            }}
          >
            ♻️ Jual Sampah
          </h1>

          <p
            style={{
              color: 'var(--color-text-muted)',
              margin: 0,
            }}
          >
            Pilih jenis sampah dan masukkan estimasi berat untuk mendapatkan perkiraan saldo.
          </p>
        </div>

        {errorMsg && (
          <div
            className="alert alert-error"
            style={{
              marginBottom: '20px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* JENIS SAMPAH */}
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="jenisId"
                style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '14px',
                }}
              >
                Jenis Sampah <span style={{ color: '#ef4444' }}>*</span>
              </label>

              <select
                id="jenisId"
                name="jenisId"
                required
                value={jenisId}
                onChange={(e) => setJenisId(e.target.value)}
                className="form-input"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                }}
              >
                <option value="" disabled>
                  -- Pilih Jenis Sampah --
                </option>

                {jenisList.map((jenis) => (
                  <option key={jenis.id} value={jenis.id}>
                    {jenis.namaJenis} — Rp {Number(jenis.hargaPerKg).toLocaleString('id-ID')} / kg
                  </option>
                ))}
              </select>
            </div>

            {/* BERAT */}
            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="berat"
                style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '14px',
                }}
              >
                Berat Sampah (Kg) <span style={{ color: '#ef4444' }}>*</span>
              </label>

              <input
                id="berat"
                name="berat"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="Contoh: 2.5"
                value={berat}
                onChange={(e) => setBerat(e.target.value)}
                required
                className="form-input"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                Gunakan titik (.) untuk angka desimal, contoh 1.5 kg.
              </span>
            </div>

            {/* REAL-TIME ESTIMASI CARD */}
            <div
              style={{
                padding: '18px',
                borderRadius: '12px',
                background: selectedJenis
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: selectedJenis
                  ? '1px solid rgba(16, 185, 129, 0.25)'
                  : '1px solid var(--border-color)',
                marginBottom: '24px',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '14px',
                    color: selectedJenis ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  }}
                >
                  💡 Rincian & Estimasi Saldo
                </span>
                {selectedJenis && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      fontWeight: 600,
                    }}
                  >
                    Otomatis
                  </span>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  marginBottom: '8px',
                  color: 'var(--color-text-muted)',
                }}
              >
                <span>Harga per Kg:</span>
                <strong style={{ color: 'var(--color-text-main)' }}>
                  {selectedJenis
                    ? `Rp ${Number(hargaPerKg).toLocaleString('id-ID')} / kg`
                    : '-'}
                </strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  marginBottom: '8px',
                  color: 'var(--color-text-muted)',
                }}
              >
                <span>Berat Sampah:</span>
                <strong style={{ color: 'var(--color-text-main)' }}>
                  {numBerat > 0 ? `${numBerat} kg` : '-'}
                </strong>
              </div>

              <hr
                style={{
                  border: 'none',
                  borderTop: '1px dashed var(--border-color)',
                  margin: '12px 0',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '15px' }}>
                  Estimasi Saldo Diterima:
                </span>
                <strong
                  style={{
                    fontSize: '22px',
                    color: estimasiTotal > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  }}
                >
                  Rp {Number(estimasiTotal).toLocaleString('id-ID')}
                </strong>
              </div>

              <p
                style={{
                  margin: '10px 0 0 0',
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  lineHeight: '1.4',
                }}
              >
                * Saldo akan langsung dikreditkan ke dompet akun Anda setelah penimbangan diverifikasi dan transaksi dinyatakan selesai oleh petugas.
              </p>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading || !jenisId || numBerat <= 0}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 700,
                opacity: loading || !jenisId || numBerat <= 0 ? 0.6 : 1,
                cursor: loading || !jenisId || numBerat <= 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '⏳ Memproses Transaksi...' : '♻️ Kirim Transaksi Jual Sampah'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
