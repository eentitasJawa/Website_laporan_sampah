import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
      <header className="navbar">
        <div className="navbar-brand">
          ♻️ <span>webSampah</span>
        </div>
        <div className="navbar-nav">
          <Link href="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>Masuk</Link>
          <Link href="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>Daftar</Link>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <section className="hero">
          <div style={{ fontSize: '64px', marginBottom: '10px' }}>🌱</div>
          <h1>Wujudkan Lingkungan Bersih,<br />Laporkan Sampah Liar!</h1>
          <p>
            webSampah adalah platform digital untuk mempermudah masyarakat melaporkan tumpukan sampah liar di lingkungannya. 
            Laporan Anda akan langsung dipantau oleh admin wilayah untuk segera ditindaklanjuti.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
            <Link href="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>
              Mulai Melapor Sekarang
            </Link>
            <Link href="/login" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '16px' }}>
              Masuk Dashboard
            </Link>
          </div>
        </section>
      </main>

      <footer style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', borderTop: '1px solid var(--border-color)', fontSize: '14px' }}>
        &copy; {new Date().getFullYear()} webSampah. Semua Hak Dilindungi.
      </footer>
    </div>
  );
}
