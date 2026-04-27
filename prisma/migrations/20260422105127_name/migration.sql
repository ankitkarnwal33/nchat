-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_instagramAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_instagramAccountId_fkey";

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_instagramAccountId_fkey" FOREIGN KEY ("instagramAccountId") REFERENCES "InstagramAccount"("instagramUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_instagramAccountId_fkey" FOREIGN KEY ("instagramAccountId") REFERENCES "InstagramAccount"("instagramUserId") ON DELETE CASCADE ON UPDATE CASCADE;
