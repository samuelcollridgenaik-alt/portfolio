import React, { useEffect } from 'react';
import { X, Printer, Download, Mail, Github, Linkedin, GraduationCap, Code2, Award, Briefcase } from 'lucide-react';
import { PERSONAL_DATA } from '../../data/personalData';
import { PROJECTS_DATA } from '../../data/projectsData';
import { CERTIFICATIONS_DATA } from '../../data/certificationsData';
import { Theme } from '../../types/portfolio';
import { soundEngine } from '../../utils/soundEngine';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, theme }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playClick();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownloadMarkdown = () => {
    soundEngine.playClick();
    const markdownContent = `# ${PERSONAL_DATA.name}
${PERSONAL_DATA.role} | ${PERSONAL_DATA.location}
Email: ${PERSONAL_DATA.email} | GitHub: ${PERSONAL_DATA.social.github} | LinkedIn: ${PERSONAL_DATA.social.linkedin}

---

## PROFESSIONAL SUMMARY
${PERSONAL_DATA.tagline}
${PERSONAL_DATA.bioHighlights.join(' ')}

---

## EDUCATION
${PERSONAL_DATA.education
  .map(
    (e) => `### ${e.degree} — ${e.institution}
Status: ${e.status} | Location: ${e.location}
Focus: ${e.focus}
`
  )
  .join('\n')}

---

## FEATURED PROJECTS
${PROJECTS_DATA.map(
  (p) => `### ${p.title} (${p.period})
Role/Category: ${p.category} | Technologies: ${p.technologies.join(', ')}
${p.description}
Highlights:
${p.highlights.map((h) => `- ${h}`).join('\n')}
`
).join('\n')}

---

## CERTIFICATIONS
${CERTIFICATIONS_DATA.map(
  (c) => `- **${c.title}** by ${c.provider} (${c.duration}, ${c.period})`
).join('\n')}
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Samuel_Collridge_Naik_Resume.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#090C16] text-[#202124] dark:text-slate-100 border border-[#DADCE0] dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DADCE0] dark:border-white/[0.08] bg-[#F8F9FA] dark:bg-white/[0.02]">
          <div className="text-xs font-mono text-[#1A73E8] dark:text-[#38BDF8] font-bold">
            RESUME VIEW // VERIFIED CURRICULUM VITAE
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                window.print();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F1F3F4] hover:bg-[#E8EAED] text-[#202124] dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-white transition-colors cursor-pointer border border-[#DADCE0] dark:border-transparent"
              title="Print resume"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1A73E8] hover:bg-[#174EA6] text-white transition-colors cursor-pointer shadow-sm"
              title="Download Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.md)</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg hover:bg-[#F1F3F4] dark:hover:bg-white/[0.08] text-[#5F6368] hover:text-[#202124] dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close resume modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Canvas */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8 font-sans">
          {/* Header Contact Lockup */}
          <div className="border-b border-[#DADCE0] dark:border-white/[0.08] pb-6">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#202124] dark:text-white tracking-tight">
              {PERSONAL_DATA.name}
            </h1>
            <div className="text-sm font-medium text-[#1A73E8] dark:text-[#38BDF8] mt-1 font-semibold">
              {PERSONAL_DATA.role}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5F6368] dark:text-slate-400 mt-3 font-mono">
              <span>{PERSONAL_DATA.location}</span>
              <span aria-hidden="true">·</span>
              <a href={`mailto:${PERSONAL_DATA.email}`} className="hover:text-[#1A73E8] dark:hover:text-white transition-colors">
                {PERSONAL_DATA.email}
              </a>
              <span aria-hidden="true">·</span>
              <a href={PERSONAL_DATA.social.github} target="_blank" rel="noreferrer" className="hover:text-[#1A73E8] dark:hover:text-white transition-colors">
                github.com/{PERSONAL_DATA.social.githubHandle}
              </a>
              <span aria-hidden="true">·</span>
              <a href={PERSONAL_DATA.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#1A73E8] dark:hover:text-white transition-colors">
                linkedin.com/in/{PERSONAL_DATA.social.linkedinHandle}
              </a>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#202124] dark:text-slate-200 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-[#1A73E8] dark:text-[#38BDF8]" />
              <span>Education</span>
            </div>

            <div className="space-y-4">
              {PERSONAL_DATA.education.map((edu, i) => (
                <div key={i} className="text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-[#202124] dark:text-white">
                    <span>{edu.degree}</span>
                    <span className="text-xs font-mono text-[#5F6368] dark:text-slate-400 font-normal">{edu.status}</span>
                  </div>
                  <div className="text-xs text-[#1A73E8] dark:text-[#38BDF8] mt-0.5 font-semibold">
                    {edu.institution}, {edu.location}
                  </div>
                  <div className="text-xs text-[#5F6368] dark:text-slate-400 mt-1">
                    {edu.focus}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Technical Projects */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#202124] dark:text-slate-200 uppercase tracking-wider">
              <Code2 className="w-4 h-4 text-[#1A73E8] dark:text-[#38BDF8]" />
              <span>Engineered Projects & Applied Systems</span>
            </div>

            <div className="space-y-5">
              {PROJECTS_DATA.map((proj) => (
                <div key={proj.id} className="text-sm space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-[#202124] dark:text-white">
                    <span className="text-base">{proj.title}</span>
                    <span className="text-xs font-mono text-[#5F6368] dark:text-slate-400 font-normal">{proj.period}</span>
                  </div>
                  <div className="text-xs text-[#1A73E8] dark:text-[#38BDF8] font-mono font-semibold">
                    {proj.category} · Stack: {proj.technologies.join(', ')}
                  </div>
                  <p className="text-xs text-[#3C4043] dark:text-slate-300 leading-relaxed mt-1">
                    {proj.description}
                  </p>
                  <ul className="space-y-0.5 pt-1">
                    {proj.highlights.map((h, idx) => (
                      <li key={idx} className="text-xs text-[#5F6368] dark:text-slate-400 flex items-start gap-2">
                        <span className="text-[#1A73E8] dark:text-[#38BDF8] select-none font-bold">›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#202124] dark:text-slate-200 uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#1A73E8] dark:text-[#38BDF8]" />
              <span>Certifications</span>
            </div>

            <div className="space-y-2">
              {CERTIFICATIONS_DATA.map((c) => (
                <div key={c.id} className="text-sm">
                  <div className="font-semibold text-[#202124] dark:text-white">
                    {c.title} — {c.provider}
                  </div>
                  <div className="text-xs text-[#5F6368] dark:text-slate-400 font-mono">
                    {c.duration} · {c.period}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
