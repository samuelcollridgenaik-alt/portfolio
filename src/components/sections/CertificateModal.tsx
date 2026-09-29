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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-3xl bg-[#090D18] dark:bg-[#090D18] light:bg-white text-slate-100 dark:text-slate-100 light:text-slate-900 border border-white/15 dark:border-white/15 light:border-slate-300 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 bg-white/[0.02]">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold">VERIFIED CREDENTIAL RECORD</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsZoomed(!isZoomed);
              }}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Document */}
        <div className={`p-6 sm:p-10 transition-transform duration-200 overflow-y-auto max-h-[75vh] ${isZoomed ? 'scale-105' : 'scale-100'}`}>
          <div className="border-4 border-double border-[#38BDF8]/40 dark:border-[#38BDF8]/40 light:border-blue-400/40 rounded-xl p-8 bg-gradient-to-b from-white/[0.02] to-transparent relative">
            {/* Watermark Crest */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none">
              <Award className="w-72 h-72 text-white" />
            </div>

            <div className="text-center space-y-4">
              <div className="text-xs font-mono text-[#38BDF8] tracking-widest uppercase">
                {cert.provider}
              </div>

              <div className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                Certificate of Technical Competency
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
                {cert.title}
              </h2>

              <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 max-w-lg mx-auto">
                This certifies that <strong className="text-white dark:text-white light:text-slate-900">Samuel Collridge Naik</strong> successfully completed the comprehensive technical curriculum in Data Analytics and Scientific Python.
              </p>

              {/* Meta metrics */}
              <div className="flex flex-wrap justify-center items-center gap-6 py-4 text-xs font-mono text-slate-400 border-y border-white/[0.08] my-6">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#38BDF8]" />
                  <span>Duration: {cert.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#38BDF8]" />
                  <span>Period: {cert.period}</span>
                </div>
                {cert.credentialId && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>ID: {cert.credentialId}</span>
                  </div>
                )}
              </div>

              {/* Curriculum Breakdown */}
              <div className="text-left space-y-2 max-w-md mx-auto">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Verified Curriculum Modules
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
                  {cert.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#38BDF8]">›</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>AUTHENTICATED PORTFOLIO ASSET</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print / Save Credential</span>
          </button>
        </div>
      </div>
    </div>
  );
};
