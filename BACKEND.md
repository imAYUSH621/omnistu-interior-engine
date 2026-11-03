# Backend plan - request-driven worker (not yet deployed)

Status: **design only - nothing here is deployed or required by the live demo.**
The demo works today without any backend: AI concepts call the free
Pollinations tier from the browser, and enquiry delivery is demo-mode until
client accounts are connected.

## Why a worker at all

Three things a static site cannot do safely:

1. **Hold secrets.** CRM API keys and any keyed provider credentials must
   never ship in the frontend bundle or `VITE_*` variables.
2. **Verify before forwarding.** A server-side hop can validate the lead
   payload (shape, size, honeypot) before it touches the CRM.
3. **Serve id.omnistu.com** as the stable branded host for client links.

## Chosen shape: Cloudflare Workers (request-driven, no idle server)

Grounded on the official pricing page
(https://developers.cloudflare.com/workers/platform/pricing/):

- Free plan: 100,000 requests/day, no duration charge, 10 ms CPU per
  invocation, static assets free and unlimited.
- A lead handoff is one short request: well inside the free tier for any
  realistic client volume.
- No idle cost: a worker that receives zero requests costs zero. This
  matches the requirement that the backend only works "when the request
  is coming".

## What the worker will NOT do

- It does not make a paid provider free. Gemini image generation is
  paid-only (official pricing); proxying it through a worker changes
  nothing about cost.
- It does not proxy share-gated or unverified third-party sites.
- It does not store leads long-term: validate, forward, return status.

## Components (planned)

- `workers/crm-adapter/` - skeleton of the lead handoff worker: validates
  the enquiry JSON, applies rate limiting by IP, then POSTs to the CRM
  endpoint with the API key held as a Worker secret. Unverified against
  any specific CRM until the real endpoint, schema and auth are known.
- Custom domain: id.omnistu.com mapped to the worker/static host once
  Cloudflare account access is available.

## Activation checklist (owner-side)

1. Cloudflare account access (pending - existing account, not a duplicate).
2. CRM identity confirmed (the "20 CRM" reference is unresolved).
3. Business destination email for lead delivery (Web3Forms free key).
4. Only then: deploy worker, set secrets via dashboard/CLI, end-to-end
   test with a fake lead, mark the CRM handoff verified.
