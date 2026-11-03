import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeadModal } from '../src/components/LeadModal';
import { DEFAULT_CLIENT } from '../src/data/clients';

const liveClient = { ...DEFAULT_CLIENT, isSample: false, whatsapp: '919999999999', phone: '+91 99999 99999' };

function fillAndSubmit() {
  fireEvent.change(screen.getByPlaceholderText(/Katherine Vance/i), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByPlaceholderText(/\+1 \(555\) 019-2834/i), { target: { value: '+15551234567' } });
  fireEvent.change(screen.getByPlaceholderText(/katherine@vance.com/i), { target: { value: 'jane@example.com' } });
  fireEvent.click(screen.getByText(/Request My Free Consultation/i));
}

function setSearch(search) {
  window.history.pushState({}, '', `/${search}`);
}

describe('Link-configured demo endpoints', () => {
  beforeEach(() => { localStorage.clear(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); setSearch(''); });

  it('uses the link-configured lead endpoint and names its host to the visitor', async () => {
    setSearch('?leadEndpoint=https://sink.example/hook');
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{}} />);

    expect(screen.getByText(/enquiries go to sink\.example/i)).toBeDefined();
    fillAndSubmit();
    expect(await screen.findByText(/Request Accepted by Delivery Service/i)).toBeDefined();
    expect(global.fetch).toHaveBeenCalledWith('https://sink.example/hook', expect.objectContaining({ method: 'POST' }));
  });

  it('uses the link-configured CRM webhook for the handoff', async () => {
    setSearch('?leadEndpoint=https://sink.example/hook&crmWebhook=https://crm.example/hook');
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{}} />);
    fillAndSubmit();
    expect(await screen.findByText(/CRM handoff: accepted by the configured CRM endpoint/i)).toBeDefined();
    const urls = global.fetch.mock.calls.map(c => c[0]);
    expect(urls).toContain('https://sink.example/hook');
    expect(urls).toContain('https://crm.example/hook');
  });

  it('stays in demo mode with no configured endpoint and names no destination', async () => {
    render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{}} />);
    expect(screen.queryByText(/Link-configured demo/i)).toBeNull();
    fillAndSubmit();
    expect(await screen.findByText(/Demo Mode - Not Sent/i)).toBeDefined();
  });
});
