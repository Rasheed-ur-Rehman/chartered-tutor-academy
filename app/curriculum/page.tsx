'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface CurriculumItem {
  id: string;
  name: string;
}

export default function CurriculumPage() {
  const [curricula, setCurricula] = useState<CurriculumItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurricula = async () => {
      try {
        const res = await fetch('/api/curriculum');
        if (res.ok) {
          const data = await res.json();
          setCurricula(data);
        }
      } catch (error) {
        console.error('Error fetching curricula:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurricula();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50">
      {/* Header Section */}
      <section className="bg-[#001b52] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="https://picsum.photos/seed/curriculum/1920/1080" alt="Pattern" fill className="object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-display mb-6"
          >
            Our <span className="text-[#bf1e2e]">Curriculum</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto"
          >
            We offer a wide range of curricula to meet international standards and local requirements.
          </motion.p>
        </div>
      </section>

      {/* Curriculum List Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf1e2e]"></div>
            </div>
          ) : curricula.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {curricula.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#bf1e2e]/10 transition-colors">
                    <BookOpen className="text-[#001b52] group-hover:text-[#bf1e2e] transition-colors" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-[#001b52] mb-4">{item.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Comprehensive support for {item.name} students, covering all core subjects and specialized electives.
                  </p>
                  <div className="flex items-center gap-2 text-[#bf1e2e] font-bold text-sm">
                    <CheckCircle2 size={16} />
                    Expert Tutors Available
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <GraduationCap className="mx-auto text-slate-300 mb-4" size={64} />
              <h3 className="text-xl font-bold text-[#001b52] mb-2">No Curricula Listed Yet</h3>
              <p className="text-slate-500">Check back soon for our updated curriculum list.</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#001b52]">Tailored to Academic Standards</h2>
              <p className="text-slate-600 leading-relaxed">
                At Chartered Tutor Academy, we understand that every curriculum has its own unique set of challenges and requirements. Our tutors are specifically trained to handle the nuances of different educational systems, ensuring that students receive the most relevant and effective support.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#bf1e2e] rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-[#001b52]">Syllabus Coverage</h4>
                    <p className="text-sm text-slate-500">We ensure 100% coverage of the prescribed syllabus with a focus on key exam topics.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#001b52] rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-[#001b52]">Exam Preparation</h4>
                    <p className="text-sm text-slate-500">Intensive practice with past papers and exam-style questions to build confidence.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image src="https://picsum.photos/seed/books/800/600" alt="Books" fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
