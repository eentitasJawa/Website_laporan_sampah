'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface TransaksiItem {
  id: string;
  userId: string;
  jenisId: string;
  berat: number;
  hargaPerKg: number;
  totalHarga: number;
  status: 'PENDING' | 'DIPROSES' | 'SELESAI' | 'DIBATALKAN';
  saldoDiberikan: boolean;
  createdAt: string;
  jenis: {
    id: string;
    namaJenis: string;
  };
}

interface UserTransaksiClientProps {
  transaksi: TransaksiItem[];
  saldo: number;
  userName: string;
}

export default function UserTransaksiClient({
  transaksi,
  saldo,
  userName,
}: UserTransaksiClientProps) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalTransaksi = transaksi.length;
  const pendingCount = transaksi.filter((t) => t.status === 'PENDING').length;
  const diprosesCount = transaksi.filter((t) => t.status === 'DIPROSES').length;
  const selesaiCount = transaksi.filter((t) => t.status === 'SELESAI').length;

  // Total pendapatan yang sudah didapat dari transaksi SELESAI
  const totalPendapatan = useMemo(() => {
    return transaksi
      .filter((t) => t.status === 'SELESAI')
      .reduce((sum, item) => sum + item.totalHarga, 0);
  }, [transaksi]);

  const filteredTransaksi = useMemo(() => {
    return transaksi.filter((item) => {
      const matchStatus =
        filterStatus === 'ALL' || item.status === filterStatus;
      const matchSearch =
        searchQuery === '' ||
        item.jenis.namaJenis.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [transaksi, filterStatus, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Menunggu',
          bg: 'rgba(245, 158, 11, 0.15)',
          color: '#f59e0b',
          border: 'rgba(245, 158, 11, 0.3)',
        };
      case 'DIPROSES':
        return {
          label: 'Diproses',
          bg: 'rgba(59, 130, 246, 0.15)',
          color: '#3b82f6',
          border: 'rgba(59, 130, 246, 0.3)',
        };
      case 'SELESAI':
        return {
          label: 'Selesai',
          bg: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          border: 'rgba(16, 185, 129, 0.3)',
        };
      case 'DIBATALKAN':
        return {
          label: 'Dibatalkan',
          bg: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          border: 'rgba(239, 68, 68, 0.3)',
        };
      default:
        return {
          label: status,
          bg: 'rgba(255, 255, 255, 0.1)',
          color: '#fff',
          border: 'transparent',
        };
    }
  };

  return (
    <main className="container" style={{ paddingBottom: '60px' }}>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '15px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '6px',
            }}
          >
            ♻️ Transaksi Sampah
          </h1>

          <p
            style={{
              color: 'var(--color-text-muted)',
              margin: 0,
            }}
          >
            Halo, {userName}. Kelola transaksi dan pantau hasil penimbangan sampahmu di sini.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Link
            href="/user/dashboard"
            className="btn btn-secondary"
            style={{
              textDecoration: 'none',
            }}
          >
            ← Dashboard
          </Link>

          <Link
            href="/user/transaksi/baru"
            className="btn btn-primary"
            style={{
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            + Jual Sampah
          </Link>
        </div>
      </div>

      {/* HIGHLIGHT SALDO & PENDAPATAN */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* DOMPET SAMPAH CARD */}
        <div
          className="card"
          style={{
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(22, 30, 49, 0.8) 100%)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              💰 Saldo Dompet Sampah
            </span>
            <span
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                fontWeight: 600,
              }}
            >
              Tersedia
            </span>
          </div>

          <div
            style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#fff',
              letterSpacing: '-0.5px',
            }}
          >
            Rp {Number(saldo).toLocaleString('id-ID')}
          </div>

          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
            }}
          >
            Saldo otomatis bertambah setiap kali transaksi penimbangan disetujui & selesai.
          </p>
        </div>

        {/* TOTAL PENDAPATAN CARD */}
        <div
          className="card"
          style={{
            background:
              'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(22, 30, 49, 0.8) 100%)',
            borderColor: 'rgba(59, 130, 246, 0.25)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#60a5fa',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              📈 Total Pendapatan Tercairkan
            </span>
            <span
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                fontWeight: 600,
              }}
            >
              {selesaiCount} Transaksi Selesai
            </span>
          </div>

          <div
            style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#fff',
              letterSpacing: '-0.5px',
            }}
          >
            Rp {Number(totalPendapatan).toLocaleString('id-ID')}
          </div>

          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
            }}
          >
            Akumulasi nilai penjualan dari semua transaksi yang telah selesai.
          </p>
        </div>
      </div>

      {/* STATISTIK COUNTERS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Transaksi</h3>
          <p>{totalTransaksi}</p>
        </div>

        <div
          className="stat-card"
          style={{
            borderLeft: '4px solid var(--color-warning)',
          }}
        >
          <h3>Menunggu (Pending)</h3>
          <p style={{ color: 'var(--color-warning)' }}>{pendingCount}</p>
        </div>

        <div
          className="stat-card"
          style={{
            borderLeft: '4px solid var(--color-info)',
          }}
        >
          <h3>Sedang Diproses</h3>
          <p style={{ color: 'var(--color-info)' }}>{diprosesCount}</p>
        </div>

        <div
          className="stat-card"
          style={{
            borderLeft: '4px solid var(--color-primary)',
          }}
        >
          <h3>Selesai</h3>
          <p style={{ color: 'var(--color-primary)' }}>{selesaiCount}</p>
        </div>
      </div>

      {/* RIWAYAT TRANSAKSI */}
      <div
        className="card"
        style={{
          marginTop: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '15px',
            flexWrap: 'wrap',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
            }}
          >
            Riwayat Transaksi Sampah
          </h2>

          {/* SEARCH BAR */}
          <div style={{ maxWidth: '280px', width: '100%' }}>
            <input
              type="text"
              placeholder="Cari jenis sampah..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 14px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>

        {/* STATUS FILTER TABS */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '12px',
          }}
        >
          {[
            { key: 'ALL', label: `Semua (${totalTransaksi})` },
            { key: 'PENDING', label: `Menunggu (${pendingCount})` },
            { key: 'DIPROSES', label: `Diproses (${diprosesCount})` },
            { key: 'SELESAI', label: `Selesai (${selesaiCount})` },
            {
              key: 'DIBATALKAN',
              label: `Dibatalkan (${
                transaksi.filter((t) => t.status === 'DIBATALKAN').length
              })`,
            },
          ].map((tab) => {
            const isActive = filterStatus === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilterStatus(tab.key)}
                style={{
                  background: isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#0b0f19' : 'var(--color-text-main)',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {filteredTransaksi.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '50px 0',
              color: 'var(--color-text-muted)',
            }}
          >
            <div
              style={{
                fontSize: '50px',
                marginBottom: '12px',
              }}
            >
              ♻️
            </div>

            <p style={{ fontSize: '15px', marginBottom: '8px' }}>
              {transaksi.length === 0
                ? 'Belum ada transaksi sampah.'
                : 'Tidak ada transaksi dengan filter yang dipilih.'}
            </p>

            {transaksi.length === 0 && (
              <Link
                href="/user/transaksi/baru"
                className="btn btn-primary"
                style={{
                  display: 'inline-block',
                  marginTop: '15px',
                  textDecoration: 'none',
                }}
              >
                + Jual Sampah Sekarang
              </Link>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Jenis Sampah</th>
                  <th>Berat</th>
                  <th>Harga / Kg</th>
                  <th>Total Pendapatan</th>
                  <th>Status Transaksi</th>
                  <th>Status Saldo</th>
                  <th>Tanggal Pengajuan</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransaksi.map((item, index) => {
                  const badge = getStatusBadge(item.status);

                  return (
                    <tr key={item.id}>
                      <td style={{ color: 'var(--color-text-muted)' }}>
                        {index + 1}
                      </td>

                      <td>
                        <strong style={{ fontSize: '15px' }}>
                          {item.jenis.namaJenis}
                        </strong>
                      </td>

                      <td>
                        <span
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: 600,
                          }}
                        >
                          {Number(item.berat).toLocaleString('id-ID')} kg
                        </span>
                      </td>

                      <td>
                        Rp {Number(item.hargaPerKg).toLocaleString('id-ID')}
                      </td>

                      <td>
                        <strong
                          style={{
                            color:
                              item.status === 'SELESAI'
                                ? 'var(--color-primary)'
                                : 'inherit',
                            fontSize: '15px',
                          }}
                        >
                          Rp {Number(item.totalHarga).toLocaleString('id-ID')}
                        </strong>
                      </td>

                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td>
                        {item.saldoDiberikan ? (
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#10b981',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: 600,
                            }}
                          >
                            ✓ Sudah Masuk Saldo
                          </span>
                        ) : item.status === 'DIBATALKAN' ? (
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            Dibatalkan
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#f59e0b',
                            }}
                          >
                            ⏳ Belum Dicairkan
                          </span>
                        )}
                      </td>

                      <td
                        style={{
                          color: 'var(--color-text-muted)',
                          fontSize: '13px',
                        }}
                      >
                        {new Date(item.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
