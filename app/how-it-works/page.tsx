'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ClipboardList, CalendarCheck, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Header Section */}
      <section className="bg-[#001b52] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="https://picsum.photos/seed/pattern/1920/1080" alt="Pattern" fill className="object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-display mb-6"
          >
            How <span className="text-[#bf1e2e]">CHARTERED TUTOR ACADEMY</span> Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto"
          >
            Start your learning journey in three simple steps.
          </motion.p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group"
            >
              <div className="absolute -top-6 left-8 w-14 h-14 bg-[#bf1e2e] text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-red-900/20">
                1
              </div>
              <div className="mt-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <ClipboardList className="text-[#001b52]" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#001b52] mb-4">Tell Us Your Requirement</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Choose the curriculum and subject you need help with. Provide details about your grade, location, and preferred tuition type (Online or Face to Face).
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group"
            >
              <div className="absolute -top-6 left-8 w-14 h-14 bg-[#001b52] text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-900/20">
                2
              </div>
              <div className="mt-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <CalendarCheck className="text-[#bf1e2e]" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#001b52] mb-4">Take A Trial Class</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Choose a convenient time for your free trial class. This is the perfect opportunity to meet your potential tutor and experience their teaching style.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group"
            >
              <div className="absolute -top-6 left-8 w-14 h-14 bg-[#bf1e2e] text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-red-900/20">
                3
              </div>
              <div className="mt-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <GraduationCap className="text-[#001b52]" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#001b52] mb-4">Learn With The Best Tutors</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                After selection of satisfied tutor, start your regular classes. Our team will monitor your progress and ensure you receive the best possible support.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image src="https://picsum.photos/seed/learning/800/1000" alt="Personalized Learning" fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-[#001b52] mb-6 flex items-center gap-3">
                  <CheckCircle2 className="text-[#bf1e2e]" />
                  Personalized Learning
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Personalized tuition plays a vital role in a student&apos;s academic journey by providing tailored instruction that addresses individual learning needs. Unlike traditional classroom settings, where a single teaching method is applied to a diverse group, personalized tuition allows tutors to adapt their approach based on the student&apos;s strengths, weaknesses, and learning style. This targeted support helps clarify complex concepts, reinforces foundational knowledge, and builds the student&apos;s confidence.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#001b52] mb-6 flex items-center gap-3">
                  <CheckCircle2 className="text-[#bf1e2e]" />
                  Expert Tutors
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Our tutors are distinguished professionals and subject matter experts dedicated to fostering academic excellence and personal growth. Each tutor undergoes a rigorous selection process, ensuring they possess not only deep knowledge in their respective fields but also the pedagogical skills necessary to inspire and engage students. With a commitment to continuous improvement, our tutors stay abreast of the latest educational trends and methodologies, providing students with the highest quality of instruction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Section 1: Quality Assurance */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#001b52] rounded-[3rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Commitment to Quality</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                We maintain high standards by regularly monitoring student progress and gathering feedback from parents. Our quality assurance team ensures that every session meets our educational benchmarks.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#bf1e2e] rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Regular Progress Reports</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#bf1e2e] rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Parent-Tutor Meetings</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#bf1e2e] rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Curriculum Alignment</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 relative h-80 w-full rounded-2xl overflow-hidden">
              <Image src="https://picsum.photos/seed/quality/800/600" alt="Quality Assurance" fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      {/* Additional Section 2: Global Reach */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#001b52] mb-6">Global Learning Community</h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-16">
            Connecting students with world-class educators across borders. Our online platform brings the best tutors directly to your screen, no matter where you are.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-8 bg-white rounded-3xl shadow-sm">
              <div className="text-4xl font-bold text-[#bf1e2e] mb-2">500+</div>
              <div className="text-slate-500 font-medium">Expert Tutors</div>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-sm">
              <div className="text-4xl font-bold text-[#bf1e2e] mb-2">2000+</div>
              <div className="text-slate-500 font-medium">Happy Students</div>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-sm">
              <div className="text-4xl font-bold text-[#bf1e2e] mb-2">50+</div>
              <div className="text-slate-500 font-medium">Subjects</div>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-sm">
              <div className="text-4xl font-bold text-[#bf1e2e] mb-2">10+</div>
              <div className="text-slate-500 font-medium">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-[#001b52] rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#bf1e2e] rounded-full -mr-32 -mt-32 opacity-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#bf1e2e] rounded-full -ml-32 -mb-32 opacity-20 blur-3xl" />
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 relative z-10">Ready to find your tutor?</h2>
            <Link
              href="/register-student"
              className="inline-flex items-center gap-3 bg-[#bf1e2e] text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-[#a01927] transition-all transform hover:scale-105 shadow-xl relative z-10"
            >
              Register as a Student
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
