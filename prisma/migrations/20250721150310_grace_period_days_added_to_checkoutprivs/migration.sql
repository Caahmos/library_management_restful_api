-- AlterTable
ALTER TABLE `checkout_privs` ADD COLUMN `grace_period_days` INTEGER NOT NULL DEFAULT 1;
