'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'admin';
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Chat
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (step === 2 && formData.email) {
      // Connect to socket when chat starts
      socketRef.current = io();
      socketRef.current.emit('join', formData.email);

      socketRef.current.on('new_admin_reply', (data: { reply: string }) => {
        const adminMessage: Message = {
          id: Date.now().toString(),
          text: data.reply,
          sender: 'admin',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, adminMessage]);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [step, formData.email]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('chat') === 'open') {
      setIsOpen(true);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setStep(2);
      // Initial bot message
      setMessages([
        {
          id: '1',
          text: `Hi ${formData.name}! Welcome to Chartered Tutor Academy. How can I help you today?`,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const generateAutoReply = (userText: string) => {
    const text = userText.toLowerCase();
    if (text.includes('price') || text.includes('fee') || text.includes('cost')) {
      return "Our fees vary depending on the grade and subject. Would you like me to have an advisor contact you with a detailed quote?";
    } else if (text.includes('tutor') || text.includes('teacher')) {
      return "We have over 500+ expert tutors. You can register as a student on our website to get matched with the perfect one!";
    } else if (text.includes('online') || text.includes('home')) {
      return "We offer both online and face-to-face (home) tuition. Which one do you prefer?";
    } else if (text.includes('curriculum') || text.includes('subject')) {
      return "We support various curricula including O/A Levels, IGCSE, IB, and local boards. You can view the full list on our Curriculum page.";
    } else {
      return "That's interesting! Let me pass this information to our team, and they will get back to you shortly. Is there anything else you'd like to know?";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Send to server for admin
    try {
      await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: formData.name,
          userEmail: formData.email,
          userMessage: inputMessage,
        }),
      });
    } catch (error) {
      console.error('Failed to sync message to server:', error);
    }

    // AI Auto-reply
    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The user says: "${inputMessage}". 
        You are the AI assistant for "CHARTERED TUTOR ACADEMY", a premium tuition academy in Pakistan.
        Provide a helpful, professional, and concise response. 
        If the user asks about fees, mention that they vary by grade/subject and we can provide a quote.
        If they ask about tutors, mention we have 500+ experts.
        If they ask about subjects, we cover O/A Levels, IGCSE, IB, Matric, and Intermediate.
        Keep it under 50 words.`,
      });

      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text || "I'm sorry, I couldn't process that. Let me connect you with our team.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      console.error('AI Reply Error:', error);
      const fallbackReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! Our team will get back to you shortly.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden border border-slate-100 mb-4 flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-[#001b52] p-4 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Chartered Tutor Academy Support</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-white/70 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {step === 1 ? (
                <div className="p-6 overflow-y-auto">
                  <form onSubmit={handleStartChat} className="space-y-4">
                    <p className="text-slate-600 text-sm mb-4">
                      Welcome! Please provide your details to start a conversation with our team.
                    </p>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type="text"
                        placeholder="Your Name"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001b52]/20 focus:border-[#001b52]"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type="email"
                        placeholder="Email Address"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001b52]/20 focus:border-[#001b52]"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#bf1e2e] text-white py-3 rounded-lg font-bold hover:bg-[#a01927] transition-colors shadow-lg shadow-red-900/10"
                    >
                      Start Chat
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            msg.sender === 'user'
                              ? 'bg-[#001b52] text-white rounded-tr-none'
                              : msg.sender === 'admin'
                              ? 'bg-[#bf1e2e] text-white rounded-tl-none'
                              : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                          <div
                            className={`text-[10px] mt-1 opacity-50 ${
                              msg.sender === 'user' ? 'text-right' : 'text-left'
                            }`}
                          >
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 rounded-tl-none flex gap-1">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#001b52]/20 focus:border-[#001b52]"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="w-10 h-10 bg-[#bf1e2e] text-white rounded-full flex items-center justify-center hover:bg-[#a01927] transition-colors disabled:opacity-50 flex-shrink-0"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#bf1e2e] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
}
