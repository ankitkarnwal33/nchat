/*
  Warnings:

  - You are about to drop the `Campaign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CampaignContact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WhatsAppAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WhatsAppTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_whatsappAccountId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignContact" DROP CONSTRAINT "CampaignContact_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignContact" DROP CONSTRAINT "CampaignContact_contactId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_instagramAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_whatsappAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_contactId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_instagramAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_whatsappAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "WhatsAppAccount" DROP CONSTRAINT "WhatsAppAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "WhatsAppTemplate" DROP CONSTRAINT "WhatsAppTemplate_whatsappAccountId_fkey";

-- DropTable
DROP TABLE "Campaign";

-- DropTable
DROP TABLE "CampaignContact";

-- DropTable
DROP TABLE "Contact";

-- DropTable
DROP TABLE "Conversation";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "WhatsAppAccount";

-- DropTable
DROP TABLE "WhatsAppTemplate";

-- DropEnum
DROP TYPE "CampaignStatus";

-- DropEnum
DROP TYPE "MessageDirection";

-- DropEnum
DROP TYPE "Platform";
