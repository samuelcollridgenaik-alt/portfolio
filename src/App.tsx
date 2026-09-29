import React, { useState, useEffect } from 'react';
import { Header } from './components/ui/Header';
import { Footer } from './components/ui/Footer';
import { Cursor } from './components/ui/Cursor';
import { BootSequence } from './components/ui/BootSequence';
import { HeroSection } from './components/sections/HeroSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ProjectModal } from './components/sections/ProjectModal';
import { TechConstellationSection } from './components/sections/TechConstellationSection';
import { AboutSection } from './components/sections/AboutSection';
import { LabSection } from './components/sections/LabSection';
import { CertificationsSection } from './components/sections/CertificationsSection';
import { ResumeModal } from './components/sections/ResumeModal';
import { ContactSection } from './components/sections/ContactSection';
import { Project, Theme } from './types/portfolio';
import { initFaviconAnimation } from './utils/faviconAnimator';

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isBooted, setIsBooted] = useState<boolean>(() => {
    return sessionStorage.getItem('samuel_booted') === 'true';
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [highlightedTech, setHighlightedTech] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('hero');

  // Initialize animated SCN favicon
  useEffect(() => {
    const cleanup = initFaviconAnimation();
    return cleanup;
  }, []);

  // Sync theme class to html/body
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Track active section on scroll
  useEffect(() => {
    const sectionIds = ['hero', 'work', 'stack', 'about', 'lab', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBootComplete = () => {
    setIsBooted(true);
    sessionStorage.setItem('samuel_booted', 'true');
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] dark:bg-[#040508] dark:text-[#E2E8F0] font-sans relative selection:bg-[#E8F0FE] selection:text-[#1A73E8] dark:selection:bg-[#38BDF8] dark:selection:text-black transition-colors duration-300">
      {/* Interactive adaptive cursor */}
      <Cursor theme={theme} />

      {/* Futuristic boot sequence on first visit */}
      {!isBooted && <BootSequence onComplete={handleBootComplete} />}

      {/* Fixed Navigation Header */}
      <Header
        theme={theme}
        onOpenResume={() => setIsResumeOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Experience Stream */}
      <main className="relative z-10 flex flex-col">
        {/* 1. Hero */}
        <HeroSection
          theme={theme}
          onExploreWork={() => handleScrollTo('work')}
          onContactClick={() => handleScrollTo('contact')}
        />

        {/* 2. Selected Work */}
        <ProjectsSection
          theme={theme}
          onSelectProject={(project) => setSelectedProject(project)}
          highlightedTechId={highlightedTech}
        />

        {/* 3. Technology Constellation */}
        <TechConstellationSection
          theme={theme}
          onSelectProject={(project) => setSelectedProject(project)}
          onHighlightTech={(tech) => setHighlightedTech(tech)}
        />

        {/* 4. About & Academic Trajectory */}
        <AboutSection
          theme={theme}
          onOpenResume={() => setIsResumeOpen(true)}
        />

        {/* 5. The Lab (Interactive Prototypes) */}
        <LabSection theme={theme} />

        {/* 6. Certifications */}
        <CertificationsSection theme={theme} />

        {/* 7. Contact Terminal */}
        <ContactSection theme={theme} />
      </main>

      {/* Footer */}
      <Footer theme={theme} />

      {/* Deep Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        theme={theme}
      />

      {/* Verified Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        theme={theme}
      />
    </div>
  );
}
