import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const jenis = await prisma.jenisSampah.findMany({
      orderBy: {
        namaJenis: "asc",
      },
    });

    return NextResponse.json(jenis);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal mengambil jenis sampah",
      },
      {
        status: 500,
      }
    );
  }
}