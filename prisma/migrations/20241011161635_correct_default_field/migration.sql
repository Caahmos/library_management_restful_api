-- AlterTable
ALTER TABLE `biblio_status_dm` MODIFY `description` VARCHAR(191) NULL,
    MODIFY `default_flg` BOOLEAN NOT NULL DEFAULT false;
