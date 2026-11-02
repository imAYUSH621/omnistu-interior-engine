// Multi-tenant Client Directory & Dynamic Profile Synthesizer

export const PRESET_CLIENTS = {
  'del-air': {
    id: 'del-air',
    name: 'Del-Air Luxury Home & Remodeling',
    city: 'Orlando & South Florida',
    phone: '+1 (407) 555-3211',
    whatsapp: '14075553211',
    email: 'design@delair.com',
    tagline: 'Premier Full-Home Renovation & Architectural Climate Comfort',
    heroHeadline: 'Experience Your Home Reimagined in Photorealistic 3D',
    heroSubheadline: 'From complete architectural redesigns to bespoke living spaces in South Florida. Visualize your transformation in 15 seconds.',
    accentColor: '#a38461',
    badge: 'Serving Florida Since 1983 • 8 Regional Design Studios',
    projectsCompleted: '3,200+',
    avgRating: '4.9',
    featuredStyle: 'Coastal Luxury & Warm Modern'
  },
  'studio-luxe': {
    id: 'studio-luxe',
    name: 'Studio Luxe Architectural Interiors',
    city: 'Manhattan & The Hamptons, NY',
    phone: '+1 (212) 555-0182',
    whatsapp: '12125550182',
    email: 'private@studioluxe.design',
    tagline: 'High-Concept Residential & Penthouse Interior Architecture',
    heroHeadline: 'Bespoke Interior Architecture for Discerning Homeowners',
    heroSubheadline: 'Tailored Japandi, Italian Minimalist, and Modern Haussmann spaces engineered to elevate status and everyday tranquility.',
    accentColor: '#c5a059',
    badge: 'Architectural Digest Featured • Top 10 NY Design Studios',
    projectsCompleted: '190+',
    avgRating: '5.0',
    featuredStyle: 'Italian Minimalist & Warm Bouclé'
  },
  'haven-remodel': {
    id: 'haven-remodel',
    name: 'Haven Design + Build Studio',
    city: 'Austin & Dallas, TX',
    phone: '+1 (512) 555-8942',
    whatsapp: '15125558942',
    email: 'hello@havendesignbuild.com',
    tagline: 'Turnkey Architectural Design, Custom Millwork & Whole-Home Remodeling',
    heroHeadline: 'Instant 3D Architectural Remodel Before You Break Ground',
    heroSubheadline: 'Don’t guess what your home will look like. Upload your space, customize finish grades, and get an exact itemized investment breakdown.',
    accentColor: '#b38053',
    badge: '100% On-Time Completion Guarantee • Licensed Design/Build',
    projectsCompleted: '450+',
    avgRating: '4.95',
    featuredStyle: 'Organic Modern & Warm Travertine'
  },
  'kasa-interiors': {
    id: 'kasa-interiors',
    name: 'Kasa Bespoke Living',
    city: 'Los Angeles & Beverly Hills, CA',
    phone: '+1 (310) 555-7319',
    whatsapp: '13105557319',
    email: 'concierge@kasaliving.com',
    tagline: 'Quiet Luxury, Natural Stone & Calibrated Architectural Lighting',
    heroHeadline: 'Turn Your Space into a Serene Architectural Oasis',
    heroSubheadline: 'Zero guesswork. Experience custom 3D staging of your living room, chef’s kitchen, or master suite in under 15 seconds.',
    accentColor: '#d4af37',
    badge: 'Winner Best of Houzz 2024 • Luxury Residential Specialist',
    projectsCompleted: '280+',
    avgRating: '5.0',
    featuredStyle: 'Japandi Serenity & Calacatta Stone'
  }
};

export const DEFAULT_CLIENT = {
  id: 'apex-design',
  name: 'Apex Architectural Studio',
  city: 'Metropolitan & Coastal Enclaves',
  phone: '+1 (800) 555-0199',
  whatsapp: '18005550199',
  email: 'concierge@apexarchitectural.com',
  tagline: 'High-Ticket Interior Architecture & Turnkey Luxury Remodeling',
  heroHeadline: 'Experience Your Home Reimagined in SOTA 3D in 15 Seconds',
  heroSubheadline: 'Upload your room, select your signature aesthetic, and see your space transformed into a luxury masterpiece before booking.',
  accentColor: '#a38461',
  badge: '5-Star Rated Design/Build Partner • 140+ Projects Delivered',
  projectsCompleted: '140+',
  avgRating: '5.0',
  featuredStyle: 'Japandi & Warm Organic Modern'
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
        phone: customPhone || '+1 (800) 555-0199',
        whatsapp: (customPhone || '').replace(/[^0-9]/g, '') || '18005550199',
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
    id: cleanKey,
    name: generatedName,
    city: 'Your Local Area',
    heroHeadline: `Experience Your ${generatedName} Space in 3D`,
    heroSubheadline: `Premier architectural staging, custom millwork, and luxury renovation serving your area.`
  };
}
