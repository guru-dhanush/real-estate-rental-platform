
export interface Message {
    id: string | number;
    content: string;
    senderId: string;
    timestamp: string;
    isRead: boolean;
    isSending?: boolean;
    isOptimistic?: boolean;
}

export interface ChatParticipant {
    id: string;
    name?: string;
    profilePhoto?: string;
    isOnline?: boolean;
}

export interface Property {
    id: string | number;
    name: string;
    // Add other property fields as needed
}

export interface Chat {
    id: string | number;
    participant: ChatParticipant;
    property?: Property;
    messages: Message[];
    latestMessage?: Message;
    updatedAt: string;
    unreadCount?: number;
    otherUser?: {
        isOnline?: boolean;
    };
}

export type UserRole = 'manager' | 'tenant';

export interface ChatListProps {
    chats: Chat[];
    onSelectChat: (chatId: string | number) => void;
    activeChatId?: string | number | null;
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
    emptyState?: {
        title: string;
        description: string;
        action?: {
            label: string;
            onClick: () => void;
        };
    };
}

export interface ChatWindowProps {
    chat: Chat | null;
    currentUserId: string;
    onSendMessage: (content: string) => Promise<void>;
    onBack?: () => void;
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
}
