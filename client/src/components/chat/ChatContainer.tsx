"use client";

import { useRouter } from "next/navigation";
import { useGetAuthUserQuery, useSendMessageMutation } from "@/state/api";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button/Button";
import { SendHorizontal, User, Check, CheckCheck, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useChatSocket } from "@/services/chatSocketService";
import { toast } from "react-hot-toast";

interface ChatUser {
    cognitoId?: string;
    email?: string;
    name: string;
    profilePhoto?: string;
    isOnline?: boolean;
}

interface ChatProperty {
    id: number;
    name: string;
    pricePerMonth: number;
    location?: {
        address: string;
    };
}

interface ChatMessage {
    id: string;
    content: string;
    senderId: string;
    timestamp: string;
    isRead: boolean;
    isSending?: boolean;
    isOptimistic?: boolean;
    isError?: boolean;
}

interface Chat {
    id: number;
    messages: ChatMessage[];
    updatedAt: string;
    unreadCount?: number;
    property?: ChatProperty;
    manager?: ChatUser;
    tenant?: ChatUser;
    otherUser?: ChatUser;
}

interface ChatContainerProps {
    chat: Chat;
    isLoading: boolean;
    isError: boolean;
    userType: 'manager' | 'tenant';
    sidebarComponent: React.ReactNode;
    backUrl: string;
}

