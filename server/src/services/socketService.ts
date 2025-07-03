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
  private userRooms: Map<string, Set<string>> = new Map(); // Map of userId to their room IDs

  private addToUserRooms(userId: string, room: string) {
    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, new Set());
    }
    this.userRooms.get(userId)?.add(room);
  }

  private handleLeaveRoom(socket: any, room: string) {
    socket.leave(room);
    console.log(`🚪 Socket ${socket.id} left room: ${room}`);
    console.log(`   Room ${room} now has ${this.io.sockets.adapter.rooms.get(room)?.size || 0} members`);
  }

  private handleJoinRoom(socket: any, room: string) {
    socket.join(room);
    console.log(`🚪 Socket ${socket.id} joined room: ${room}`);
    console.log(`   Room ${room} now has ${this.io.sockets.adapter.rooms.get(room)?.size || 0} members`);
  }

  private async handleMessage(socket: any, data: any, callback: (response: any) => void) {
    console.log('💬 New message received:', { socketId: socket.id, data });

    try {
      const { chatId, content, senderId } = data;

      // Validate required fields
      if (!chatId || !content || !senderId) {
        console.error('Missing required message fields');
        return callback({ success: false, error: 'Missing required fields' });
      }

      // Verify the sender is the authenticated user
      const user = (socket as any).user;
      if (!user || user.id !== senderId) {
        console.error('Unauthorized message attempt');
        return callback({ success: false, error: 'Unauthorized' });
      }

      // Save message to database (pseudo-code)
      // const message = await prisma.message.create({
      //   data: {
      //     chatId,
      //     content,
      //     senderId,
      //     timestamp: new Date()
      //   }
      // });

      // Broadcast to room
      socket.to(`chat:${chatId}`).emit('new_message', {
        chatId,
        message: {
          ...data,
          id: 'temp-' + Date.now(), // Use a temporary ID until saved to DB
          timestamp: new Date().toISOString()
        }
      });

      // Send acknowledgment
      callback({ success: true, messageId: 'temp-' + Date.now() });

      // Broadcast chat update to all participants
      this.io.emit('chat_updated', {
        chatId,
        lastMessage: content,
        lastMessageAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error handling message:', error);
      callback({
        success: false,
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  constructor(server: HttpServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || '*',
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["authorization", "content-type"]
      },
      path: "/socket.io/",
      pingTimeout: 60000, // 60 seconds
      pingInterval: 25000, // 25 seconds
      cookie: false
    });

    this.io.use((socket, next) => {
      // Middleware for authentication
      console.log('🔍 New connection attempt:', {
        auth: socket.handshake.auth,
        query: socket.handshake.query,
        headers: socket.handshake.headers
      });

      // Try to get token from different possible locations
      let token = socket.handshake.auth?.token || 
                 socket.handshake.query?.token ||
                 (socket.handshake.headers.authorization?.startsWith('Bearer ') 
                  ? socket.handshake.headers.authorization.split(' ')[1] 
                  : socket.handshake.headers.authorization);

      // If token is in auth object as a string, use it directly
      if (!token && socket.handshake.auth && typeof socket.handshake.auth === 'object') {
        token = socket.handshake.auth.token;
      }

      if (!token) {
        console.log('❌ No token provided');
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        console.log('🔑 Token received:', {
          type: typeof token,
          length: typeof token === 'string' ? token.length : 'N/A'
        });

        let decoded: any;
        
        // Handle different token formats
        if (typeof token === 'string') {
          // Try to decode as JWT
          decoded = jwt.decode(token);
          
          if (!decoded && token.startsWith('{')) {
            // Try to parse as JSON if it looks like a stringified object
            try {
              const tokenObj = JSON.parse(token);
              if (tokenObj.payload) {
                decoded = tokenObj.payload;
              }
            } catch (e) {
              console.log('❌ Failed to parse token as JSON:', e);
            }
          }
        } else if (typeof token === 'object' && token !== null) {
          // If token is already an object with payload
          if ('payload' in token) {
            decoded = (token as any).payload;
          } else {
            // Use the object directly if it has required fields
            decoded = token;
          }
        }

        if (!decoded || !decoded.sub) {
          console.log('❌ Invalid token format:', { decoded, token });
          return next(new Error('Authentication error: Invalid token format'));
        }

        console.log('✅ Decoded token:', {
          sub: decoded.sub,
          role: decoded['custom:role'],
          email: decoded.email
        });

        // Attach user info to socket for later use
        (socket as any).user = {
          id: decoded.sub,
          type: (decoded['custom:role'] || '').toLowerCase()
        };

        next();
      } catch (error) {
        console.error('❌ Token verification failed:', error);
        return next(new Error('Authentication error: Invalid token'));
      }
    });

    this.initializeSocketEvents();
  }

  private initializeSocketEvents() {
    this.io.on("connection", async (socket) => {
      // Set up heartbeat
      socket.conn.on("ping", () => {
        console.log(`❤️ Heartbeat from ${socket.id}`);
      });

      // Log connection details
      console.log(`🔌 New connection: ${socket.id}`, {
        handshake: socket.handshake,
        connected: socket.connected,
        rooms: Array.from(socket.rooms)
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        console.log(`🔌 Disconnected: ${socket.id} (${reason})`);
        // Clean up user rooms
        if ((socket as any).user?.id) {
          const userId = (socket as any).user.id;
          this.connectedUsers.delete(socket.id);
          console.log(`Removed user ${userId} from connected users`);
        }
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`Socket error from ${socket.id}:`, error);
      });

      // Handle authentication
      socket.on('authenticate', (token: string, callback) => {
        try {
          const decoded: any = jwt.decode(token);
          if (!decoded || !decoded.sub) {
            console.error('Invalid token format', decoded, token);
            return callback?.({
              success: false,
              error: 'Invalid token format'
            });
          }

          const userId = decoded.sub;
          const userType = decoded["custom:role"]?.toLowerCase() || "";

          if (userType !== "tenant" && userType !== "manager") {
            console.error('Invalid user type:', userType);
            return callback?.({
              success: false,
              error: 'Invalid user type'
            });
          }

          // Store user info
          const userSocket = {
            userId,
            userType,
            socketId: socket.id
          };

          this.connectedUsers.set(socket.id, userSocket);
          console.log(`✅ Authenticated user ${userId} (${userType}) on socket ${socket.id}`);

          // Join user to their personal room
          socket.join(`user:${userId}`);

          // Get user's chat rooms and join them
          this.getUserChatRooms(userId, userType).then(chatRooms => {
            chatRooms.forEach(chatId => {
              const roomId = `chat:${chatId}`;
              this.handleJoinRoom(socket, roomId);
              this.addToUserRooms(userId, roomId);
            });

            // Send success response
            callback?.({
              success: true,
              userId,
              userType,
              chatRooms
            });
          });

        } catch (error) {
          console.error('Authentication error:', error);
          callback?.({
            success: false,
            error: 'Authentication failed',
            details: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });

      // Handle room joining
      socket.on('join_room', ({ room }, callback) => {
        if (!room) {
          return callback?.({ success: false, error: 'Room ID is required' });
        }

        try {
          this.handleJoinRoom(socket, room);
          callback?.({ success: true, room });
        } catch (error) {
          console.error(`Error joining room ${room}:`, error);
          callback?.({
            success: false,
            error: 'Failed to join room',
            details: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });

      // Handle room leaving
      socket.on('leave_room', ({ room }, callback) => {
        if (!room) {
          return callback?.({ success: false, error: 'Room ID is required' });
        }

        try {
          this.handleLeaveRoom(socket, room);
          callback?.({ success: true, room });
        } catch (error) {
          console.error(`Error leaving room ${room}:`, error);
          callback?.({
            success: false,
            error: 'Failed to leave room',
            details: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });

      // Handle message sending
      socket.on('send_message', (data: any, callback: (response: any) => void) => {
        console.log('📩 Received message:', data);
        this.handleMessage(socket, data, (response) => {
          console.log('Sending message ack:', response);
          if (typeof callback === 'function') {
            callback(response);
          }

          // Also emit a message_ack event for the client
          socket.emit('message_ack', {
            messageId: data.tempId || 'unknown',
            ...response
          });
        });
      });

      // Send initial connection success
      socket.emit('connected', {
        success: true,
        socketId: socket.id,
        timestamp: new Date().toISOString()
      });
      console.log(`🔌 New socket connection: ${socket.id}`, {
        handshake: socket.handshake,
        connected: socket.connected,
        disconnected: socket.disconnected
      });

      // Log all socket events for debugging
      const eventsToLog = ['connect', 'disconnect', 'error', 'authenticate', 'join_room', 'leave_room', 'send_message', 'message_ack'];
      eventsToLog.forEach(event => {
        socket.on(event, (data) => {
          console.log(`📡 [${event}] from ${socket.id}:`, data || 'No data');
        });
      });

      // Handle authentication
      socket.on("authenticate", async (token: string) => {
        console.log(`🔑 Authentication attempt from ${socket.id}`);
        try {
          const decoded: any = jwt.decode(token);
          if (!decoded || !decoded.sub) {
            socket.disconnect();
            return;
          }

          const userId = decoded.sub;
          console.log(`✅ Authenticated user ${userId} on socket ${socket.id}`);
          const userType = decoded["custom:role"]?.toLowerCase() || "";

          if (userType !== "tenant" && userType !== "manager") {
            socket.disconnect();
            return;
          }

          // Get user's chat rooms
          const chatRooms = await this.getUserChatRooms(userId, userType);

          // Join all chat rooms
          chatRooms.forEach((chatId) => {
            this.handleJoinRoom(socket, `chat:${chatId}`);
            this.addToUserRooms(userId, `chat:${chatId}`);
          });

          // Store user info
          const userSocket: UserSocket = {
            userId,
            userType,
            socketId: socket.id,
          };
          this.connectedUsers.set(userId, userSocket);

          // Update user status
          await prisma.userStatus.upsert({
            where: { userId },
            update: { isOnline: true, lastSeen: new Date() },
            create: { userId, isOnline: true, lastSeen: new Date() },
          });

          // Broadcast user status change
          this.broadcastUserStatus(userId, true);
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
          senderId: string;
        }, callback: (response: any) => void) => {
          this.handleMessage(socket, data, (response) => {
            if (typeof callback === 'function') {
              callback(response);
            }
          });
          try {
            const userSocket = this.connectedUsers.get(data.senderId);
            if (!userSocket) {
              return;
            }

            // Create message in database
            const message = await prisma.message.create({
              data: {
                content: data.content,
                senderId: data.senderId,
                chatId: data.chatId,
                isRead: false,
              },
              include: {
                chat: {
                  select: {
                    tenantId: true,
                    managerId: true,
                    propertyId: true,
                    property: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            });

            // Send acknowledgment to sender
            socket.emit("message_ack", {
              success: true,
              messageId: message.id,
            });

            // Notify recipient
            const recipientId =
              message.chat.tenantId === data.senderId
                ? message.chat.managerId
                : message.chat.tenantId;

            // Ensure both users are in the chat room
            if (socket.rooms.has(`chat:${data.chatId}`)) {
              // Broadcast to both users in the chat
              this.io.to(`chat:${data.chatId}`).emit("new_message", {
                message,
                chatId: data.chatId,
                senderId: data.senderId,
                senderType: userSocket.userType,
                propertyId: message.chat.propertyId,
                propertyTitle: message.chat.property.name,
                content:
                  message.content.substring(0, 50) +
                  (message.content.length > 50 ? "..." : ""),
              });

              // Update chat unread count
              await prisma.message.update({
                where: { id: message.id },
                data: {
                  isRead: false,
                },
              });

              // Notify about chat update
              this.io.to(`chat:${data.chatId}`).emit("chat_updated", {
                chatId: data.chatId,
                unreadCount: 1,
              });
            }
          } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("message_ack", {
              success: false,
              error: "Failed to send message",
            });
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
