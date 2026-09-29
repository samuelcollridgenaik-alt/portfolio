import { describe, it, expect } from 'vitest';

describe('NLP Inference Simulator Break Testing', () => {
  const evaluateComment = (text: string) => {
    if (!text || typeof text !== 'string') {
      return {
        toxic: 0.0,
        severeToxic: 0.0,
        obscene: 0.0,
        threat: 0.0,
        insult: 0.0,
        identityHate: 0.0,
      };
    }

    const lower = text.toLowerCase();
    const badWords = ['hate', 'terrible', 'kill', 'threat', 'stupid', 'awful', 'idiot', 'ugly', 'die'];
    let matches = 0;
    badWords.forEach((word) => {
      if (lower.includes(word)) matches++;
    });

    if (matches === 0) {
      return {
        toxic: 0.02,
        severeToxic: 0.0,
        obscene: 0.01,
        threat: 0.0,
        insult: 0.01,
        identityHate: 0.0,
      };
    }

    const toxicVal = Math.min(0.25 * matches, 0.94);
    return {
      toxic: Number(toxicVal.toFixed(2)),
      severeToxic: Number((toxicVal * 0.4).toFixed(2)),
      obscene: Number((toxicVal * 0.6).toFixed(2)),
      threat: lower.includes('kill') || lower.includes('threat') ? 0.88 : 0.04,
      insult: Number((toxicVal * 0.75).toFixed(2)),
      identityHate: Number((toxicVal * 0.3).toFixed(2)),
    };
  };

  it('should score clean constructive text as non-toxic', () => {
    const scores = evaluateComment('The modular architecture and dataset preprocessing are well engineered.');
    expect(scores.toxic).toBeLessThan(0.05);
    expect(scores.threat).toBeLessThan(0.05);
  });

  it('should detect toxic and threat language accurately', () => {
    const scores = evaluateComment('I hate this, you are terrible and stupid and I will kill your process.');
    expect(scores.toxic).toBeGreaterThan(0.7);
    expect(scores.threat).toBeGreaterThan(0.8);
  });

  it('should break-test extreme input (100,000 characters) without crashing or timing out', () => {
    const massiveText = 'clean test word '.repeat(10000);
    const start = performance.now();
    const scores = evaluateComment(massiveText);
    const duration = performance.now() - start;

    expect(scores.toxic).toBe(0.02);
    expect(duration).toBeLessThan(100); // executed in under 100ms
  });

  it('should handle unusual symbols, emojis, and control characters gracefully', () => {
    const weirdText = '🤖🚀 \u0000\u0007\t\n \u200B special characters and symbols!';
    expect(() => evaluateComment(weirdText)).not.toThrow();
    const scores = evaluateComment(weirdText);
    expect(scores.toxic).toBe(0.02);
  });
});
