'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, BookOpen, GraduationCap, Users, Clock, Star, CheckCircle2, X } from 'lucide-react';
import { Tutor } from '@/lib/db';

export default function HomePage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    subject: '',
    grade: '',
    city: '',
    type: ''
  });
  const [advice, setAdvice] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Tutor[]>([]);

  const fetchTutors = useCallback(async () => {
    try {
      const res = await fetch('/api/tutors');
      const data = await res.json();
      const approved = data.filter((t: Tutor) => t.status === 'approved');
      setTutors(approved);
      setFilteredTutors(approved);
    } catch (error) {
      console.error('Error fetching tutors:', error);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => fetchTutors(), 0);
  }, [fetchTutors]);

  const handleSearch = () => {
    let filtered = tutors.filter(tutor => {
      const matchName = tutor.fullName.toLowerCase().includes(searchFilters.name.toLowerCase());
      const matchSubject = searchFilters.subject === '' || tutor.subject.toLowerCase().includes(searchFilters.subject.toLowerCase());
      const matchCity = tutor.city.toLowerCase().includes(searchFilters.city.toLowerCase());
      const matchType = searchFilters.type === '' || tutor.tuitionType.includes(searchFilters.type);
      
      return matchName && matchSubject && matchCity && matchType;
    });
    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Section 1: Hero Banner */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <Image
          src="https://picsum.photos/seed/student/1920/1080"
          alt="Happy student learning"
          fill
          className="object-cover brightness-50"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6">
              Find Your <span className="text-[#bf1e2e]">Perfect</span> Tutor Today.
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed">
              Personalized learning for every student. Unlock your potential with our expert educators.
            </p>
            <Link
              href="/register-student"
              className="inline-block bg-[#bf1e2e] text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-[#a01927] transition-all transform hover:scale-105 shadow-xl shadow-red-900/20"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Search/Filter Bar */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 -mt-32 relative z-10 border border-slate-100">
            <h2 className="text-2xl font-bold text-[#001b52] mb-8 flex items-center gap-3">
              <Search className="text-[#bf1e2e]" />
              Browse Available Tutors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  placeholder="Tutor Name"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                  value={searchFilters.name}
                  onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                <select
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                  value={searchFilters.subject}
                  onChange={(e) => setSearchFilters({ ...searchFilters, subject: e.target.value })}
                >
                  <option value="">All Subjects</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</label>
                <select
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                  value={searchFilters.grade}
                  onChange={(e) => setSearchFilters({ ...searchFilters, grade: e.target.value })}
                >
                  <option value="">All Grades</option>
                  <option value="1-5">Grades 1-5</option>
                  <option value="6-8">Grades 6-8</option>
                  <option value="9-10">Grades 9-10</option>
                  <option value="A-Levels">A-Levels</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
                <input
                  type="text"
                  placeholder="City"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#001b52]/10 outline-none transition-all"
                  value={searchFilters.city}
                  onChange={(e) => setSearchFilters({ ...searchFilters, city: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full bg-[#001b52] text-white p-3 rounded-xl font-bold hover:bg-[#00143d] transition-all shadow-lg shadow-blue-900/10"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 items-center">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tuition Type:</span>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  value="Online"
                  className="w-4 h-4 text-[#bf1e2e] focus:ring-[#bf1e2e]"
                  onChange={(e) => setSearchFilters({ ...searchFilters, type: e.target.value })}
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-[#bf1e2e]">Online</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  value="Face to Face"
                  className="w-4 h-4 text-[#bf1e2e] focus:ring-[#bf1e2e]"
                  onChange={(e) => setSearchFilters({ ...searchFilters, type: e.target.value })}
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-[#bf1e2e]">Face to Face</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  value=""
                  defaultChecked
                  className="w-4 h-4 text-[#bf1e2e] focus:ring-[#bf1e2e]"
                  onChange={(e) => setSearchFilters({ ...searchFilters, type: e.target.value })}
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-[#bf1e2e]">Both</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#001b52] mb-4">Why Choose Chartered Tutor Academy?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We provide the best learning experience with a focus on quality and flexibility.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-slate-50 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-slate-100">
              <div className="relative h-48">
                <Image src="https://picsum.photos/seed/learn/600/400" alt="Personalized Learning" fill className="object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-[#bf1e2e]/10 rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen className="text-[#bf1e2e]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#001b52] mb-4">Personalized Learning</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Personalized tuition plays a vital role in a student&apos;s academic journey by providing tailored instruction that addresses individual learning needs.
                </p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-slate-100">
              <div className="relative h-48">
                <Image src="https://picsum.photos/seed/tutor/600/400" alt="Expert Tutors" fill className="object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-[#001b52]/10 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap className="text-[#001b52]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#001b52] mb-4">Expert Tutors</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our tutors are distinguished professionals and subject matter experts dedicated to fostering academic excellence and personal growth.
                </p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-slate-100">
              <div className="relative h-48">
                <Image src="https://picsum.photos/seed/flex/600/400" alt="Flexible Scheduling" fill className="object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="text-emerald-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#001b52] mb-4">Flexible Scheduling</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Learn at your own pace, at a time that suits you. We offer flexible hours to accommodate busy student schedules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Reviews */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#001b52] mb-4">What Our Students Say</h2>
            <p className="text-slate-500">Real feedback from students and parents who have experienced our tuition.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 italic mb-6 leading-relaxed">
                  &quot;The tutor provided by Chartered Tutor Academy was exceptional. My son&apos;s grades improved significantly within just two months. Highly recommended!&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                    <Image src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" width={48} height={48} referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#001b52]">Parent {i}</h4>
                    <p className="text-xs text-slate-500">Lahore, Pakistan</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: FAQs */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#001b52] mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500">Find answers to common questions about our services.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "How do I find a tutor?", a: "Simply fill out the registration form on our website, and our team will match you with the best available tutor based on your requirements." },
              { q: "Do you offer online classes?", a: "Yes, we offer both online and face-to-face tuition options to provide maximum flexibility for our students." },
              { q: "Is there a free trial class?", a: "Absolutely! We offer a free trial class so you can experience the teaching style of our tutors before committing to regular sessions." },
              { q: "How are tutors selected?", a: "Our tutors undergo a rigorous selection process, including background checks and subject matter expertise evaluations." }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h4 className="font-bold text-[#001b52] mb-2">{faq.q}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Featured Tutors List */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#001b52] mb-2">Featured Tutors</h2>
              <p className="text-slate-500">Top-rated educators ready to help you succeed.</p>
            </div>
            <Link href="/register-student" className="text-[#bf1e2e] font-bold hover:underline flex items-center gap-2">
              View All Tutors <Users size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredTutors.map((tutor) => (
              <motion.div
                key={tutor.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100"
              >
                <div className="relative h-48">
                  <Image
                    src={tutor.profilePicture || `https://picsum.photos/seed/${tutor.id}/400/400`}
                    alt={tutor.fullName}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      tutor.availability === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {tutor.availability}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#001b52] mb-1">{tutor.fullName}</h3>
                  <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
                    <BookOpen size={14} className="text-[#bf1e2e]" />
                    {tutor.subject} • {tutor.experience}
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin size={14} />
                      {tutor.city}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      {tutor.tuitionType.join(' / ')}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <button className="text-xs font-bold text-[#001b52] hover:text-[#bf1e2e] transition-colors">
                      Show Number
                    </button>
                    <Link
                      href="/register-student"
                      className="bg-[#bf1e2e] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#a01927] transition-colors"
                    >
                      Request
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTutors.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No tutors found matching your search criteria.</p>
              <button onClick={() => setFilteredTutors(tutors)} className="text-[#bf1e2e] font-bold mt-2 hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Search Results Modal */}
      <AnimatePresence>
        {showSearchResults && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[80vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#001b52] text-white">
                <div>
                  <h3 className="text-xl font-bold">Search Results</h3>
                  <p className="text-white/70 text-sm">Found {searchResults.length} tutors matching your criteria</p>
                </div>
                <button 
                  onClick={() => setShowSearchResults(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {searchResults.map((tutor) => (
                      <div key={tutor.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 shadow-sm">
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={tutor.profilePicture || `https://picsum.photos/seed/${tutor.id}/400/400`}
                            alt={tutor.fullName}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#001b52]">{tutor.fullName}</h4>
                          <p className="text-xs text-[#bf1e2e] font-medium mb-2">{tutor.subject}</p>
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <MapPin size={10} /> {tutor.city}
                            </p>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Clock size={10} /> {tutor.experience}
                            </p>
                          </div>
                          <Link 
                            href="/register-student" 
                            className="mt-3 inline-block text-[10px] font-bold text-white bg-[#bf1e2e] px-3 py-1.5 rounded-lg hover:bg-[#a01927] transition-colors"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">No tutors found matching your search.</p>
                    <button 
                      onClick={() => setShowSearchResults(false)}
                      className="text-[#bf1e2e] font-bold mt-2 hover:underline"
                    >
                      Try different filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
