/*
  Warnings:

  - Added the required column `indicator_cd` to the `usmarc_indicator_dm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usmarc_indicator_dm` ADD COLUMN `indicator_cd` VARCHAR(191) NOT NULL;
