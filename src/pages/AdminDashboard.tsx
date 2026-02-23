import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  GraduationCap, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Download, 
  CheckCircle, 
  XCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  X,
  Edit2,
  Plus,
  LogOut,
  MessageSquare,
  Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Tutor = {
  id: number;
  full_name: string;
  gender: string;
  age: number;
  contact_number: string;
  email: string;
  country: string;
  city: string;
  qualification: string;
  experience: string;
  tuition_type: string;
  subject: string;
  documents: string;
  status: string;
  created_at: string;
};

type StudentRequest = {
  id: number;
  full_name: string;
  gender: string;
  contact_number: string;
  email: string;
  country: string;
  city: string;
  tuition_type: string;
  grade: string;
  subject: string;
  status: string;
  extra_notes: string;
  created_at: string;
};

type Curriculum = {
  id: number;
  name: string;
  description: string;
  subjects: string;
  grades: string;
  status: string;
  suggested_by: string;
};

type ChatSession = {
  id: number;
  user_name: string;
  user_email: string;
  status: string;
  created_at: string;
  last_message: string;
  last_message_at: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"tutors" | "requests" | "curriculums" | "chats">("tutors");
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showAddCurriculum, setShowAddCurriculum] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ id: number; type: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "tutors") {
        const res = await fetch("/api/admin/tutors");
        setTutors(await res.json());
      } else if (activeTab === "requests") {
        const res = await fetch("/api/admin/student-requests");
        setRequests(await res.json());
      } else if (activeTab === "curriculums") {
        const res = await fetch("/api/admin/curriculums");
        setCurriculums(await res.json());
      } else if (activeTab === "chats") {
        const res = await fetch("/api/admin/chat-sessions");
        setChatSessions(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const type = showDeleteConfirm?.type;
    try {
      const endpoint = type === "tutor" ? `/api/admin/tutors/${id}` : 
                       type === "request" ? `/api/admin/student-requests/${id}` : 
                       `/api/admin/curriculums/${id}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Open" ? "Close" : "Open";
    try {
      const res = await fetch(`/api/admin/student-requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  const handleCurriculumStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/curriculums/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleTutorStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/tutors/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const fetchChatMessages = async (sessionId: number) => {
    try {
      const res = await fetch(`/api/chat/session/${sessionId}/messages`);
      setChatMessages(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendChatReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedChat) return;

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedChat.id,
          sender: "Admin",
          message: chatInput.trim(),
        }),
      });
      if (res.ok) {
        setChatInput("");
        fetchChatMessages(selectedChat.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const maskContact = (num: string) => {
    if (!num) return "";
    return num.slice(0, -4) + "****";
  };

  const filteredTutors = tutors.filter(t => 
    t.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = requests.filter(r => 
    r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCurriculums = curriculums.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Manage your tutor network, student requirements, and curriculums.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-slate-600 hover:text-brand-secondary font-bold flex items-center gap-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            {[
              { id: "tutors", label: "Tutors", icon: Users },
              { id: "requests", label: "Requests", icon: GraduationCap },
              { id: "curriculums", label: "Curriculums", icon: BookOpen },
              { id: "chats", label: "Chats", icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, subject, or city..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">
            <Filter className="h-5 w-5" />
            Filters
          </button>
          {activeTab === "curriculums" && (
            <button 
              onClick={() => setShowAddCurriculum(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20"
            >
              <Plus className="h-5 w-5" />
              Add Curriculum
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              {activeTab === "tutors" && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tutor Info</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject & Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Qualification</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Docs</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTutors.map((tutor) => (
                      <tr key={tutor.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-bold">
                              {tutor.full_name[0]}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{tutor.full_name}</div>
                              <div className="text-xs text-slate-500">{tutor.gender}, {tutor.age} yrs</div>
                              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {tutor.contact_number}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-semibold text-slate-800">{tutor.subject}</div>
                          <div className="text-xs text-brand-secondary font-bold uppercase">{tutor.tuition_type}</div>
                          <div className="text-xs text-slate-400 mt-1">{tutor.experience} exp</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-slate-700">{tutor.city}</div>
                          <div className="text-xs text-slate-400">{tutor.country}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-slate-700 max-w-[200px] truncate">{tutor.qualification}</div>
                        </td>
                        <td className="px-6 py-5">
                          <button
                            onClick={() => handleTutorStatus(tutor.id, tutor.status === "Approved" ? "Pending" : "Approved")}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              tutor.status === "Approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {tutor.status || "Pending"}
                          </button>
                        </td>
                        <td className="px-6 py-5">
                          {tutor.documents && (
                            <button 
                              onClick={() => {
                                const docs = JSON.parse(tutor.documents);
                                docs.forEach((d: string) => window.open(`/${d}`, '_blank'));
                              }}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Download Documents"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setSelectedItem({ ...tutor, type: "tutor" })}
                              className="p-2 text-slate-400 hover:text-brand-primary transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => setEditingItem({ ...tutor, type: "tutor" })}
                              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                              title="Edit Details"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => setShowDeleteConfirm({ id: tutor.id, type: "tutor" })}
                              className="p-2 text-slate-400 hover:text-brand-secondary transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "requests" && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Info</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Requirement</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Notes</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-bold text-slate-900">{req.full_name}</div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {maskContact(req.contact_number)}
                          </div>
                          {req.email && (
                            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {req.email}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-semibold text-slate-800">{req.subject}</div>
                          <div className="text-xs text-slate-500">{req.grade}</div>
                          <div className="text-xs text-brand-secondary font-bold uppercase mt-1">{req.tuition_type}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-slate-700">{req.city}</div>
                          {req.country && <div className="text-xs text-slate-400">{req.country}</div>}
                        </td>
                        <td className="px-6 py-5">
                          <button
                            onClick={() => toggleStatus(req.id, req.status)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                              req.status === "Open" 
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {req.status === "Open" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {req.status}
                          </button>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-xs text-slate-500 max-w-[150px] truncate" title={req.extra_notes}>
                            {req.extra_notes || "No notes"}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setSelectedItem({ ...req, type: "request" })}
                              className="p-2 text-slate-400 hover:text-brand-primary transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => setShowDeleteConfirm({ id: req.id, type: "request" })}
                              className="p-2 text-slate-400 hover:text-brand-secondary transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "curriculums" && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Curriculum</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Suggested By</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredCurriculums.map((curr) => (
                      <tr key={curr.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{curr.name}</div>
                          <div className="text-xs text-slate-500 truncate max-w-xs">{curr.description}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{curr.suggested_by || "System"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            curr.status === "Approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {curr.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {curr.status === "Pending" && (
                              <button 
                                onClick={() => handleCurriculumStatus(curr.id, "Approved")}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                            )}
                            <button 
                              onClick={() => setSelectedItem({ ...curr, type: "curriculum" })}
                              className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => setEditingItem({ ...curr, type: "curriculum" })}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Curriculum"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => setShowDeleteConfirm({ id: curr.id, type: "curriculum" })}
                              className="p-2 text-slate-400 hover:text-brand-secondary hover:bg-brand-secondary/5 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "chats" && (
                <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
                  <div className="border-r border-slate-100 overflow-y-auto">
                    {chatSessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => {
                          setSelectedChat(session);
                          fetchChatMessages(session.id);
                        }}
                        className={`w-full p-4 text-left border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                          selectedChat?.id === session.id ? "bg-slate-50" : ""
                        }`}
                      >
                        <div className="font-bold text-slate-900">{session.user_name}</div>
                        <div className="text-xs text-slate-500 truncate">{session.user_email}</div>
                        <div className="text-xs text-slate-400 mt-2 truncate italic">
                          {session.last_message || "No messages yet"}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="md:col-span-2 flex flex-col bg-slate-50/30">
                    {selectedChat ? (
                      <>
                        <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-900">{selectedChat.user_name}</div>
                            <div className="text-xs text-slate-500">{selectedChat.user_email}</div>
                          </div>
                        </div>
                        <div className="flex-grow overflow-y-auto p-4 space-y-4">
                          {chatMessages.map((msg) => (
                            <div 
                              key={msg.id} 
                              className={`flex ${msg.sender === "Admin" ? "justify-end" : "justify-start"}`}
                            >
                              <div 
                                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                  msg.sender === "Admin" 
                                    ? "bg-brand-primary text-white rounded-tr-none" 
                                    : msg.sender === "Bot"
                                    ? "bg-slate-200 text-slate-700 rounded-tl-none"
                                    : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm"
                                }`}
                              >
                                <div className="text-[10px] opacity-70 mb-1">{msg.sender}</div>
                                {msg.message}
                              </div>
                            </div>
                          ))}
                        </div>
                        <form onSubmit={handleSendChatReply} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type your reply..."
                            className="flex-grow px-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                          />
                          <button 
                            type="submit"
                            className="bg-brand-primary text-white p-2 rounded-xl hover:opacity-90 transition-colors"
                          >
                            <Send size={18} />
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="flex-grow flex items-center justify-center text-slate-400">
                        Select a chat to start replying
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {((activeTab === "tutors" && filteredTutors.length === 0) || 
              (activeTab === "requests" && filteredRequests.length === 0) ||
              (activeTab === "curriculums" && filteredCurriculums.length === 0)) && (
              <div className="py-20 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No records found</h3>
                <p className="text-slate-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedItem.type === "tutor" ? "Tutor Profile" : 
                   selectedItem.type === "request" ? "Student Request Details" : 
                   "Curriculum Details"}
                </h3>
                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="h-6 w-6 text-slate-500" />
                </button>
              </div>
              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-8">
                  {selectedItem.type === "tutor" && (
                    <>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                        <p className="text-slate-900 font-medium">{selectedItem.full_name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</label>
                        <p className="text-slate-900 font-medium">{selectedItem.contact_number}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                        <p className="text-slate-900 font-medium">{selectedItem.email}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qualification</label>
                        <p className="text-slate-900 font-medium">{selectedItem.qualification}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience</label>
                        <p className="text-slate-900 font-medium leading-relaxed">{selectedItem.experience}</p>
                      </div>
                      {selectedItem.documents && (
                        <div className="col-span-2 pt-4">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Documents</label>
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              try {
                                const docs = JSON.parse(selectedItem.documents);
                                return docs.map((doc: string, i: number) => (
                                  <a
                                    key={i}
                                    href={`/${doc}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-brand-primary hover:text-white rounded-xl text-sm font-bold transition-all"
                                  >
                                    <Download className="h-4 w-4" />
                                    Document {i + 1}
                                  </a>
                                ));
                              } catch (e) {
                                return <p className="text-xs text-slate-400">No documents found or invalid format.</p>;
                              }
                            })()}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {selectedItem.type === "request" && (
                    <>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Name</label>
                        <p className="text-slate-900 font-medium">{selectedItem.full_name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</label>
                        <p className="text-slate-900 font-medium">{selectedItem.subject}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Grade</label>
                        <p className="text-slate-900 font-medium">{selectedItem.grade}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type</label>
                        <p className="text-slate-900 font-medium">{selectedItem.tuition_type}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</label>
                        <p className="text-slate-900 font-medium">{selectedItem.contact_number}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                        <p className="text-slate-900 font-medium">{selectedItem.email}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Extra Notes</label>
                        <p className="text-slate-900 font-medium leading-relaxed">{selectedItem.extra_notes || "No extra notes provided."}</p>
                      </div>
                    </>
                  )}
                  {selectedItem.type === "curriculum" && (
                    <>
                      <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</label>
                        <p className="text-slate-900 font-bold text-xl">{selectedItem.name}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                        <p className="text-slate-900 font-medium leading-relaxed">{selectedItem.description}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subjects</label>
                        <p className="text-slate-900 font-medium">{selectedItem.subjects}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Grades</label>
                        <p className="text-slate-900 font-medium">{selectedItem.grades}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested By</label>
                        <p className="text-slate-900 font-medium">{selectedItem.suggested_by || "System"}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingItem(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-xl font-bold text-slate-900">Edit {editingItem.type === "tutor" ? "Tutor" : "Curriculum"}</h3>
                <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="h-6 w-6 text-slate-500" />
                </button>
              </div>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const endpoint = editingItem.type === "tutor" ? `/api/admin/tutors/${editingItem.id}` : `/api/admin/curriculums/${editingItem.id}`;
                  const res = await fetch(endpoint, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editingItem),
                  });
                  if (res.ok) {
                    fetchData();
                    setEditingItem(null);
                  }
                }}
                className="p-8 max-h-[70vh] overflow-y-auto space-y-6"
              >
                {editingItem.type === "tutor" ? (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                      <input 
                        className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200"
                        value={editingItem.full_name}
                        onChange={(e) => setEditingItem({...editingItem, full_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Contact</label>
                      <input 
                        className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200"
                        value={editingItem.contact_number}
                        onChange={(e) => setEditingItem({...editingItem, contact_number: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                      <input 
                        className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200"
                        value={editingItem.email}
                        onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Qualification</label>
                      <input 
                        className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200"
                        value={editingItem.qualification}
                        onChange={(e) => setEditingItem({...editingItem, qualification: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Experience</label>
                      <textarea 
                        rows={3}
                        className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 resize-none"
                        value={editingItem.experience}
                        onChange={(e) => setEditingItem({...editingItem, experience: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Name</label>
                      <input 
                        className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                      <textarea 
                        rows={3}
                        className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 resize-none"
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                      <select 
                        className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200"
                        value={editingItem.status}
                        onChange={(e) => setEditingItem({...editingItem, status: e.target.value})}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">CANCEL</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:opacity-90 transition-colors">SAVE CHANGES</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Curriculum Modal */}
      <AnimatePresence>
        {showAddCurriculum && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddCurriculum(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-xl font-bold text-slate-900">Add New Curriculum</h3>
                <button onClick={() => setShowAddCurriculum(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="h-6 w-6 text-slate-500" />
                </button>
              </div>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = {
                    name: formData.get("name"),
                    description: formData.get("description"),
                    subjects: (formData.get("subjects") as string).split(",").map(s => s.trim()),
                    grades: formData.get("grades"),
                    status: "Approved"
                  };
                  const res = await fetch("/api/curriculums", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  });
                  if (res.ok) {
                    fetchData();
                    setShowAddCurriculum(false);
                  }
                }}
                className="p-8 space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Name</label>
                    <input name="name" required className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200" placeholder="e.g. British Curriculum" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                    <textarea name="description" required rows={3} className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 resize-none" placeholder="Brief overview..." />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Subjects (comma separated)</label>
                    <input name="subjects" required className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200" placeholder="Math, Science, English..." />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Grades</label>
                    <input name="grades" required className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200" placeholder="Grade 1-12" />
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setShowAddCurriculum(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">CANCEL</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:opacity-90 transition-colors">ADD CURRICULUM</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center"
            >
              <div className="bg-brand-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="h-10 w-10 text-brand-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Confirm Delete</h3>
              <p className="text-slate-500 mb-8">Are you sure you want to delete this {showDeleteConfirm.type}? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm.id)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20 hover:opacity-90 transition-colors"
                >
                  DELETE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
