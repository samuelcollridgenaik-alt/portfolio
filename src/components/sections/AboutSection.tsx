import React from 'react';
import { PERSONAL_DATA } from '../../data/personalData';
import { Theme } from '../../types/portfolio';
import { GraduationCap, MapPin, Terminal, Compass, ArrowUpRight, FileText } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface AboutSectionProps {
  theme: Theme;
  onOpenResume: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ theme, onOpenResume }) => {
  return (
    <section id="about" className="relative py-16 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      {/* Editorial Headline Statement */}
      <div className="mb-10 sm:mb-20">
        <div className="flex items-center gap-2 text-xs font-mono text-[#1A73E8] dark:text-[#38BDF8] uppercase tracking-widest mb-4 font-semibold">
          <span>03</span>
          <span aria-hidden="true">/</span>
          <span>IDENTITY & ETHOS</span>
        </div>

        <div className="font-display font-black tracking-tight text-[#202124] dark:text-white leading-[0.95] text-4xl sm:text-6xl md:text-7xl lg:text-8xl select-none">
          <div>I BUILD SYSTEMS.</div>
          <div className="text-[#5F6368] dark:text-slate-400">
            I EXPERIMENT WITH TECH.
          </div>
          <div>I LEARN BY BUILDING.</div>
          <div className="text-[#1A73E8] dark:text-[#38BDF8]">I'M SAMUEL.</div>
        </div>
      </div>

      {/* Main Grid: Biography + Academic Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Factual Bio & Pillars */}
        <div className="lg:col-span-7 space-y-6">
          <p className="text-lg sm:text-xl text-[#202124] dark:text-slate-300 leading-relaxed font-normal">
            Based in Bangalore, India — the technological capital of South Asia — I am an MCA
            developer and builder with a deep interest in software engineering, applied machine
            learning, computer vision, and reactive systems.
          </p>
          <p className="text-sm sm:text-base text-[#5F6368] dark:text-slate-400 leading-relaxed">
            Rather than accumulating theoretical jargon, I prioritize shipping functional code:
            from writing asynchronous FastAPI inference endpoints to optimizing database schemas
            and constructing procedural WebGL experiences. My approach centers on clarity,
            mathematical precision, and real-world utility.
          </p>

          {/* Quick Pillars */}
          <div className="pt-4 border-t border-[#DADCE0] dark:border-white/[0.08]">
            <div className="text-xs font-mono text-[#5F6368] dark:text-slate-400 uppercase tracking-wider mb-4">
              Core Technical Competencies
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-white/[0.02] border border-[#DADCE0] dark:border-white/[0.06] shadow-2xs">
                <div className="font-semibold text-[#202124] dark:text-white mb-1">
                  Full-Stack Architecture
                </div>
                <div className="text-xs text-[#5F6368] dark:text-slate-400 leading-relaxed">
                  React, TypeScript, FastAPI microservices, MySQL normalization, and resilient REST pipelines.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-white/[0.02] border border-[#DADCE0] dark:border-white/[0.06] shadow-2xs">
                <div className="font-semibold text-[#202124] dark:text-white mb-1">
                  Applied ML & Computer Vision
                </div>
                <div className="text-xs text-[#5F6368] dark:text-slate-400 leading-relaxed">
                  Multi-label NLP classifiers, TF-IDF vectorization, YOLO aerial asset detection, and ResNet pipelines.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenResume();
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#1A73E8] hover:bg-[#174EA6] rounded-lg transition-colors cursor-pointer shadow-sm"
              data-cursor="action"
            >
              <FileText className="w-4 h-4" />
              <span>Inspect Full Verified Resume</span>
            </button>
          </div>
        </div>

        {/* Right Column: Academic Track Record */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#DADCE0] dark:border-white/[0.08] bg-white dark:bg-[#070912]/80 p-6 backdrop-blur-md shadow-[0_2px_12px_rgba(60,64,67,0.08)]">
            <div className="flex items-center justify-between text-xs font-mono text-[#5F6368] dark:text-slate-400 mb-6 pb-3 border-b border-[#DADCE0] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#1A73E8] dark:text-[#38BDF8]" />
                <span className="font-bold text-[#202124] dark:text-slate-200">
                  ACADEMIC TRAJECTORY
                </span>
              </div>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>Bangalore</span>
              </span>
            </div>

            <div className="space-y-6">
              {PERSONAL_DATA.education.map((edu, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-[#1A73E8]/30 dark:border-[#2563EB]/40">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#1A73E8] dark:bg-[#38BDF8]" />
                  <div className="text-xs font-mono text-[#1A73E8] dark:text-[#38BDF8] mb-1 font-semibold">
                    {edu.status.toUpperCase()}
                  </div>
                  <h4 className="text-base font-display font-bold text-[#202124] dark:text-white">
                    {edu.degree}
                  </h4>
                  <div className="text-xs font-semibold text-[#3C4043] dark:text-slate-300 mt-0.5">
                    {edu.institution}
                  </div>
                  <div className="text-xs text-[#5F6368] dark:text-slate-400 mt-2 leading-relaxed">
                    {edu.focus}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
