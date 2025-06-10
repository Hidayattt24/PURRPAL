"use client";

import { useState } from "react";
import { IconSend } from "@tabler/icons-react";

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hi! I'm PurrPal's chatbot. How can I help you today?", isUser: false },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: inputMessage, isUser: true }]);
    
    // Clear input
    setInputMessage("");

    // TODO: Add actual chatbot integration here
    // For now, we'll just add a mock response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Thanks for your message! Our chatbot integration is coming soon.", isUser: false },
      ]);
    }, 1000);
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="bg-white rounded-lg shadow-lg min-h-[80vh] flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold text-[#FF823C]">PurrPal Chatbot</h1>
          <p className="text-sm text-gray-500">Ask me anything about pet care!</p>
        </div>

        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? "bg-[#FF823C] text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message here..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF823C]"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-[#FF823C] text-white rounded-lg hover:bg-[#FF823C]/90 transition-colors"
            >
              <IconSend className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 