import { useState, useCallback, useMemo } from 'react';
import { Chat, Message } from '@/types/chat';

export const useChatList = ({
  initialChats = [],
  currentUserId,
  onChatSelect,
}: {
  initialChats?: Chat[];
  currentUserId: string;
  onChatSelect?: (chatId: string | number) => void;
}) => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    
    const query = searchQuery.toLowerCase();
    return chats.filter(chat => {
      const participantName = chat.participant?.name?.toLowerCase() || '';
      const propertyName = chat.property?.name?.toLowerCase() || '';
      const lastMessage = chat.latestMessage?.content?.toLowerCase() || '';
      
      return (
        participantName.includes(query) ||
        propertyName.includes(query) ||
        lastMessage.includes(query)
      );
    });
  }, [chats, searchQuery]);

  // Get unread count for a chat
  const getUnreadCount = useCallback((chat: Chat) => {
    if (chat.unreadCount !== undefined) return chat.unreadCount;
    
    return chat.messages?.filter(
      msg => msg.senderId !== currentUserId && !msg.isRead
    ).length || 0;
  }, [currentUserId]);

  // Format message date
  const formatMessageDate = useCallback((timestamp: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return new Intl.DateTimeFormat('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }).format(date);
    } else if (date.getFullYear() === now.getFullYear()) {
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    } else {
      return new Intl.DateTimeFormat('en-US', { 
        month: 'numeric', 
        day: 'numeric', 
        year: '2-digit' 
      }).format(date);
    }
  }, []);

  // Get last message preview
  const getLastMessagePreview = useCallback((chat: Chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return 'No messages yet';
    }

    const lastMessage = chat.latestMessage || chat.messages[chat.messages.length - 1];
    const content = lastMessage.content.length > 30
      ? `${lastMessage.content.substring(0, 30)}...`
      : lastMessage.content;

    return `${lastMessage.senderId === currentUserId ? 'You: ' : ''}${content}`;
  }, [currentUserId]);

  // Update a specific chat
  const updateChat = useCallback((updatedChat: Chat) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === updatedChat.id ? { ...chat, ...updatedChat } : chat
      )
    );
  }, []);

  // Add or update a chat
  const upsertChat = useCallback((newChat: Chat) => {
    setChats(prevChats => {
      const existingChatIndex = prevChats.findIndex(c => c.id === newChat.id);
      
      if (existingChatIndex >= 0) {
        const updatedChats = [...prevChats];
        updatedChats[existingChatIndex] = {
          ...updatedChats[existingChatIndex],
          ...newChat,
          messages: [
            ...(updatedChats[existingChatIndex].messages || []),
            ...(newChat.messages || [])
          ],
        };
        return updatedChats;
      }
      
      return [newChat, ...prevChats];
    });
  }, []);

  // Mark messages as read
  const markAsRead = useCallback((chatId: string | number) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              unreadCount: 0,
              messages: chat.messages?.map(msg => 
                msg.senderId !== currentUserId ? { ...msg, isRead: true } : msg
              )
            } 
          : chat
      )
    );
  }, [currentUserId]);

  return {
    chats,
    filteredChats,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    getUnreadCount,
    formatMessageDate,
    getLastMessagePreview,
    updateChat,
    upsertChat,
    markAsRead,
    setChats,
    setIsLoading,
    setError,
  };
};
