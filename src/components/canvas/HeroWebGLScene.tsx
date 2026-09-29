import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Theme } from '../../types/portfolio';

interface HeroWebGLSceneProps {
  theme: Theme;
}

export const HeroWebGLScene: React.FC<HeroWebGLSceneProps> = ({ theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
    let animationFrameId: number;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 8.5;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      const width = container.clientWidth || 300;
      const height = container.clientHeight || 300;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to CSS background', e);
      return;
    }

    // Context loss safety
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    const handleContextRestored = () => {
      animate();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

    // Color definitions based on theme
    const isDark = theme === 'dark';
    const coreColor = isDark ? 0x38bdf8 : 0x0284c7;
    const wireColor = isDark ? 0x818cf8 : 0x3b82f6;
    const particleColor = isDark ? 0x38bdf8 : 0x2563eb;
    const ringColor = isDark ? 0x6366f1 : 0x4f46e5;

    // 1. Central Core Geometry: Nested Icosahedron Wireframe & Points
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Outer wireframe cage
    const outerGeo = new THREE.IcosahedronGeometry(2.4, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: wireColor,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.35 : 0.45,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // Inner glowing geometric core
    const innerGeo = new THREE.OctahedronGeometry(1.3, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: coreColor,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      emissive: coreColor,
      emissiveIntensity: isDark ? 0.4 : 0.2,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Floating vertices
    const vertexPointsGeo = new THREE.IcosahedronGeometry(2.4, 2);
    const vertexPointsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: isDark ? 0.8 : 0.6,
    });
    const vertexPoints = new THREE.Points(vertexPointsGeo, vertexPointsMat);
    coreGroup.add(vertexPoints);

    // 2. Orbital Element Rings
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const ring1Geo = new THREE.TorusGeometry(3.6, 0.015, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: ringColor,
      transparent: true,
      opacity: isDark ? 0.4 : 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    ringGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(4.2, 0.012, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: coreColor,
      transparent: true,
      opacity: isDark ? 0.3 : 0.4,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    ringGroup.add(ring2);

    // 3. Ambient Particle Swarm
    const particleCount = window.innerWidth < 768 ? 400 : 900;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 3.0 + Math.random() * 6.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i3 + 2] = radius * Math.cos(phi);

      particleSpeeds[i] = 0.2 + Math.random() * 0.8;
    }

    const swarmGeo = new THREE.BufferGeometry();
    swarmGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const swarmMat = new THREE.PointsMaterial({
      color: particleColor,
      size: 0.035,
      transparent: true,
      opacity: isDark ? 0.7 : 0.5,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    const swarm = new THREE.Points(swarmGeo, swarmMat);
    scene.add(swarm);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.8 : 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(coreColor, isDark ? 3 : 2, 20);
    pointLight.position.set(4, 3, 5);
    scene.add(pointLight);

    const rimLight = new THREE.PointLight(wireColor, isDark ? 2 : 1.5, 20);
    rimLight.position.set(-4, -3, -2);
    scene.add(rimLight);

    // Pointer Interaction State
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, velocity: 0 };
    let lastMouseX = 0;
    let lastMouseY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouse.targetX = normX;
      mouse.targetY = normY;

      const dx = normX - lastMouseX;
      const dy = normY - lastMouseY;
      mouse.velocity = Math.min(Math.sqrt(dx * dx + dy * dy) * 10, 3);
      lastMouseX = normX;
      lastMouseY = normY;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });

    // Scroll Reaction
    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth pointer lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      mouse.velocity *= 0.92;

      const motionFactor = prefersReducedMotion ? 0.2 : 1;

      // Rotate central core
      coreGroup.rotation.y = elapsedTime * 0.15 * motionFactor + mouse.x * 0.8;
      coreGroup.rotation.x = elapsedTime * 0.08 * motionFactor + mouse.y * 0.6;
      coreGroup.rotation.z = Math.sin(elapsedTime * 0.2) * 0.1;

      // Inner mesh counter-rotation and scale pulse
      innerMesh.rotation.y = -elapsedTime * 0.3 * motionFactor;
      innerMesh.rotation.x = -elapsedTime * 0.2 * motionFactor;
      const pulse = 1 + Math.sin(elapsedTime * 1.5) * 0.05 + mouse.velocity * 0.05;
      innerMesh.scale.set(pulse, pulse, pulse);

      // Rings rotation
      ring1.rotation.z = elapsedTime * 0.25 * motionFactor;
      ring2.rotation.y = -elapsedTime * 0.2 * motionFactor;
      ringGroup.rotation.x = mouse.y * 0.3;
      ringGroup.rotation.y = mouse.x * 0.3;

      // Swarm subtle rotation
      swarm.rotation.y = elapsedTime * 0.04 * motionFactor + mouse.x * 0.2;
      swarm.rotation.x = -elapsedTime * 0.02 * motionFactor + mouse.y * 0.2;

      // Camera parallax response to scroll
      camera.position.y = -(scrollY * 0.0015);
      camera.lookAt(0, -(scrollY * 0.0015), 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      // Dispose geometries & materials
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      vertexPointsGeo.dispose();
      vertexPointsMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      swarmGeo.dispose();
      swarmMat.dispose();

      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  );
};
