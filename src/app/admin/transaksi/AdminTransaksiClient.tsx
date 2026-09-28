'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { updateTransaksiStatus, deleteTransaksi } from '../../actions';

interface TransaksiAdminItem {
  id: string;
  userId: string;
  jenisId: string;
  berat: number;
  hargaPerKg: number;
  totalHarga: number;
  status: 'PENDING' | 'DIPROSES' | 'SELESAI' | 'DIBATALKAN';
  saldoDiberikan: boolean;
  createdAt: string;
  user: {
    id: string;
    nama: string;
    email: string;
    noHp: string;
  };
  jenis: {
    id: string;
    namaJenis: string;
  };
}

interface AdminTransaksiClientProps {
  initialTransaksi: TransaksiAdminItem[];
}

export default function AdminTransaksiClient({
  initialTransaksi,
}: AdminTransaksiClientProps) {
  const [transaksiList, setTransaksiList] = useState<TransaksiAdminItem[]>(initialTransaksi);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 5000);
  };

  const totalTransaksi = transaksiList.length;
  const pendingCount = transaksiList.filter((t) => t.status === 'PENDING').length;
  const diprosesCount = transaksiList.filter((t) => t.status === 'DIPROSES').length;
  const selesaiCount = transaksiList.filter((t) => t.status === 'SELESAI').length;
  const dibatalkanCount = transaksiList.filter((t) => t.status === 'DIBATALKAN').length;

  const totalOmzetSelesai = useMemo(() => {
    return transaksiList
      .filter((t) => t.status === 'SELESAI')
      .reduce((sum, item) => sum + item.totalHarga, 0);
  }, [transaksiList]);

  const filteredTransaksi = useMemo(() => {
    return transaksiList.filter((item) => {
      const matchStatus =
        filterStatus === 'ALL' || item.status === filterStatus;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        searchQuery === '' ||
        item.user.nama.toLowerCase().includes(q) ||
        item.user.email.toLowerCase().includes(q) ||
        item.jenis.namaJenis.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [transaksiList, filterStatus, searchQuery]);

  const handleStatusChange = async (
    item: TransaksiAdminItem,
    newStatus: 'PENDING' | 'DIPROSES' | 'SELESAI' | 'DIBATALKAN'
  ) => {
    if (newStatus === item.status) return;

    if (newStatus === 'SELESAI') {
      const ok = confirm(
        `Konfirmasi: Mengubah status transaksi menjadi SELESAI akan otomatis mengkreditkan saldo sebesar Rp ${item.totalHarga.toLocaleString('id-ID')} ke akun ${item.user.nama}. Lanjutkan?`
      );
      if (!ok) return;
    } else if (item.status === 'SELESAI') {
      const ok = confirm(
        `Perhatian: Transaksi ini sebelumnya SELESAI (saldo sudah dikreditkan). Mengubah status akan menarik kembali saldo Rp ${item.totalHarga.toLocaleString('id-ID')} dari akun ${item.user.nama}. Lanjutkan?`
      );
      if (!ok) return;
    }

    setLoadingId(item.id);
    try {
      const res = await updateTransaksiStatus(item.id, newStatus);
      if (!res.success) {
        showAlert('error', res.message || 'Gagal mengubah status.');
      } else {
        setTransaksiList((prev) =>
          prev.map((t) =>
            t.id === item.id
              ? {
                  ...t,
                  status: newStatus,
                  saldoDiberikan: newStatus === 'SELESAI',
                }
              : t
          )
        );
        showAlert(
          'success',
          `Status transaksi ${item.user.nama} berhasil diubah ke ${newStatus}.`
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      showAlert('error', message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (item: TransaksiAdminItem) => {
    const confirmText = item.saldoDiberikan
      ? `Hapus transaksi milik ${item.user.nama}? Karena transaksi ini sudah SELESAI, saldo Rp ${item.totalHarga.toLocaleString('id-ID')} yang telah diberikan akan ditarik kembali dari akun user.`
      : `Hapus transaksi milik ${item.user.nama}?`;

    if (!confirm(confirmText)) return;

    setLoadingId(item.id);
    try {
      const res = await deleteTransaksi(item.id);
      if (!res.success) {
        showAlert('error', res.message || 'Gagal menghapus transaksi.');
      } else {
        setTransaksiList((prev) => prev.filter((t) => t.id !== item.id));
        showAlert('success', 'Transaksi berhasil dihapus.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      showAlert('error', message);
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'PENDING',
          bg: 'rgba(245, 158, 11, 0.15)',
          color: '#f59e0b',
          border: 'rgba(245, 158, 11, 0.3)',
        };
      case 'DIPROSES':
        return {
          label: 'DIPROSES',
          bg: 'rgba(59, 130, 246, 0.15)',
          color: '#3b82f6',
          border: 'rgba(59, 130, 246, 0.3)',
        };
      case 'SELESAI':
        return {
          label: 'SELESAI',
          bg: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          border: 'rgba(16, 185, 129, 0.3)',
        };
      case 'DIBATALKAN':
        return {
          label: 'DIBATALKAN',
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
          marginBottom: '24px',
          gap: '16px',
          flexWrap: 'wrap',
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
            ♻️ Kelola Transaksi Sampah
          </h1>

          <p
            style={{
              color: 'var(--color-text-muted)',
              margin: 0,
            }}
          >
            Verifikasi penimbangan, kelola status, dan pantau pencairan saldo sampah masyarakat.
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="btn btn-secondary"
          style={{
            textDecoration: 'none',
          }}
        >
          ← Dashboard Admin
        </Link>
      </div>

      {/* ALERTS */}
      {alertMsg && (
        <div
          className={`alert alert-${alertMsg.type}`}
          style={{
            marginBottom: '20px',
            padding: '12px 16px',
            borderRadius: '8px',
            background:
              alertMsg.type === 'success'
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${
              alertMsg.type === 'success'
                ? 'rgba(16, 185, 129, 0.3)'
                : 'rgba(239, 68, 68, 0.3)'
            }`,
            color: alertMsg.type === 'success' ? '#10b981' : '#ef4444',
          }}
        >
          <span>
            {alertMsg.type === 'success' ? '✅' : '⚠️'} {alertMsg.text}
          </span>
        </div>
      )}

      {/* STATISTIK */}
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

        <div
          className="stat-card"
          style={{
            borderLeft: '4px solid #10b981',
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(22, 30, 49, 0.7) 100%)',
          }}
        >
          <h3>Total Pencairan Saldo</h3>
          <p style={{ color: '#10b981', fontSize: '20px' }}>
            Rp {Number(totalOmzetSelesai).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* TABEL TRANSAKSI */}
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
            marginBottom: '20px',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
            }}
          >
            Daftar Seluruh Transaksi
          </h2>

          {/* SEARCH INPUT */}
          <div style={{ maxWidth: '300px', width: '100%' }}>
            <input
              type="text"
              placeholder="Cari user, email, jenis..."
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
            { key: 'DIBATALKAN', label: `Dibatalkan (${dibatalkanCount})` },
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
                fontSize: '45px',
                marginBottom: '10px',
              }}
            >
              📭
            </div>

            <p>
              {transaksiList.length === 0
                ? 'Belum ada transaksi sampah masuk.'
                : 'Tidak ada transaksi yang cocok dengan pencarian / filter.'}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Pelapor (User)</th>
                  <th>Jenis Sampah</th>
                  <th>Berat</th>
                  <th>Harga / Kg</th>
                  <th>Total Saldo</th>
                  <th>Status Transaksi</th>
                  <th>Status Dompet</th>
                  <th>Tanggal</th>
                  <th>Aksi Status</th>
                  <th>Hapus</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransaksi.map((item, index) => {
                  const badge = getStatusBadge(item.status);
                  const isItemLoading = loadingId === item.id;

                  return (
                    <tr key={item.id}>
                      <td style={{ color: 'var(--color-text-muted)' }}>
                        {index + 1}
                      </td>

                      {/* USER */}
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.user.nama}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          {item.user.email}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          {item.user.noHp}
                        </div>
                      </td>

                      {/* JENIS */}
                      <td>
                        <span
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 500,
                          }}
                        >
                          {item.jenis.namaJenis}
                        </span>
                      </td>

                      {/* BERAT */}
                      <td>
                        <strong>{Number(item.berat).toLocaleString('id-ID')} kg</strong>
                      </td>

                      {/* HARGA */}
                      <td>
                        Rp {Number(item.hargaPerKg).toLocaleString('id-ID')}
                      </td>

                      {/* TOTAL */}
                      <td>
                        <strong
                          style={{
                            color:
                              item.status === 'SELESAI'
                                ? 'var(--color-primary)'
                                : 'inherit',
                          }}
                        >
                          Rp {Number(item.totalHarga).toLocaleString('id-ID')}
                        </strong>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 8px',
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

                      {/* STATUS SALDO */}
                      <td>
                        {item.saldoDiberikan ? (
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#10b981',
                              fontWeight: 600,
                            }}
                          >
                            ✓ Terkredit
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            Belum
                          </span>
                        )}
                      </td>

                      {/* TANGGAL */}
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
                        })}
                      </td>

                      {/* UBAH STATUS */}
                      <td>
                        <select
                          disabled={isItemLoading}
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(
                              item,
                              e.target.value as
                                | 'PENDING'
                                | 'DIPROSES'
                                | 'SELESAI'
                                | 'DIBATALKAN'
                            )
                          }
                          className="form-input"
                          style={{
                            padding: '6px 10px',
                            fontSize: '13px',
                            borderRadius: '6px',
                            width: 'auto',
                            background: '#1e293b',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="DIPROSES">DIPROSES</option>
                          <option value="SELESAI">SELESAI (Kredit Saldo)</option>
                          <option value="DIBATALKAN">DIBATALKAN</option>
                        </select>
                      </td>

                      {/* HAPUS */}
                      <td>
                        <button
                          type="button"
                          disabled={isItemLoading}
                          onClick={() => handleDelete(item)}
                          className="btn btn-danger"
                          style={{
                            padding: '6px 10px',
                            fontSize: '12px',
                            borderRadius: '6px',
                          }}
                        >
                          {isItemLoading ? '...' : 'Hapus'}
                        </button>
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
