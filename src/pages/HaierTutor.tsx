import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, CheckCircle2, User, Mail, Phone, MapPin, BookOpen, GraduationCap, Search, Users, Clock } from "lucide-react";

export default function HaierTutor() {
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "Male",
    contact_number: "",
    email: "",
    country: "",
    city: "",
    tuition_type: "Online",
    grade: "",
    subject: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/student-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-slate-900 mb-4"
          >
            Hire a <span className="text-brand-secondary">Professional Tutor</span>
          </motion.h1>
          <p className="text-slate-600 text-lg">Tell us your requirements and we'll find the perfect match for you.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-20"
        >
          {submitted ? (
            <div className="p-12 text-center">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-brand-primary" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Submitted!</h2>
              <p className="text-slate-600 text-lg mb-8">
                Thank you for choosing Haier Tutor. Our educational consultants will review your request and contact you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-brand-primary text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-colors"
              >
                SUBMIT ANOTHER REQUEST
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
              {/* Personal Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <User className="h-5 w-5 text-brand-secondary" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Gender</label>
                    <div className="flex gap-4 h-[50px] items-center">
                      {["Male", "Female"].map((g) => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            className="w-4 h-4 text-brand-primary border-slate-300 focus:ring-brand-primary"
                            checked={formData.gender === g}
                            onChange={() => setFormData({ ...formData, gender: g })}
                          />
                          <span className="text-sm text-slate-700">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        required
                        type="tel"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                        value={formData.contact_number}
                        onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        required
                        type="email"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Type */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <MapPin className="h-5 w-5 text-brand-secondary" />
                  Location & Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Country</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">City</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Interested Tuition Type</label>
                  <div className="flex gap-8">
                    {["Online", "Face-to-Face"].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tuition_type"
                          className="w-4 h-4 text-brand-primary border-slate-300 focus:ring-brand-primary"
                          checked={formData.tuition_type === type}
                          onChange={() => setFormData({ ...formData, tuition_type: type })}
                        />
                        <span className="text-sm text-slate-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Academic Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <GraduationCap className="h-5 w-5 text-brand-secondary" />
                  Academic Requirements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Grade / Level</label>
                    <select
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all bg-white"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    >
                      <option value="">Select Grade</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={`Grade ${i + 1}`}>Grade {i + 1}</option>
                      ))}
                      <option value="College">College</option>
                      <option value="University">University</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Interested Subject</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        required
                        type="text"
                        placeholder="e.g. Physics, Chemistry..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-brand-primary hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    SUBMIT REQUEST
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Extra Sections */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center">
            <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="h-7 w-7 text-brand-secondary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Vetted Tutors</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Every tutor on our platform undergoes a rigorous background check and qualification verification process.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center">
            <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-7 w-7 text-brand-secondary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Personalized Match</h3>
            <p className="text-slate-500 text-sm leading-relaxed">We don't just give you a list; we manually match you with the tutor who best fits your learning style and goals.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center">
            <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="h-7 w-7 text-brand-secondary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Quick Response</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Our dedicated support team works around the clock to ensure you get a response within 24 hours of your request.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-10 md:p-16 border border-slate-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose Our Platform?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-brand-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Quality Assurance</h4>
                  <p className="text-slate-500 text-sm">We monitor the first few sessions to ensure the tutor meets our high standards of excellence.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-brand-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Flexible Scheduling</h4>
                  <p className="text-slate-500 text-sm">Find tutors who can work around your busy schedule, including weekends and evenings.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-brand-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Affordable Rates</h4>
                  <p className="text-slate-500 text-sm">We offer a wide range of tutors with varying price points to fit every budget.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-brand-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Trial Session</h4>
                  <p className="text-slate-500 text-sm">Most of our tutors offer a free or discounted first trial session to ensure compatibility.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
