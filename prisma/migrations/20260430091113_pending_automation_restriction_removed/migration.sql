-- DropForeignKey
ALTER TABLE "PendingAutomation" DROP CONSTRAINT "PendingAutomation_automationId_fkey";

-- AddForeignKey
ALTER TABLE "PendingAutomation" ADD CONSTRAINT "PendingAutomation_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
