import React from 'react';
import { X, Sparkles, Calculator, Inbox, CalendarCheck, Play, Compass } from 'lucide-react';

// First-visit explanation for prospects (interior business owners) who open a
// demo link cold. Shown only for sample profiles, never for a real configured
// client and never inside the embed widget. Every claim maps to a working
// flow on the page; nothing here promises results, ROI or integrations that
// are not demonstrated.
const FLOWS = [
  {
    icon: Sparkles,
    title: 'AI design concepts',
    benefit: 'A visitor picks a style and gets a real AI-generated concept - try it on this page. Free generation time varies and the page says so honestly when the provider is busy. This is the hook that turns a casual browser into an engaged prospect.'
  },
  {
    icon: Calculator,
    title: 'Instant scope & budget',
    benefit: 'They answer a few questions and see an itemized estimate range - and that room, style and budget travel into the enquiry you receive. Pre-qualified, not cold.'
  },
  {
    icon: Inbox,
    title: 'Enquiries that reach you',
    keyBenefit: 'Send a test enquiry and open the studio owner view: name, phone, timeline and project context together. On this master demo the enquiry really is emailed to the Omnistu team inbox, labeled as a test - the same delivery your studio gets to your own business email when we set you up.',
    benefit: 'Send a test enquiry and open the studio owner view: name, phone, timeline and project context together. In a live setup the same enquiry is delivered to your business email and CRM automatically.'
  },
  {
    icon: CalendarCheck,
    title: 'Direct consultation booking',
    keyBenefit: 'The booking step is live on this master demo: it opens Omnistu\u2019s real Cal.com calendar, so you can book an actual slot. For your studio it opens your own calendar when we set you up.',
    benefit: 'The booking step is built into the same flow. In this demo it is shown but not connected; in a live setup it opens your real calendar, so a prospect books while intent is hot.'
  }
];

export function DemoPrologue({ isOpen, onClose, onStartTour, client }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto gradient-ring rounded-2xl shadow-[0_24px_80px_-16px_rgba(0,0,0,0.8)] p-6 sm:p-8">
        <button
          onClick={onClose}
          aria-label="Close demo introduction"
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="pr-10 text-[11px] font-mono uppercase tracking-widest text-brand-300">
          Live product demo • for interior design businesses
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
          Watch a visitor become a qualified enquiry
        </h2>
        <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
          You are looking at the Omnistu engine running as a sample studio, <span className="text-brand-300">{client.name}</span>.
          The design and estimate tools really work - click through them exactly as your customer would.
          The enquiry and booking steps show the complete flow; they connect to your own accounts when we set you up.
          This is what your website does for your business:
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FLOWS.map(({ icon: Icon, title, benefit, keyBenefit }) => (
            <div key={title} className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-semibold text-white">{title}</h3>
              </div>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                {title === 'Direct consultation booking'
                  ? (client.calLink && keyBenefit ? keyBenefit : benefit)
                  : (client.web3formsKey && keyBenefit ? keyBenefit : benefit)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[11px] font-mono text-zinc-500 leading-relaxed border-t border-zinc-800/80 pt-4">
          Honest boundaries: this is a sample studio with sample data - not a real business.
          {client.web3formsKey
            ? 'Test enquiries are clearly labeled and really arrive in Omnistu\u2019s own team inbox on this master demo; no CRM is connected here.'
            : 'Test enquiries are clearly labeled, and nothing here claims to be connected to a real inbox or CRM.'}
          In a live setup each piece is connected to your own accounts and verified with you.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onStartTour}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs tracking-wider uppercase transition shadow-xl shadow-brand-500/25 active:scale-95 flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Start the guided tour</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 font-semibold text-xs tracking-wider uppercase transition active:scale-95 flex items-center justify-center space-x-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore on my own</span>
          </button>
        </div>
      </div>
    </div>
  );
}
