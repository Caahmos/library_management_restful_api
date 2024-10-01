/*
  Warnings:

  - You are about to alter the column `max_fines` on the `mbr_classify_dm` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(4,2)`.

*/
-- AlterTable
ALTER TABLE `mbr_classify_dm` MODIFY `max_fines` DECIMAL(4, 2) NOT NULL DEFAULT 0;
