import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'webSampah - Sistem Pelaporan Sampah Lingkungan',
  description: 'Laporkan tumpukan sampah di wilayah Anda untuk lingkungan yang lebih bersih dan sehat.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
