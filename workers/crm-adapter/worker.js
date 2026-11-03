// Generic adapter, NOT a verified connection to any particular CRM.
// Secrets and destination live in deployment config, never in the browser.
const MAX_BYTES = 16_384;
const isText = (v, max, min = 0) => typeof v === 'string' && v.trim().length >= min && v.length <= max;

export function normalizeLead(body) {
  if (!body || body.source !== 'omnistu-engine' || body.type !== 'consultation_enquiry') return null;
  const lead = body.lead;
  if (!lead || !isText(lead.name, 120, 2) || !isText(lead.phone, 120, 5) ||
      !isText(lead.email, 254, 3) || !isText(lead.client, 160, 1) ||
      (lead.website && lead.website !== '') ||
      (lead.notes != null && !isText(lead.notes, 4000)) ||
      (lead.timeline != null && !isText(lead.timeline, 160))) return null;
  const context = {};
  for (const key of ['room', 'style', 'budget', 'intent']) {
    if (lead.context?.[key] != null) {
      if (!isText(lead.context[key], 500)) return null;
      context[key] = lead.context[key];
    }
  }
  return { name: lead.name.trim(), phone: lead.phone.trim(), email: lead.email.trim(),
    client: lead.client, timeline: lead.timeline || '', notes: lead.notes || '', context };
}

export function createAdapter({ fetchImpl = fetch } = {}) {
  return { async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(x => x.trim()).filter(Boolean);
    const cors = origin && allowed.includes(origin) ? {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      Vary: 'Origin',
    } : {};
    const reply = (status, error) => Response.json(error ? { ok: false, error } : { ok: true },
      { status, headers: { ...cors, 'Cache-Control': 'no-store' } });
    if (!origin || !allowed.includes(origin)) return reply(403, 'origin_not_allowed');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return reply(405, 'method_not_allowed');
    if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return reply(415, 'json_required');
    let endpoint;
    try { endpoint = new URL(env.CRM_ENDPOINT); } catch { return reply(503, 'not_configured'); }
    // A destination/auth/schema must be verified before deployment. No arbitrary
    // browser-supplied destination, redirects or credentials in URLs.
    if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || !env.CRM_API_KEY || !env.LEAD_RATE_LIMITER)
      return reply(503, 'not_configured');
    try {
      const limit = await env.LEAD_RATE_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') || 'unknown' });
      if (!limit.success) return reply(429, 'rate_limited');
    } catch { return reply(503, 'rate_limit_unavailable'); }
    if (Number(request.headers.get('Content-Length')) > MAX_BYTES) return reply(413, 'payload_too_large');
    // Bound streamed bodies too, not just the untrusted Content-Length header.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, 'invalid_json');
    let text = '', size = 0;
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); return reply(413, 'payload_too_large'); }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    let body;
    try { body = JSON.parse(text); } catch { return reply(400, 'invalid_json'); }
    const lead = normalizeLead(body);
    if (!lead) return reply(422, 'invalid_lead');
    try {
      const upstream = await fetchImpl(endpoint.href, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(8000),
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${env.CRM_API_KEY}` },
        // Generic handoff envelope. Map only after the chosen CRM is verified.
        body: JSON.stringify({ source: body.source, type: body.type, lead }),
      });
      if (!upstream.ok) return reply(502, 'crm_rejected');
      const result = await upstream.json().catch(() => null);
      if (result && (result.ok === false || result.success === false)) return reply(502, 'crm_rejected');
      return reply(200);
    } catch { return reply(502, 'crm_unavailable'); }
  }};
}
export default createAdapter();
