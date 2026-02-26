'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  MessageSquare, 
  LogOut, 
  ShieldCheck,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth', 'true');
        router.refresh(); // Refresh to update any server components
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
    router.push('/admin');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-slate-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#001b52] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[#001b52]">Admin Portal</h1>
            <p className="text-slate-500 text-sm">Please enter your password to continue</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 text-sm border border-red-100">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#001b52] text-white py-4 rounded-xl font-bold hover:bg-[#00143d] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard Home', path: '/admin', icon: LayoutDashboard },
    { name: 'Student Requests', path: '/admin/students', icon: Users },
    { name: 'Tutor Applications', path: '/admin/tutors', icon: GraduationCap },
    { name: 'Manage Curriculum', path: '/admin/curriculum', icon: BookOpen },
    { name: 'Chat Messages', path: '/admin/chats', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - same as before */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#001b52] text-white transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive ? 'bg-[#bf1e2e] text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}
                  `}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-600">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Welcome, Admin</span>
            <div className="w-8 h-8 bg-[#bf1e2e] rounded-full flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}