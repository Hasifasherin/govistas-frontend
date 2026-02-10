export interface BackendMessage {
  _id: string;
  sender: string;      // "operator" | userId
  receiver: string;    // userId | "operator"
  message: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sender: "operator" | "customer";
  text: string;
  time: string;
  isMe: boolean;
}
