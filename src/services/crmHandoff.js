// Generic CRM handoff connector.
//
// STATUS: UNVERIFIED against Twenty ("20CRM") or any specific CRM. It is a
// generic HTTP connector only; compatibility with a real CRM is proven when an
// actual endpoint, payload schema and auth method are demonstrated against it.
//
// SECURITY BOUNDARY: this frontend connector may only POST to a non-secret
// endpoint URL taken from client configuration. API tokens and other secrets
// must NEVER live in client configuration, VITE env vars, or this repository -
// authenticated CRM posting belongs in a future server-side adapter. Enquiries
// are handed off only when the owner has configured a destination; with no
// endpoint configured nothing leaves the browser.

/**
 * Hand a delivered enquiry to the configured CRM endpoint.
 * Distinct from lead delivery: the provider accepting the submission does not
 * imply inbox receipt, and neither implies CRM sync. States:
 *   'skipped' - no endpoint configured (default; nothing posted)
 *   'synced'  - endpoint accepted the handoff (HTTP 2xx)
 *   'failed'  - endpoint unreachable or rejected
 */
export async function handoffLeadToCrm({ endpoint, lead, fetchImpl }) {
  if (!endpoint) return 'skipped';
  const doFetch = fetchImpl || (typeof fetch !== 'undefined' ? fetch : null);
  if (!doFetch) return 'failed';
  try {
    const res = await doFetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        source: 'omnistu-engine',
        type: 'consultation_enquiry',
        receivedAt: new Date().toISOString(),
        lead,
      }),
    });
    return res && res.ok ? 'synced' : 'failed';
  } catch {
    return 'failed';
  }
}
