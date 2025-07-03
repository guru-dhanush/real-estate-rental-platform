import { useState, useCallback, useEffect, useRef } from 'react';
import { Message, Chat } from '@/types/chat';

interface UseChatMessagesProps {
  initialMessages?: Message[];
  currentUserId: string;
  onNewMessage?: (message: Message) => void;
}

export const useChatMessages = ({
  initialMessages = [],
  currentUserId,
  onNewMessage,
}: UseChatMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  // Scroll to bottom of messages
  useEffect(() => {
    if (isScrolledToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isScrolledToBottom]);

  // Track scrolling position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsScrolledToBottom(isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const addMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      // Check if message already exists
      const messageExists = prev.some(
        msg => msg.id === newMessage.id || 
              (msg.content === newMessage.content && 
               msg.senderId === newMessage.senderId &&
               Math.abs(new Date(msg.timestamp).getTime() - new Date(newMessage.timestamp).getTime()) < 1000)
      );
      
      if (messageExists) return prev;
      
      // If we have an optimistic message with the same content, replace it
      const optimisticIndex = prev.findIndex(
        msg => msg.isOptimistic && 
              msg.content === newMessage.content && 
              msg.senderId === newMessage.senderId
      );

      if (optimisticIndex !== -1) {
        const updated = [...prev];
        updated[optimisticIndex] = newMessage;
        return updated;
      }

      return [...prev, newMessage];
    });
    
    onNewMessage?.(newMessage);
  }, [onNewMessage]);

  const sendMessage = useCallback(async (content: string, onSend: (content: string) => Promise<Message>) => {
    if (!content.trim() || isSending) return;

    const messageText = content.trim();
    const tempMessageId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create optimistic message
    const tempMessage: Message = {
      id: tempMessageId,
      content: messageText,
      senderId: currentUserId,
      timestamp: new Date().toISOString(),
      isRead: true,
      isSending: true,
      isOptimistic: true,
    };

    // Update UI optimistically
    setMessages(prev => [...prev, tempMessage]);
    setIsSending(true);
    setError(null);

    try {
      // Send the actual message
      const sentMessage = await onSend(messageText);
      
      // Replace the optimistic message with the real one
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessageId ? { ...sentMessage, isSending: false } : msg
        )
      );
      
      return sentMessage;
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      
      // Mark the message as failed to send
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessageId 
            ? { ...msg, isSending: false, isOptimistic: false, error: true }
            : msg
        )
      );
      
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [currentUserId, isSending]);

  return {
    messages,
    setMessages,
    isSending,
    error,
    messagesEndRef,
    containerRef,
    isScrolledToBottom,
    addMessage,
    sendMessage,
  };
};
