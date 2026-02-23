import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, MapPin, BookOpen, GraduationCap, Briefcase, Upload, CheckCircle2, Send, Star, ShieldCheck, Zap } from "lucide-react";

export default function BecomeTutor() {
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "Male",
    age: "",
    contact_number: "",
    email: "",
    country: "",
    city: "",
    qualification: "",
    experience: "",
    tuition_type: "Online",
    subject: "",
  });

  const [curriculumSuggestion, setCurriculumSuggestion] = useState({
    name: "",
    description: "",
    subjects: "",
    grades: "",
  });

  const [showCurrForm, setShowCurrForm] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value as string);
    });

    if (files) {
      for (let i = 0; i < files.length; i++) {
        data.append("documents", files[i]);
      }
    }

    try {
      // Register Tutor
      const response = await fetch("/api/tutors", {
        method: "POST",
        body: data,
      });

      // If curriculum suggested, submit it too
      if (showCurrForm && curriculumSuggestion.name) {
        await fetch("/api/curriculums", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...curriculumSuggestion,
            subjects: curriculumSuggestion.subjects.split(",").map(s => s.trim()),
            suggested_by: formData.full_name
          }),
        });
      }

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
            Become a <span className="text-brand-secondary">Tutor</span>
          </motion.h1>
          <p className="text-slate-600 text-lg">Join our community of expert educators and start making a difference today.</p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Registration Successful!</h2>
              <p className="text-slate-600 text-lg mb-8">
                Thank you for registering as a tutor. Our team will review your application and documents. We will contact you shortly for the next steps.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-brand-primary text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-colors"
              >
                REGISTER ANOTHER PROFILE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
              {/* Personal Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <User className="h-5 w-5 text-brand-secondary" />
                  Personal Details
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Age</label>
                    <input
                      required
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
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

              {/* Professional Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Briefcase className="h-5 w-5 text-brand-secondary" />
                  Professional Information
                </h3>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Qualification</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Masters in Mathematics"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Teaching Experience</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your teaching experience and methodology..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Interested Subject</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        required
                        type="text"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Interested Tuition Type</label>
                    <div className="flex gap-6 h-[50px] items-center">
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
              </div>

              {/* Curriculum Suggestion */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-brand-secondary" />
                    Curriculum Suggestion
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowCurrForm(!showCurrForm)}
                    className="text-xs font-bold text-brand-secondary hover:underline"
                  >
                    {showCurrForm ? "Cancel Suggestion" : "+ Add New Curriculum"}
                  </button>
                </div>
                
                {showCurrForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100"
                  >
                    <p className="text-xs text-slate-500 mb-4 italic">Suggest a new curriculum to be added to our platform. Admin will review and approve it.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Curriculum Name (e.g. French Baccalaureate)"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                        value={curriculumSuggestion.name}
                        onChange={(e) => setCurriculumSuggestion({...curriculumSuggestion, name: e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="Grades (e.g. Grade 1-12)"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                        value={curriculumSuggestion.grades}
                        onChange={(e) => setCurriculumSuggestion({...curriculumSuggestion, grades: e.target.value})}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Subjects (comma separated)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                      value={curriculumSuggestion.subjects}
                      onChange={(e) => setCurriculumSuggestion({...curriculumSuggestion, subjects: e.target.value})}
                    />
                    <textarea
                      placeholder="Brief Description"
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm resize-none"
                      value={curriculumSuggestion.description}
                      onChange={(e) => setCurriculumSuggestion({...curriculumSuggestion, description: e.target.value})}
                    />
                  </motion.div>
                )}
              </div>

              {/* Document Upload */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Upload className="h-5 w-5 text-brand-secondary" />
                  Document Verification
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 italic">Please upload a copy of your ID card and all qualification documents (PDF or Images).</p>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-brand-secondary transition-colors group cursor-pointer relative">
                    <input
                      required
                      type="file"
                      multiple
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setFiles(e.target.files)}
                    />
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-100 transition-colors">
                      <Upload className="h-8 w-8 text-slate-400 group-hover:text-brand-primary transition-colors" />
                    </div>
                    <p className="text-slate-600 font-medium">Click or drag files to upload</p>
                    <p className="text-slate-400 text-xs mt-1">ID Card, Degree Certificates, etc.</p>
                    {files && files.length > 0 && (
                      <div className="mt-4 p-3 bg-slate-100 rounded-lg text-brand-primary text-sm font-semibold">
                        {files.length} file(s) selected
                      </div>
                    )}
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
                    SUBMIT REGISTRATION
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
              <Star className="h-7 w-7 text-brand-secondary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Top Earnings</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Our tutors earn competitive rates and have the flexibility to set their own mutually agreed fees with students.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center">
            <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="h-7 w-7 text-brand-secondary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Platform</h3>
            <p className="text-slate-500 text-sm leading-relaxed">We provide a secure environment for both tutors and students, ensuring privacy and professional conduct at all times.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center">
            <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="h-7 w-7 text-brand-secondary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Alerts</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Get notified instantly about new tuition requests in your area or for your subjects through our automated alert system.</p>
          </div>
        </div>

        <div className="bg-brand-primary rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-brand-primary/20">
          <h2 className="text-3xl font-bold mb-6">Join the Elite Tutor Network</h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            We are looking for passionate educators who want to make a real impact on students' lives. Apply now and start your journey with us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-xl border border-white/20">
              <CheckCircle2 className="h-5 w-5 text-brand-secondary" />
              <span className="font-semibold">Flexible Hours</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-xl border border-white/20">
              <CheckCircle2 className="h-5 w-5 text-brand-secondary" />
              <span className="font-semibold">Global Reach</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-xl border border-white/20">
              <CheckCircle2 className="h-5 w-5 text-brand-secondary" />
              <span className="font-semibold">Professional Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
