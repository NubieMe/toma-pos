/*
  Warnings:

  - You are about to drop the column `charges` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `payment_details` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Branch" ADD COLUMN "created_by" TEXT;
ALTER TABLE "Branch" ADD COLUMN "deleted_by" TEXT;
ALTER TABLE "Branch" ADD COLUMN "deleted_date" DATETIME;
ALTER TABLE "Branch" ADD COLUMN "updated_by" TEXT;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN "created_by" TEXT;
ALTER TABLE "Item" ADD COLUMN "deleted_by" TEXT;
ALTER TABLE "Item" ADD COLUMN "deleted_date" DATETIME;
ALTER TABLE "Item" ADD COLUMN "updated_by" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "created_by" TEXT;
ALTER TABLE "Product" ADD COLUMN "deleted_by" TEXT;
ALTER TABLE "Product" ADD COLUMN "deleted_date" DATETIME;
ALTER TABLE "Product" ADD COLUMN "updated_by" TEXT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "created_by" TEXT;
ALTER TABLE "Profile" ADD COLUMN "deleted_by" TEXT;
ALTER TABLE "Profile" ADD COLUMN "deleted_date" DATETIME;
ALTER TABLE "Profile" ADD COLUMN "updated_by" TEXT;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN "created_by" TEXT;
ALTER TABLE "Role" ADD COLUMN "deleted_by" TEXT;
ALTER TABLE "Role" ADD COLUMN "deleted_date" DATETIME;
ALTER TABLE "Role" ADD COLUMN "updated_by" TEXT;

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN "created_by" TEXT;
ALTER TABLE "Stock" ADD COLUMN "deleted_by" TEXT;
ALTER TABLE "Stock" ADD COLUMN "deleted_date" DATETIME;
ALTER TABLE "Stock" ADD COLUMN "updated_by" TEXT;

-- AlterTable
ALTER TABLE "StockIO" ADD COLUMN "created_by" TEXT;
ALTER TABLE "StockIO" ADD COLUMN "deleted_by" TEXT;
ALTER TABLE "StockIO" ADD COLUMN "deleted_date" DATETIME;
ALTER TABLE "StockIO" ADD COLUMN "updated_by" TEXT;

-- AlterTable
ALTER TABLE "Uom" ADD COLUMN "created_by" TEXT;
ALTER TABLE "Uom" ADD COLUMN "deleted_by" TEXT;
ALTER TABLE "Uom" ADD COLUMN "deleted_date" DATETIME;
ALTER TABLE "Uom" ADD COLUMN "updated_by" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "created_by" TEXT;
ALTER TABLE "User" ADD COLUMN "deleted_by" TEXT;
ALTER TABLE "User" ADD COLUMN "deleted_date" DATETIME;
ALTER TABLE "User" ADD COLUMN "updated_by" TEXT;

-- CreateTable
CREATE TABLE "Charges_Detail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transaction_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "percent" BOOLEAN NOT NULL,
    "percentage" REAL NOT NULL,
    "amount" REAL NOT NULL,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME,
    CONSTRAINT "Charges_Detail_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "net_price" REAL NOT NULL,
    "total_ppn" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "total" REAL NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "amount" REAL,
    "date" DATETIME,
    "payment_method" TEXT,
    "note" TEXT,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_date" DATETIME,
    "updated_by" TEXT,
    "deleted_date" DATETIME,
    "deleted_by" TEXT
);
INSERT INTO "new_Transaction" ("created_date", "id", "net_price", "note", "subtotal", "total", "total_ppn", "updated_date") SELECT "created_date", "id", "net_price", "note", "subtotal", "total", "total_ppn", "updated_date" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
