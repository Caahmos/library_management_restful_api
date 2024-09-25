/*
  Warnings:

  - The primary key for the `member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `member` table. All the data in the column will be lost.
  - The primary key for the `staff` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `staff` table. All the data in the column will be lost.
  - Added the required column `mbrid` to the `member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `member` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `mbrid` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`mbrid`);

-- AlterTable
ALTER TABLE `staff` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `userid` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`userid`);

-- CreateTable
CREATE TABLE `member_account` (
    `transid` INTEGER NOT NULL AUTO_INCREMENT,
    `mbrid` INTEGER NOT NULL,
    `create_userid` INTEGER NOT NULL,
    `transaction_type` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`transid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `member_account` ADD CONSTRAINT `member_account_create_userid_fkey` FOREIGN KEY (`create_userid`) REFERENCES `staff`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_account` ADD CONSTRAINT `member_account_mbrid_fkey` FOREIGN KEY (`mbrid`) REFERENCES `member`(`mbrid`) ON DELETE RESTRICT ON UPDATE CASCADE;
