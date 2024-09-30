/*
  Warnings:

  - Made the column `last_change_userid` on table `staff` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `staff` DROP FOREIGN KEY `staff_last_change_userid_fkey`;

-- AlterTable
ALTER TABLE `staff` MODIFY `last_change_userid` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `staff` ADD CONSTRAINT `staff_last_change_userid_fkey` FOREIGN KEY (`last_change_userid`) REFERENCES `staff`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;
