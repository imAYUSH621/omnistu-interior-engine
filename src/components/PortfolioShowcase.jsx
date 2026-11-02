import React, { useState } from 'react';
import { PORTFOLIO_ITEMS } from '../data/portfolio';
import { Check, Eye, MapPin, Clock, Maximize2 } from 'lucide-react';

export function PortfolioShowcase({ client, onOpenLeadModal }) {
  // Track before/after view state for each project card
  const [activeViews, setActiveViews] = useState({});

  const toggleView = (id) => {
    setActiveViews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="portfolio" className="py-20 bg-[#0c0c0e] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-wider mb-4">
            <span>Verified Architectural Case Studies</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Curated Transformations by {client.name}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-light">
            Flip between the raw original spaces and the final architectural transformations to inspect millwork, lighting, and stonework detailing.
          </p>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PORTFOLIO_ITEMS.map((item) => {
            const isShowingBefore = !!activeViews[item.id];
            const currentImg = isShowingBefore ? item.beforeImage : item.afterImage;

            return (
              <div
                key={item.id}
                className="bg-zinc-950/80 rounded-2xl border border-zinc-800/80 overflow-hidden shadow-2xl flex flex-col group hover:border-zinc-700 transition-all duration-300"
              >
                {/* Visual Viewport */}
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                  <img
                    src={currentImg}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <span className={`px-3 py-1 rounded-lg text-[11px] font-mono font-semibold backdrop-blur-md border ${
                      isShowingBefore
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                        : 'bg-black/75 text-zinc-200 border-white/10'
                    }`}>
                      {isShowingBefore ? 'RAW ORIGINAL (BEFORE)' : 'ARCHITECTURAL FINISH (AFTER)'}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-lg text-[11px] font-mono bg-brand-500/85 backdrop-blur-md text-white border border-brand-400 font-medium">
                      {item.budgetTier}
                    </span>
                  </div>

                  {/* Toggle Flip Button */}
                  <button
                    onClick={() => toggleView(item.id)}
                    className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-black text-white text-xs font-mono border border-zinc-700 shadow-xl backdrop-blur-md transition-all active:scale-95 flex items-center space-x-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-brand-400" />
                    <span>Flip to {isShowingBefore ? 'After' : 'Before'}</span>
                  </button>
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center space-x-3 text-xs text-brand-400 font-mono mb-1">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.location}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-white tracking-tight">
                      {item.title}
                    </h3>

                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Specifications List */}
                  <div className="space-y-1.5 pt-3 border-t border-zinc-900">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                      Architectural Key Specs
                    </div>
                    {item.specs.map((spec, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-brand-400 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer / Consult Button */}
                  <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                    <div className="text-[11px] font-mono text-zinc-400 flex items-center space-x-3">
                      <span>{item.sqft}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.duration}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenLeadModal({
                        project: item.title,
                        budget: item.budgetTier,
                        style: item.category
                      })}
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-200 border border-zinc-700 hover:border-brand-400 transition"
                    >
                      Inquire About This Style
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
