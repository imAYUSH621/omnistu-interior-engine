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

describe('Lead delivery honesty', () => {
  beforeEach(() => { localStorage.clear(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  it('claims receipt only when the endpoint confirms delivery', async () => {
    vi.stubEnv('VITE_LEAD_ENDPOINT', 'https://example.com/hook');
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{ room: 'Living Pavilion' }} />);
    fillAndSubmit();

    expect(await screen.findByText(/Request Received!/i)).toBeDefined();
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
    expect(screen.queryByText(/Request Received!/i)).toBeNull();
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
