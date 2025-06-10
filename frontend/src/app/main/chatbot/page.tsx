"use client";

import { useState } from "react";
import { IconSend, IconRobot } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LineShadowText } from "@/components/magicui/line-shadow-text";

// Dummy responses for testing
const dummyResponses = [
  "Hai! Saya PurrPal Assistant, siap membantu menjawab pertanyaan kamu seputar kucing.",
  "Tentu, saya mengerti masalah yang kamu hadapi dengan kucingmu.",
  "Berdasarkan informasi yang kamu berikan, berikut solusi untuk kucingmu...",
  "Apakah ada hal lain yang bisa saya bantu tentang kucingmu?",
  "Mari kita cari solusi bersama untuk masalah kucing kesayanganmu.",
];

const AutoResizeTextarea = ({ value, onChange, onKeyDown, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={1}
      className="flex-1 bg-transparent focus:outline-none resize-none overflow-hidden min-h-[40px] max-h-[200px] py-2 px-4 text-[15px]"
      style={{
        height: 'auto',
      }}
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = 'auto';
        target.style.height = target.scrollHeight + 'px';
      }}
    />
  );
};

const TextEffect = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hi! I'm PurrPal's AI Assistant. How can I help you today?", isUser: false },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: inputMessage, isUser: true }]);
    
    // Clear input
    setInputMessage("");

    // Get random dummy response
    setTimeout(() => {
      const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
      setMessages((prev) => [...prev, { text: randomResponse, isUser: false }]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const header = (
    <div className="text-center space-y-4 py-12">
      <TextEffect>
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-[#FF823C]/10 rounded-2xl">
            <IconRobot className="w-8 h-8 text-[#FF823C]" />
          </div>
        </div>
      </TextEffect>
      <TextEffect delay={0.2}>
        <h2 className="text-balance text-3xl font-semibold leading-none tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl mb-4">
          Selamat Datang di{" "}
          <LineShadowText className="italic" shadowColor="#FF823C">
            PurrPal AI
          </LineShadowText>
        </h2>
      </TextEffect>
      <TextEffect delay={0.4}>
        <p className="text-gray-600 text-base">Asisten AI untuk membantu kamu merawat kucing kesayangan</p>
      </TextEffect>
      <TextEffect delay={0.6}>
        <p className="text-gray-500 text-sm">Tanya apa saja seputar kesehatan dan perawatan kucing</p>
      </TextEffect>
    </div>
  );

  return (
    <div className="h-[calc(100vh-96px)] flex flex-col">
      <div className="flex-1 flex flex-col bg-white">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {messages.length === 1 && header}
            
            <AnimatePresence>
              <div className="space-y-4 py-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex items-end gap-3",
                      message.isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!message.isUser && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FF823C]/10 flex items-center justify-center">
                        <IconRobot className="w-5 h-5 text-[#FF823C]" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[85%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm",
                        message.isUser
                          ? "bg-[#FF823C] text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        </div>

        {/* Input Form */}
        <div className=" bg-white px-4 md:px-6 lg:px-8 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-200 shadow-sm focus-within:border-[#FF823C] focus-within:ring-1 focus-within:ring-[#FF823C] transition-all">
              <AutoResizeTextarea
                value={inputMessage}
                onChange={setInputMessage}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan Anda di sini..."
              />
              <button
                onClick={handleSendMessage}
                className="p-2 mr-2 text-[#FF823C] hover:text-[#FF823C]/80 transition-colors rounded-lg hover:bg-[#FF823C]/10"
              >
                <IconSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 