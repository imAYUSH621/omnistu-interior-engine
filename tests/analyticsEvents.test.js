import { describe, it, expect, vi } from 'vitest';
import { trackEvent } from '../src/services/analyticsEvents';

describe('trackEvent (consent-gated, non-personal)', () => {
  it('does nothing when no analyticsEndpoint is configured', () => {
    const fetchImpl = vi.fn();
    expect(trackEvent({ id: 'demo' }, 'enquiry_submitted', fetchImpl)).toBe('skipped');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('ignores unknown event names', () => {
    const fetchImpl = vi.fn();
    expect(trackEvent({ id: 'demo', analyticsEndpoint: 'https://a.example/collect' }, 'page_view', fetchImpl)).toBe('skipped');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('posts a non-personal payload when configured', () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });
    expect(trackEvent({ id: 'demo', analyticsEndpoint: 'https://a.example/collect' }, 'enquiry_submitted', fetchImpl)).toBe('sent');
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
    const fetchImpl = vi.fn().mockRejectedValue(new Error('down'));
    expect(() => trackEvent({ id: 'demo', analyticsEndpoint: 'https://a.example/collect' }, 'booking_clicked', fetchImpl)).not.toThrow();
  });
});
