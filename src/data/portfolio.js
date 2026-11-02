// Curated SOTA Portfolio Transformations (CC0 / High-Res Unsplash Architectural CDN)

export const PORTFOLIO_ITEMS = [
  {
    id: 'living-room-japandi',
    title: 'Japandi Living Concept',
    category: 'Living & Dining Concept',
    location: 'Sample location',
    sqft: 'Sample size',
    duration: 'Sample timeline',
    budgetTier: 'Sample budget ($85k tier)',
    description: 'Concept: an organic Japandi living pavilion with fluted white oak millwork, a custom boucle sectional and warm hidden lighting.',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    specs: [
      'Custom floating white oak cabinetry with integrated warm 2700K LED channels',
      'Hon-slab Roman Travertine fireplace surround with zero-combustible hearth',
      'Italian imported low-profile modular seating upholstered in Dedar bouclé',
      'Zero-VOC acoustic plaster ceiling finish with flush recessed spotlights'
    ]
  },
  {
    id: 'chef-kitchen-bespoke',
    title: 'Marble Chef Kitchen Concept',
    category: 'Gourmet Kitchen Concept',
    location: 'Sample location',
    sqft: 'Sample size',
    duration: 'Sample timeline',
    budgetTier: 'Sample budget ($120k tier)',
    description: 'Concept: a gourmet kitchen with a marble-look waterfall island, smoked oak cabinetry and seamlessly integrated appliances.',
    beforeImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1200&q=80',
    specs: [
      'Book-matched 3cm Calacatta Viola marble waterfall island with fluted brass toe kick',
      'Hand-crafted smoked oak veneer cabinetry with Blum soft-close Servo-Drive',
      'Solid unlacquered brass hardware with natural living patina',
      'Concealed motorized pocket-door coffee scullery and wine reserve'
    ]
  },
  {
    id: 'primary-suite-haven',
    title: 'Organic Minimalist Suite Concept',
    category: 'Primary Suite Concept',
    location: 'Sample location',
    sqft: 'Sample size',
    duration: 'Sample timeline',
    budgetTier: 'Sample budget ($68k tier)',
    description: 'Concept: a serene suite with textured limewash walls, an upholstered platform bed and full-height drapery.',
    beforeImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    specs: [
      'Artisanal Bauwerk limewash textured wall finish in shade "Bone"',
      'Integrated floating cantilevered nightstands with wireless charging veneer',
      'Automated Lutron Palladiom motorized sheer and blackout double drapery',
      'Custom woven New Zealand wool area rug with hand-bound organic edges'
    ]
  },
  {
    id: 'spa-bath-retreat',
    title: 'Travertine Wellness Bath Concept',
    category: 'En-Suite & Wet Room Concept',
    location: 'Sample location',
    sqft: 'Sample size',
    duration: 'Sample timeline',
    budgetTier: 'Sample budget ($52k tier)',
    description: 'Concept: a private wet room with travertine-look tiles, a freestanding soaking tub and a rainfall shower.',
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
    specs: [
      'Floor-to-ceiling brushed Navona travertine slab walls with recessed niches',
      'Solid carved stone soaking tub with floor-mounted brushed gunmetal filler',
      'Frameless architectural glass enclosure with dual thermostatic rainfall heads',
      'Underfloor radiant heating with smart digital touchscreen zoning'
    ]
  }
];

export const STYLE_PRESETS = [
  {
    id: 'japandi',
    name: 'Japandi Serenity',
    tagline: 'Wabi-sabi minimalism meets Scandinavian functional warmth',
    promptSnippet: 'luxury Japandi style interior design, light white oak, textured linen sofa, bonsai tree, warm 2700k ambient architectural lighting, minimal beige aesthetic, 8k render, Architectural Digest photography',
    thumb: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'organic-modern',
    name: 'Warm Organic Modern',
    tagline: 'Sculptural curved forms, travertine stone, and rich earthy textures',
    promptSnippet: 'warm organic modern living room, curved bouclé cream sofa, raw travertine coffee table, limewash walls, brass accents, tall fiddle leaf fig, large black frame windows, hyperrealistic interior design',
    thumb: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'italian-luxury',
    name: 'Bespoke Italian Luxury',
    tagline: 'Dark walnut millwork, Calacatta Viola marble, and bronze highlights',
    promptSnippet: 'ultra luxury Italian contemporary interior design, dark walnut wood slat walls, Calacatta Viola marble fireplace, bronze chandeliers, Minotti furniture, low light moody cinematic architectural photo',
    thumb: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'parisian-haussmann',
    name: 'Modern Haussmann Classic',
    tagline: 'High ornate ceiling mouldings, herringbone parquet, and velvet depth',
    promptSnippet: 'Parisian Haussmann luxury apartment interior design, ornate white wall mouldings, French herringbone oak parquet flooring, modern velvet accent chair, marble fireplace, floor-to-ceiling French doors, magazine quality',
    thumb: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'
  }
];

export const ROOM_PRESETS = [
  {
    id: 'living',
    name: 'Living Pavilion',
    rawImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    fallbackRender: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'kitchen',
    name: 'Gourmet Kitchen',
    rawImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    fallbackRender: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'bedroom',
    name: 'Primary Suite',
    rawImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    fallbackRender: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'bathroom',
    name: 'Wellness Bath',
    rawImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    fallbackRender: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80'
  }
];
