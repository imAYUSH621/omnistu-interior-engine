// Consent-gated analytics event hooks.
//
// OFF by default: unless the client configuration carries an analyticsEndpoint,
// no event leaves the browser and nothing is tracked. Activation per client
// requires that client's authorization and a consent notice on their site.
//
// PRIVACY: payloads are deliberately non-personal - event name, client id and
// timestamp only. Never include form fields, names, phone numbers, emails or
// any visitor contact data here.

const ALLOWED_EVENTS = new Set(['enquiry_submitted', 'booking_clicked', 'whatsapp_clicked']);

export function trackEvent(client, name, fetchImpl) {
  const endpoint = client && client.analyticsEndpoint;
  if (!endpoint || !ALLOWED_EVENTS.has(name)) return 'skipped';
  const doFetch = fetchImpl || (typeof fetch !== 'undefined' ? fetch : null);
  if (!doFetch) return 'skipped';
  try {
    // Fire-and-forget; analytics must never block or fail the user flow.
    doFetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: name,
        clientId: client.id || 'unknown',
        at: new Date().toISOString(),
      }),
    }).catch(() => {});
    return 'sent';
  } catch {
    return 'skipped';
  }
}
