import React, { useState } from 'react';
import { ConstellationCanvas } from '../canvas/ConstellationCanvas';
import { TECHNOLOGIES_DATA } from '../../data/technologiesData';
import { PROJECTS_DATA } from '../../data/projectsData';
import { TechnologyNode, Theme, Project } from '../../types/portfolio';
import { ArrowUpRight, Cpu, Layers } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface TechConstellationSectionProps {
  theme: Theme;
  onSelectProject: (project: Project) => void;
  onHighlightTech: (techId: string | null) => void;
}

export const TechConstellationSection: React.FC<TechConstellationSectionProps> = ({
  theme,
  onSelectProject,
  onHighlightTech,
}) => {
  const [selectedTech, setSelectedTech] = useState<TechnologyNode | null>(TECHNOLOGIES_DATA[0]);

  const handleSelectTech = (tech: TechnologyNode | null) => {
    setSelectedTech(tech);
    onHighlightTech(tech ? tech.name : null);
  };

  // Find projects that use this technology
  const linkedProjects = selectedTech
    ? PROJECTS_DATA.filter((p) => selectedTech.projects.includes(p.id))
    : [];

  return (
    <section id="stack" className="relative py-16 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#1A73E8] dark:text-[#38BDF8] uppercase tracking-widest mb-2 sm:mb-3 font-semibold">
          <span>02</span>
          <span aria-hidden="true">/</span>
          <span>COMPUTATIONAL GRAPH</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-[#202124] dark:text-white tracking-tight">
          TECHNOLOGY CONSTELLATION
        </h2>
        <p className="text-xs sm:text-base text-[#5F6368] dark:text-slate-400 mt-2 sm:mt-3 leading-relaxed">
          An interactive topological map of verified languages, architectures, and toolchains.
          Hover or tap any node to illuminate connected production systems.
        </p>
      </div>

      {/* Interactive Constellation Visualizer */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-[#DADCE0] dark:border-white/[0.08] bg-white dark:bg-[#060810]/70 p-3 sm:p-8 backdrop-blur-xl overflow-hidden shadow-[0_2px_12px_rgba(60,64,67,0.08)]">
        <ConstellationCanvas
          theme={theme}
          selectedTechId={selectedTech?.id || null}
          onSelectTechnology={handleSelectTech}
        />

        {/* Mobile Fast-Selection Tech Chips */}
        <div className="md:hidden mt-3 pt-3 border-t border-[#DADCE0] dark:border-white/[0.08]">
          <div className="text-[11px] font-mono text-[#5F6368] dark:text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
            <span>Tap node on map or choose:</span>
            <span className="text-[#1A73E8] dark:text-[#38BDF8]">{selectedTech?.name}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pb-1">
            {TECHNOLOGIES_DATA.map((t) => {
              const isSelected = selectedTech?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    soundEngine.playClick();
                    handleSelectTech(t);
                  }}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A73E8] text-white font-semibold shadow-xs'
                      : 'bg-[#F8F9FA] dark:bg-white/[0.05] text-[#3C4043] dark:text-slate-300 border border-[#DADCE0] dark:border-white/10'
                  }`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Technology Inspector Drawer */}
        {selectedTech && (
          <div className="mt-8 pt-6 border-t border-[#DADCE0] dark:border-white/[0.08]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div>
                <div className="text-xs font-mono text-[#1A73E8] dark:text-[#38BDF8] uppercase tracking-wider mb-1 font-semibold">
                  Active Node // {selectedTech.category}
                </div>
                <h3 className="text-2xl font-display font-bold text-[#202124] dark:text-white">
                  {selectedTech.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6368] dark:text-slate-400 mt-2 leading-relaxed">
                  {selectedTech.description}
                </p>
              </div>

              {/* Connected Work Showcase */}
              <div className="md:col-span-2">
                <div className="text-xs font-mono text-[#5F6368] dark:text-slate-400 uppercase tracking-wider mb-3">
                  Applied in Verified Projects ({linkedProjects.length})
                </div>
                {linkedProjects.length === 0 ? (
                  <div className="text-xs text-[#5F6368] font-mono py-2">
                    Applied in core architectural utilities, scripting, and system benchmarks.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {linkedProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => {
                          soundEngine.playClick();
                          onSelectProject(project);
                        }}
                        className="p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-white/[0.03] border border-[#DADCE0] dark:border-white/[0.08] hover:border-[#1A73E8] dark:hover:border-[#38BDF8] transition-all cursor-pointer flex items-center justify-between group shadow-2xs hover:shadow-xs"
                        data-cursor="action"
                      >
                        <div>
                          <div className="text-[11px] font-mono text-[#1A73E8] dark:text-[#38BDF8]">
                            PROJECT {project.number}
                          </div>
                          <div className="text-sm font-semibold text-[#202124] dark:text-white group-hover:text-[#1A73E8] dark:group-hover:text-[#38BDF8] transition-colors truncate max-w-[200px]">
                            {project.title}
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#5F6368] group-hover:text-[#1A73E8] dark:group-hover:text-[#38BDF8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
