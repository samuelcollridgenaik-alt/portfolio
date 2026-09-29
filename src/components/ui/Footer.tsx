import React from 'react';
import { ArrowUp, Terminal } from 'lucide-react';
import { PERSONAL_DATA } from '../../data/personalData';
import { soundEngine } from '../../utils/soundEngine';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundEngine.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 py-12 px-6 bg-[#040508]/80 dark:bg-[#040508]/80 light:bg-slate-100/80">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
        <div>
          <div className="font-display font-bold text-white dark:text-white light:text-slate-900 text-sm tracking-wide">
            {PERSONAL_DATA.name.toUpperCase()}
          </div>
          <div className="font-mono text-[11px] text-slate-500 mt-1 flex items-center gap-2">
            <span>MCA STUDENT</span>
            <span aria-hidden="true">·</span>
            <span>DEVELOPER</span>
            <span aria-hidden="true">·</span>
            <span>BUILDER</span>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SYSTEM STATUS: ONLINE</span>
          </div>
          <span>© 2026 SAMUEL COLLRIDGE NAIK</span>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] dark:border-white/[0.08] light:border-slate-300 hover:bg-white/[0.06] text-slate-300 dark:text-slate-300 light:text-slate-700 transition-colors cursor-pointer text-xs font-mono"
          data-cursor="action"
          aria-label="Scroll back to top"
        >
          <span>RETURN TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
