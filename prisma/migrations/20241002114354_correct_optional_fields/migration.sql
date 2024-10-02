/*
  Warnings:

  - You are about to drop the column `firstName` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `staff` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `member` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    ADD COLUMN `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `last_name` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `home_phone` INTEGER NULL,
    MODIFY `work_phone` INTEGER NULL;

-- AlterTable
ALTER TABLE `staff` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    ADD COLUMN `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `last_name` VARCHAR(191) NOT NULL;
