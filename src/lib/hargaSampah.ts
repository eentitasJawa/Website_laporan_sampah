export const hargaSampah: Record<string, number> = {
  "Sampah Organik": 2000,
  "Sampah Anorganik": 4000,
  "Sampah B3": 1000,
  "Sampah Kertas": 3000,
  "Sampah Plastik": 5000,
};

export function getHargaSampah(namaJenis: string, fallbackPrice: number = 2000): number {
  if (namaJenis in hargaSampah) {
    return hargaSampah[namaJenis];
  }
  return fallbackPrice;
}