'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, BookOpen, Search } from 'lucide-react';
import { Curriculum } from '@/lib/db';

export default function ManageCurriculumPage() {
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const fetchCurricula = useCallback(async () => {
    const res = await fetch('/api/curriculum');
    const data = await res.json();
    setCurricula(data);
  }, []);

  useEffect(() => {
    setTimeout(() => fetchCurricula(), 0);
  }, [fetchCurricula]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    setIsAdding(true);
    await fetch('/api/curriculum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    setNewName('');
    fetchCurricula();
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this curriculum?')) {
      await fetch(`/api/curriculum?id=${id}`, { method: 'DELETE' });
      fetchCurricula();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Curriculum</h1>
        <p className="text-slate-500">Add or remove curriculum options for registration forms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Add New */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
          <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Plus className="text-[#bf1e2e]" size={20} />
            Add New Curriculum
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Curriculum Name</label>
              <input
                type="text"
                placeholder="e.g. British Curriculum"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <button
              disabled={isAdding}
              type="submit"
              className="w-full bg-[#001b52] text-white py-3 rounded-xl font-bold hover:bg-[#00143d] transition-colors disabled:opacity-50"
            >
              {isAdding ? 'Adding...' : 'Add Curriculum'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h2 className="font-bold text-slate-800">Existing Curricula</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {curricula.map((item) => (
              <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#001b52]">
                    <BookOpen size={20} />
                  </div>
                  <span className="font-medium text-slate-700">{item.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {curricula.length === 0 && (
              <div className="p-20 text-center text-slate-400">
                No curricula added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
