/*
  Warnings:

  - Added the required column `category_auto` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "logo" TEXT,
    "item_auto" BOOLEAN NOT NULL DEFAULT false,
    "item_format" TEXT,
    "item_separator" TEXT,
    "user_auto" BOOLEAN NOT NULL DEFAULT false,
    "user_format" TEXT,
    "user_separator" TEXT,
    "category_auto" BOOLEAN NOT NULL,
    "category_format" TEXT,
    "category_separator" TEXT,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME,
    "created_by" TEXT,
    "updated_by" TEXT
);
INSERT INTO "new_companies" ("address", "created_by", "created_date", "email", "id", "item_auto", "item_format", "logo", "name", "phone", "updated_by", "updated_date", "user_auto", "user_format") SELECT "address", "created_by", "created_date", "email", "id", "item_auto", "item_format", "logo", "name", "phone", "updated_by", "updated_date", "user_auto", "user_format" FROM "companies";
DROP TABLE "companies";
ALTER TABLE "new_companies" RENAME TO "companies";
CREATE TABLE "new_sequences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL DEFAULT 0,
    "month" INTEGER,
    "year" INTEGER,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME
);
INSERT INTO "new_sequences" ("created_date", "id", "month", "name", "number", "updated_date", "year") SELECT "created_date", "id", "month", "name", "number", "updated_date", "year" FROM "sequences";
DROP TABLE "sequences";
ALTER TABLE "new_sequences" RENAME TO "sequences";
CREATE UNIQUE INDEX "sequences_name_key" ON "sequences"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
