import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#001b52] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Image 
                src="https://ripkenfoundation.org/wp-content/uploads/2026/02/WhatsApp_Image_2026-02-22_at_11.31.01_PM-removebg-preview-1.png" 
                alt="Logo" 
                width={40} 
                height={40} 
                className="object-contain"
                referrerPolicy="no-referrer"
              />
              <h3 className="text-xl font-bold text-[#bf1e2e]">CHARTERED TUTOR ACADEMY</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Empowering students through personalized learning and expert guidance. 
              Find your perfect tutor today and start your journey to success.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link href="/" className="hover:text-[#bf1e2e] transition-colors">Home</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#bf1e2e] transition-colors">How It Works</Link></li>
              <li><Link href="/register-student" className="hover:text-[#bf1e2e] transition-colors">Find a Tutor</Link></li>
              <li><Link href="/register-tutor" className="hover:text-[#bf1e2e] transition-colors">Become a Tutor</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#bf1e2e]" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#bf1e2e]" />
                <span>info@haiertutor.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-[#bf1e2e]" />
                <span>Lahore, Pakistan</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#bf1e2e] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#bf1e2e] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#bf1e2e] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#bf1e2e] transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} CHARTERED TUTOR ACADEMY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
