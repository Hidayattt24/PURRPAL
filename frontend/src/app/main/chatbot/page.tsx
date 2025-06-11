"use client";

import { useState, useEffect, useRef } from "react";
import { IconSend, IconRobot, IconLoader, IconTrash, IconWifi, IconWifiOff, IconAlertTriangle } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
  urgencyLevel?: 'normal' | 'serious' | 'emergency';
  cached?: boolean;
  responseTime?: number;
}

interface ChatbotResponse {
  success: boolean;
  message: string;
  urgencyLevel?: 'normal' | 'serious' | 'emergency';
  cached?: boolean;
  recommendations?: string[];
  timestamp: string;
  response_time_ms?: number;
  source?: string;
}

const AutoResizeTextarea = ({ value, onChange, onKeyDown, placeholder, disabled }: {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled?: boolean;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = newHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      rows={1}
      className="flex-1 bg-transparent focus:outline-none resize-none overflow-hidden min-h-[40px] max-h-[200px] py-3 px-4 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
      style={{
        height: 'auto',
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

const UrgencyBadge = ({ level }: { level?: 'normal' | 'serious' | 'emergency' }) => {
  if (!level || level === 'normal') return null;

  const config = {
    serious: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      text: '⚠️ Perlu Perhatian',
      icon: <IconAlertTriangle className="w-3 h-3" />
    },
    emergency: { 
      color: 'bg-red-100 text-red-800 border-red-200', 
      text: '🚨 Darurat!',
      icon: <IconAlertTriangle className="w-3 h-3" />
    }
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${config[level].color} font-medium flex items-center gap-1`}>
      {config[level].icon}
      {config[level].text}
    </span>
  );
};

const RecommendationCard = ({ recommendations }: { recommendations?: string[] }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
      <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Rekomendasi:</h4>
      <ul className="text-sm text-blue-700 space-y-1">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PerformanceIndicator = ({ responseTime, cached }: { responseTime?: number; cached?: boolean }) => {
  if (!responseTime && !cached) return null;

  return (
    <div className="flex items-center gap-2">
      {responseTime && (
        <span className={`text-xs px-2 py-1 rounded-full ${
          responseTime < 2000 ? 'bg-green-100 text-green-700' : 
          responseTime < 5000 ? 'bg-yellow-100 text-yellow-700' : 
          'bg-red-100 text-red-700'
        }`}>
          ⚡ {(responseTime / 1000).toFixed(1)}s
        </span>
      )}
      {cached && (
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          💾 Cached
        </span>
      )}
    </div>
  );
};

// Custom markdown components
const MarkdownComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-xl font-bold mt-4 mb-2 first:mt-0">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-lg font-bold mt-3 mb-2 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-base font-bold mt-3 mb-1 first:mt-0">{children}</h3>
  ),
  p: ({ children }: any) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }: any) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }: any) => (
    <em className="italic">{children}</em>
  ),
  code: ({ children }: any) => (
    <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
  ),
  pre: ({ children }: any) => (
    <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-2">
      <code className="text-sm font-mono">{children}</code>
    </pre>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2">{children}</blockquote>
  ),
  hr: () => (
    <hr className="my-4 border-gray-300" />
  )
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRecommendations, setLastRecommendations] = useState<string[]>([]);
  const [chatbotMode, setChatbotMode] = useState<string>('unknown');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check chatbot health on component mount
  useEffect(() => {
    checkChatbotHealth();
  }, []);

  const checkChatbotHealth = async () => {
    try {
      console.log('🏥 Checking chatbot health...');
      const response = await axios.get(`${API_BASE_URL}/chatbot/health`);
      
      console.log('📊 Health response:', response.data);
      
      setIsConnected(response.data.status === 'healthy');
      setChatbotMode(response.data.mode || 'production');
      
      if (response.data.status === 'healthy') {
        setError(null);
        // Add welcome message if no messages exist
        if (messages.length === 0) {
          setMessages([{
            text: "Hai! Saya **PurrPal AI Assistant** yang didukung oleh Vertex AI Gemini. Saya siap membantu menjawab pertanyaan Anda seputar kesehatan dan perawatan kucing. Apa yang bisa saya bantu hari ini? 🐱✨\n\nAnda bisa bertanya tentang:\n- **Kesehatan kucing** (gejala penyakit, perawatan)\n- **Nutrisi dan makanan** yang tepat\n- **Perilaku kucing** dan cara mengatasinya\n- **Tips perawatan** harian",
            isUser: false,
            timestamp: new Date().toISOString()
          }]);
        }
      } else {
        setError(`Chatbot service tidak tersedia: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('❌ Health check failed:', error);
      setIsConnected(false);
      
      if (error.response?.status === 503) {
        setError('Layanan chatbot sedang dalam proses inisialisasi. Silakan tunggu sebentar...');
      } else {
        setError('Tidak dapat terhubung ke layanan chatbot. Pastikan backend berjalan.');
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      console.log('📤 Sending message to chatbot:', userMessage.text.substring(0, 50) + '...');
      
      const startTime = Date.now();
      const response = await axios.post(
        `${API_BASE_URL}/chatbot/message`,
        { message: userMessage.text },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );
      const clientResponseTime = Date.now() - startTime;

      console.log('📥 Received response:', {
        success: response.data.success,
        urgency: response.data.urgencyLevel,
        responseTime: response.data.response_time_ms || clientResponseTime
      });

      const data: ChatbotResponse = response.data;

      if (data.success) {
        const botMessage: Message = {
          text: data.message,
          isUser: false,
          timestamp: data.timestamp,
          urgencyLevel: data.urgencyLevel,
          cached: data.cached,
          responseTime: data.response_time_ms || clientResponseTime
        };

        setMessages(prev => [...prev, botMessage]);
        setLastRecommendations(data.recommendations || []);
        setIsConnected(true);
        
        // Log performance metrics
        console.log('📊 Performance:', {
          responseTime: botMessage.responseTime,
          cached: botMessage.cached,
          urgency: botMessage.urgencyLevel
        });
        
      } else {
        throw new Error(data.message || 'Failed to get response from chatbot');
      }

    } catch (error: any) {
      console.error('💥 Error sending message:', error);
      
      let errorMessage = 'Maaf, terjadi kesalahan. Silakan coba lagi.';
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Respons chatbot memerlukan waktu terlalu lama. Silakan coba dengan pertanyaan yang lebih singkat.';
      } else if (error.response?.status === 503) {
        errorMessage = 'Layanan chatbot sedang tidak tersedia atau dalam proses inisialisasi. Silakan coba lagi dalam beberapa menit.';
        setIsConnected(false);
      } else if (error.response?.status === 500) {
        errorMessage = error.response.data?.message || 'Terjadi kesalahan internal pada server chatbot.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
      
      // Add error message to chat
      const errorBotMessage: Message = {
        text: errorMessage + (error.response?.data?.suggestions ? 
          '\n\nSaran:\n' + error.response.data.suggestions.map((s: string) => `• ${s}`).join('\n') : ''),
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/chatbot/history`);
      
      setMessages([{
        text: "Riwayat percakapan telah dihapus. Silakan mulai percakapan baru! Mari kita bicarakan tentang kucing kesayangan Anda. 🐱",
        isUser: false,
        timestamp: new Date().toISOString()
      }]);
      
      setLastRecommendations([]);
    } catch (error) {
      console.error('Error clearing conversation:', error);
      // Still clear local messages even if API call fails
      setMessages([{
        text: "Riwayat percakapan telah dihapus secara lokal. Silakan mulai percakapan baru! 🐱",
        isUser: false,
        timestamp: new Date().toISOString()
      }]);
      setLastRecommendations([]);
    }
  };

  const header = (
    <div className="text-center space-y-4 py-8 md:py-12">
      <TextEffect>
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-[#FF823C]/10 rounded-2xl">
            <IconRobot className="w-8 h-8 text-[#FF823C]" />
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <IconWifi className="w-5 h-5 text-green-500" />
            ) : (
              <IconWifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Terhubung' : 'Terputus'}
            </span>
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
        <p className="text-gray-600 text-base">Asisten AI yang didukung Vertex AI Gemini untuk merawat kucing kesayangan</p>
      </TextEffect>
      <TextEffect delay={0.6}>
        <p className="text-gray-500 text-sm">Tanya apa saja seputar kesehatan dan perawatan kucing dengan AI yang cerdas</p>
      </TextEffect>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Main Container - Fixed height with proper spacing for navigation */}
      <div className="flex-1 flex flex-col bg-white min-h-0 pt-16 md:pt-20">
        {/* Header with status and clear button */}
        {messages.length > 1 && (
          <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <IconWifi className="w-4 h-4 text-green-500" />
                  <span>Status: Terhubung</span>
                  {chatbotMode && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {chatbotMode === 'testing' ? 'Test Mode' : 'AI Active'}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <IconWifiOff className="w-4 h-4 text-red-500" />
                  <span>Status: Terputus</span>
                </div>
              )}
            </div>
            <button
              onClick={clearConversation}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <IconTrash className="w-4 h-4" />
              Hapus Riwayat
            </button>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="flex-shrink-0 bg-red-50 border-l-4 border-red-400 p-4 m-4 rounded">
            <div className="flex items-start">
              <IconAlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={checkChatbotHealth}
                    className="text-sm text-red-600 underline hover:text-red-800"
                  >
                    Coba lagi
                  </button>
                  <button
                    onClick={() => setError(null)}
                    className="text-sm text-gray-500 underline hover:text-gray-700"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Container - Flexible height */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
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
                    <div className="flex flex-col gap-2 max-w-[85%]">
                      <div
                        className={cn(
                          "px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm",
                          message.isUser
                            ? "bg-[#FF823C] text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        )}
                      >
                        {message.isUser ? (
                          <p className="whitespace-pre-wrap">{message.text}</p>
                        ) : (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={MarkdownComponents}
                              remarkPlugins={[remarkGfm]}
                            >
                              {message.text}
                            </ReactMarkdown>
                          </div>
                        )}
                        
                        {/* Show recommendations for the latest bot message */}
                        {!message.isUser && index === messages.length - 1 && (
                          <RecommendationCard recommendations={lastRecommendations} />
                        )}
                      </div>
                      
                      {/* Message metadata */}
                      <div className="flex items-center gap-2 px-2 flex-wrap">
                        <UrgencyBadge level={message.urgencyLevel} />
                        <PerformanceIndicator 
                          responseTime={message.responseTime} 
                          cached={message.cached} 
                        />
                        <span className="text-xs text-gray-400">
                          {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-3 justify-start"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FF823C]/10 flex items-center justify-center">
                      <IconRobot className="w-5 h-5 text-[#FF823C]" />
                    </div>
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none">
                      <div className="flex items-center gap-2">
                        <IconLoader className="w-4 h-4 animate-spin text-[#FF823C]" />
                        <span className="text-gray-600 text-sm">PurrPal AI sedang berpikir...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form - Fixed at bottom */}
        <div className="flex-shrink-0 bg-white px-4 md:px-6 lg:px-8 py-4 border-t border-gray-100 safe-area-bottom">
          <div className="max-w-3xl mx-auto">
            <div className={cn(
              "relative flex items-start bg-gray-50 rounded-2xl border border-gray-200 shadow-sm transition-all",
              isConnected 
                ? "focus-within:border-[#FF823C] focus-within:ring-1 focus-within:ring-[#FF823C]"
                : "border-red-200 bg-red-50"
            )}>
              <AutoResizeTextarea
                value={inputMessage}
                onChange={setInputMessage}
                onKeyDown={handleKeyDown}
                placeholder={isConnected ? "Ketik pesan Anda di sini..." : "Chatbot tidak tersedia..."}
                disabled={!isConnected || isLoading}
              />
              <div className="flex-shrink-0 p-2">
                <button
                  onClick={handleSendMessage}
                  disabled={!isConnected || isLoading || !inputMessage.trim()}
                  className="p-2 text-[#FF823C] hover:text-[#FF823C]/80 transition-colors rounded-lg hover:bg-[#FF823C]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <IconLoader className="w-5 h-5 animate-spin" />
                  ) : (
                    <IconSend className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            {!isConnected && (
              <p className="text-center text-sm text-red-600 mt-2">
                Layanan chatbot sedang tidak tersedia. Silakan coba lagi nanti atau periksa koneksi Anda.
              </p>
            )}
            
            {chatbotMode === 'testing' && isConnected && (
              <p className="text-center text-xs text-yellow-600 mt-1">
                ⚠️ Mode testing aktif - Response mungkin tidak optimal
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}