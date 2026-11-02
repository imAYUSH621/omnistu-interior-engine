import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, ExternalLink, Building2, Phone, MapPin } from 'lucide-react';

export function OnboardingModal({ isOpen, onClose, onClientCreated }) {
  const [firmName, setFirmName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tagline, setTagline] = useState('Bespoke Architectural Interiors & Turnkey Remodeling');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!firmName) return;

    const slug = firmName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const newProfile = {
      id: slug,
      name: firmName,
      city: city || 'Metropolitan Area',
      phone: phone || '+1 (800) 555-0199',
      whatsapp: whatsapp || phone.replace(/[^0-9]/g, '') || '18005550199',
      email: `concierge@${slug}.com`,
      tagline: tagline,
      heroHeadline: `Experience Your ${firmName} Space in Photorealistic 3D`,
      heroSubheadline: `Premier architectural staging, custom millwork, and luxury renovation serving ${city || 'our local community'}.`,
      badge: 'Licensed Design/Build Partner • 5.0 Star Houzz Rating',
      projectsCompleted: '120+',
      avgRating: '5.0',
      featuredStyle: 'Japandi & Architectural Luxury'
    };

    // Save to localStorage for persistent local resolution
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`omnistu_client_${slug}`, JSON.stringify(newProfile));
      }
    } catch {
      // Non-blocking fallback
    }

    // Build shareable link encoding metadata so it resolves on any device without local storage
    const params = new URLSearchParams({
      client: slug,
      name: firmName,
      city: city || 'Your Local Area',
      phone: phone || '+1 (800) 555-0199',
      tagline: tagline
    });
    const url = `${window.location.origin}/?${params.toString()}`;
    setGeneratedUrl(url);
    onClientCreated(newProfile);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="inline-flex items-center space-x-2 text-brand-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Instant Client Onboarding Engine</span>
          </div>

          <h3 className="text-2xl font-bold font-display text-white tracking-tight">
            Generate Branded Portal in 30 Seconds
          </h3>

          <p className="text-xs text-zinc-400 mt-2">
            Onboard any interior design or remodeling firm from your lead list. The engine automatically creates their custom-branded 3D stager, cost calculator, and direct WhatsApp links.
          </p>

          {!generatedUrl ? (
            <form onSubmit={handleGenerate} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Company / Firm Name *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    placeholder="e.g. Del-Air Luxury Remodeling or Studio V"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">City / Region</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Orlando, FL"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Studio Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (407) 555-0199"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Firm Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Architectural Interiors & Bespoke Millwork"
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs tracking-wider uppercase transition shadow-xl shadow-brand-500/25 active:scale-95"
              >
                Synthesize Live Client Portal
              </button>
            </form>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-brand-500/40 space-y-2">
                <div className="text-[11px] font-mono uppercase text-brand-300">Live Client Link Generated:</div>
                <div className="text-xs text-white font-mono break-all bg-black/60 p-2.5 rounded-lg border border-zinc-800 select-all">
                  {generatedUrl}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-lg"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Pitch Link'}</span>
                </button>

                <a
                  href={generatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700 flex items-center justify-center space-x-2 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Demo</span>
                </a>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setGeneratedUrl('')}
                  className="text-xs text-zinc-400 hover:text-white underline font-mono"
                >
                  + Onboard Another Client
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
