// Multi-tenant Client Directory & Dynamic Profile Synthesizer

export const PRESET_CLIENTS = {
  'del-air': {
    id: 'del-air',
    name: 'Del-Air Luxury Home & Remodeling',
    city: 'Orlando & South Florida',
    phone: '',
    whatsapp: '',
    web3formsKey: '', // Web3Forms access key for native lead delivery; empty = lead delivery inactive
    calLink: '', // Cal.com hosted booking link (user/event-type); empty = booking embed inactive
    crmWebhookUrl: '', // Generic CRM handoff endpoint (non-secret URL only); empty = CRM handoff inactive
    analyticsEndpoint: '', // Consent-gated event collector; empty = no analytics, nothing tracked
    email: '',
    tagline: 'Premier Full-Home Renovation & Architectural Climate Comfort',
    heroHeadline: 'Explore Photorealistic Design Concepts for Your Home',
    heroSubheadline: 'From complete architectural redesigns to bespoke living spaces in South Florida. Explore AI design concepts and an illustrative estimate before you commit.',
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
    web3formsKey: '', // Web3Forms access key for native lead delivery; empty = lead delivery inactive
    calLink: '', // Cal.com hosted booking link (user/event-type); empty = booking embed inactive
    crmWebhookUrl: '', // Generic CRM handoff endpoint (non-secret URL only); empty = CRM handoff inactive
    analyticsEndpoint: '', // Consent-gated event collector; empty = no analytics, nothing tracked
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
    web3formsKey: '', // Web3Forms access key for native lead delivery; empty = lead delivery inactive
    calLink: '', // Cal.com hosted booking link (user/event-type); empty = booking embed inactive
    crmWebhookUrl: '', // Generic CRM handoff endpoint (non-secret URL only); empty = CRM handoff inactive
    analyticsEndpoint: '', // Consent-gated event collector; empty = no analytics, nothing tracked
    email: '',
    tagline: 'Turnkey Architectural Design, Custom Millwork & Whole-Home Remodeling',
    heroHeadline: 'See Design Concepts for Your Remodel Before You Break Ground',
    heroSubheadline: 'Don’t guess what your home will look like. Explore AI design concepts, compare finish grades, and see an illustrative investment breakdown.',
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
    web3formsKey: '', // Web3Forms access key for native lead delivery; empty = lead delivery inactive
    calLink: '', // Cal.com hosted booking link (user/event-type); empty = booking embed inactive
    crmWebhookUrl: '', // Generic CRM handoff endpoint (non-secret URL only); empty = CRM handoff inactive
    analyticsEndpoint: '', // Consent-gated event collector; empty = no analytics, nothing tracked
    email: '',
    tagline: 'Quiet Luxury, Natural Stone & Calibrated Architectural Lighting',
    heroHeadline: 'Turn Your Space into a Serene Architectural Oasis',
    heroSubheadline: 'Zero guesswork. Explore AI design concepts for your living room, chef’s kitchen, or master suite - with an illustrative budget for each direction.',
    accentColor: '#d4af37',
    badge: 'Sample demo profile - not a real business',
    isSample: true,
    projectsCompleted: '280+',
    avgRating: '5.0',
    featuredStyle: 'Japandi Serenity & Calacatta Stone'
  },
  'modnest-living': {
    id: 'modnest-living',
    name: 'ModNest Smart Living',
    city: 'Pune & Bengaluru',
    phone: '',
    whatsapp: '',
    web3formsKey: '',
    calLink: '',
    crmWebhookUrl: '',
    analyticsEndpoint: '',
    email: '',
    tagline: 'Budget-Friendly Modular Kitchens, Wardrobes & First-Home Interiors',
    heroHeadline: 'Stylish Interiors on a Real Budget',
    heroSubheadline: 'Modular packages, transparent per-sq-ft pricing and AI design concepts for first homes and rentals - see options before you spend.',
    accentColor: '#5f8f7a',
    badge: 'Sample demo profile - not a real business',
    isSample: true,
    projectsCompleted: '600+',
    avgRating: '4.8',
    featuredStyle: 'Compact Modern & Budget Japandi',
    estimator: {
      currency: '\u20b9',
      locale: 'en-IN',
      tiers: [
        {
          id: 'smart',
          name: 'Smart Basics',
          pricePerSqft: 1100,
          tagline: 'Functional modular essentials for first homes and rentals',
          materials: ['Standard Laminates & Fittings', 'Modular Kitchen & Wardrobe', 'Essential Lighting']
        },
        {
          id: 'comfort',
          name: 'Comfort Plus',
          pricePerSqft: 1900,
          tagline: 'Upgraded finishes, better hardware, smarter storage',
          materials: ['Acrylic & Membrane Finishes', 'Soft-Close Branded Hardware', 'False Ceiling with Cove Lighting']
        },
        {
          id: 'premium',
          name: 'Premium Compact',
          pricePerSqft: 3000,
          tagline: 'Designer finishes and layered lighting for compact homes',
          materials: ['Veneer & PU Finishes', 'Quartz Counters', 'Designer Lighting']
        }
      ]
    }
  },
  'arcline-interiors': {
    id: 'arcline-interiors',
    name: 'Arcline Interiors & Turnkey Studio',
    city: 'Jaipur & Delhi NCR',
    phone: '',
    whatsapp: '',
    web3formsKey: '',
    calLink: '',
    crmWebhookUrl: '',
    analyticsEndpoint: '',
    email: '',
    tagline: 'Full-Home Interiors, Modular Kitchens & Turnkey Renovation',
    heroHeadline: 'See Your Home Reimagined Before You Spend a Rupee',
    heroSubheadline: 'AI design concepts, transparent per-sq-ft budgeting and direct consultation booking for Indian homes - visualise your space first, decide later.',
    accentColor: '#b38053',
    badge: 'Sample demo profile - not a real business',
    isSample: true,
    projectsCompleted: '350+',
    avgRating: '4.9',
    featuredStyle: 'Warm Contemporary Indian & Japandi',
    // Illustrative per-sq-ft bands for the Indian market (the estimator always
    // labels figures as illustrative; final quotes follow a real consultation)
    estimator: {
      currency: '₹',
      locale: 'en-IN',
      tiers: [
        {
          id: 'essential',
          name: 'Essential Comfort',
          pricePerSqft: 1500,
          tagline: 'Quality modular finishes, branded hardware, smart storage',
          materials: ['Branded Laminates & Hardware', 'Modular Kitchen & Wardrobes', 'False Ceiling with Cove Lighting']
        },
        {
          id: 'premium',
          name: 'Premium Designer',
          pricePerSqft: 3000,
          tagline: 'Designer surfaces, veneer and PU finishes, layered lighting',
          materials: ['Veneer & PU Duco Finishes', 'Quartz / Granite Counters', 'Designer Lighting & Automation Basics']
        },
        {
          id: 'luxury',
          name: 'Signature Luxury',
          pricePerSqft: 5500,
          tagline: 'Imported stone, bespoke carpentry, full home automation',
          materials: ['Italian Marble & Imported Stone', 'Bespoke Solid-Wood Carpentry', 'Full Home Automation & AV']
        }
      ]
    }
  }
};


