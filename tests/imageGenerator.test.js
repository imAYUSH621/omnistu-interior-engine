import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateArchitecturalRedesign } from '../src/services/imageGenerator';

describe('Zero-Cost Image Generator Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('generates image URL and resolves successfully when image loads', async () => {
    // Mock successful image load
    global.Image = class {
      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 10);
      }
    };

    const result = await generateArchitecturalRedesign({
      roomType: 'Living Pavilion',
      styleSnippet: 'Japandi style',
      customPrompt: 'white oak',
      fallbackUrl: 'https://images.unsplash.com/fallback'
    });

    expect(result.success).toBe(true);
    expect(result.imageUrl).toContain('pollinations.ai/prompt');
    expect(result.isAiGenerated).toBe(true);
  });

  it('falls back to high-res SOTA fixture if image fails to load', async () => {
    // Mock image error
    global.Image = class {
      constructor() {
        setTimeout(() => {
          if (this.onerror) this.onerror(new Error('Network drop'));
        }, 10);
      }
    };

    const fallback = 'https://images.unsplash.com/fallback';
    const result = await generateArchitecturalRedesign({
      roomType: 'Living Pavilion',
      styleSnippet: 'Japandi style',
      customPrompt: 'white oak',
      fallbackUrl: fallback
    });

    expect(result.success).toBe(true);
    expect(result.imageUrl).toBe(fallback);
    expect(result.isAiGenerated).toBe(false);
  });
});
