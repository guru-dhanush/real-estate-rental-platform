"use client";

import { useGetAuthUserQuery, useGetAllChatsQuery } from "@/state/api";
import Link from "next/link";
import { MessageSquare, User, Home, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { useState } from "react";
import Input from "@/components/ui/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";

const ChatListPage = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: chats, isLoading, isError, refetch } = useGetAllChatsQuery(
    authUser?.cognitoInfo?.userId ?? '',
    { skip: !authUser?.cognitoInfo?.userId }
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats?.filter(chat => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      chat.manager?.name?.toLowerCase().includes(search) ||
      chat.property?.name?.toLowerCase().includes(search) ||
      chat.messages?.some((msg: any) => msg.content.toLowerCase().includes(search))
    );
  });

  const getLastMessagePreview = (chat: any) => {
    if (!chat.messages || chat.messages.length === 0) {
      return "No messages yet";
    }

    const lastMessage = chat.latestMessage || chat.messages[chat.messages.length - 1];
    const content = lastMessage.content.length > 30
      ? `${lastMessage.content.substring(0, 30)}...`
      : lastMessage.content;

    return `${lastMessage.senderId === authUser?.cognitoInfo?.userId ? 'You: ' : ''}${content}`;
  };

  const getUnreadCount = (chat: any) => {
    return chat.unreadCount ||
      (chat.messages?.filter(
        (msg: any) =>
          msg.senderId !== authUser?.cognitoInfo?.userId &&
          !msg.isRead
      ).length || 0);
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return format(date, "h:mm a");
    } else if (date.getFullYear() === now.getFullYear()) {
      return format(date, "MMM d");
    } else {
      return format(date, "MM/dd/yy");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-white">
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
      <div className="flex flex-col items-center justify-center h-screen bg-white p-6">
        <div className="text-center max-w-md">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load messages</h3>
          <p className="text-gray-500 mb-6">
            We couldn't load your conversations. Please check your connection and try again.
          </p>
          <button
            onClick={() => refetch()}
            className="w-full max-w-xs mx-auto bg-[#004B93] hover:bg-[#004B93] text-white px-6 py-2 rounded-lg shadow-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ComponentCard title="Messages" className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">

        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search conversations..."
            className="pl-10 w-full"
            defaultValue={searchQuery ? searchQuery : ""}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Empty state */}
      {filteredChats?.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 p-6">
          <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {searchQuery ? "No matches found" : "No conversations yet"}
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            {searchQuery
              ? "Try a different search term"
              : "When you contact a property manager about a listing, your conversations will appear here."}
          </p>
          {!searchQuery && (
            <Link
              href="/properties"
              className="bg-[#004B93] hover:bg-[#004B93] text-white px-6 py-2 rounded-lg shadow-sm transition-colors"
            >
              Browse Properties
            </Link>
          )}
        </div>
      )}

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats?.map((chat) => (
          <Link
            key={chat.id}
            href={`/tenants/chat/${chat.id}`}
            className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
          >
            {/* Avatar with online status */}
            <div className="relative mr-3">
              {chat.manager?.profilePhoto ? (
                <Image
                  src={chat.manager.profilePhoto}
                  alt={chat.manager.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover border border-gray-200 shadow-sm"
                />
              ) : (
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-[#004B93] text-white shadow-sm">
                  <User size={24} />
                </div>
              )}
              {chat.otherUser?.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
              )}
            </div>

            {/* Chat content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-gray-900 truncate">
                  {chat.manager?.name || 'Property Manager'}
                </h3>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {formatMessageDate(chat.latestMessage?.timestamp || chat.updatedAt)}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-1 truncate">
                <Home className="flex-shrink-0 h-3.5 w-3.5 text-gray-400 mr-1.5" />
                <span className="truncate">
                  {chat.property?.name || 'Property Discussion'}
                </span>
              </div>

              <p className={`text-sm truncate ${getUnreadCount(chat) > 0
                ? 'font-medium text-gray-900'
                : 'text-gray-500'
                }`}>
                {getLastMessagePreview(chat)}
              </p>
            </div>

            {/* Unread indicator */}
            <div className="ml-4 flex flex-col items-center">
              {getUnreadCount(chat) > 0 && (
                <span className="bg-[#004B93] text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center mb-1">
                  {getUnreadCount(chat)}
                </span>
              )}
              <ChevronRight
                size={18}
                className="text-gray-300 group-hover:text-gray-400 transition-colors"
              />
            </div>
          </Link>
        ))}
      </div>
    </ComponentCard>
  );
};

export default ChatListPage;