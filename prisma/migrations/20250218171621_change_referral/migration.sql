/*
  Warnings:

  - A unique constraint covering the columns `[editorId]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Referral_editorId_key" ON "Referral"("editorId");
