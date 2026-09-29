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
    <section id="stack" className="relative py-28 px-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-widest mb-3">
          <span>02</span>
          <span aria-hidden="true">/</span>
          <span>COMPUTATIONAL GRAPH</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
          TECHNOLOGY CONSTELLATION
        </h2>
        <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600 mt-3 leading-relaxed">
          An interactive topological map of verified languages, architectures, and toolchains.
          Hover or click any node to illuminate connected production systems.
        </p>
      </div>

      {/* Interactive Constellation Visualizer */}
      <div className="relative rounded-3xl border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 bg-[#060810]/70 dark:bg-[#060810]/70 light:bg-white/80 p-4 sm:p-8 backdrop-blur-xl overflow-hidden shadow-2xl">
        <ConstellationCanvas
          theme={theme}
          selectedTechId={selectedTech?.id || null}
          onSelectTechnology={handleSelectTech}
        />

        {/* Selected Technology Inspector Drawer */}
        {selectedTech && (
          <div className="mt-8 pt-6 border-t border-white/[0.08] dark:border-white/[0.08] light:border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div>
                <div className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider mb-1">
                  Active Node // {selectedTech.category}
                </div>
                <h3 className="text-2xl font-display font-bold text-white dark:text-white light:text-slate-900">
                  {selectedTech.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mt-2 leading-relaxed">
                  {selectedTech.description}
                </p>
              </div>

              {/* Connected Work Showcase */}
              <div className="md:col-span-2">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                  Applied in Verified Projects ({linkedProjects.length})
                </div>
                {linkedProjects.length === 0 ? (
                  <div className="text-xs text-slate-500 font-mono py-2">
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
                        className="p-3.5 rounded-xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-50 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 hover:border-[#38BDF8] transition-all cursor-pointer flex items-center justify-between group"
                        data-cursor="action"
                      >
                        <div>
                          <div className="text-[11px] font-mono text-[#38BDF8]">
                            PROJECT {project.number}
                          </div>
                          <div className="text-sm font-semibold text-white dark:text-white light:text-slate-900 group-hover:text-[#38BDF8] transition-colors truncate max-w-[200px]">
                            {project.title}
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#38BDF8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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
