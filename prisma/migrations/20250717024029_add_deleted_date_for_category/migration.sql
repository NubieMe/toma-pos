-- AlterTable
ALTER TABLE "categories" ADD COLUMN "deleted_by" TEXT;
ALTER TABLE "categories" ADD COLUMN "deleted_date" DATETIME;
