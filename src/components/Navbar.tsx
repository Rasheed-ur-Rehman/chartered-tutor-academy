import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { name: "HOME", path: "/" },
  { name: "ABOUT US", path: "/about-us" },
  { name: "HOW IT WORKS", path: "/how-it-works" },
  { name: "HAIER TUTOR", path: "/haier-tutor" },
  { name: "BECOME A TUTOR", path: "/become-a-tutor" },
  { name: "CURRICULUM", path: "/curriculum" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="https://ripkenfoundation.org/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-22-at-11.31.01-PM.webp" 
                alt="Haier Tutor Logo" 
                className="h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold tracking-wide transition-colors hover:text-brand-secondary ${
                  location.pathname === link.path ? "text-brand-secondary" : "text-brand-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-primary hover:text-brand-secondary transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? "bg-slate-50 text-brand-secondary"
                      : "text-brand-primary hover:bg-slate-50 hover:text-brand-secondary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
