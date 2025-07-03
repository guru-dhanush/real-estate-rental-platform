import { useRef, useEffect } from 'react';
import { Chat, Message } from '@/types/chat';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { cn } from '@/lib/utils';

export interface ChatWindowProps {
  chat: Chat | null;
  currentUserId: string;
  onSendMessage: (content: string) => Promise<void>;
  onBack?: () => void;
  backHref?: string;
  isLoading?: boolean;
  isSending?: boolean;
  className?: string;
  headerClassName?: string;
  messagesContainerClassName?: string;
  inputClassName?: string;
  showHeader?: boolean;
  emptyState?: React.ReactNode;
}

export const ChatWindow = ({
  chat,
  currentUserId,
  onSendMessage,
  onBack,
  backHref,
  isLoading = false,
  isSending = false,
  className = '',
  headerClassName = '',
  messagesContainerClassName = '',
  inputClassName = '',
  showHeader = true,
  emptyState,
}: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chat?.messages]);

  // Handle sending a message
  const handleSend = async (content: string) => {
    if (!content.trim() || isSending) return;
    await onSendMessage(content);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={cn("flex flex-col h-full bg-white", className)}>
        {showHeader && (
          <ChatHeader
            title="Loading..."
            onBack={onBack}
            backHref={backHref}
            className={headerClassName}
          />
        )}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gray-300 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render empty state if no chat is selected
  if (!chat) {
    return (
      <div className={cn("flex flex-col h-full bg-white", className)}>
        {showHeader && (
          <ChatHeader
            title="Select a chat"
            onBack={onBack}
            backHref={backHref}
            className={headerClassName}
          />
        )}
        <div className="flex-1 flex items-center justify-center p-6">
          {emptyState || (
            <div className="text-center text-gray-500">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const { participant, messages = [], property } = chat;

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {showHeader && (
        <ChatHeader
          title={participant?.name || 'Unknown User'}
          subtitle={property?.name}
          avatarUrl={participant?.profilePhoto}
          isOnline={participant?.isOnline}
          onBack={onBack}
          backHref={backHref}
          className={headerClassName}
        />
      )}

      <div
        ref={containerRef}
        className={cn(
          "flex-1 overflow-y-auto p-4 space-y-4",
          messagesContainerClassName
        )}
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUserId;
            const showAvatar = !isCurrentUser && (
              index === 0 || 
              messages[index - 1]?.senderId !== message.senderId
            );

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={isCurrentUser}
                showAvatar={showAvatar}
                avatarUrl={!isCurrentUser ? participant?.profilePhoto : undefined}
                userName={!isCurrentUser ? participant?.name : undefined}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={handleSend}
        disabled={isSending}
        className={inputClassName}
      />
    </div>
  );
};
