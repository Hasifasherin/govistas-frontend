import api from "../utils/api";
import { Conversation } from "../types/conversation";
import { Message } from "../types/message";

/**
 * Get all conversations for the operator
 */
export const getOperatorConversations = async (): Promise<Conversation[]> => {
  const res = await api.get<{ success: boolean; count: number; conversations: Conversation[] }>("/messages");
  return res.data.conversations || [];
};

/**
 * Get messages with a specific user
 */
export const getOperatorUserMessages = async (userId: string): Promise<Message[]> => {
  const res = await api.get<{ success: boolean; count: number; messages: Message[] }>(`/messages/conversation/${userId}`);
  return res.data.messages || [];
};

/**
 * Send a message to a specific user
 */
export const sendOperatorMessage = async (data: { userId: string; message: string; bookingId?: string; tourId?: string }) => {
  const res = await api.post<{ success: boolean; data: Message }>("/messages", data);
  return res.data.data;
};
