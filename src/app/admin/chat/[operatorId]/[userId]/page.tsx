"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOperatorUserMessages } from "../../../../../services/adminChatService";
import { socket } from "../../../../../lib/socket";

interface Message {
  _id: string;
  message: string;
  sender: {
    role: string;
  };
}

export default function AdminChatMessagesPage() {
  const params = useParams();

  const operatorId = params.operatorId as string;
  const userId = params.userId as string;

  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch old messages
  useEffect(() => {
    if (operatorId && userId) {
      fetchMessages();
      joinSocketRoom();
    }

    // Cleanup socket listener
    return () => {
      socket.off("receiveMessage");
    };
  }, [operatorId, userId]);

  const fetchMessages = async () => {
    try {
      const data = await getOperatorUserMessages(
        operatorId,
        userId
      );
      setMessages(data || []);
    } catch (error) {
      console.error("Fetch messages error:", error);
    }
  };

  // Join realtime room
  const joinSocketRoom = () => {
    socket.emit("joinAdminRoom", {
      operatorId,
      userId,
    });

    socket.on("receiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
  };

  return (
    <div className="p-6 flex flex-col h-[80vh]">
      <h1 className="text-xl font-bold mb-4">
        Chat Messages
      </h1>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto border rounded-xl p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-xs p-3 rounded-xl text-sm ${
              msg.sender.role === "operator"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}
