'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  updateReportStatus,
  deleteReport,
  addWilayah,
  deleteWilayah,
  addJenisSampah,
  deleteJenisSampah,
  logout
} from '../../actions';

interface AdminClientProps {
  initialReports: any[];
  initialWilayah: any[];
  initialJenisSampah: any[];
  session: { nama: string; email: string };
}

export default function AdminClient({
  initialReports,
  initialWilayah,
  initialJenisSampah,
  session
}: AdminClientProps) {
  const router = useRouter();
  const [reports, setReports] = useState(initialReports);
  const [wilayahList, setWilayahList] = useState(initialWilayah);
  const [jenisList, setJenisList] = useState(initialJenisSampah);

  // Form states
  const [newWilayah, setNewWilayah] = useState('');
  const [newJenis, setNewJenis] = useState('');

  // Alerts
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 5000);
  };

  // Actions
  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      await updateReportStatus(reportId, newStatus);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
      showAlert('success', `Status laporan berhasil diubah ke ${newStatus}.`);
    } catch (e: any) {
      showAlert('error', 'Gagal memperbarui status: ' + e.message);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus laporan ini? Foto terkait juga akan terhapus secara otomatis (Cascade).')) {
      return;
    }
    try {
      await deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      showAlert('success', 'Laporan berhasil dihapus (Cascade delete foto berhasil).');
    } catch (e: any) {
      showAlert('error', 'Gagal menghapus laporan: ' + e.message);
    }
  };

  const handleAddWilayah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWilayah.trim()) return;

    const res = await addWilayah(newWilayah.trim());
    if (res.error) {
      showAlert('error', res.error);
    } else {
      showAlert('success', 'Wilayah baru berhasil ditambahkan.');
      setNewWilayah('');
      // Refresh list
      window.location.reload();
    }
  };

  const handleDeleteWilayah = async (id: string, name: string) => {
    if (!confirm(`Hapus wilayah "${name}"?`)) return;

    const res = await deleteWilayah(id);
    if (res.error) {
      showAlert('error', res.error);
    } else {
      showAlert('success', `Wilayah "${name}" berhasil dihapus.`);
      window.location.reload();
    }
  };

  const handleAddJenis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJenis.trim()) return;

    const res = await addJenisSampah(newJenis.trim());
    if (res.error) {
      showAlert('error', res.error);
    } else {
      showAlert('success', 'Jenis sampah baru berhasil ditambahkan.');
      setNewJenis('');
      window.location.reload();
    }
  };

  const handleDeleteJenis = async (id: string, name: string) => {
    if (!confirm(`Hapus jenis sampah "${name}"?`)) return;

    const res = await deleteJenisSampah(id);
    if (res.error) {
      showAlert('error', res.error);
    } else {
      showAlert('success', `Jenis sampah "${name}" berhasil dihapus.`);
      window.location.reload();
    }
  };

  // Metrics
  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === 'PENDING').length;
  const processReports = reports.filter((r) => r.status === 'PROSES').length;
  const finishedReports = reports.filter((r) => r.status === 'SELESAI').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="navbar">
        <div className="navbar-brand">
          ♻️ <span>webSampah</span>
        </div>
        <div className="navbar-nav" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/admin/transaksi"
            className="btn btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            ♻️ Kelola Transaksi
          </Link>

          <div className="nav-user">
            <span>Halo, <strong>{session.nama}</strong></span>
            <span className="role-tag" style={{ color: '#ef4444' }}>Admin</span>
          </div>
          <form action={logout}>
            <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
              Keluar
            </button>
          </form>
        </div>
      </header>

      <main className="container">
        {/* Alerts */}
        {alertMsg && (
          <div className={`alert alert-${alertMsg.type}`}>
            <span>{alertMsg.type === 'success' ? '✅' : '⚠️'} {alertMsg.text}</span>
          </div>
        )}

        {/* Global Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Seluruh Laporan</h3>
            <p>{totalReports}</p>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
            <h3>Menunggu (Pending)</h3>
            <p style={{ color: 'var(--color-warning)' }}>{pendingReports}</p>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid var(--color-info)' }}>
            <h3>Proses</h3>
            <p style={{ color: 'var(--color-info)' }}>{processReports}</p>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <h3>Selesai</h3>
            <p style={{ color: 'var(--color-primary)' }}>{finishedReports}</p>
          </div>
        </div>

        {/* Reports Table Panel */}
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: 'var(--color-primary)' }}>
            Daftar Seluruh Laporan Sampah Masuk
          </h3>

          {reports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
              <p>Belum ada laporan sampah masuk.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Pelapor</th>
                    <th>Wilayah</th>
                    <th>Jenis Sampah</th>
                    <th>Deskripsi</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>
                        {report.fotoSampah?.url ? (
                          <img
                            src={report.fotoSampah.url}
                            alt="Foto Laporan"
                            style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                          />
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)' }}>Tidak ada foto</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{report.user.nama}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{report.user.email}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{report.user.noHp}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{report.wilayah.namaWilayah}</td>
                      <td>
                        <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px', fontSize: '13px' }}>
                          {report.jenisSampah.namaJenis}
                        </span>
                      </td>
                      <td style={{ maxWidth: '200px', whiteSpace: 'normal', fontSize: '13px' }}>
                        <div>{report.deskripsi}</div>
                        {report.tags && report.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                            {report.tags.map((t: any) => (
                              <span key={t.id} style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                #{t.namaTag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        <select
                          className="form-input"
                          style={{ padding: '6px 12px', fontSize: '13px', width: 'auto', background: '#1e293b' }}
                          value={report.status}
                          onChange={(e) => handleStatusChange(report.id, e.target.value)}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROSES">PROSES</option>
                          <option value="SELESAI">SELESAI</option>
                        </select>
                      </td>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                        {new Date(report.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Master Data Management Panel */}
        <div className="admin-grid">
          {/* Wilayah Panel */}
          <div className="card">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--color-primary)' }}>
              Kelola Wilayah
            </h3>

            <form onSubmit={handleAddWilayah} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Tambah Wilayah Baru"
                value={newWilayah}
                onChange={(e) => setNewWilayah(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px', flexShrink: 0 }}>
                Tambah
              </button>
            </form>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nama Wilayah</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {wilayahList.map((w) => (
                    <tr key={w.id}>
                      <td style={{ fontWeight: 500 }}>{w.namaWilayah}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteWilayah(w.id, w.namaWilayah)}
                          className="btn btn-danger"
                          style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px' }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Jenis Sampah Panel */}
          <div className="card">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--color-primary)' }}>
              Kelola Jenis Sampah
            </h3>

            <form onSubmit={handleAddJenis} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Tambah Jenis Sampah Baru"
                value={newJenis}
                onChange={(e) => setNewJenis(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px', flexShrink: 0 }}>
                Tambah
              </button>
            </form>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Jenis Sampah</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {jenisList.map((j) => (
                    <tr key={j.id}>
                      <td style={{ fontWeight: 500 }}>{j.namaJenis}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteJenis(j.id, j.namaJenis)}
                          className="btn btn-danger"
                          style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px' }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', borderTop: '1px solid var(--border-color)', fontSize: '14px', marginTop: 'auto' }}>
        &copy; {new Date().getFullYear()} webSampah. Semua Hak Dilindungi.
      </footer>
    </div>
  );
}
