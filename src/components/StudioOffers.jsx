import React from 'react';
import { Globe, PanelTop, Inbox, ArrowLeft, ExternalLink, CheckCircle2, Wrench } from 'lucide-react';

// Service overview for interior business owners: the three ways Omnistu
// delivers this engine, each linked to something they can try right now.
// Every readiness label states what works in this demo versus what needs
// the client's own accounts. No client results, ROI or revenue claims -
// none exist to claim.
const OFFERS = [
  {
    icon: Globe,
    title: 'A complete website for your studio',
    readiness: 'ready-to-show',
    readinessLabel: 'Working in this demo',
    body: 'A full branded site: AI design concept studio, scope and budget estimator, portfolio, and the enquiry flow below - themed to your business, in your currency and price bands.',
    tryLinks: [
      { label: 'Open the full-site demo (luxury preset)', href: './?client=del-air' },
      { label: 'Same engine, budget Indian studio preset', href: './?client=modnest-living' }
    ]
  },
  {
    icon: PanelTop,
    title: 'Added to your existing website',
    readiness: 'ready-to-show',
    readinessLabel: 'Working embed - no rebuild of your site',
    body: 'If you already have a website, the concept studio and enquiry form embed into it as an iframe widget - one snippet, no redesign. The sample below is a fictional studio\'s plain existing site with the engine embedded.',
    tryLinks: [
      { label: 'See it embedded in a sample existing website', href: './host-demo.html' }
    ]
  },
  {
    icon: Inbox,
    title: 'The enquiry funnel',
    readiness: 'setup-dependent',
    readinessLabel: 'Flow works in demo - live delivery needs your accounts',
    body: 'A visitor\'s style choices, room, budget and contact details arrive as one structured enquiry. In this demo, submit a test enquiry and open the studio owner view to see exactly what you would receive. Live delivery to your business email, calendar and CRM connects when we set up your accounts.',
    tryLinks: [
      { label: 'Try the enquiry flow on the demo site', href: './' }
    ]
  }
];

const SETUP_DEPENDENT = [
  'Enquiry delivery to your business email (needs a free Web3Forms key we set up with you)',
  'Consultation booking on your real calendar (needs your free Cal.com account)',
  'Your own domain (e.g. yourstudio.com)',
  'CRM handoff (generic connector, verified against your CRM during setup)'
];

export function StudioOffers() {
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f4f2ee] font-sans antialiased selection:bg-brand-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <a href="./" className="inline-flex items-center space-x-2 text-xs font-mono text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to the live demo site</span>
        </a>

        <div className="mt-8 inline-flex items-center space-x-2 text-brand-300 text-[11px] font-mono uppercase tracking-widest">
          <Wrench className="w-4 h-4" />
          <span>For interior businesses - service overview</span>
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold font-display tracking-tight text-white">
          What Omnistu builds for your studio
        </h1>
        <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-2xl">
          Three ways to use the same engine. Every card links to something you can try right now;
          labels state plainly what works in this demo and what connects during setup.
        </p>

        <div className="mt-10 space-y-6">
          {OFFERS.map((offer) => (
            <div key={offer.title} className="gradient-ring rounded-2xl p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <offer.icon className="w-5 h-5 text-brand-300" />
                <h2 className="text-lg sm:text-xl font-bold font-display text-white tracking-tight">{offer.title}</h2>
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  offer.readiness === 'ready-to-show'
                    ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'
                    : 'text-amber-300 border-amber-500/30 bg-amber-500/10'
                }`}>
                  {offer.readinessLabel}
                </span>
              </div>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{offer.body}</p>
              <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2.5">
                {offer.tryLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-200 text-xs font-semibold hover:bg-brand-500/20 transition"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 sm:p-7">
          <h3 className="text-sm font-bold text-white font-display tracking-tight">Connects during setup - not faked in this demo</h3>
          <ul className="mt-3 space-y-2">
            {SETUP_DEPENDENT.map((item) => (
              <li key={item} className="flex items-start space-x-2 text-xs text-zinc-400 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-zinc-500 leading-relaxed">
            The studios in this demo are fictional samples. No client results, revenue or ROI are claimed anywhere
            in this demo - the engine speaks for itself. Scope and pricing are discussed per project.
          </p>
        </div>
      </div>
    </div>
  );
}
