import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeadModal } from '../src/components/LeadModal';
import { DEFAULT_CLIENT } from '../src/data/clients';

const liveClient = { ...DEFAULT_CLIENT, web3formsKey: '', isSample: false, whatsapp: '919999999999', phone: '+91 99999 99999' };

function fillForm() {
  fireEvent.change(screen.getByPlaceholderText(/Katherine Vance/i), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByPlaceholderText(/\+1 \(555\) 019-2834/i), { target: { value: '+15551234567' } });
  fireEvent.change(screen.getByPlaceholderText(/katherine@vance.com/i), { target: { value: 'jane@example.com' } });
}

function giveDemoConsent() {
  fireEvent.click(screen.getByText(/the details I entered are fake\/sample/i));
}

function submit() {
  fireEvent.click(screen.getByText(/Request My Free Consultation/i));
}

function setSearch(search) {
  window.history.pushState({}, '', `/${search}`);
}

describe('Link-configured demo endpoints', () => {
  beforeEach(() => { localStorage.clear(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); setSearch(''); });

  it('delivers in explicit demo mode, with warning, host disclosure and required consent', async () => {
    setSearch('?leadEndpoint=https://sink.example/hook&demoMode=endpoints');
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{}} />);

    // Prominent fake-data warning naming the destination host
    expect(screen.getByText(/enter fake\/sample details only/i)).toBeDefined();
    expect(screen.getAllByText(/sink\.example/i).length).toBeGreaterThan(0);
    // The studio privacy promise is replaced by honest demo-delivery copy
    expect(screen.queryByText(/Zero-Spam Privacy Invariant/i)).toBeNull();
    expect(screen.getByText(/not the studio's private inbox/i)).toBeDefined();

    // Submit stays blocked until explicit consent
    fillForm();
    submit();
    expect(global.fetch).not.toHaveBeenCalledWith('https://sink.example/hook', expect.anything());

    giveDemoConsent();
    submit();
    expect(await screen.findByText(/Request Accepted by Delivery Service/i)).toBeDefined();
    expect(screen.getByText(/test sink from the shared link, not the studio's CRM/i)).toBeDefined();
    expect(global.fetch).toHaveBeenCalledWith('https://sink.example/hook', expect.objectContaining({ method: 'POST' }));
  });

  it('uses the link-configured CRM webhook for the handoff in demo mode', async () => {
    setSearch('?leadEndpoint=https://sink.example/hook&crmWebhook=https://crm.example/hook&demoMode=endpoints');
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{}} />);
    fillForm();
    giveDemoConsent();
    submit();
    expect(await screen.findByText(/Handoff: accepted by the demo test endpoint \(not a CRM\)/i)).toBeDefined();
    const urls = global.fetch.mock.calls.map(c => c[0]);
    expect(urls).toContain('https://sink.example/hook');
    expect(urls).toContain('https://crm.example/hook');
  });

  it('gates a CRM-only link override even when trusted email delivery is configured', async () => {
    setSearch('?crmWebhook=https://other-crm.example/hook&demoMode=endpoints');
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    render(<LeadModal isOpen={true} onClose={() => {}} client={{ ...liveClient, web3formsKey: 'test-key' }} contextData={{}} />);
    fillForm(); submit();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.getAllByText(/other-crm.example/).length).toBeGreaterThan(0);
    giveDemoConsent(); submit();
    expect(await screen.findByText(/Request Accepted by Delivery Service/i)).toBeDefined();
    expect(global.fetch).toHaveBeenCalledWith('https://other-crm.example/hook', expect.anything());
  });

  it('ignores link-supplied endpoints without explicit demo mode: nothing is sent to them', async () => {
    setSearch('?leadEndpoint=https://sink.example/hook&crmWebhook=https://crm.example/hook');
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{}} />);

    expect(screen.queryByText(/Demo delivery active/i)).toBeNull();
    fillForm();
    submit();
    expect(await screen.findByText(/Demo Mode - Not Sent/i)).toBeDefined();
    const urls = global.fetch.mock.calls.map(c => c[0]);
    expect(urls).not.toContain('https://sink.example/hook');
    expect(urls).not.toContain('https://crm.example/hook');
  });

  it('stays in demo mode with no configured endpoint and names no destination', async () => {
    render(<LeadModal isOpen={true} onClose={() => {}} client={liveClient} contextData={{}} />);
    expect(screen.queryByText(/Demo delivery active/i)).toBeNull();
    fillForm();
    submit();
    expect(await screen.findByText(/Demo Mode - Not Sent/i)).toBeDefined();
  });
});
