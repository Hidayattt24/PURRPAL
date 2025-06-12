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

// Add new interface for user profile
interface UserProfile {
  avatar_url?: string;
  username?: string;
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
    <motion.span 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-xs px-2 py-1 rounded-full border ${config[level].color} font-medium flex items-center gap-1`}
    >
      {config[level].icon}
      {config[level].text}
    </motion.span>
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

// Add new loading component
const LoadingIndicator = () => (
  <div className="flex flex-col items-center justify-center gap-4 p-8">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-[#FF823C]/20"></div>
      <div className="absolute inset-0 rounded-full border-4 border-[#FF823C] border-t-transparent animate-spin"></div>
      <IconRobot className="absolute inset-0 m-auto w-8 h-8 text-[#FF823C]" />
    </div>
    <div className="text-center">
      <p className="text-gray-600 font-medium">Menginisialisasi PurrPal AI</p>
      <p className="text-sm text-gray-500">Mohon tunggu sebentar...</p>
    </div>
  </div>
);

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRecommendations, setLastRecommendations] = useState<string[]>([]);
  const [chatbotMode, setChatbotMode] = useState<string>('unknown');
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const [isInitializing, setIsInitializing] = useState(true);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserProfile({
        avatar_url: response.data.avatar_url,
        username: response.data.username
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  // Add useEffect for fetching user profile
  useEffect(() => {
    fetchUserProfile();
  }, []);

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
      setIsInitializing(true);
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
    } finally {
      setIsInitializing(false);
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
    <div className="text-center space-y-4 py-8 md:py-12 bg-gradient-to-b from-white to-gray-50">
      <TextEffect>
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-[#FF823C]/10 rounded-2xl backdrop-blur-sm">
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
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Main Container with single scroll */}
      <div className="relative h-full flex flex-col max-w-[1200px] mx-auto">
        {/* Fixed Header */}
        {messages.length > 1 && (
          <div className="flex-none bg-white/80 backdrop-blur-sm border-b border-gray-100">
            <div className="px-4 md:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
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
            </div>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="flex-none">
            <div className="px-4 md:px-6 lg:px-8 py-4">
              <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-400 p-4 rounded">
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
            </div>
          </div>
        )}

        {/* Messages Container - Single Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 
          [&::-webkit-scrollbar]:hidden 
          [-ms-overflow-style:'none'] 
          [scrollbar-width:'none']">
          <div className="px-4 md:px-6 lg:px-8">
            {isInitializing ? (
              <LoadingIndicator />
            ) : (
              <>
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
                        {!message.isUser ? (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FF823C]/10 backdrop-blur-sm flex items-center justify-center"
                          >
                            <IconRobot className="w-5 h-5 text-[#FF823C]" />
                          </motion.div>
                        ) : (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="order-2 flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden"
                          >
                            <img 
                              src={userProfile.avatar_url || '/icon/default-avatar.png'} 
                              alt={userProfile.username || 'User'} 
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        )}
                        <div className={cn(
                          "flex flex-col gap-2 max-w-[85%]",
                          message.isUser && "order-1"
                        )}>
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={cn(
                              "px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm backdrop-blur-sm",
                              message.isUser
                                ? "bg-gradient-to-br from-[#FF823C] to-[#FF9B5C] text-white rounded-br-none"
                                : "bg-white border border-gray-100 text-gray-800 rounded-bl-none hover:border-[#FF823C]/20 transition-colors"
                            )}
                          >
                            {message.isUser ? (
                              <p className="whitespace-pre-wrap">{message.text}</p>
                            ) : (
                              <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-900">
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
                          </motion.div>
                          
                          {/* Message metadata */}
                          <div className={cn(
                            "flex items-center gap-2 px-2 flex-wrap",
                            message.isUser && "justify-end"
                          )}>
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
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FF823C]/10 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full border-2 border-[#FF823C] border-t-transparent animate-spin" />
                        </div>
                        <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-[#FF823C]/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="w-2 h-2 bg-[#FF823C]/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="w-2 h-2 bg-[#FF823C]/60 rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-gray-600 text-sm">PurrPal AI sedang berpikir...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Fixed Input Form */}
        <div className="flex-none bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <div className="px-4 md:px-6 lg:px-8 py-4">
            <div className={cn(
              "relative flex items-start bg-white rounded-2xl border shadow-sm transition-all",
              isConnected 
                ? "border-gray-200 focus-within:border-[#FF823C] focus-within:ring-1 focus-within:ring-[#FF823C] focus-within:shadow-lg"
                : "border-red-200 bg-red-50/50"
            )}>
              <AutoResizeTextarea
                value={inputMessage}
                onChange={setInputMessage}
                onKeyDown={handleKeyDown}
                placeholder={isConnected ? "Ketik pesan Anda di sini..." : "Menghubungkan ke PurrPal AI..."}
                disabled={!isConnected || isLoading}
              />
              <div className="flex-shrink-0 p-2">
                <button
                  onClick={handleSendMessage}
                  disabled={!isConnected || isLoading || !inputMessage.trim()}
                  className="p-2 text-[#FF823C] hover:text-[#FF823C]/80 transition-colors rounded-lg hover:bg-[#FF823C]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  ) : (
                    <IconSend className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
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