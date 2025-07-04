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
  onMessage: (callback: (messageData: any) => void) => () => void;
  onChatUpdate: (callback: (updateData: { chatId: number; unreadCount: number }) => void) => () => void;
  joinChatRoom: (roomId: string) => Promise<void>;
  leaveChatRoom: (roomId: string) => void;
}

export const useChatSocket = (): ChatSocketService => {
  const { data: authUser } = useGetAuthUserQuery();
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const chatRoomsRef = useRef<Set<string>>(new Set());
  const connectionPromiseRef = useRef<Promise<void> | null>(null);
  const eventListenersRef = useRef<Map<string, (...args: any[]) => void>>(new Map());

  const getIsConnected = useCallback(() => isConnected, [isConnected]);

  const setupSocketListeners = useCallback((socket: Socket<ServerToClientEvents, ClientToServerEvents>) => {
    // Clear any existing listeners
    eventListenersRef.current.forEach((listener, event) => {
      socket.off(event, listener);
    });
    eventListenersRef.current.clear();

    const handleConnect = () => {
      // console.log('Socket connected');
      const token = localStorage.getItem('idToken');
      if (token) {
        // console.log('Authenticating socket...');
        socket.emit('authenticate', token);
      }
    };

    const handleAuthenticated = () => {
      // console.log('Socket authenticated successfully');
      setIsConnected(true);
      // Rejoin any existing chat rooms
      chatRoomsRef.current.forEach(room => {
        socket.emit('join_room', { room });
      });
    };

    const handleConnectError = (error: Error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
      toast.error('Failed to connect to chat server');
    };

    const handleDisconnect = (reason: string) => {
      // console.log('Socket disconnected:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        // Reconnect after a short delay
        setTimeout(() => {
          socket.connect();
        }, 1000);
      }
    };

    // Add event listeners
    socket.on('connect', handleConnect);
    socket.on('authenticated', handleAuthenticated);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);

    // Store references for cleanup
    eventListenersRef.current.set('connect', handleConnect);
    eventListenersRef.current.set('authenticated', handleAuthenticated);
    eventListenersRef.current.set('connect_error', handleConnectError);
    eventListenersRef.current.set('disconnect', handleDisconnect);
  }, []);

  const connect = useCallback(async (forceReconnect = false): Promise<void> => {
    if (!authUser?.cognitoInfo?.userId || !process.env.NEXT_PUBLIC_API_BASE_URL) {
      console.error('Missing required user info or API URL');
      return;
    }

    // If already connecting/connected and not forcing reconnect
    if (connectionPromiseRef.current && !forceReconnect) {
      return connectionPromiseRef.current;
    }

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    connectionPromiseRef.current = new Promise<void>(async (resolve, reject) => {
      try {
        // Get fresh token
        const session = await fetchAuthSession();
        const { idToken } = session.tokens ?? {};

        if (!idToken) {
          throw new Error('No authentication token available');
        }

        // Store token for reconnection
        localStorage.setItem('idToken', idToken);

        // Create new socket connection
        const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          transports: ['websocket'],
          auth: { token: idToken },
          autoConnect: true
        });

        socketRef.current = socket;
        setupSocketListeners(socket);

        // Wait for connection and authentication
        await new Promise<void>((resolveAuth, rejectAuth) => {
          const timeout = setTimeout(() => {
            rejectAuth(new Error('Socket authentication timeout'));
          }, 10000);

          const onAuthSuccess = () => {
            clearTimeout(timeout);
            socket.off('authenticated', onAuthSuccess);
            socket.off('connect_error', onAuthError);
            resolveAuth();
          };

          const onAuthError = (err: Error) => {
            clearTimeout(timeout);
            socket.off('authenticated', onAuthSuccess);
            socket.off('connect_error', onAuthError);
            rejectAuth(err);
          };

          if (socket.connected) {
            // Already connected, check if authenticated
            if (isConnected) {
              resolveAuth();
            } else {
              socket.once('authenticated', onAuthSuccess);
              socket.once('connect_error', onAuthError);
            }
          } else {
            // Wait for connection and authentication
            socket.once('connect', () => {
              socket.once('authenticated', onAuthSuccess);
              socket.once('connect_error', onAuthError);
            });
          }
        });

        resolve();
      } catch (error) {
        console.error('Socket connection error:', error);
        setIsConnected(false);
        reject(error);
      } finally {
        connectionPromiseRef.current = null;
      }
    });

    return connectionPromiseRef.current;
  }, [authUser, isConnected, setupSocketListeners]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      // Clean up all event listeners
      eventListenersRef.current.forEach((listener, event) => {
        socketRef.current?.off(event, listener);
      });
      eventListenersRef.current.clear();

      // Disconnect the socket
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    connectionPromiseRef.current = null;
  }, []);

  const joinChatRoom = useCallback(async (roomId: string) => {
    if (!socketRef.current) {
      await connect();
      if (!socketRef.current) {
        throw new Error('Failed to connect to socket server');
      }
    }

    if (!chatRoomsRef.current.has(roomId)) {
      chatRoomsRef.current.add(roomId);
      socketRef.current.emit('join_room', { room: roomId });
      // console.log(`Joined chat room: ${roomId}`);
    }
  }, [connect]);

  const leaveChatRoom = useCallback((roomId: string) => {
    if (socketRef.current && chatRoomsRef.current.has(roomId)) {
      socketRef.current.emit('leave_room', { room: roomId });
      chatRoomsRef.current.delete(roomId);
      // console.log(`Left chat room: ${roomId}`);
    }
  }, []);

  const sendMessage = useCallback(async (chatId: number, content: string): Promise<void> => {
    if (!socketRef.current || !isConnected) {
      throw new Error('Socket not connected');
    }

    if (!authUser?.cognitoInfo?.userId) {
      throw new Error('User not authenticated');
    }

    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        reject(new Error('Socket not connected'));
        return;
      }

      const messageData = {
        chatId,
        content,
        senderId: authUser.cognitoInfo.userId,
        timestamp: new Date().toISOString()
      };

      const timeout = setTimeout(() => {
        reject(new Error('Message send timeout'));
      }, 5000);

      const cleanup = () => {
        clearTimeout(timeout);
        socketRef.current?.off('message_ack', ackHandler);
      };

      const ackHandler = (data: { success: boolean; error?: string; messageId: string }) => {
        cleanup();
        if (data.success) {
          // console.log('Message sent successfully:', data.messageId);
          resolve();
        } else {
          reject(new Error(data.error || 'Failed to send message'));
        }
      };

      socketRef.current.once('message_ack', ackHandler);
      socketRef.current.emit('send_message', messageData);
    });
  }, [authUser, isConnected]);

  const onMessage = useCallback((callback: (data: any) => void) => {
    const handler = (data: any) => {
      // console.log('New message received:', data);
      callback(data);
    };

    if (socketRef.current) {
      socketRef.current.on('new_message', handler);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('new_message', handler);
      }
    };
  }, []);

  const onChatUpdate = useCallback((callback: (update: { chatId: number; unreadCount: number }) => void) => {
    const handler = (update: { chatId: number; unreadCount: number }) => {
      // console.log('Chat updated:', update);
      callback(update);
    };

    if (socketRef.current) {
      socketRef.current.on('chat_updated', handler);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('chat_updated', handler);
      }
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
    joinChatRoom,
    leaveChatRoom
  };
};
