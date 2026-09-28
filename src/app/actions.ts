'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { getHargaSampah } from '@/lib/hargaSampah';

// =====================================================
// HELPER
// =====================================================

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// =====================================================
// SESSION
// =====================================================

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

// =====================================================
// LOGIN
// =====================================================

export async function login(
  prevState: any,
  formData: FormData
) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return {
      error: 'Email dan password wajib diisi.',
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        error: 'Email atau password salah.',
      };
    }

    const hashedPassword = hashPassword(password);

    if (user.password !== hashedPassword) {
      return {
        error: 'Email atau password salah.',
      };
    }

    const sessionData = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      noHp: user.noHp,
      role: user.role,
    };

    const cookieStore = await cookies();

    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    // Redirect DI LUAR try/catch supaya NEXT_REDIRECT
    // tidak dianggap sebagai error.
    if (user.role === 'ADMIN') {
      redirect('/admin/dashboard');
    }

    redirect('/user/dashboard');
  } catch (error: any) {
    // NEXT_REDIRECT bukan error aplikasi.
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }

    console.error('LOGIN ERROR:', error);

    return {
      error: 'Terjadi kesalahan saat login.',
    };
  }
}

// =====================================================
// REGISTER
// =====================================================

export async function register(
  prevState: any,
  formData: FormData
) {
  const nama = String(formData.get('nama') || '').trim();
  const email = String(formData.get('email') || '')
    .trim()
    .toLowerCase();
  const noHp = String(formData.get('noHp') || '').trim();
  const password = String(formData.get('password') || '');

  if (!nama || !email || !noHp || !password) {
    return {
      error: 'Semua field wajib diisi.',
    };
  }

  if (password.length < 6) {
    return {
      error: 'Password minimal 6 karakter.',
    };
  }

  try {
    // Cek email
    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      return {
        error: 'Email sudah terdaftar.',
      };
    }

    // Cek nomor HP
    const existingNoHp = await prisma.user.findUnique({
      where: {
        noHp,
      },
    });

    if (existingNoHp) {
      return {
        error: 'Nomor HP sudah terdaftar.',
      };
    }

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        nama,
        email,
        noHp,
        password: hashPassword(password),
        role: 'USER',
      },
    });

    const sessionData = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      noHp: user.noHp,
      role: user.role,
    };

    const cookieStore = await cookies();

    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    redirect('/user/dashboard');
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }

    console.error('REGISTER ERROR:', error);

    if (error?.code === 'P2002') {
      return {
        error: 'Email atau nomor HP sudah terdaftar.',
      };
    }

    return {
      error: 'Terjadi kesalahan saat membuat akun.',
    };
  }
}

// =====================================================
// LOGOUT
// =====================================================

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.set('session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  redirect('/login');
}

// =====================================================
// WILAYAH
// =====================================================

export async function getWilayahList() {
  return prisma.wilayah.findMany({
    orderBy: {
      namaWilayah: 'asc',
    },
  });
}

// =====================================================
// JENIS SAMPAH
// =====================================================

export async function getJenisSampahList() {
  return prisma.jenisSampah.findMany({
    orderBy: {
      namaJenis: 'asc',
    },
  });
}

// =====================================================
// USER - LAPORAN SAMPAH
// =====================================================

export async function submitReport(
  prevState: any,
  formData: FormData
) {
  const session = await getSession();

  if (!session) {
    return {
      error: 'Anda harus login terlebih dahulu.',
    };
  }

  const wilayahId = String(
    formData.get('wilayahId') || ''
  );

  const jenisSampahId = String(
    formData.get('jenisSampahId') || ''
  );

  const deskripsi = String(
    formData.get('deskripsi') || ''
  ).trim();

  const fotoUrl = String(
    formData.get('fotoUrl') || ''
  ).trim();

  if (
    !wilayahId ||
    !jenisSampahId ||
    !deskripsi ||
    !fotoUrl
  ) {
    return {
      error: 'Semua field laporan wajib diisi.',
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const laporan = await tx.laporanSampah.create({
        data: {
          userId: session.id,
          wilayahId,
          jenisSampahId,
          deskripsi,
          status: 'PENDING',
        },
      });

      await tx.fotoSampah.create({
        data: {
          laporanId: laporan.id,
          url: fotoUrl,
        },
      });
    });

    return {
      success: 'Laporan berhasil dikirim!',
    };
  } catch (error: any) {
    console.error('SUBMIT REPORT ERROR:', error);

    return {
      error:
        'Gagal membuat laporan: ' +
        (error?.message || 'Terjadi kesalahan.'),
    };
  }
}

// =====================================================
// USER - MELIHAT LAPORAN
// =====================================================

