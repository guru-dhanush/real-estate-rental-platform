"use client";

import { useParams } from "next/navigation";
import { useGetChatQuery } from "@/state/api";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatListPage from "../page";

const TenantChatPage = () => {
  const { chatId } = useParams();
  const { data: chat, isLoading, isError } = useGetChatQuery(Number(chatId));

  return (
    <ChatContainer
      chat={chat}
      isLoading={isLoading}
      isError={isError}
      userType="tenant"
      sidebarComponent={<ChatListPage />}
      backUrl="/tenants/chat"
    />
  );
};

export default TenantChatPage;