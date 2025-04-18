/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_projectId_key" ON "Review"("projectId");
