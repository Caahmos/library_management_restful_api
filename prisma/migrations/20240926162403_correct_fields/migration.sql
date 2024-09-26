-- AddForeignKey
ALTER TABLE `biblio_status_hist` ADD CONSTRAINT `biblio_status_hist_status_cd_fkey` FOREIGN KEY (`status_cd`) REFERENCES `biblio_status_dm`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
