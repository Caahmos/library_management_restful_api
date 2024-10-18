/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `material_type_dm` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `material_type_dm_description_key` ON `material_type_dm`(`description`);
