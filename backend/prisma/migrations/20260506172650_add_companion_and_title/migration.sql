-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "companionId" TEXT,
ADD COLUMN     "title" TEXT;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_companionId_fkey" FOREIGN KEY ("companionId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
