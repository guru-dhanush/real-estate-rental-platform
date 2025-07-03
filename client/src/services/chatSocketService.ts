import { io, type Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from './socketEvents';
import { useGetAuthUserQuery } from '@/state/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { toast } from 'react-hot-toast';

interface ChatSocketService {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: () => boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (chatId: number, content: string) => Promise<void>;
  onMessage: (callback: (data: any) => void) => () => void;
  onChatUpdate: (callback: (data: { chatId: number; unreadCount: number }) => void) => () => void;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => void;
}

export const useChatSocket = (): ChatSocketService => {
  const { data: authUser } = useGetAuthUserQuery();
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const chatRoomsRef = useRef<Set<string>>(new Set());
  const eventListenersRef = useRef<Map<string, (...args: any[]) => void>>(new Map());
  const messageHandlers = useRef<Set<(data: any) => void>>(new Set());
  const chatUpdateHandlers = useRef<Set<(data: any) => void>>(new Set());

  const getIsConnected = useCallback(() => isConnected, [isConnected]);

  const setupSocketListeners = useCallback((socket: Socket<ServerToClientEvents, ClientToServerEvents>) => {
    // Clear any existing listeners
    eventListenersRef.current.forEach((listener, event) => {
      socket.off(event as any, listener);
    });
    eventListenersRef.current.clear();

    const handleConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        // Reconnect after a short delay
        setTimeout(() => {
          socket.connect();
        }, 1000);
      }
    };

    const handleConnectError = (error: Error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
      toast.error('Failed to connect to chat server');
    };

    const handleNewMessage = (data: any) => {
      messageHandlers.current.forEach(handler => handler(data));
    };

    const handleChatUpdate = (data: any) => {
      chatUpdateHandlers.current.forEach(handler => handler(data));
    };

    // Add event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('new_message', handleNewMessage);
    socket.on('chat_updated', handleChatUpdate);

    // Store references for cleanup
    eventListenersRef.current.set('connect', handleConnect);
    eventListenersRef.current.set('disconnect', handleDisconnect);
    eventListenersRef.current.set('connect_error', handleConnectError);
    eventListenersRef.current.set('new_message', handleNewMessage);
    eventListenersRef.current.set('chat_updated', handleChatUpdate);
  }, []);

  // Helper function to get authentication token
  const getAuthToken = useCallback(async (): Promise<string> => {
    console.log('🔑 Fetching fresh auth token...');
    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      console.log('🔑 Auth session retrieved');

      // Handle different token formats from AWS Amplify
      let token: string | undefined;

      // Check for JWT token in different possible locations
      if (session.tokens?.idToken?.toString()) {
        token = session.tokens.idToken.toString();
      } else if (session.tokens?.accessToken?.toString()) {
        token = session.tokens.accessToken.toString();
      } else if (session.credentials?.sessionToken) {
        token = session.credentials.sessionToken;
      }

      if (!token) {
        const error = 'No valid authentication token found in session';
        console.error('❌', error, { session });
        throw new Error(error);
      }

      // Log token info (safely)
      const tokenInfo = {
        tokenType: typeof token,
        length: token.length,
        preview: token.length > 10 ? `${token.substring(0, 10)}...` : token
      };
      console.log('✅ Auth token retrieved successfully', tokenInfo);

      return token;
    } catch (error) {
      console.error('❌ Error fetching auth token:', error);
      throw new Error('Authentication error: Failed to fetch token');
    }
  }, []);

  const connect = useCallback(async (): Promise<void> => {
    console.log('🔌 Attempting to connect to socket server...');

    // Validate required info
    if (!authUser?.cognitoInfo?.userId) {
      const error = 'User not authenticated';
      console.error(error);
      throw new Error(error);
    }

    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      const error = 'WebSocket URL not configured';
      console.error(error);
      throw new Error(error);
    }

    // If already connected, resolve immediately
    if (socketRef.current?.connected) {
      console.log('✅ Socket already connected');
      return;
    }

    // Disconnect existing socket if any
    if (socketRef.current) {
      console.log('🔌 Disconnecting existing socket...');
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    try {
      const token = await getAuthToken();

      const WS_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!WS_URL) {
        throw new Error('WebSocket URL not configured');
      }

      console.log('🔌 Connecting to WebSocket URL:', WS_URL);

      // Create socket connection with proper URL formatting
      const normalizedUrl = WS_URL.endsWith('/')
        ? WS_URL.slice(0, -1)
        : WS_URL;

      console.log('🔌 Normalized WebSocket URL:', normalizedUrl);

      // Create socket connection - removed duplicate properties
      const socket = io(normalizedUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        autoConnect: true,
        withCredentials: true,
        auth: {
          token: token,
          userId: authUser?.cognitoInfo?.userId || 'unknown',
          clientType: 'web'
        },
        query: {
          userId: authUser.cognitoInfo.userId,
          token: token
        }
      });

      socketRef.current = socket;

      // Log all socket events for debugging
      // const eventsToLog = ['connect', 'connect_error', 'disconnect', 'error', 'reconnect', 'reconnect_attempt', 'reconnect_error', 'reconnect_failed'];
      // eventsToLog.forEach(event => {
      //   socket.on(event as any, (data) => {
      //     console.log(`📡 [socket:${event}]`, data || 'No data');
      //   });
      // });

      setupSocketListeners(socket);

      // Setup connection status tracking
      console.log('🔄 Setting up socket connection...');

      // Wait for connection or error
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        const onConnect = () => {
          console.log('✅ Socket connected successfully');
          clearTimeout(timeout);
          cleanup();
          resolve();
        };

        const onError = (error: any) => {
          console.error('❌ Socket connection error:', error);
          clearTimeout(timeout);
          cleanup();
          reject(error instanceof Error ? error : new Error('Connection failed'));
        };

        const cleanup = () => {
          socket.off('connect', onConnect);
          socket.off('connect_error', onError);
        };

        // If already connected, resolve immediately
        if (socket.connected) {
          console.log('✅ Socket already connected');
          cleanup();
          resolve();
          return;
        }

        // Set up event listeners
        socket.on('connect', onConnect);
        socket.on('connect_error', onError);

        // Manually connect if not already connected
        if (!socket.connected) {
          console.log('🔄 Manually connecting socket...');
          socket.connect();
        }
      });
    } catch (error) {
      console.error('Failed to connect to socket:', error);
      throw error;
    }
  }, [authUser?.cognitoInfo?.userId, setupSocketListeners, getAuthToken]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      // Clean up all event listeners
      eventListenersRef.current.forEach((listener, event) => {
        socketRef.current?.off(event as any, listener);
      });
      eventListenersRef.current.clear();

      // Disconnect the socket
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const joinRoom = useCallback(async (roomId: string) => {
    console.log(`🚪 Attempting to join room: ${roomId}`);
    if (!socketRef.current) {
      console.log('No active socket, connecting first...');
      try {
        await connect();
      } catch (error) {
        console.error('Failed to connect to socket server:', error);
        throw new Error('Failed to connect to chat server');
      }
    }

    if (!chatRoomsRef.current.has(roomId)) {
      console.log(`Joining room: ${roomId}`);
      chatRoomsRef.current.add(roomId);
      socketRef.current?.emit('join_room' as any, { room: roomId }, (response: any) => {
        console.log(`✅ Joined room ${roomId} successfully`, response);
      });
    } else {
      console.log(`Already in room: ${roomId}`);
    }
  }, [connect]);

  const leaveRoom = useCallback((roomId: string) => {
    if (socketRef.current && chatRoomsRef.current.has(roomId)) {
      socketRef.current.emit('leave_room' as any, { room: roomId });
      chatRoomsRef.current.delete(roomId);
    }
  }, []);

  const sendMessage = useCallback(async (chatId: number, content: string): Promise<void> => {
    console.log('📤 Sending message:', { chatId, content });

    // Ensure we have a valid socket connection
    if (!socketRef.current) {
      console.log('No socket available, connecting...');
      try {
        await connect();
      } catch (error) {
        console.error('Failed to connect socket:', error);
        throw new Error('Failed to connect to chat server');
      }
    }

    const socket = socketRef.current;
    if (!socket) {
      throw new Error('Socket not available');
    }

    if (!authUser?.cognitoInfo?.userId) {
      throw new Error('User not authenticated');
    }

    return new Promise((resolve, reject) => {
      const messageData = {
        chatId,
        content,
        senderId: authUser.cognitoInfo.userId,
        timestamp: new Date().toISOString()
      };

      console.log('📩 Emitting message:', messageData);

      const timeout = setTimeout(() => {
        console.error('Message send timeout');
        socket.off('message_ack' as any, onAck);
        reject(new Error('Message send timeout'));
      }, 10000); // Increased timeout to 10 seconds

      const onAck = (response: any) => {
        console.log('📬 Message ACK received:', response);
        clearTimeout(timeout);
        socket.off('message_ack' as any, onAck);

        if (response?.success) {
          resolve();
        } else {
          const errorMsg = response?.error || 'Message send failed';
          console.error('Message send failed:', errorMsg);
          reject(new Error(errorMsg));
        }
      };

      // Listen for the ack first
      socket.once('message_ack' as any, onAck);

      // Then emit the message - fixed to use only 2 arguments
      socket.emit('send_message', messageData);
    });
  }, [authUser, connect]);

  const onMessage = useCallback((callback: (data: any) => void) => {
    messageHandlers.current.add(callback);
    return () => {
      messageHandlers.current.delete(callback);
    };
  }, []);

  const onChatUpdate = useCallback((callback: (data: { chatId: number; unreadCount: number }) => void) => {
    chatUpdateHandlers.current.add(callback);
    return () => {
      chatUpdateHandlers.current.delete(callback);
    };
  }, []);

  // Auto-connect when component mounts and when auth changes
  useEffect(() => {
    if (authUser?.cognitoInfo?.userId) {
      connect().catch(error => {
        console.error('Failed to connect to chat server:', error);
        toast.error('Failed to connect to chat server');
      });
    }

    return () => {
      disconnect();
    };
  }, [authUser?.cognitoInfo?.userId, connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected: getIsConnected,
    connect,
    disconnect,
    sendMessage,
    onMessage,
    onChatUpdate,
    joinRoom,
    leaveRoom
  };
};