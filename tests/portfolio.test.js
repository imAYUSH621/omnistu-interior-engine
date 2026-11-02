import { describe, it, expect } from 'vitest';
import { PORTFOLIO_ITEMS, STYLE_PRESETS, ROOM_PRESETS } from '../src/data/portfolio';

describe('Portfolio & Preset Data Integrity', () => {
  it('contains valid curated portfolio case studies', () => {
    expect(PORTFOLIO_ITEMS.length).toBeGreaterThanOrEqual(4);
    PORTFOLIO_ITEMS.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.beforeImage).toMatch(/^https:\/\//);
      expect(item.afterImage).toMatch(/^https:\/\//);
      expect(item.specs.length).toBeGreaterThan(0);
      expect(item.budgetTier).toBeTruthy();
    });
  });

  it('contains calibrated architectural style presets', () => {
    expect(STYLE_PRESETS.length).toBe(4);
    STYLE_PRESETS.forEach((style) => {
      expect(style.id).toBeTruthy();
      expect(style.name).toBeTruthy();
      expect(style.promptSnippet).toContain('interior');
      expect(style.thumb).toMatch(/^https:\/\//);
    });
  });

  it('contains standard room presets with verified image fallbacks', () => {
    expect(ROOM_PRESETS.length).toBe(4);
    ROOM_PRESETS.forEach((room) => {
      expect(room.id).toBeTruthy();
      expect(room.name).toBeTruthy();
      expect(room.rawImage).toMatch(/^https:\/\//);
      expect(room.fallbackRender).toMatch(/^https:\/\//);
    });
  });
});
