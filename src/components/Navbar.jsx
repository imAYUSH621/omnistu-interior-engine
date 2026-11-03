import React, { useState } from 'react';
import { Sparkles, Phone, MessageCircle, Calendar, ChevronDown, PlusCircle, Building2, BookOpen } from 'lucide-react';
import { PRESET_CLIENTS } from '../data/clients';

export function Navbar({ client, onSelectClient, onOpenOnboard, onBookConsult, onOpenGuide }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0e]/85 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand & Client Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-bold text-lg">
            {client.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white">
                {client.name}
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-brand-500/15 text-brand-300 border border-brand-500/30">
                PRO PORTAL
              </span>
            </div>
            <p className="text-xs text-zinc-400 tracking-wide font-mono hidden sm:block">
              {client.city} • {client.tagline}
            </p>
          </div>
        </div>

        {/* Right CTA Actions & Multi-Tenant Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-4">

          {/* Demo explanation entry point (sample profiles only) */}
          {client.isSample && onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="hidden md:flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-brand-500/15 border border-brand-500/40 text-brand-200 hover:bg-brand-500/25 text-xs font-mono transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>How this works</span>
            </button>
          )}

          {/* Client Switcher Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700/70 hover:border-brand-400 text-xs text-zinc-300 font-mono transition-colors"
              title="Switch demo client or onboard a new firm"
            >
              <Building2 className="w-3.5 h-3.5 text-brand-400" />
              <span className="hidden sm:inline">Switch Client:</span>
              <span className="font-semibold text-white max-w-[100px] truncate">{client.id}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                  Pre-Configured Lead Demos
                </div>
                {Object.values(PRESET_CLIENTS).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onSelectClient(preset.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-zinc-800/60 transition ${
                      client.id === preset.id ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30' : 'text-zinc-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{preset.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{preset.city}</div>
                    </div>
                  </button>
                ))}

                <div className="pt-2 mt-1 border-t border-zinc-800">
                  <button
                    onClick={onOpenOnboard}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs flex items-center space-x-2 bg-gradient-to-r from-brand-600/30 to-brand-500/30 border border-brand-500/40 text-brand-200 hover:from-brand-600/50 hover:to-brand-500/50 transition font-medium"
                  >
                    <PlusCircle className="w-4 h-4 text-brand-400" />
                    <span>+ Onboard New Firm / Link</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick WhatsApp / Phone Call */}
          {client.whatsapp && (
          <a
            href={`https://wa.me/${client.whatsapp}?text=${encodeURIComponent(`Hi ${client.name}, I just tried your AI design concept tool and would like to speak with the team.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-mono transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
          )}

          {/* Primary Action Button */}
          <button
            onClick={onBookConsult}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-brand-500/25 transition active:scale-95 flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Request Consultation</span>
          </button>
        </div>

      </div>
    </header>
  );
}
