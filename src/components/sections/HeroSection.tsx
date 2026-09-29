import React, { useState } from 'react';
import { ArrowDownRight, Terminal, Github, Linkedin, ExternalLink } from 'lucide-react';
import { HeroWebGLScene } from '../canvas/HeroWebGLScene';
import { Theme } from '../../types/portfolio';
import { soundEngine } from '../../utils/soundEngine';

interface HeroSectionProps {
  theme: Theme;
  onExploreWork: () => void;
  onContactClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme,
  onExploreWork,
  onContactClick,
}) => {
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);

  const firstName = 'SAMUEL';
  const lastName = 'COLLRIDGE NAIK';

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 px-6 overflow-hidden"
    >
      {/* Three.js Interactive WebGL Background */}
      <HeroWebGLScene theme={theme} />

      {/* Atmospheric lighting gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#38BDF8]/10 dark:bg-[#38BDF8]/10 light:bg-[#2563EB]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle tech grid overlay */}
      <div className="absolute inset-0 tech-grid opacity-60 pointer-events-none" />

      {/* Top Hero Sub-Header / Status info */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PORTFOLIO V2 // 2026</span>
          <span aria-hidden="true">·</span>
          <span>PRESIDENCY UNIVERSITY</span>
        </div>
        <div className="flex items-center gap-3">
          <span>BANGALORE, INDIA</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#38BDF8] font-semibold">AVAILABLE FOR PROJECTS</span>
        </div>
      </div>

      {/* Center Giant Hero Typography */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-12 flex flex-col items-start justify-center">
        {/* Supporting Line */}
        <div className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-medium text-[#38BDF8] dark:text-[#38BDF8] light:text-[#2563EB] mb-4 tracking-wide">
          <span>MCA Student</span>
          <span aria-hidden="true">·</span>
          <span>Developer</span>
          <span aria-hidden="true">·</span>
          <span>Builder</span>
        </div>

        {/* Massive Display Title */}
        <h1 className="font-display font-black tracking-tight text-white dark:text-white light:text-slate-900 select-none leading-[0.88] mb-6">
          <div className="text-6xl sm:text-7xl md:text-9xl lg:text-[10rem] flex flex-wrap gap-x-1 sm:gap-x-2">
            {firstName.split('').map((char, index) => (
              <span
                key={index}
                onMouseEnter={() => {
                  soundEngine.playHover();
                  setHoveredLetter(`fn-${index}`);
                }}
                onMouseLeave={() => setHoveredLetter(null)}
                className={`transition-all duration-200 cursor-default inline-block ${
                  hoveredLetter === `fn-${index}`
                    ? 'text-[#38BDF8] -translate-y-2 scale-105'
                    : ''
                }`}
                data-cursor="view"
              >
                {char}
              </span>
            ))}
          </div>
          <div className="text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] tracking-tight mt-1 text-slate-200 dark:text-slate-200 light:text-slate-800 flex flex-wrap gap-x-1 sm:gap-x-2">
            {lastName.split('').map((char, index) => (
              <span
                key={index}
                onMouseEnter={() => {
                  soundEngine.playHover();
                  setHoveredLetter(`ln-${index}`);
                }}
                onMouseLeave={() => setHoveredLetter(null)}
                className={`transition-all duration-200 cursor-default inline-block ${
                  char === ' ' ? 'w-4 sm:w-8' : ''
                } ${
                  hoveredLetter === `ln-${index}`
                    ? 'text-[#818CF8] -translate-y-2 scale-105'
                    : ''
                }`}
                data-cursor="view"
              >
                {char}
              </span>
            ))}
          </div>
        </h1>

        {/* Positioning Statement */}
        <p className="max-w-2xl text-lg sm:text-xl text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed font-normal mb-8">
          I build software, intelligent systems and digital experiences that solve real problems.
        </p>

        {/* Interactive Action Triggers */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => {
              soundEngine.playClick();
              onExploreWork();
            }}
            className="flex items-center gap-2 px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm rounded-lg transition-all shadow-[0_0_24px_rgba(37,99,235,0.4)] hover:shadow-[0_0_32px_rgba(37,99,235,0.6)] cursor-pointer"
            data-cursor="explore"
          >
            <span>Explore Work</span>
            <ArrowDownRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onContactClick();
            }}
            className="flex items-center gap-2 px-6 py-3.5 bg-white/[0.06] hover:bg-white/[0.12] dark:bg-white/[0.06] dark:hover:bg-white/[0.12] light:bg-slate-200 light:hover:bg-slate-300 text-white dark:text-white light:text-slate-900 border border-white/[0.1] font-semibold text-sm rounded-lg transition-all cursor-pointer"
            data-cursor="action"
          >
            <span>Get in Touch</span>
          </button>
        </div>
      </div>

      {/* Bottom Hero Ribbon */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-8 border-t border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/samuelcollridgenaik-alt"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
            data-cursor="action"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/samuel-collridge-naik-02babb3b5"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
            data-cursor="action"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>SCROLL TO DIVE INTO THE ARCHITECTURE</span>
        </div>
      </div>
    </section>
  );
};
