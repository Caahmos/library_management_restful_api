/*
  Warnings:

  - You are about to drop the column `days_due_back` on the `mbr_classify_dm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `checkout_privs` ADD COLUMN `days_due_back` INTEGER NOT NULL DEFAULT 14;

-- AlterTable
ALTER TABLE `mbr_classify_dm` DROP COLUMN `days_due_back`;
