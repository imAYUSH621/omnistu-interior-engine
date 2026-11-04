import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, PanelTop, Globe, Inbox, RotateCcw } from 'lucide-react';
import { CostEstimator } from './CostEstimator';
import { PRESET_CLIENTS } from '../data/clients';

// A client-facing rehearsal, not a new CRM. All state is in memory. This route
// never renders LeadModal or account connectors and never makes a submission.
export function ClientRehearsal() {
  const [mode, setMode] = useState('existing');
  const [step, setStep] = useState(0);
  const [context, setContext] = useState(null);
  const [outcome, setOutcome] = useState('accepted');
  const [style, setStyle] = useState('Warm organic modern');
  const reset = () => { setStep(0); setContext(null); setOutcome('accepted'); };
  const qualify = value => { setContext(value); setStep(2); };
  const card = 'rounded-2xl border border-white/10 bg-white/[0.035] p-6';
  const button = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#c8ad87] text-zinc-950 px-5 py-3 text-sm font-semibold hover:bg-[#ddc7a7]';
  return <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 font-sans">
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
      <div className="flex flex-wrap justify-between gap-4 items-center text-xs text-zinc-400">
        <a href="?view=offers" className="inline-flex items-center gap-2"><ArrowLeft size={14} />Service overview</a>
        <span className="border border-amber-300/20 text-amber-200 rounded-full px-3 py-1.5">LOCAL REHEARSAL · SAMPLE DATA · NO MESSAGES SENT</span>
      </div>
      <header className="mt-10 mb-8 max-w-3xl">
        <p className="text-xs tracking-widest text-[#c8ad87] uppercase">From a website visit to a useful conversation</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight leading-tight">See what your studio gets.<br /><span className="text-[#c8ad87]">Before connecting anything.</span></h1>
        <p className="mt-5 text-zinc-400 leading-relaxed">Walk through a homeowner's request and the brief your team would receive. Keep your existing website or explore a full-site setup. CRM and booking are optional later connections, not requirements for this demonstration.</p>
      </header>
      <nav aria-label="Rehearsal progress" className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {['Choose your setup', 'Qualify the project', 'Review the enquiry', 'Studio handoff'].map((name, i) => <div key={name} className={`rounded-xl border p-3 text-xs ${step === i ? 'border-[#c8ad87] bg-[#c8ad87]/10 text-white' : 'border-white/10 text-zinc-500'}`}><span className="mr-2">{i < step ? '✓' : i + 1}</span>{name}</div>)}
      </nav>
      {step === 0 && <>
        <div className="grid md:grid-cols-2 gap-4">
          {[['existing', PanelTop, 'We already have a website', 'Add a concept-and-enquiry experience without replacing the site. Keep your existing quoting and booking tools.'], ['full', Globe, 'We need a full studio website', 'Explore a branded website, portfolio and configurable estimate-to-enquiry flow. Content and prices are tailored during setup.']].map(([id, Icon, title, body]) => <button key={id} aria-pressed={mode === id} onClick={() => setMode(id)} className={`${card} text-left ${mode === id ? '!border-[#c8ad87] bg-[#c8ad87]/10' : ''}`}><Icon className="text-[#c8ad87] mb-4" /><h2 className="text-xl font-semibold">{title}</h2><p className="text-sm text-zinc-400 mt-3 leading-relaxed">{body}</p><span className="inline-flex gap-2 mt-5 text-xs text-[#c8ad87]">{mode === id && <Check size={15} />}{mode === id ? 'Selected' : 'Select this setup'}</span></button>)}
        </div>
        <div className="mt-5 flex flex-wrap justify-between items-center gap-4"><p className="text-xs text-zinc-500">No account, contact details or CRM access needed.</p><button className={button} onClick={() => setStep(1)}>Try the homeowner journey<ArrowRight size={16} /></button></div>
      </>}
      {step === 1 && <>
        {mode === 'existing' ? <div className={card}>
          <p className="text-xs text-[#c8ad87]">EXISTING-SITE ADD-ON</p><h2 className="mt-2 text-2xl font-semibold">Give the enquiry a starting point</h2><p className="mt-3 text-sm text-zinc-400">The live concept tool can carry a visitor's chosen style into their enquiry. Here we rehearse those choices without an image-provider call. No uploaded-photo redesign is claimed.</p>
          <label htmlFor="rehearsal-style" className="block mt-6 text-sm">Homeowner's style preference</label>
          <select id="rehearsal-style" value={style} onChange={e => setStyle(e.target.value)} className="mt-2 w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-700 p-3"><option>Warm organic modern</option><option>Japandi</option><option>Classic contemporary</option></select>
          <div className="mt-6"><button className={button} onClick={() => qualify({ room: 'Living room', style, intent: 'Existing-site concept enquiry', budget: 'To be discussed with studio' })}>Use these project choices<ArrowRight size={16} /></button></div>
          <a href="host-demo.html" className="inline-block mt-5 text-xs text-[#c8ad87] underline">Inspect the actual sample-site embed separately</a>
        </div> : <div><p className="mb-4 text-sm text-zinc-400">This reuses the real estimator module with the Indian sample studio's illustrative rates. These are not your prices or a contractor quote.</p><CostEstimator rehearsal client={PRESET_CLIENTS['modnest-living']} onOpenLeadModal={qualify} /></div>}
      </>}
      {step === 2 && <div className="grid md:grid-cols-2 gap-5">
        <section className={card}><p className="text-xs text-[#c8ad87]">HOMEOWNER SIDE</p><h2 className="mt-2 text-2xl font-semibold">A brief, not a blank contact form</h2><p className="mt-3 text-sm text-zinc-400">The enquiry carries the choices made on the site. Your team can start with the project, rather than asking the homeowner to repeat everything.</p><dl className="mt-6 space-y-3 text-sm"><div><dt className="text-zinc-500">Sample visitor</dt><dd>Demo Homeowner · demo@example.com</dd></div>{Object.entries(context || {}).map(([key,value]) => <div key={key}><dt className="text-zinc-500 capitalize">{key}</dt><dd className="mt-1">{value}</dd></div>)}</dl><p className="mt-6 text-xs text-amber-200">These details are fixed samples. Nothing is sent or saved to browser storage.</p></section>
        <section className={card}><h3 className="text-lg font-semibold">Rehearse the delivery outcome</h3><p className="mt-3 text-sm text-zinc-400">Choose a controlled result to see how the system should explain it. This is a simulation, not a service test.</p><div className="mt-5 space-y-3">{[['accepted','Email accepted, CRM not connected'],['rejected','Delivery rejected'],['unknown','Email accepted, CRM reply lost']].map(([id,label]) => <label key={id} className="flex items-center gap-3 rounded-xl border border-zinc-700 p-3 text-sm"><input type="radio" name="outcome" value={id} checked={outcome === id} onChange={()=>setOutcome(id)} />{label}</label>)}</div><button className={`${button} mt-6 w-full`} onClick={()=>setStep(3)}>Rehearse studio handoff<Inbox size={16} /></button></section>
      </div>}
      {step === 3 && <div className="grid md:grid-cols-2 gap-5">
        <section className={card}><p className="text-xs text-[#c8ad87]">SIMULATED STUDIO HANDOFF</p><h2 className="mt-2 text-2xl font-semibold">{outcome === 'rejected' ? 'Not delivered - do not claim receipt' : 'Email accepted - check the actual inbox'}</h2><p className="mt-4 text-zinc-400 text-sm leading-relaxed">{outcome === 'rejected' ? 'The studio must not treat this as a received lead. A real setup needs an approved fallback and a checked destination before retry.' : outcome === 'unknown' ? 'CRM outcome is unknown. The record may already exist. Check the destination before retrying; do not resend the accepted email enquiry.' : 'The email path can work without a CRM. Provider acceptance is not proof the team has read it. CRM is intentionally not connected in this rehearsal.'}</p><div className="mt-5 rounded-xl border border-zinc-700 p-4"><p className="font-semibold text-sm">Demo Homeowner</p><p className="text-xs text-zinc-500 mt-1">demo@example.com · sample only</p><div className="mt-4 text-sm space-y-2">{Object.entries(context || {}).map(([key,value])=><p key={key}><span className="text-zinc-500 capitalize">{key}: </span>{value}</p>)}</div></div><p className="mt-4 text-xs text-amber-200">Preview only. No real email, CRM record or appointment was created.</p></section>
        <section className={card}><h3 className="text-lg font-semibold">What changes for your studio</h3><ul className="mt-4 space-y-4 text-sm text-zinc-400"><li>1. Your branding, approved content and chosen modules replace these samples.</li><li>2. Your approved inbox is connected and an actual test enquiry is checked there.</li><li>3. Add your CRM or calendar only if needed, with separate integration tests and approved availability.</li><li>4. Confirm hosting, data handling and client acceptance before launch.</li></ul><p className="mt-5 text-xs text-zinc-500">Not included as finished features: automatic photo redesign, furnished 3D, automatic follow-up or guaranteed sales results.</p><button className={`${button} mt-6`} onClick={reset}><RotateCcw size={16} />Try another setup</button></section>
      </div>}
      {step > 0 && step < 3 && <button className="mt-6 text-sm text-zinc-400 inline-flex gap-2 items-center" onClick={()=>setStep(step-1)}><ArrowLeft size={14} />Back</button>}
      <p className="mt-10 pt-5 border-t border-white/10 text-xs text-zinc-500">Demonstration first, connections later. All actions on this page are local and use sample data. A real client's launch is a separate acceptance step.</p>
    </div>
  </div>;
}
