/*
  Warnings:

  - You are about to alter the column `max_fines` on the `mbr_classify_dm` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `mbr_classify_dm` MODIFY `max_fines` DECIMAL(65, 30) NOT NULL DEFAULT 0;
