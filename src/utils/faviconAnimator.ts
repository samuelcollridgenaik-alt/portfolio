/**
 * Favicon Animator for Samuel Collridge Naik (SCN) Portfolio
 * 
 * Provides an ultra-lightweight, seamless SVG frame-switching animation
 * that works reliably across Chrome, Safari, Edge, and Firefox.
 * 
 * Performance & Accessibility:
 * - Zero external libraries.
 * - Automatically halts when the tab is hidden (0% background CPU).
 * - Strictly respects `prefers-reduced-motion: reduce`.
 * - Pre-encoded SVG data URIs for instantaneous sub-millisecond updates.
 */

function buildSvgDataUri(frameIndex: number): string {
  // Frame 0: Calm resting state
  // Frame 1: Soft highlight scanning over S
  // Frame 2: Soft highlight scanning over C
  // Frame 3: Soft highlight scanning over N + Beacon flare
  // Frame 4: Harmonized gentle glow resolution

  const sColor = frameIndex === 1 ? '#FFFFFF' : (frameIndex === 4 ? '#7DD3FC' : '#38BDF8');
  const cColor = frameIndex === 2 ? '#FFFFFF' : (frameIndex === 4 ? '#93C5FD' : '#60A5FA');
  const nColor = frameIndex === 3 ? '#FFFFFF' : (frameIndex === 4 ? '#FFFFFF' : '#CBD5E1');

  const sStroke = frameIndex === 1 ? '2.5' : '2.3';
  const cStroke = frameIndex === 2 ? '2.5' : '2.3';
  const nStroke = frameIndex === 3 ? '2.5' : '2.3';

  const beaconOpacity = frameIndex === 3 || frameIndex === 4 ? '0.98' : '0.5';
  const beaconR = frameIndex === 3 ? '1.4' : (frameIndex === 4 ? '1.3' : '1.1');
  const beaconColor = frameIndex === 3 ? '#FFFFFF' : '#38BDF8';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05070E"/>
      <stop offset="100%" stop-color="#0A1020"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="7.5" fill="url(#bg)"/>
  <rect width="30" height="30" x="1" y="1" rx="6.5" fill="none" stroke="#1E293B" stroke-width="1"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 11.5 10.5 H 8 A 2 2 0 0 0 6 12.5 V 13.5 A 2 2 0 0 0 8 15.5 H 9.5 A 2 2 0 0 1 11.5 17.5 V 18.5 A 2 2 0 0 1 9.5 20.5 H 6" stroke="${sColor}" stroke-width="${sStroke}"/>
    <path d="M 19 12 H 16 A 2.5 2.5 0 0 0 13.5 14.5 V 16.5 A 2.5 2.5 0 0 0 16 19 H 19" stroke="${cColor}" stroke-width="${cStroke}"/>
    <path d="M 21 20.5 V 10.5 L 26.5 20.5 V 10.5" stroke="${nColor}" stroke-width="${nStroke}"/>
  </g>
  <circle cx="26.5" cy="7.5" r="${beaconR}" fill="${beaconColor}" opacity="${beaconOpacity}"/>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Pre-compile the 5 animation frames
const FRAMES = [
  buildSvgDataUri(0), // Rest
  buildSvgDataUri(1), // Scan S
  buildSvgDataUri(2), // Scan C
  buildSvgDataUri(3), // Scan N + Flare
  buildSvgDataUri(4), // Glow resolution
];

export function initFaviconAnimation(): () => void {
  if (typeof window === 'undefined') return () => {};

  let faviconEl = document.getElementById('app-favicon') as HTMLLinkElement | null;
  if (!faviconEl) {
    faviconEl = document.querySelector("link[rel='icon']");
  }
  if (!faviconEl) {
    faviconEl = document.createElement('link');
    faviconEl.rel = 'icon';
    faviconEl.id = 'app-favicon';
    document.head.appendChild(faviconEl);
  }

  // Check prefers-reduced-motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    faviconEl.href = FRAMES[0];
    return () => {};
  }

  let currentFrame = 0;
  let timerId: number | null = null;
  let isRunning = false;

  // Frame timing sequence: Rest (1600ms), Scan S (380ms), Scan C (380ms), Scan N (380ms), Fade (460ms) = 3.2s
  const FRAME_DURATIONS = [1600, 380, 380, 380, 460];

  function tick() {
    if (!isRunning || !faviconEl) return;

    currentFrame = (currentFrame + 1) % FRAMES.length;
    faviconEl.href = FRAMES[currentFrame];

    const nextDuration = FRAME_DURATIONS[currentFrame];
    timerId = window.setTimeout(tick, nextDuration);
  }

  function start() {
    if (isRunning || mediaQuery.matches || document.hidden) return;
    isRunning = true;
    currentFrame = 0;
    faviconEl!.href = FRAMES[0];
    timerId = window.setTimeout(tick, FRAME_DURATIONS[0]);
  }

  function stop() {
    isRunning = false;
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
    if (faviconEl) {
      faviconEl.href = FRAMES[0];
    }
  }

  // Handle tab visibility (stop animation when user is in another tab)
  function handleVisibilityChange() {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  }

  // Handle dynamic changes to accessibility preference
  function handleMotionChange(e: MediaQueryListEvent) {
    if (e.matches) {
      stop();
    } else {
      start();
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleMotionChange);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleMotionChange);
  }

  // Start the animation
  start();

  // Return cleanup function
  return () => {
    stop();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleMotionChange);
    } else if (mediaQuery.removeListener) {
      mediaQuery.removeListener(handleMotionChange);
    }
  };
}
