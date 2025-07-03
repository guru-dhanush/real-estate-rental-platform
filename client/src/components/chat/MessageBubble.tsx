import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { Check, CheckCheck } from 'lucide-react';
import Image from 'next/image';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  avatarUrl?: string;
  userName?: string;
  className?: string;
}

export const MessageBubble = ({
  message,
  isCurrentUser,
  showAvatar,
  avatarUrl,
  userName,
  className,
}: MessageBubbleProps) => {
  const messageTime = format(new Date(message.timestamp), 'h:mm a');

  return (
    <div
      className={cn(
        'flex gap-2 max-w-[80%]',
        isCurrentUser ? 'ml-auto flex-row-reverse' : 'mr-auto',
        className
      )}
    >
      {showAvatar && !isCurrentUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName || 'User'}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              {userName?.charAt(0) || 'U'}
            </div>
          )}
        </div>
      )}
      
      <div className="flex flex-col">
        {showAvatar && !isCurrentUser && userName && (
          <span className="text-xs font-medium text-gray-500 mb-1">
            {userName}
          </span>
        )}
        
        <div
          className={cn(
            'px-4 py-2 rounded-2xl text-sm',
            isCurrentUser
              ? 'bg-[#004B93] text-white rounded-tr-none'
              : 'bg-gray-100 text-gray-800 rounded-tl-none',
            message.isSending && 'opacity-70',
            message.error && 'border border-red-300 bg-red-50'
          )}
        >
          <div className="break-words">{message.content}</div>
          
          <div className={cn(
            'mt-1 text-xs flex items-center justify-end gap-1',
            isCurrentUser ? 'text-blue-100' : 'text-gray-500'
          )}>
            <span>{messageTime}</span>
            {isCurrentUser && (
              <span className="ml-1">
                {message.isRead ? (
                  <CheckCheck size={14} className="text-blue-200" />
                ) : message.isSending ? (
                  <span className="w-3 h-3 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Check size={14} className="text-blue-200" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
