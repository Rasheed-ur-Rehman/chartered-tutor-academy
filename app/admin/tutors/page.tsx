'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Edit, Trash2, Check, X, Mail, Phone, MapPin, BookOpen, GraduationCap, FileText, Download, Eye, User, Calendar, Briefcase } from 'lucide-react';
import { Tutor, Status } from '@/lib/db';
import { motion, AnimatePresence } from 'motion/react';

export default function TutorApplicationsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [viewingTutor, setViewingTutor] = useState<Tutor | null>(null);

  const fetchTutors = useCallback(async () => {
    const res = await fetch('/api/tutors');
    const data = await res.json();
    setTutors(data);
  }, []);

  useEffect(() => {
    setTimeout(() => fetchTutors(), 0);
  }, [fetchTutors]);

  const handleStatusUpdate = async (id: string, status: Status) => {
    await fetch('/api/tutors', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchTutors();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      await fetch(`/api/tutors?id=${id}`, { method: 'DELETE' });
      fetchTutors();
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTutor) return;

    await fetch('/api/tutors', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingTutor),
    });
    setEditingTutor(null);
    fetchTutors();
  };

  const handleDownload = (base64Data: string | undefined, fileName: string) => {
    if (!base64Data) {
      alert('No document available for this tutor.');
      return;
    }
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const filteredTutors = tutors.filter(t => 
    t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tutor Applications</h1>
          <p className="text-slate-500">Review and manage tutor recruitment.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tutors..."
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#001b52]/10 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tutor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Qualification</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTutors.map((tutor) => (
                <tr key={tutor.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-[#001b52] font-bold text-xs">
                        {tutor.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{tutor.fullName}</p>
                        <p className="text-xs text-slate-500">{tutor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-600 line-clamp-1 max-w-[200px]">{tutor.qualification}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-slate-700">{tutor.experience}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-700">{tutor.subject}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      tutor.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      tutor.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {tutor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setViewingTutor(tutor)}
                        className="p-2 text-slate-500 hover:text-[#001b52] hover:bg-slate-100 rounded-lg transition-colors" 
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDownload(tutor.idCardFile, `ID_Card_${tutor.fullName.replace(/\s+/g, '_')}.png`)}
                        className="p-2 text-slate-500 hover:text-[#001b52] hover:bg-slate-100 rounded-lg transition-colors" 
                        title="Download ID Card"
                      >
                        <FileText size={18} />
                      </button>
                      <button 
                        onClick={() => handleDownload(tutor.qualificationFile, `Qualification_${tutor.fullName.replace(/\s+/g, '_')}.png`)}
                        className="p-2 text-slate-500 hover:text-[#001b52] hover:bg-slate-100 rounded-lg transition-colors" 
                        title="Download Qualifications"
                      >
                        <Download size={18} />
                      </button>
                      {tutor.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(tutor.id, 'approved')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(tutor.id, 'rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setEditingTutor(tutor)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(tutor.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTutors.length === 0 && (
          <div className="p-20 text-center text-slate-400">
            No tutor applications found.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingTutor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="bg-[#001b52] p-6 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">Edit Tutor Details</h2>
                <button onClick={() => setEditingTutor(null)} className="text-white/70 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none"
                      value={editingTutor.fullName}
                      onChange={(e) => setEditingTutor({ ...editingTutor, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                    <input
                      type="email"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none"
                      value={editingTutor.email}
                      onChange={(e) => setEditingTutor({ ...editingTutor, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none"
                      value={editingTutor.subject}
                      onChange={(e) => setEditingTutor({ ...editingTutor, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Experience</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none"
                      value={editingTutor.experience}
                      onChange={(e) => setEditingTutor({ ...editingTutor, experience: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                    <select
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none"
                      value={editingTutor.status}
                      onChange={(e) => setEditingTutor({ ...editingTutor, status: e.target.value as Status })}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Availability</label>
                    <select
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none"
                      value={editingTutor.availability}
                      onChange={(e) => setEditingTutor({ ...editingTutor, availability: e.target.value as 'Open' | 'Closed' })}
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingTutor(null)}
                    className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#001b52] text-white rounded-xl font-bold hover:bg-[#00143d] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewingTutor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="bg-[#001b52] p-6 text-white flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-bold">
                    {viewingTutor.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{viewingTutor.fullName}</h2>
                    <p className="text-white/70 text-sm">Tutor Application Details</p>
                  </div>
                </div>
                <button onClick={() => setViewingTutor(null)} className="text-white/70 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#bf1e2e] uppercase tracking-wider">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Mail size={16} className="text-slate-400" />
                        <span className="text-sm">{viewingTutor.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Phone size={16} className="text-slate-400" />
                        <span className="text-sm">{viewingTutor.contact}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <User size={16} className="text-slate-400" />
                        <span className="text-sm">{viewingTutor.gender}, {viewingTutor.age} years old</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <MapPin size={16} className="text-slate-400" />
                        <span className="text-sm">{viewingTutor.city}, {viewingTutor.country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#bf1e2e] uppercase tracking-wider">Professional Info</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <GraduationCap size={16} className="text-slate-400" />
                        <span className="text-sm font-medium">{viewingTutor.qualification}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Briefcase size={16} className="text-slate-400" />
                        <span className="text-sm">{viewingTutor.experience} experience</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <BookOpen size={16} className="text-slate-400" />
                        <span className="text-sm font-bold text-[#001b52]">{viewingTutor.subject}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Calendar size={16} className="text-slate-400" />
                        <span className="text-sm">Teaching: {viewingTutor.tuitionType.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#bf1e2e] uppercase tracking-wider">Attached Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">ID Card / Passport</p>
                          <p className="text-[10px] text-slate-400 uppercase">Document Copy</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDownload(viewingTutor.idCardFile, `ID_${viewingTutor.fullName}.png`)}
                        className="p-2 text-[#001b52] hover:bg-[#001b52]/5 rounded-lg transition-colors"
                      >
                        <Download size={20} />
                      </button>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                          <GraduationCap size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">Academic Qualification</p>
                          <p className="text-[10px] text-slate-400 uppercase">Certificate Copy</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDownload(viewingTutor.qualificationFile, `Qualification_${viewingTutor.fullName}.png`)}
                        className="p-2 text-[#001b52] hover:bg-[#001b52]/5 rounded-lg transition-colors"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="p-6 bg-[#001b52]/5 rounded-3xl border border-[#001b52]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Current Application Status</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                        viewingTutor.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        viewingTutor.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {viewingTutor.status}
                      </span>
                      <span className="text-xs text-slate-400">Applied on {new Date(viewingTutor.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {viewingTutor.status !== 'approved' && (
                      <button 
                        onClick={() => { handleStatusUpdate(viewingTutor.id, 'approved'); setViewingTutor(null); }}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {viewingTutor.status !== 'rejected' && (
                      <button 
                        onClick={() => { handleStatusUpdate(viewingTutor.id, 'rejected'); setViewingTutor(null); }}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
