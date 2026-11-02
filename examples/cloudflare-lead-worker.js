// Cloudflare Worker: lead relay for the Omnistu interior engine demo.
// Receives the lead form's JSON POST and forwards it to a webhook you own
// (e.g. an n8n/Slack/Discord incoming webhook). Deploy on your own
// Cloudflare account (Workers free plan) once access is confirmed, then set
// VITE_LEAD_ENDPOINT to the worker's URL at build time.
//
// Required secret:  LEAD_WEBHOOK_URL  (the destination webhook)
//   wrangler secret put LEAD_WEBHOOK_URL
//
// NOTE: untested against a live account until Cloudflare access is granted;
// treat as a starting point, not a proven component.

const ALLOWED_ORIGIN = '*'; // tighten to https://id.omnistu.com after deploy

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== 'POST') {
      return json({ success: false, error: 'method_not_allowed' }, 405);
    }

    let lead;
    try {
      lead = await request.json();
    } catch {
      return json({ success: false, error: 'invalid_json' }, 400);
    }
    if (!lead || typeof lead.name !== 'string' || typeof lead.phone !== 'string') {
      return json({ success: false, error: 'missing_fields' }, 400);
    }

    const res = await fetch(env.LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `New interior-engine lead: ${lead.name} (${lead.phone}, ${lead.email || 'no email'}) - ${lead.client || 'unknown client'} - timeline: ${lead.timeline || 'n/a'}`,
        lead
      })
    });

    return json({ success: res.ok }, res.ok ? 200 : 502);
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept'
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() }
  });
}
