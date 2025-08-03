/*
  Warnings:

  - Added the required column `gender` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `religion` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "Religion" AS ENUM ('Islam', 'Katolik', 'Protestan', 'Hindu', 'Budha', 'Konghucu', 'Lainnya');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "gender" "Gender" NOT NULL,
DROP COLUMN "religion",
ADD COLUMN     "religion" "Religion" NOT NULL;
