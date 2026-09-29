import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle2, AlertTriangle, Layers, Cpu, ArrowRight } from 'lucide-react';
import { Project, Theme } from '../../types/portfolio';
import { soundEngine } from '../../utils/soundEngine';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  theme: Theme;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, theme }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'interactive'>('overview');
  const [testComment, setTestComment] = useState('This algorithm pipeline demonstrates impressive efficiency and accuracy.');
  const [simulatedScores, setSimulatedScores] = useState({
    toxic: 0.02,
    severeToxic: 0.0,
    obscene: 0.01,
    threat: 0.0,
    insult: 0.01,
    identityHate: 0.0,
  });

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

  // Handle simulated NLP comment inference
  const analyzeComment = (text: string) => {
    setTestComment(text);
    const lower = text.toLowerCase();
    const badWords = ['hate', 'terrible', 'kill', 'threat', 'stupid', 'awful', 'idiot', 'ugly', 'die'];
    let matches = 0;
    badWords.forEach((word) => {
      if (lower.includes(word)) matches++;
    });

    if (matches === 0) {
      setSimulatedScores({
        toxic: 0.02,
        severeToxic: 0.0,
        obscene: 0.01,
        threat: 0.0,
        insult: 0.01,
        identityHate: 0.0,
      });
    } else {
      const toxicVal = Math.min(0.25 * matches, 0.94);
      setSimulatedScores({
        toxic: Number(toxicVal.toFixed(2)),
        severeToxic: Number((toxicVal * 0.4).toFixed(2)),
        obscene: Number((toxicVal * 0.6).toFixed(2)),
        threat: lower.includes('kill') || lower.includes('threat') ? 0.88 : 0.04,
        insult: Number((toxicVal * 0.75).toFixed(2)),
        identityHate: Number((toxicVal * 0.3).toFixed(2)),
      });
    }
  };

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md transition-opacity duration-200">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#080B14] text-[#202124] dark:text-slate-100 border border-[#DADCE0] dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DADCE0] dark:border-white/[0.08] bg-[#F8F9FA] dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#1A73E8] dark:text-[#38BDF8]">
              PROJECT {project.number}
            </span>
            <span aria-hidden="true" className="text-[#DADCE0] dark:text-slate-600">/</span>
            <span className="text-xs text-[#5F6368] dark:text-slate-400 uppercase tracking-wider font-mono">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F1F3F4] hover:bg-[#E8EAED] text-[#202124] dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-white transition-colors"
                data-cursor="action"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source</span>
              </a>
            )}
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg hover:bg-[#F1F3F4] dark:hover:bg-white/[0.08] text-[#5F6368] hover:text-[#202124] dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close case study modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Title Area */}
          <div>
            <div className="text-xs text-[#1A73E8] dark:text-[#38BDF8] font-mono mb-1">{project.period}</div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#202124] dark:text-white tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-[#3C4043] dark:text-slate-300 mt-2 font-normal leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Interactive Navigation Tabs inside Modal */}
          <div className="flex items-center gap-2 border-b border-[#DADCE0] dark:border-white/[0.08] pb-3">
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('overview');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#1A73E8] text-white shadow-sm'
                  : 'text-[#5F6368] hover:text-[#202124] hover:bg-[#F1F3F4] dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              01. The Problem & Approach
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('architecture');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-[#1A73E8] text-white shadow-sm'
                  : 'text-[#5F6368] hover:text-[#202124] hover:bg-[#F1F3F4] dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              02. System Architecture
            </button>
            {project.id === 'toxic-comment-detection' && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('interactive');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'interactive'
                    ? 'bg-[#1A73E8] text-white shadow-sm'
                    : 'text-[#5F6368] hover:text-[#202124] hover:bg-[#F1F3F4] dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                03. Live Inference Demo
              </button>
            )}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#FCE8E6]/60 dark:bg-white/[0.03] border border-[#FAD2CF] dark:border-white/[0.06] p-5 rounded-xl">
                  <div className="text-xs font-mono text-[#EA4335] dark:text-rose-400 uppercase tracking-wider mb-2 font-bold flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>The Challenge</span>
                  </div>
                  <p className="text-sm text-[#3C4043] dark:text-slate-300 leading-relaxed">
                    {project.caseStudy.problem}
                  </p>
                </div>

                <div className="bg-[#E6F4EA]/60 dark:bg-white/[0.03] border border-[#CEEAD6] dark:border-white/[0.06] p-5 rounded-xl">
                  <div className="text-xs font-mono text-[#137333] dark:text-emerald-400 uppercase tracking-wider mb-2 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Engineered Solution</span>
                  </div>
                  <p className="text-sm text-[#3C4043] dark:text-slate-300 leading-relaxed">
                    {project.caseStudy.approach}
                  </p>
                </div>
              </div>

              {/* Data & Evaluation Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#202124] dark:text-slate-200 font-mono">
                  Dataset, Evaluation & Status
                </h3>
                <div className="bg-[#F8F9FA] dark:bg-white/[0.02] border border-[#DADCE0] dark:border-white/[0.06] p-5 rounded-xl space-y-3 text-sm">
                  {project.caseStudy.datasetAndPreprocessing && (
                    <div>
                      <span className="font-semibold text-[#202124] dark:text-white block mb-1">
                        Data Preparation:
                      </span>
                      <p className="text-[#3C4043] dark:text-slate-300">
                        {project.caseStudy.datasetAndPreprocessing}
                      </p>
                    </div>
                  )}

                  {project.caseStudy.evaluationData && (
                    <div>
                      <span className="font-semibold text-[#202124] dark:text-white block mb-1">
                        Evaluation Benchmark:
                      </span>
                      <p className="text-[#3C4043] dark:text-slate-300">
                        {project.caseStudy.evaluationData}
                      </p>
                    </div>
                  )}

                  <div>
                    <span className="font-semibold text-[#202124] dark:text-white block mb-1">
                      Results & Outcomes:
                    </span>
                    <p className="text-[#3C4043] dark:text-slate-300">
                      {project.caseStudy.results}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Takeaways */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#202124] dark:text-slate-200 font-mono mb-3">
                  Engineering Insights & Lessons
                </h3>
                <ul className="space-y-2">
                  {project.caseStudy.lessonsLearned.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#3C4043] dark:text-slate-300">
                      <span className="text-[#1A73E8] dark:text-[#38BDF8] select-none font-bold">›</span>
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#202124] dark:text-slate-200 font-mono">
                Component Pipeline & Flow
              </h3>
              <div className="space-y-3">
                {project.caseStudy.systemArchitecture.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#F8F9FA] dark:bg-white/[0.03] border border-[#DADCE0] dark:border-white/[0.08]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#E8F0FE] dark:bg-[#2563EB]/20 border border-[#DADCE0] dark:border-[#2563EB]/40 flex items-center justify-center text-xs font-mono font-bold text-[#1A73E8] dark:text-[#38BDF8]">
                      0{idx + 1}
                    </div>
                    <div className="text-sm font-medium text-[#202124] dark:text-slate-200">
                      {step}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#DADCE0] dark:border-white/[0.08]">
                <div className="text-xs font-mono text-[#5F6368] dark:text-slate-400 uppercase tracking-wider mb-3">
                  Verified Technology Stack
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-[#3C4043] dark:text-slate-300">
                  {project.technologies.map((tech, idx) => (
                    <span key={tech} className="flex items-center gap-2">
                      <span>{tech}</span>
                      {idx < project.technologies.length - 1 && (
                        <span aria-hidden="true" className="text-[#DADCE0] dark:text-slate-600">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Interactive Demo (for Toxic Comment ML) */}
          {activeTab === 'interactive' && project.id === 'toxic-comment-detection' && (
            <div className="space-y-6">
              <div className="bg-[#F8F9FA] dark:bg-[#0D1220] border border-[#DADCE0] dark:border-white/[0.1] p-5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-[#1A73E8] dark:text-[#38BDF8] uppercase tracking-wider font-semibold">
                    Simulated Multilabel Model Inference Pipeline
                  </span>
                  <span className="text-xs text-[#5F6368] dark:text-slate-400 font-mono">FASTAPI MODEL EMULATOR</span>
                </div>

                <div className="space-y-3">
                  <label htmlFor="test-comment-input" className="block text-xs text-[#3C4043] dark:text-slate-300 font-medium">
                    Input social comment string:
                  </label>
                  <textarea
                    id="test-comment-input"
                    value={testComment}
                    onChange={(e) => analyzeComment(e.target.value)}
                    rows={3}
                    className="w-full bg-white dark:bg-[#05070D] border border-[#DADCE0] dark:border-white/20 rounded-lg p-3 text-sm text-[#202124] dark:text-white focus:outline-none focus:border-[#1A73E8] dark:focus:border-[#38BDF8] focus:ring-1 focus:ring-[#1A73E8]"
                    placeholder="Type or test a sentence..."
                  />

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-[#5F6368] dark:text-slate-400">Quick tests:</span>
                    <button
                      onClick={() => analyzeComment('Great work on this open source machine learning pipeline!')}
                      className="text-[#1A73E8] dark:text-[#38BDF8] hover:underline"
                    >
                      "Great work..."
                    </button>
                    <span className="text-[#DADCE0] dark:text-slate-600">·</span>
                    <button
                      onClick={() => analyzeComment('This is terrible, awful and completely stupid.')}
                      className="text-[#EA4335] dark:text-rose-400 hover:underline"
                    >
                      "Toxic sample..."
                    </button>
                    <span className="text-[#DADCE0] dark:text-slate-600">·</span>
                    <button
                      onClick={() => analyzeComment('Stop talking or I will kill your progress.')}
                      className="text-[#B06000] dark:text-amber-400 hover:underline"
                    >
                      "Threat sample..."
                    </button>
                  </div>
                </div>

                {/* Score meters */}
                <div className="mt-6 pt-5 border-t border-[#DADCE0] dark:border-white/[0.08] grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(simulatedScores).map(([label, score]) => {
                    const isAlert = score > 0.4;
                    return (
                      <div key={label} className="bg-white dark:bg-white/[0.02] p-3 rounded-lg border border-[#DADCE0] dark:border-white/[0.05] shadow-xs">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="capitalize text-[#3C4043] dark:text-slate-300 font-mono">{label}</span>
                          <span className={`font-mono font-bold ${isAlert ? 'text-[#EA4335] dark:text-rose-400' : 'text-[#5F6368] dark:text-slate-400'}`}>
                            {(score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-[#E8EAED] dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-200 ${
                              isAlert ? 'bg-[#EA4335]' : 'bg-[#1A73E8] dark:bg-[#38BDF8]'
                            }`}
                            style={{ width: `${Math.max(score * 100, 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 border-t border-[#DADCE0] dark:border-white/[0.08] bg-[#F8F9FA] dark:bg-white/[0.02] flex items-center justify-between text-xs text-[#5F6368] dark:text-slate-400 font-mono">
          <span>STATUS: {project.status}</span>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-[#F1F3F4] hover:bg-[#E8EAED] text-[#202124] dark:bg-white/[0.08] dark:hover:bg-white/[0.15] dark:text-white rounded-lg transition-colors cursor-pointer border border-[#DADCE0] dark:border-transparent"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
