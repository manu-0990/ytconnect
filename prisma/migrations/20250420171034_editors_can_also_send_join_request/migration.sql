/*
  Warnings:

  - You are about to drop the column `invitationId` on the `Editor` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Editor" DROP CONSTRAINT "Editor_invitationId_fkey";

-- DropIndex
DROP INDEX "Editor_invitationId_key";

-- DropIndex
DROP INDEX "Invitation_editorId_key";

-- AlterTable
ALTER TABLE "Editor" DROP COLUMN "invitationId";

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "type" "RequestType" NOT NULL DEFAULT 'INVITE',
ALTER COLUMN "email" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "Editor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
