import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface UserSocket {
  userId: string;
  userType: "tenant" | "manager";
  socketId: string;
}

export class SocketService {
  private io: SocketServer;
  private connectedUsers: Map<string, UserSocket> = new Map();

  constructor(server: HttpServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: "*", // Configure according to your frontend
        methods: ["GET", "POST"],
      },
    });

    this.initializeSocketEvents();
  }

  private initializeSocketEvents() {
    this.io.on("connection", async (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Authenticate user on connection
      socket.on("authenticate", async (token: string) => {
        try {
          const decoded: any = jwt.decode(token);
          if (!decoded || !decoded.sub) {
            socket.disconnect();
            return;
          }

          const userId = decoded.sub;
          const userType = decoded["custom:role"]?.toLowerCase() || "";

          if (userType !== "tenant" && userType !== "manager") {
            socket.disconnect();
            return;
          }

          // Store user connection
          this.connectedUsers.set(userId, {
            userId,
            userType,
            socketId: socket.id,
          });

          // Update user status in database
          await prisma.userStatus.upsert({
            where: { userId },
            create: {
              userId,
              isOnline: true,
              lastSeen: new Date(),
            },
            update: {
              isOnline: true,
              lastSeen: new Date(),
            },
          });

          // Join user to their own room (for direct messages)
          socket.join(userId);

          // Join property chat rooms
          const chatRooms = await this.getUserChatRooms(userId, userType);
          chatRooms.forEach((roomId) => {
            socket.join(`chat:${roomId}`);
          });

          // Broadcast user online status to relevant users
          this.broadcastUserStatus(userId, true);

          console.log(`User authenticated: ${userId} (${userType})`);
        } catch (error) {
          console.error("Authentication error:", error);
          socket.disconnect();
        }
      });

      // Handle new messages
      socket.on(
        "send_message",
        async (data: {
          chatId: number;
          content: string;
          attachments?: string[];
        }) => {
          try {
            const userSocket = Array.from(this.connectedUsers.values()).find(
              (u) => u.socketId === socket.id
            );

            if (!userSocket) {
              return;
            }

            const { chatId, content, attachments = [] } = data;

            // Verify the chat exists and user is part of it
            const chat = await prisma.chat.findUnique({
              where: { id: chatId },
              include: { property: true },
            });

            if (!chat || chat.isDeleted) {
              return;
            }

            if (
              userSocket.userType === "tenant" &&
              chat.tenantId !== userSocket.userId
            ) {
              return;
            }

            if (
              userSocket.userType === "manager" &&
              chat.managerId !== userSocket.userId
            ) {
              return;
            }

            // Create message in database
            const message = await prisma.message.create({
              data: {
                chatId,
                senderId: userSocket.userId,
                content,
                attachments,
                isRead: false,
              },
              include: {
                chat: true,
              },
            });

            // Emit to chat room
            this.io.to(`chat:${chatId}`).emit("new_message", {
              ...message,
              propertyTitle: chat.property.name,
              propertyPrice: chat.property.pricePerMonth,
            });

            // Send notification to recipient
            const recipientId =
              userSocket.userType === "tenant" ? chat.managerId : chat.tenantId;
            this.io.to(recipientId).emit("message_notification", {
              chatId,
              messageId: message.id,
              senderId: userSocket.userId,
              senderType: userSocket.userType,
              propertyId: chat.propertyId,
              propertyTitle: chat.property.name,
              content:
                content.substring(0, 50) + (content.length > 50 ? "..." : ""),
            });
          } catch (error) {
            console.error("Error sending message:", error);
          }
        }
      );

      // Handle message read status
      socket.on("mark_as_read", async (data: { messageId: number }) => {
        try {
          const userSocket = Array.from(this.connectedUsers.values()).find(
            (u) => u.socketId === socket.id
          );

          if (!userSocket) {
            return;
          }

          const { messageId } = data;

          // Get message and related chat
          const message = await prisma.message.findUnique({
            where: { id: messageId },
            include: { chat: true },
          });

          if (!message || message.isRead) {
            return;
          }

          // Verify user is part of the chat and is not the sender
          if (
            (userSocket.userType === "tenant" &&
              message.chat.tenantId !== userSocket.userId) ||
            (userSocket.userType === "manager" &&
              message.chat.managerId !== userSocket.userId) ||
            message.senderId === userSocket.userId
          ) {
            return;
          }

          // Update message as read
          await prisma.message.update({
            where: { id: messageId },
            data: {
              isRead: true,
              readAt: new Date(),
            },
          });

          // Notify sender that message was read
          this.io.to(message.senderId).emit("message_read", {
            messageId,
            chatId: message.chatId,
            readBy: userSocket.userId,
            readAt: new Date(),
          });
        } catch (error) {
          console.error("Error marking message as read:", error);
        }
      });

      // Handle typing indicator
      socket.on(
        "typing",
        async (data: { chatId: number; isTyping: boolean }) => {
          try {
            const userSocket = Array.from(this.connectedUsers.values()).find(
              (u) => u.socketId === socket.id
            );

            if (!userSocket) {
              return;
            }

            const { chatId, isTyping } = data;

            // Verify the chat exists and user is part of it
            const chat = await prisma.chat.findUnique({
              where: { id: chatId },
            });

            if (!chat || chat.isDeleted) {
              return;
            }

            if (
              (userSocket.userType === "tenant" &&
                chat.tenantId !== userSocket.userId) ||
              (userSocket.userType === "manager" &&
                chat.managerId !== userSocket.userId)
            ) {
              return;
            }

            // Emit typing status to chat room
            socket.to(`chat:${chatId}`).emit("user_typing", {
              chatId,
              userId: userSocket.userId,
              userType: userSocket.userType,
              isTyping,
            });
          } catch (error) {
            console.error("Error with typing indicator:", error);
          }
        }
      );

      // Handle disconnection
      socket.on("disconnect", async () => {
        console.log(`Socket disconnected: ${socket.id}`);

        // Find user by socket ID
        const userSocket = Array.from(this.connectedUsers.values()).find(
          (u) => u.socketId === socket.id
        );

        if (userSocket) {
          const { userId } = userSocket;

          // Remove from connected users map
          this.connectedUsers.delete(userId);

          // Update user status in database
          await prisma.userStatus.update({
            where: { userId },
            data: {
              isOnline: false,
              lastSeen: new Date(),
            },
          });

          // Broadcast user offline status to relevant users
          this.broadcastUserStatus(userId, false);
        }
      });
    });
  }

  private async getUserChatRooms(
    userId: string,
    userType: string
  ): Promise<number[]> {
    try {
      const whereClause =
        userType === "tenant"
          ? { tenantId: userId, isDeleted: false }
          : { managerId: userId, isDeleted: false };

      const chats = await prisma.chat.findMany({
        where: whereClause,
        select: { id: true },
      });

      return chats.map((chat: any) => chat.id);
    } catch (error) {
      console.error("Error getting user chat rooms:", error);
      return [];
    }
  }

  private async broadcastUserStatus(userId: string, isOnline: boolean) {
    try {
      // Get all chats where user is involved
      const chats = await prisma.chat.findMany({
        where: {
          OR: [{ tenantId: userId }, { managerId: userId }],
          isDeleted: false,
        },
        select: {
          id: true,
          tenantId: true,
          managerId: true,
        },
      });

      // Get the status to broadcast
      const status = await prisma.userStatus.findUnique({
        where: { userId },
      });

      if (!status) return;

      // For each chat, notify the other user
      chats.forEach((chat: any) => {
        const otherUserId =
          chat.tenantId === userId ? chat.managerId : chat.tenantId;
        this.io.to(otherUserId).emit("user_status_changed", {
          userId,
          isOnline,
          lastSeen: status.lastSeen,
          chatId: chat.id,
        });
      });
    } catch (error) {
      console.error("Error broadcasting user status:", error);
    }
  }

  // Public method to broadcast property deletion
  public async notifyPropertyDeleted(propertyId: number) {
    try {
      // Find all chats for this property
      const chats = await prisma.chat.findMany({
        where: { propertyId },
      });

      // For each chat, notify users
      chats.forEach((chat: any) => {
        this.io.to(chat.tenantId).emit("property_deleted", {
          propertyId,
          chatId: chat.id,
        });

        this.io.to(chat.managerId).emit("property_deleted", {
          propertyId,
          chatId: chat.id,
        });
      });
    } catch (error) {
      console.error("Error notifying about property deletion:", error);
    }
  }

  // Public method to handle chat deletion
  public async notifyChatDeleted(chatId: number) {
    try {
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
      });

      if (!chat) return;

      // Notify users
      this.io.to(chat.tenantId).emit("chat_deleted", { chatId });
      this.io.to(chat.managerId).emit("chat_deleted", { chatId });

      // Remove users from chat room
      this.io.in(`chat:${chatId}`).socketsLeave(`chat:${chatId}`);
    } catch (error) {
      console.error("Error notifying about chat deletion:", error);
    }
  }

  // Getter for io (to use in controllers)
  public getIO(): SocketServer {
    return this.io;
  }
}

// Create singleton
let socketService: SocketService | null = null;

export const initializeSocketService = (server: HttpServer): SocketService => {
  if (!socketService) {
    socketService = new SocketService(server);
  }
  return socketService;
};

export const getSocketService = (): SocketService | null => {
  return socketService;
};
