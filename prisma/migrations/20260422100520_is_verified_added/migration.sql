-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "meta" JSONB;
