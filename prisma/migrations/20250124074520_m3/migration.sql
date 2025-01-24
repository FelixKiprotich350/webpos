/*
  Warnings:

  - You are about to drop the column `basicUnit` on the `Product` table. All the data in the column will be lost.
  - Added the required column `basicUnitUuid` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` DROP COLUMN `basicUnit`,
    ADD COLUMN `basicUnitUuid` VARCHAR(191) NOT NULL;
