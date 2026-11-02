import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateArchitecturalRedesign, checkGeneratorAvailability, __resetAvailabilityCache } from '../src/services/imageGenerator';

describe('Generator availability preflight (honest primary path)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    __resetAvailabilityCache();
  });

  it('reports availability when the probe image loads', async () => {
    global.Image = class {
      constructor() { setTimeout(() => this.onload && this.onload(), 5); }
    };
    await expect(checkGeneratorAvailability()).resolves.toBe(true);
  });

  it('reports unavailability when the probe fails', async () => {
    global.Image = class {
      constructor() { setTimeout(() => this.onerror && this.onerror(new Error('down')), 5); }
    };
    await expect(checkGeneratorAvailability()).resolves.toBe(false);
  });

  it('reports unavailability when the probe times out', async () => {
    global.Image = class { constructor() { /* never fires */ } };
    await expect(checkGeneratorAvailability({ timeoutMs: 20 })).resolves.toBe(false);
  }, 5000);

  it('short-circuits to the sample render without a new probe when already known down', async () => {
    let imageConstructs = 0;
    global.Image = class {
      constructor() {
        imageConstructs += 1;
        setTimeout(() => this.onerror && this.onerror(new Error('down')), 5);
      }
    };
    await checkGeneratorAvailability(); // caches "down"

    const before = imageConstructs;
    const result = await generateArchitecturalRedesign({
      roomType: 'Living Pavilion',
      styleSnippet: 'Japandi',
      customPrompt: '',
      fallbackUrl: 'https://images.unsplash.com/fallback'
    });
    expect(result.isAiGenerated).toBe(false);
    expect(result.imageUrl).toBe('https://images.unsplash.com/fallback');
    expect(result.note).toMatch(/unavailable/);
    expect(imageConstructs).toBe(before); // no wasted network attempt
  });
});
