import {
  getSession,
  getAdminTransaksi,
} from '../../actions';

import { redirect } from 'next/navigation';
import AdminTransaksiClient from './AdminTransaksiClient';

export const dynamic = 'force-dynamic';

export default async function AdminTransaksiPage() {
  const session = await getSession();

  // =========================
  // PROTEKSI LOGIN
  // =========================
  if (!session) {
    redirect('/login');
  }

  // =========================
  // PROTEKSI ADMIN
  // =========================
  if (session.role !== 'ADMIN') {
    redirect('/user/dashboard');
  }

  // =========================
  // AMBIL SEMUA TRANSAKSI
  // =========================
  const rawTransaksi = await getAdminTransaksi();

  const serializedTransaksi = rawTransaksi.map((item) => ({
    id: item.id,
    userId: item.userId,
    jenisId: item.jenisId,
    berat: Number(item.berat),
    hargaPerKg: Number(item.hargaPerKg),
    totalHarga: Number(item.totalHarga),
    status: item.status,
    saldoDiberikan: Boolean(item.saldoDiberikan),
    createdAt: item.createdAt.toISOString(),
    user: {
      id: item.user.id,
      nama: item.user.nama,
      email: item.user.email,
      noHp: item.user.noHp,
    },
    jenis: {
      id: item.jenis.id,
      namaJenis: item.jenis.namaJenis,
    },
  }));

  return <AdminTransaksiClient initialTransaksi={serializedTransaksi} />;
}