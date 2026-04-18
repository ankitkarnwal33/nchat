-- CreateTable
CREATE TABLE "UserInteraction" (
    "id" TEXT NOT NULL,
    "instagramUserId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "lastInteractionAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserInteraction_accountId_idx" ON "UserInteraction"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "UserInteraction_instagramUserId_accountId_key" ON "UserInteraction"("instagramUserId", "accountId");
