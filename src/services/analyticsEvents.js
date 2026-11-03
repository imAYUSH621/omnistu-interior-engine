// Consent-gated analytics event hooks.
//
// OFF by default: unless the client configuration carries an analyticsEndpoint,
// no event leaves the browser and nothing is tracked. Activation per client
// requires that client's authorization and a consent notice on their site.
//
// VISITOR CONSENT: a configured endpoint is the site owner's choice, not the
// visitor's. No event fires until the visitor explicitly accepts the consent
// notice (stored per client in localStorage). Declining stores that choice
// too and blocks all events.
//
// PRIVACY: payloads are deliberately non-personal - event name, client id and
// timestamp only. Never include form fields, names, phone numbers, emails or
// any visitor contact data here.

const ALLOWED_EVENTS = new Set(['enquiry_submitted', 'booking_clicked', 'whatsapp_clicked']);

const consentKey = (clientId) => `omnistu_analytics_consent:${clientId || 'unknown'}`;

// Returns true (accepted), false (declined) or null (no choice yet).
export function getAnalyticsConsent(client) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const v = window.localStorage.getItem(consentKey(client && client.id));
    return v === 'accepted' ? true : v === 'declined' ? false : null;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(client, accepted) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(consentKey(client && client.id), accepted ? 'accepted' : 'declined');
    }
  } catch {
    // Non-blocking: a blocked storage simply keeps analytics off next visit.
  }
}

export function trackEvent(client, name, fetchImpl) {
  const endpoint = client && client.analyticsEndpoint;
  if (!endpoint || !ALLOWED_EVENTS.has(name)) return 'skipped';
  if (getAnalyticsConsent(client) !== true) return 'skipped';
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
