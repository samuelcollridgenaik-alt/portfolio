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
        ctx.strokeStyle = theme === 'dark' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(37, 99, 235, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Draw active probe point
      ctx.beginPath();
      ctx.arc(latentCoords.x * w, latentCoords.y * h, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#38BDF8';
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

    // Draw procedural shapes
    ctx.fillStyle = '#05070D';
    ctx.fillRect(0, 0, w, h);

    // Geometric objects to detect edges of
    ctx.fillStyle = '#FFFFFF';
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
            data[idx] = mag > 100 ? 56 : 0;
            data[idx + 1] = mag > 100 ? 189 : 0;
            data[idx + 2] = mag > 100 ? 248 : 0;
          } else if (kernelType === 'laplacian') {
            let val = copy[idx] * -4;
            val += copy[((y - 1) * w + x) * 4];
            val += copy[((y + 1) * w + x) * 4];
            val += copy[(y * w + (x - 1)) * 4];
            val += copy[(y * w + (x + 1)) * 4];
            const clamped = Math.min(Math.max(val, 0), 255);
            data[idx] = clamped;
            data[idx + 1] = clamped > 50 ? 200 : 0;
            data[idx + 2] = 255;
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch {
      // Fallback
    }
  }, [activeExpId, kernelType]);

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

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
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
    <section id="lab" className="relative py-28 px-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08] dark:border-white/[0.08] light:border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-widest mb-3">
            <span>04</span>
            <span aria-hidden="true">/</span>
            <span>DIGITAL PROVING GROUND</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
            THE LAB
          </h2>
          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600 mt-2 max-w-xl">
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
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
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
          <div className="rounded-2xl border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 bg-[#070A11]/60 dark:bg-[#070A11]/60 light:bg-white/70 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-[#38BDF8] font-bold">{selectedExperiment.number}</span>
              <span className="uppercase">{selectedExperiment.category}</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-white dark:text-white light:text-slate-900">
              {selectedExperiment.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mt-3 leading-relaxed">
              {selectedExperiment.description}
            </p>

            <div className="mt-6 pt-4 border-t border-white/[0.08] space-y-2">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Technology Concepts
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
                {selectedExperiment.techStack.map((tech, i) => (
                  <span key={tech} className="flex items-center gap-2">
                    <span>{tech}</span>
                    {i < selectedExperiment.techStack.length - 1 && (
                      <span aria-hidden="true" className="text-slate-600">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{selectedExperiment.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Canvas Area */}
        <div className="lg:col-span-8 rounded-2xl border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 bg-[#070A11]/80 dark:bg-[#070A11]/80 light:bg-white/80 p-6 backdrop-blur-xl min-h-[460px] flex flex-col justify-between">
          {/* 1. Latent Manifold Canvas */}
          {activeExpId === 'latent-perturbation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>INTERACTIVE 2D LATENT MANIFOLD PROBE</span>
                <span>DRAG / HOVER TO PERTURB TOPOLOGY</span>
              </div>

              <div
                className="relative w-full h-[320px] rounded-xl bg-[#030408] border border-white/[0.06] overflow-hidden cursor-crosshair"
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

              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Latent Coordinates: (x: {latentCoords.x.toFixed(2)}, y: {latentCoords.y.toFixed(2)})</span>
                <span className="text-[#38BDF8]">Harmonic Mesh Mode</span>
              </div>
            </div>
          )}

          {/* 2. Vision Convolution Kernel Inspector */}
          {activeExpId === 'vision-convolutions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>IMAGE MATRIX CONVOLUTION OPERATOR</span>
                <div className="flex gap-2">
                  {(['sobel', 'laplacian', 'blur'] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => {
                        soundEngine.playClick();
                        setKernelType(k);
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize ${
                        kernelType === k ? 'bg-[#38BDF8] text-slate-900 font-bold' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full h-[320px] rounded-xl bg-[#030408] border border-white/[0.06] overflow-hidden flex items-center justify-center">
                <canvas
                  ref={visionCanvasRef}
                  width={640}
                  height={320}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-xs font-mono text-slate-400">
                Real-time 3×3 spatial gradient calculation executed directly on canvas pixel buffer.
              </div>
            </div>
          )}

          {/* 3. Audio Waveform Synthesizer */}
          {activeExpId === 'audio-synthesizer' && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>PARAMETRIC HARMONIC OSCILLATOR</span>
                <span>WEB AUDIO ENGINE</span>
              </div>

              <div className="flex flex-col items-center justify-center p-8 bg-[#030408] rounded-xl border border-white/[0.06] text-center space-y-6">
                <button
                  onClick={toggleSynth}
                  className={`px-6 py-3 rounded-xl font-mono text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSynthPlaying
                      ? 'bg-rose-500 text-white shadow-[0_0_24px_rgba(244,63,94,0.5)]'
                      : 'bg-[#2563EB] text-white shadow-[0_0_24px_rgba(37,99,235,0.4)]'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isSynthPlaying ? 'STOP OSCILLATOR' : 'START HARMONIC OSCILLATOR'}</span>
                </button>

                <div className="w-full max-w-md space-y-4">
                  <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span>Frequency: {synthFreq} Hz</span>
                    <span className="uppercase text-[#38BDF8]">{synthType}</span>
                  </div>
                  <input
                    type="range"
                    min="110"
                    max="880"
                    step="5"
                    value={synthFreq}
                    onChange={(e) => setSynthFreq(Number(e.target.value))}
                    className="w-full accent-[#38BDF8] cursor-pointer"
                  />
                  <div className="flex justify-center gap-3">
                    {(['sine', 'triangle', 'sawtooth'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          soundEngine.playClick();
                          setSynthType(type);
                        }}
                        className={`px-3 py-1 rounded text-xs font-mono capitalize cursor-pointer ${
                          synthType === type
                            ? 'bg-[#38BDF8] text-slate-900 font-bold'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-400 text-center">
                Audio is client-generated via browser Web Audio API OscillatorNodes and GainNodes.
              </div>
            </div>
          )}

          {/* 4. A* Grid Router */}
          {activeExpId === 'pathfinding-engine' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>A* GRAPH PATHFINDING MATRIX</span>
                <span className="text-[#38BDF8]">CLICK CELLS TO TOGGLE OBSTACLES</span>
              </div>

              <div className="p-4 bg-[#030408] rounded-xl border border-white/[0.06] flex flex-col items-center">
                <div className="grid grid-cols-12 gap-1.5 w-full max-w-lg">
                  {grid.map((row, r) =>
                    row.map((cell, c) => {
                      const isStart = r === startPos.r && c === startPos.c;
                      const isTarget = r === targetPos.r && c === targetPos.c;
                      const isObstacle = cell === 1;
                      const isPath = path.some((p) => p.r === r && p.c === c);

                      let bg = 'bg-white/[0.04] hover:bg-white/[0.1]';
                      if (isStart) bg = 'bg-emerald-500 shadow-[0_0_8px_#10B981]';
                      else if (isTarget) bg = 'bg-rose-500 shadow-[0_0_8px_#F43F5E]';
                      else if (isObstacle) bg = 'bg-slate-700';
                      else if (isPath) bg = 'bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]';

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

                <div className="flex items-center gap-6 mt-4 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                    <span>Start</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                    <span>Target</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#38BDF8]" />
                    <span>Calculated Route ({path.length} hops)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-700" />
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
