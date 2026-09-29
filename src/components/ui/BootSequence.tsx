import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../utils/soundEngine';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const logs = [
    'SAMUEL.OS KERNEL v2.6.4 INITIALIZED',
    'CALIBRATING THREE.JS SPATIAL RUNTIME',
    'MOUNTING NEURAL & NLP INFERENCE MODULES',
    'CONNECTING PROJECT KNOWLEDGE GRAPHS',
    'RENDER PIPELINE ENGAGED · 60 FPS NOMINAL',
    'SYSTEM READY',
  ];

  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 18) + 12;
        if (next >= 100) {
          clearInterval(interval);
          setIsFinished(true);
          soundEngine.playBlip(750, 0.1, 'sine');
          setTimeout(onComplete, 400);
          return 100;
        }
        return next;
      });

      if (currentIdx < logs.length) {
        setBootLog((prev) => [...prev, logs[currentIdx]]);
        currentIdx++;
        soundEngine.playHover();
      }
    }, 180);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#040508] flex flex-col items-center justify-center p-6 transition-opacity duration-500 font-mono ${
        isFinished ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-md bg-[#0B0F19]/90 border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        {/* Top status bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="font-semibold text-slate-200">SAMUEL.OS // BOOT SEQUENCE</span>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onComplete();
            }}
            className="text-[11px] text-[#38BDF8] hover:underline cursor-pointer"
          >
            [ESC to Skip]
          </button>
        </div>

        {/* Console log list */}
        <div className="py-4 space-y-1.5 text-xs text-slate-300 min-h-[140px]">
          {bootLog.map((log, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#38BDF8] select-none">›</span>
              <span className={i === logs.length - 1 ? 'text-[#38BDF8] font-bold' : ''}>
                {log}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CORE SYNCHRONIZATION</span>
            <span className="tabular-nums font-bold text-white">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
