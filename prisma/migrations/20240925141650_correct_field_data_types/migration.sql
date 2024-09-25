/*
  Warnings:

  - You are about to alter the column `default_flg` on the `mbr_classify_dm` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `suspended_flg` on the `staff` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `admin_flg` on the `staff` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `circ_flg` on the `staff` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `circ_mbr_flg` on the `staff` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `catalog_flg` on the `staff` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `reports_flg` on the `staff` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - A unique constraint covering the columns `[username]` on the table `staff` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `mbr_classify_dm` MODIFY `default_flg` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `staff` MODIFY `suspended_flg` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `admin_flg` BOOLEAN NOT NULL,
    MODIFY `circ_flg` BOOLEAN NOT NULL,
    MODIFY `circ_mbr_flg` BOOLEAN NOT NULL,
    MODIFY `catalog_flg` BOOLEAN NOT NULL,
    MODIFY `reports_flg` BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `staff_username_key` ON `staff`(`username`);
