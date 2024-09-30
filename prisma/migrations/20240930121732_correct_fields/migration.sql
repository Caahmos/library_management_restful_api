-- DropForeignKey
ALTER TABLE `staff` DROP FOREIGN KEY `staff_last_change_userid_fkey`;

-- AlterTable
ALTER TABLE `staff` MODIFY `last_change_userid` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `staff` ADD CONSTRAINT `staff_last_change_userid_fkey` FOREIGN KEY (`last_change_userid`) REFERENCES `staff`(`userid`) ON DELETE SET NULL ON UPDATE CASCADE;
