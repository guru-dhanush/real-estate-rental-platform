import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Chat } from '@/types/chat';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';

export interface ChatListProps {
  chats: Chat[];
  currentUserId: string;
  activeChatId?: string | number | null;
  onChatSelect?: (chatId: string | number) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyState?: {
    title: string;
    description: string;
    action?: {
      label: string;
      href: string;
    };
  };
  className?: string;
  itemClassName?: string;
  searchPlaceholder?: string;
}

export const ChatList = ({
  chats,
  currentUserId,
  activeChatId,
  onChatSelect,
  isLoading = false,
  isError = false,
  onRetry,
  emptyState,
  className = '',
  itemClassName = '',
  searchPlaceholder = 'Search conversations...',
}: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

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

  const getUnreadCount = (chat: Chat) => {
    if (chat.unreadCount !== undefined) return chat.unreadCount;
    
    return chat.messages?.filter(
      msg => msg.senderId !== currentUserId && !msg.isRead
    ).length || 0;
  };

  const formatMessageDate = (timestamp: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return format(date, 'h:mm a');
    } else if (date.getFullYear() === now.getFullYear()) {
      return format(date, 'MMM d');
    } else {
      return format(date, 'MM/dd/yy');
    }
  };

  const getLastMessagePreview = (chat: Chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return 'No messages yet';
    }

    const lastMessage = chat.latestMessage || chat.messages[chat.messages.length - 1];
    const content = lastMessage.content.length > 30
      ? `${lastMessage.content.substring(0, 30)}...`
      : lastMessage.content;

    return `${lastMessage.senderId === currentUserId ? 'You: ' : ''}${content}`;
  };

  const handleChatClick = (chatId: string | number, e: React.MouseEvent) => {
    if (onChatSelect) {
      e.preventDefault();
      onChatSelect(chatId);
    }
  };

  if (isLoading) {
    return (
      <div className={cn("flex flex-col h-full bg-white", className)}>
        <div className="p-4 border-b border-gray-100">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-100 flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse mr-3"></div>
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-48 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full p-6 bg-white", className)}>
        <div className="text-center max-w-md">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-12 w-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load messages</h3>
          <p className="text-gray-500 mb-6">
            We couldn't load your conversations. Please check your connection and try again.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full max-w-xs mx-auto bg-[#004B93] hover:bg-[#004B93] text-white px-6 py-2 rounded-lg shadow-sm transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Search bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#004B93] focus:border-[#004B93] sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Empty state */}
      {filteredChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-6">
          <div className="h-16 w-16 text-gray-300 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-16 w-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {searchQuery ? "No matches found" : (emptyState?.title || "No conversations yet")}
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            {searchQuery
              ? "Try a different search term"
              : (emptyState?.description || "Your conversations will appear here.")}
          </p>
          {!searchQuery && emptyState?.action && (
            <Link
              href={emptyState.action.href}
              className="bg-[#004B93] hover:bg-[#004B93] text-white px-6 py-2 rounded-lg shadow-sm transition-colors"
            >
              {emptyState.action.label}
            </Link>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => {
            const unreadCount = getUnreadCount(chat);
            const isActive = chat.id === activeChatId;
            
            return (
              <Link
                key={chat.id}
                href={`#`}
                onClick={(e) => handleChatClick(chat.id, e)}
                className={cn(
                  "flex items-center p-4 border-b border-gray-100 transition-colors",
                  isActive ? "bg-gray-50" : "hover:bg-gray-50",
                  itemClassName
                )}
              >
                {/* Avatar with online status */}
                <div className="relative mr-3">
                  {chat.participant?.profilePhoto ? (
                    <Image
                      src={chat.participant.profilePhoto}
                      alt={chat.participant.name || 'User'}
                      width={48}
                      height={48}
                      className="rounded-full object-cover border border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-[#004B93] text-white shadow-sm">
                      {chat.participant?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  {chat.participant?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                  )}
                </div>

                {/* Chat content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {chat.participant?.name || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatMessageDate(chat.latestMessage?.timestamp || chat.updatedAt)}
                    </span>
                  </div>

                  {chat.property?.name && (
                    <div className="flex items-center text-sm text-gray-600 mb-1 truncate">
                      <span className="truncate">
                        {chat.property.name}
                      </span>
                    </div>
                  )}

                  <p 
                    className={cn(
                      "text-sm truncate",
                      unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                    )}
                  >
                    {getLastMessagePreview(chat)}
                  </p>
                </div>

                {/* Unread indicator */}
                {unreadCount > 0 && (
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-[#004B93] text-white text-xs font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
