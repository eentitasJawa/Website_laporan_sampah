-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "namaTag" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LaporanToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LaporanToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_namaTag_key" ON "Tag"("namaTag");

-- CreateIndex
CREATE INDEX "_LaporanToTag_B_index" ON "_LaporanToTag"("B");

-- AddForeignKey
ALTER TABLE "_LaporanToTag" ADD CONSTRAINT "_LaporanToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "LaporanSampah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LaporanToTag" ADD CONSTRAINT "_LaporanToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
