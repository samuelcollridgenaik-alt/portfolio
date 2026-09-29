export type Theme = 'dark' | 'light';

export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  tagline: string;
  description: string;
  status: 'COMPLETED' | 'RESEARCH / DEVELOPMENT' | 'PRODUCTION';
  period: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlights: string[];
  caseStudy: {
    problem: string;
    approach: string;
    systemArchitecture: string[];
    datasetAndPreprocessing?: string;
    modelDetails?: string;
    evaluationData?: string;
    results: string;
    lessonsLearned: string[];
  };
  metrics?: { label: string; value: string }[];
  accentColor: string;
}

export interface TechnologyNode {
  id: string;
  name: string;
  category: 'Languages' | 'AI / Data Science' | 'Web & Backend' | 'Databases & Tools';
  description: string;
  projects: string[]; // project ids
  x?: number;
  y?: number;
  featured?: boolean;
}

export interface Experiment {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  interactiveType: 'latent' | 'vision' | 'audio' | 'pathfinding';
  techStack: string[];
  status: string;
}

export interface Certification {
  id: string;
  title: string;
  provider: string;
  duration: string;
  period: string;
  credentialId?: string;
  topics: string[];
  description: string;
  verified: boolean;
}
