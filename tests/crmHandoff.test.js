import { describe, it, expect, vi } from 'vitest';
import { handoffLeadToCrm } from '../src/services/crmHandoff';

const lead = { name: 'Test Person', phone: '123', client: 'Demo Studio' };

describe('handoffLeadToCrm', () => {
  it('skips without posting when no endpoint is configured', async () => {
    const fetchImpl = vi.fn();
    expect(await handoffLeadToCrm({ endpoint: '', lead, fetchImpl })).toBe('skipped');
    expect(await handoffLeadToCrm({ endpoint: undefined, lead, fetchImpl })).toBe('skipped');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('reports synced when the endpoint accepts the handoff', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });
    expect(await handoffLeadToCrm({ endpoint: 'https://crm.example/hook', lead, fetchImpl })).toBe('synced');
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(body.type).toBe('consultation_enquiry');
    expect(body.lead.name).toBe('Test Person');
  });

  it('reports failed on non-ok response and on network errors', async () => {
    const notOk = vi.fn().mockResolvedValue({ ok: false });
    expect(await handoffLeadToCrm({ endpoint: 'https://crm.example/hook', lead, fetchImpl: notOk })).toBe('failed');
    const boom = vi.fn().mockRejectedValue(new Error('network down'));
    expect(await handoffLeadToCrm({ endpoint: 'https://crm.example/hook', lead, fetchImpl: boom })).toBe('unknown');
  });
});
