import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Award, CheckCircle2, Calendar, Clock, Download, ExternalLink } from 'lucide-react';
import { Certification, Theme } from '../../types/portfolio';
import { soundEngine } from '../../utils/soundEngine';

interface CertificateModalProps {
  cert: Certification | null;
  onClose: () => void;
  theme: Theme;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ cert, onClose, theme }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!cert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-[#090D18] text-[#202124] dark:text-slate-100 border border-[#DADCE0] dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DADCE0] dark:border-white/[0.08] bg-[#F8F9FA] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#137333] dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold">VERIFIED CREDENTIAL RECORD</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsZoomed(!isZoomed);
              }}
              className="p-1.5 rounded-lg hover:bg-[#F1F3F4] dark:hover:bg-white/[0.08] text-[#5F6368] hover:text-[#202124] dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg hover:bg-[#F1F3F4] dark:hover:bg-white/[0.08] text-[#5F6368] hover:text-[#202124] dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Document */}
        <div className={`p-6 sm:p-10 transition-transform duration-200 overflow-y-auto max-h-[75vh] ${isZoomed ? 'scale-105' : 'scale-100'}`}>
          <div className="border-4 border-double border-[#1A73E8]/40 dark:border-[#38BDF8]/40 rounded-xl p-8 bg-gradient-to-b from-[#F8F9FA] to-white dark:from-white/[0.02] dark:to-transparent relative shadow-xs">
            {/* Watermark Crest */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none">
              <Award className="w-72 h-72 text-[#1A73E8] dark:text-white" />
            </div>

            <div className="text-center space-y-4">
              <div className="text-xs font-mono text-[#1A73E8] dark:text-[#38BDF8] tracking-widest uppercase font-semibold">
                {cert.provider}
              </div>

              <div className="text-xs text-[#5F6368] dark:text-slate-400 uppercase tracking-widest font-mono">
                Certificate of Technical Competency
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#202124] dark:text-white tracking-tight">
                {cert.title}
              </h2>

              <p className="text-sm text-[#3C4043] dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                This certifies that <strong className="text-[#202124] dark:text-white">Samuel Collridge Naik</strong> successfully completed the comprehensive technical curriculum in Data Analytics and Scientific Python.
              </p>

              {/* Meta metrics */}
              <div className="flex flex-wrap justify-center items-center gap-6 py-4 text-xs font-mono text-[#5F6368] dark:text-slate-400 border-y border-[#DADCE0] dark:border-white/[0.08] my-6">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#1A73E8] dark:text-[#38BDF8]" />
                  <span>Duration: {cert.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#1A73E8] dark:text-[#38BDF8]" />
                  <span>Period: {cert.period}</span>
                </div>
                {cert.credentialId && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#137333] dark:text-emerald-400" />
                    <span>ID: {cert.credentialId}</span>
                  </div>
                )}
              </div>

              {/* Curriculum Breakdown */}
              <div className="text-left space-y-2 max-w-md mx-auto">
                <div className="text-xs font-mono text-[#5F6368] dark:text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                  Verified Curriculum Modules
                </div>
                <ul className="space-y-1.5 text-xs text-[#3C4043] dark:text-slate-300">
                  {cert.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#1A73E8] dark:text-[#38BDF8] font-bold">›</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-[#DADCE0] dark:border-white/[0.08] bg-[#F8F9FA] dark:bg-white/[0.02] flex items-center justify-between text-xs font-mono text-[#5F6368] dark:text-slate-400">
          <span>AUTHENTICATED PORTFOLIO ASSET</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A73E8] hover:bg-[#174EA6] text-white dark:bg-white/[0.08] dark:hover:bg-white/[0.15] dark:text-white transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print / Save Credential</span>
          </button>
        </div>
      </div>
    </div>
  );
};
