import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BookOpen, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

type CurriculumType = {
  id?: number;
  name: string;
  description: string;
  subjects: string | string[];
  grades: string;
};

export default function Curriculum() {
  const [curriculums, setCurriculums] = useState<CurriculumType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurriculums();
  }, []);

  const fetchCurriculums = async () => {
    try {
      const res = await fetch("/api/curriculums");
      const data = await res.json();
      setCurriculums(data);
    } catch (error) {
      console.error("Failed to fetch curriculums", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6"
          >
            Our <span className="text-brand-primary">Curriculum</span>
          </motion.h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            We offer specialized tutoring for a wide range of international and national curriculums, ensuring every student gets the right support for their specific academic path.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-brand-primary animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading curriculums...</p>
          </div>
        ) : curriculums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {curriculums.map((curr, index) => (
              <motion.div
                key={curr.id || curr.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 hover:border-brand-primary/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-brand-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary transition-colors">
                    <BookOpen className="h-7 w-7 text-brand-primary group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">
                    {curr.grades}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-3">{curr.name}</h2>
                <p className="text-slate-500 mb-6 leading-relaxed">{curr.description}</p>
                
                <div className="space-y-3 mb-8">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Subjects:</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(curr.subjects) ? curr.subjects : curr.subjects.split(",")).map((sub) => (
                      <span key={sub} className="bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-100">
                        {sub.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to="/haier-tutor"
                  className="inline-flex items-center gap-2 text-brand-primary font-bold hover:gap-3 transition-all"
                >
                  Request a Tutor for this Curriculum
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <BookOpen className="h-16 w-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Curriculums Available</h3>
            <p className="text-slate-500">Please check back later or contact us for specific requirements.</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-slate-900 rounded-3xl p-10 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10"
        >
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-white mb-4">Don't see your curriculum?</h2>
            <p className="text-slate-400 text-lg">
              We cover many more subjects and specialized courses. Contact us to discuss your specific requirements.
            </p>
          </div>
          <Link
            to="/haier-tutor"
            className="bg-brand-primary text-white font-bold px-10 py-4 rounded-xl hover:opacity-90 transition-all shadow-xl shadow-brand-primary/20 whitespace-nowrap"
          >
            GET IN TOUCH
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
