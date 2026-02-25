'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Send, MessageSquare, Mail, User, Clock, CheckCircle2, Trash2 } from 'lucide-react';
import { ChatMessage } from '@/lib/db';
import { motion, AnimatePresence } from 'motion/react';
import { io, Socket } from 'socket.io-client';

export default function ChatMessagesPage() {
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io();
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const fetchChats = useCallback(async () => {
    const res = await fetch('/api/chats');
    const data = await res.json();
    setChats(data);
  }, []);

  useEffect(() => {
    setTimeout(() => fetchChats(), 0);
  }, [fetchChats]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyText) return;

    setIsSending(true);
    try {
      await fetch('/api/chats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: replyingTo.id, adminReply: replyText }),
      });

      // Emit real-time reply
      socketRef.current?.emit('admin_reply', {
        userEmail: replyingTo.userEmail,
        reply: replyText
      });

      // Mock Email Notification
      console.log(`[EMAIL SENT] To: ${replyingTo.userEmail}`);
      console.log(`Subject: New message from Chartered Tutor Academy`);
      console.log(`Body: Hello ${replyingTo.userName}, the admin has replied to your query: "${replyText}". View your chat history here: ${window.location.origin}/?chat=open`);

      setReplyText('');
      setReplyingTo(null);
      fetchChats();
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await fetch(`/api/chats?id=${id}`, { method: 'DELETE' });
      fetchChats();
    }
  };

  const filteredChats = chats.filter(c => 
    c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.userMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Chat Messages</h1>
          <p className="text-slate-500">Respond to user inquiries from the chat widget.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search messages..."
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#001b52]/10 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Chat List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredChats.map((chat) => (
            <motion.div
              layout
              key={chat.id}
              className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all ${
                replyingTo?.id === chat.id ? 'ring-2 ring-[#001b52]' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#001b52] font-bold">
                      {chat.userName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{chat.userName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail size={12} /> {chat.userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 justify-end">
                      <Clock size={10} /> {new Date(chat.timestamp).toLocaleString()}
                    </p>
                    {chat.adminReply && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
                        <CheckCircle2 size={10} /> Replied
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(chat.id)}
                      className="ml-3 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Message"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                  <p className="text-sm text-slate-700 leading-relaxed italic">&quot;{chat.userMessage}&quot;</p>
                </div>

                {chat.adminReply && (
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4">
                    <p className="text-xs font-bold text-[#001b52] uppercase tracking-wider mb-2">Admin Reply:</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{chat.adminReply}</p>
                  </div>
                )}

                {!chat.adminReply && (
                  <button
                    onClick={() => setReplyingTo(chat)}
                    className="text-sm font-bold text-[#bf1e2e] hover:underline flex items-center gap-2"
                  >
                    <MessageSquare size={16} /> Reply to this message
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {filteredChats.length === 0 && (
            <div className="p-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
              No chat messages found.
            </div>
          )}
        </div>

        {/* Reply Form */}
        <div className="h-fit sticky top-24">
          <AnimatePresence mode="wait">
            {replyingTo ? (
              <motion.div
                key="reply-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
              >
                <h2 className="font-bold text-slate-800 mb-2">Send Reply</h2>
                <p className="text-xs text-slate-500 mb-6">Replying to <span className="font-bold text-[#001b52]">{replyingTo.userName}</span></p>
                
                <form onSubmit={handleReply} className="space-y-4">
                  <textarea
                    required
                    placeholder="Type your response here..."
                    rows={6}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none text-sm resize-none"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isSending}
                      type="submit"
                      className="flex-[2] bg-[#001b52] text-white py-3 rounded-xl font-bold hover:bg-[#00143d] transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                      {isSending ? 'Sending...' : (
                        <>
                          Send Reply
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="no-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-100 p-8 rounded-3xl border border-dashed border-slate-300 text-center"
              >
                <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-sm text-slate-500 font-medium">Select a message to reply</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
