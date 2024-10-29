-- DropForeignKey
ALTER TABLE `biblio_media` DROP FOREIGN KEY `biblio_media_bibid_fkey`;

-- DropForeignKey
ALTER TABLE `biblio_rank` DROP FOREIGN KEY `biblio_rank_bibid_fkey`;

-- AddForeignKey
ALTER TABLE `biblio_media` ADD CONSTRAINT `biblio_media_bibid_fkey` FOREIGN KEY (`bibid`) REFERENCES `biblio`(`bibid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio_rank` ADD CONSTRAINT `biblio_rank_bibid_fkey` FOREIGN KEY (`bibid`) REFERENCES `biblio`(`bibid`) ON DELETE CASCADE ON UPDATE CASCADE;
