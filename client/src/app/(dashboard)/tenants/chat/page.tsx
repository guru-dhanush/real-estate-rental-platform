"use client";

import { useGetAuthUserQuery, useGetAllChatsQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import { ChatList } from "@/components/chat";
import { useMemo } from "react";
import { Chat } from "@/types/chat";
import ComponentCard from "@/components/common/ComponentCard";

const ChatListPage = () => {
  const router = useRouter();
  const { data: authUser } = useGetAuthUserQuery();
  const { data: chats = [], isLoading, isError, refetch } = useGetAllChatsQuery(
    authUser?.cognitoInfo?.userId ?? '',
    { skip: !authUser?.cognitoInfo?.userId }
  );

  // Transform the chats data to match the expected format
  const transformedChats = useMemo(() => {
    return chats.map((chat: any) => ({
      ...chat,
      participant: {
        id: chat.manager?.id || '',
        name: chat.manager?.name || 'Property Manager',
        profilePhoto: chat.manager?.profilePhoto,
        isOnline: chat.otherUser?.isOnline
      },
      property: chat.property || { name: 'Property Discussion' },
      messages: chat.messages || [],
      latestMessage: chat.latestMessage
    }));
  }, [chats]);

  const handleChatSelect = (chatId: string | number) => {
    router.push(`/tenants/chat/${chatId}`);
  };

  return (
    <ComponentCard title="Messages" className="h-screen">
      <ChatList
        chats={transformedChats}
        currentUserId={authUser?.cognitoInfo?.userId || ''}
        onChatSelect={handleChatSelect}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyState={{
          title: "No conversations yet",
          description: "When you contact a property manager about a listing, your conversations will appear here.",
          action: {
            label: "Browse Properties",
            href: "/search"
          }
        }}
      />
    </ComponentCard>
  );
};

export default ChatListPage;