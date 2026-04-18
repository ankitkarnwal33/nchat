/*
  Warnings:

  - A unique constraint covering the columns `[automationId,instagramUserId,commentId]` on the table `AutomationLog` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AutomationLog_automationId_instagramUserId_key";

-- CreateIndex
CREATE UNIQUE INDEX "AutomationLog_automationId_instagramUserId_commentId_key" ON "AutomationLog"("automationId", "instagramUserId", "commentId");