// Per-client module switches. Every module defaults ON for backward
// compatibility; a client who already runs their own calendar, CRM, quoting
// or portfolio turns that piece OFF here instead of receiving a duplicate.
export const DEFAULT_MODULES = {
  aiStudio: true,   // Interactive AI design concept studio
  estimator: true,  // Scope & investment estimator
  portfolio: true,  // Portfolio showcase
  whatsapp: true,   // WhatsApp speed-to-lead inside the enquiry flow
  booking: true,    // Consultation booking (Cal.com hosted embed) inside the enquiry flow
};

export function getModules(client) {
  const overrides = (client && client.modules) || {};
  const merged = { ...DEFAULT_MODULES };
  for (const key of Object.keys(DEFAULT_MODULES)) {
    if (typeof overrides[key] === 'boolean') merged[key] = overrides[key];
  }
  return merged;
}


// Static hosting platform domains: a subdomain there is the deploy account,
// not a client brand, so the engine falls back to the Omnistu sample profile
// instead of synthesizing one from the account name.
const PLATFORM_DEMO_HOSTS = [
  'github.io', 'pages.dev', 'netlify.app', 'vercel.app',
  'web.app', 'firebaseapp.com', 'surge.sh', 'onrender.com'
];

export function isPlatformDemoHost(hostname) {
  const h = (hostname || '').toLowerCase();
  return PLATFORM_DEMO_HOSTS.some(d => h === d || h.endsWith('.' + d));
}

export const DEFAULT_CLIENT = {
  id: 'omnistu-demo',
  name: 'Omnistu Interior Studio',
  city: 'Your City',
  phone: '',
  whatsapp: '',
  // Master demo delivers enquiries to Omnistu's own business inbox
  // (team@omnistu.com) via this public Web3Forms access key. Public by
  // design (client-side form key). Named sample studio presets keep
  // web3formsKey: '' - a real studio's key is set up per client.
  web3formsKey: '3928251b-2cd5-4485-8a9b-00abf5790826',
  // Master demo booking: Omnistu's Cal.com account is set up (free plan,
  // event "Free Design Consultation") but the event is hidden and calLink
  // stays empty until the user confirms availability, duration and medium.
  calLink: '',
  crmWebhookUrl: '',
  analyticsEndpoint: '',
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
        heroHeadline: `Design Concepts & Estimates by ${customName}`,
        heroSubheadline: `Explore AI design concepts, portfolio highlights and an illustrative project estimate - serving ${customCity || 'our community'}.`
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
    heroHeadline: `Design Concepts & Estimates by ${generatedName}`,
    heroSubheadline: `Explore AI design concepts, portfolio highlights and an illustrative project estimate - serving your area.`
  };
}
