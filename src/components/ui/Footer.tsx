import React from 'react';
import { ArrowUp, Terminal } from 'lucide-react';
import { PERSONAL_DATA } from '../../data/personalData';
import { Theme } from '../../types/portfolio';
import { soundEngine } from '../../utils/soundEngine';

interface FooterProps {
  theme?: Theme;
}

export const Footer: React.FC<FooterProps> = () => {
  const scrollToTop = () => {
    soundEngine.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-[#DADCE0] dark:border-white/[0.08] py-12 px-6 bg-white dark:bg-[#040508]/80">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-xs text-[#5F6368] dark:text-slate-400">
        {/* Left Column: Brand & Title */}
        <div className="text-left">
          <div className="font-display font-bold text-[#202124] dark:text-white text-sm tracking-wide">
            {PERSONAL_DATA.name.toUpperCase()}
          </div>
          <div className="font-mono text-[11px] text-[#5F6368] dark:text-slate-500 mt-1 flex items-center gap-2">
            <span>MCA STUDENT</span>
            <span aria-hidden="true">·</span>
            <span>DEVELOPER</span>
            <span aria-hidden="true">·</span>
            <span>BUILDER</span>
          </div>
        </div>

        {/* Center Column: Centered Copyright */}
        <div className="text-center font-mono text-[11px] text-[#5F6368] dark:text-slate-400">
          <span>© 2026 SAMUEL COLLRIDGE NAIK</span>
        </div>

        {/* Right Column: Return to Top */}
        <div className="flex md:justify-end">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DADCE0] dark:border-white/[0.08] bg-[#F8F9FA] hover:bg-[#F1F3F4] text-[#3C4043] dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-xs font-mono"
            data-cursor="action"
            aria-label="Scroll back to top"
          >
            <span>RETURN TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
