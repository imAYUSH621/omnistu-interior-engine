# Generic request-driven adapter - not deployed

The static demo has no deployed Omnistu backend. The master demo's email
connector is already configured; named sample studios remain disconnected.
The worker is NOT a verified integration to Twenty or the owner's '20CRM'.

## Contract now tested

`handoffLeadToCrm` sends:

```json
{
  "source": "omnistu-engine",
  "type": "consultation_enquiry",
  "lead": {
    "name": "Test Visitor", "phone": "+15550100000",
    "email": "test@example.com", "client": "Sample Studio",
    "timeline": "Planning", "notes": "Fake test only",
    "context": {"room": "kitchen", "style": "Japandi", "budget": "$50,000"}
  }
}
```

The adapter validates this envelope, strips unknown fields, preserves qualified
context, and forwards the same generic envelope. Real CRM field mapping and
auth cannot be selected until its endpoint/schema are verified. A generic HTTP
2xx means accepted handoff, NOT proof that the actual CRM record was created.
Tests use mocked network responses; no real CRM test has passed.

## Safety boundaries

- Explicit `ALLOWED_ORIGINS` for browser preflight/POST, no wildcard CORS.
  Origin checks are not authentication and can be forged outside browsers.
- JSON only, 16 KiB streamed-body limit, field-length checks, honeypot check.
- Requires `LEAD_RATE_LIMITER` binding; fails closed if missing/unavailable.
  Cloudflare's limiter is approximate and location-local, NOT a strict global
  quota. IP-based public-form limits may affect shared networks. Tune and add
  abuse controls for the actual client before release.
- HTTPS destination and server-held `CRM_API_KEY`; rejects redirects, applies
  an 8-second upstream timeout, handles negative acceptance and network errors.
- No lead persistence in the worker, no sensitive body logging. The frontend
  demo DOES retain leads in browser localStorage; it is not an authenticated
  shared owner inbox. Production storage/retention is an open release gate.
- No automatic retries or exactly-once guarantee. Real CRM activation needs
  verified duplicate prevention and reconciliation for accepted-but-lost replies.

## Activation gates

1. Existing Cloudflare account access, current plan/terms/limits confirmed.
2. Exact CRM repo/deployment and owner-authorized API access/schema.
3. Configure origins, upstream, secret and rate-limit binding on that account.
4. Review client privacy/retention/abuse/duplicate policies.
5. Deploy, test from the intended host with fake data, inspect the real CRM
   record and preserved context, then test rejection/timeouts separately.
6. Enable only the approved client configuration. No browser URLs with secrets.

The old flat `name/contact/clientId` worker shape did not match the frontend;
`tests/workerContract.test.js` now exercises the actual frontend-to-worker path.

Official binding contract and limits:
https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
