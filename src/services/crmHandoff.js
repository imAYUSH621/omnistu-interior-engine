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
 *   'failed'  - explicit rejection (still reconcile before retry)
 *   'unknown' - timeout/network/5xx: upstream may have accepted before reply was lost
 */
export async function handoffLeadToCrm({ endpoint, lead, fetchImpl, timeoutMs = 8000 }) {
  if (!endpoint) return 'skipped';
  const doFetch = fetchImpl || (typeof fetch !== 'undefined' ? fetch : null);
  if (!doFetch) return 'failed';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await doFetch(endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        source: 'omnistu-engine',
        type: 'consultation_enquiry',
        receivedAt: new Date().toISOString(),
        lead,
      }),
    });
    if (!res?.ok) return res?.status >= 500 ? 'unknown' : 'failed';
    const result = typeof res.json === 'function' ? await res.json().catch(() => null) : null;
    return result && (result.ok === false || result.success === false) ? 'failed' : 'synced';
  } catch {
    return 'unknown';
  } finally {
    clearTimeout(timer);
  }
}

// No automatic replay: acceptance may have happened before a lost reply.
// Pure advice only: no data persistence, no retry queue, no new network call.
export function handoffRecovery(state) {
  return {
    autoRetry: false,
    next: state === 'unknown' ? 'check_destination_before_retry'
      : state === 'failed' ? 'inspect_rejection_and_destination_before_retry'
      : state === 'synced' ? 'verify_actual_record' : 'configure_if_requested',
    deliveryMustBeRepeated: false,
  };
}
