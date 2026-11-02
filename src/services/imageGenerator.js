// Zero-Cost Architectural Image Generator Service
// Powered by Pollinations.AI (Free Flux & Sana backend, zero auth required) + instant SOTA fallbacks

let availabilityCache = null; // Promise<boolean> once probed, per page load

// Probe the free generator once per page load so the UI can be honest
// BEFORE a visitor waits on a click the endpoint cannot deliver.
export function checkGeneratorAvailability({ timeoutMs = 6000 } = {}) {
  if (!availabilityCache) {
    availabilityCache = new Promise((resolve) => {
      const probe = new Image();
      const timer = setTimeout(() => {
        probe.src = '';
        resolve(false);
      }, timeoutMs);
      probe.onload = () => { clearTimeout(timer); resolve(true); };
      probe.onerror = () => { clearTimeout(timer); resolve(false); };
      probe.src = 'https://image.pollinations.ai/prompt/minimalist%20interior?width=64&height=64&nologo=true&seed=1';
    });
  }
  return availabilityCache;
}

// Test hook: reset cached availability between specs
export function __resetAvailabilityCache() {
  availabilityCache = null;
}

export async function generateArchitecturalRedesign({ roomType, styleSnippet, customPrompt, fallbackUrl }) {
  // If the preflight already proved the free generator is down, do not make the
  // visitor wait ~10s for a guaranteed failure - return the sample render now.
  if (availabilityCache) {
    const available = await availabilityCache;
    if (!available) {
      return {
        success: true,
        imageUrl: fallbackUrl,
        isAiGenerated: false,
        note: 'AI generator unavailable - using curated sample render'
      };
    }
  }

  const seed = Math.floor(Math.random() * 899999) + 100000;

  // Construct high-aesthetic architectural photography prompt
  const basePrompt = `award winning interior architecture of a luxury ${roomType}, ${styleSnippet}, ${customPrompt || ''}, photorealistic 8k, shot on Hasselblad, Architectural Digest cover, soft natural lighting, volumetric rays, high end materials, ultra detailed textures, zero clutter`;

  const encoded = encodeURIComponent(basePrompt);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=768&model=flux&nologo=true&seed=${seed}`;

  try {
    // Validate that the image can be loaded with a 9.5-second timeout
    await new Promise((resolve, reject) => {
      const img = new Image();
      const timer = setTimeout(() => {
        img.src = '';
        reject(new Error('Generation timeout'));
      }, 9500);

      img.onload = () => {
        clearTimeout(timer);
        resolve(pollinationsUrl);
      };
      img.onerror = (e) => {
        clearTimeout(timer);
        reject(e);
      };
      img.src = pollinationsUrl;
    });

    return {
      success: true,
      imageUrl: pollinationsUrl,
      isAiGenerated: true,
      seed
    };
  } catch {
    // Silent fallback to curated high-resolution SOTA architectural fixture
    return {
      success: true,
      imageUrl: fallbackUrl,
      isAiGenerated: false,
      note: 'Using curated SOTA architectural render fixture'
    };
  }
}
