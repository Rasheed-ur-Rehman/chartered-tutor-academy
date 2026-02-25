'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, GraduationCap, Clock, MessageSquare, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Student, Tutor, ChatMessage } from '@/lib/db';

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTutors: 0,
    pendingApprovals: 0,
    recentMessages: 0
  });
  const [recentChats, setRecentChats] = useState<ChatMessage[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [studentsRes, tutorsRes, chatsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/tutors'),
        fetch('/api/chats')
      ]);

      const students: Student[] = await studentsRes.json();
      const tutors: Tutor[] = await tutorsRes.json();
      const chats: ChatMessage[] = await chatsRes.json();

      const pendingStudents = students.filter(s => s.status === 'pending').length;
      const pendingTutors = tutors.filter(t => t.status === 'pending').length;

      setStats({
        totalStudents: students.length,
        totalTutors: tutors.length,
        pendingApprovals: pendingStudents + pendingTutors,
        recentMessages: chats.length
      });

      setRecentChats(chats.slice(-5).reverse());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => fetchData(), 0);
  }, [fetchData]);

  const statCards = [
    { name: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-blue-500' },
    { name: 'Total Tutors', value: stats.totalTutors, icon: GraduationCap, color: 'bg-indigo-500' },
    { name: 'Pending Approvals', value: stats.pendingApprovals, icon: Clock, color: 'bg-amber-500' },
    { name: 'Recent Messages', value: stats.recentMessages, icon: MessageSquare, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
              <div className={`${stat.color} p-4 rounded-2xl text-white`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Messages */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Recent Messages</h2>
            <TrendingUp className="text-slate-400" size={20} />
          </div>
          <div className="divide-y divide-slate-50">
            {recentChats.length > 0 ? recentChats.map((chat) => (
              <div key={chat.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#001b52] font-bold text-xs uppercase">
                      {chat.userName.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{chat.userName}</h4>
                      <p className="text-xs text-slate-500">{chat.userEmail}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{new Date(chat.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 ml-13">{chat.userMessage}</p>
              </div>
            )) : (
              <div className="p-10 text-center text-slate-400">
                No recent messages
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Status */}
        <div className="space-y-6">
          <div className="bg-[#001b52] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">System Status</h3>
              <p className="text-white/70 text-sm mb-6">All systems are operational and running smoothly.</p>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <CheckCircle2 size={18} />
                Operational
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6">Quick Links</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-medium text-slate-700 transition-colors">
                Generate Monthly Report
              </button>
              <button className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-medium text-slate-700 transition-colors">
                System Settings
              </button>
              <button className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-medium text-slate-700 transition-colors">
                User Management
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
