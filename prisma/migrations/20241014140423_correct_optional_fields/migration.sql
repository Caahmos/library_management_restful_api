-- DropForeignKey
ALTER TABLE `biblio_copy` DROP FOREIGN KEY `biblio_copy_bibid_fkey`;

-- DropForeignKey
ALTER TABLE `biblio_copy` DROP FOREIGN KEY `biblio_copy_mbrid_fkey`;

-- DropForeignKey
ALTER TABLE `biblio_copy` DROP FOREIGN KEY `biblio_copy_status_cd_fkey`;

-- AddForeignKey
ALTER TABLE `biblio_copy` ADD CONSTRAINT `biblio_copy_status_cd_fkey` FOREIGN KEY (`status_cd`) REFERENCES `biblio_status_dm`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio_copy` ADD CONSTRAINT `biblio_copy_mbrid_fkey` FOREIGN KEY (`mbrid`) REFERENCES `member`(`mbrid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio_copy` ADD CONSTRAINT `biblio_copy_bibid_fkey` FOREIGN KEY (`bibid`) REFERENCES `biblio`(`bibid`) ON DELETE CASCADE ON UPDATE CASCADE;
