'use client';

import { useState, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { User, Mail, Phone, MapPin, Globe, BookOpen, GraduationCap, Send, CheckCircle2, FileUp, Briefcase, Calendar } from 'lucide-react';

export default function TutorRegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    age: '',
    contact: '',
    email: '',
    country: '',
    city: '',
    qualification: '',
    experience: '',
    tuitionType: [] as string[],
    subject: '',
    profilePicture: '',
    idCardFile: '',
    qualificationFile: ''
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'idCardFile' | 'qualificationFile') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, [field]: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePicPreview(base64String);
        setFormData(prev => ({ ...prev, profilePicture: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      tuitionType: prev.tuitionType.includes(type)
        ? prev.tuitionType.filter(t => t !== type)
        : [...prev.tuitionType, type]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.tuitionType.length === 0) {
      alert('Please select at least one tuition type.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
        }),
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
          <h2 className="text-3xl font-bold text-[#001b52] mb-4">Application Submitted!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for your interest in joining CHARTERED TUTOR ACADEMY. Our recruitment team will review your qualifications and documents. We will contact you via email for the next steps.
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
          <h1 className="text-4xl font-bold text-[#001b52] mb-4 font-display">Join Our Team as a Tutor</h1>
          <p className="text-slate-500">Share your expertise and help students achieve their academic goals.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100"
        >
          <div className="bg-[#bf1e2e] p-8 text-white">
            <h2 className="text-xl font-bold">Tutor Application Form</h2>
            <p className="text-white/70 text-sm">Please submit a copy of your ID card and all qualification documents.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            {/* Profile Picture Upload */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User size={16} className="text-[#bf1e2e]" />
                Profile Picture *
              </label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                  {profilePicPreview ? (
                    <Image src={profilePicPreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <User size={32} className="text-slate-300" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleProfilePicChange}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FileUp size={20} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Upload a professional photo</p>
                  <p className="text-xs text-slate-500 mt-1">This will be displayed on your public profile. JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
            </div>

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
                  <Calendar size={16} className="text-[#bf1e2e]" />
                  Age *
                </label>
                <input
                  required
                  type="number"
                  placeholder="Your age"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
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

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin size={16} className="text-[#bf1e2e]" />
                  City *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Enter your city"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <GraduationCap size={16} className="text-[#bf1e2e]" />
                  Your Qualification *
                </label>
                <textarea
                  required
                  placeholder="List your degrees and certifications"
                  rows={3}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Briefcase size={16} className="text-[#bf1e2e]" />
                    Teaching Experience *
                  </label>
                  <select
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  >
                    <option value="">Select Experience</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="2-5 years">2-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <BookOpen size={16} className="text-[#bf1e2e]" />
                    Interested Subject *
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

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Globe size={16} className="text-[#bf1e2e]" />
                  Interested Tuition Type *
                </label>
                <div className="flex gap-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#bf1e2e] rounded focus:ring-[#bf1e2e]"
                      onChange={() => handleCheckboxChange('Online')}
                    />
                    <span className="text-sm font-medium text-slate-600">Online</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#bf1e2e] rounded focus:ring-[#bf1e2e]"
                      onChange={() => handleCheckboxChange('Face to Face')}
                    />
                    <span className="text-sm font-medium text-slate-600">Face to Face</span>
                  </label>
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileUp size={16} className="text-[#bf1e2e]" />
                  ID Card Copy *
                </label>
                <div className="relative group">
                  <input
                    required
                    type="file"
                    accept="image/*,application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => handleFileChange(e, 'idCardFile')}
                  />
                  <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-center group-hover:border-[#bf1e2e] transition-all">
                    <FileUp className="mx-auto text-slate-400 mb-2 group-hover:text-[#bf1e2e]" size={24} />
                    <span className="text-xs text-slate-500 font-medium">
                      {formData.idCardFile ? 'File Uploaded ✓' : 'Click to upload or drag & drop'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileUp size={16} className="text-[#bf1e2e]" />
                  Qualification Documents *
                </label>
                <div className="relative group">
                  <input
                    required
                    type="file"
                    accept="image/*,application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => handleFileChange(e, 'qualificationFile')}
                  />
                  <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-center group-hover:border-[#bf1e2e] transition-all">
                    <FileUp className="mx-auto text-slate-400 mb-2 group-hover:text-[#bf1e2e]" size={24} />
                    <span className="text-xs text-slate-500 font-medium">
                      {formData.qualificationFile ? 'File Uploaded ✓' : 'Click to upload or drag & drop'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-[#001b52] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#00143d] transition-all transform hover:scale-[1.02] shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
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

        {/* Additional Section 1: Tutor Benefits */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-[#001b52] mb-8 text-center">Benefits of Joining Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
              <div className="w-12 h-12 bg-[#bf1e2e]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-[#bf1e2e]" size={24} />
              </div>
              <h4 className="font-bold text-[#001b52] mb-2">Competitive Pay</h4>
              <p className="text-slate-500 text-sm">Earn what you deserve with our transparent and competitive hourly rates.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
              <div className="w-12 h-12 bg-[#001b52]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-[#001b52]" size={24} />
              </div>
              <h4 className="font-bold text-[#001b52] mb-2">Flexible Hours</h4>
              <p className="text-slate-500 text-sm">Choose your own schedule and work as many or as few hours as you like.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="text-emerald-600" size={24} />
              </div>
              <h4 className="font-bold text-[#001b52] mb-2">Professional Growth</h4>
              <p className="text-slate-500 text-sm">Access training materials and grow your teaching career with us.</p>
            </div>
          </div>
        </div>

        {/* Additional Section 2: Recruitment Process */}
        <div className="mt-20 bg-[#001b52] rounded-[2.5rem] p-10 md:p-16 text-white text-center">
          <h2 className="text-3xl font-bold mb-12">Our Recruitment Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              { title: "Apply", desc: "Submit your application form and documents." },
              { title: "Screening", desc: "Our team reviews your qualifications." },
              { title: "Interview", desc: "A short online interview to assess skills." },
              { title: "Onboarding", desc: "Start teaching and earning!" }
            ].map((step, i) => (
              <div key={i} className="relative z-10">
                <div className="w-12 h-12 bg-[#bf1e2e] rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  {i + 1}
                </div>
                <h4 className="font-bold mb-2">{step.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
