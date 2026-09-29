import React, { useState, useEffect, useRef } from 'react';
import { EXPERIMENTS_DATA } from '../../data/experimentsData';
import { Experiment, Theme } from '../../types/portfolio';
import { Play, Sparkles, Sliders, RefreshCw, Volume2, ShieldCheck, Activity } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface LabSectionProps {
  theme: Theme;
}

export const LabSection: React.FC<LabSectionProps> = ({ theme }) => {
  const [activeExpId, setActiveExpId] = useState<string>('latent-perturbation');

  // Latent Probe State
  const [latentCoords, setLatentCoords] = useState({ x: 0.5, y: 0.5 });
  const latentCanvasRef = useRef<HTMLCanvasElement>(null);

  // Audio Synth State
  const [synthFreq, setSynthFreq] = useState(440);
  const [synthType, setSynthType] = useState<OscillatorType>('sine');
  const [isSynthPlaying, setIsSynthPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const audioCanvasRef = useRef<HTMLCanvasElement>(null);

  // Vision Kernel State
  const [kernelType, setKernelType] = useState<'sobel' | 'laplacian' | 'blur'>('sobel');
  const visionCanvasRef = useRef<HTMLCanvasElement>(null);

  // A* Grid State
  const [grid, setGrid] = useState<number[][]>(() => {
    const initial = Array(8).fill(0).map(() => Array(12).fill(0));
    // Sample obstacles
    initial[2][4] = 1; initial[3][4] = 1; initial[4][4] = 1; initial[5][4] = 1;
    initial[2][8] = 1; initial[3][8] = 1; initial[4][8] = 1;
    return initial;
  });
  const [startPos] = useState({ r: 3, c: 1 });
  const [targetPos] = useState({ r: 3, c: 10 });
  const [path, setPath] = useState<{ r: number; c: number }[]>([]);

  // 1. Render Latent Space Canvas
  useEffect(() => {
    if (activeExpId !== 'latent-perturbation') return;
    const canvas = latentCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let t = 0;

    const renderLatent = () => {
      t += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const rows = 18;
      const cols = 24;
      const cellW = w / cols;
      const cellH = h / rows;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const u = c / cols;
          const v = r / rows;

          const dist = Math.hypot(u - latentCoords.x, v - latentCoords.y);
          const z = Math.sin(dist * 12 - t * 3) * Math.cos(u * 6 + latentCoords.x * 4) * 20;

          const px = c * cellW + cellW / 2;
          const py = r * cellH + cellH / 2 + z;

          if (c === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = theme === 'dark' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(26, 115, 232, 0.7)';
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }

      // Draw active probe point
      ctx.beginPath();
      ctx.arc(latentCoords.x * w, latentCoords.y * h, 7, 0, Math.PI * 2);
      ctx.fillStyle = theme === 'dark' ? '#38BDF8' : '#1A73E8';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      frameId = requestAnimationFrame(renderLatent);
    };

    renderLatent();
    return () => cancelAnimationFrame(frameId);
  }, [activeExpId, latentCoords, theme]);

  // 2. Vision Kernel Operator
  useEffect(() => {
    if (activeExpId !== 'vision-convolutions') return;
    const canvas = visionCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const isDark = theme === 'dark';

    // Draw procedural shapes
    ctx.fillStyle = isDark ? '#05070D' : '#F1F3F4';
    ctx.fillRect(0, 0, w, h);

    // Geometric objects to detect edges of
    ctx.fillStyle = isDark ? '#FFFFFF' : '#202124';
    ctx.beginPath();
    ctx.arc(w * 0.35, h * 0.5, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(w * 0.6, h * 0.3, 70, 70);

    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.2);
    ctx.lineTo(w * 0.55, h * 0.8);
    ctx.lineTo(w * 0.45, h * 0.8);
    ctx.closePath();
    ctx.fill();

    // Perform real canvas convolution processing
    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const copy = new Uint8ClampedArray(data);

      const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
      const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;

          if (kernelType === 'sobel') {
            let gx = 0;
            let gy = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const kIdx = ((y + ky) * w + (x + kx)) * 4;
                const weightX = sobelX[(ky + 1) * 3 + (kx + 1)];
                const weightY = sobelY[(ky + 1) * 3 + (kx + 1)];
                gx += copy[kIdx] * weightX;
                gy += copy[kIdx] * weightY;
              }
            }
            const mag = Math.min(Math.sqrt(gx * gx + gy * gy), 255);
            if (isDark) {
              data[idx] = mag > 100 ? 56 : 0;
              data[idx + 1] = mag > 100 ? 189 : 0;
              data[idx + 2] = mag > 100 ? 248 : 0;
            } else {
              // Google Blue edge highlights on light background
              data[idx] = mag > 80 ? 26 : 248;
              data[idx + 1] = mag > 80 ? 115 : 249;
              data[idx + 2] = mag > 80 ? 232 : 250;
            }
          } else if (kernelType === 'laplacian') {
            let val = copy[idx] * -4;
            val += copy[((y - 1) * w + x) * 4];
            val += copy[((y + 1) * w + x) * 4];
            val += copy[(y * w + (x - 1)) * 4];
            val += copy[(y * w + (x + 1)) * 4];
            const clamped = Math.min(Math.max(val, 0), 255);
            if (isDark) {
              data[idx] = clamped;
              data[idx + 1] = clamped > 50 ? 200 : 0;
              data[idx + 2] = 255;
            } else {
              // Google Red / Blue gradient edges
              data[idx] = clamped > 50 ? 234 : 248;
              data[idx + 1] = clamped > 50 ? 67 : 249;
              data[idx + 2] = clamped > 50 ? 53 : 250;
            }
          } else if (kernelType === 'blur') {
            let avgR = 0, avgG = 0, avgB = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const kIdx = ((y + ky) * w + (x + kx)) * 4;
                avgR += copy[kIdx];
                avgG += copy[kIdx + 1];
                avgB += copy[kIdx + 2];
              }
            }
            data[idx] = avgR / 9;
            data[idx + 1] = avgG / 9;
            data[idx + 2] = avgB / 9;
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch {
      // Fallback
    }
  }, [activeExpId, kernelType, theme]);

  // 3. Audio Synthesizer Engine
  const toggleSynth = () => {
    if (isSynthPlaying) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      setIsSynthPlaying(false);
    } else {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = synthType;
      osc.frequency.setValueAtTime(synthFreq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsSynthPlaying(true);
    }
  };

  useEffect(() => {
    if (oscRef.current && audioContextRef.current) {
      oscRef.current.frequency.setValueAtTime(synthFreq, audioContextRef.current.currentTime);
      oscRef.current.type = synthType;
    }
  }, [synthFreq, synthType]);

  // Clean audio on unmount or tab switch
  useEffect(() => {
    if (activeExpId !== 'audio-synthesizer' && isSynthPlaying) {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
          oscRef.current = null;
        } catch {
          // ignore
        }
      }
      setIsSynthPlaying(false);
    }
  }, [activeExpId, isSynthPlaying]);

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // 4. A* Algorithm Computation
  useEffect(() => {
    // Run simple A* search
    const rows = 8;
    const cols = 12;

    interface Node {
      r: number;
      c: number;
      g: number;
      h: number;
      f: number;
      parent: Node | null;
    }

    const openSet: Node[] = [];
    const closedSet = new Set<string>();

    const hCost = (r: number, c: number) =>
      Math.abs(r - targetPos.r) + Math.abs(c - targetPos.c);

    const startNode: Node = {
      r: startPos.r,
      c: startPos.c,
      g: 0,
      h: hCost(startPos.r, startPos.c),
      f: hCost(startPos.r, startPos.c),
      parent: null,
    };
    openSet.push(startNode);

    let foundTarget: Node | null = null;

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;

      if (current.r === targetPos.r && current.c === targetPos.c) {
        foundTarget = current;
        break;
      }

      closedSet.add(`${current.r},${current.c}`);

      const neighbors = [
        { r: current.r - 1, c: current.c },
        { r: current.r + 1, c: current.c },
        { r: current.r, c: current.c - 1 },
        { r: current.r, c: current.c + 1 },
      ];

      for (const n of neighbors) {
        if (n.r < 0 || n.r >= rows || n.c < 0 || n.c >= cols) continue;
        if (grid[n.r][n.c] === 1) continue; // obstacle
        if (closedSet.has(`${n.r},${n.c}`)) continue;

        const g = current.g + 1;
        const h = hCost(n.r, n.c);
        const f = g + h;

        const existing = openSet.find((item) => item.r === n.r && item.c === n.c);
        if (!existing) {
          openSet.push({ r: n.r, c: n.c, g, h, f, parent: current });
        } else if (g < existing.g) {
          existing.g = g;
          existing.f = f;
          existing.parent = current;
        }
      }
    }

    const calculatedPath: { r: number; c: number }[] = [];
    let curr = foundTarget;
    while (curr) {
      calculatedPath.unshift({ r: curr.r, c: curr.c });
      curr = curr.parent;
    }
    setPath(calculatedPath);
  }, [grid, startPos, targetPos]);

  const toggleObstacle = (r: number, c: number) => {
    if ((r === startPos.r && c === startPos.c) || (r === targetPos.r && c === targetPos.c)) return;
    soundEngine.playClick();
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = next[r][c] === 1 ? 0 : 1;
      return next;
    });
  };

  const selectedExperiment = EXPERIMENTS_DATA.find((e) => e.id === activeExpId) || EXPERIMENTS_DATA[0];

  return (
    <section id="lab" className="relative py-16 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-16 pb-6 sm:pb-8 border-b border-[#DADCE0] dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#1A73E8] dark:text-[#38BDF8] uppercase tracking-widest mb-3 font-semibold">
            <span>04</span>
            <span aria-hidden="true">/</span>
            <span>DIGITAL PROVING GROUND</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-[#202124] dark:text-white tracking-tight">
            THE LAB
          </h2>
          <p className="text-sm sm:text-base text-[#5F6368] dark:text-slate-400 mt-2 max-w-xl">
            Live interactive simulations, signal processing experiments, and algorithmic prototypes.
          </p>
        </div>

        {/* Experiment Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {EXPERIMENTS_DATA.map((exp) => (
            <button
              key={exp.id}
              onClick={() => {
                soundEngine.playClick();
                setActiveExpId(exp.id);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeExpId === exp.id
                  ? 'bg-[#1A73E8] text-white shadow-sm'
                  : 'bg-[#F1F3F4] hover:bg-[#E8EAED] text-[#3C4043] border border-[#DADCE0] dark:bg-white/[0.04] dark:text-slate-400 dark:hover:text-white dark:border-white/[0.06]'
              }`}
              data-cursor="action"
            >
              {exp.number}
            </button>
          ))}
        </div>
      </div>

      {/* Main Experiment Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Experiment Meta & Instructions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-[#DADCE0] dark:border-white/[0.08] bg-white dark:bg-[#070A11]/60 p-6 backdrop-blur-md shadow-[0_2px_12px_rgba(60,64,67,0.08)]">
            <div className="flex items-center justify-between text-xs font-mono text-[#5F6368] dark:text-slate-400 mb-2">
              <span className="text-[#1A73E8] dark:text-[#38BDF8] font-bold">{selectedExperiment.number}</span>
              <span className="uppercase">{selectedExperiment.category}</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-[#202124] dark:text-white">
              {selectedExperiment.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-slate-400 mt-3 leading-relaxed">
              {selectedExperiment.description}
            </p>

            <div className="mt-6 pt-4 border-t border-[#DADCE0] dark:border-white/[0.08] space-y-2">
              <div className="text-xs font-mono text-[#5F6368] dark:text-slate-400 uppercase tracking-wider">
                Technology Concepts
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#3C4043] dark:text-slate-300">
                {selectedExperiment.techStack.map((tech, i) => (
                  <span key={tech} className="flex items-center gap-2">
                    <span>{tech}</span>
                    {i < selectedExperiment.techStack.length - 1 && (
                      <span aria-hidden="true" className="text-[#DADCE0] dark:text-slate-600">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[11px] font-mono text-[#137333] dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
                <span>{selectedExperiment.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Canvas Area */}
        <div className="lg:col-span-8 rounded-2xl border border-[#DADCE0] dark:border-white/[0.08] bg-white dark:bg-[#070A11]/80 p-6 backdrop-blur-xl min-h-[460px] flex flex-col justify-between shadow-[0_2px_12px_rgba(60,64,67,0.08)]">
          {/* 1. Latent Manifold Canvas */}
          {activeExpId === 'latent-perturbation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#5F6368] dark:text-slate-400 font-mono">
                <span>INTERACTIVE 2D LATENT MANIFOLD PROBE</span>
                <span>DRAG / HOVER TO PERTURB TOPOLOGY</span>
              </div>

              <div
                className="relative w-full h-[320px] rounded-xl bg-[#F8F9FA] dark:bg-[#030408] border border-[#DADCE0] dark:border-white/[0.06] overflow-hidden cursor-crosshair shadow-inner"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width;
                  const y = (e.clientY - rect.top) / rect.height;
                  setLatentCoords({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
                }}
              >
                <canvas
                  ref={latentCanvasRef}
                  width={640}
                  height={320}
                  className="w-full h-full"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#5F6368] dark:text-slate-400">
                <span>Latent Coordinates: (x: {latentCoords.x.toFixed(2)}, y: {latentCoords.y.toFixed(2)})</span>
                <span className="text-[#1A73E8] dark:text-[#38BDF8] font-semibold">Harmonic Mesh Mode</span>
              </div>
            </div>
          )}

          {/* 2. Vision Convolution Kernel Inspector */}
          {activeExpId === 'vision-convolutions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#5F6368] dark:text-slate-400 font-mono">
                <span>IMAGE MATRIX CONVOLUTION OPERATOR</span>
                <div className="flex gap-2">
                  {(['sobel', 'laplacian', 'blur'] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => {
                        soundEngine.playClick();
                        setKernelType(k);
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize cursor-pointer transition-colors ${
                        kernelType === k
                          ? 'bg-[#1A73E8] dark:bg-[#38BDF8] text-white dark:text-slate-900 font-bold shadow-xs'
                          : 'bg-[#F1F3F4] hover:bg-[#E8EAED] text-[#3C4043] dark:bg-white/10 dark:text-slate-300'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full h-[320px] rounded-xl bg-[#F8F9FA] dark:bg-[#030408] border border-[#DADCE0] dark:border-white/[0.06] overflow-hidden flex items-center justify-center shadow-inner">
                <canvas
                  ref={visionCanvasRef}
                  width={640}
                  height={320}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-xs font-mono text-[#5F6368] dark:text-slate-400">
                Real-time 3×3 spatial gradient calculation executed directly on canvas pixel buffer.
              </div>
            </div>
          )}

          {/* 3. Audio Waveform Synthesizer */}
          {activeExpId === 'audio-synthesizer' && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between text-xs text-[#5F6368] dark:text-slate-400 font-mono">
                <span>PARAMETRIC HARMONIC OSCILLATOR</span>
                <span>WEB AUDIO ENGINE</span>
              </div>

              <div className="flex flex-col items-center justify-center p-8 bg-[#F8F9FA] dark:bg-[#030408] rounded-xl border border-[#DADCE0] dark:border-white/[0.06] text-center space-y-6 shadow-xs">
                <button
                  onClick={toggleSynth}
                  className={`px-6 py-3 rounded-xl font-mono text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSynthPlaying
                      ? 'bg-[#EA4335] hover:bg-[#D93025] text-white shadow-[0_2px_10px_rgba(234,67,53,0.35)]'
                      : 'bg-[#1A73E8] hover:bg-[#174EA6] text-white shadow-[0_2px_10px_rgba(26,115,232,0.35)]'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isSynthPlaying ? 'STOP OSCILLATOR' : 'START HARMONIC OSCILLATOR'}</span>
                </button>

                <div className="w-full max-w-md space-y-4">
                  <div className="flex justify-between text-xs font-mono text-[#202124] dark:text-slate-300">
                    <span>Frequency: {synthFreq} Hz</span>
                    <span className="uppercase text-[#1A73E8] dark:text-[#38BDF8] font-bold">{synthType}</span>
                  </div>
                  <input
                    type="range"
                    min="110"
                    max="880"
                    step="5"
                    value={synthFreq}
                    onChange={(e) => setSynthFreq(Number(e.target.value))}
                    className="w-full accent-[#1A73E8] dark:accent-[#38BDF8] cursor-pointer"
                  />
                  <div className="flex justify-center gap-3">
                    {(['sine', 'triangle', 'sawtooth'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          soundEngine.playClick();
                          setSynthType(type);
                        }}
                        className={`px-3 py-1 rounded text-xs font-mono capitalize cursor-pointer transition-colors ${
                          synthType === type
                            ? 'bg-[#1A73E8] dark:bg-[#38BDF8] text-white dark:text-slate-900 font-bold shadow-xs'
                            : 'bg-white dark:bg-white/10 text-[#3C4043] dark:text-slate-300 border border-[#DADCE0] dark:border-transparent hover:bg-[#F1F3F4]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono text-[#5F6368] dark:text-slate-400 text-center">
                Audio is client-generated via browser Web Audio API OscillatorNodes and GainNodes.
              </div>
            </div>
          )}

          {/* 4. A* Grid Router */}
          {activeExpId === 'pathfinding-engine' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#5F6368] dark:text-slate-400 font-mono">
                <span>A* GRAPH PATHFINDING MATRIX</span>
                <span className="text-[#1A73E8] dark:text-[#38BDF8] font-semibold">CLICK CELLS TO TOGGLE OBSTACLES</span>
              </div>

              <div className="p-4 bg-[#F8F9FA] dark:bg-[#030408] rounded-xl border border-[#DADCE0] dark:border-white/[0.06] flex flex-col items-center shadow-xs">
                <div className="grid grid-cols-12 gap-1.5 w-full max-w-lg">
                  {grid.map((row, r) =>
                    row.map((cell, c) => {
                      const isStart = r === startPos.r && c === startPos.c;
                      const isTarget = r === targetPos.r && c === targetPos.c;
                      const isObstacle = cell === 1;
                      const isPath = path.some((p) => p.r === r && p.c === c);

                      let bg = 'bg-white dark:bg-white/[0.04] border border-[#DADCE0] dark:border-transparent hover:bg-[#E8F0FE] dark:hover:bg-white/[0.1]';
                      if (isStart) bg = 'bg-[#34A853] text-white shadow-[0_0_8px_rgba(52,168,83,0.5)]';
                      else if (isTarget) bg = 'bg-[#EA4335] text-white shadow-[0_0_8px_rgba(234,67,53,0.5)]';
                      else if (isObstacle) bg = 'bg-[#3C4043] dark:bg-slate-700';
                      else if (isPath) bg = 'bg-[#1A73E8] dark:bg-[#38BDF8] text-white shadow-[0_0_6px_rgba(26,115,232,0.5)]';

                      return (
                        <button
                          key={`${r}-${c}`}
                          onClick={() => toggleObstacle(r, c)}
                          className={`aspect-square rounded transition-all cursor-pointer ${bg}`}
                          title={`Cell (${r}, ${c})`}
                        />
                      );
                    })
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs font-mono text-[#5F6368] dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#34A853]" />
                    <span>Start</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#EA4335]" />
                    <span>Target</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded ${path.length > 0 ? 'bg-[#1A73E8] dark:bg-[#38BDF8]' : 'bg-[#FBBC04]'}`} />
                    <span className={path.length === 0 ? 'text-[#B06000] dark:text-amber-400 font-semibold' : 'text-[#1A73E8] dark:text-[#38BDF8] font-semibold'}>
                      {path.length > 0 ? `Calculated Route (${path.length} hops)` : 'Route Blocked by Walls'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#3C4043] dark:bg-slate-700" />
                    <span>Wall</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
