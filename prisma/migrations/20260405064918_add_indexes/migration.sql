-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Record_userId_date_idx" ON "Record"("userId", "date");

-- CreateIndex
CREATE INDEX "Record_type_idx" ON "Record"("type");

-- CreateIndex
CREATE INDEX "Record_category_idx" ON "Record"("category");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_deleted_idx" ON "User"("deleted");
