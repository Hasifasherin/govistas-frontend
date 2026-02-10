export interface Conversation {
  userId: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  lastSenderIsMe?: boolean; // optional, depends on your backend
}
