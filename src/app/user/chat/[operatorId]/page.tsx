"use client";

import { useEffect, useState, useRef } from "react";
import {
  getUserConversations,
  getUserMessages,
  sendUserMessage,
  editUserMessage,
  deleteUserMessage,
} from "../../../../services/userChatService";
import { socket } from "../../../../lib/socket";

interface Conversation {
  operatorId: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  _id: string;
  sender: { _id: string; firstName: string };
  receiver: { _id: string };
  message: string;
  createdAt: string;
  isDeleted?: boolean;
}

export default function UserChatScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Get userId on mount
  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
  }, []);

  // Scroll to bottom
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load conversations
  const loadConversations = async () => {
    try {
      const data = await getUserConversations();
      setConversations(data);
      if (data.length > 0 && !selectedOperator) handleSelectConversation(data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  // Load messages for selected operator
  const loadMessages = async (operatorId: string) => {
    if (!operatorId) return;
    try {
      const data = await getUserMessages(operatorId);
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  // Select conversation
  const handleSelectConversation = (conv: Conversation) => {
    setSelectedOperator(conv);
    loadMessages(conv.operatorId);
    if (userId) {
      socket.emit("joinUserChat", { userId, operatorId: conv.operatorId });
    }
  };

  // Load conversations when userId is set
  useEffect(() => {
    if (userId) loadConversations();
  }, [userId]);

  // Socket listeners
  useEffect(() => {
    if (!selectedOperator || !userId) return;

    const operatorId = selectedOperator.operatorId;

    const handleNewMessage = (msg: Message) => {
      if (msg.sender._id === operatorId || msg.receiver._id === operatorId) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    };

    const handleEdited = (msg: Message) => {
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
    };

    const handleDeleted = (msgId: string) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, isDeleted: true } : m))
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageEdited", handleEdited);
    socket.on("messageDeleted", handleDeleted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageEdited", handleEdited);
      socket.off("messageDeleted", handleDeleted);
    };
  }, [selectedOperator, userId]);

  // Send or edit message
  const handleSend = async () => {
    if (!text.trim() || !selectedOperator || !userId) return;

    if (editingMsgId) {
      try {
        const updated = await editUserMessage(editingMsgId, text);
        setMessages((prev) =>
          prev.map((m) => (m._id === editingMsgId ? updated : m))
        );
        setEditingMsgId(null);
        setText("");
      } catch (err) {
        console.error(err);
      }
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      _id: tempId,
      sender: { _id: userId, firstName: "You" },
      receiver: { _id: selectedOperator.operatorId },
      message: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setText("");

    try {
      const saved = await sendUserMessage({
        receiverId: selectedOperator.operatorId,
        message: text,
      });
      setMessages((prev) => prev.map((m) => (m._id === tempId ? saved : m)));
      scrollToBottom();
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  // Delete message
  const handleDelete = async (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m._id === msgId ? { ...m, isDeleted: true } : m))
    );
    try {
      await deleteUserMessage(msgId);
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, isDeleted: false } : m))
      );
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-screen pt-20 bg-gray-100">
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full max-w-xs bg-white rounded-xl shadow-sm border flex flex-col overflow-hidden">
          <div className="p-4 border-b font-semibold">Chats</div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 && (
              <div className="p-4 text-gray-500 text-center">No conversations yet</div>
            )}
            {conversations.map((conv, index) => (
              <div
                key={`${conv.operatorId}-${index}`}
                onClick={() => handleSelectConversation(conv)}
                className={`p-4 border-b cursor-pointer flex justify-between items-center ${
                  selectedOperator?.operatorId === conv.operatorId
                    ? "bg-green-50 border-l-4 border-green-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div>
                  <div className="font-medium">{conv.firstName} {conv.lastName}</div>
                  <div className="text-sm text-gray-500 truncate max-w-[150px]">{conv.lastMessage}</div>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center gap-3 bg-white flex-shrink-0">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
              {selectedOperator?.firstName[0]}
            </div>
            <h3 className="font-bold text-gray-800">
              {selectedOperator?.firstName} {selectedOperator?.lastName}
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-3">
            {messages.length === 0 && (
              <p className="text-center text-gray-500">No messages yet</p>
            )}
            {messages.map((msg) => {
              const isMe = msg.sender._id === userId;
              return (
                <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`px-4 py-3 rounded-2xl max-w-[70%] ${isMe ? "bg-green-600 text-white rounded-br-none" : "bg-white border rounded-bl-none"}`}>
                    {msg.isDeleted ? (
                      <i className="text-gray-300">Message deleted</i>
                    ) : (
                      msg.message
                    )}
                    {isMe && !msg.isDeleted && (
                      <div className="text-xs mt-1 flex gap-2">
                        <button onClick={() => { setText(msg.message); setEditingMsgId(msg._id); }}>Edit</button>
                        <button onClick={() => handleDelete(msg._id)}>Delete</button>
                      </div>
                    )}
                    <p className={`text-xs mt-1 ${isMe ? "text-green-100" : "text-gray-500"}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t flex gap-3 flex-shrink-0">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSend}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {editingMsgId ? "Update" : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
