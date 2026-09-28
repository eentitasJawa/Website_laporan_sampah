import {
  getSession,
  getUserTransaksi,
  getUserMoneyPocket,
} from '../../actions';

import { redirect } from 'next/navigation';
import UserTransaksiClient from './UserTransaksiClient';

export const dynamic = 'force-dynamic';

export default async function TransaksiPage() {
  const session = await getSession();

  // Proteksi login
  if (!session) {
    redirect('/login');
  }

  // Admin jangan masuk halaman transaksi user
  if (session.role === 'ADMIN') {
    redirect('/admin/transaksi');
  }

  const [transaksiRaw, saldo] = await Promise.all([
    getUserTransaksi(),
    getUserMoneyPocket(),
  ]);

  // Serialisasi data untuk Client Component
  const transaksi = transaksiRaw.map((t) => ({
    id: t.id,
    userId: t.userId,
    jenisId: t.jenisId,
    berat: Number(t.berat),
    hargaPerKg: Number(t.hargaPerKg),
    totalHarga: Number(t.totalHarga),
    status: t.status,
    saldoDiberikan: Boolean(t.saldoDiberikan),
    createdAt: t.createdAt.toISOString(),
    jenis: {
      id: t.jenis.id,
      namaJenis: t.jenis.namaJenis,
    },
  }));

  return (
    <UserTransaksiClient
      transaksi={transaksi}
      saldo={saldo}
      userName={session.nama}
    />
  );
}