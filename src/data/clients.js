// Multi-tenant Client Directory & Dynamic Profile Synthesizer

export const PRESET_CLIENTS = {
  'del-air': {
    id: 'del-air',
    name: 'Del-Air Luxury Home & Remodeling',
    city: 'Orlando & South Florida',
    phone: '',
    whatsapp: '',
    email: '',
    tagline: 'Premier Full-Home Renovation & Architectural Climate Comfort',
    heroHeadline: 'Experience Your Home Reimagined in Photorealistic 3D',
    heroSubheadline: 'From complete architectural redesigns to bespoke living spaces in South Florida. Visualize your transformation in 15 seconds.',
    accentColor: '#a38461',
    badge: 'Sample demo profile - not a real business',
    isSample: true,
    projectsCompleted: '3,200+',
    avgRating: '4.9',
    featuredStyle: 'Coastal Luxury & Warm Modern'
  },
  'studio-luxe': {
    id: 'studio-luxe',
    name: 'Studio Luxe Architectural Interiors',
    city: 'Manhattan & The Hamptons, NY',
    phone: '',
    whatsapp: '',
    email: '',
    tagline: 'High-Concept Residential & Penthouse Interior Architecture',
    heroHeadline: 'Bespoke Interior Architecture for Discerning Homeowners',
    heroSubheadline: 'Tailored Japandi, Italian Minimalist, and Modern Haussmann spaces engineered to elevate status and everyday tranquility.',
    accentColor: '#c5a059',
    badge: 'Sample demo profile - not a real business',
    isSample: true,
    projectsCompleted: '190+',
    avgRating: '5.0',
    featuredStyle: 'Italian Minimalist & Warm Bouclé'
  },
  'haven-remodel': {
    id: 'haven-remodel',
    name: 'Haven Design + Build Studio',
    city: 'Austin & Dallas, TX',
    phone: '',
    whatsapp: '',
    email: '',
    tagline: 'Turnkey Architectural Design, Custom Millwork & Whole-Home Remodeling',
    heroHeadline: 'Instant 3D Architectural Remodel Before You Break Ground',
    heroSubheadline: 'Don’t guess what your home will look like. Upload your space, customize finish grades, and get an exact itemized investment breakdown.',
    accentColor: '#b38053',
    badge: 'Sample demo profile - not a real business',
    isSample: true,
    projectsCompleted: '450+',
    avgRating: '4.95',
    featuredStyle: 'Organic Modern & Warm Travertine'
  },
  'kasa-interiors': {
    id: 'kasa-interiors',
    name: 'Kasa Bespoke Living',
    city: 'Los Angeles & Beverly Hills, CA',
    phone: '',
    whatsapp: '',
    email: '',
    tagline: 'Quiet Luxury, Natural Stone & Calibrated Architectural Lighting',
    heroHeadline: 'Turn Your Space into a Serene Architectural Oasis',
    heroSubheadline: 'Zero guesswork. Experience custom 3D staging of your living room, chef’s kitchen, or master suite in under 15 seconds.',
    accentColor: '#d4af37',
    badge: 'Sample demo profile - not a real business',
    isSample: true,
    projectsCompleted: '280+',
    avgRating: '5.0',
    featuredStyle: 'Japandi Serenity & Calacatta Stone'
  }
};

export const DEFAULT_CLIENT = {
  id: 'omnistu-demo',
  name: 'Omnistu Interior Studio',
  city: 'Your City',
  phone: '',
  whatsapp: '',
  email: '',
  tagline: 'AI interior design concepts, instant estimates and client demos',
  heroHeadline: 'Get a Free AI Design Concept for Your Space',
  heroSubheadline: 'This is a live demo of the Omnistu interior engine. Pick a style and generate a free AI design concept - for inspiration and planning.',
  accentColor: '#a38461',
  badge: 'Live demo by Omnistu - sample data',
  projectsCompleted: '',
  avgRating: '',
  featuredStyle: 'Japandi & Warm Organic Modern',
  isSample: true
};

export function getClientProfile(slugOrQuery, searchParams = null) {
  if (!slugOrQuery) return DEFAULT_CLIENT;
  
  // Clean slug
  const cleanKey = slugOrQuery.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
  
  if (PRESET_CLIENTS[cleanKey]) {
    return PRESET_CLIENTS[cleanKey];
  }
  
  // Check if URL search parameters provided custom metadata (preserves across devices)
  if (searchParams) {
    const customName = searchParams.get('name');
    const customCity = searchParams.get('city');
    const customPhone = searchParams.get('phone');
    const customTagline = searchParams.get('tagline');

    if (customName) {
      return {
        ...DEFAULT_CLIENT,
        id: cleanKey,
        name: customName,
        city: customCity || 'Your Local Area',
        phone: customPhone || '',
        whatsapp: (customPhone || '').replace(/[^0-9]/g, '') || '',
        isSample: true,
        tagline: customTagline || 'Bespoke Architectural Interiors & Luxury Remodeling',
        heroHeadline: `Experience Your ${customName} Space in 3D`,
        heroSubheadline: `Premier architectural staging and luxury renovations serving ${customCity || 'our community'}.`
      };
    }
  }

  // Check local storage for on-boarded dynamic clients
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(`omnistu_client_${cleanKey}`);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch {
    // Silent fail in non-browser or sandbox environments
  }

  // Synthesize dynamic client from cleanKey
  const generatedName = cleanKey.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  return {
    ...DEFAULT_CLIENT,
    isSample: true,
    id: cleanKey,
    name: generatedName,
    city: 'Your Local Area',
    heroHeadline: `Experience Your ${generatedName} Space in 3D`,
    heroSubheadline: `Premier architectural staging, custom millwork, and luxury renovation serving your area.`
  };
}
