/*
  Warnings:

  - You are about to drop the column `highlights` on the `SubscriptionPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubscriptionPlan" DROP COLUMN "highlights",
ADD COLUMN     "highlight" TEXT;
