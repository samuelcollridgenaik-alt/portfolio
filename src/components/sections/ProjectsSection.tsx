import React, { useState } from 'react';
import { ArrowUpRight, Github, ExternalLink, Sparkles, Code2, Database } from 'lucide-react';
import { PROJECTS_DATA } from '../../data/projectsData';
import { Project, Theme } from '../../types/portfolio';
import { soundEngine } from '../../utils/soundEngine';

interface ProjectsSectionProps {
  theme: Theme;
  onSelectProject: (project: Project) => void;
  highlightedTechId?: string | null;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  theme,
  onSelectProject,
  highlightedTechId,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Projects', shortLabel: 'All' },
    { id: 'ml', label: 'AI & Machine Learning', shortLabel: 'AI & ML' },
    { id: 'web', label: 'Full Stack & Web', shortLabel: 'Full Stack' },
    { id: 'desktop', label: 'Systems & Desktop', shortLabel: 'Systems' },
  ];

  const filteredProjects = PROJECTS_DATA.filter((proj) => {
    if (filter === 'ml') return proj.category.includes('MACHINE LEARNING') || proj.category.includes('COMPUTER VISION');
    if (filter === 'web') return proj.category.includes('FULL STACK') || proj.category.includes('PRODUCTION');
    if (filter === 'desktop') return proj.category.includes('DESKTOP') || proj.category.includes('DATABASE');
    return true;
  });

  return (
    <section id="work" className="relative py-16 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-16 pb-6 sm:pb-8 border-b border-[#DADCE0] dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#1A73E8] dark:text-[#38BDF8] uppercase tracking-widest mb-3 font-semibold">
            <span>01</span>
            <span aria-hidden="true">/</span>
            <span>SYSTEM DIRECTORY</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-[#202124] dark:text-white tracking-tight">
            SELECTED WORK
          </h2>
          <p className="text-sm sm:text-base text-[#5F6368] dark:text-slate-400 mt-2 max-w-xl">
            Production web platforms, applied machine learning pipelines, and spatial computer vision frameworks.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="w-full md:w-auto overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#F1F3F4] dark:bg-white/[0.04] rounded-xl border border-[#DADCE0] dark:border-white/[0.06] w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  soundEngine.playClick();
                  setFilter(cat.id);
                }}
                className={`flex-1 sm:flex-none text-center px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  filter === cat.id
                    ? 'bg-[#1A73E8] text-white shadow-sm font-semibold'
                    : 'text-[#5F6368] hover:text-[#202124] dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span className="hidden sm:inline">{cat.label}</span>
                <span className="inline sm:hidden">{cat.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredProjects.map((project, index) => {
          const isHighlighted =
            highlightedTechId &&
            project.technologies.some((tech) =>
              tech.toLowerCase().includes(highlightedTechId.toLowerCase())
            );
          const isHovered = hoveredProjectId === project.id;

          return (
            <article
              key={project.id}
              onMouseEnter={() => {
                soundEngine.playHover();
                setHoveredProjectId(project.id);
              }}
              onMouseLeave={() => setHoveredProjectId(null)}
              onClick={() => {
                soundEngine.playClick();
                onSelectProject(project);
              }}
              className={`group relative rounded-2xl border transition-all duration-300 p-7 flex flex-col justify-between cursor-pointer overflow-hidden ${
                isHighlighted
                  ? 'border-[#1A73E8] dark:border-[#38BDF8] bg-[#E8F0FE]/70 dark:bg-[#0E1626] shadow-md dark:shadow-[0_0_30px_rgba(56,189,248,0.25)]'
                  : isHovered
                  ? 'border-[#1A73E8] dark:border-white/20 bg-white dark:bg-white/[0.04] shadow-[0_4px_20px_rgba(60,64,67,0.15)] -translate-y-1'
                  : 'border-[#DADCE0] dark:border-white/[0.08] bg-white dark:bg-[#070A11]/60 shadow-[0_1px_3px_rgba(60,64,67,0.08)]'
              }`}
              data-cursor="explore"
            >
              {/* Dynamic Accent Lighting */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none transition-opacity duration-300"
                style={{
                  backgroundColor: project.accentColor,
                  opacity: isHovered ? 0.12 : 0.03,
                }}
              />

              {/* Top Card Metadata */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#5F6368] dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1A73E8] dark:text-[#38BDF8] font-bold">{project.number}</span>
                    <span aria-hidden="true">·</span>
                    <span className="uppercase tracking-wider">{project.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{project.period}</span>
                    {project.status === 'RESEARCH / DEVELOPMENT' && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#EA4335] dark:text-amber-400 font-semibold">R&D</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#202124] dark:text-white group-hover:text-[#1A73E8] dark:group-hover:text-[#38BDF8] transition-colors leading-tight">
                  {project.title}
                </h3>
                <div className="text-xs text-[#5F6368] dark:text-slate-400 font-mono mt-1 mb-4">
                  {project.subtitle}
                </div>

                {/* Tagline & Description */}
                <p className="text-sm text-[#3C4043] dark:text-slate-300 leading-relaxed font-normal mb-6">
                  {project.description}
                </p>

                {/* Key Metrics / Highlights */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 py-4 my-2 border-y border-[#DADCE0] dark:border-white/[0.06]">
                    {project.metrics.map((m, i) => (
                      <div key={i} className="text-left">
                        <div className="text-[11px] font-mono text-[#5F6368] dark:text-slate-400 truncate">
                          {m.label}
                        </div>
                        <div className="text-sm font-mono font-bold text-[#202124] dark:text-white tabular-nums">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-6 mt-4 border-t border-[#DADCE0] dark:border-white/[0.06] flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#5F6368] dark:text-slate-400">
                  {project.technologies.slice(0, 4).map((tech, i) => (
                    <span key={tech} className="flex items-center gap-2">
                      <span className={highlightedTechId?.toLowerCase() === tech.toLowerCase() ? 'text-[#1A73E8] dark:text-[#38BDF8] font-bold' : ''}>
                        {tech}
                      </span>
                      {i < Math.min(project.technologies.length, 4) - 1 && (
                        <span aria-hidden="true" className="text-[#DADCE0] dark:text-slate-600">·</span>
                      )}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-[#5F6368] font-mono">+{project.technologies.length - 4}</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1A73E8] dark:text-[#38BDF8] group-hover:translate-x-1 transition-transform shrink-0">
                  <span>Case Study</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
