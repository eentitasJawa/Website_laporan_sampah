import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import crypto from 'crypto';

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Seed Wilayah
  const wilayahList = [
    'Jakarta Pusat',
    'Jakarta Selatan',
    'Jakarta Barat',
    'Jakarta Timur',
    'Jakarta Utara',
    'Bandung',
    'Surabaya'
  ];
  for (const namaWilayah of wilayahList) {
    await prisma.wilayah.upsert({
      where: { namaWilayah },
      update: {},
      create: { namaWilayah }
    });
  }

  // Seed JenisSampah
const jenisList = [
  { namaJenis: 'Sampah Organik', hargaPerKg: 2000 },
  { namaJenis: 'Sampah Anorganik', hargaPerKg: 5000 },
  { namaJenis: 'Sampah B3', hargaPerKg: 3000 },
  { namaJenis: 'Sampah Kertas', hargaPerKg: 4000 },
  { namaJenis: 'Sampah Plastik', hargaPerKg: 6000 },
];
  for (const jenis of jenisList) {
  await prisma.jenisSampah.upsert({
    where: { namaJenis: jenis.namaJenis },
    update: {
      hargaPerKg: jenis.hargaPerKg,
    },
    create: {
      namaJenis: jenis.namaJenis,
      hargaPerKg: jenis.hargaPerKg,
    },
  });
}

  // Seed Tags for Many-to-Many
  const tagsList = [
    'Bau Menyengat',
    'Menghalangi Jalan',
    'Limbah Beracun',
    'Sampah Plastik Dominan',
    'Butuh Penanganan Segera'
  ];
  for (const namaTag of tagsList) {
    await prisma.tag.upsert({
      where: { namaTag },
      update: {},
      create: { namaTag }
    });
  }

  // Seed Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@websampah.com' },
    update: {},
    create: {
  nama: 'Admin Web Sampah',
  email: 'admin@websampah.com',
  noHp: '081234567890',
  password: hashPassword('admin123'),
  role: 'ADMIN',
  moneyPocket: 0,
}
  });

  const userObj = await prisma.user.upsert({
    where: { email: 'user@websampah.com' },
    update: {},
    create: {
  nama: 'Budi Santoso',
  email: 'user@websampah.com',
  noHp: '089876543210',
  password: hashPassword('user123'),
  role: 'USER',
  moneyPocket: 0,
}
  });

  // Seed one report with relations (including Many-to-Many tags)
  const defaultWilayah = await prisma.wilayah.findFirst();
  const defaultJenis = await prisma.jenisSampah.findFirst();
  const defaultTags = await prisma.tag.findMany({ take: 3 });

  if (defaultWilayah && defaultJenis) {
    // Check if report already exists
    const existingReport = await prisma.laporanSampah.findFirst({
      where: { userId: userObj.id }
    });

    if (!existingReport) {
      const newLaporan = await prisma.laporanSampah.create({
        data: {
          userId: userObj.id,
          wilayahId: defaultWilayah.id,
          jenisSampahId: defaultJenis.id,
          deskripsi: 'Tumpukan sampah plastik dan limbah dapur menumpuk di gang masuk. Mengeluarkan bau menyengat.',
          status: 'PENDING',
          tags: {
            connect: defaultTags.map(t => ({ id: t.id }))
          }
        }
      });

      await prisma.fotoSampah.create({
        data: {
          laporanId: newLaporan.id,
          url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400'
        }
      });
      console.log('Seeded demo LaporanSampah with Tags (N:N) and FotoSampah (1:1).');
    }
  }

  console.log('Seeding finished.');
  await pool.end();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
