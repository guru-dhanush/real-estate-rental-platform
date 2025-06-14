"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetAuthUserQuery, useGetChatQuery, useSendMessageMutation } from "@/state/api";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button/Button";
import { SendHorizontal, User, Check, CheckCheck, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import ChatListPage from "../page";
import Link from "next/link";

const ManagerChatPage = () => {
  const { chatId } = useParams();
  const router = useRouter();
  const { data: authUser } = useGetAuthUserQuery();
  const { data: chat, isLoading, isError } = useGetChatQuery(Number(chatId));
  const [sendMessage] = useSendMessageMutation();
  const [message, setMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  // Scroll to bottom of messages
  useEffect(() => {
    if (isScrolledToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages, isScrolledToBottom]);

  // Track scrolling position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsScrolledToBottom(isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || !authUser?.cognitoInfo?.userId || !chatId) return;

    try {
      await sendMessage({
        chatId: Number(chatId),
        senderId: authUser.cognitoInfo.userId,
        content: message,
      });
      setMessage("");
      setIsScrolledToBottom(true);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="animate-pulse flex space-x-2">
        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
      </div>
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-red-500 mb-4 text-lg font-medium">Unable to load chat</div>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm">
        Retry
      </Button>
    </div>
  );

  if (!chat) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-gray-600 mb-4 text-lg font-medium">Chat not found</div>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm">
        Return to Inbox
      </Button>
    </div>
  );

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return format(date, "h:mm a");
    } else {
      return format(date, "h:mm a");
    }
  };

  return (
    <div className="flex w-full h-screen">
      {/* Chat list sidebar - 30% width (hidden on mobile by default) */}
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-[30%] border-none`}>
        <ChatListPage />
      </div>

      {/* Chat area - 70% width (full width on mobile) */}
      <div className={`${showSidebar ? 'hidden' : 'flex'} md:flex w-full md:w-[70%] flex-col h-screen rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}>
        {/* Chat header with back button for mobile */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3 rounded-2xl sticky top-0 z-10 shadow-sm">
          {/* Back button for mobile */}
          <button
            onClick={() => router.push('/managers/chat')}
            className="md:hidden mr-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>

          {/* Toggle sidebar button for mobile */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden mr-2 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="flex-1 flex items-center gap-3">
            {/* Tenant Avatar with Online Status */}
            <div className="relative">
              {chat.tenant?.email ? (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
                  <span className="font-medium text-lg">
                    {chat.tenant.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={24} className="text-gray-500" />
                </div>
              )}
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${chat.otherUser?.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
            </div>

            {/* Property and Tenant Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-medium text-gray-800 dark:text-white/90 truncate">
                {chat.tenant?.name || 'Tenant'}
              </h2>
              <div className="flex items-center text-sm text-gray-600 space-x-2 truncate">
                <Link
                  href={`/managers/properties/${chat.property?.id}`}
                  className="font-medium text-gray-700 hover:text-blue-600 transition-colors truncate"
                >
                  {chat.property?.name || 'Property Discussion'}
                </Link>
                <span className="text-gray-300">•</span>
                <span className="text-blue-600 font-medium">
                  ${chat.property?.pricePerMonth?.toLocaleString()}/mo
                </span>
              </div>
              <div className="text-xs text-gray-500 truncate">
                {chat.property?.location?.address || 'No address provided'}
              </div>
            </div>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
          >
            {chat.messages?.map((msg: any, index: number) => {
              const isCurrentUser = msg.senderId === authUser?.cognitoInfo?.userId;
              const isTenant = msg.senderId === chat.tenant?.cognitoId;

              const showAvatar = isTenant ||
                index === 0 ||
                chat.messages![index - 1]?.senderId !== msg.senderId;

              const showDateDivider = index === 0 || (
                new Date(msg.timestamp).toDateString() !==
                new Date(chat.messages![index - 1].timestamp).toDateString()
              );

              return (
                <div key={msg.id}>
                  {showDateDivider && (
                    <div className="flex justify-center my-4">
                      <div className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-medium shadow-sm">
                        {format(new Date(msg.timestamp), "d MMMM yyyy")}
                      </div>
                    </div>
                  )}

                  <div
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} ${showAvatar ? "mt-4" : "mt-1"}`}
                  >
                    {!isCurrentUser && showAvatar && (
                      <div className="mr-2 flex-shrink-0 self-end mb-1">
                        {chat.tenant?.profilePhoto ? (
                          <Image
                            src={chat.tenant.profilePhoto}
                            alt={chat.tenant.name}
                            width={36}
                            height={36}
                            className="rounded-full object-cover border border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                            <User size={18} />
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 shadow-sm ${isCurrentUser
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                        : "bg-white border border-gray-200 rounded-bl-none"
                        }`}
                    >
                      <p className={isCurrentUser ? "text-white" : "text-gray-800"}>{msg.content}</p>
                      <div
                        className={`flex items-center justify-end gap-1 text-xs mt-1 ${isCurrentUser ? "text-blue-100" : "text-gray-500"
                          }`}
                      >
                        <span>{formatMessageDate(msg.timestamp)}</span>
                        {isCurrentUser && (
                          <span className="ml-1">
                            {msg.isRead ? <CheckCheck size={14} className="text-blue-200" /> : <Check size={14} className="text-blue-200" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message input */}
        <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-5 border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200 transition-all">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              className="border-0 focus:border-0 focus:outline-none focus:ring-0 shadow-none bg-transparent rounded-full flex-1 py-3 text-gray-800 placeholder-gray-500"
            />
            <div className="flex">
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`rounded-full h-10 w-10 flex items-center justify-center ml-1 transition-all ${message.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                aria-label="Send message"
              >
                <SendHorizontal size={18} />
              </Button>
            </div>
          </div>

          <div className="text-xs text-center text-gray-500 mt-2">
            Messages are end-to-end encrypted • Replies typically within 1 hour
          </div>
        </div>

        {/* Scroll to bottom button (shows when not at bottom) */}
        {!isScrolledToBottom && (
          <button
            onClick={() => {
              setIsScrolledToBottom(true);
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="fixed bottom-20 right-6 bg-white shadow-md rounded-full p-2 text-blue-600 hover:bg-blue-50 transition-all border border-gray-200 z-10"
            aria-label="Scroll to bottom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ManagerChatPage;