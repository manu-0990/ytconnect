/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Video` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'REVIEW';

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "thumbnail";

-- CreateTable
CREATE TABLE "Thumbnail" (
    "id" INTEGER NOT NULL,
    "videoId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Thumbnail_pkey" PRIMARY KEY ("id","videoId")
);

-- AddForeignKey
ALTER TABLE "Thumbnail" ADD CONSTRAINT "Thumbnail_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
