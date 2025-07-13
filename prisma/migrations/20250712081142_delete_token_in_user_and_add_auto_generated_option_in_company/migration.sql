/*
  Warnings:

  - You are about to drop the column `token` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "logo" TEXT,
    "item_auto" BOOLEAN NOT NULL DEFAULT false,
    "item_format" TEXT,
    "user_auto" BOOLEAN NOT NULL DEFAULT false,
    "user_format" TEXT,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME,
    "created_by" TEXT,
    "updated_by" TEXT
);
INSERT INTO "new_Company" ("address", "created_date", "email", "id", "logo", "name", "phone", "updated_date") SELECT "address", "created_date", "email", "id", "logo", "name", "phone", "updated_date" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role_id" TEXT,
    "profile_id" TEXT,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_date" DATETIME,
    "deleted_by" TEXT,
    CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "User_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("created_by", "created_date", "deleted_by", "deleted_date", "id", "password", "profile_id", "role_id", "updated_by", "updated_date", "username") SELECT "created_by", "created_date", "deleted_by", "deleted_date", "id", "password", "profile_id", "role_id", "updated_by", "updated_date", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_profile_id_key" ON "User"("profile_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
