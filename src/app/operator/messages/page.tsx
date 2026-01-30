// app/operator/messages/page.tsx
"use client";

import { useState } from "react";
import { FiSearch, FiMessageSquare, FiSend, FiUser, FiChevronRight } from "react-icons/fi";

interface Message {
  id: number;
  sender: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");

  const conversations: Message[] = [
    { id: 1, sender: "John Traveler", avatar: "JT", lastMessage: "Hi, I have a question about the mountain trek...", time: "10:30 AM", unread: true },
    { id: 2, sender: "Sarah Adventurer", avatar: "SA", lastMessage: "Can you accommodate a group of 8 people?", time: "Yesterday", unread: false },
    { id: 3, sender: "Mike Explorer", avatar: "ME", lastMessage: "Thanks for the amazing tour last week!", time: "2 days ago", unread: false },
    { id: 4, sender: "Lisa Wanderer", avatar: "LW", lastMessage: "Is the scuba diving equipment provided?", time: "3 days ago", unread: true },
    { id: 5, sender: "David Backpacker", avatar: "DB", lastMessage: "What's the cancellation policy?", time: "1 week ago", unread: false },
    { id: 6, sender: "Emma Tourist", avatar: "ET", lastMessage: "Do you provide transportation?", time: "1 week ago", unread: false },
  ];

  const messages: ChatMessage[] = [
    { id: 1, sender: "John Traveler", text: "Hi, I'm interested in your mountain trek tour for next weekend", time: "10:15 AM", isMe: false },
    { id: 2, sender: "You", text: "Hello John! I'd be happy to tell you more about it. The tour is available on both Saturday and Sunday.", time: "10:20 AM", isMe: true },
    { id: 3, sender: "John Traveler", text: "What's the difficulty level and what should I bring?", time: "10:25 AM", isMe: false },
    { id: 4, sender: "You", text: "It's moderate difficulty. You should bring hiking shoes, water bottle, snacks, and a light jacket. We provide all safety equipment.", time: "10:28 AM", isMe: true },
    { id: 5, sender: "John Traveler", text: "Great! How much is it per person?", time: "10:30 AM", isMe: false },
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.sender.toLowerCase().includes(search.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="h-[calc(100vh-180px)]">
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* SIDEBAR - CONVERSATIONS LIST */}
        <div className="md:w-1/3 flex flex-col">
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
            <p className="text-gray-600 mt-1">Communicate with your customers</p>
          </div>

          {/* SEARCH BAR */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            />
          </div>

          {/* CONVERSATIONS LIST */}
          <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-200">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <FiMessageSquare className="text-gray-400 mx-auto mb-3" size={32} />
                <p className="text-gray-500">No conversations found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChat(conv.id)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedChat === conv.id ? "bg-green-50 border-l-4 border-l-green-500" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* AVATAR */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{conv.avatar}</span>
                        </div>
                        {conv.unread && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      {/* CONVERSATION DETAILS */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-800 truncate">{conv.sender}</h4>
                          <span className="text-xs text-gray-500 whitespace-nowrap">{conv.time}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                        
                        {conv.unread && (
                          <div className="flex items-center mt-2">
                            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              New message
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CHEVRON */}
                      <FiChevronRight className="text-gray-400 flex-shrink-0 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {selectedChat ? (
            <>
              {/* CHAT HEADER */}
              <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {conversations.find(c => c.id === selectedChat)?.avatar}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">
                      {conversations.find(c => c.id === selectedChat)?.sender}
                    </h3>
                    <p className="text-sm text-green-600 font-medium">Online now</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FiSearch size={20} />
                  </button>
                </div>
              </div>

              {/* MESSAGES CONTAINER */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[70%]">
                        {!msg.isMe && (
                          <div className="text-sm text-gray-500 mb-1 ml-1">{msg.sender}</div>
                        )}
                        <div className={`rounded-2xl px-4 py-3 ${
                          msg.isMe 
                            ? "bg-green-600 text-white rounded-br-none" 
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                        }`}>
                          <p className="leading-relaxed">{msg.text}</p>
                          <p className={`text-xs mt-2 ${msg.isMe ? "text-green-100" : "text-gray-500"}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MESSAGE INPUT */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message here..."
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                  >
                    <FiSend size={18} />
                    Send
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Press Enter to send • Your messages are secure
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mb-4">
                <FiMessageSquare className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Choose a conversation from the list to start messaging with your customers
              </p>
              <div className="text-sm text-gray-400">
                <p>• Respond to customer inquiries</p>
                <p>• Discuss tour details</p>
                <p>• Provide support and assistance</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}