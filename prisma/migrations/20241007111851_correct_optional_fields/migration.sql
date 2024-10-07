-- AlterTable
ALTER TABLE `collection_dm` MODIFY `default_flg` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `daily_late_fee` DECIMAL(65, 30) NOT NULL DEFAULT 0;
