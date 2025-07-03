import { useState, useRef, KeyboardEvent } from 'react';
import { SendHorizontal, Paperclip, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

export const ChatInput = ({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  className = '',
  inputClassName = '',
  buttonClassName = '',
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;
    
    onSend(trimmedMessage);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className={cn(
      'border-t border-gray-200 bg-white p-3',
      className
    )}>
      <div className="flex items-end gap-2">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            disabled={disabled}
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            disabled={disabled}
          >
            <Smile className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none',
              'text-sm text-gray-900 placeholder-gray-500',
              'max-h-32 overflow-y-auto',
              inputClassName
            )}
          />
        </div>
        
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={cn(
            'ml-2 p-2 rounded-full',
            message.trim() && !disabled
              ? 'bg-[#004B93] text-white hover:bg-[#003b75]'
              : 'text-gray-400',
            'transition-colors duration-200',
            buttonClassName
          )}
        >
          <SendHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
