-- AddForeignKey
ALTER TABLE "PendingAutomation" ADD CONSTRAINT "PendingAutomation_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
