-- CreateEnum
CREATE TYPE "PendingStatus" AS ENUM ('WAITING_FOR_FOLLOW');

-- CreateTable
CREATE TABLE "PendingAutomation" (
    "id" TEXT NOT NULL,
    "automationId" TEXT NOT NULL,
    "instagramUserId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "status" "PendingStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingAutomation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingAutomation_automationId_instagramUserId_key" ON "PendingAutomation"("automationId", "instagramUserId");
