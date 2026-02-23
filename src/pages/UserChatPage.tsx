import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageCircle, Send, ArrowLeft, Loader2, User, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

type Message = {
  sender: "user" | "ai" | "admin";
  message: string;
  created_at: string;
};

export default function UserChatPage() {
  const { id } = useParams();
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 5000); // Poll for new messages
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChat = async () => {
    try {
      const res = await fetch(`/api/chats/${id}`);
      const data = await res.json();
      setChat(data.chat);
      setMessages(data.messages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !id) return;

    setSending(true);
    try {
      await fetch(`/api/chats/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message: input }),
      });
      setInput("");
      fetchChat();
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-md">
          <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Chat Not Found</h2>
          <p className="text-slate-500 mb-6">The chat session you're looking for doesn't exist or has expired.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-brand-primary font-bold hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Chat with Support</h1>
              <p className="text-xs text-slate-500">Session ID: {id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full text-emerald-700 text-xs font-bold border border-emerald-100">
            <ShieldCheck className="h-3.5 w-3.5" />
            SECURE CHANNEL
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-grow max-w-4xl w-full mx-auto p-4 flex flex-col">
        <div 
          ref={scrollRef}
          className="flex-grow bg-white rounded-3xl shadow-sm border border-slate-200 overflow-y-auto p-6 space-y-6 mb-4"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <div className="text-center py-4">
            <div className="bg-slate-50 inline-block px-4 py-2 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Conversation Started • {new Date(chat.created_at).toLocaleDateString()}
            </div>
          </div>

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div className={`p-4 rounded-2xl text-sm ${
                  msg.sender === "user" 
                    ? "bg-brand-primary text-white rounded-tr-none" 
                    : msg.sender === "admin"
                    ? "bg-brand-secondary text-white rounded-tl-none"
                    : "bg-slate-100 text-slate-700 rounded-tl-none"
                }`}>
                  {msg.message}
                </div>
                <div className={`text-[10px] text-slate-400 font-medium ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                  {msg.sender === "admin" ? "Support Agent" : msg.sender === "ai" ? "AI Assistant" : "You"} • {new Date(msg.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="bg-white p-4 rounded-3xl shadow-lg border border-slate-200 flex gap-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow px-6 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="bg-brand-primary text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-brand-primary/20"
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            SEND
          </button>
        </form>
      </main>
    </div>
  );
}
