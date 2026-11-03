# Embedding the Omnistu AI concept widget into an existing website

For clients who already have a website: the engine renders a compact
widget-only view (AI design concept studio + lead capture) that can be
iframed into any page. No redesign or replacement of the client's site is
needed.

## 1. Embed snippet

```html
<iframe
  id="omnistu-embed"
  src="https://id.omnistu.com/?view=embed&client=CLIENT_SLUG"
  style="width:100%;border:0;min-height:900px"
  loading="lazy"
  title="AI design concept studio"
></iframe>
<script>
  // Optional: auto-resize the iframe to the widget's content height
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'omnistu-embed-height') {
      const f = document.getElementById('omnistu-embed');
      if (f) f.style.height = e.data.height + 'px';
    }
  });
</script>
```

Replace `CLIENT_SLUG` with the client's profile slug, or append
`&name=Studio+Name&city=City` for an unconfigured brand preview.

## 2. What runs inside the embed

- The AI concept studio (`?view=embed` renders only this section plus the
  lead modal - no navbar, hero, portfolio or footer).
- Lead capture posts to `VITE_LEAD_ENDPOINT` when configured at build time;
  otherwise it shows the explicit "Demo Mode - Not Sent" state. Nothing is
  silently sent anywhere.
- The direct WhatsApp and booking buttons appear only when
  `VITE_DEMO_WHATSAPP` / `VITE_BOOKING_URL` (or the client profile's
  `whatsapp` / `calLink`) are configured.

## 3. Per-client module switches and integrations

Each client profile in `src/data/clients.js` can carry:

- `modules`: `{ aiStudio, estimator, portfolio, whatsapp, booking }` - set
  any flag to `false` to hide that module for clients who already run their
  own equivalent. Unset flags default to on.
- `crmWebhookUrl`: optional generic webhook that receives a lead JSON POST
  after the primary delivery channel confirms acceptance. This is an
  unverified connector: it is not proven against any specific CRM (e.g.
  Twenty) until the actual endpoint, schema and auth are tested. CRM auth
  secrets must never live in this frontend config or any `VITE_*` variable;
  a CRM that needs an API key belongs behind a small server-side adapter
  that holds the secret. The UI reports the handoff as its own state
  (accepted / failed / not configured), distinct from inbox delivery.
- `analyticsEndpoint`: optional consent-aware event collector. When set, the
  visitor sees an explicit consent notice; only after they accept does the
  app POST coarse events (`enquiry_submitted`, `booking_clicked`,
  `whatsapp_clicked`) containing only `{ event, clientId, at }` - never
  names, phone numbers, emails or other personal payload. Declining stores
  that choice and blocks all events; an explicit Withdraw button turns them
  back off at any time. A configured endpoint alone (the site owner's
  choice) never fires anything.

## 4. Link-configured live demo (no rebuild)

Append `?leadEndpoint=URL` (and optionally `&crmWebhook=URL`) to any engine
link to point the enquiry form and CRM handoff at a real endpoint for a
demo - e.g. a free webhook sink - without rebuilding. The destination host
is shown to the visitor in the form. No secrets belong in these URLs: use
them only with endpoints that accept unauthenticated POSTs, and only with
demo data until the client's real data handling is approved.

## 5. Honesty notes

- Visitor photos stay on the page and are never sent or analyzed; the AI
  concept is generated from style choices only (free Pollinations tier).
- The embed is a style-concept tool, not a photo-realistic preview of the
  visitor's actual room; the UI says so.
