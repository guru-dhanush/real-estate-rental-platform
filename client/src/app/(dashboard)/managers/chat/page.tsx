"use client";

import { useGetAuthUserQuery, useGetAllChatsQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import { ChatList } from "@/components/chat";
import { useMemo } from "react";
import ComponentCard from "@/components/common/ComponentCard";

const ManagerChatListPage = () => {
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
        id: chat.tenant?.id || '',
        name: chat.tenant?.name,
        profilePhoto: chat.tenant?.profilePhoto,
        isOnline: chat.otherUser?.isOnline
      },
      messages: chat.messages || [],
      latestMessage: chat.latestMessage
    }));
  }, [chats]);

  const handleChatSelect = (chatId: string | number) => {
    router.push(`/managers/chat/${chatId}`);
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
          description: "When tenants contact you about your properties, conversations will appear here.",
        }}
      />
    </ComponentCard>
  );
};

export default ManagerChatListPage;