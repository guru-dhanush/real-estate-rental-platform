// src/controllers/chatControllers.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getSocketService } from "../services/socketService";

const prisma = new PrismaClient();

// Get all chats for a user (tenant or manager)
export const getUserChats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
       const userId = req?.user?.id;
       const userType = req?.user?.role;


    if (!userId || !userType) {
      res.status(400).json({ message: "User ID and user type are required" });
      return;
    }

    const whereClause =
      userType === "tenant"
        ? { tenantId: String(userId), isDeleted: false }
        : { managerId: String(userId), isDeleted: false };

    const chats = await prisma.chat.findMany({
      where: whereClause,
      include: {
        property: {
          select: {
            id: true,
            name: true,
            pricePerMonth: true,
            photoUrls: true,
            location: {
              select: {
                address: true,
              },
            },
          },
        },
        tenant: {
          select: {
            cognitoId: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        manager: {
          select: {
            cognitoId: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        messages: {
          orderBy: {
            timestamp: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Get unread message count for each chat
    const chatsWithUnreadCount = await Promise.all(
      chats.map(async (chat: any) => {
        const unreadCount = await prisma.message.count({
          where: {
            chatId: chat.id,
            isRead: false,
            senderId: userType === "tenant" ? chat.managerId : chat.tenantId,
          },
        });

        // Get user status
        const otherUserId =
          userType === "tenant" ? chat.managerId : chat.tenantId;
        const userStatus = await prisma.userStatus.findUnique({
          where: { userId: otherUserId },
        });

        return {
          ...chat,
          unreadCount,
          otherUser: {
            id: otherUserId,
            name:
              userType === "tenant" ? chat.manager?.name : chat.tenant?.name,
            isOnline: userStatus?.isOnline || false,
            lastSeen: userStatus?.lastSeen,
          },
          latestMessage: chat.messages[0] || null,
        };
      })
    );

    res.json(chatsWithUnreadCount);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving chats: ${error.message}` });
  }
};

// Get a single chat by ID
export const getChatById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req?.user?.id;
    const userType = req?.user?.role;

    if (!userId) {
      res.status(400).json({ message: "User ID and user type are required" });
      return;
    }

    // Check if chat exists and user is part of it
    const chat = await prisma.chat.findUnique({
      where: { id: Number(id) },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            pricePerMonth: true,
            photoUrls: true,
            location: {
              select: {
                address: true,
              },
            },
          },
        },
        tenant: {
          select: {
            cognitoId: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        manager: {
          select: {
            cognitoId: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    if (chat.isDeleted) {
      res.status(410).json({ message: "This chat has been deleted" });
      return;
    }

    // Check if user is part of this chat
    if (
      (userType === "tenant" && chat.tenantId !== String(userId)) ||
      (userType === "manager" && chat.managerId !== String(userId))
    ) {
      res.status(403).json({ message: "You do not have access to this chat" });
      return;
    }

    // Get messages for this chat
    const messages = await prisma.message.findMany({
      where: { chatId: Number(id) },
      orderBy: { timestamp: "asc" },
    });

    // Get other user status
    const otherUserId = userType === "tenant" ? chat.managerId : chat.tenantId;
    const userStatus = await prisma.userStatus.findUnique({
      where: { userId: otherUserId },
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        chatId: Number(id),
        isRead: false,
        senderId: otherUserId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    // Format response
    const response = {
      ...chat,
      messages,
      otherUser: {
        id: otherUserId,
        name: userType === "tenant",
        isOnline: userStatus?.isOnline || false,
        lastSeen: userStatus?.lastSeen,
      },
    };

    res.json(response);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving chat: ${error.message}` });
  }
};

// Create a new chat
export const createChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { propertyId, tenantId, managerId } = req.body;

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    // Check if tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId: tenantId },
    });

    if (!tenant) {
      res.status(404).json({ message: "Tenant not found" });
      return;
    }

    // Check if manager exists
    const manager = await prisma.manager.findUnique({
      where: { cognitoId: managerId },
    });

    if (!manager) {
      res.status(404).json({ message: "Manager not found" });
      return;
    }

    // Check if a chat already exists between these users for this property
    const existingChat = await prisma.chat.findFirst({
      where: {
        propertyId,
        tenantId,
        managerId,
        isDeleted: false,
      },
    });

    if (existingChat) {
      res.status(201).json({
        message: "A chat already exists for this property between these users",
        id: existingChat.id,
      });
      return;
    }

    // Create new chat
    const newChat = await prisma.chat.create({
      data: {
        propertyId,
        tenantId,
        managerId,
      },
      include: {
        property: true,
        tenant: true,
        manager: true,
      },
    });

    // Get socket service to join users to chat room
    const socketService = getSocketService();
    if (socketService) {
      // Notify users about new chat
      socketService.getIO().to(tenantId).emit("new_chat", {
        chat: newChat,
        initiatedBy: req.user?.id,
      });

      socketService.getIO().to(managerId).emit("new_chat", {
        chat: newChat,
        initiatedBy: req.user?.id,
      });
    }

    res.status(201).json(newChat);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating chat: ${error.message}` });
  }
};

// Mark chat as deleted (soft delete)
export const deleteChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, userType } = req.body;

    // Check if chat exists
    const chat = await prisma.chat.findUnique({
      where: { id: Number(id) },
    });

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    if (chat.isDeleted) {
      res.status(410).json({ message: "This chat has already been deleted" });
      return;
    }

    // Check if user is part of this chat
    if (
      (userType === "tenant" && chat.tenantId !== userId) ||
      (userType === "manager" && chat.managerId !== userId)
    ) {
      res.status(403).json({ message: "You do not have access to this chat" });
      return;
    }

    // Soft delete the chat
    await prisma.chat.update({
      where: { id: Number(id) },
      data: { isDeleted: true },
    });

    // Notify users
    const socketService = getSocketService();
    if (socketService) {
      await socketService.notifyChatDeleted(Number(id));
    }

    res.json({ message: "Chat deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting chat: ${error.message}` });
  }
};

