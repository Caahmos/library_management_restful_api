-- AddForeignKey
ALTER TABLE `biblio_status_hist` ADD CONSTRAINT `biblio_status_hist_copyid_fkey` FOREIGN KEY (`copyid`) REFERENCES `biblio_copy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
