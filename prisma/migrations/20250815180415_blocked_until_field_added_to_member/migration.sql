/*
  Warnings:

  - You are about to drop the column `blocked_until` on the `biblio_status_hist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `biblio_status_hist` DROP COLUMN `blocked_until`;

-- AlterTable
ALTER TABLE `member` ADD COLUMN `blocked_until` DATETIME(3) NULL;
