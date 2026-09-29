import React, { useEffect, useRef, useState } from 'react';
import { TECHNOLOGIES_DATA } from '../../data/technologiesData';
import { TechnologyNode, Theme } from '../../types/portfolio';
import { soundEngine } from '../../utils/soundEngine';

interface ConstellationCanvasProps {
  theme: Theme;
  selectedTechId: string | null;
  onSelectTechnology: (tech: TechnologyNode | null) => void;
}

interface ParticlePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  pulsePhase: number;
}

export const ConstellationCanvas: React.FC<ConstellationCanvasProps> = ({
  theme,
  selectedTechId,
  onSelectTechnology,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<TechnologyNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const isDark = theme === 'dark';

    // Resize handling
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Compute node coordinates in concentric rings around SAMUEL
    const nodes = TECHNOLOGIES_DATA;
    const totalNodes = nodes.length;

    // Pulse particles along edges
    const edgePulseParticles: { edgeIndex: number; progress: number; speed: number }[] = [];
    for (let i = 0; i < totalNodes * 2; i++) {
      edgePulseParticles.push({
        edgeIndex: i % totalNodes,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.006,
      });
    }

    let time = 0;

    // Helper to calculate exact coordinates for a node with rectangular mobile adaptation
    const calculateNodePosition = (
      idx: number,
      total: number,
      cx: number,
      cy: number,
      w: number,
      h: number,
      minDim: number,
      t: number,
      mobile: boolean
    ) => {
      const isOuter = idx % 2 === 1;

      // On mobile screens (tall portrait rectangle), expand vertically to utilize the screen height
      const radiusXInner = mobile ? w * 0.28 : minDim * 0.26;
      const radiusYInner = mobile ? h * 0.24 : minDim * 0.26 * 0.85;
      const radiusXOuter = mobile ? w * 0.41 : minDim * 0.42;
      const radiusYOuter = mobile ? h * 0.40 : minDim * 0.42 * 0.85;

      const radiusX = isOuter ? radiusXOuter : radiusXInner;
      const radiusY = isOuter ? radiusYOuter : radiusYInner;

      const baseAngle = (idx / total) * Math.PI * 2;
      const drift = Math.sin(t * 0.5 + idx) * (mobile ? 0.025 : 0.04);
      const angle = baseAngle + drift;

      return {
        x: cx + Math.cos(angle) * radiusX,
        y: cy + Math.sin(angle) * radiusY,
      };
    };

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width <= 10 || height <= 10) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      const centerX = width / 2;
      const centerY = height / 2;
      const minDimension = Math.min(width, height);
      const isMobile = width < 768;

      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      // Calculate dynamic positions for all nodes
      const nodePositions: { x: number; y: number; node: TechnologyNode }[] = [];

      nodes.forEach((node, idx) => {
        const { x, y } = calculateNodePosition(
          idx,
          totalNodes,
          centerX,
          centerY,
          width,
          height,
          minDimension,
          time,
          isMobile
        );
        nodePositions.push({ x, y, node });
      });

      // 1. Draw connecting gravitational web
      nodePositions.forEach((posA, i) => {
        const isHoveredA = hoveredNode?.id === posA.node.id || selectedTechId === posA.node.id;

        // Line to Center (SAMUEL)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(posA.x, posA.y);
        if (isHoveredA) {
          ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.65)' : 'rgba(37, 99, 235, 0.6)';
          ctx.lineWidth = 1.8;
        } else {
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
          ctx.lineWidth = 0.8;
        }
        ctx.stroke();

        // Cross-connections between adjacent technologies
        const nextPos = nodePositions[(i + 1) % nodePositions.length];
        ctx.beginPath();
        ctx.moveTo(posA.x, posA.y);
        ctx.lineTo(nextPos.x, nextPos.y);
        ctx.strokeStyle = isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.08)';
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Connect nodes in the same category
        for (let j = i + 1; j < nodePositions.length; j++) {
          const posB = nodePositions[j];
          if (posA.node.category === posB.node.category) {
            ctx.beginPath();
            ctx.moveTo(posA.x, posA.y);
            ctx.lineTo(posB.x, posB.y);
            const bothActive = isHoveredA || hoveredNode?.id === posB.node.id;
            ctx.strokeStyle = bothActive
              ? isDark ? 'rgba(168, 85, 247, 0.4)' : 'rgba(147, 51, 234, 0.4)'
              : isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
            ctx.lineWidth = bothActive ? 1.2 : 0.4;
            ctx.stroke();
          }
        }
      });

      // 2. Animate edge pulses (traveling data packets)
      edgePulseParticles.forEach((particle) => {
        particle.progress += particle.speed;
        if (particle.progress > 1) {
          particle.progress = 0;
        }

        const targetPos = nodePositions[particle.edgeIndex];
        if (targetPos) {
          const px = centerX + (targetPos.x - centerX) * particle.progress;
          const py = centerY + (targetPos.y - centerY) * particle.progress;

          ctx.beginPath();
          ctx.arc(px, py, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.7)' : 'rgba(37, 99, 235, 0.7)';
          ctx.fill();
        }
      });

      // 3. Central Node: SAMUEL
      const corePulse = Math.sin(time * 2) * 3;
      const coreRadius = (isMobile ? 26 : (minDimension < 500 ? 32 : 44)) + corePulse;

      // Glow halo
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 1.8);
      glowGrad.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(26, 115, 232, 0.18)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Outer ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.5)' : '#1A73E8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Core disk
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius - 5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#0A0F1D' : '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.8)' : '#1A73E8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Text: SAMUEL
      ctx.fillStyle = isDark ? '#F8FAFC' : '#202124';
      ctx.font = `700 ${isMobile ? 10 : (minDimension < 500 ? 11 : 13)}px 'Syne', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SAMUEL', centerX, centerY - (isMobile ? 3 : 4));

      ctx.fillStyle = isDark ? '#38BDF8' : '#1A73E8';
      ctx.font = `600 ${isMobile ? 7 : (minDimension < 500 ? 8 : 9)}px 'JetBrains Mono', monospace`;
      ctx.fillText('CORE', centerX, centerY + (isMobile ? 6 : 8));

      // 4. Draw Individual Technology Nodes
      nodePositions.forEach(({ x, y, node }) => {
        const isSelected = selectedTechId === node.id;
        const isHovered = hoveredNode?.id === node.id;
        const isActive = isSelected || isHovered;

        const nodeRadius = isActive ? (isMobile ? 15 : 18) : (isMobile ? 11 : 13);

        // Active node glow
        if (isActive) {
          const nodeGlow = ctx.createRadialGradient(x, y, 0, x, y, nodeRadius * 2);
          nodeGlow.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(26, 115, 232, 0.25)');
          nodeGlow.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius * 2, 0, Math.PI * 2);
          ctx.fillStyle = nodeGlow;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = isActive
          ? isDark ? '#0284C7' : '#1A73E8'
          : isDark ? '#0E1726' : '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = isActive
          ? isDark ? '#38BDF8' : '#1A73E8'
          : isDark ? 'rgba(255, 255, 255, 0.15)' : '#DADCE0';
        ctx.lineWidth = isActive ? 2 : 1.2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = isActive
          ? isDark ? '#FFFFFF' : '#1A73E8'
          : isDark ? '#E2E8F0' : '#202124';
        ctx.font = `${isActive ? '600' : '500'} ${isMobile ? 9.5 : (minDimension < 500 ? 9 : 11)}px 'Plus Jakarta Sans', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.name, x, y + nodeRadius + (isMobile ? 3 : 5));

        // Project count indicator (unboxed)
        if (node.projects.length > 0 && !isMobile) {
          ctx.fillStyle = isDark ? '#64748B' : '#5F6368';
          ctx.font = `400 8px 'JetBrains Mono', monospace`;
          ctx.fillText(`${node.projects.length} proj`, x, y + nodeRadius + 18);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Unified hit testing function
    const findNodeAtPosition = (clientX: number, clientY: number): TechnologyNode | null => {
      const rect = canvas.getBoundingClientRect();
      const posX = clientX - rect.left;
      const posY = clientY - rect.top;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const minDimension = Math.min(width, height);
      const isMobile = width < 768;

      for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];
        const { x, y } = calculateNodePosition(
          idx,
          totalNodes,
          centerX,
          centerY,
          width,
          height,
          minDimension,
          time,
          isMobile
        );

        const dist = Math.hypot(posX - x, posY - y);
        if (dist < (isMobile ? 30 : 26)) {
          return node;
        }
      }

      return null;
    };

    // Mouse hit test
    const handleMouseMove = (e: MouseEvent) => {
      const found = findNodeAtPosition(e.clientX, e.clientY);
      if (found !== hoveredNode) {
        setHoveredNode(found);
        if (found) {
          soundEngine.playHover();
        }
      }
    };

    const handleClick = () => {
      if (hoveredNode) {
        soundEngine.playClick();
        onSelectTechnology(hoveredNode.id === selectedTechId ? null : hoveredNode);
      }
    };

    // Touch hit test for mobile screens
    const handleTouchStart = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const found = findNodeAtPosition(touch.clientX, touch.clientY);
      if (found) {
        soundEngine.playClick();
        setHoveredNode(found);
        onSelectTechnology(found.id === selectedTechId ? null : found);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouchStart);
    };
  }, [theme, selectedTechId, hoveredNode]);

  return (
    <div className="relative w-full h-[480px] xs:h-[520px] md:h-[620px] flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer touch-none"
      />
      {hoveredNode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-200">
          <div className="bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-md border border-[#1A73E8]/30 dark:border-[#38BDF8]/30 px-4 py-2.5 rounded-lg text-center shadow-xl max-w-sm">
            <div className="text-xs font-mono text-[#1A73E8] dark:text-[#38BDF8] uppercase tracking-wider mb-0.5">
              {hoveredNode.category}
            </div>
            <div className="text-sm font-semibold text-[#202124] dark:text-white">
              {hoveredNode.name}
            </div>
            <div className="text-xs text-[#5F6368] dark:text-slate-300 mt-1 line-clamp-2">
              {hoveredNode.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
