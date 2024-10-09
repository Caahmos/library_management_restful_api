/*
  Warnings:

  - You are about to drop the column `indicator_cd` on the `usmarc_indicator_dm` table. All the data in the column will be lost.
  - Added the required column `indicator_nmbr` to the `usmarc_indicator_dm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usmarc_indicator_dm` DROP COLUMN `indicator_cd`,
    ADD COLUMN `indicator_nmbr` INTEGER NOT NULL;