const ChatContainer = ({
    chat,
    isLoading,
    isError,
    userType,
    sidebarComponent,
    backUrl
}: ChatContainerProps) => {
    const router = useRouter();
    const { data: authUser } = useGetAuthUserQuery();
    const [localChat, setLocalChat] = useState<Chat | null>(chat);
    const [message, setMessage] = useState("");
    const [showSidebar, setShowSidebar] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
    const { sendMessage: sendSocketMessage, isConnected, onMessage, onChatUpdate, joinRoom, leaveRoom } = useChatSocket();
    const [sendMessage] = useSendMessageMutation();

    // Update local chat when prop changes
    useEffect(() => {
        setLocalChat(chat);
    }, [chat]);

    // Handle new messages
    const handleNewMessage = useCallback((messageData: any) => {
        console.log("🚀 Incoming messageData:", messageData);

        if (!localChat) {
            console.log("❌ localChat is null or undefined. Skipping.");
            return;
        }

        if (messageData.chatId !== localChat.id) {
            console.log(`❌ Chat ID mismatch: messageData.chatId=${messageData.chatId}, localChat.id=${localChat.id}`);
            return;
        }

        console.log("✅ Proceeding with message update.");

        setLocalChat((prevChat) => {
            if (!prevChat) {
                console.log("⚠️ prevChat is null. Returning as-is.");
                return prevChat;
            }

            console.log("📦 Previous Chat State:", prevChat);

            // Check for duplicate messages by ID first (most reliable)
            const messageExistsById = prevChat.messages?.some(
                msg => msg.id === messageData.message?.id || msg.id === messageData.id
            );

            // If no ID match, check for similar content from the same sender within a short time window
            const similarMessageExists = !messageExistsById && prevChat.messages?.some(
                msg => {
                    const isSameContent = msg.content === (messageData.message?.content || messageData.content);
                    const isSameSender = msg.senderId === (messageData.message?.senderId || messageData.senderId);
                    const timeDiff = Math.abs(
                        new Date(msg.timestamp).getTime() -
                        new Date(messageData.message?.timestamp || messageData.timestamp).getTime()
                    );
                    return isSameContent && isSameSender && timeDiff < 2000; // 2 second window
                }
            );

            if (messageExistsById || similarMessageExists) {
                console.log("⚠️ Duplicate or similar message found. Skipping update.");
                return prevChat;
            }

            const messages = [...(prevChat.messages || [])];
            const newMessage = messageData.message || messageData;
            const isOptimisticMessage = newMessage.isOptimistic;

            // If this is a real message (not optimistic), remove any matching optimistic messages
            if (!isOptimisticMessage) {
                const optimisticIndex = messages.findIndex(
                    msg => msg.isOptimistic &&
                        msg.content === newMessage.content &&
                        msg.senderId === newMessage.senderId
                );

                if (optimisticIndex !== -1) {
                    console.log(`♻️ Replacing optimistic message at index ${optimisticIndex}`);
                    messages[optimisticIndex] = newMessage;
                    return {
                        ...prevChat,
                        messages,
                        updatedAt: new Date().toISOString()
                    };
                }
            }

            console.log("➕ Appending new message:", newMessage);

            return {
                ...prevChat,
                messages: [...messages, newMessage],
                updatedAt: new Date().toISOString()
            };
        });

        if (isScrolledToBottom) {
            console.log("📜 Auto-scrolling to bottom...");
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            console.log("📎 Not auto-scrolling. User has scrolled up.");
        }
    }, [localChat, isScrolledToBottom]);


    // Handle chat updates
    const handleChatUpdate = useCallback((update: any) => {
        if (!localChat || update.chatId !== localChat.id) return;

        setLocalChat((prevChat) => {
            if (!prevChat) return prevChat;
            return {
                ...prevChat,
                ...update,
                updatedAt: update.updatedAt || prevChat.updatedAt
            };
        });
    }, [localChat]);

    // Socket connection setup
    useEffect(() => {
        if (!localChat) return;

        const roomId = `chat:${localChat.id}`;
        let isMounted = true;

        const joinChatRoom = async () => {
            if (isConnected() && isMounted) {
                try {
                    await joinRoom(roomId);
                } catch (error) {
                    console.error('Failed to join room:', error);
                    if (isMounted) {
                        toast.error('Failed to join chat room. Please refresh the page.');
                    }
                }
            }
        };

        // Join room and set up listeners
        joinChatRoom();
        const cleanupMessage = onMessage(handleNewMessage);
        const cleanupChatUpdate = onChatUpdate(handleChatUpdate);

        return () => {
            isMounted = false;
            cleanupMessage();
            cleanupChatUpdate();

            if (isConnected && isConnected() && typeof leaveRoom === 'function') {
                try {
                    leaveRoom(roomId);
                } catch (error) {
                    console.error('Error leaving room:', error);
                }
            }
        };
    }, [localChat, isConnected, joinRoom, leaveRoom, onMessage, onChatUpdate, handleNewMessage, handleChatUpdate]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (isScrolledToBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [localChat?.messages, isScrolledToBottom]);

    // Track scroll position
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
        if (!message.trim() || !authUser?.cognitoInfo?.userId || !localChat) return;

        const messageText = message.trim();
        setMessage('');

        // Create optimistic message
        const tempMessageId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const tempMessage: ChatMessage = {
            id: tempMessageId,
            content: messageText,
            senderId: authUser.cognitoInfo.userId,
            timestamp: new Date().toISOString(),
            isRead: true,
            isSending: true,
            isOptimistic: true
        };

        // Update UI optimistically
        setLocalChat(prevChat => {
            if (!prevChat) return prevChat;
            return {
                ...prevChat,
                messages: [...(prevChat.messages || []), tempMessage],
                updatedAt: new Date().toISOString()
            };
        });

        // Auto-scroll
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

        try {


            // Then send via socket
            await sendSocketMessage(Number(localChat.id), messageText);
            // First save to database
            await sendMessage({
                chatId: Number(localChat.id),
                senderId: authUser.cognitoInfo.userId,
                content: messageText,
            }).unwrap();

            // Mark as sent
            setLocalChat(prevChat => {
                if (!prevChat) return prevChat;
                return {
                    ...prevChat,
                    messages: prevChat.messages.map(msg =>
                        msg.id === tempMessageId ? { ...msg, isSending: false } : msg
                    )
                };
            });
        } catch (error) {
            console.error('Failed to send message:', error);

            // Mark as error
            setLocalChat(prevChat => {
                if (!prevChat) return prevChat;
                return {
                    ...prevChat,
                    messages: prevChat.messages.map(msg =>
                        msg.id === tempMessageId ? { ...msg, isSending: false, isError: true } : msg
                    )
                };
            });

            toast.error('Failed to send message. Please try again.');
            setMessage(messageText);
        }
    };

    const formatMessageDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return format(date, "h:mm a");
    };

    const getOtherUser = () => {
        return userType === 'manager' ? localChat?.tenant : localChat?.manager;
    };

    const getOtherUserRole = () => {
        return userType === 'manager' ? 'Tenant' : 'Property Manager';
    };

    const isCurrentUser = (senderId: string) => {
        return senderId === authUser?.cognitoInfo?.userId;
    };

    const isOtherUser = (senderId: string) => {
        const otherUser = getOtherUser();
        return senderId === otherUser?.cognitoId;
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-pulse flex space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-[#004B93] rounded-full"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="text-red-500 mb-4 text-lg font-medium">Unable to load chat</div>
                <Button className="bg-[#004B93] hover:bg-[#004B93] text-white px-6 py-2 rounded-lg shadow-sm">
                    Retry
                </Button>
            </div>
        );
    }

    // No chat state
    if (!localChat) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="text-gray-600 mb-4 text-lg font-medium">Chat not found</div>
                <Button
                    onClick={() => router.push(backUrl)}
                    className="bg-[#004B93] hover:bg-[#004B93] text-white px-6 py-2 rounded-lg shadow-sm"
                >
                    Return to Inbox
                </Button>
            </div>
        );
    }

    const otherUser = getOtherUser();

    return (
        <div className="flex w-full h-screen">
            {/* Sidebar */}
            <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-[30%] border-none`}>
                {sidebarComponent}
            </div>

            {/* Chat Area */}
            <div className={`${showSidebar ? 'hidden' : 'flex'} md:flex w-full md:w-[70%] flex-col h-screen rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}>
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3 rounded-2xl sticky top-0 z-10 shadow-sm">
                    {/* Back button for mobile */}
                    <button
                        onClick={() => router.push(backUrl)}
                        className="md:hidden mr-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    {/* Sidebar toggle for mobile */}
                    {/* <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="md:hidden mr-2 text-gray-600 hover:text-gray-900"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button> */}

                    <div className="flex-1 flex items-center gap-3">
                        {/* User Avatar */}
                        <div className="relative">
                            {otherUser?.email ? (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-[#004B93] flex items-center justify-center text-white shadow-sm">
                                    <span className="font-medium text-lg">
                                        {otherUser.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User size={24} className="text-gray-500" />
                                </div>
                            )}
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${localChat.otherUser?.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                        </div>

                        {/* User and Property Info */}
                        <div className="flex-1 min-w-0">
                            <h2 className="text-base font-medium text-gray-800 dark:text-white/90 truncate">
                                {otherUser?.name || getOtherUserRole()}
                            </h2>
                            <div className="flex items-center text-sm text-gray-600 space-x-2 truncate">
                                {userType === 'manager' && localChat.property && (
                                    <Link
                                        href={`/managers/properties/${localChat.property.id}`}
                                        className="font-medium text-gray-700 hover:text-[#004B93] transition-colors truncate"
                                    >
                                        {localChat.property.name}
                                    </Link>
                                )}
                                {userType === 'tenant' && localChat.property && (
                                    <Link
                                        href={`/search/${localChat.property.id}`}
                                        className="font-medium text-gray-700 hover:text-[#004B93] transition-colors truncate"
                                    >
                                        {localChat.property.name || 'Property Discussion'}
                                    </Link>
                                )}
                                {localChat.property && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-[#004B93] font-medium">
                                            ${localChat.property.pricePerMonth?.toLocaleString()}/mo
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-[250px]">
                                {localChat.property?.location?.address || 'No address provided'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div
                        ref={containerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
                    >
                        {localChat.messages?.map((msg, index) => {
                            const isCurrentUserMsg = isCurrentUser(msg.senderId);
                            const isOtherUserMsg = isOtherUser(msg.senderId);

                            const showAvatar = isOtherUserMsg && (
                                index === 0 ||
                                localChat.messages![index - 1]?.senderId !== msg.senderId
                            );

                            const showDateDivider = index === 0 || (
                                new Date(msg.timestamp).toDateString() !==
                                new Date(localChat.messages![index - 1].timestamp).toDateString()
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

                                    <div className={`flex ${isCurrentUserMsg ? "justify-end" : "justify-start"} ${showAvatar ? "mt-4" : "mt-1"}`}>
                                        {!isCurrentUserMsg && showAvatar && (
                                            <div className="mr-2 flex-shrink-0 self-end mb-1">
                                                {otherUser?.profilePhoto ? (
                                                    <Image
                                                        src={otherUser.profilePhoto}
                                                        alt={otherUser.name}
                                                        width={36}
                                                        height={36}
                                                        className="rounded-full object-cover border border-gray-200 shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-[#004B93] text-white shadow-sm">
                                                        <User size={18} />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 shadow-sm ${isCurrentUserMsg
                                            ? "bg-gradient-to-r from-[#004B93] to-[#004B93] text-white rounded-br-none"
                                            : "bg-white border border-gray-200 rounded-bl-none"
                                            }`}>
                                            <p className={isCurrentUserMsg ? "text-white" : "text-gray-800"}>
                                                {msg.content}
                                            </p>
                                            <div className={`flex items-center justify-end gap-1 text-xs mt-1 ${isCurrentUserMsg ? "text-blue-100" : "text-gray-500"
                                                }`}>
                                                <span>{formatMessageDate(msg.timestamp)}</span>
                                                {isCurrentUserMsg && (
                                                    <span className="ml-1">
                                                        {msg.isRead ?
                                                            <CheckCheck size={14} className="text-blue-200" /> :
                                                            <Check size={14} className="text-blue-200" />
                                                        }
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

                {/* Message Input */}
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
                        <Button
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                            className={`rounded-full h-10 w-10 flex items-center justify-center ml-1 transition-all ${message.trim()
                                ? "bg-[#004B93] hover:bg-[#004B93] text-white shadow-md"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                            aria-label="Send message"
                        >
                            <SendHorizontal size={18} />
                        </Button>
                    </div>

                    <div className="text-xs text-center text-gray-500 mt-2">
                        Messages are end-to-end encrypted • Replies typically within 1 hour
                    </div>
                </div>

                {/* Scroll to bottom button */}
                {!isScrolledToBottom && (
                    <button
                        onClick={() => {
                            setIsScrolledToBottom(true);
                            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="fixed bottom-20 right-6 bg-white shadow-md rounded-full p-2 text-[#004B93] hover:bg-blue-50 transition-all border border-gray-200 z-10"
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

export default ChatContainer;