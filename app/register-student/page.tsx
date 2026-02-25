'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { User, Mail, Phone, MapPin, Globe, BookOpen, GraduationCap, Send, CheckCircle2 } from 'lucide-react';

export default function StudentRegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    contact: '',
    email: '',
    country: '',
    city: '',
    tuitionType: '',
    grade: '',
    subject: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-emerald-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-[#001b52] mb-4">Application Received!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for registering with CHARTERED TUTOR ACADEMY. Our team will review your requirements and contact you shortly to arrange a trial class.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full bg-[#001b52] text-white py-4 rounded-xl font-bold hover:bg-[#00143d] transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#001b52] mb-4 font-display">Find Your CHARTERED TUTOR ACADEMY</h1>
          <p className="text-slate-500">Fill out the form below and we&apos;ll match you with the perfect tutor.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100"
        >
          <div className="bg-[#001b52] p-8 text-white">
            <h2 className="text-xl font-bold">Student Registration Form</h2>
            <p className="text-white/70 text-sm">All fields marked with * are required</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User size={16} className="text-[#bf1e2e]" />
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User size={16} className="text-[#bf1e2e]" />
                  Gender *
                </label>
                <div className="flex gap-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      required
                      type="radio"
                      name="gender"
                      value="Male"
                      className="w-4 h-4 text-[#bf1e2e] focus:ring-[#bf1e2e]"
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                    />
                    <span className="text-sm font-medium text-slate-600">Male</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      required
                      type="radio"
                      name="gender"
                      value="Female"
                      className="w-4 h-4 text-[#bf1e2e] focus:ring-[#bf1e2e]"
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                    />
                    <span className="text-sm font-medium text-slate-600">Female</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Phone size={16} className="text-[#bf1e2e]" />
                  Contact Number *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="e.g. +92 300 1234567"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Mail size={16} className="text-[#bf1e2e]" />
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="example@email.com"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Globe size={16} className="text-[#bf1e2e]" />
                  Country
                </label>
                <input
                  type="text"
                  placeholder="Enter your country"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin size={16} className="text-[#bf1e2e]" />
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter your city"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            {/* Tuition Requirements */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <BookOpen size={16} className="text-[#bf1e2e]" />
                  Interested Tuition Type *
                </label>
                <div className="flex gap-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      required
                      type="radio"
                      name="tuitionType"
                      value="Online"
                      className="w-4 h-4 text-[#bf1e2e] focus:ring-[#bf1e2e]"
                      onChange={(e) => setFormData({ ...formData, tuitionType: e.target.value as 'Online' | 'Face to Face' })}
                    />
                    <span className="text-sm font-medium text-slate-600">Online</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      required
                      type="radio"
                      name="tuitionType"
                      value="Face to Face"
                      className="w-4 h-4 text-[#bf1e2e] focus:ring-[#bf1e2e]"
                      onChange={(e) => setFormData({ ...formData, tuitionType: e.target.value as 'Online' | 'Face to Face' })}
                    />
                    <span className="text-sm font-medium text-slate-600">Face to Face</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <GraduationCap size={16} className="text-[#bf1e2e]" />
                    Grade *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Grade 10, A-Levels"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <BookOpen size={16} className="text-[#bf1e2e]" />
                    Subject *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Mathematics, Physics"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-[#bf1e2e] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#a01927] transition-all transform hover:scale-[1.02] shadow-xl shadow-red-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : (
                <>
                  Submit Application
                  <Send size={20} />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Additional Section 1: Testimonials */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-[#001b52] mb-8 text-center">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-slate-600 italic mb-4">&quot;The registration process was so smooth. Within 24 hours, I had a trial class scheduled with a fantastic math tutor.&quot;</p>
              <p className="font-bold text-[#001b52]">- Sarah K., Grade 10 Student</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-slate-600 italic mb-4">&quot;Chartered Tutor Academy matched my daughter with a tutor who perfectly understands her learning style. Her confidence has soared!&quot;</p>
              <p className="font-bold text-[#001b52]">- Mr. Ahmed, Parent</p>
            </div>
          </div>
        </div>

        {/* Additional Section 2: Why Register? */}
        <div className="mt-20 bg-[#001b52] rounded-[2.5rem] p-10 md:p-16 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Register with Us?</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#bf1e2e] rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Access to 500+ Certified Tutors</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#bf1e2e] rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Free Trial Class for Every Subject</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#bf1e2e] rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Flexible Online & Home Tuition</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#bf1e2e] rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Personalized Learning Plans</span>
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <Image src="https://picsum.photos/seed/register/600/400" alt="Register" fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
