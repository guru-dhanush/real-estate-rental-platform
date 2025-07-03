export interface ServerToClientEvents {
  'connect': () => void;
  'disconnect': (reason: string) => void;
  'connect_error': (error: Error) => void;
  'reconnect': () => void;
  'reconnect_error': (error: Error) => void;
  'reconnect_failed': () => void;
  'new_message': (data: {
    message: {
      id: number;
      content: string;
      senderId: string;
      timestamp: string;
      isRead: boolean;
    };
    chatId: number;
    senderId: string;
    senderType: 'tenant' | 'manager';
    propertyId: number;
    propertyTitle: string;
  }) => void;
  'chat_updated': (data: {
    chatId: number;
    unreadCount: number;
  }) => void;
  'message_ack': (data: {
    success: boolean;
    messageId: number;
    error?: string;
  }) => void;
  'authenticated': () => void;
}

export interface ClientToServerEvents {
  'authenticate': (token: string) => void;
  'send_message': (data: {
    chatId: number;
    content: string;
    senderId: string;
  }) => void;
  'mark_as_read': (data: {
    messageId: number;
  }) => void;
}
