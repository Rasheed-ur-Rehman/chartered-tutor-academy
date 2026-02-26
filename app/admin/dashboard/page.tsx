'use client';

import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, GraduationCap, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    students: 0,
    tutors: 0,
    pendingStudents: 0,
    pendingTutors: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, tutorsRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/tutors')
        ]);
        
        const students = await studentsRes.json();
        const tutors = await tutorsRes.json();
        
        setStats({
          students: students.length,
          tutors: tutors.length,
          pendingStudents: students.filter((s: any) => s.status === 'pending').length,
          pendingTutors: tutors.filter((t: any) => t.status === 'pending').length,
          messages: 0 // You can add chat messages later
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Students',
      value: stats.students,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/students'
    },
    {
      title: 'Total Tutors',
      value: stats.tutors,
      icon: GraduationCap,
      color: 'bg-green-500',
      link: '/admin/tutors'
    },
    {
      title: 'Pending Students',
      value: stats.pendingStudents,
      icon: Clock,
      color: 'bg-yellow-500',
      link: '/admin/students'
    },
    {
      title: 'Pending Tutors',
      value: stats.pendingTutors,
      icon: TrendingUp,
      color: 'bg-purple-500',
      link: '/admin/tutors'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001b52] mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Welcome to the admin dashboard. Here's an overview of your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              href={stat.link}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                  <Icon size={24} />
                </div>
                <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">{stat.title}</h3>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/students"
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Users size={20} className="text-[#001b52]" />
              <span className="text-sm font-medium text-slate-700">View Student Requests</span>
            </Link>
            <Link
              href="/admin/tutors"
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <GraduationCap size={20} className="text-[#001b52]" />
              <span className="text-sm font-medium text-slate-700">Review Tutor Applications</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <LayoutDashboard size={20} className="text-[#001b52]" />
              <span className="text-sm font-medium text-slate-700">Update System Settings</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Database Connection</span>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">API Status</span>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Last Updated</span>
              <span className="text-xs font-medium text-slate-600">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}