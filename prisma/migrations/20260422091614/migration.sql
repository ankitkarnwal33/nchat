-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('INSTAGRAM', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "phone" TEXT,
    "profilePicture" TEXT,
    "importSource" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "instagramAccountId" TEXT,
    "whatsappAccountId" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "lastMessageAt" TIMESTAMP(3),
    "lastMessagePreview" TEXT,
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "instagramAccountId" TEXT,
    "whatsappAccountId" TEXT,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "externalMessageId" TEXT,
    "direction" "MessageDirection" NOT NULL,
    "content" TEXT,
    "mediaUrl" TEXT,
    "templateId" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "wabaId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsAppAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppTemplate" (
    "id" TEXT NOT NULL,
    "whatsappAccountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "components" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsAppTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "whatsappAccountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "templateId" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignContact" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "CampaignContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contact_instagramAccountId_idx" ON "Contact"("instagramAccountId");

-- CreateIndex
CREATE INDEX "Contact_whatsappAccountId_idx" ON "Contact"("whatsappAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_externalId_instagramAccountId_key" ON "Contact"("externalId", "instagramAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_externalId_whatsappAccountId_key" ON "Contact"("externalId", "whatsappAccountId");

-- CreateIndex
CREATE INDEX "Conversation_instagramAccountId_lastMessageAt_idx" ON "Conversation"("instagramAccountId", "lastMessageAt" DESC);

-- CreateIndex
CREATE INDEX "Conversation_whatsappAccountId_lastMessageAt_idx" ON "Conversation"("whatsappAccountId", "lastMessageAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_contactId_instagramAccountId_key" ON "Conversation"("contactId", "instagramAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_contactId_whatsappAccountId_key" ON "Conversation"("contactId", "whatsappAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_externalMessageId_key" ON "Message"("externalMessageId");

-- CreateIndex
CREATE INDEX "Message_conversationId_sentAt_idx" ON "Message"("conversationId", "sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppAccount_phoneNumberId_key" ON "WhatsAppAccount"("phoneNumberId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignContact_campaignId_contactId_key" ON "CampaignContact"("campaignId", "contactId");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_instagramAccountId_fkey" FOREIGN KEY ("instagramAccountId") REFERENCES "InstagramAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_whatsappAccountId_fkey" FOREIGN KEY ("whatsappAccountId") REFERENCES "WhatsAppAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_instagramAccountId_fkey" FOREIGN KEY ("instagramAccountId") REFERENCES "InstagramAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_whatsappAccountId_fkey" FOREIGN KEY ("whatsappAccountId") REFERENCES "WhatsAppAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppAccount" ADD CONSTRAINT "WhatsAppAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppTemplate" ADD CONSTRAINT "WhatsAppTemplate_whatsappAccountId_fkey" FOREIGN KEY ("whatsappAccountId") REFERENCES "WhatsAppAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_whatsappAccountId_fkey" FOREIGN KEY ("whatsappAccountId") REFERENCES "WhatsAppAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignContact" ADD CONSTRAINT "CampaignContact_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignContact" ADD CONSTRAINT "CampaignContact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
