-- AlterTable
ALTER TABLE "Video" ADD COLUMN "userId" TEXT;

-- CreateIndex
CREATE INDEX "Video_userId_idx" ON "Video"("userId");
