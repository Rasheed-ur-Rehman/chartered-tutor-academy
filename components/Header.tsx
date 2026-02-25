'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const LOGO_URL = 'https://ripkenfoundation.org/wp-content/uploads/2026/02/WhatsApp_Image_2026-02-22_at_11.31.01_PM-removebg-preview-1.png';

const navItems = [
  { name: 'HOME', path: '/' },
  { name: 'HOW IT WORKS', path: '/how-it-works' },
  { name: 'CURRICULUM', path: '/curriculum' },
  { name: 'CHARTERED TUTOR ACADEMY', path: '/register-student' },
  { name: 'BECOME A TUTOR', path: '/register-tutor' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src={LOGO_URL}
              alt="CHARTERED TUTOR ACADEMY Logo"
              width={180}
              height={60}
              className="h-14 w-auto object-contain"
              priority
              referrerPolicy="no-referrer"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-bold tracking-wider transition-colors hover:text-[#bf1e2e] ${
                  pathname === item.path ? 'text-[#bf1e2e]' : 'text-[#001b52]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#001b52] hover:text-[#bf1e2e] transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-2"
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-3 text-base font-bold tracking-wider rounded-md ${
                pathname === item.path
                  ? 'bg-slate-50 text-[#bf1e2e]'
                  : 'text-[#001b52] hover:bg-slate-50 hover:text-[#bf1e2e]'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </motion.div>
      )}
    </header>
  );
}
