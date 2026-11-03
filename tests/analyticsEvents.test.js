import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackEvent, getAnalyticsConsent, setAnalyticsConsent } from '../src/services/analyticsEvents';

const configured = { id: 'demo', analyticsEndpoint: 'https://a.example/collect' };

describe('trackEvent (consent-gated, non-personal)', () => {
  beforeEach(() => { localStorage.clear(); });

  it('does nothing when no analyticsEndpoint is configured', () => {
    const fetchImpl = vi.fn();
    expect(trackEvent({ id: 'demo' }, 'enquiry_submitted', fetchImpl)).toBe('skipped');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('ignores unknown event names', () => {
    setAnalyticsConsent(configured, true);
    const fetchImpl = vi.fn();
    expect(trackEvent(configured, 'page_view', fetchImpl)).toBe('skipped');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('fires nothing before the visitor explicitly consents', () => {
    const fetchImpl = vi.fn();
    expect(getAnalyticsConsent(configured)).toBe(null);
    expect(trackEvent(configured, 'enquiry_submitted', fetchImpl)).toBe('skipped');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('fires nothing after the visitor declines', () => {
    setAnalyticsConsent(configured, false);
    const fetchImpl = vi.fn();
    expect(trackEvent(configured, 'enquiry_submitted', fetchImpl)).toBe('skipped');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('posts a non-personal payload only after explicit consent', () => {
    setAnalyticsConsent(configured, true);
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });
    expect(trackEvent(configured, 'enquiry_submitted', fetchImpl)).toBe('sent');
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(body.event).toBe('enquiry_submitted');
    expect(body.clientId).toBe('demo');
    // No personal/contact fields ever leave in analytics payloads
    expect(Object.keys(body).sort()).toEqual(['at', 'clientId', 'event']);
    expect(body).not.toHaveProperty('name');
    expect(body).not.toHaveProperty('phone');
    expect(body).not.toHaveProperty('email');
  });

  it('never throws into the user flow', () => {
    setAnalyticsConsent(configured, true);
    const fetchImpl = vi.fn().mockRejectedValue(new Error('down'));
    expect(() => trackEvent(configured, 'booking_clicked', fetchImpl)).not.toThrow();
  });

  it('scopes consent per client id', () => {
    setAnalyticsConsent({ id: 'a' }, true);
    expect(getAnalyticsConsent({ id: 'a' })).toBe(true);
    expect(getAnalyticsConsent({ id: 'b' })).toBe(null);
  });
});
