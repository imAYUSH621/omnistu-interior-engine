// Zero-Cost Architectural Image Generator Service
// Powered by Pollinations.AI (Free Flux & Sana backend, zero auth required) + instant SOTA fallbacks

export async function generateArchitecturalRedesign({ roomType, styleSnippet, customPrompt, fallbackUrl }) {
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
