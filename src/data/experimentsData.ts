import { Experiment } from '../types/portfolio';

export const EXPERIMENTS_DATA: Experiment[] = [
  {
    id: 'latent-perturbation',
    number: 'EXP_01',
    title: 'Neural Latent Space Manifold Probe',
    category: 'DEEP LEARNING / GENERATIVE',
    description: 'Interactive visualization exploring high-dimensional embedding spaces, vector interpolation, and continuous latent manifold transitions.',
    interactiveType: 'latent',
    techStack: ['Python Concept', 'WebGL', 'Vector Math', 'Canvas API'],
    status: 'INTERACTIVE BENCHMARK',
  },
  {
    id: 'vision-convolutions',
    number: 'EXP_02',
    title: 'Real-Time Edge & Spatial Kernel Inspector',
    category: 'COMPUTER VISION / SIGNAL PROCESSING',
    description: 'Live procedural convolution kernel operator executing Sobel edge detection, Gaussian blurring, and Laplacian gradient transforms on canvas image buffers.',
    interactiveType: 'vision',
    techStack: ['Image Processing', 'Convolution Kernels', 'Canvas 2D', 'Computer Vision'],
    status: 'LIVE RUNTIME',
  },
  {
    id: 'audio-synthesizer',
    number: 'EXP_03',
    title: 'Parametric Frequency & Waveform Synthesizer',
    category: 'AUDIO SIGNAL / DSP',
    description: 'Real-time harmonic frequency generator with interactive waveform oscillation (sine, triangle, sawtooth), frequency modulation, and live Fourier spectrum visualization.',
    interactiveType: 'audio',
    techStack: ['Web Audio API', 'OscillatorNodes', 'FFT Analyzer', 'Harmonic Physics'],
    status: 'AUDIO ENGINE',
  },
  {
    id: 'pathfinding-engine',
    number: 'EXP_04',
    title: 'A* Heuristic Spatial Grid Router',
    category: 'ALGORITHMS & GRAPH THEORY',
    description: 'Live interactive pathfinding simulator computing optimal graph traversal through obstacle matrices using Manhattan distance heuristics.',
    interactiveType: 'pathfinding',
    techStack: ['A* Search', 'Graph Algorithms', 'Priority Queue', 'Spatial Heuristics'],
    status: 'SIMULATOR ACTIVE',
  },
];
