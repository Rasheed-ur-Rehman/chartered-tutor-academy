import React from "react";
import { motion } from "motion/react";
import { Users, Target, ShieldCheck, Heart, Award, Globe } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-primary py-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              About <span className="text-brand-secondary">Haier Tutor</span>
            </h1>
            <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
              We are dedicated to bridging the gap between students and expert educators, providing personalized learning experiences that inspire success.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary rounded-full blur-[120px] opacity-10 -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-[120px] opacity-5 -ml-20 -mb-20" />
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100"
            >
              <div className="bg-brand-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-brand-primary" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed">
                To provide every student with access to high-quality, personalized education that caters to their unique learning style and pace. We believe that with the right guidance, every student can reach their full potential.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100"
            >
              <div className="bg-brand-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-brand-secondary" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed">
                To become the world's most trusted platform for educational empowerment, fostering a global community of lifelong learners and passionate educators who work together to shape a brighter future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">The principles that guide everything we do at Haier Tutor.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Integrity", desc: "We maintain the highest standards of honesty and transparency in all our interactions." },
              { icon: Heart, title: "Passion", desc: "We are deeply committed to education and the success of our students and tutors." },
              { icon: Award, title: "Excellence", desc: "We strive for the highest quality in our tutoring services and platform experience." },
              { icon: Users, title: "Community", desc: "We foster a supportive environment where everyone can learn and grow together." },
            ].map((value, i) => (
              <div key={i} className="text-center p-8 rounded-3xl hover:bg-slate-50 transition-colors">
                <div className="bg-slate-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-7 w-7 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-primary rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2">
              <div className="p-12 md:p-20 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                <div className="space-y-6 text-slate-300 leading-relaxed">
                  <p>
                    Founded in 2024, Haier Tutor started with a simple observation: many students struggle to find the right help at the right time. We saw a need for a platform that not only connects people but ensures quality and compatibility.
                  </p>
                  <p>
                    What began as a small network of local tutors has quickly grown into a comprehensive platform serving thousands of students across multiple cities. Our commitment to excellence remains unchanged.
                  </p>
                  <p>
                    Today, we continue to innovate, adding new subjects, curriculums, and features to make learning more accessible and effective for everyone, everywhere.
                  </p>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <img 
                  src="https://picsum.photos/seed/education/800/1000" 
                  alt="Education" 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
