import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, CheckCircle2, Users, BookOpen, Star, ArrowRight, Book, Pencil, GraduationCap, Brain } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    full_name: "",
    subject: "",
    grade: "",
    city: "",
    tuition_type: "Online",
    contact_number: "",
    status: "Open",
    extra_notes: "",
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
        setFormData({
          full_name: "",
          subject: "",
          grade: "",
          city: "",
          tuition_type: "Online",
          contact_number: "",
          status: "Open",
          extra_notes: "",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="bg-brand-primary py-12 lg:py-32 overflow-hidden relative">
        {/* Animated Background Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          {[
            { Icon: Book, top: "10%", left: "5%", size: 40, delay: 0 },
            { Icon: Pencil, top: "20%", left: "85%", size: 30, delay: 1 },
            { Icon: GraduationCap, top: "70%", left: "10%", size: 50, delay: 2 },
            { Icon: Brain, top: "80%", left: "80%", size: 45, delay: 1.5 },
            { Icon: BookOpen, top: "40%", left: "50%", size: 35, delay: 0.5 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 0, rotate: 0 }}
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut"
              }}
              className="absolute"
              style={{ top: item.top, left: item.left }}
            >
              <item.Icon size={item.size} className="text-white" />
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                Find the Perfect <span className="text-brand-secondary">Tutor</span> for Your Success
              </h1>
              <p className="text-slate-300 text-lg sm:text-xl mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Connect with expert tutors for personalized learning. Whether online or face-to-face, we have the right match for your educational journey.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white text-xs sm:text-sm border border-white/20">
                  <CheckCircle2 className="h-4 w-4 text-brand-secondary" />
                  <span>Verified Tutors</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white text-xs sm:text-sm border border-white/20">
                  <CheckCircle2 className="h-4 w-4 text-brand-secondary" />
                  <span>Free Trial Class</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white text-xs sm:text-sm border border-white/20">
                  <CheckCircle2 className="h-4 w-4 text-brand-secondary" />
                  <span>All Subjects</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 w-full max-w-lg mx-auto"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Post Your Requirement</h2>
                <p className="text-slate-500 text-sm">Tell us what you need and we'll find the best tutor for you.</p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center"
                >
                  <div className="bg-brand-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-brand-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Thank you!</h3>
                  <p className="text-slate-600 mb-6">Your tuition requirement has been submitted. Our team will contact you shortly.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-brand-secondary font-semibold hover:underline"
                  >
                    Submit another requirement
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Mathematics"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</label>
                      <select
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all bg-white"
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
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. New York"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tuition Type</label>
                    <div className="flex gap-6">
                      {["Online", "Face-to-Face"].map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="tuition_type"
                            className="w-4 h-4 text-brand-primary border-slate-300 focus:ring-brand-primary"
                            checked={formData.tuition_type === type}
                            onChange={() => setFormData({ ...formData, tuition_type: type })}
                          />
                          <span className="text-sm font-medium text-slate-700 group-hover:text-brand-secondary transition-colors">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Number</label>
                      <input
                        required
                        type="tel"
                        placeholder="e.g. +1 234 567 890"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                        value={formData.contact_number}
                        onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tuition Status</label>
                      <div className="flex items-center gap-3 h-[50px]">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, status: formData.status === "Open" ? "Close" : "Open" })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            formData.status === "Open" ? "bg-brand-secondary" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              formData.status === "Open" ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="text-sm font-medium text-slate-700">{formData.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Additional Advice / Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Any specific requirements or timing preferences..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all resize-none"
                      value={formData.extra_notes}
                      onChange={(e) => setFormData({ ...formData, extra_notes: e.target.value })}
                    />
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
                        <Search className="h-5 w-5" />
                        SUBMIT REQUIREMENT
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-brand-secondary rounded-full blur-3xl opacity-10" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-brand-primary rounded-full blur-3xl opacity-20" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Tutors", value: "5,000+", icon: Users },
              { label: "Subjects Covered", value: "100+", icon: BookOpen },
              { label: "Happy Students", value: "20,000+", icon: Star },
              { label: "Cities", value: "50+", icon: Search },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="h-6 w-6 text-brand-primary" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Get started in three simple steps and find your ideal learning partner.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Post Requirement", desc: "Fill out our simple form with your subject, grade, and location preferences.", step: "01" },
              { title: "Get Matches", desc: "Our system matches you with the best available tutors based on your needs.", step: "02" },
              { title: "Start Learning", desc: "Connect with your tutor, have a trial session, and begin your educational journey.", step: "03" },
            ].map((item, i) => (
              <div key={i} className="relative bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                <div className="text-6xl font-black text-slate-50 absolute -top-6 -left-2 z-0 select-none">{item.step}</div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Subjects Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Popular Subjects</h2>
              <p className="text-slate-600">Explore our most requested subjects and find expert tutors.</p>
            </div>
            <button className="text-brand-primary font-bold hover:underline flex items-center gap-2">
              View All Subjects <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "Economics", "Accounting"].map((subject, i) => (
              <div key={i} className="group cursor-pointer bg-slate-50 hover:bg-brand-primary p-6 rounded-2xl transition-all duration-300 border border-slate-100">
                <div className="text-lg font-bold text-slate-900 group-hover:text-white transition-colors">{subject}</div>
                <div className="text-xs text-slate-500 group-hover:text-slate-200 mt-1">200+ Tutors Available</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-slate-400">Real stories from real students who achieved their goals with us.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", role: "Grade 12 Student", text: "The math tutor I found here helped me improve my grades from a C to an A in just three months. Highly recommended!" },
              { name: "David Chen", role: "University Student", text: "Excellent platform. The interface is easy to use and the quality of tutors is top-notch. Found a great Physics tutor." },
              { name: "Emily Rodriguez", role: "Parent", text: "As a parent, I was worried about finding a safe and reliable tutor for my daughter. This platform made it so easy and secure." },
            ].map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-brand-secondary text-brand-secondary" />)}
                </div>
                <p className="text-slate-300 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-xs text-brand-secondary uppercase font-bold tracking-wider">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Become a Tutor CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-secondary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-brand-secondary/20">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Are You an Expert Educator?</h2>
              <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">Join our network of elite tutors and start sharing your knowledge with students around the world. Set your own rates and schedule.</p>
              <a href="/become-a-tutor" className="inline-flex items-center gap-2 bg-white text-brand-secondary font-black px-10 py-4 rounded-2xl hover:bg-slate-50 transition-all shadow-xl">
                BECOME A TUTOR <ArrowRight className="h-5 w-5" />
              </a>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/20 rounded-full -ml-20 -mb-20 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
