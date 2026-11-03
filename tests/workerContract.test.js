import { describe, it, expect, vi } from 'vitest';
import { createAdapter } from '../workers/crm-adapter/worker';
import { handoffLeadToCrm } from '../src/services/crmHandoff';
const origin = 'https://studio.example';
const lead = { name: 'Test Visitor', phone: '+15550100000', email: 'test@example.com', client: 'Demo Studio', timeline: 'Planning', notes: 'Fake test only', context: { room: 'kitchen', style: 'Japandi', budget: '$50,000' } };
const envelope = { source: 'omnistu-engine', type: 'consultation_enquiry', lead };
const makeRequest = (body = envelope, extra = {}) => new Request('https://adapter.example/', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body), ...extra });
const setup = () => {
 const upstream = vi.fn().mockResolvedValue(Response.json({ ok: true }));
 const adapter = createAdapter({ fetchImpl: upstream });
 const env = { ALLOWED_ORIGINS: origin, CRM_ENDPOINT: 'https://crm.example/hook', CRM_API_KEY: 'test-only-not-a-secret', LEAD_RATE_LIMITER: { limit: vi.fn().mockResolvedValue({ success: true }) } };
 return { upstream, adapter, env };
};
describe('frontend to generic worker contract (mock upstream, not real CRM)', () => {
 it('roundtrips the real frontend envelope and preserves qualified context', async () => {
  const { upstream, adapter, env } = setup();
  const state = await handoffLeadToCrm({ endpoint: 'https://adapter.example/', lead, fetchImpl: (url, init) => adapter.fetch(new Request(url, { ...init, headers: { ...init.headers, Origin: origin } }), env) });
  expect(state).toBe('synced');
  expect(JSON.parse(upstream.mock.calls[0][1].body).lead.context).toEqual(lead.context);
  expect(upstream.mock.calls[0][1].redirect).toBe('error');
 });
 it('answers browser preflight only for configured origins', async () => {
  const { adapter, env, upstream } = setup();
  const res = await adapter.fetch(makeRequest(null, { method: 'OPTIONS', body: undefined }), env);
  expect(res.status).toBe(204); expect(res.headers.get('Access-Control-Allow-Origin')).toBe(origin);
  expect((await adapter.fetch(makeRequest(envelope, { headers: { Origin: 'https://untrusted.example' } }), env)).status).toBe(403);
  expect(upstream).not.toHaveBeenCalled();
 });
 it.each([['missing config', 503], ['rate limited', 429], ['bad shape', 422], ['oversize', 413], ['upstream rejected', 502], ['upstream unavailable', 502], ['upstream negative body', 502]])('%s fails without claiming sync', async (kind, code) => {
  const { adapter, env, upstream } = setup(); let body = envelope;
  if (kind === 'missing config') delete env.LEAD_RATE_LIMITER;
  if (kind === 'rate limited') env.LEAD_RATE_LIMITER.limit.mockResolvedValue({ success: false });
  if (kind === 'bad shape') body = { lead: {} };
  if (kind === 'oversize') body = { ...envelope, padding: 'a'.repeat(17000) };
  if (kind === 'upstream rejected') upstream.mockResolvedValue(new Response('', { status: 500 }));
  if (kind === 'upstream unavailable') upstream.mockRejectedValue(new Error('offline'));
  if (kind === 'upstream negative body') upstream.mockResolvedValue(Response.json({ success: false }));
  const res = await adapter.fetch(makeRequest(body), env); expect(res.status).toBe(code);
  expect((await res.json()).ok).toBe(false);
 });
 it('does not call a negative JSON acceptance response synced', async () => {
  expect(await handoffLeadToCrm({ endpoint: 'https://adapter.example/', lead, fetchImpl: async () => Response.json({ ok: false }) })).toBe('failed');
 });
});
