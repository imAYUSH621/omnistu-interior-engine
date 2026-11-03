import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Clock, Award } from 'lucide-react';
import { checkGeneratorAvailability } from '../services/imageGenerator';

export function Hero({ client, modules, onLaunchRedesign, onLaunchEstimator }) {
  const showRedesign = !modules || modules.aiStudio !== false;
  const showEstimator = !modules || modules.estimator !== false;
  // The free AI endpoint is best-effort; do not promise AI output when the
  // cached probe already knows only the sample path is available.
  const [aiDown, setAiDown] = useState(false);
  useEffect(() => {
    let mounted = true;
    checkGeneratorAvailability().then((ok) => { if (mounted && !ok) setAiDown(true); });
    return () => { mounted = false; };
  }, []);
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-white/5">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-luxury-gold/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Trust Pill / Verification Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-brand-500/30 text-brand-300 text-xs font-mono mb-8 shadow-inner animate-in fade-in">
          <Award className="w-4 h-4 text-brand-400" />
          <span>{client.badge}</span>
        </div>

        {/* Dynamic Client Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display text-white max-w-5xl mx-auto leading-[1.12]">
          {aiDown ? 'Explore Interior Design Concepts for Your Space' : client.heroHeadline}
        </h1>

        {/* Dynamic Subheadline */}
        <p className="mt-6 text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto font-sans font-light leading-relaxed">
          {aiDown
            ? 'Our free AI concept generator is temporarily busy - browse curated sample concepts in signature styles, each clearly labelled as a sample.'
            : client.heroSubheadline}
        </p>

        {/* Primary & Secondary Dual CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          {showRedesign && (
          <button
            onClick={onLaunchRedesign}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-base shadow-xl shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3 group"
          >
            <Sparkles className="w-5 h-5 text-amber-200" />
            <span>{aiDown ? 'Browse Design Concepts' : 'Launch Free AI Design Concept'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          )}

          {showEstimator && (
          <button
            onClick={onLaunchEstimator}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-medium text-base transition-all hover:border-zinc-500 flex items-center justify-center space-x-2"
          >
            <span>Calculate Project Scope & Budget</span>
          </button>
          )}
        </div>

        {/* Social Proof & Value Invariants */}
        <div className="mt-12 pt-8 border-t border-zinc-800/60 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-brand-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">{client.isSample ? 'Live' : client.projectsCompleted}</div>
              <div className="text-zinc-400 text-xs font-mono">{client.isSample ? 'Product Demo' : 'Projects Delivered'}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">{client.isSample ? 'Sample' : `${client.avgRating} / 5.0 Rating`}</div>
              <div className="text-zinc-400 text-xs font-mono">{client.isSample ? 'Demo Content' : 'Client Satisfaction'}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-brand-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">{aiDown ? 'Free Style Concepts' : 'Free AI Concepts'}</div>
              <div className="text-zinc-400 text-xs font-mono">{aiDown ? 'Samples While AI Is Busy' : 'Style Inspiration Only'}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">No-Obligation Consult</div>
              <div className="text-zinc-400 text-xs font-mono">Free Concept First</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
