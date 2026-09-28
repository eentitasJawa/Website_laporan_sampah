import {
  getSession,
  getWilayahList,
  getJenisSampahList,
  getUserReports,
  getUserTransaksi,
  getUserMoneyPocket,
  logout,
} from '../../actions';

import { redirect } from 'next/navigation';
import ReportForm from './ReportForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UserDashboard() {
  const session = await getSession();

  // Route protection
  if (!session) {
    redirect('/login');
  }

  if (session.role === 'ADMIN') {
    redirect('/admin/dashboard');
  }

  const [
    wilayahList,
    jenisSampahList,
    reports,
    transaksiList,
    userSaldo,
  ] = await Promise.all([
    getWilayahList(),
    getJenisSampahList(),
    getUserReports(),
    getUserTransaksi(),
    getUserMoneyPocket(),
  ]);

  // =========================
  // STATISTIK LAPORAN
  // =========================

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (r) => r.status === 'PENDING'
  ).length;

  const processReports = reports.filter(
    (r) => r.status === 'PROSES'
  ).length;

  const finishedReports = reports.filter(
    (r) => r.status === 'SELESAI'
  ).length;

  // =========================
  // STATISTIK TRANSAKSI
  // =========================

  const totalTransaksi = transaksiList.length;

  const transaksiPending = transaksiList.filter(
    (t) => t.status === 'PENDING'
  ).length;

  const transaksiSelesai = transaksiList.filter(
    (t) => t.status === 'SELESAI'
  ).length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* ================= HEADER ================= */}
      <header className="navbar">
        <div className="navbar-brand">
          ♻️ <span>webSampah</span>
        </div>

        <div className="navbar-nav">
          <div className="nav-user">
            <span>
              Halo, <strong>{session.nama}</strong>
            </span>

            <span className="role-tag">
              Masyarakat
            </span>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="btn btn-secondary"
              style={{
                padding: '8px 16px',
                fontSize: '14px',
              }}
            >
              Keluar
            </button>
          </form>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="container">

        {/* ================= STATISTIK LAPORAN ================= */}
        <div className="stats-grid">

          <div className="stat-card">
            <h3>Total Laporan Anda</h3>
            <p>{totalReports}</p>
          </div>

          <div
            className="stat-card"
            style={{
              borderLeft: '4px solid var(--color-warning)',
            }}
          >
            <h3>Menunggu (Pending)</h3>

            <p
              style={{
                color: 'var(--color-warning)',
              }}
            >
              {pendingReports}
            </p>
          </div>

          <div
            className="stat-card"
            style={{
              borderLeft: '4px solid var(--color-info)',
            }}
          >
            <h3>Sedang Diproses</h3>

            <p
              style={{
                color: 'var(--color-info)',
              }}
            >
              {processReports}
            </p>
          </div>

          <div
            className="stat-card"
            style={{
              borderLeft: '4px solid var(--color-primary)',
            }}
          >
            <h3>Selesai</h3>

            <p
              style={{
                color: 'var(--color-primary)',
              }}
            >
              {finishedReports}
            </p>
          </div>

        </div>

        {/* ================= TRANSAKSI CARD ================= */}
        <div
          className="card"
          style={{
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '8px',
                }}
              >
                ♻️ Transaksi Sampah
              </h3>

              <p
                style={{
                  color: 'var(--color-text-muted)',
                  margin: 0,
                }}
              >
                Jual sampah Anda dan dapatkan uang dari hasil
                penimbangan.
              </p>
            </div>

            <Link
              href="/user/transaksi"
              className="btn btn-primary"
              style={{
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Lihat Transaksi →
            </Link>
          </div>

          {/* Statistik transaksi */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(22, 30, 49, 0.8) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  marginBottom: '5px',
                }}
              >
                💰 Saldo Dompet
              </div>

              <strong
                style={{
                  fontSize: '22px',
                  color: '#fff',
                }}
              >
                Rp {Number(userSaldo).toLocaleString('id-ID')}
              </strong>
            </div>

            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                  marginBottom: '5px',
                }}
              >
                Total Transaksi
              </div>

              <strong style={{ fontSize: '24px' }}>
                {totalTransaksi}
              </strong>
            </div>

            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                  marginBottom: '5px',
                }}
              >
                Menunggu
              </div>

              <strong
                style={{
                  fontSize: '24px',
                  color: 'var(--color-warning)',
                }}
              >
                {transaksiPending}
              </strong>
            </div>

            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                  marginBottom: '5px',
                }}
              >
                Selesai
              </div>

              <strong
                style={{
                  fontSize: '24px',
                  color: 'var(--color-primary)',
                }}
              >
                {transaksiSelesai}
              </strong>
            </div>
          </div>
        </div>

        {/* ================= DASHBOARD CONTENT ================= */}
        <div className="dashboard-grid">

          {/* ================= FORM LAPORAN ================= */}
          <div>
            <ReportForm
              wilayahList={wilayahList}
              jenisSampahList={jenisSampahList}
            />
          </div>

          {/* ================= RIWAYAT LAPORAN ================= */}
          <div>
            <div
              className="card"
              style={{
                height: '100%',
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '20px',
                }}
              >
                Riwayat Laporan Anda
              </h3>

              {reports.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 0',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '40px',
                      marginBottom: '12px',
                    }}
                  >
                    📭
                  </div>

                  <p>
                    Anda belum mengirimkan laporan sampah.
                  </p>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Foto</th>
                        <th>Wilayah</th>
                        <th>Jenis Sampah</th>
                        <th>Deskripsi</th>
                        <th>Status</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>

                    <tbody>
                      {reports.map((report) => (
                        <tr key={report.id}>

                          {/* FOTO */}
                          <td>
                            {report.fotoSampah?.url ? (
                              <img
                                src={report.fotoSampah.url}
                                alt="Bukti Sampah"
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  border:
                                    '1px solid var(--border-color)',
                                }}
                              />
                            ) : (
                              <span
                                style={{
                                  color:
                                    'var(--color-text-muted)',
                                }}
                              >
                                Tidak ada foto
                              </span>
                            )}
                          </td>

                          {/* WILAYAH */}
                          <td
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {report.wilayah.namaWilayah}
                          </td>

                          {/* JENIS */}
                          <td>
                            <span
                              style={{
                                background:
                                  'rgba(255,255,255,0.05)',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '13px',
                              }}
                            >
                              {report.jenisSampah.namaJenis}
                            </span>
                          </td>

                          {/* DESKRIPSI */}
                          <td
                            style={{
                              maxWidth: '250px',
                            }}
                          >
                            <div
                              style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {report.deskripsi}
                            </div>

                            {report.tags &&
                              report.tags.length > 0 && (
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: '4px',
                                    flexWrap: 'wrap',
                                    marginTop: '6px',
                                  }}
                                >
                                  {report.tags.map(
                                    (t: any) => (
                                      <span
                                        key={t.id}
                                        style={{
                                          fontSize: '10px',
                                          background:
                                            'rgba(16, 185, 129, 0.15)',
                                          color: '#10b981',
                                          padding:
                                            '2px 6px',
                                          borderRadius:
                                            '4px',
                                          fontWeight: 600,
                                        }}
                                      >
                                        #{t.namaTag}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                          </td>

                          {/* STATUS */}
                          <td>
                            <span
                              className={`badge badge-${report.status.toLowerCase()}`}
                            >
                              {report.status}
                            </span>
                          </td>

                          {/* TANGGAL */}
                          <td
                            style={{
                              color:
                                'var(--color-text-muted)',
                              fontSize: '13px',
                            }}
                          >
                            {new Date(
                              report.createdAt
                            ).toLocaleDateString(
                              'id-ID',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          padding: '24px',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          borderTop:
            '1px solid var(--border-color)',
          fontSize: '14px',
          marginTop: 'auto',
        }}
      >
        &copy; {new Date().getFullYear()} webSampah.
        Semua Hak Dilindungi.
      </footer>
    </div>
  );
}