import React, { useState } from 'react';
import { X, Sparkles, Calculator, Send, Inbox, ChevronRight } from 'lucide-react';

// Persistent guided tour for prospects exploring the demo. Each step launches
// the real working flow (scroll or modal) and states the business benefit in
// one line. Sample profiles only; never inside the embed widget.
const STEPS = [
  {
    icon: Sparkles,
    title: 'Try the AI concept',
    benefit: 'Your visitor gets a real generated concept - free, timing varies',
    action: { type: 'scroll', target: 'room-redesign' }
  },
  {
    icon: Calculator,
    title: 'Run the estimate',
    benefit: 'They see scope and budget - you get a pre-qualified enquiry',
    action: { type: 'scroll', target: 'cost-estimator' }
  },
  {
    icon: Send,
    title: 'Send a test enquiry',
    benefit: 'Use fake details - see exactly what lands on your desk',
    action: { type: 'enquiry' }
  },
  {
    icon: Inbox,
    title: 'See what you receive',
    benefit: 'The studio owner view: every enquiry, structured',
    action: { type: 'ownerInbox' }
  }
];

export function DemoGuide({ visible, onClose, onAction }) {
  const [current, setCurrent] = useState(0);
  if (!visible) return null;

  const step = STEPS[current];

  const run = (index) => {
    setCurrent(index);
    onAction(STEPS[index].action);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center px-3 pb-3 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-2xl rounded-2xl bg-zinc-950/95 backdrop-blur border border-brand-500/40 shadow-2xl shadow-black/60 p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-300">
            Demo guide • step {current + 1} of {STEPS.length}
          </span>
          <button
            onClick={onClose}
            aria-label="Close demo guide"
            className="p-1 text-zinc-500 hover:text-white rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === current;
            return (
              <button
                key={s.title}
                onClick={() => run(i)}
                className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-xl border text-xs transition ${
                  active
                    ? 'bg-brand-500/20 border-brand-400 text-white'
                    : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-brand-300' : 'text-zinc-500'}`} />
                <span className="font-medium whitespace-nowrap">{s.title}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xs text-zinc-400 leading-snug">
            <span className="text-zinc-200 font-medium">{step.title}:</span> {step.benefit}
          </p>
          {current < STEPS.length - 1 && (
            <button
              onClick={() => run(current + 1)}
              className="flex-shrink-0 flex items-center space-x-1 text-xs font-semibold text-brand-300 hover:text-brand-200 transition"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
