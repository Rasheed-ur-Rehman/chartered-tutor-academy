import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://ripkenfoundation.org/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-22-at-11.31.01-PM.webp" 
                alt="Haier Tutor Logo" 
                className="h-10 w-auto object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </Link>
            <p className="text-slate-400 leading-relaxed">
              Empowering students through personalized learning experiences with the best tutors across the country.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-brand-secondary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-brand-secondary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-brand-secondary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-brand-secondary transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="hover:text-brand-secondary transition-colors">Home</Link></li>
              <li><Link to="/about-us" className="hover:text-brand-secondary transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-brand-secondary transition-colors">How It Works</Link></li>
              <li><Link to="/become-a-tutor" className="hover:text-brand-secondary transition-colors">Become a Tutor</Link></li>
              <li><Link to="/curriculum" className="hover:text-brand-secondary transition-colors">Curriculum</Link></li>
              <li><Link to="/admin" className="hover:text-brand-secondary transition-colors opacity-50">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Our Services</h3>
            <ul className="space-y-4">
              <li><Link to="/haier-tutor" className="hover:text-brand-secondary transition-colors">Find a Tutor</Link></li>
              <li><a href="#" className="hover:text-brand-secondary transition-colors">Online Classes</a></li>
              <li><a href="#" className="hover:text-brand-secondary transition-colors">Home Tuition</a></li>
              <li><a href="#" className="hover:text-brand-secondary transition-colors">Trial Classes</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-secondary shrink-0" />
                <span>123 Education Lane, Learning City, 54000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-secondary shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-secondary shrink-0" />
                <span>info@haiertutor.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Haier Tutor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
