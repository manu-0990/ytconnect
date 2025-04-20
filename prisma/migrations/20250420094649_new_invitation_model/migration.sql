/*
  Warnings:

  - You are about to drop the `Referral` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[invitationId]` on the table `Editor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('INVITE', 'REQUEST');

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_editorId_fkey";

-- AlterTable
ALTER TABLE "Editor" ADD COLUMN     "invitationId" INTEGER;

-- DropTable
DROP TABLE "Referral";

-- CreateTable
CREATE TABLE "Invitation" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "editorId" INTEGER,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_editorId_key" ON "Invitation"("editorId");

-- CreateIndex
CREATE UNIQUE INDEX "Editor_invitationId_key" ON "Editor"("invitationId");

-- AddForeignKey
ALTER TABLE "Editor" ADD CONSTRAINT "Editor_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
