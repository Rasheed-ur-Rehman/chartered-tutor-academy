import { motion } from "motion/react";
import { UserCheck, MessageSquare, Calendar, Award, BookOpen } from "lucide-react";

const sections = [
  {
    title: "Personalized Learning",
    description: "We believe every student is unique. Our tutors tailor lessons to individual learning styles, building confidence and ensuring steady progress through personalized attention.",
    icon: UserCheck,
    color: "bg-brand-primary",
  },
  {
    title: "Expert Tutors",
    description: "Our rigorous screening process ensures only the most qualified and experienced educators join our platform. We verify qualifications, experience, and teaching methodology.",
    icon: Award,
    color: "bg-brand-secondary",
  },
  {
    title: "Tell Us Your Requirement",
    description: "Simply fill out our requirement form. Specify your curriculum, subject, grade, and preferred tuition type (Online or Face-to-Face).",
    icon: MessageSquare,
    color: "bg-brand-primary",
  },
  {
    title: "Take a Trial Class",
    description: "Book a free two-day demo class to experience our teaching quality. Each session is 45 minutes, giving you a clear idea of the tutor's style.",
    icon: Calendar,
    color: "bg-brand-secondary",
  },
  {
    title: "Learn With the Best",
    description: "Once satisfied, finalize the schedule and fees mutually with the tutor. Start your journey towards academic excellence with the best in the field.",
    icon: BookOpen,
    color: "bg-brand-primary",
  },
];

export default function HowItWorks() {
  return (
    <div className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6"
          >
            How It <span className="text-brand-primary">Works</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            Our simple 5-step process ensures you find the perfect tutor and start learning without any hassle.
          </motion.p>
        </div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <div className={`w-16 h-16 ${section.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-200`}>
                  <section.icon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{section.title}</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {section.description}
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-video bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative group">
                  <img
                    src={`https://picsum.photos/seed/${section.title}/800/450`}
                    alt={section.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white font-bold text-xl">
                    Step 0{index + 1}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 bg-brand-primary rounded-3xl p-12 text-center text-white shadow-2xl shadow-brand-primary/20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
          <p className="text-slate-200 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of students who have improved their grades and confidence with Haier Tutor.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-brand-primary font-bold px-8 py-4 rounded-xl hover:bg-slate-50 transition-colors">
              FIND A TUTOR NOW
            </button>
            <button className="bg-brand-secondary text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-colors border border-white/20">
              BECOME A TUTOR
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
