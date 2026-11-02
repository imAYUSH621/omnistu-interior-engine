import React, { useState } from 'react';
import { X, CheckCircle, MessageCircle, ArrowRight, ShieldCheck, Phone, Mail, User, Clock } from 'lucide-react';

export function LeadModal({ isOpen, onClose, client, contextData }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    timeline: 'Within 1-2 Months',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [delivery, setDelivery] = useState(null); // 'sent' | 'failed' | 'demo'

  if (!isOpen) return null;

  // Optional lead delivery endpoint (e.g. Web3Forms / Formspree) and demo WhatsApp,
  // injected at build time. Empty = leads stay on the visitor's device only.
  const leadEndpoint = (import.meta.env && import.meta.env.VITE_LEAD_ENDPOINT) || '';
  const whatsappNumber = client.whatsapp || (import.meta.env && import.meta.env.VITE_DEMO_WHATSAPP) || '';
  const bookingUrl = (import.meta.env && import.meta.env.VITE_BOOKING_URL) || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // Save locally for persistence
    const newLead = {
      ...formData,
      client: client.name,
      context: contextData,
      timestamp: new Date().toISOString()
    };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const existing = JSON.parse(localStorage.getItem('omnistu_leads') || '[]');
        existing.unshift(newLead);
        localStorage.setItem('omnistu_leads', JSON.stringify(existing));
      }
    } catch {
      // Non-blocking fallback
    }

    // Deliver to the configured endpoint when one is set (build-time env).
    // Success is only claimed on actual durable receipt.
    if (leadEndpoint) {
      try {
        const res = await fetch(leadEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(newLead)
        });
        // HTTP ok alone is not proof of acceptance: when the endpoint returns a
        // JSON body with a success flag (Web3Forms/Formspree style), honor it.
        let accepted = !!(res && res.ok);
        if (accepted && typeof res.clone === 'function') {
          const data = await res.clone().json().catch(() => null);
          if (data && (data.success === false || data.ok === false)) accepted = false;
        }
        setDelivery(accepted ? 'sent' : 'failed');
      } catch {
        setDelivery('failed');
      }
    } else {
      setDelivery('demo');
    }

    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${client.name}, I am ${formData.name || 'a homeowner'} in ${client.city}. I just generated a free AI design concept for my ${contextData?.room || 'home'} (${contextData?.budget || 'Custom Scope'}). I'd like to discuss my project and schedule a consultation.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center space-x-2 text-brand-400 text-xs font-mono mb-2 uppercase tracking-wider">
              <span>{client.name} Priority Concierge</span>
            </div>
            
            <h3 className="text-2xl font-bold font-display text-white tracking-tight">
              Get Your Full Concept & Free Consultation
            </h3>
            
            <p className="text-xs text-zinc-400 mt-2">
              Enter your details and the team will follow up with your full concept details and a free design consultation.
            </p>

            {contextData && (
              <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex flex-wrap gap-2">
                {contextData.room && <span className="text-brand-300">Room: {contextData.room}</span>}
                {contextData.style && <span>• Style: {contextData.style}</span>}
                {contextData.budget && <span>• Est: {contextData.budget}</span>}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Katherine Vance"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Phone Number / WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 019-2834"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="katherine@vance.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Target Project Timeline</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-400"
                  >
                    <option>Immediately (Within 30 Days)</option>
                    <option>Within 1-2 Months</option>
                    <option>Within 3-6 Months</option>
                    <option>Planning Phase / Next Year</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs tracking-wider uppercase transition shadow-xl shadow-brand-500/25 active:scale-95"
              >
                Request My Free Consultation
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center space-x-2 text-[11px] font-mono text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Spam Privacy Invariant • Direct to Lead Designer</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-6">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg ${delivery === 'sent' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'}`}>
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold font-display text-white">
                {delivery === 'sent' ? 'Request Received!' : delivery === 'failed' ? 'Sending Failed' : 'Demo Mode - Not Sent'}
              </h3>
              <p className="text-xs text-zinc-300 mt-2 max-w-sm mx-auto leading-relaxed">
                {delivery === 'sent' ? (
                  <>Thank you, <span className="font-semibold text-white">{formData.name}</span>. The <span className="text-brand-300">{client.name}</span> team has received your request and will follow up shortly.</>
                ) : delivery === 'failed' ? (
                  <>Sorry, <span className="font-semibold text-white">{formData.name}</span> - your request could not be delivered just now. Please use the direct contact options below.</>
                ) : (
                  <>Thank you, <span className="font-semibold text-white">{formData.name}</span>. This demo is not connected to a live inbox yet, so your request was <span className="font-semibold text-amber-300">not sent anywhere</span>. In the live version it goes straight to the studio.</>
                )}
              </p>
            </div>

            {(whatsappNumber || client.phone || bookingUrl) && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-left space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Instant Speed-to-Lead Direct Options:
              </div>

              {/* Direct WhatsApp Action */}
              {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp With the Team</span>
              </a>
              )}

              {/* Call Directly */}
              {client.phone && (
              <a
                href={`tel:${client.phone}`}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center justify-center space-x-2 transition"
              >
                <Phone className="w-3.5 h-3.5 text-brand-400" />
                <span>Call Studio Desk: {client.phone}</span>
              </a>
              )}

              {/* Booking link (only when a real scheduler URL is configured) */}
              {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Book a Consultation Slot</span>
              </a>
              )}
            </div>
            )}

            <button
              onClick={onClose}
              className="text-xs font-mono text-zinc-400 hover:text-white underline"
            >
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
