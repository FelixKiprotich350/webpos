/*
  Warnings:

  - You are about to drop the `Sale` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `basketSale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packingUnitUuid` to the `basketSale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxPercentage` to the `basketSale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Sale` DROP FOREIGN KEY `Sale_productUuid_fkey`;

-- AlterTable
ALTER TABLE `basketSale` ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `packingUnitUuid` VARCHAR(191) NOT NULL,
    ADD COLUMN `taxPercentage` DECIMAL(65, 30) NOT NULL,
    MODIFY `price` DECIMAL(65, 30) NOT NULL;

-- DropTable
DROP TABLE `Sale`;

-- CreateTable
CREATE TABLE `ProductSale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `productUuid` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(65, 30) NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `taxPercentage` DECIMAL(65, 30) NOT NULL,
    `packingUnitUuid` VARCHAR(191) NOT NULL,
    `paymentStatus` VARCHAR(191) NOT NULL,
    `userUuid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `productPackUnitUuid` VARCHAR(191) NULL,

    UNIQUE INDEX `ProductSale_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductSale` ADD CONSTRAINT `ProductSale_productUuid_fkey` FOREIGN KEY (`productUuid`) REFERENCES `Product`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `basketSale` ADD CONSTRAINT `basketSale_productUuid_fkey` FOREIGN KEY (`productUuid`) REFERENCES `Product`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
