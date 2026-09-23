/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, Crown, Shield, Globe, Award, Sparkles, FileText, Image as ImageIcon } from 'lucide-react';
import { PWAInstallButton } from './pwa/PWAInstallButton';

interface NavigationProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenAdmin: () => void;
}

export default function Navigation({ onNavigate, activeSection, onOpenAdmin }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldBeScrolled = window.scrollY > 40;
          if (isScrolledRef.current !== shouldBeScrolled) {
            isScrolledRef.current = shouldBeScrolled;
            setIsScrolled(shouldBeScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { id: 'about', label: 'Summit' },
    { id: 'programme', label: 'Programme' },
    { id: 'dignitaries', label: 'Dignitaries' },
    { id: 'protocol-hierarchy', label: 'Hierarchy & Speeches' },
    { id: 'speakers', label: 'Speakers' },
    { id: 'everybody-involved', label: 'Aviation Safety' },
    { id: 'safety-library', label: 'Safety Library' },
    { id: 'challenge', label: 'Memo Challenge' },
    { id: 'domislink-bookstore', label: 'Bookstore' },
    { id: 'podcast', label: 'Podcast' },
    { id: 'marketplace', label: 'Sponsor' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'volunteer', label: 'Volunteer' },
    { id: 'share', label: 'Share' },
    { id: 'register', label: 'Register' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleItemClick = useCallback((id: string) => {
    onNavigate(id);
    setIsOpen(false);
  }, [onNavigate]);

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0A192F]/98 backdrop-blur-md shadow-xl border-b border-[#D4AF37]/25 py-2' 
        : 'bg-[#0A192F] border-b border-[#D4AF37]/15 py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand/Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleItemClick('home')}>
            <div className="p-2 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] rounded-lg shadow-inner flex items-center justify-center">
              <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-[#0A192F]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif tracking-widest text-[#D4AF37] font-bold text-sm sm:text-base">
                  THE DIGITAL EMPIRE
                </span>
                <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                  2026
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[9px] text-[#8A99AD] font-sans">
                <span className="uppercase tracking-wider font-semibold">Domislink International Services Ltd</span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-white/5 border border-[#D4AF37]/35 text-[#D4AF37] font-mono font-bold">
                  RC - 9266988
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`px-2 py-1 text-[11px] font-medium tracking-wide transition-colors rounded ${
                  activeSection === item.id
                    ? 'text-[#D4AF37] bg-white/10 font-bold'
                    : 'text-[#E2E8F0] hover:text-[#D4AF37] hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Quick Access Admin Dashboard & PWA Install Button */}
            <PWAInstallButton variant="navbar" className="ml-1" />
            <a
              href="https://sec.domislink.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-2.5 py-1 bg-gradient-to-r from-[#D4AF37]/10 to-[#AA7C11]/20 hover:from-[#D4AF37]/20 hover:to-[#AA7C11]/30 border border-[#D4AF37]/40 text-[#D4AF37] rounded text-[11px] font-semibold tracking-wider transition-all duration-200 flex items-center gap-1.5"
            >
              <Shield className="h-3 w-3" />
              DIGITAL SECRETARIAT
            </a>
            <button
              onClick={onOpenAdmin}
              className="ml-2 px-2.5 py-1 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#D4AF37] rounded text-[11px] font-semibold tracking-wider transition-all duration-200"
            >
              CMS PANEL
            </button>
          </nav>

          {/* Medium screen condensed nav */}
          <div className="hidden lg:flex 2xl:hidden items-center space-x-2">
            <PWAInstallButton variant="navbar" />
            <button
              onClick={() => handleItemClick('poster')}
              className="text-xs text-[#E2E8F0] hover:text-[#D4AF37] px-2 py-1"
            >
              Poster
            </button>
            <button
              onClick={() => handleItemClick('speakers')}
              className="text-xs text-[#E2E8F0] hover:text-[#D4AF37] px-2 py-1"
            >
              Speakers
            </button>
            <button
              onClick={() => handleItemClick('programme')}
              className="text-xs text-[#E2E8F0] hover:text-[#D4AF37] px-2 py-1"
            >
              Programme
            </button>
            <button
              onClick={() => handleItemClick('google-docs')}
              className="text-xs text-[#D4AF37] hover:text-white px-2 py-1 font-semibold flex items-center space-x-1"
            >
              <span>Docs</span>
            </button>
            <button
              onClick={() => handleItemClick('challenge')}
              className="text-xs text-[#E2E8F0] hover:text-[#D4AF37] px-2 py-1"
            >
              Memo
            </button>
            <button
              onClick={() => handleItemClick('register')}
              className="px-3 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B89025] text-[#0A192F] font-bold rounded text-xs tracking-wider uppercase"
            >
              Register
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg text-white hover:bg-white/5"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Hamburger / Toggle Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => handleItemClick('register')}
              className="px-2.5 py-1 bg-[#D4AF37] text-[#0A192F] font-bold rounded text-[10px] tracking-wider uppercase"
            >
              Register
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0A192F] border-b border-[#D4AF37]/30 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="px-3 pt-3 pb-6 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`block w-full text-left px-4 py-2 rounded text-xs font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-l-2 border-[#D4AF37] font-bold'
                    : 'text-[#E2E8F0] hover:bg-white/5 hover:text-[#D4AF37]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-[#D4AF37]/15 pt-3 px-4 flex flex-col gap-2">
              <PWAInstallButton variant="navbar" className="w-full justify-center py-2" />
              <a
                href="https://sec.domislink.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-xs text-[#D4AF37] font-bold flex items-center justify-center space-x-1.5 py-2 hover:bg-[#D4AF37]/10 rounded border border-[#D4AF37]/30"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Digital Secretariat</span>
              </a>
              <button
                onClick={() => { setIsOpen(false); onOpenAdmin(); }}
                className="text-xs text-[#D4AF37] font-bold flex items-center justify-center space-x-1 py-1.5 hover:bg-white/5 rounded"
              >
                <Crown className="h-3.5 w-3.5" />
                <span>CMS Management Panel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
