import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, FileText, Menu, X } from 'lucide-react';
import { Theme } from '../../types/portfolio';
import { soundEngine } from '../../utils/soundEngine';

interface HeaderProps {
  theme?: Theme;
  onOpenResume: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onOpenResume,
  activeSection,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSound = () => {
    const isUnmuted = soundEngine.toggleMute();
    setIsMuted(!isUnmuted);
  };

  const navItems = [
    { label: 'Work', href: '#work', id: 'work' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Stack', href: '#stack', id: 'stack' },
    { label: 'Lab', href: '#lab', id: 'lab' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (href: string) => {
    soundEngine.playClick();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-[#040508]/85 backdrop-blur-md border-b border-[#DADCE0] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(60,64,67,0.08)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="text-lg font-bold tracking-tight text-[#202124] dark:text-white font-display hover:text-[#1A73E8] dark:hover:text-[#38BDF8] transition-colors"
          data-cursor="action"
        >
          SAMUEL
        </a>

        {/* Zone 2: Clean 4–6 text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                onMouseEnter={() => soundEngine.playHover()}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#1A73E8] dark:text-[#38BDF8] font-semibold'
                    : 'text-[#5F6368] dark:text-slate-300 hover:text-[#202124] dark:hover:text-white'
                }`}
                data-cursor="action"
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1A73E8] dark:bg-[#38BDF8] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1–2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Audio toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Enable sound synthesizer' : 'Mute sound'}
            title={isMuted ? 'Sound: Muted (Click to enable)' : 'Sound: Enabled'}
            className="p-2 rounded-lg text-[#5F6368] dark:text-slate-400 hover:text-[#202124] dark:hover:text-white hover:bg-[#F1F3F4] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            data-cursor="action"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#1A73E8] dark:text-[#38BDF8]" />}
          </button>

          {/* Resume quick action */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenResume();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1A73E8] hover:bg-[#174EA6] rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            data-cursor="action"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-lg text-[#3C4043] dark:text-slate-300 hover:text-[#202124] dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-[#07090E]/95 backdrop-blur-xl border-b border-[#DADCE0] dark:border-white/[0.08] px-6 py-5 flex flex-col gap-4 shadow-lg">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className="text-base font-medium text-[#202124] dark:text-slate-200 py-1"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
