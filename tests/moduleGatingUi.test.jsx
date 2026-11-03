import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeadModal } from '../src/components/LeadModal';
import { DEFAULT_CLIENT } from '../src/data/clients';

const base = { ...DEFAULT_CLIENT, isSample: false, whatsapp: '919999999999', calLink: 'demo/consult' };

function submitDemo() {
  fireEvent.change(screen.getByPlaceholderText(/Katherine Vance/i), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByPlaceholderText(/\+1 \(555\) 019-2834/i), { target: { value: '+15551234567' } });
  // email is a required field: jsdom constraint validation blocks click-submit without it
  fireEvent.change(screen.getByPlaceholderText(/katherine@vance.com/i), { target: { value: 'jane@example.com' } });
  fireEvent.click(screen.getByText(/Request My Free Consultation/i));
}

describe('Client-dependent module gating in the enquiry flow', () => {
  beforeEach(() => { localStorage.clear(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  it('shows WhatsApp and booking options when modules are on', async () => {
    render(<LeadModal isOpen={true} onClose={() => {}} client={base} contextData={{}} />);
    submitDemo();
    expect(await screen.findByText(/Demo Mode - Not Sent/i)).toBeDefined();
    expect(screen.getByText(/Chat Instantly on WhatsApp/i)).toBeDefined();
  });

  it('hides WhatsApp and booking when the client already runs their own (modules off)', async () => {
    const client = { ...base, modules: { whatsapp: false, booking: false } };
    render(<LeadModal isOpen={true} onClose={() => {}} client={client} contextData={{}} />);
    submitDemo();
    expect(await screen.findByText(/Demo Mode - Not Sent/i)).toBeDefined();
    expect(screen.queryByText(/Chat Instantly on WhatsApp/i)).toBeNull();
  });

  it('reports CRM handoff as not configured after a confirmed send without an endpoint', async () => {
    vi.stubEnv('VITE_LEAD_ENDPOINT', 'https://example.com/hook');
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<LeadModal isOpen={true} onClose={() => {}} client={base} contextData={{}} />);
    submitDemo();
    expect(await screen.findByText(/Request Received!/i)).toBeDefined();
    expect(await screen.findByText(/CRM handoff: not configured/i)).toBeDefined();
  });

  it('hands off to the configured CRM endpoint only after confirmed acceptance', async () => {
    vi.stubEnv('VITE_LEAD_ENDPOINT', 'https://example.com/hook');
    const client = { ...base, crmWebhookUrl: 'https://crm.example/hook' };
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<LeadModal isOpen={true} onClose={() => {}} client={client} contextData={{}} />);
    submitDemo();
    expect(await screen.findByText(/CRM handoff: accepted by the configured CRM endpoint/i)).toBeDefined();
    const urls = global.fetch.mock.calls.map(c => c[0]);
    expect(urls).toContain('https://crm.example/hook');
  });

  it('keeps CRM failure distinct from inbox delivery', async () => {
    vi.stubEnv('VITE_LEAD_ENDPOINT', 'https://example.com/hook');
    const client = { ...base, crmWebhookUrl: 'https://crm.example/hook' };
    global.fetch = vi.fn().mockImplementation((url) =>
      url === 'https://crm.example/hook' ? Promise.reject(new Error('crm down')) : Promise.resolve({ ok: true })
    );
    render(<LeadModal isOpen={true} onClose={() => {}} client={client} contextData={{}} />);
    submitDemo();
    expect(await screen.findByText(/Request Received!/i)).toBeDefined();
    expect(await screen.findByText(/CRM handoff failed/i)).toBeDefined();
  });
});

describe('Visitor analytics consent notice', () => {
  beforeEach(() => { localStorage.clear(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  it('shows the consent notice when analytics is configured and hides it after a choice', async () => {
    const client = { ...base, analyticsEndpoint: 'https://a.example/collect' };
    render(<LeadModal isOpen={true} onClose={() => {}} client={client} contextData={{}} />);
    expect(screen.getByText(/Allow anonymous usage events/i)).toBeDefined();

    fireEvent.click(screen.getByText(/No thanks/i));
    expect(screen.queryByText(/Allow anonymous usage events/i)).toBeNull();
    expect(localStorage.getItem('omnistu_analytics_consent:omnistu-demo')).toBe('declined');
  });

  it('does not show the notice when analytics is not configured', () => {
    render(<LeadModal isOpen={true} onClose={() => {}} client={base} contextData={{}} />);
    expect(screen.queryByText(/Allow anonymous usage events/i)).toBeNull();
  });
});
