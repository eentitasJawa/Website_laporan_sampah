import { getSession, getAdminReports, getWilayahList, getJenisSampahList } from '../../actions';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getSession();

  // Route protection
  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'ADMIN') {
    redirect('/user/dashboard');
  }

  const [reports, wilayahList, jenisSampahList] = await Promise.all([
    getAdminReports(),
    getWilayahList(),
    getJenisSampahList(),
  ]);

  return (
    <AdminClient
      initialReports={reports}
      initialWilayah={wilayahList}
      initialJenisSampah={jenisSampahList}
      session={session}
    />
  );
}
