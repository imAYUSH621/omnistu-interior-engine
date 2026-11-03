import React, { useState } from 'react';
import { Calculator, ArrowRight, Check, DollarSign, Calendar, Layers, ShieldCheck } from 'lucide-react';

const SCOPES = [
  { id: 'kitchen', name: 'Gourmet Kitchen', baseMult: 1.4, defaultSqft: 450, duration: '4-6 Weeks' },
  { id: 'bath', name: 'Master Bath Suite', baseMult: 1.6, defaultSqft: 280, duration: '3-5 Weeks' },
  { id: 'living', name: 'Living Pavilion', baseMult: 1.0, defaultSqft: 850, duration: '5-7 Weeks' },
  { id: 'whole-home', name: 'Whole Home Remodel', baseMult: 1.25, defaultSqft: 2400, duration: '8-14 Weeks' }
];

const TIERS = [
  {
    id: 'curated',
    name: 'Curated Designer',
    pricePerSqft: 35,
    tagline: 'Premium engineered surfaces, designer lighting, semi-custom cabinetry',
    materials: ['Engineered Quartz', 'White Oak Veneers', 'Designer Brass Fixtures']
  },
  {
    id: 'luxury',
    name: 'Architectural Luxury',
    pricePerSqft: 75,
    tagline: 'Book-matched marble slabs, solid fluted hardwoods, Lutron smart lighting',
    materials: ['Roman Travertine / Calacatta', 'Solid Smoked Oak', 'Lutron Lighting & Motorized Shades']
  },
  {
    id: 'bespoke',
    name: 'Ultra-Bespoke Penthouse',
    pricePerSqft: 130,
    tagline: 'Hand-carved stone tubs, Italian imported millwork, Gaggenau integration',
    materials: ['Italian Calacatta Viola', 'Handmade Artisan Plaster', 'Architectural Steel & Concealed Millwork']
  }
];

// Per-client estimator configuration (reusable module): a client profile can
// carry its own currency, locale and price bands. Absent config falls back to
// the US-dollar reference bands. All figures remain illustrative estimates.
const DEFAULT_ESTIMATOR_CONFIG = { currency: '$', locale: 'en-US', tiers: TIERS };

export function CostEstimator({ client, onOpenLeadModal }) {
  const estimatorConfig = (client && client.estimator && Array.isArray(client.estimator.tiers) && client.estimator.tiers.length > 0)
    ? { ...DEFAULT_ESTIMATOR_CONFIG, ...client.estimator }
    : DEFAULT_ESTIMATOR_CONFIG;
  const tiers = estimatorConfig.tiers;
  const fmt = (n) => `${estimatorConfig.currency}${n.toLocaleString(estimatorConfig.locale)}`;

  // State holds ids, not config objects: when the active client changes the
  // derived tier is re-resolved from the NEW client's bands, so a stale tier
  // from the previous profile can never price the estimate.
  const [selectedScope, setSelectedScope] = useState(SCOPES[0]);
  const [sqft, setSqft] = useState(selectedScope.defaultSqft);
  const [selectedTierId, setSelectedTierId] = useState(null);
  const selectedTier = tiers.find(t => t.id === selectedTierId) || tiers[1] || tiers[0];

  // Calculate dynamic investment range
  const rawBase = sqft * selectedTier.pricePerSqft * selectedScope.baseMult;
  const lowEstimate = Math.round((rawBase * 0.9) / 1000) * 1000;
  const highEstimate = Math.round((rawBase * 1.15) / 1000) * 1000;

  // Breakdown percentages
  const designFee = Math.round(lowEstimate * 0.15);
  const materials = Math.round(lowEstimate * 0.55);
  const labor = Math.round(lowEstimate * 0.30);

  return (
    <section id="cost-estimator" className="py-20 bg-zinc-950 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>Transparent Investment Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-gradient-gold tracking-tight">
            Calculate Your Renovation Investment in Real Time
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-light">
            Model your project scope and receive an instant, illustrative investment band to start the conversation - final quotes come after a real consultation.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-zinc-900/60 p-6 sm:p-8 rounded-2xl border border-zinc-800 space-y-8">
            
            {/* Scope Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                1. Project Scope
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SCOPES.map((scope) => (
                  <button
                    key={scope.id}
                    onClick={() => {
                      setSelectedScope(scope);
                      setSqft(scope.defaultSqft);
                    }}
                    className={`p-3 rounded-xl border text-xs font-medium transition text-center ${
                      selectedScope.id === scope.id
                        ? 'bg-brand-500/20 border-brand-400 text-white font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    {scope.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Square Footage Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  2. Room Dimensions
                </label>
                <span className="text-sm font-bold text-brand-300 font-mono">
                  {sqft.toLocaleString()} SQ FT
                </span>
              </div>
              <input
                type="range"
                min="150"
                max="5000"
                step="50"
                value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-1">
                <span>150 sq ft (Powder Room)</span>
                <span>2,500 sq ft</span>
                <span>5,000+ sq ft (Estate)</span>
              </div>
            </div>

            {/* Finish Tier Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                3. Architectural Finish Grade
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {tiers.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                      selectedTier.id === tier.id
                        ? 'bg-brand-500/20 border-brand-400 text-white shadow-lg'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white">{tier.name}</div>
                      <div className="text-[11px] text-brand-400 font-mono mt-0.5">
                        ~{fmt(tier.pricePerSqft)}/sq ft
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                        {tier.tagline}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-zinc-900 via-[#14110d] to-zinc-950 p-6 sm:p-8 rounded-2xl gradient-ring shadow-[0_18px_60px_-18px_rgba(163,132,97,0.35)] space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Estimated Investment Band</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                ILLUSTRATIVE ESTIMATE
              </span>
            </div>

            {/* Hero Number Display */}
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                {fmt(lowEstimate)} – {fmt(highEstimate)}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Estimated duration: <span className="text-white font-semibold">{selectedScope.duration}</span> from demolition to turnkey delivery.
              </p>
            </div>

            {/* Cost Allocation Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Estimated Budget Allocation
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Design, Architecture & Permitting (15%)</span>
                    <span className="font-mono">{fmt(designFee)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-400 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Stone, Custom Millwork & Materials (55%)</span>
                    <span className="font-mono">{fmt(materials)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '55%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Licensed Trade Craftsmanship & Installation (30%)</span>
                    <span className="font-mono">{fmt(labor)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Key Inclusions List */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Included in this tier:</div>
              {selectedTier.materials.map((mat, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs text-zinc-300">
                  <Check className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                  <span>{mat}</span>
                </div>
              ))}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => onOpenLeadModal({
                room: selectedScope.name,
                style: selectedTier.name,
                budget: `${fmt(lowEstimate)} - ${fmt(highEstimate)}`,
                sqft: `${sqft} sq ft`
              })}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-sm tracking-wide shadow-xl shadow-brand-500/25 transition active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Get Itemized Estimate & Free Consult</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[11px] text-zinc-500 font-mono">
              Includes complimentary 30-min architectural consultation
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
