import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Mail, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

type Message = {
  sender: "user" | "ai" | "admin";
  message: string;
  created_at?: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"info" | "chat">("info");
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substring(2, 15);
    setChatId(id);
    setStep("chat");
    
    try {
      await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user_name: userInfo.name, user_email: userInfo.email }),
      });
      
      // Initial greeting
      const greeting: Message = { sender: "ai", message: `Hi ${userInfo.name}! How can I help you today?` };
      setMessages([greeting]);
      await saveMessage(id, "ai", greeting.message);
    } catch (error) {
      console.error(error);
    }
  };

  const saveMessage = async (id: string, sender: string, message: string) => {
    await fetch(`/api/chats/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, message }),
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatId) return;

    const userMsg: Message = { sender: "user", message: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      await saveMessage(chatId, "user", userMsg.message);

      // AI Auto-reply
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ parts: [{ text: `You are a helpful assistant for "Haier Tutor", a tutoring platform. A user named ${userInfo.name} asked: ${input}. Provide a short, helpful response.` }] }],
      });

      const aiMsg: Message = { sender: "ai", message: response.text || "I'm sorry, I couldn't process that." };
      setMessages(prev => [...prev, aiMsg]);
      await saveMessage(chatId, "ai", aiMsg.message);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-[350px] sm:w-[400px] overflow-hidden flex flex-col mb-4"
            style={{ height: "500px" }}
          >
            {/* Header */}
            <div className="bg-brand-primary p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Haier Tutor Support</h3>
                  <p className="text-[10px] text-slate-300">Online | AI Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-hidden flex flex-col">
              {step === "info" ? (
                <div className="p-8 flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-brand-primary" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Welcome to Support</h4>
                  <p className="text-xs text-slate-500 mb-6">Please introduce yourself to start the conversation.</p>
                  
                  <form onSubmit={handleStartChat} className="w-full space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        required
                        type="text"
                        placeholder="Your Name"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                        value={userInfo.name}
                        onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        required
                        type="email"
                        placeholder="Your Email"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                        value={userInfo.email}
                        onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20"
                    >
                      START CHAT
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            msg.sender === "user"
                              ? "bg-brand-primary text-white rounded-tr-none"
                              : msg.sender === "admin"
                              ? "bg-brand-secondary text-white rounded-tl-none"
                              : "bg-white text-slate-700 border border-slate-200 rounded-tl-none"
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 rounded-tl-none">
                          <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-grow px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="bg-brand-primary text-white p-2 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all active:scale-95 group"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6 group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
}
