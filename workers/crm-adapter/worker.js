// Omnistu CRM handoff worker - SKELETON, not deployed.
// Request-driven lead forwarding: validate, rate-limit, forward, forget.
// Secrets (CRM_API_KEY) live as Worker secrets, never in this file.

const RATE_LIMIT_PER_MINUTE = 5;
const hits = new Map(); // per-isolate best effort; upgrade to KV if needed

function rateLimited(ip) {
  const now = Date.now();
  const windowStart = now - 60_000;
  const list = (hits.get(ip) || []).filter((t) => t > windowStart);
  list.push(now);
  hits.set(ip, list);
  return list.length > RATE_LIMIT_PER_MINUTE;
}

function validLead(body) {
  return (
    body &&
    typeof body.name === 'string' && body.name.length >= 2 && body.name.length <= 120 &&
    typeof body.contact === 'string' && body.contact.length >= 5 && body.contact.length <= 120 &&
    typeof body.clientId === 'string' && body.clientId.length <= 80 &&
    (!body.website || body.website === '') // honeypot: bots fill hidden fields
  );
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('method not allowed', { status: 405 });
    }
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (rateLimited(ip)) {
      return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    }
    if (!validLead(body)) {
      return Response.json({ ok: false, error: 'invalid_lead' }, { status: 422 });
    }
    // Forward to the CRM with the secret-held key. Endpoint and schema are
    // placeholders until the actual CRM is identified and tested.
    const upstream = await fetch(env.CRM_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${env.CRM_API_KEY}`,
      },
      body: JSON.stringify({
        name: body.name,
        contact: body.contact,
        message: body.message || '',
        source: `omnistu:${body.clientId}`,
      }),
    });
    if (!upstream.ok) {
      return Response.json({ ok: false, error: 'crm_rejected' }, { status: 502 });
    }
    return Response.json({ ok: true });
  },
};