export async function getUserReports() {
  const session = await getSession();

  if (!session) {
    return [];
  }

  return prisma.laporanSampah.findMany({
    where: {
      userId: session.id,
    },
    include: {
      wilayah: true,
      jenisSampah: true,
      fotoSampah: true,
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// =====================================================
// ADMIN - MELIHAT SEMUA LAPORAN
// =====================================================

export async function getAdminReports() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return prisma.laporanSampah.findMany({
    include: {
      user: true,
      wilayah: true,
      jenisSampah: true,
      fotoSampah: true,
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// =====================================================
// ADMIN - UPDATE STATUS LAPORAN
// =====================================================

export async function updateReportStatus(
  reportId: string,
  status: string
) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  if (!reportId || !status) {
    throw new Error('Data tidak lengkap.');
  }

  await prisma.laporanSampah.update({
    where: {
      id: reportId,
    },
    data: {
      status,
    },
  });

  return {
    success: true,
  };
}

// =====================================================
// ADMIN - HAPUS LAPORAN
// =====================================================

export async function deleteReport(reportId: string) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  if (!reportId) {
    throw new Error('ID laporan tidak ditemukan.');
  }

  await prisma.laporanSampah.delete({
    where: {
      id: reportId,
    },
  });

  return {
    success: true,
  };
}

// =====================================================
// ADMIN - TAMBAH WILAYAH
// =====================================================

export async function addWilayah(
  namaWilayah: string
) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const nama = namaWilayah.trim();

  if (!nama) {
    return {
      error: 'Nama wilayah tidak boleh kosong.',
    };
  }

  try {
    await prisma.wilayah.create({
      data: {
        namaWilayah: nama,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('ADD WILAYAH ERROR:', error);

    if (error?.code === 'P2002') {
      return {
        error: 'Nama wilayah sudah terdaftar.',
      };
    }

    return {
      error:
        'Gagal menambahkan wilayah: ' +
        (error?.message || 'Terjadi kesalahan.'),
    };
  }
}

// =====================================================
// ADMIN - HAPUS WILAYAH
// =====================================================

export async function deleteWilayah(id: string) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  if (!id) {
    return {
      error: 'ID wilayah tidak ditemukan.',
    };
  }

  try {
    await prisma.wilayah.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('DELETE WILAYAH ERROR:', error);

    if (
      error?.code === 'P2003' ||
      error?.message?.includes('foreign key constraint')
    ) {
      return {
        error:
          'Tidak dapat menghapus wilayah ini karena masih terhubung dengan laporan sampah.',
      };
    }

    return {
      error:
        'Gagal menghapus wilayah: ' +
        (error?.message || 'Terjadi kesalahan.'),
    };
  }
}

// =====================================================
// ADMIN - TAMBAH JENIS SAMPAH
// =====================================================

export async function addJenisSampah(
  namaJenis: string
) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const nama = namaJenis.trim();

  if (!nama) {
    return {
      error: 'Nama jenis sampah tidak boleh kosong.',
    };
  }

  try {
    await prisma.jenisSampah.create({
      data: {
        namaJenis: nama,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('ADD JENIS SAMPAH ERROR:', error);

    if (error?.code === 'P2002') {
      return {
        error: 'Nama jenis sampah sudah terdaftar.',
      };
    }

    return {
      error:
        'Gagal menambahkan jenis sampah: ' +
        (error?.message || 'Terjadi kesalahan.'),
    };
  }
}

// =====================================================
// ADMIN - HAPUS JENIS SAMPAH
// =====================================================

export async function deleteJenisSampah(id: string) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  if (!id) {
    return {
      error: 'ID jenis sampah tidak ditemukan.',
    };
  }

  try {
    await prisma.jenisSampah.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(
      'DELETE JENIS SAMPAH ERROR:',
      error
    );

    if (
      error?.code === 'P2003' ||
      error?.message?.includes('foreign key constraint')
    ) {
      return {
        error:
          'Tidak dapat menghapus jenis sampah ini karena masih terhubung dengan laporan atau transaksi.',
      };
    }

    return {
      error:
        'Gagal menghapus jenis sampah: ' +
        (error?.message || 'Terjadi kesalahan.'),
    };
  }
}

// =====================================================
// TRANSAKSI SAMPAH
// =====================================================

// USER - MENGAMBIL SALDO DOMPET SAMPAH
export async function getUserMoneyPocket(): Promise<number> {
  const session = await getSession();

  if (!session) {
    return 0;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      moneyPocket: true,
    },
  });

  return user ? Number(user.moneyPocket) : 0;
}

// USER - MEMBUAT TRANSAKSI JUAL SAMPAH
export async function createTransaksi(
  jenisId: string,
  berat: number
) {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      message: 'Anda harus login terlebih dahulu.',
    };
  }

  if (!jenisId) {
    return {
      success: false,
      message: 'Jenis sampah wajib dipilih.',
    };
  }

  const numBerat = Number(berat);
  if (!numBerat || numBerat <= 0) {
    return {
      success: false,
      message: 'Berat sampah harus lebih dari 0 kg.',
    };
  }

  try {
    // Ambil info jenis sampah dan tentukan harga per kg
    const jenis = await prisma.jenisSampah.findUnique({
      where: {
        id: jenisId,
      },
    });

    if (!jenis) {
      return {
        success: false,
        message: 'Jenis sampah tidak ditemukan.',
      };
    }

    const hargaPerKg =
      Number(jenis.hargaPerKg) > 0
        ? Number(jenis.hargaPerKg)
        : getHargaSampah(jenis.namaJenis);

    const totalHarga = Math.round(numBerat * hargaPerKg);

    const transaksi = await prisma.transaksi.create({
      data: {
        userId: session.id,
        jenisId: jenisId,
        berat: numBerat,
        hargaPerKg: hargaPerKg,
        totalHarga: totalHarga,
        status: 'PENDING',
        saldoDiberikan: false,
      },
    });

    return {
      success: true,
      message: 'Transaksi berhasil dibuat.',
      transaksiId: transaksi.id,
    };
  } catch (error: any) {
    console.error(
      'CREATE TRANSAKSI ERROR:',
      error
    );

    return {
      success: false,
      message:
        'Gagal membuat transaksi: ' +
        (error?.message || 'Terjadi kesalahan.'),
    };
  }
}

// =====================================================
// USER - MELIHAT TRANSAKSI SENDIRI
// =====================================================

export async function getUserTransaksi() {
  const session = await getSession();

  if (!session) {
    return [];
  }

  return prisma.transaksi.findMany({
    where: {
      userId: session.id,
    },
    include: {
      jenis: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// =====================================================
// ADMIN - MELIHAT SEMUA TRANSAKSI
// =====================================================

export async function getAdminTransaksi() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return prisma.transaksi.findMany({
    include: {
      user: true,
      jenis: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// =====================================================
// ADMIN - UPDATE STATUS TRANSAKSI & SALDO
// =====================================================

export async function updateTransaksiStatus(
  transaksiId: string,
  status:
    | 'PENDING'
    | 'DIPROSES'
    | 'SELESAI'
    | 'DIBATALKAN'
) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  if (!transaksiId || !status) {
    throw new Error('Data transaksi tidak lengkap.');
  }

  try {
    await prisma.$transaction(async (tx) => {
      const current = await tx.transaksi.findUnique({
        where: { id: transaksiId },
      });

      if (!current) {
        throw new Error('Transaksi tidak ditemukan.');
      }

      const nominal = Number(current.totalHarga);
      let newSaldoDiberikan = current.saldoDiberikan;

      // Jika status berubah ke SELESAI dan saldo belum diberikan
      if (status === 'SELESAI' && !current.saldoDiberikan) {
        newSaldoDiberikan = true;
        await tx.user.update({
          where: { id: current.userId },
          data: {
            moneyPocket: {
              increment: nominal,
            },
          },
        });
      }
      // Jika status diubah dari SELESAI ke status lain dan saldo sudah diberikan sebelumnya
      else if (status !== 'SELESAI' && current.saldoDiberikan) {
        newSaldoDiberikan = false;
        await tx.user.update({
          where: { id: current.userId },
          data: {
            moneyPocket: {
              decrement: nominal,
            },
          },
        });
      }

      await tx.transaksi.update({
        where: { id: transaksiId },
        data: {
          status,
          saldoDiberikan: newSaldoDiberikan,
        },
      });
    });

    return {
      success: true,
      message: 'Status transaksi berhasil diperbarui.',
    };
  } catch (error: any) {
    console.error(
      'UPDATE TRANSAKSI STATUS ERROR:',
      error
    );

    return {
      success: false,
      message:
        error?.message || 'Gagal memperbarui status transaksi.',
    };
  }
}

// =====================================================
// ADMIN - HAPUS TRANSAKSI
// =====================================================

export async function deleteTransaksi(
  transaksiId: string
) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  if (!transaksiId) {
    throw new Error('ID transaksi tidak ditemukan.');
  }

  try {
    await prisma.$transaction(async (tx) => {
      const current = await tx.transaksi.findUnique({
        where: { id: transaksiId },
      });

      if (!current) {
        throw new Error('Transaksi tidak ditemukan.');
      }

      // Jika saldo sudah pernah diberikan, tarik kembali dari dompet user
      if (current.saldoDiberikan) {
        const nominal = Number(current.totalHarga);
        await tx.user.update({
          where: { id: current.userId },
          data: {
            moneyPocket: {
              decrement: nominal,
            },
          },
        });
      }

      await tx.transaksi.delete({
        where: { id: transaksiId },
      });
    });

    return {
      success: true,
      message: 'Transaksi berhasil dihapus.',
    };
  } catch (error: any) {
    console.error(
      'DELETE TRANSAKSI ERROR:',
      error
    );

    return {
      success: false,
      message: error?.message || 'Gagal menghapus transaksi.',
    };
  }
}