// Send a message
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { senderId, content, attachments } = req.body;

    // Check if chat exists
    const chat = await prisma.chat.findUnique({
      where: { id: Number(chatId) },
      include: { property: true },
    });

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    if (chat.isDeleted) {
      res.status(410).json({ message: "This chat has been deleted" });
      return;
    }

    // Check if user is part of this chat
    if (chat.tenantId !== senderId && chat.managerId !== senderId) {
      res.status(403).json({ message: "You are not part of this chat" });
      return;
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        chatId: Number(chatId),
        senderId,
        content,
        attachments: attachments || [],
      },
    });

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: Number(chatId) },
      data: { updatedAt: new Date() },
    });

    // Emit message to recipients through socket
    const socketService = getSocketService();
    if (socketService) {
      socketService
        .getIO()
        .to(`chat:${chatId}`)
        .emit("new_message", {
          ...message,
          propertyTitle: chat.property.name,
          propertyPrice: chat.property.pricePerMonth,
        });

      // Send notification to recipient
      const recipientId =
        senderId === chat.tenantId ? chat.managerId : chat.tenantId;
      socketService
        .getIO()
        .to(recipientId)
        .emit("message_notification", {
          chatId: Number(chatId),
          messageId: message.id,
          senderId,
          senderType: senderId === chat.tenantId ? "tenant" : "manager",
          propertyId: chat.propertyId,
          propertyTitle: chat.property.name,
          content:
            content.substring(0, 50) + (content.length > 50 ? "..." : ""),
        });
    }

    res.status(201).json(message);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error sending message: ${error.message}` });
  }
};

// Mark a message as read
export const markMessageAsRead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Get message
    const message = await prisma.message.findUnique({
      where: { id: Number(id) },
      include: { chat: true },
    });

    if (!message) {
      res.status(404).json({ message: "Message not found" });
      return;
    }

    // Check if user is recipient of the message
    const isRecipient =
      (message.chat.tenantId === userId &&
        message.senderId === message.chat.managerId) ||
      (message.chat.managerId === userId &&
        message.senderId === message.chat.tenantId);

    if (!isRecipient) {
      res.status(403).json({ message: "You cannot mark this message as read" });
      return;
    }

    // Check if message is already read
    if (message.isRead) {
      res.json({ message: "Message is already marked as read" });
      return;
    }

    // Mark as read
    const updatedMessage = await prisma.message.update({
      where: { id: Number(id) },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    // Notify sender through socket
    const socketService = getSocketService();
    if (socketService) {
      socketService
        .getIO()
        .to(message.senderId)
        .emit("message_read", {
          messageId: Number(id),
          chatId: message.chatId,
          readBy: userId,
          readAt: updatedMessage.readAt,
        });
    }

    res.json(updatedMessage);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error marking message as read: ${error.message}` });
  }
};

// Mark all messages in a chat as read (continued)
export const markAllMessagesAsRead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    // Check if chat exists
    const chat = await prisma.chat.findUnique({
      where: { id: Number(chatId) },
    });

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    if (chat.isDeleted) {
      res.status(410).json({ message: "This chat has been deleted" });
      return;
    }

    // Check if user is part of this chat
    if (chat.tenantId !== userId && chat.managerId !== userId) {
      res.status(403).json({ message: "You are not part of this chat" });
      return;
    }

    // Get sender ID (the other party in the chat)
    const senderId = userId === chat.tenantId ? chat.managerId : chat.tenantId;

    // Mark all unread messages from the other user as read
    const updatedMessages = await prisma.message.updateMany({
      where: {
        chatId: Number(chatId),
        senderId: senderId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    // Get all messages that were just marked as read
    const markedMessages = await prisma.message.findMany({
      where: {
        chatId: Number(chatId),
        senderId: senderId,
        isRead: true,
        readAt: {
          gte: new Date(Date.now() - 5000), // Messages marked as read in the last 5 seconds
        },
      },
    });

    // Notify sender through socket
    const socketService = getSocketService();
    if (socketService) {
      markedMessages.forEach((message: any) => {
        socketService
          .getIO()
          .to(senderId)
          .emit("message_read", {
            messageId: message.id,
            chatId: Number(chatId),
            readBy: userId,
            readAt: message.readAt,
          });
      });
    }

    res.json({
      message: "All messages marked as read",
      count: updatedMessages.count,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error marking messages as read: ${error.message}` });
  }
};
