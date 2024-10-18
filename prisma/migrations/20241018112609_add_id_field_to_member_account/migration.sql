/*
  Warnings:

  - The primary key for the `member_account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `member_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `member_account` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `transid` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);
