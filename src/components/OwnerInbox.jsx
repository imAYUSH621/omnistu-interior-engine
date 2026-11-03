import React, { useEffect, useState } from 'react';
import { X, Inbox, User, Phone, Mail, Clock, Tag } from 'lucide-react';

// Studio owner view: renders the enquiries captured in THIS demo session so a
// prospect sees exactly what lands on their desk. Reads the browser-local demo
// lead store written by the enquiry form. Honest boundary: in the demo these
// stay in this browser (or go to a visible link-configured demo destination);
// live delivery to the owner's email/CRM is set up and verified per client.
function readDemoLeads() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const leads = JSON.parse(localStorage.getItem('omnistu_leads') || '[]');
      return Array.isArray(leads) ? leads : [];
    }
  } catch { /* corrupted store -> empty */ }
  return [];
}

export function OwnerInbox({ isOpen, onClose, client }) {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    if (isOpen) setLeads(readDemoLeads().filter(lead => lead.client === client.name));
  }, [isOpen, client.name]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          aria-label="Close owner view"
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-brand-300 text-[11px] font-mono uppercase tracking-widest">
          <Inbox className="w-4 h-4" />
          <span>Studio owner view</span>
        </div>
        <h3 className="mt-2 text-2xl font-bold font-display text-white tracking-tight">
          What lands on your desk
        </h3>
        <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
          Every enquiry from this demo session, structured the way {client.name} would receive it:
          contact details, timeline and project context together - not a bare "please call me".
        </p>

        {leads.length === 0 ? (
          <div className="mt-6 p-6 rounded-xl bg-zinc-900/70 border border-dashed border-zinc-700 text-center">
            <p className="text-sm text-zinc-300">No enquiries yet in this session.</p>
            <p className="mt-1 text-xs text-zinc-500">
              Close this panel, submit the enquiry form as a test visitor (fake details are fine in the demo),
              then reopen - it appears here exactly as the studio would receive it.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {leads.map((lead, i) => (
              <div key={i} className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-white font-semibold">
                    <User className="w-3.5 h-3.5 text-brand-400" />
                    <span>{lead.name}</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {lead.timestamp ? new Date(lead.timestamp).toLocaleString() : ''}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-zinc-400">
                  {lead.phone && <span className="flex items-center space-x-1.5"><Phone className="w-3 h-3 text-zinc-500" /><span>{lead.phone}</span></span>}
                  {lead.email && <span className="flex items-center space-x-1.5"><Mail className="w-3 h-3 text-zinc-500" /><span>{lead.email}</span></span>}
                  {lead.timeline && <span className="flex items-center space-x-1.5"><Clock className="w-3 h-3 text-zinc-500" /><span>{lead.timeline}</span></span>}
                  {(lead.context?.room || lead.context?.style || lead.context?.budget || lead.context?.intent) && (
                    <span className="flex items-center space-x-1.5">
                      <Tag className="w-3 h-3 text-zinc-500" />
                      <span>{[lead.context.room, lead.context.style, lead.context.budget, lead.context.intent].filter(Boolean).map(v => String(v).replace(/_/g, ' ')).join(' • ')}</span>
                    </span>
                  )}
                </div>
                {lead.notes && <p className="mt-2 text-zinc-500 italic">"{lead.notes}"</p>}
              </div>
            ))}
          </div>
        )}

        <p className="mt-5 text-[11px] font-mono text-zinc-500 leading-relaxed border-t border-zinc-800/80 pt-4">
          Demo boundary: in this demo these enquiries stay in this browser, unless the presenter
          attached a visible demo destination - then they go there, clearly labeled. In a live
          setup every enquiry is delivered to your business email and CRM automatically,
          connected and verified with you at setup.
        </p>
      </div>
    </div>
  );
}
