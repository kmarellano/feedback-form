/*
  Warnings:

  - Added the required column `preferredService` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Services" AS ENUM ('DELIVERY', 'PAYMENT', 'PICKUP');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "preferredService" "Services" NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;
