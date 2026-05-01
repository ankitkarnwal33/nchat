-- CreateTable
CREATE TABLE "Plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accounts" INTEGER NOT NULL,
    "automations" INTEGER NOT NULL,
    "actionsPerMonth" INTEGER NOT NULL,
    "followRequired" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plans_name_key" ON "Plans"("name");
