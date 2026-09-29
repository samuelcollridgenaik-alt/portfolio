import React, { useState } from 'react';
import { CERTIFICATIONS_DATA } from '../../data/certificationsData';
import { CertificateModal } from './CertificateModal';
import { Certification, Theme } from '../../types/portfolio';
import { Award, CheckCircle2, Clock, Calendar, ArrowUpRight } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface CertificationsSectionProps {
  theme: Theme;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ theme }) => {
  const [activeCert, setActiveCert] = useState<Certification | null>(null);

  return (
    <section className="relative py-20 px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/[0.08] dark:border-white/[0.08] light:border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-widest mb-3">
            <span>05</span>
            <span aria-hidden="true">/</span>
            <span>VERIFIED CREDENTIALS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
            CERTIFICATIONS
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mt-2 max-w-lg">
            Preserved academic and technical accreditations in data analysis and Python engineering.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CERTIFICATIONS_DATA.map((cert) => (
          <div
            key={cert.id}
            onClick={() => {
              soundEngine.playClick();
              setActiveCert(cert);
            }}
            className="group relative rounded-2xl border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 bg-[#070A11]/60 dark:bg-[#070A11]/60 light:bg-white/70 p-7 hover:border-[#38BDF8] transition-all cursor-pointer flex flex-col justify-between"
            data-cursor="view"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>VERIFIED</span>
                </div>
                <span>{cert.period}</span>
              </div>

              <h3 className="text-2xl font-display font-bold text-white dark:text-white light:text-slate-900 group-hover:text-[#38BDF8] transition-colors">
                {cert.title}
              </h3>

              <div className="text-xs font-mono text-[#38BDF8] mt-1 mb-3">
                {cert.provider}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed font-normal mb-6">
                {cert.description}
              </p>

              {/* Unboxed topics list */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-4">
                {cert.topics.slice(0, 3).map((topic, i) => (
                  <span key={topic} className="flex items-center gap-2">
                    <span>{topic}</span>
                    {i < 2 && <span aria-hidden="true" className="text-slate-600">·</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400">Duration: {cert.duration}</span>
              <div className="flex items-center gap-1 text-[#38BDF8] font-semibold group-hover:translate-x-1 transition-transform">
                <span>Inspect Certificate</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <CertificateModal
        cert={activeCert}
        onClose={() => setActiveCert(null)}
        theme={theme}
      />
    </section>
  );
};
