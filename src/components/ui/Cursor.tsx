import React, { useEffect, useState } from 'react';

export type CursorType = 'default' | 'view' | 'explore' | 'action' | 'hidden';

export const Cursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if primary pointer is touch or coarse
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    let animationId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: e.clientX, y: e.clientY });

      // Inspect target element for cursor cues
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (cursorAttr === 'explore') {
        setCursorType('explore');
        setIsHovered(true);
      } else if (cursorAttr === 'view') {
        setCursorType('view');
        setIsHovered(true);
      } else if (cursorAttr === 'action') {
        setCursorType('action');
        setIsHovered(true);
      } else if (target.closest('button, a, input, textarea, [role="button"]')) {
        setCursorType('action');
        setIsHovered(true);
      } else {
        setCursorType('default');
        setIsHovered(false);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    // Smooth trailing physics
    const loop = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      setTrailingPos({ x: currentX, y: currentY });
      animationId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Primary sharp dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#38BDF8] transition-transform duration-75 ease-out shadow-[0_0_8px_#38BDF8]"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${isClicking ? 0.6 : 1})`,
        }}
      />

      {/* Adaptive ring with dynamic label */}
      <div
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full border transition-all duration-150 ease-out ${
          isHovered
            ? 'w-14 h-14 -ml-7 -mt-7 border-[#38BDF8]/80 bg-[#38BDF8]/10 backdrop-blur-[1px]'
            : 'w-7 h-7 -ml-3.5 -mt-3.5 border-white/30 dark:border-white/30 light:border-slate-800/30'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) scale(${
            isClicking ? 0.85 : 1
          })`,
        }}
      >
        {cursorType === 'explore' && (
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#38BDF8]">
            EXPLORE
          </span>
        )}
        {cursorType === 'view' && (
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#38BDF8]">
            VIEW
          </span>
        )}
        {cursorType === 'action' && !isHovered && (
          <span className="text-[8px] text-[#38BDF8]">✦</span>
        )}
      </div>
    </div>
  );
};
