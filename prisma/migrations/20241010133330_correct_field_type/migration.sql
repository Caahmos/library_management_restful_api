/*
  Warnings:

  - You are about to drop the column `barcode` on the `biblio_copy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[barcode_nmbr]` on the table `biblio_copy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barcode_nmbr` to the `biblio_copy` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `biblio_copy_barcode_key` ON `biblio_copy`;

-- AlterTable
ALTER TABLE `biblio_copy` DROP COLUMN `barcode`,
    ADD COLUMN `barcode_nmbr` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `biblio_copy_barcode_nmbr_key` ON `biblio_copy`(`barcode_nmbr`);
