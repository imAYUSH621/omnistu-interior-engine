import React, { useState } from 'react';
import { X, CheckCircle, MessageCircle, ArrowRight, ShieldCheck, Phone, Mail, User, Clock } from 'lucide-react';
import { CalEmbed } from './CalEmbed';
import { getModules } from '../data/clients';
import { handoffLeadToCrm } from '../services/crmHandoff';
import { trackEvent, getAnalyticsConsent, setAnalyticsConsent } from '../services/analyticsEvents';

export function LeadModal({ isOpen, onClose, client, contextData }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    timeline: 'Within 1-2 Months',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  // Explicit visitor consent before anything is sent to a link-supplied demo
  // endpoint. Required only in that mode; trusted config paths don't ask.
  const [demoConsent, setDemoConsent] = useState(false);
  const [delivery, setDelivery] = useState(null); // 'sent' | 'failed' | 'demo'
  // CRM handoff is a separate state from delivery: provider acceptance is not
  // inbox receipt, and neither is CRM sync.
  const [crmSync, setCrmSync] = useState(null); // null | 'skipped' | 'synced' | 'failed'
  // Visitor analytics consent: null = no choice yet (notice shown when the
  // studio has analytics configured), true/false = explicit choice.
  const [analyticsConsent, setAnalyticsConsentState] = useState(() => getAnalyticsConsent(client));
  const chooseAnalyticsConsent = (accepted) => {
    setAnalyticsConsent(client, accepted);
    setAnalyticsConsentState(accepted);
  };
  const modules = getModules(client);

  if (!isOpen) return null;

  // Native premade integrations, configured per client (or build-time env for
  // the operator's own demo). Empty = that path stays inactive and the UI says
  // so honestly. No account or destination is assumed.
  const web3formsKey = client.web3formsKey || (import.meta.env && import.meta.env.VITE_WEB3FORMS_KEY) || '';
  // Runtime demo config: the presenter can attach a lead endpoint and CRM
  // webhook via URL params so a live demo needs no rebuild - but ONLY in
  // explicit demo mode (?demoMode=endpoints). A shared link alone must never
  // silently redirect a visitor's contact details to an arbitrary endpoint.
  // Production delivery stays with trusted config (per-client profile or
  // build-time env), never the URL. No secrets belong in these URLs: they are
  // visible in the link itself.
  const linkParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const leadEndpointParam = linkParams.get('leadEndpoint') || '';
  const crmWebhookParam = linkParams.get('crmWebhook') || '';
  const demoMode = linkParams.get('demoMode') === 'endpoints';
  const leadEndpoint = (demoMode ? leadEndpointParam : '') || (import.meta.env && import.meta.env.VITE_LEAD_ENDPOINT) || '';
  const crmWebhookOverride = demoMode ? crmWebhookParam : '';
  const demoEndpointActive = demoMode && !!leadEndpointParam;
  const demoEndpointHost = (() => {
    try { return new URL(leadEndpointParam || crmWebhookParam).host; } catch { return 'the link-supplied endpoint'; }
  })();
  const whatsappNumber = client.whatsapp || (import.meta.env && import.meta.env.VITE_DEMO_WHATSAPP) || '';
  const bookingUrl = (import.meta.env && import.meta.env.VITE_BOOKING_URL) || '';
  const calLink = client.calLink || (import.meta.env && import.meta.env.VITE_CAL_LINK) || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    if (demoEndpointActive && !demoConsent) return;

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

    // Deliver through the configured channel. Success is only claimed on
    // actual confirmed receipt by the provider.
    if (web3formsKey) {
      // Native Web3Forms API (https://docs.web3forms.com/getting-started/api-reference):
      // POST access_key + fields; receipt confirmed only by success === true.
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: `New consultation request - ${client.name}`,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: [
              `Timeline: ${formData.timeline}`,
              formData.notes ? `Notes: ${formData.notes}` : '',
              contextData && contextData.room ? `Room: ${contextData.room}` : '',
              contextData && contextData.style ? `Style: ${contextData.style}` : '',
              contextData && contextData.budget ? `Est: ${contextData.budget}` : '',
            ].filter(Boolean).join('\n'),
            botcheck: '',
          })
        });
        const data = res && typeof res.json === 'function' ? await res.json().catch(() => null) : null;
        const accepted = !!(res && res.ok && data && data.success === true);
        setDelivery(accepted ? 'sent' : 'failed');
        if (accepted) {
          trackEvent(client, 'enquiry_submitted');
          setCrmSync(await handoffLeadToCrm({ endpoint: crmWebhookOverride || client.crmWebhookUrl, lead: newLead }));
        }
      } catch {
        setDelivery('failed');
      }
    } else if (leadEndpoint) {
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
        if (accepted) {
          trackEvent(client, 'enquiry_submitted');
          setCrmSync(await handoffLeadToCrm({ endpoint: crmWebhookOverride || client.crmWebhookUrl, lead: newLead }));
        }
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

            {demoEndpointActive && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/60 text-xs leading-relaxed">
                <p className="font-semibold text-amber-300">Demo delivery active - enter fake/sample details only.</p>
                <p className="mt-1 text-amber-200/90">This form sends what you enter to <span className="font-mono text-amber-100">{demoEndpointHost}</span>, a demo destination from the shared link - not to a studio inbox. Do not enter real contact details.</p>
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

              {demoEndpointActive && (
                <label className="flex items-start space-x-2 text-xs text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={demoConsent}
                    onChange={(e) => setDemoConsent(e.target.checked)}
                    className="mt-0.5 accent-amber-400"
                  />
                  <span>I understand this is a demo: the details I entered are fake/sample and will be sent to <span className="font-mono text-amber-200">{demoEndpointHost}</span>.</span>
                </label>
              )}

              <button
                type="submit"
                disabled={demoEndpointActive && !demoConsent}
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs tracking-wider uppercase transition shadow-xl shadow-brand-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                Request My Free Consultation
              </button>
            </form>

            {demoEndpointActive ? (
              <div className="mt-4 flex items-center justify-center space-x-2 text-[11px] font-mono text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo delivery to {demoEndpointHost} • not the studio's private inbox</span>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-center space-x-2 text-[11px] font-mono text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Spam Privacy Invariant • Direct to Lead Designer</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 space-y-6">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg ${delivery === 'sent' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'}`}>
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold font-display text-white">
                {delivery === 'sent' ? 'Request Accepted by Delivery Service' : delivery === 'failed' ? 'Sending Failed' : 'Demo Mode - Not Sent'}
              </h3>
              <p className="text-xs text-zinc-300 mt-2 max-w-sm mx-auto leading-relaxed">
                {delivery === 'sent' ? (
                  demoEndpointActive ? (
                    <>Thank you, <span className="font-semibold text-white">{formData.name}</span>. Your test enquiry was delivered to the demo destination <span className="font-mono text-amber-200">{demoEndpointHost}</span> - a test sink from the shared link, not the studio's CRM. This sample studio has no team, so nobody will contact you from this demo.</>
                  ) : (
                  <>Thank you, <span className="font-semibold text-white">{formData.name}</span>. The delivery service has accepted your request for <span className="text-brand-300">{client.name}</span>. Acceptance by the service is not confirmation that the studio team has seen it yet - they follow up from their inbox.</>
                  )
                ) : delivery === 'failed' ? (
                  <>Sorry, <span className="font-semibold text-white">{formData.name}</span> - your request could not be delivered just now. Please use the direct contact options below.</>
                ) : (
                  <>Thank you, <span className="font-semibold text-white">{formData.name}</span>. This demo is not connected to a live inbox yet, so your request was <span className="font-semibold text-amber-300">not sent anywhere</span>. In the live version it goes straight to the studio.</>
                )}
              </p>
              {delivery === 'sent' && crmSync && (
                <p className="text-[11px] font-mono text-zinc-500">
                  {demoEndpointActive
                    ? (crmSync === 'synced'
                        ? 'Handoff: accepted by the demo test endpoint (not a CRM).'
                        : crmSync === 'failed'
                          ? 'Demo handoff endpoint failed - your test enquiry was still accepted by the delivery service above.'
                          : 'Handoff endpoint: not configured in this demo link.')
                    : (crmSync === 'synced'
                        ? 'CRM handoff: accepted by the configured CRM endpoint.'
                        : crmSync === 'failed'
                          ? 'CRM handoff failed - your request was still accepted by the delivery service above.'
                          : 'CRM handoff: not configured for this studio yet.')}
                </p>
              )}
            </div>

            {((modules.whatsapp && whatsappNumber) || client.phone || (modules.booking && (bookingUrl || calLink))) && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-left space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Instant Speed-to-Lead Direct Options:
              </div>

              {/* Direct WhatsApp Action */}
              {modules.whatsapp && whatsappNumber && (
              <a
                onClick={() => trackEvent(client, 'whatsapp_clicked')}
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

              {/* Native Cal.com hosted booking embed (only when configured) */}
              {modules.booking && calLink && (
              <div onClick={() => trackEvent(client, 'booking_clicked')} className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 p-2">
                <CalEmbed calLink={calLink} />
              </div>
              )}

              {/* Booking link (only when a real scheduler URL is configured) */}
              {modules.booking && !calLink && bookingUrl && (
              <a
                onClick={() => trackEvent(client, 'booking_clicked')}
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

        {/* Visitor analytics consent: only appears when the studio has an
            analytics endpoint configured, and only until the visitor chooses.
            A configured endpoint is the owner's choice, not the visitor's. */}
        {client.analyticsEndpoint && analyticsConsent === null && (
          <div className="mt-5 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left">
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Allow usage events on this site? Only the type of action is
              counted - never your name, phone, email or enquiry details.
            </p>
            <div className="mt-2 flex items-center space-x-3">
              <button
                onClick={() => chooseAnalyticsConsent(true)}
                className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-semibold transition"
              >
                Allow
              </button>
              <button
                onClick={() => chooseAnalyticsConsent(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition"
              >
                No thanks
              </button>
            </div>
          </div>
        )}
        {client.analyticsEndpoint && analyticsConsent === true && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-[10px] font-mono text-zinc-600">
            <span>Usage events are on - no contact details are sent.</span>
            <button
              onClick={() => chooseAnalyticsConsent(false)}
              className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            >
              Withdraw
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
