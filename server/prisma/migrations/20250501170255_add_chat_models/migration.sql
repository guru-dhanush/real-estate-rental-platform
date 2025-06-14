-- AlterTable
ALTER TABLE "Manager" ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "profilePhoto" TEXT,
ADD COLUMN     "trustScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verifiedId" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "profilePhoto" TEXT,
ADD COLUMN     "trustScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verifiedId" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "tenantId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "senderRole" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,
    "parentMessageId" INTEGER,
    "metadata" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "proposedTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuickReply" (
    "id" SERIAL NOT NULL,
    "managerId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuickReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_propertyId_tenantId_managerId_key" ON "Chat"("propertyId", "tenantId", "managerId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("cognitoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("cognitoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickReply" ADD CONSTRAINT "QuickReply_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("cognitoId") ON DELETE RESTRICT ON UPDATE CASCADE;
