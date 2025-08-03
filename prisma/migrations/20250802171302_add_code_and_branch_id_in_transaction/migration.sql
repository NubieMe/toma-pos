/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branch_id` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "branch_id" TEXT NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_code_key" ON "transactions"("code");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
