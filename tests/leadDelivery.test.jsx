import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LeadModal } from '../src/components/LeadModal';
import { DEFAULT_CLIENT } from '../src/data/clients';

const liveClient = { ...DEFAULT_CLIENT, isSample: false, whatsapp: '919999999999', phone: '+91 99999 99999' };

function fillAndSubmit() {
  fireEvent.change(screen.getByPlaceholderText(/Katherine Vance/i), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByPlaceholderText(/\+1 \(555\) 019-2834/i), { target: { value: '+15551234567' } });
  fireEvent.change(screen.getByPlaceholderText(/katherine@vance.com/i), { target: { value: 'jane@example.com' } });
  fireEvent.click(screen.getByText(/Request My Free Consultation/i));
}

describe('Lead delivery honesty', () => {
  beforeEach(() => { localStorage.clear(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  it('claims receipt only when the endpoint confirms delivery', async () => {
    vi.stubEnv('VITE_LEAD_ENDPOINT', 'https://example.com/hook');
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{ room: 'Living Pavilion' }} />);
    fillAndSubmit();

    expect(await screen.findByText(/Request Accepted by Delivery Service/i)).toBeDefined();
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/hook', expect.objectContaining({ method: 'POST' }));
    expect(screen.getByText(/Chat Instantly on WhatsApp/i)).toBeDefined();
  });

  it('shows a delivery failure when the endpoint answers ok but success:false', async () => {
    vi.stubEnv('VITE_LEAD_ENDPOINT', 'https://example.com/hook');
    const body = { ok: true, clone() { return { json: async () => ({ success: false }) }; } };
    global.fetch = vi.fn().mockResolvedValue(body);

    render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{}} />);
    fillAndSubmit();

    expect(await screen.findByText(/Sending Failed/i)).toBeDefined();
    expect(screen.queryByText(/Request Accepted by Delivery Service/i)).toBeNull();
  });

  it('shows a booking link only when VITE_BOOKING_URL is configured', async () => {
    vi.stubEnv('VITE_BOOKING_URL', 'https://cal.example.com/omnistu');
    const { unmount } = render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{}} />);
    fillAndSubmit();
    const link = await screen.findByText(/Book a Consultation Slot/i);
    expect(link.closest('a').href).toBe('https://cal.example.com/omnistu');
    unmount();

    render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{}} />);
    expect(screen.queryByText(/Book a Consultation Slot/i)).toBeNull();
  });

  it('shows a delivery failure when the endpoint rejects', async () => {
    vi.stubEnv('VITE_LEAD_ENDPOINT', 'https://example.com/hook');
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'));

    render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{}} />);
    fillAndSubmit();

    expect(await screen.findByText(/Sending Failed/i)).toBeDefined();
  });

  it('shows a delivery failure when the endpoint answers non-OK', async () => {
    vi.stubEnv('VITE_LEAD_ENDPOINT', 'https://example.com/hook');
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{}} />);
    fillAndSubmit();

    expect(await screen.findByText(/Sending Failed/i)).toBeDefined();
  });
});

describe('Native Web3Forms delivery', () => {
  beforeEach(() => { localStorage.clear(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  it('posts to the native Web3Forms API with access_key and claims receipt only on success:true', async () => {
    vi.stubEnv('VITE_WEB3FORMS_KEY', 'w3f-key-123');
    vi.stubEnv('VITE_LEAD_ENDPOINT', 'https://example.com/should-not-be-used');
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });

    render(<LeadModal isOpen={true} onClose={() => {}} client={{ ...liveClient, web3formsKey: '' }} contextData={{ room: 'Living Pavilion' }} />);
    fillAndSubmit();

    expect(await screen.findByText(/Request Accepted by Delivery Service/i)).toBeDefined();
    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toBe('https://api.web3forms.com/submit');
    const body = JSON.parse(opts.body);
    expect(body.access_key).toBe('w3f-key-123');
    expect(body.name).toBe('Jane Doe');
  });

  it('shows Sending Failed when Web3Forms answers ok but success:false', async () => {
    vi.stubEnv('VITE_WEB3FORMS_KEY', 'w3f-key-123');
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false, message: 'Invalid key' }) });

    render(<LeadModal isOpen={true} onClose={() => {}} client={{ ...liveClient, web3formsKey: '' }} contextData={{}} />);
    fillAndSubmit();

    expect(await screen.findByText(/Sending Failed/i)).toBeDefined();
  });

  it('per-client web3formsKey takes precedence and activates delivery without env', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });

    render(<LeadModal isOpen={true} onClose={() => {}} client={{ ...liveClient, web3formsKey: 'client-key-9' }} contextData={{}} />);
    fillAndSubmit();

    expect(await screen.findByText(/Request Accepted by Delivery Service/i)).toBeDefined();
    expect(JSON.parse(global.fetch.mock.calls[0][1].body).access_key).toBe('client-key-9');
  });

  it('shows the native Cal embed only when calLink is configured', async () => {
    window.Cal = vi.fn();
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });

    render(<LeadModal isOpen={true} onClose={() => {}} client={{ ...liveClient, web3formsKey: 'k', calLink: 'studio/demo-call' }} contextData={{}} />);
    fillAndSubmit();

    expect(await screen.findByText(/Request Accepted by Delivery Service/i)).toBeDefined();
    await waitFor(() => {
      expect(window.Cal).toHaveBeenCalledWith('inline', expect.objectContaining({ calLink: 'studio/demo-call' }));
    });
    delete window.Cal;
  });

  it('renders no booking UI when calLink and bookingUrl are both unset', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });

    render(<LeadModal isOpen={true} onClose={() => {}} client={{ ...liveClient, web3formsKey: 'k', calLink: '' }} contextData={{}} />);
    fillAndSubmit();

    expect(await screen.findByText(/Request Accepted by Delivery Service/i)).toBeDefined();
    expect(screen.queryByText(/Book a Consultation Slot/i)).toBeNull();
  });
});
