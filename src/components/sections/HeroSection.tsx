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
  const lastNameWords = ['COLLRIDGE', 'NAIK'];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-16 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 overflow-hidden"
    >
      {/* Three.js Interactive WebGL Background */}
      <HeroWebGLScene theme={theme} />

      {/* Atmospheric lighting gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-[#1A73E8]/8 dark:bg-[#38BDF8]/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      {/* Subtle tech grid overlay */}
      <div className="absolute inset-0 tech-grid opacity-60 pointer-events-none" />

      {/* Top Hero Sub-Header / Status info */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-1.5 sm:pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 text-[11px] sm:text-xs font-mono text-[#5F6368] dark:text-slate-400">
        <div className="flex items-center gap-2">
          {/* Google 4-color status dots in light mode, emerald in dark mode */}
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#1A73E8] dark:bg-[#38BDF8] animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335] dark:hidden" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] dark:hidden" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] dark:hidden" />
          </div>
          <span>PORTFOLIO 2026</span>
          <span aria-hidden="true">·</span>
          <span>PRESIDENCY UNIVERSITY</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span>BANGALORE, INDIA</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#1A73E8] dark:text-[#38BDF8] font-semibold">AVAILABLE FOR PROJECTS</span>
        </div>
      </div>

      {/* Center Giant Hero Typography */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-8 sm:py-12 flex flex-col items-start justify-center">
        {/* Supporting Line */}
        <div className="flex items-center gap-2 text-xs sm:text-base md:text-lg font-medium text-[#1A73E8] dark:text-[#38BDF8] mb-3 sm:mb-4 tracking-wide">
          <span>MCA Student</span>
          <span aria-hidden="true">·</span>
          <span>Developer</span>
          <span aria-hidden="true">·</span>
          <span>Builder</span>
        </div>

        {/* Massive Display Title with atomic word protection */}
        <h1 className="font-display font-black tracking-tight text-[#202124] dark:text-white select-none leading-[0.9] sm:leading-[0.88] mb-5 sm:mb-6">
          <div className="text-5xl xs:text-6xl sm:text-7xl md:text-9xl lg:text-[10rem] flex flex-nowrap gap-x-0.5 sm:gap-x-2">
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
                    ? 'text-[#1A73E8] dark:text-[#38BDF8] -translate-y-2 scale-105'
                    : ''
                }`}
                data-cursor="view"
              >
                {char}
              </span>
            ))}
          </div>

          <div className="text-3xl xs:text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] tracking-tight mt-1 text-[#3C4043] dark:text-slate-200 flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-x-4">
            {lastNameWords.map((word, wIdx) => (
              <span key={wIdx} className="inline-flex flex-nowrap gap-x-0.5 sm:gap-x-1.5 whitespace-nowrap">
                {word.split('').map((char, cIdx) => {
                  const letterKey = `ln-${wIdx}-${cIdx}`;
                  return (
                    <span
                      key={letterKey}
                      onMouseEnter={() => {
                        soundEngine.playHover();
                        setHoveredLetter(letterKey);
                      }}
                      onMouseLeave={() => setHoveredLetter(null)}
                      className={`transition-all duration-200 cursor-default inline-block ${
                        hoveredLetter === letterKey
                          ? 'text-[#1A73E8] dark:text-[#818CF8] -translate-y-2 scale-105'
                          : ''
                      }`}
                      data-cursor="view"
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            ))}
          </div>
        </h1>

        {/* Positioning Statement */}
        <p className="max-w-2xl text-base sm:text-xl text-[#3C4043] dark:text-slate-300 leading-relaxed font-normal mb-6 sm:mb-8">
          I build software, intelligent systems and digital experiences that solve real problems.
        </p>

        {/* Interactive Action Triggers */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => {
              soundEngine.playClick();
              onExploreWork();
            }}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1A73E8] hover:bg-[#174EA6] text-white font-semibold text-sm rounded-lg transition-all shadow-[0_2px_8px_rgba(26,115,232,0.35)] hover:shadow-[0_4px_16px_rgba(26,115,232,0.5)] cursor-pointer"
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
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#F1F3F4] text-[#1A73E8] border border-[#DADCE0] dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-white dark:border-white/[0.1] font-semibold text-sm rounded-lg transition-all cursor-pointer shadow-sm"
            data-cursor="action"
          >
            <span>Get in Touch</span>
          </button>
        </div>
      </div>

      {/* Bottom Hero Ribbon */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-8 border-t border-[#DADCE0] dark:border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#5F6368] dark:text-slate-400">
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/samuelcollridgenaik-alt"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-[#202124] dark:hover:text-white transition-colors"
            data-cursor="action"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/samuel-collridge-naik-02babb3b5"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-[#202124] dark:hover:text-white transition-colors"
            data-cursor="action"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <Terminal className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#38BDF8]" />
          <span>SCROLL TO DIVE INTO THE ARCHITECTURE</span>
        </div>
      </div>
    </section>
  );
};
