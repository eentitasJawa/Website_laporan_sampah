import {
  getSession,
  getJenisSampahList,
} from '../../../actions';
import { getHargaSampah } from '@/lib/hargaSampah';
import { redirect } from 'next/navigation';
import BaruTransaksiClient from './BaruTransaksiClient';

export const dynamic = 'force-dynamic';

export default async function BaruTransaksiPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role === 'ADMIN') {
    redirect('/admin/transaksi');
  }

  const jenisSampahList = await getJenisSampahList();

  const serializedJenis = jenisSampahList.map((j) => ({
    id: j.id,
    namaJenis: j.namaJenis,
    hargaPerKg:
      Number(j.hargaPerKg) > 0
        ? Number(j.hargaPerKg)
        : getHargaSampah(j.namaJenis),
  }));

  return <BaruTransaksiClient jenisList={serializedJenis} />;
}