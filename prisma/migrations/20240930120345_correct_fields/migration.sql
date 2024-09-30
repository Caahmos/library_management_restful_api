/*
  Warnings:

  - You are about to drop the column `rm` on the `member` table. All the data in the column will be lost.
  - Added the required column `last_change_userid` to the `member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_change_userid` to the `staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `member_rm_key` ON `member`;

-- AlterTable
ALTER TABLE `member` DROP COLUMN `rm`,
    ADD COLUMN `last_change_userid` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `staff` ADD COLUMN `last_change_userid` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `staff` ADD CONSTRAINT `staff_last_change_userid_fkey` FOREIGN KEY (`last_change_userid`) REFERENCES `staff`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_last_change_userid_fkey` FOREIGN KEY (`last_change_userid`) REFERENCES `staff`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;
