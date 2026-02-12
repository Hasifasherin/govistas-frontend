"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserConversations } from "../../../services/userChatService";

interface Conversation {
  operatorId: string; // renamed for consistency
  firstName: string;
  lastName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function UserChatPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await getUserConversations();
        setConversations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadConversations();
  }, []);

  const openChat = (operatorId: string) => {
    router.push(`/user/chat/${operatorId}`);
  };

  if (loading) {
    return <div className="p-6 text-gray-500 pt-20">Loading conversations...</div>;
  }

  return (
    // Add padding-top to prevent overlapping with fixed header
    <div className="h-screen flex bg-gray-100 pt-[80px]">
      {/* Sidebar */}
      <div className="w-full max-w-md flex flex-col bg-white border-r rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b font-semibold text-lg">Chats</div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No conversations yet
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.operatorId}
                onClick={() => openChat(conv.operatorId)}
                className="p-4 cursor-pointer hover:bg-gray-50 flex items-start gap-3 transition-colors"
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {conv.firstName[0]}
                    {conv.lastName[0]}
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-800 truncate">
                      {conv.firstName} {conv.lastName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Placeholder for chat area */}
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a conversation to start chatting
      </div>
    </div>
  );
}
