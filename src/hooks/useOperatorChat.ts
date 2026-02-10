"use client";

import { useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { 
  sendOperatorMessage, 
  getOperatorConversations, 
  getOperatorUserMessages 
} from "../services/operatorChatService";

/* ===================== TYPES ===================== */

// Conversation for sidebar
export interface Conversation {
  userId: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// Message from backend / socket
export interface BackendMessage {
  _id: string;
  sender: string;      // ObjectId string
  receiver: string;    // ObjectId string
  message: string;
  createdAt: string;
}

// Message used by UI
export interface Message {
  id: string;
  sender: "operator" | "customer";
  text: string;
  time: string;
  isMe: boolean;
}

/* ===================== HOOK ===================== */

export const useOperatorChat = (operatorId: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  /* ===================== CONVERSATIONS ===================== */

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const data = await getOperatorConversations();
      setConversations(data || []);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  /* ===================== MESSAGES ===================== */

  const fetchMessages = async (userId: string) => {
  try {
    setLoadingMessages(true);
    const data = await getOperatorUserMessages(userId);

    // TS-safe cast
    const backendMessages = (data as unknown) as BackendMessage[];

    const formatted: Message[] = backendMessages.map((msg) => ({
      id: msg._id,
      sender: msg.sender === operatorId ? "operator" : "customer",
      text: msg.message,
      time: msg.createdAt,
      isMe: msg.sender === operatorId,
    }));

    setMessages(formatted);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    setMessages([]);
  } finally {
    setLoadingMessages(false);
  }
};


  /* ===================== SEND MESSAGE ===================== */

  const sendMessage = async (userId: string, text: string) => {
    const optimistic: Message = {
      id: `temp_${Date.now()}`,
      sender: "operator",
      text,
      time: new Date().toISOString(),
      isMe: true,
    };

    // Optimistic UI
    setMessages((prev) => [...prev, optimistic]);

    try {
      // REST call
      await sendOperatorMessage({ userId, message: text });

      // Socket emit
      socket.emit("sendMessage", {
        senderId: operatorId,
        receiverId: userId,
        message: text,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  /* ===================== SOCKET LISTENER ===================== */

  useEffect(() => {
    const handleNewMessage = (msg: BackendMessage) => {
      const formatted: Message = {
        id: msg._id,
        sender: msg.sender === operatorId ? "operator" : "customer",
        text: msg.message,
        time: msg.createdAt,
        isMe: msg.sender === operatorId,
      };
      setMessages((prev) => [...prev, formatted]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [operatorId]);

  /* ===================== INIT ===================== */

  useEffect(() => {
    fetchConversations();
  }, []);

  /* ===================== RETURN ===================== */

  return {
    conversations,
    messages,
    loadingConversations,
    loadingMessages,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setMessages,
  };
};
