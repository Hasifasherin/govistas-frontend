"use client";

import { useState, useEffect, useRef } from "react";
import { FiSearch, FiMessageSquare, FiSend } from "react-icons/fi";
import { useOperatorChat, Conversation, Message } from "../../../hooks/useOperatorChat";
import { socket } from "../../../lib/socket";

export default function MessagesPage() {
  const operatorId = localStorage.getItem("operatorId") || ""; // required for the hook
  const {
    conversations,
    messages,
    fetchMessages,
    sendMessage,
    setMessages,
    loadingConversations,
    loadingMessages,
  } = useOperatorChat(operatorId); // pass operatorId

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter conversations
  const filteredConversations = conversations.filter(
    (conv) =>
      `${conv.firstName} ${conv.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  // Select a conversation
  const handleSelectConversation = async (userId: string) => {
    setSelectedChat(userId);
    await fetchMessages(userId);

    // Join socket room
    socket.emit("joinChat", { operatorId, userId });
  };

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedChat) {
      handleSelectConversation(conversations[0].userId);
    }
  }, [conversations]);

  // Listen for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (msg: Message & { sender: string; receiver: string }) => {
      if (!selectedChat) return;

      // Only add if message belongs to current conversation
      if (msg.sender === selectedChat || msg.receiver === selectedChat) {
        setMessages((prev) => [
          ...prev,
          {
            id: msg.id,
            sender: msg.sender === operatorId ? "operator" : "customer",
            text: msg.text,
            time: msg.time,
            isMe: msg.sender === operatorId,
          },
        ]);
      }
    };

    socket.on("newMessage", handleReceiveMessage);

    return () => {
      socket.off("newMessage", handleReceiveMessage);
    };
  }, [selectedChat, operatorId, setMessages]);

  // Send a message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        id: `temp_${Date.now()}`,
        sender: "operator",
        text: newMessage.trim(),
        time: new Date().toISOString(),
        isMe: true,
      },
    ]);

    sendMessage(selectedChat, newMessage.trim());
    setNewMessage("");
  };

  const formatTime = (iso: string | number) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col md:flex-row gap-6">
      {/* SIDEBAR */}
      <div className="md:w-1/3 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <p className="text-gray-600 mt-1">Communicate with your customers</p>
        </div>

        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
        </div>

        <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-200">
          {loadingConversations ? (
            <p className="p-4 text-center text-gray-500">Loading...</p>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <FiMessageSquare className="text-gray-400 mx-auto mb-3" size={32} />
              <p className="text-gray-500">No conversations found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredConversations.map((conv: Conversation) => (
                <div
                  key={conv.userId}
                  onClick={() => handleSelectConversation(conv.userId)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedChat === conv.userId ? "bg-green-50 border-l-4 border-l-green-500" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {conv.firstName[0]}
                        {conv.lastName[0]}
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {conv.firstName} {conv.lastName}
                        </h4>
                        <span className="text-xs text-gray-500">{formatTime(conv.lastMessageTime)}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {selectedChat ? (
          <>
            {/* CHAT HEADER */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                {conversations.find((c) => c.userId === selectedChat)?.firstName[0]}
                {conversations.find((c) => c.userId === selectedChat)?.lastName[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">
                  {conversations.find((c) => c.userId === selectedChat)?.firstName}{" "}
                  {conversations.find((c) => c.userId === selectedChat)?.lastName}
                </h3>
                <p className="text-sm text-green-600 font-medium">Online now</p>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
              {loadingMessages ? (
                <p className="text-center text-gray-500">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-500">No messages yet</p>
              ) : (
                messages.map((msg: Message) => (
                  <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[70%]">
                      {!msg.isMe && <div className="text-sm text-gray-500 mb-1 ml-1">{msg.sender}</div>}
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          msg.isMe
                            ? "bg-green-600 text-white rounded-br-none"
                            : "bg-white border border-gray-200 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-2 ${msg.isMe ? "text-green-100" : "text-gray-500"}`}>
                          {formatTime(msg.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* INPUT */}
            <div className="border-t border-gray-200 p-4 bg-white flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              >
                <FiSend size={18} /> Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <FiMessageSquare className="text-green-600 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Choose a conversation from the list to start messaging with your customers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
