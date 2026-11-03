# Generic CRM adapter - not deployed

See ../../BACKEND.md for contract, limitations and release gates. Configure a
Cloudflare `LEAD_RATE_LIMITER` binding, `ALLOWED_ORIGINS`, `CRM_ENDPOINT` and
secret `CRM_API_KEY` only after the selected account/schema are verified.
Tests use a fake upstream; this is not a Twenty CRM integration claim.
