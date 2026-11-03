import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export function Footer({ client }) {
  return (
    <footer className="bg-gradient-to-b from-[#0e0d0b] to-black border-t border-brand-900/40 py-16 text-zinc-400 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-900">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                {client.name.charAt(0)}
              </div>
              <span className="font-display font-bold text-base text-white tracking-tight">
                {client.name}
              </span>
            </div>
            <p className="text-zinc-400 text-xs max-w-sm leading-relaxed">
              {client.tagline}. Dedicated to delivering high-concept residential interiors and whole-home architectural remodels in {client.city}.
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{client.isSample ? 'Interactive demo - sample content for illustration only' : 'Licensed, Insured & Bonded General Design/Build Contractor'}</span>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="space-y-2.5">
            <div className="text-white font-mono uppercase tracking-wider text-xs mb-3">Direct Studio</div>
            {client.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              <a href={`tel:${client.phone}`} className="hover:text-white transition font-mono">
                {client.phone}
              </a>
            </div>
            )}
            {client.email && (
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-brand-400" />
              <a href={`mailto:${client.email}`} className="hover:text-white transition font-mono">
                {client.email}
              </a>
            </div>
            )}
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              <span>{client.city}</span>
            </div>
          </div>

          {/* Architectural Invariants */}
          <div className="space-y-2">
            <div className="text-white font-mono uppercase tracking-wider text-xs mb-3">Client Standards</div>
            <div className="text-zinc-400 text-xs">• Free AI Design Concepts</div>
            <div className="text-zinc-400 text-xs">• Transparent Instant Estimates</div>
            <div className="text-zinc-400 text-xs">• For Inspiration & Planning Only</div>
            <div className="text-zinc-400 text-xs">• No-Obligation Consultation</div>
          </div>

        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-[11px] font-mono gap-4">
          <div>
            © {new Date().getFullYear()} {client.name}. All rights reserved.
          </div>
          <div className="flex items-center space-x-2">
            <span>Powered by</span>
            <span className="text-brand-300 font-semibold">Omnistu Interior Engine</span>
          </div>
          {client.isSample && (
            <a href="?view=offers" className="hover:text-brand-300 transition underline underline-offset-2 decoration-zinc-700">
              Run an interior business? See what Omnistu builds
            </a>
          )}
        </div>

      </div>
    </footer>
  );
}
