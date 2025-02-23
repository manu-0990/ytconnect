/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[videoId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "videoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "projectId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_videoId_key" ON "Project"("videoId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
