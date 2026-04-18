/*
  Warnings:

  - You are about to drop the column `edges` on the `Automation` table. All the data in the column will be lost.
  - You are about to drop the column `nodes` on the `Automation` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ActionType" ADD VALUE 'REPLY_COMMENT_SEND_DM';

-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "meta" JSONB,
ALTER COLUMN "delaySeconds" SET DEFAULT 5;

-- AlterTable
ALTER TABLE "Automation" DROP COLUMN "edges",
DROP COLUMN "nodes";
