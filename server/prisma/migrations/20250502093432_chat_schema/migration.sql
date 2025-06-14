/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `parentMessageId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderRole` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Meeting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuickReply` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_managerId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_parentMessageId_fkey";

-- DropForeignKey
ALTER TABLE "QuickReply" DROP CONSTRAINT "QuickReply_managerId_fkey";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "createdAt",
DROP COLUMN "metadata",
DROP COLUMN "parentMessageId",
DROP COLUMN "read",
DROP COLUMN "senderRole",
ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "content" SET NOT NULL;

-- DropTable
DROP TABLE "Meeting";

-- DropTable
DROP TABLE "QuickReply";

-- CreateTable
CREATE TABLE "UserStatus" (
    "userId" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserStatus_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("cognitoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("cognitoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
