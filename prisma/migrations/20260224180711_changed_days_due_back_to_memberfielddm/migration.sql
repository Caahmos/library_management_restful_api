/*
  Warnings:

  - You are about to drop the column `days_due_back` on the `collection_dm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `collection_dm` DROP COLUMN `days_due_back`;

-- AlterTable
ALTER TABLE `member_fields_dm` ADD COLUMN `days_due_back` INTEGER NOT NULL DEFAULT 14;
