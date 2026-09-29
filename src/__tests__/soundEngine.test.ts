import { describe, it, expect } from 'vitest';
import { soundEngine } from '../utils/soundEngine';

describe('Sound Engine Break Testing', () => {
  it('should initialize muted by default', () => {
    expect(soundEngine.getMuted()).toBe(true);
  });

  it('should not throw errors when invoking audio functions while muted', () => {
    expect(() => soundEngine.playHover()).not.toThrow();
    expect(() => soundEngine.playClick()).not.toThrow();
    expect(() => soundEngine.playBlip(500, 0.1)).not.toThrow();
    expect(() => soundEngine.startAmbient()).not.toThrow();
    expect(() => soundEngine.stopAmbient()).not.toThrow();
  });

  it('should toggle mute state cleanly', () => {
    const isUnmuted = soundEngine.toggleMute();
    expect(soundEngine.getMuted()).toBe(!isUnmuted);

    // Toggle back to muted
    soundEngine.toggleMute();
    expect(soundEngine.getMuted()).toBe(true);
  });

  it('should survive repeated rapid toggles without leaking or throwing', () => {
    for (let i = 0; i < 50; i++) {
      soundEngine.toggleMute();
      soundEngine.playHover();
      soundEngine.playClick();
    }
    // Restore to muted
    if (!soundEngine.getMuted()) {
      soundEngine.toggleMute();
    }
    expect(soundEngine.getMuted()).toBe(true);
  });
});
